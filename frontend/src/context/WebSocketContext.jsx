import React, { createContext, useContext, useEffect, useState } from 'react';
import websocketService from '../services/websocket';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [socketStatus, setSocketStatus] = useState('DISCONNECTED');
  const [lastComplaintEvent, setLastComplaintEvent] = useState(null);
  const [latestNotification, setLatestNotification] = useState(null);
  const [liveToast, setLiveToast] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect((status) => {
      setSocketStatus(status);
    });

    // Subscribe to global civic complaints stream
    const unsubscribeComplaints = websocketService.subscribeComplaints((event) => {
      setLastComplaintEvent(event);

      // Trigger floating live toast
      if (event?.type === 'COMPLAINT_CREATED') {
        setLiveToast({
          id: Date.now(),
          title: '🚨 New Civic Incident Reported',
          message: `${event.data?.title} (${event.data?.trackingNumber})`,
          category: event.data?.category,
          severity: event.data?.severity,
        });
      } else if (event?.type === 'COMPLAINT_UPDATED') {
        setLiveToast({
          id: Date.now(),
          title: `🔄 Incident ${event.action || 'Updated'}`,
          message: `${event.data?.trackingNumber} status is now ${event.data?.status}`,
          category: event.data?.category,
          severity: event.data?.severity,
        });
      }

      // Auto-clear toast after 5 seconds
      setTimeout(() => {
        setLiveToast((current) => (current && Date.now() - current.id >= 4800 ? null : current));
      }, 5000);
    });

    return () => {
      unsubscribeComplaints();
    };
  }, []);

  // Subscribe to personal notification stream when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const unsubscribeUserNotifs = websocketService.subscribeUserNotifications(user.id, (event) => {
        setLatestNotification(event);
      });
      return () => {
        unsubscribeUserNotifs();
      };
    }
  }, [isAuthenticated, user?.id]);

  const sendPing = (msg) => websocketService.sendPing(msg);

  return (
    <WebSocketContext.Provider
      value={{
        socketStatus,
        lastComplaintEvent,
        latestNotification,
        liveToast,
        dismissToast: () => setLiveToast(null),
        sendPing,
      }}
    >
      {children}

      {/* Floating Real-Time Socket Toast Notification */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-sky-500/30 backdrop-blur-md animate-bounce-short transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                  {liveToast.title}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {liveToast.message}
              </p>
            </div>
            <button
              onClick={() => setLiveToast(null)}
              className="text-slate-400 hover:text-white text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
