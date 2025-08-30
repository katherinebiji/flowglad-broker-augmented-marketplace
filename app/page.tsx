
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/product-card";
import { Bot, Zap, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock featured products
const featuredProducts = [
  {
    id: "1",
    name: "MacBook Pro 14-inch",
    description: "M2 chip, barely used, excellent condition",
    price: 1899,
    image: "/api/placeholder/400/400",
    category: "Electronics",
    bestSeller: true
  },
  {
    id: "2",
    name: "Herman Miller Chair",
    description: "Ergonomic office chair, like new",
    price: 649,
    image: "/api/placeholder/400/400",
    category: "Furniture"
  },
  {
    id: "3",
    name: "iPhone 15 Pro",
    description: "Space Black, 256GB, unopened",
    price: 999,
    image: "/api/placeholder/400/400",
    category: "Electronics"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side: Hero Copy */}
          <div>
            <Badge variant="outline" className="mb-6 bg-neutral-100 border-neutral-300">
              AI-Brokered Marketplace
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Buy & Sell with ease
              <br />
              <span className="text-neutral-600">with a Built-In Broker.</span>
            </h1>

            <div className="space-y-4 text-lg text-neutral-600 mb-12 max-w-2xl">
              <p>AI handles the haggling — you focus on the deal.</p>
              <p>Clean negotiations, crafted with AI.</p>
              <p>Dynamic markdowns, trusted payments, smarter trades.</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-16">
              <Button asChild size="lg" className="bg-black text-white hover:bg-neutral-800">
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-neutral-300 hover:bg-neutral-50">
                <Link href="/chat">
                  Try AI Broker (Seller or Buyer)
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side: Chat Demo */}
          <div className="relative w-full h-[500px] bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-neutral-100 border-b border-neutral-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">AI Broker</h4>
                  <p className="text-xs text-neutral-500">Negotiating for you</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 h-[400px] overflow-y-auto">
              {/* Buyer message */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl px-4 py-2 max-w-[70%]">
                  <p className="text-sm">I'm interested in purchasing a mechanical keyboard. I am willing to pay $90, or $80 if I can pick it up locally.</p>
                </div>
              </div>

              {/* AI Agent response */}
              <div className="flex justify-start">
                <div className="bg-neutral-100 rounded-2xl px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-neutral-800">I'll help negotiate the best deal for you. Let me talk to a couple of different sellers.</p>
                </div>
              </div>

              {/* Seller response through AI */}
              <div className="flex justify-start">
                <div className="bg-green-100 rounded-2xl px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-green-800"><strong>Seller 1:</strong> Listed at $110. It's in excellent condition, barely used.</p>
                </div>
              </div>

              {/* AI negotiating */}
              <div className="flex justify-start">
                <div className="bg-neutral-100 rounded-2xl px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-neutral-800">I found similar keyboards selling for $90-100. Would you accept $95?</p>
                </div>
              </div>

              {/* Seller counter */}
              <div className="flex justify-start">
                <div className="bg-green-100 rounded-2xl px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-green-800"><strong>Seller 1:</strong> How about $100? I can include free shipping.</p>
                </div>
              </div>

              {/* AI final offer */}
              <div className="flex justify-start">
                <div className="bg-blue-100 rounded-2xl px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-blue-800">🎉 Deal reached at $100 with free shipping! Saved you $10.</p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-neutral-200 p-3">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-neutral-50" 
                  disabled
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured</h2>
              <p className="text-neutral-600">Curated items from our community</p>
            </div>
            <Button variant="outline" asChild className="border-neutral-300">
              <Link href="/shop">View All</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12">Shop</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Featured', 'Electronics', 'Furniture', 'Fashion', 
              'Home & Garden', 'Sports', 'Books', 'Art', 
              'Collectibles', 'Automotive'
            ].map((category) => (
              <Link 
                key={category}
                href={`/shop?category=${category.toLowerCase()}`}
                className="text-neutral-700 hover:text-black transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to simplify your selling?</h2>
          <p className="text-neutral-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands using AI-powered negotiations to get better deals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-black text-white hover:bg-neutral-800">
              Start Selling
            </Button>
            <Button variant="outline" size="lg" className="border-neutral-300">
              Browse Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
