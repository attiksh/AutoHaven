import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Message, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageThread } from "@/components/messages/message-thread";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

function generateFakeEmail(username: string) {
  return `${username.toLowerCase().replace(/\s+/g, "")}@case.edu`;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  // Fetch user's messages
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!user,
  });
  
  // Mock conversations data (this would typically be derived from messages)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Simulate fetching conversations from messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      // This is a mock implementation - in a real app, you would process messages to group by conversation
      const mockConversations: Conversation[] = [
        {
          userId: 2,
          carId: 1,
          username: "john_doe",
          carTitle: "2022 Tesla Model 3",
          lastMessage: "Is this car still available?",
          date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          unread: true,
        },
        {
          userId: 3,
          carId: 2,
          username: "jane_smith",
          carTitle: "2020 BMW 3 Series",
          lastMessage: "Thanks for the information, I'll think about it and get back to you.",
          date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          unread: false,
        },
        {
          userId: 4,
          carId: 3,
          username: "dave_wilson",
          carTitle: "2021 Audi Q5",
          lastMessage: "Would you consider $42,000?",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          unread: false,
        },
      ];
      
      setConversations(mockConversations);
      
      // If no conversation is selected, select the first one
      if (!selectedConversation && mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0]);
      }
    }
  }, [messages, selectedConversation]);
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    conversation.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    conversation.carTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      await apiRequest("PUT", `/api/messages/${messageId}/read`, {});
    },
    onSuccess: () => {
      // Invalidate messages query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });
  
  // Handle selecting a conversation
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // If conversation has unread messages, mark them as read
    if (conversation.unread) {
      // In a real app, you would mark specific messages as read
      // This is a mock implementation
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.userId === conversation.userId && conv.carId === conversation.carId
            ? { ...conv, unread: false }
            : conv
        )
      );
    }
  };
  
  // Format date to relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-500 mb-4">Please log in to access your messages</p>
          <Button onClick={() => window.location.href = "/auth"}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Messages</h1>
        
        {/* Mobile view: Back button when a conversation is selected */}
        {selectedConversation && (
          <Button 
            variant="ghost" 
            className="lg:hidden"
            onClick={() => setSelectedConversation(null)}
          >
            Back to list
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List - Hidden on mobile when a conversation is selected */}
        <div className={`lg:col-span-1 ${selectedConversation ? 'hidden lg:block' : ''}`}>
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 overflow-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="font-medium text-gray-700 mb-2">No messages yet</h3>
                  <p className="text-gray-500 text-sm">
                    Your conversations with sellers will appear here
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  {filteredConversations.map((conversation, index) => (
                    <div key={`${conversation.userId}-${conversation.carId}`}>
                      <button
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                          selectedConversation?.userId === conversation.userId && 
                          selectedConversation?.carId === conversation.carId
                            ? "bg-gray-100 border-l-4 border-primary"
                            : ""
                        }`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${conversation.username}`} alt={conversation.username} />
                            <AvatarFallback>{conversation.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h3 className={`font-medium truncate ${conversation.unread ? "text-black" : "text-gray-700"}`}>
                                {conversation.username}
                              </h3>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {formatRelativeTime(conversation.date)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{conversation.carTitle}</p>
                            <p className={`text-sm truncate ${
                              conversation.unread ? "font-medium text-gray-900" : "text-gray-500"
                            }`}>
                              {conversation.lastMessage}
                            </p>
                          </div>
                          {conversation.unread && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      {index < filteredConversations.length - 1 && <Separator />}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Conversation Thread - Full width on mobile when selected */}
        <div className={`${selectedConversation ? 'block' : 'hidden lg:block'} lg:col-span-2`}>
          {selectedConversation ? (
            <MessageThread
              conversation={selectedConversation}
              currentUser={user}
              sellerEmail={generateFakeEmail(selectedConversation.username)}
            />
          ) : (
            <Card className="h-[calc(100vh-200px)] flex flex-col justify-center items-center p-6 text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">No conversation selected</h2>
              <p className="text-gray-500 max-w-md">
                Select a conversation from the list to view messages, or use the search bar to find specific conversations.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
