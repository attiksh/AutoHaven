import { useState, useRef, useEffect } from "react";
import { User } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

// Type for conversation summary
type Conversation = {
  userId: number;
  carId: number;
  username: string;
  carTitle: string;
  lastMessage: string;
  date: Date;
  unread: boolean;
};

// Type for individual message
type ChatMessage = {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: Date;
  isRead: boolean;
};

interface MessageThreadProps {
  conversation: Conversation;
  currentUser: User;
  sellerEmail: string;
}

export function MessageThread({ conversation, currentUser, sellerEmail }: MessageThreadProps) {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Generate mock messages for demo purposes
  useEffect(() => {
    // This would be replaced with a real API call in production
    const fetchMessages = async () => {
      setIsLoading(true);
      
      try {
        // Mock data - in real app, fetch from API
        setTimeout(() => {
          const mockMessages: ChatMessage[] = [
            {
              id: "1",
              senderId: conversation.userId,
              receiverId: currentUser.id,
              content: "Hello, I'm interested in the " + conversation.carTitle + ". Is it still available?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
              isRead: true,
            },
            {
              id: "2",
              senderId: currentUser.id,
              receiverId: conversation.userId,
              content: "Yes, it's still available! Would you like to schedule a viewing?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
              isRead: true,
            },
            {
              id: "3",
              senderId: conversation.userId,
              receiverId: currentUser.id,
              content: "That would be great. Could we meet tomorrow afternoon around 3 PM?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
              isRead: true,
            },
            {
              id: "4",
              senderId: currentUser.id,
              receiverId: conversation.userId,
              content: "Sure, that works for me. Here's my address: 123 Main St, Anytown, USA",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21), // 21 hours ago
              isRead: true,
            },
            {
              id: "5",
              senderId: conversation.userId,
              receiverId: currentUser.id,
              content: "Perfect! Is there anything specific I should know about the car before I see it?",
              timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
              isRead: conversation.unread ? false : true,
            },
          ];
          
          setMessages(mockMessages);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error loading messages",
          description: "Failed to load message history",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [conversation, currentUser.id, toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      // In a real app, this would send to API
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        receiverId: conversation.userId,
        content,
        timestamp: new Date(),
        isRead: false,
      };
      
      // Simulating API call
      return new Promise<ChatMessage>((resolve) => {
        setTimeout(() => resolve(newMsg), 500);
      });
    },
    onSuccess: (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      
      // In a real app, invalidate messages query
      // queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });
  
  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate(newMessage);
  };
  
  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };
  
  // Format date for message groups
  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    }
  };

  return (
    <Card className="h-[calc(100vh-200px)] flex flex-col">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center">
          <Avatar className="mr-3">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${conversation.username}`} alt={conversation.username} />
            <AvatarFallback>{conversation.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{conversation.username}</CardTitle>
            <CardDescription className="text-sm">{conversation.carTitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="h-full p-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUser.id;
              const showDate = index === 0 || 
                formatMessageDate(message.timestamp) !== formatMessageDate(messages[index - 1].timestamp);
              
              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs bg-gray-100 rounded-full px-3 py-1 text-gray-500">
                        {formatMessageDate(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`flex items-end ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className={`${isCurrentUser ? 'ml-2' : 'mr-2'} w-8 h-8 flex-shrink-0`}>
                        <AvatarImage 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${isCurrentUser ? currentUser.username : conversation.username}`} 
                          alt={isCurrentUser ? currentUser.username : conversation.username} 
                        />
                        <AvatarFallback>
                          {isCurrentUser ? currentUser.username.charAt(0).toUpperCase() : conversation.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-lg px-4 py-2 shadow-sm ${
                        isCurrentUser 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                          {message.isRead && isCurrentUser && (
                            <span className="ml-2">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </ScrollArea>
        )}
      </CardContent>
      
      <CardFooter className="p-4 border-t">
        <Button
          className="w-full"
          size="lg"
          onClick={() => {
            toast({
              title: "Seller's Email",
              description: sellerEmail,
            });
          }}
        >
          Get Seller's Email
        </Button>
      </CardFooter>
    </Card>
  );
}
