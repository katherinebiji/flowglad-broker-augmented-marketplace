'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useHoncho } from '@/context/honchoProvider';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { UserRole, ChatContext } from '@/lib/types/marketplace';

interface ChatProps {
  userId?: string;
  userName?: string;
}

export default function Chat({ userId, userName }: ChatProps) {
  const [input, setInput] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('both');
  const [chatContext, setChatContext] = useState<ChatContext>({});
  
  const { messages, sendMessage, status } = useChat({
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to FlowGlad! I'm your product broker assistant. I help facilitate transactions between buyers and sellers.

Are you looking to:
🛒 **Buy** something specific?
🏷️ **Sell** a product?
💼 **Browse** current listings?

Just let me know what you're interested in, and I'll guide you through the process!`
      }
    ]
  });
  
  const {
    user: honchoUser,
    session: honchoSession,
    peer: honchoPeer,
    loading: honchoLoading,
    error: honchoError,
    honchoRef,
    createNewSession,
    initializeHoncho,
  } = useHoncho();

  // Wrapper to send to both chat and Honcho
  const handleSendMessage = useCallback(
    async (msgObj: { text: string }) => {
      sendMessage(msgObj);
      // Try to add message to Honcho session if possible
      console.log("honchoUser:", honchoUser);
      console.log("honchoSession:", honchoSession);
      console.log("honchoPeer:", honchoPeer);
      
      if (honchoUser && honchoSession && honchoPeer) {
        try {
          console.log('Sending message to Honcho:', msgObj.text);
          await honchoSession.addMessages([honchoPeer.message(msgObj.text)])
        } catch (err) {
          console.error(err);
        }
      }
    },
    [sendMessage, honchoUser, honchoSession, honchoPeer]
  );

  return (
    <div className="flex flex-col h-full max-h-[600px] w-full max-w-2xl mx-auto bg-background border rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground">FlowGlad Broker</h2>
            <Badge variant="outline">🤝 Marketplace</Badge>
          </div>
          {chatContext.current_action && (
            <Badge variant="secondary">
              {chatContext.current_action === 'listing' && '🏷️ Listing'}
              {chatContext.current_action === 'buying' && '🛒 Buying'}
              {chatContext.current_action === 'negotiating' && '💬 Negotiating'}
              {chatContext.current_action === 'browsing' && '👀 Browsing'}
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Start a conversation...</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted text-muted-foreground mr-4'
                }`}
              >
                {message.parts.map((part, index) =>
                  part.type === 'text' ? (
                    <span key={index} className="whitespace-pre-wrap">
                      {part.text}
                    </span>
                  ) : null,
                )}
              </div>
            </div>
          ))
        )}
        {status === 'streaming' && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground mr-4 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-b bg-muted/10">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                handleSendMessage({ text: "I want to sell a product" });
                setChatContext({ current_action: 'listing' });
              }}
            >
              🏷️ Sell Item
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                handleSendMessage({ text: "I'm looking to buy something" });
                setChatContext({ current_action: 'buying' });
              }}
            >
              🛒 Buy Item
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                handleSendMessage({ text: "Show me current listings" });
                setChatContext({ current_action: 'browsing' });
              }}
            >
              👀 Browse Listings
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-muted/20 rounded-b-lg">
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (input.trim()) {
              await handleSendMessage({ text: input });
              setInput('');
            }
          }}
          className="flex space-x-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={status !== 'ready'}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={status !== 'ready' || !input.trim()}
            className="px-6"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}