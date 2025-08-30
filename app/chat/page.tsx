'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useHoncho } from "@/context/honchoProvider";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI marketplace assistant. I can help you find products, negotiate prices, or answer questions about our marketplace. What can I help you with today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response - integrate with your Honcho API
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(newMessage),
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to send message:', error);
    }
  };

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('negotiate')) {
      return "I can help you negotiate prices! Our AI agents are trained to get you the best deals. Would you like me to find products in a specific category or price range?";
    }
    
    if (lowerMessage.includes('find') || lowerMessage.includes('search')) {
      return "I'd be happy to help you find products! What are you looking for? I can search by category, price range, or specific items.";
    }
    
    if (lowerMessage.includes('sell') || lowerMessage.includes('listing')) {
      return "Great! I can help you create a listing. Our AI agent will handle negotiations on your behalf. What would you like to sell?";
    }
    
    return "That's interesting! I can help you with product searches, price negotiations, creating listings, or general marketplace questions. What would you like to explore?";
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 bg-white border-neutral-300">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Assistant
            </Badge>
            <h1 className="text-4xl font-bold mb-2">Chat with AI</h1>
            <p className="text-neutral-600">Your intelligent marketplace companion</p>
          </div>

          {/* Chat Container */}
          <Card className="h-[600px] flex flex-col border-neutral-200">
            <CardHeader className="border-b border-neutral-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">FlowMarketplace Assistant</h3>
                  <p className="text-sm text-neutral-600">Online</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="p-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] flex items-start space-x-3 ${
                        message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser ? 'bg-neutral-200' : 'bg-black'
                      }`}>
                        {message.isUser ? (
                          <User className="h-4 w-4 text-neutral-600" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      
                      <div className={`rounded-lg px-4 py-3 ${
                        message.isUser 
                          ? 'bg-black text-white' 
                          : 'bg-white border border-neutral-200 text-neutral-900'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.isUser ? 'text-neutral-300' : 'text-neutral-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="border-t border-neutral-200 p-6 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-neutral-300 focus:border-black focus:ring-black"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isLoading}
                  className="bg-black text-white hover:bg-neutral-800"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 mb-4">Quick actions:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Find electronics under $500",
                "Help me sell my furniture", 
                "Negotiate a better price",
                "Show me trending items"
              ].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewMessage(action)}
                  className="border-neutral-300 hover:bg-neutral-50"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
