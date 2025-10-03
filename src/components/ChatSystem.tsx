import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { 
  MessageCircle, 
  Send, 
  User, 
  Check, 
  CheckCheck, 
  Phone, 
  Video,
  MoreVertical,
  Search,
  X,
  Smile,
  Paperclip,
  Mic
} from "lucide-react";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  type: string;
}

interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string | null;
  updated_at: string;
  listing?: {
    title: string;
  };
  buyer_profile?: {
    full_name: string;
  };
  seller_profile?: {
    full_name: string;
  };
}

interface ChatDisplay {
  id: string;
  participant_id: string;
  participant_name: string;
  last_message: string;
  last_message_time: Date;
  unread_count: number;
  listing_title?: string;
}

export const ChatSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<ChatDisplay[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatDisplay | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get unread counts and last messages for each conversation
      const chatsWithDetails = await Promise.all(
        (conversations || []).map(async (conv) => {
          const participantId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
          
          // Get participant profile
          const { data: participantProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', participantId)
            .single();

          // Get listing if exists
          let listingTitle;
          if (conv.listing_id) {
            const { data: listing } = await supabase
              .from('market_listings')
              .select('title')
              .eq('id', conv.listing_id)
              .single();
            listingTitle = listing?.title;
          }

          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read', false)
            .neq('sender_id', user.id);

          return {
            id: conv.id,
            participant_id: participantId,
            participant_name: participantProfile?.full_name || 'Unknown User',
            last_message: lastMsg?.content || 'No messages yet',
            last_message_time: lastMsg ? new Date(lastMsg.created_at) : new Date(conv.updated_at),
            unread_count: count || 0,
            listing_title: listingTitle
          };
        })
      );

      setChats(chatsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user?.id || '');
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load conversations on mount
  useEffect(() => {
    if (user && isOpen) {
      fetchConversations();
    }
  }, [user, isOpen]);

  // Handle navigation state to open chat
  useEffect(() => {
    const state = location.state as { openChat?: boolean; conversationId?: string };
    if (state?.openChat) {
      setIsOpen(true);
      if (state.conversationId) {
        const openConversation = async () => {
          await fetchConversations();
          const chat = chats.find(c => c.id === state.conversationId);
          if (chat) {
            handleChatSelect(chat);
          }
        };
        openConversation();
      }
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!user || !isOpen) return;

    const channel = supabase
      .channel('chat-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMsg = payload.new as Message;
          
          // If message is for current conversation, add it
          if (selectedConversationId && newMsg.conversation_id === selectedConversationId) {
            setMessages(prev => [...prev, newMsg]);
            
            // Mark as read if not sent by current user
            if (newMsg.sender_id !== user.id) {
              supabase
                .from('messages')
                .update({ read: true })
                .eq('id', newMsg.id);
            }
          }
          
          // Refresh conversations list
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isOpen, selectedConversationId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversationId,
          sender_id: user.id,
          content: newMessage.trim(),
          type: 'text',
          read: false
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleChatSelect = (chat: ChatDisplay) => {
    setSelectedChat(chat);
    setSelectedConversationId(chat.id);
    fetchMessages(chat.id);
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

  const filteredChats = chats.filter(chat =>
    chat.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.last_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unread_count, 0);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-gradient-primary hover:shadow-glow-primary transition-smooth animate-float group"
        >
          <MessageCircle className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-smooth" />
          {totalUnread > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground min-w-[20px] h-5 flex items-center justify-center text-xs animate-pulse">
              {totalUnread > 99 ? '99+' : totalUnread}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] z-50 animate-bounce-in">
      <Card className="bg-background h-full flex flex-col border-primary/20 shadow-elevated">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-primary">
              <MessageCircle className="w-5 h-5" />
              Messages
              {totalUnread > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {totalUnread}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {!selectedChat && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-8 bg-background/50"
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          {!selectedChat ? (
            // Chat List
            <div className="h-full overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mb-3" />
                  <h3 className="font-medium text-foreground mb-1">No conversations</h3>
                  <p className="text-sm text-muted-foreground">
                    Start selling to connect with buyers
                  </p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-smooth group"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate group-hover:text-primary transition-smooth">
                            {chat.participant_name}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(chat.last_message_time)}
                          </span>
                        </div>
                        {chat.listing_title && (
                          <p className="text-xs text-primary mb-1">
                            Re: {chat.listing_title}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.last_message}
                          </p>
                          {chat.unread_count > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-xs ml-2">
                              {chat.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Chat Messages
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedChat(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ←
                  </Button>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {selectedChat.participant_name}
                    </p>
                    {selectedChat.listing_title && (
                      <p className="text-xs text-muted-foreground">
                        Re: {selectedChat.listing_title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.sender_id === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            isCurrentUser
                              ? 'bg-gradient-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            <span className="text-xs">
                              {new Date(message.created_at).toLocaleTimeString('en-KE', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {isCurrentUser && (
                              message.read ? 
                                <CheckCheck className="w-3 h-3" /> : 
                                <Check className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border/50 bg-background">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 h-8 bg-background/50"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-primary text-primary-foreground hover:shadow-glow-primary"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};