'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useHoncho } from '@/context/honchoProvider';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { UserRole, ChatContext } from '@/lib/types/marketplace';
import { createClient } from '@/lib/supabase/client';

// Component to render text with embedded images
function MessageWithImages({ text }: { text: string }) {
  // Regular expression to find image URLs (including the specific pattern from the message)
  const imageUrlRegex = /(https:\/\/[^\s\)]+\.(?:jpg|jpeg|png|gif|webp))/gi;
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/gi;
  
  // First, handle markdown image syntax ![alt](url)
  let processedText = text;
  const markdownMatches = Array.from(text.matchAll(markdownImageRegex));
  
  if (markdownMatches.length > 0) {
    return (
      <div>
        {markdownMatches.map((match, index) => {
          const [fullMatch, altText, imageUrl] = match;
          const parts = processedText.split(fullMatch);
          const beforeImage = parts[0];
          const afterImage = parts.slice(1).join(fullMatch);
          processedText = afterImage;
          
          return (
            <div key={index}>
              {beforeImage && (
                <span className="whitespace-pre-wrap">{beforeImage}</span>
              )}
              <div className="mt-2 mb-2">
                <img
                  src={imageUrl}
                  alt={altText || 'Product image'}
                  className="max-w-xs max-h-48 rounded-lg border shadow-sm"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              {index === markdownMatches.length - 1 && afterImage && (
                <span className="whitespace-pre-wrap">{afterImage}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }
  
  // If no markdown images, check for plain URLs
  const imageUrls = text.match(imageUrlRegex);
  
  if (imageUrls && imageUrls.length > 0) {
    const parts = text.split(imageUrlRegex);
    
    return (
      <div>
        {parts.map((part, index) => {
          // Check if this part is an image URL
          if (imageUrls.includes(part)) {
            return (
              <div key={index} className="mt-2 mb-2">
                <img
                  src={part}
                  alt="Product image"
                  className="max-w-xs max-h-48 rounded-lg border shadow-sm"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            );
          }
          
          // Regular text part
          return part ? (
            <span key={index} className="whitespace-pre-wrap">
              {part}
            </span>
          ) : null;
        })}
      </div>
    );
  }
  
  // No images found, just return the text
  return <span className="whitespace-pre-wrap">{text}</span>;
}

interface ChatProps {
  userId?: string;
  userName?: string;
}

export default function Chat({ userId, userName }: ChatProps) {
  const [input, setInput] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('both');
  const [chatContext, setChatContext] = useState<ChatContext>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  
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
 const { messages, sendMessage, status } = useChat({ 
  });

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
 
  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      // Create unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
      const filePath = `product-images/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('marketplace')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        if (error.message.includes('row-level security policy')) {
          alert('Storage bucket not configured. Please set up the marketplace bucket in Supabase Storage with proper policies.');
        }
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('marketplace')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const processFile = async (file: File, autoSend: boolean = false) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (6MB limit)
    if (file.size > 6 * 1024 * 1024) {
      alert('File size must be less than 6MB');
      return;
    }

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setUploadedImages(prev => [...prev, imageUrl]);
      
      // Only send message automatically if autoSend is true (for button click)
      if (autoSend) {
        const imageMessage = `I've uploaded an image for my product: ${imageUrl}. Please note this image URL when I provide product details.`;
        sendMessage({ text: imageMessage });
      }
    } else {
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await processFile(files[0], true); // Auto-send for button click

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please drop image files only');
      return;
    }

    // Process first image file (don't auto-send for drag & drop)
    if (imageFiles.length > 0) {
      await processFile(imageFiles[0], false);
    }

    if (imageFiles.length > 1) {
      alert('Only the first image was uploaded. Please upload one image at a time.');
    }
  };

  return (
    <div 
      className={`flex flex-col h-full max-h-[600px] w-full max-w-2xl mx-auto bg-background border rounded-lg shadow-lg relative ${
        isDragOver ? 'border-primary border-2 bg-primary/5' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-lg font-semibold text-primary">Drop image here</p>
            <p className="text-sm text-muted-foreground">Upload product images (max 6MB)</p>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="px-4 py-3 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground">FlowMarketplace Broker</h2>
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
                    <div key={index}>
                      <MessageWithImages text={part.text} />
                    </div>
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
        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt="Uploaded"
                  className="w-16 h-16 object-cover rounded border"
                />
                <button
                  onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (input.trim() || uploadedImages.length > 0) {
              let messageText = input;
              
              // Include uploaded images in the message
              if (uploadedImages.length > 0) {
                const imageUrls = uploadedImages.join(', ');
                messageText += uploadedImages.length > 0 && input.trim() 
                  ? ` [Images: ${imageUrls}]` 
                  : `I've uploaded images for my product: ${imageUrls}. Please note these image URLs when I provide product details.`;
              }
              
              handleSendMessage({ text: messageText });
              setInput('');
              setUploadedImages([]); // Clear uploaded images after sending
            }
          }}
          className="flex space-x-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || status !== 'ready'}
            className="px-3"
          >
            {isUploading ? '📤' : '📷'}
          </Button>
          
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={status !== 'ready'}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={status !== 'ready' || (!input.trim() && uploadedImages.length === 0)}
            className="px-6"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}