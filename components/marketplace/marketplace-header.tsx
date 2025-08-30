import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Search, Plus, MessageSquare, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function MarketplaceHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">FlowGlad Marketplace</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link href="/sell" className="text-muted-foreground hover:text-foreground transition-colors">
              Sell
            </Link>
            <Link href="/my-negotiations" className="text-muted-foreground hover:text-foreground transition-colors">
              My Deals
            </Link>
          </nav>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Link>
          </Button>
          
          <Button size="sm" asChild>
            <Link href="/sell">
              <Plus className="h-4 w-4 mr-2" />
              Sell Item
            </Link>
          </Button>

          <ThemeSwitcher />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}