import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bell, 
  BellRing, 
  X, 
  MessageCircle, 
  TrendingUp, 
  CloudRain, 
  Package, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

interface Notification {
  id: string;
  type: 'message' | 'price' | 'weather' | 'order' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    onClick: () => void;
  };
}


export const NotificationSystem = ({ userLocation }: { userLocation?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch market insights and add them to notifications
  const fetchMarketInsights = async () => {
    try {
      const location = userLocation || "Eldoret, Kenya";
      const { data, error } = await supabase.functions.invoke('ai-market-insights', {
        body: { location }
      });

      if (error) throw error;

      if (data?.insights && data.insights.length > 0) {
        const marketNotifications: Notification[] = data.insights.map((insight: any, index: number) => ({
          id: `market-${Date.now()}-${index}`,
          type: 'price' as const,
          title: `${insight.crop.charAt(0).toUpperCase() + insight.crop.slice(1)}: ${insight.title}`,
          message: `${insight.message}\n\n💡 ${insight.advice}\n📊 Current: KSh ${insight.currentPrice}/kg (${insight.percentageChange})\n⏰ ${insight.timing}`,
          timestamp: new Date(),
          read: false,
          priority: insight.priority as 'low' | 'medium' | 'high',
          action: {
            label: 'View Prices',
            onClick: () => console.log('View market prices')
          }
        }));

        setNotifications(prev => {
          // Remove old market notifications
          const nonMarket = prev.filter(n => n.type !== 'price');
          return [...marketNotifications, ...nonMarket];
        });
      }
    } catch (error) {
      console.error('Error fetching market insights:', error);
    }
  };

  // Fetch weather alerts and add them to notifications
  const fetchWeatherAlerts = async () => {
    try {
      const location = userLocation || "Eldoret, Kenya";
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: { location }
      });

      if (error) throw error;

      if (data?.alerts && data.alerts.length > 0) {
        const weatherNotifications: Notification[] = data.alerts.map((alert: any, index: number) => ({
          id: `weather-${Date.now()}-${index}`,
          type: 'weather' as const,
          title: alert.type === 'warning' ? 'Weather Warning' : 'Weather Update',
          message: alert.message,
          timestamp: new Date(),
          read: false,
          priority: alert.type === 'warning' ? 'high' as const : 'medium' as const,
          action: {
            label: 'View Forecast',
            onClick: () => console.log('View weather')
          }
        }));

        setNotifications(prev => {
          // Remove old weather notifications
          const nonWeather = prev.filter(n => n.type !== 'weather');
          return [...weatherNotifications, ...nonWeather];
        });
      }
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
    }
  };

  useEffect(() => {
    // Fetch both weather and market insights on mount
    fetchWeatherAlerts();
    fetchMarketInsights();
    
    // Refresh weather alerts every 30 minutes
    const weatherInterval = setInterval(fetchWeatherAlerts, 30 * 60 * 1000);
    
    // Refresh market insights every 2 hours for frequent updates
    const marketInterval = setInterval(fetchMarketInsights, 2 * 60 * 60 * 1000);
    
    return () => {
      clearInterval(weatherInterval);
      clearInterval(marketInterval);
    };
  }, [userLocation]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-4 h-4" />;
      case 'price': return <TrendingUp className="w-4 h-4" />;
      case 'weather': return <CloudRain className="w-4 h-4" />;
      case 'order': return <Package className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-destructive';
    if (priority === 'medium') return 'text-warning';
    
    switch (type) {
      case 'message': return 'text-primary';
      case 'price': return 'text-success';
      case 'weather': return 'text-blue-600';
      case 'order': return 'text-orange-600';
      case 'payment': return 'text-green-600';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="relative p-3 rounded-full glass-nav hover:bg-primary/10 transition-smooth group"
        >
          {unreadCount > 0 ? (
            <BellRing className="w-6 h-6 text-primary group-hover:scale-110 transition-smooth animate-pulse" />
          ) : (
            <Bell className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-smooth" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground min-w-[20px] h-5 flex items-center justify-center text-xs animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6 w-96 max-h-[80vh] z-50 animate-bounce-in">
      <Card className="glass-card border-primary/20 shadow-elevated">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-card">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:bg-primary/10"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mb-3" />
                <h3 className="font-medium text-foreground mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  No new notifications
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gradient-card transition-smooth group ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getNotificationColor(notification.type, notification.priority)} bg-current/10`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {notification.priority !== 'low' && (
                              <Badge className={`text-xs ${getPriorityBadge(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                            )}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(notification.timestamp)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                            {notification.action && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action!.onClick();
                                }}
                                className="text-xs text-primary hover:bg-primary/10"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-xs text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border/50 bg-gradient-card text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() => {
                  // Clear all notifications
                  setNotifications([]);
                }}
              >
                Clear all notifications
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};