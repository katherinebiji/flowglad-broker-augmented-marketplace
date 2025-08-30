import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  bestSeller?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square mb-4 overflow-hidden bg-neutral-100 rounded-sm">
          {product.bestSeller && (
            <Badge className="absolute top-4 left-4 z-10 bg-black text-white">
              Best Seller
            </Badge>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-neutral-600 transition-colors">
              {product.name}
            </h3>
            <div className="text-lg font-semibold">
              ${product.price.toLocaleString()}
            </div>
          </div>
          
          <p className="text-neutral-600 text-sm">
            {product.description}
          </p>
          
          <div className="pt-2">
            <Button
              size="sm"
              className="bg-black text-white hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Negotiate Price
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}