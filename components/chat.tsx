'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChatProps {
  userId?: string;
  userName?: string;
}

// Define different system prompts
const SYSTEM_PROMPTS = {
  SellerPrompt: 'talk in all caps.',
  BuyerPrompt: 'talk in chinese.',
} as const;

type SystemPromptKey = keyof typeof SYSTEM_PROMPTS;

export default function Chat({ userId, userName }: ChatProps) {
  const [input, setInput] = useState('');
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState<SystemPromptKey>('BuyerPrompt');
  
  const { messages, sendMessage, status } = useChat();

  return (
    <div className="flex flex-col h-full max-h-[600px] w-full max-w-2xl mx-auto bg-background border rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Chat</h2>
          
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

    

      {/* Input Area */}
      <div className="p-4 border-t bg-muted/20 rounded-b-lg">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
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
        <p className="text-xs text-muted-foreground mt-2">
          Current mode: <span className="font-medium">{currentSystemPrompt}</span>
        </p>
      </div>
    </div>
  );
}