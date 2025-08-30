import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

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
  },
  {
    id: "4",
    name: "Vintage Watch",
    description: "Swiss movement, leather strap",
    price: 450,
    image: "/api/placeholder/400/400", 
    category: "Accessories",
    bestSeller: true
  },
  {
    id: "5",
    name: "Designer Handbag",
    description: "Authentic leather, minimal wear",
    price: 890,
    image: "/api/placeholder/400/400",
    category: "Fashion"
  },
  {
    id: "6",
    name: "Coffee Machine",
    description: "Espresso maker, excellent condition", 
    price: 320,
    image: "/api/placeholder/400/400",
    category: "Home & Garden"
  }
];

export default function FeaturedPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 bg-white border-neutral-300">
            <Sparkles className="h-3 w-3 mr-1" />
            Curated Selection
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Featured Items</h1>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Our most coveted pieces, handpicked for their exceptional quality and unique character.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <p className="text-neutral-600 mb-4">Showing 6 of 24 featured items</p>
          <button className="text-black font-medium hover:underline">
            Load more
          </button>
        </div>
      </div>
    </div>
  );
}