'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingBag, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";

interface HeaderProps {
  user?: any;
}

export function Header({ user }: HeaderProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                <span className="text-sm font-bold text-white">F</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">FlowMarketplace</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300">
                Latest Drop
              </Badge>
              <Link href="/" className="text-neutral-700 hover:text-black transition-colors">
                Home
              </Link>
              <Link href="/featured" className="text-neutral-700 hover:text-black transition-colors">
                Featured
              </Link>
              <Link href="/shop" className="text-neutral-700 hover:text-black transition-colors">
                Shop All
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-4 w-4" />
              </Button>

              {/* Chat */}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/chat">
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-black text-white rounded-full flex items-center justify-center">
                  0
                </span>
              </Button>

              {/* Auth */}
              {user ? (
                <Button variant="outline" size="sm" className="border-neutral-300">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              ) : (
                <Button 
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-black text-white hover:bg-neutral-800"
                  size="sm"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
      />
    </>
  );
}