'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Lock, CreditCard, Shield, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock cart data
const cartItems = [
  {
    id: "1",
    name: "MacBook Pro 14-inch",
    description: "M2 chip, barely used",
    price: 1899,
    quantity: 1,
    image: "/api/placeholder/200/200"
  },
  {
    id: "2", 
    name: "Herman Miller Chair",
    description: "Ergonomic office chair",
    price: 649,
    quantity: 1,
    image: "/api/placeholder/200/200"
  }
];

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Integrate with Flowglad checkout API
      const response = await fetch('/api/flowglad/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          total,
          customer: formData
        })
      });

      if (response.ok) {
        const { checkout_url } = await response.json();
        window.location.href = checkout_url;
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Checkout</h1>
            <p className="text-neutral-600">Complete your purchase securely</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div className="space-y-8">
              <Card className="border-neutral-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Secure Checkout</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckout} className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Contact Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          className="border-neutral-300 focus:border-black focus:ring-black"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange('firstName')}
                            className="border-neutral-300 focus:border-black focus:ring-black"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange('lastName')}
                            className="border-neutral-300 focus:border-black focus:ring-black"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Shipping Address */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Shipping Address</h3>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={handleInputChange('address')}
                          className="border-neutral-300 focus:border-black focus:ring-black"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={handleInputChange('city')}
                            className="border-neutral-300 focus:border-black focus:ring-black"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange('postalCode')}
                            className="border-neutral-300 focus:border-black focus:ring-black"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Payment Information</span>
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange('cardNumber')}
                          className="border-neutral-300 focus:border-black focus:ring-black"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleInputChange('expiryDate')}
                            className="border-neutral-300 focus:border-black focus:ring-black"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange('cvv')}
                            className="border-neutral-300 focus:border-black focus:ring-black"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Shield className="h-4 w-4" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-black text-white hover:bg-neutral-800"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : `Complete Purchase • $${total.toLocaleString()}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="border-neutral-200">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex space-x-4">
                        <div className="relative h-16 w-16 bg-neutral-100 rounded overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-neutral-600">{item.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-semibold">${item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shipping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-neutral-200 bg-neutral-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-neutral-600" />
                      <div>
                        <p className="font-semibold">Free Returns</p>
                        <p className="text-sm text-neutral-600">30-day return policy</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-neutral-600" />
                      <div>
                        <p className="font-semibold">Buyer Protection</p>
                        <p className="text-sm text-neutral-600">Every purchase is protected</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Lock className="h-5 w-5 text-neutral-600" />
                      <div>
                        <p className="font-semibold">Secure Payment</p>
                        <p className="text-sm text-neutral-600">256-bit SSL encryption</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}