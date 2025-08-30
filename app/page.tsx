
import { MarketplaceHeader } from "@/components/marketplace/marketplace-header";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { Bot, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data from Supabase
const mockProducts = [
  {
    id: "1",
    title: "MacBook Pro 14-inch",
    description: "Excellent condition, barely used. M2 chip, 16GB RAM, 512GB storage.",
    current_price: 1899,
    image_url: "/api/placeholder/400/400",
    status: "active" as const,
    seller: { id: "user1", name: "John Doe" },
    agent: { 
      id: "agent1", 
      performance_stats: { 
        avg_negotiation_time: 1800, 
        success_rate: 0.85 
      }
    }
  },
  {
    id: "2", 
    title: "iPhone 15 Pro",
    description: "Brand new, unopened. Space Black, 256GB.",
    current_price: 999,
    status: "active" as const,
    seller: { id: "user2", name: "Jane Smith" },
    agent: { 
      id: "agent2",
      performance_stats: { 
        avg_negotiation_time: 1200, 
        success_rate: 0.92 
      }
    }
  },
  {
    id: "3",
    title: "Gaming Chair",
    description: "Ergonomic gaming chair with lumbar support. Like new condition.",
    current_price: 299,
    status: "active" as const,
    seller: { id: "user3", name: "Mike Johnson" },
    agent: { 
      id: "agent3",
      performance_stats: { 
        avg_negotiation_time: 900, 
        success_rate: 0.78 
      }
    }
  }
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            <Bot className="h-4 w-4 mr-2" />
            AI-Powered Negotiations
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart Marketplace with 
            <span className="text-primary"> AI Agents</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Buy and sell with confidence. Our AI agents handle negotiations on your behalf, 
            getting you the best deals while you focus on what matters.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <>
                <Button size="lg" asChild>
                  <Link href="/browse">Browse Products</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sell">Start Selling</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Negotiations</h3>
              <p className="text-muted-foreground">
                Smart agents learn your preferences and negotiate the best deals automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dynamic Pricing</h3>
              <p className="text-muted-foreground">
                Prices adjust based on demand, timing, and market conditions for optimal deals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Transactions</h3>
              <p className="text-muted-foreground">
                Secure payments and instant transfers powered by Flowglad's billing system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Discover the latest items with active AI agents</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/browse">View All</Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showNegotiationStats={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users already benefiting from AI-powered negotiations.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/chat">Try AI Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Powered by{" "}
            <Link href="https://flowglad.com" className="font-semibold hover:underline">
              FlowGlad
            </Link>
            {" "}&{" "}
            <Link href="https://honcho.dev" className="font-semibold hover:underline">
              Honcho
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
