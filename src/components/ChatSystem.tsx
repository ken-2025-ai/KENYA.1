import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MessageCircle, 
  Send, 
  User, 
  Clock, 
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
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'voice';
}

interface Chat {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_avatar?: string;
  last_message: string;
  last_message_time: Date;
  unread_count: number;
  online: boolean;
  listing_title?: string;
}

// Mock data for demonstration
const mockChats: Chat[] = [
  {
    id: '1',
    participant_id: '123',
    participant_name: 'John Mwangi',
    last_message: 'Is the maize still available?',
    last_message_time: new Date(Date.now() - 5 * 60 * 1000),
    unread_count: 2,
    online: true,
    listing_title: 'Fresh Yellow Maize - 50kg bags'
  },
  {
    id: '2', 
    participant_id: '456',
    participant_name: 'Grace Wanjiku',
    last_message: 'Thank you for the fresh tomatoes!',
    last_message_time: new Date(Date.now() - 30 * 60 * 1000),
    unread_count: 0,
    online: false,
    listing_title: 'Organic Cherry Tomatoes'
  },
  {
    id: '3',
    participant_id: '789', 
    participant_name: 'David Kiprop',
    last_message: 'When can I collect the potatoes?',
    last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread_count: 1,
    online: true,
    listing_title: 'Irish Potatoes - Premium Quality'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender_id: '123',
    sender_name: 'John Mwangi',
    content: 'Hello! I\'m interested in your maize listing.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: true,
    type: 'text'
  },
  {
    id: '2', 
    sender_id: 'current_user',
    sender_name: 'You',
    content: 'Hi John! Yes, the maize is still available. It\'s fresh from this week\'s harvest.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: true,
    type: 'text'
  },
  {
    id: '3',
    sender_id: '123', 
    sender_name: 'John Mwangi',
    content: 'Great! What\'s your best price for 10 bags?',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    read: true,
    type: 'text'
  },
  {
    id: '4',
    sender_id: '123',
    sender_name: 'John Mwangi', 
    content: 'Is the maize still available?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    type: 'text'
  }
];

export const ChatSystem = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      sender_id: 'current_user',
      sender_name: 'You',
      content: newMessage,
      timestamp: new Date(),
      read: true,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update chat list
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, last_message: newMessage, last_message_time: new Date() }
        : chat
    ));
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
                      onClick={() => setSelectedChat(chat)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-smooth group"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-foreground" />
                        </div>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                        )}
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
                    {selectedChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-success rounded-full border border-background"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {selectedChat.participant_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.online ? 'Online' : `Last seen ${formatTime(selectedChat.last_message_time)}`}
                    </p>
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
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === 'current_user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender_id === 'current_user'
                          ? 'bg-gradient-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        message.sender_id === 'current_user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <span className="text-xs">
                          {message.timestamp.toLocaleTimeString('en-KE', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.sender_id === 'current_user' && (
                          message.read ? 
                            <CheckCheck className="w-3 h-3" /> : 
                            <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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