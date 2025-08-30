import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Heart, MessageCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description?: string;
  current_price: number;
  image_url?: string;
  status: 'active' | 'sold' | 'archived';
  seller?: {
    id: string;
    name?: string;
  };
  agent?: {
    id: string;
    performance_stats?: {
      avg_negotiation_time?: number;
      success_rate?: number;
    };
  };
}

interface ProductCardProps {
  product: Product;
  className?: string;
  showNegotiationStats?: boolean;
}

export function ProductCard({ product, className, showNegotiationStats = false }: ProductCardProps) {
  const negotiationSuccessRate = product.agent?.performance_stats?.success_rate;
  const avgNegotiationTime = product.agent?.performance_stats?.avg_negotiation_time;

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="bg-muted w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          
          {/* Status Badge */}
          {product.status === 'sold' && (
            <Badge className="absolute top-2 left-2 bg-destructive">
              SOLD
            </Badge>
          )}
          
          {/* AI Agent Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-primary text-primary-foreground"
          >
            AI Agent
          </Badge>

          {/* Quick Actions */}
          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
          
          {product.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold">
              {formatPrice(product.current_price, 'USD')}
            </div>
            {showNegotiationStats && negotiationSuccessRate && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>{Math.round(negotiationSuccessRate * 100)}% success</span>
              </div>
            )}
          </div>

          {showNegotiationStats && avgNegotiationTime && (
            <div className="text-xs text-muted-foreground mb-3">
              Avg. negotiation: {Math.round(avgNegotiationTime / 60)} minutes
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1">
            <Link href={`/product/${product.id}`}>
              View Details
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/product/${product.id}/negotiate`}>
              Negotiate
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}