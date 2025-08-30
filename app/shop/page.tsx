'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/products/product-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";
import { useState } from "react";

// Mock products data
const allProducts = [
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
    name: "Vintage Leather Jacket",
    description: "Genuine leather, size M, excellent condition",
    price: 299,
    image: "/api/placeholder/400/400",
    category: "Fashion"
  },
  {
    id: "5",
    name: "KitchenAid Mixer",
    description: "Stand mixer, barely used, all attachments",
    price: 229,
    image: "/api/placeholder/400/400",
    category: "Home & Garden"
  },
  {
    id: "6",
    name: "Road Bike",
    description: "Carbon frame, Shimano components",
    price: 1299,
    image: "/api/placeholder/400/400",
    category: "Sports"
  }
];

const categories = [
  "All Categories",
  "Electronics", 
  "Furniture", 
  "Fashion", 
  "Home & Garden", 
  "Sports", 
  "Books", 
  "Art", 
  "Collectibles", 
  "Automotive"
];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shop All</h1>
          <p className="text-neutral-600">Discover unique items from our community</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-neutral-300 focus:border-black focus:ring-black"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 border-neutral-300 focus:border-black focus:ring-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-neutral-300 focus:border-black focus:ring-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex ml-auto space-x-1 border border-neutral-300 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-black text-white' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-black text-white' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-neutral-600">
            {sortedProducts.length} item{sortedProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Products Grid/List */}
        {sortedProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
            : "space-y-6"
          }>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-600 text-lg mb-4">No products found matching your criteria.</p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Categories");
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {sortedProducts.length > 0 && (
          <div className="text-center mt-16">
            <Button variant="outline" size="lg" className="border-neutral-300">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}