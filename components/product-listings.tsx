'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ProductListing, MakeOfferForm } from '@/lib/types/marketplace';

interface ProductListingsProps {
  listings: ProductListing[];
  onMakeOffer: (offer: MakeOfferForm) => void;
  onViewDetails: (listingId: string) => void;
  currentUserId?: string;
}

export default function ProductListings({ 
  listings, 
  onMakeOffer, 
  onViewDetails, 
  currentUserId 
}: ProductListingsProps) {
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [offerMessage, setOfferMessage] = useState<string>('');

  const handleMakeOffer = (listing: ProductListing) => {
    if (offerAmount > 0) {
      onMakeOffer({
        listing_id: listing.id,
        offer_amount: offerAmount,
        message: offerMessage
      });
      setSelectedListing(null);
      setOfferAmount(0);
      setOfferMessage('');
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-green-50 text-green-700';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateNegotiationRange = (listing: ProductListing) => {
    const flexAmount = (listing.asking_price * listing.flexibility_percentage) / 100;
    const minFlexPrice = Math.max(listing.asking_price - flexAmount, listing.minimum_price);
    return {
      min: minFlexPrice,
      max: listing.asking_price
    };
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No listings found. Be the first to list a product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Available Products</h2>
        <Badge variant="outline">{listings.length} listings</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {listings.map((listing) => {
          const range = calculateNegotiationRange(listing);
          const isOwnListing = currentUserId === listing.seller_id;
          const isSelectedForOffer = selectedListing === listing.id;

          return (
            <Card key={listing.id} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{listing.product?.name || 'Product'}</h3>
                    <p className="text-muted-foreground">{listing.product?.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${listing.asking_price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Asking price
                    </p>
                  </div>
                </div>

                {/* Condition and Flexibility */}
                <div className="flex items-center gap-2">
                  <Badge className={getConditionColor(listing.product?.condition || 'good')}>
                    {listing.product?.condition || 'Good'}
                  </Badge>
                  <Badge variant="outline">
                    {listing.flexibility_percentage}% flexible
                  </Badge>
                  {listing.quantity_available > 1 && (
                    <Badge variant="secondary">
                      {listing.quantity_available} available
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {listing.product?.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {listing.product.description}
                  </p>
                )}

                {/* Negotiation Range */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Negotiation Range:</p>
                  <p className="text-sm text-muted-foreground">
                    ${range.min.toFixed(2)} - ${range.max.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    The broker can negotiate within this range
                  </p>
                </div>

                {/* Special Conditions */}
                {listing.special_conditions && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Special Conditions:</p>
                    <p className="text-sm text-yellow-700">{listing.special_conditions}</p>
                  </div>
                )}

                {/* Deadline */}
                {listing.deadline && (
                  <p className="text-sm text-orange-600">
                    ⏰ Sale deadline: {new Date(listing.deadline).toLocaleDateString()}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {!isOwnListing ? (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedListing(isSelectedForOffer ? null : listing.id)}
                      >
                        💬 {isSelectedForOffer ? 'Cancel Offer' : 'Make Offer'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(listing.id)}
                      >
                        👁️ View Details
                      </Button>
                    </>
                  ) : (
                    <Badge variant="secondary">Your listing</Badge>
                  )}
                </div>

                {/* Offer Form */}
                {isSelectedForOffer && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                    <h4 className="font-medium mb-3">Make an Offer</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">
                          Offer Amount ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min={range.min}
                          max={range.max}
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(parseFloat(e.target.value) || 0)}
                          placeholder={`Between $${range.min.toFixed(2)} - $${range.max.toFixed(2)}`}
                          className="w-full p-2 border border-input rounded-md bg-background"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Suggested range: ${range.min.toFixed(2)} - ${range.max.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Message (Optional)
                        </label>
                        <textarea
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                          placeholder="Add a message to explain your offer..."
                          rows={2}
                          className="w-full p-2 border border-input rounded-md bg-background"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleMakeOffer(listing)}
                          disabled={offerAmount <= 0 || offerAmount < range.min || offerAmount > range.max}
                          size="sm"
                        >
                          Submit Offer
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedListing(null)}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
