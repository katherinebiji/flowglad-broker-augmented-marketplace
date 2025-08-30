
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
        <div className="max-w-4xl">
          <div className="mb-8">
            <Badge variant="outline" className="mb-6 bg-neutral-100 border-neutral-300">
              AI-Powered Negotiations
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Refined. Minimal.
              <br />
              <span className="text-neutral-600">Never boring.</span>
            </h1>
            
            <div className="space-y-4 text-lg text-neutral-600 mb-12 max-w-2xl">
              <p>Marketplace that speaks softly, but stands out loud.</p>
              <p>Clean negotiations, crafted with AI.</p>
              <p>Elegance with intelligence — style first.</p>
            </div>
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
                Try AI Assistant
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="space-y-2">
              <Bot className="h-8 w-8 text-neutral-700 mb-4" />
              <h3 className="font-semibold text-lg">AI Negotiations</h3>
              <p className="text-neutral-600">Smart agents handle deals while you focus on what matters.</p>
            </div>
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-neutral-700 mb-4" />
              <h3 className="font-semibold text-lg">Instant Payments</h3>
              <p className="text-neutral-600">Secure transactions powered by Flowglad's infrastructure.</p>
            </div>
            <div className="space-y-2">
              <Shield className="h-8 w-8 text-neutral-700 mb-4" />
              <h3 className="font-semibold text-lg">Trust & Safety</h3>
              <p className="text-neutral-600">Every transaction is protected and verified.</p>
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
          <h2 className="text-3xl font-bold mb-4">Ready to start trading?</h2>
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
