import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Ensure global is defined for browser compatibility
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscribers = {
      complaints: new Set(),
      notifications: new Map(), // userId -> Set of callbacks
      system: new Set(),
    };
    this.statusListeners = new Set();
  }

  notifyStatus(status) {
    this.statusListeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.error('Error in socket status listener:', err);
      }
    });
  }

  connect(onStatusChange) {
    try {
      if (onStatusChange) {
        this.statusListeners.add(onStatusChange);
      }

      if (this.client && this.connected) {
        if (onStatusChange) onStatusChange('CONNECTED');
        return;
      }

      this.notifyStatus('CONNECTING');

      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const httpProtocol = isHttps ? 'https:' : 'http:';
      const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';

      const rawWsUrl = `${wsProtocol}//${host}:8080/ws-raw`;
      const sockJsUrl = `${httpProtocol}//${host}:8080/ws`;

      this.client = new Client({
        brokerURL: rawWsUrl,
        webSocketFactory: () => {
          try {
            return new WebSocket(rawWsUrl);
          } catch (e) {
            return new SockJS(sockJsUrl);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: () => {},
        onConnect: () => {
          this.connected = true;
          this.notifyStatus('CONNECTED');
          this._resubscribeAll();
        },
        onDisconnect: () => {
          this.connected = false;
          this.notifyStatus('DISCONNECTED');
        },
        onStompError: (frame) => {
          console.warn('STOMP broker reported error: ' + frame?.headers?.['message']);
          this.connected = false;
          this.notifyStatus('DISCONNECTED');
        },
        onWebSocketClose: () => {
          this.connected = false;
          this.notifyStatus('DISCONNECTED');
        },
      });

      this.client.activate();
    } catch (err) {
      console.warn('Non-fatal WebSocket client activation failure:', err);
      this.connected = false;
      this.notifyStatus('DISCONNECTED');
    }
  }

  _resubscribeAll() {
    if (!this.client || !this.connected) return;

    try {
      // Resubscribe to complaints topic
      if (this.subscribers.complaints.size > 0) {
        this.client.subscribe('/topic/complaints', (message) => {
          try {
            const payload = JSON.parse(message.body);
            this.subscribers.complaints.forEach((cb) => cb(payload));
          } catch (e) {
            console.error('Failed to parse complaint socket message:', e);
          }
        });
      }

      // Resubscribe to user-specific notifications
      this.subscribers.notifications.forEach((callbacks, userId) => {
        if (callbacks.size > 0) {
          this.client.subscribe(`/topic/notifications/${userId}`, (message) => {
            try {
              const payload = JSON.parse(message.body);
              callbacks.forEach((cb) => cb(payload));
            } catch (e) {
              console.error('Failed to parse user notification socket message:', e);
            }
          });
        }
      });

      // Resubscribe to system topic
      if (this.subscribers.system.size > 0) {
        this.client.subscribe('/topic/system', (message) => {
          try {
            const payload = JSON.parse(message.body);
            this.subscribers.system.forEach((cb) => cb(payload));
          } catch (e) {
            console.error('Failed to parse system socket message:', e);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to resubscribe socket channels:', e);
    }
  }

  subscribeComplaints(callback) {
    this.subscribers.complaints.add(callback);

    let stompSub = null;
    if (this.client && this.connected) {
      try {
        stompSub = this.client.subscribe('/topic/complaints', (message) => {
          try {
            const payload = JSON.parse(message.body);
            callback(payload);
          } catch (e) {
            console.error('Failed to parse complaint socket message:', e);
          }
        });
      } catch (e) {
        console.warn('Subscription error on /topic/complaints:', e);
      }
    }

    return () => {
      this.subscribers.complaints.delete(callback);
      if (stompSub) {
        try { stompSub.unsubscribe(); } catch (_) {}
      }
    };
  }

  subscribeUserNotifications(userId, callback) {
    if (!userId) return () => {};

    if (!this.subscribers.notifications.has(userId)) {
      this.subscribers.notifications.set(userId, new Set());
    }
    this.subscribers.notifications.get(userId).add(callback);

    let stompSub = null;
    if (this.client && this.connected) {
      try {
        stompSub = this.client.subscribe(`/topic/notifications/${userId}`, (message) => {
          try {
            const payload = JSON.parse(message.body);
            callback(payload);
          } catch (e) {
            console.error('Failed to parse notification socket message:', e);
          }
        });
      } catch (e) {
        console.warn(`Subscription error on /topic/notifications/${userId}:`, e);
      }
    }

    return () => {
      const set = this.subscribers.notifications.get(userId);
      if (set) {
        set.delete(callback);
      }
      if (stompSub) {
        try { stompSub.unsubscribe(); } catch (_) {}
      }
    };
  }

  subscribeSystem(callback) {
    this.subscribers.system.add(callback);

    let stompSub = null;
    if (this.client && this.connected) {
      try {
        stompSub = this.client.subscribe('/topic/system', (message) => {
          try {
            const payload = JSON.parse(message.body);
            callback(payload);
          } catch (e) {
            console.error('Failed to parse system socket message:', e);
          }
        });
      } catch (e) {
        console.warn('Subscription error on /topic/system:', e);
      }
    }

    return () => {
      this.subscribers.system.delete(callback);
      if (stompSub) {
        try { stompSub.unsubscribe(); } catch (_) {}
      }
    };
  }

  sendPing(text) {
    if (this.client && this.connected) {
      try {
        this.client.publish({
          destination: '/app/ping',
          body: JSON.stringify({ message: text || 'Ping from UrbanFix Web Client' }),
        });
      } catch (e) {
        console.warn('Failed to publish socket ping:', e);
      }
    }
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (_) {}
      this.client = null;
      this.connected = false;
      this.notifyStatus('DISCONNECTED');
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
