import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
    if (onStatusChange) {
      this.statusListeners.add(onStatusChange);
    }

    if (this.client && this.connected) {
      if (onStatusChange) onStatusChange('CONNECTED');
      return;
    }

    this.notifyStatus('CONNECTING');

    // In local dev, backend runs on port 8080. In production/Docker Nginx proxies /ws to backend.
    const socketUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

    this.client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.debug('[STOMP]', str);
      },
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
        console.warn('STOMP broker reported error: ' + frame.headers['message']);
        this.connected = false;
        this.notifyStatus('DISCONNECTED');
      },
      onWebSocketClose: () => {
        this.connected = false;
        this.notifyStatus('DISCONNECTED');
      },
    });

    try {
      this.client.activate();
    } catch (err) {
      console.warn('Failed to activate STOMP client:', err);
      this.notifyStatus('DISCONNECTED');
    }
  }

  _resubscribeAll() {
    if (!this.client || !this.connected) return;

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
  }

  subscribeComplaints(callback) {
    this.subscribers.complaints.add(callback);

    let stompSub = null;
    if (this.client && this.connected) {
      stompSub = this.client.subscribe('/topic/complaints', (message) => {
        try {
          const payload = JSON.parse(message.body);
          callback(payload);
        } catch (e) {
          console.error('Failed to parse complaint socket message:', e);
        }
      });
    }

    return () => {
      this.subscribers.complaints.delete(callback);
      if (stompSub) stompSub.unsubscribe();
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
      stompSub = this.client.subscribe(`/topic/notifications/${userId}`, (message) => {
        try {
          const payload = JSON.parse(message.body);
          callback(payload);
        } catch (e) {
          console.error('Failed to parse notification socket message:', e);
        }
      });
    }

    return () => {
      const set = this.subscribers.notifications.get(userId);
      if (set) {
        set.delete(callback);
      }
      if (stompSub) stompSub.unsubscribe();
    };
  }

  subscribeSystem(callback) {
    this.subscribers.system.add(callback);

    let stompSub = null;
    if (this.client && this.connected) {
      stompSub = this.client.subscribe('/topic/system', (message) => {
        try {
          const payload = JSON.parse(message.body);
          callback(payload);
        } catch (e) {
          console.error('Failed to parse system socket message:', e);
        }
      });
    }

    return () => {
      this.subscribers.system.delete(callback);
      if (stompSub) stompSub.unsubscribe();
    };
  }

  sendPing(text) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/ping',
        body: JSON.stringify({ message: text || 'Ping from UrbanFix Web Client' }),
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.notifyStatus('DISCONNECTED');
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
