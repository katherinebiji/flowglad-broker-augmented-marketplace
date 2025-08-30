'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Negotiation, NegotiationOffer } from '@/lib/types/marketplace';

interface NegotiationTrackerProps {
  negotiations: Negotiation[];
  currentUserId?: string;
  onAcceptOffer: (negotiationId: string) => void;
  onDeclineOffer: (negotiationId: string) => void;
  onCounterOffer: (negotiationId: string, amount: number, message?: string) => void;
}

export default function NegotiationTracker({
  negotiations,
  currentUserId,
  onAcceptOffer,
  onDeclineOffer,
  onCounterOffer
}: NegotiationTrackerProps) {
  const [selectedNegotiation, setSelectedNegotiation] = useState<string | null>(null);
  const [counterOfferAmount, setCounterOfferAmount] = useState<number>(0);
  const [counterOfferMessage, setCounterOfferMessage] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '💬';
      case 'accepted': return '✅';
      case 'declined': return '❌';
      case 'cancelled': return '🚫';
      case 'expired': return '⏰';
      default: return '❓';
    }
  };

  const handleCounterOffer = (negotiationId: string) => {
    if (counterOfferAmount > 0) {
      onCounterOffer(negotiationId, counterOfferAmount, counterOfferMessage);
      setSelectedNegotiation(null);
      setCounterOfferAmount(0);
      setCounterOfferMessage('');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const isUserSeller = (negotiation: Negotiation) => {
    return currentUserId === negotiation.seller_id;
  };

  const isUserBuyer = (negotiation: Negotiation) => {
    return currentUserId === negotiation.buyer_id;
  };

  if (negotiations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No active negotiations found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Negotiations</h2>
        <Badge variant="outline">{negotiations.length} active</Badge>
      </div>

      <div className="space-y-4">
        {negotiations.map((negotiation) => {
          const isSeller = isUserSeller(negotiation);
          const isBuyer = isUserBuyer(negotiation);
          const isSelectedForCounter = selectedNegotiation === negotiation.id;
          const canRespond = negotiation.status === 'active' && (isSeller || isBuyer);
          
          return (
            <Card key={negotiation.id} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {negotiation.listing?.product?.name || 'Product Negotiation'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isSeller ? `Buyer: ${negotiation.buyer?.email || 'Anonymous'}` : 
                       isBuyer ? `Seller: ${negotiation.seller?.email || 'Anonymous'}` : 
                       'Negotiation'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(negotiation.status)}>
                      {getStatusIcon(negotiation.status)} {negotiation.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatTimeAgo(negotiation.updated_at)}
                    </p>
                  </div>
                </div>

                {/* Current Offer */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Offer</p>
                      <p className="text-2xl font-bold text-primary">
                        ${negotiation.current_offer.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Original Price</p>
                      <p className="text-lg font-semibold">
                        ${negotiation.listing?.asking_price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                  
                  {negotiation.listing && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Negotiable range: ${Math.max(
                        negotiation.listing.asking_price - (negotiation.listing.asking_price * negotiation.listing.flexibility_percentage / 100),
                        negotiation.listing.minimum_price
                      ).toFixed(2)} - ${negotiation.listing.asking_price.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Offer History */}
                {negotiation.offer_history && negotiation.offer_history.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Offer History</h4>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {negotiation.offer_history.slice(-3).map((offer, index) => (
                        <div key={offer.id} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded">
                          <span>
                            {offer.from_user_id === currentUserId ? 'You' : 
                             offer.from_user_id === negotiation.seller_id ? 'Seller' : 'Buyer'}
                            : ${offer.offer_amount.toFixed(2)}
                          </span>
                          <span className="text-muted-foreground">
                            {formatTimeAgo(offer.created_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Broker Notes */}
                {negotiation.broker_notes && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Broker Notes:</p>
                    <p className="text-sm text-blue-700">{negotiation.broker_notes}</p>
                  </div>
                )}

                {/* Expiration */}
                {negotiation.expires_at && negotiation.status === 'active' && (
                  <p className="text-sm text-orange-600">
                    ⏰ Expires: {new Date(negotiation.expires_at).toLocaleDateString()} at {new Date(negotiation.expires_at).toLocaleTimeString()}
                  </p>
                )}

                {/* Actions */}
                {canRespond && (
                  <div className="flex gap-2 pt-2">
                    {isSeller && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => onAcceptOffer(negotiation.id)}
                        >
                          ✅ Accept Offer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedNegotiation(isSelectedForCounter ? null : negotiation.id)}
                        >
                          💬 Counter Offer
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeclineOffer(negotiation.id)}
                        >
                          ❌ Decline
                        </Button>
                      </>
                    )}
                    
                    {isBuyer && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNegotiation(isSelectedForCounter ? null : negotiation.id)}
                      >
                        💬 {isSelectedForCounter ? 'Cancel' : 'Update Offer'}
                      </Button>
                    )}
                  </div>
                )}

                {/* Counter Offer Form */}
                {isSelectedForCounter && canRespond && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                    <h4 className="font-medium mb-3">
                      {isSeller ? 'Make Counter Offer' : 'Update Your Offer'}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">
                          Offer Amount ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={counterOfferAmount}
                          onChange={(e) => setCounterOfferAmount(parseFloat(e.target.value) || 0)}
                          placeholder="Enter your counter offer"
                          className="w-full p-2 border border-input rounded-md bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Message (Optional)
                        </label>
                        <textarea
                          value={counterOfferMessage}
                          onChange={(e) => setCounterOfferMessage(e.target.value)}
                          placeholder="Explain your counter offer..."
                          rows={2}
                          className="w-full p-2 border border-input rounded-md bg-background"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCounterOffer(negotiation.id)}
                          disabled={counterOfferAmount <= 0}
                          size="sm"
                        >
                          Submit Counter Offer
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedNegotiation(null)}
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
