
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import websocket from '@/services/websocket';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'auction_ended' | 'new_bid' | 'auction_won';
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationHandler: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    console.log('[NotificationHandler] Setting up notifications for user:', user.id);
    
    const unsubscribe = websocket.onNotification((notification) => {
      console.log('[NotificationHandler] Received notification:', notification);
      
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: notification.type,
        message: notification.message,
        timestamp: notification.timestamp,
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast({
        title: "New Notification",
        description: notification.message,
        duration: 5000,
      });
    });

    return () => {
      console.log('[NotificationHandler] Cleaning up notifications');
      unsubscribe();
    };
  }, [user, toast]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={markAllAsRead}
        className="relative"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
};

export default NotificationHandler;
