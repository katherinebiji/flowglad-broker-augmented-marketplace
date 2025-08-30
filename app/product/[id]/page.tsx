import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageSquare, Shield, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// This would come from your database based on the ID
const product = {
  id: "1",
  name: "MacBook Pro 14-inch",
  description: "M2 chip, barely used, excellent condition. Perfect for professionals and creatives.",
  price: 1899,
  originalPrice: 2299,
  images: [
    "/api/placeholder/600/600",
    "/api/placeholder/600/600", 
    "/api/placeholder/600/600",
    "/api/placeholder/600/600"
  ],
  category: "Electronics",
  condition: "Excellent",
  seller: {
    name: "John Doe",
    rating: 4.9,
    totalSales: 127
  },
  features: [
    "M2 Pro chip with 10-core CPU",
    "16GB unified memory", 
    "512GB SSD storage",
    "14-inch Liquid Retina XDR display",
    "Battery cycle count: 45"
  ],
  negotiable: true,
  aiAgent: {
    success_rate: 85,
    avg_response_time: "2 minutes"
  }
};

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-neutral-600 hover:text-black">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={600}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square bg-neutral-100 rounded overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    width={150}
                    height={150}
                    className="object-cover w-full h-full hover:opacity-80 cursor-pointer transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="bg-neutral-100 border-neutral-300">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                  {product.condition}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
                <span className="text-lg text-neutral-500 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Save ${(product.originalPrice - product.price).toLocaleString()}
                </Badge>
              </div>

              <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-neutral-600">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Agent Info */}
            <Card className="border-neutral-200 bg-neutral-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">AI Agent Active</span>
                </div>
                <p className="text-sm text-neutral-600 mb-4">
                  This seller's AI agent can negotiate on their behalf with {product.aiAgent.success_rate}% success rate.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">Success Rate</span>
                    <div className="font-semibold">{product.aiAgent.success_rate}%</div>
                  </div>
                  <div>
                    <span className="text-neutral-500">Avg Response</span>
                    <div className="font-semibold">{product.aiAgent.avg_response_time}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-neutral-800">
                  Buy Now
                </Button>
                <Button size="lg" variant="outline" className="border-neutral-300">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Negotiate Price
                </Button>
              </div>
              
              <Button size="lg" variant="ghost" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Save to Wishlist
              </Button>
            </div>

            {/* Seller Info */}
            <Card className="border-neutral-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.seller.name}</p>
                    <p className="text-sm text-neutral-600">{product.seller.totalSales} sales</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{product.seller.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                    <p className="text-sm text-neutral-600">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6 text-neutral-600" />
                <span>Buyer Protection</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Truck className="h-6 w-6 text-neutral-600" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Heart className="h-6 w-6 text-neutral-600" />
                <span>30-day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}