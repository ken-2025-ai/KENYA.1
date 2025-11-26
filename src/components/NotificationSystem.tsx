import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  BellRing, 
  X, 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  CloudRain, 
  Package, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  MapPin,
  Sprout,
  Droplets,
  Minus
} from "lucide-react";

interface Notification {
  id: string;
  type: 'message' | 'price' | 'weather' | 'order' | 'payment' | 'system' | 'planting' | 'harvest' | 'irrigation';
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

interface NotificationSystemProps {
  userLocation?: { name: string; lat: number; lng: number } | null;
}

export const NotificationSystem = ({ userLocation }: NotificationSystemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const { location: geoLocation, latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
  const { toast } = useToast();
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [marketPrices, setMarketPrices] = useState<any[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Request push notification permission
  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive"
      });
      return;
    }

    if (Notification.permission === 'granted') {
      setPushPermission('granted');
      await subscribeToPushNotifications();
      return;
    }

    if (Notification.permission === 'denied') {
      toast({
        title: "Notifications Blocked",
        description: "Please enable notifications in your browser settings",
        variant: "destructive"
      });
      return;
    }

    const permission = await Notification.requestPermission();
    setPushPermission(permission);

    if (permission === 'granted') {
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive farming alerts and updates",
      });
      await subscribeToPushNotifications();
    }
  };

  // Subscribe to push notifications
  const subscribeToPushNotifications = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
          // Subscribe to push notifications
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              // VAPID public key - in production, this should come from environment
              'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
            )
          });
          
          console.log('Push subscription created:', subscription);
        }
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Send push notification to user device
  const sendBrowserNotification = async (notification: Notification) => {
    // Check if notifications are supported and permitted
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // Send push notification to service worker (this goes to the device)
        await registration.showNotification(notification.title, {
          body: notification.message,
          icon: '/logo-192.png',
          badge: '/logo-192.png',
          tag: notification.id,
          requireInteraction: notification.priority === 'high',
          silent: false,
          data: {
            url: '/',
            type: notification.type,
            priority: notification.priority,
            timestamp: notification.timestamp,
            notification: notification,
          },
          actions: notification.action ? [
            {
              action: 'view',
              title: 'View Details'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ] : undefined,
        } as NotificationOptions);
        
        // Play notification sound
        playNotificationSound(notification.priority);
        
        console.log('Push notification delivered to device:', notification.title);
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    } else if (Notification.permission === 'default') {
      // Auto-request permission on first notification
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sendBrowserNotification(notification);
      }
    }
  };

  // Play notification sound
  const playNotificationSound = (priority: 'low' | 'medium' | 'high') => {
    try {
      const audio = new Audio();
      // Different sounds for different priorities
      if (priority === 'high') {
        // Create a more urgent beep sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        // Simple beep for lower priority
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  const location = userLocation?.name || geoLocation;
  const lat = userLocation?.lat || latitude;
  const lng = userLocation?.lng || longitude;

  // Fetch market prices for a specific crop
  const fetchMarketPrices = async (crop: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-market-prices', {
        body: { 
          crop,
          city: location
        }
      });

      if (error) throw error;
      
      if (data?.prices) {
        setMarketPrices(data.prices);
        setSelectedCrop(crop);
        setShowPriceModal(true);
      }
    } catch (error) {
      console.error('Error fetching market prices:', error);
      toast({
        title: "Error",
        description: "Could not fetch market prices. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Fetch market insights and add them to notifications
  const fetchMarketInsights = async () => {
    try {
      const loc = location || "Eldoret, Kenya";
      const { data, error } = await supabase.functions.invoke('ai-market-insights', {
        body: { 
          location: loc,
          coordinates: lat && lng ? { lat, lng } : undefined
        }
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
            onClick: () => fetchMarketPrices(insight.crop)
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

  // Fetch farming alerts based on location
  const fetchFarmingAlerts = async () => {
    if (!location || !lat || !lng) return;

    try {
      const { data, error } = await supabase.functions.invoke('farming-alerts', {
        body: { 
          location,
          latitude: lat,
          longitude: lng
        }
      });

      if (error) throw error;

      if (data?.alerts && data.alerts.length > 0) {
        const farmingNotifications: Notification[] = data.alerts.map((alert: any, index: number) => {
          const notif: Notification = {
            id: `farming-${Date.now()}-${index}`,
            type: alert.type as any,
            title: alert.title,
            message: `${alert.message}\n\n⏰ Timing: ${alert.timing}${alert.action ? '\n✅ Action: ' + alert.action : ''}`,
            timestamp: new Date(),
            read: false,
            priority: alert.priority as 'low' | 'medium' | 'high',
          };

          // Send browser notification for high priority alerts
          if (alert.priority === 'high') {
            sendBrowserNotification(notif);
          }

          return notif;
        });

        setNotifications(prev => {
          // Remove old farming alerts of the same type
          const oldAlerts = prev.filter(n => 
            !['planting', 'harvest', 'irrigation', 'weather', 'market'].includes(n.type)
          );
          return [...farmingNotifications, ...oldAlerts];
        });

        // Show toast for critical alerts
        const criticalAlerts = data.alerts.filter((a: any) => a.priority === 'high');
        if (criticalAlerts.length > 0) {
          toast({
            title: "🚨 Critical Farming Alert",
            description: `${criticalAlerts.length} important alert${criticalAlerts.length > 1 ? 's' : ''} for ${location}`,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching farming alerts:', error);
    }
  };

  useEffect(() => {
    // Request notification permission and subscribe to push
    const initNotifications = async () => {
      if ('Notification' in window) {
        setPushPermission(Notification.permission);
        if (Notification.permission === 'default') {
          toast({
            title: "🔔 Enable Location-Based Notifications",
            description: "Get realtime weather, market alerts, and farming tips for your exact location",
            action: (
              <Button size="sm" onClick={requestPushPermission}>
                Enable
              </Button>
            ),
          });
        } else if (Notification.permission === 'granted') {
          await subscribeToPushNotifications();
        }
      }
    };
    initNotifications();
  }, []);

  useEffect(() => {
    if (!location || locationLoading) return;

    console.log('Fetching realtime notifications for:', location);
    
    // Fetch initial data
    fetchFarmingAlerts();
    fetchMarketInsights();

    // Show toast confirmation with location
    toast({
      title: "📍 Location Set",
      description: `Receiving realtime updates for ${location}`,
    });
    
    // More frequent updates for realtime experience
    const farmingInterval = setInterval(fetchFarmingAlerts, 3 * 60 * 1000); // Every 3 mins
    const marketInterval = setInterval(fetchMarketInsights, 5 * 60 * 1000); // Every 5 mins
    
    return () => {
      clearInterval(farmingInterval);
      clearInterval(marketInterval);
    };
  }, [location, lat, lng, locationLoading]);

  // Show location error
  useEffect(() => {
    if (locationError) {
      toast({
        title: "Location Access Required",
        description: "Please enable location access to receive personalized farming alerts",
        variant: "destructive"
      });
    }
  }, [locationError]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-4 h-4" />;
      case 'price': return <TrendingUp className="w-4 h-4" />;
      case 'weather': return <CloudRain className="w-4 h-4" />;
      case 'order': return <Package className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'planting': return <Sprout className="w-4 h-4" />;
      case 'harvest': return <Package className="w-4 h-4" />;
      case 'irrigation': return <Droplets className="w-4 h-4" />;
      case 'market': return <TrendingUp className="w-4 h-4" />;
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

  if (!isOpen) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="relative p-3 rounded-full bg-background border border-border hover:bg-primary/10 transition-smooth group"
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

  if (!isOpen) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="relative p-3 rounded-full bg-background border border-border hover:bg-primary/10 transition-smooth group"
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
      <Card className="bg-background border-primary/20 shadow-elevated">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background">
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
              {location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{location}</span>
                </div>
              )}
              {pushPermission !== 'granted' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={requestPushPermission}
                  className="text-xs text-primary hover:bg-primary/10"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  Enable Push
                </Button>
              )}
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
                    className={`p-4 hover:bg-muted/50 transition-smooth group ${
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
            <div className="p-3 border-t border-border/50 bg-background text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() => {
                  setNotifications([]);
                }}
              >
                Clear all notifications
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Prices Modal */}
      <Dialog open={showPriceModal} onOpenChange={setShowPriceModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Market Prices - {selectedCrop}
            </DialogTitle>
            <DialogDescription>
              {location ? `Current prices in ${location} and surrounding areas` : 'Current market prices across Kenya'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {marketPrices.map((price, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{price.location}</h3>
                      <p className="text-sm text-muted-foreground">{price.market}</p>
                    </div>
                    <Badge className={
                      price.trend === 'up' ? 'bg-success/10 text-success border-success/20' :
                      price.trend === 'down' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      'bg-muted/10 text-muted-foreground border-muted/20'
                    }>
                      {price.trend} {price.change}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        KSh {price.price}/{price.unit}
                      </span>
                      {price.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-success" />
                      ) : price.trend === 'down' ? (
                        <TrendingDown className="w-5 h-5 text-destructive" />
                      ) : (
                        <Minus className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Quality:</span>
                      <Badge variant="outline">{price.quality}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Availability:</span>
                      <span className={
                        price.availability === 'High' ? 'text-success' :
                        price.availability === 'Low' ? 'text-destructive' :
                        'text-warning'
                      }>{price.availability}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {marketPrices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Loading market prices...
            </div>
          )}
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Prices are updated in real-time from markets across Kenya
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
