'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CreateListingForm } from '@/lib/types/marketplace';

interface ProductListingFormProps {
  onSubmit: (listing: CreateListingForm) => void;
  onCancel: () => void;
}

export default function ProductListingForm({ onSubmit, onCancel }: ProductListingFormProps) {
  const [formData, setFormData] = useState<CreateListingForm>({
    product: {
      name: '',
      description: '',
      category: '',
      condition: 'good',
      specifications: {}
    },
    asking_price: 0,
    minimum_price: 0,
    flexibility_percentage: 10,
    currency: 'USD',
    quantity_available: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.product.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.product.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.product.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.asking_price <= 0) {
      newErrors.asking_price = 'Asking price must be greater than 0';
    }
    
    if (formData.minimum_price <= 0) {
      newErrors.minimum_price = 'Minimum price must be greater than 0';
    }
    
    if (formData.minimum_price > formData.asking_price) {
      newErrors.minimum_price = 'Minimum price cannot be higher than asking price';
    }
    
    if (formData.flexibility_percentage < 0 || formData.flexibility_percentage > 100) {
      newErrors.flexibility_percentage = 'Flexibility must be between 0-100%';
    }
    
    if (formData.quantity_available < 1) {
      newErrors.quantity_available = 'Quantity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateProductField = (field: keyof CreateListingForm['product'], value: any) => {
    setFormData(prev => ({
      ...prev,
      product: {
        ...prev.product,
        [field]: value
      }
    }));
  };

  const updateField = (field: keyof Omit<CreateListingForm, 'product'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateFlexibilityRange = () => {
    const flexAmount = (formData.asking_price * formData.flexibility_percentage) / 100;
    const minFlexPrice = Math.max(formData.asking_price - flexAmount, formData.minimum_price);
    return minFlexPrice;
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">List Your Product</h2>
        <p className="text-muted-foreground">
          Provide details about your product and set your pricing preferences. 
          Our broker will help negotiate within your flexibility range.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Information</h3>
          
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.product.name}
              onChange={(e) => updateProductField('name', e.target.value)}
              placeholder="e.g., iPhone 14 Pro Max 256GB"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.product.category}
              onChange={(e) => updateProductField('category', e.target.value)}
              placeholder="e.g., Electronics, Clothing, Books"
              className={errors.category ? 'border-red-500' : ''}
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <Label htmlFor="condition">Condition *</Label>
            <select
              id="condition"
              value={formData.product.condition}
              onChange={(e) => updateProductField('condition', e.target.value as any)}
              className="w-full p-2 border border-input rounded-md bg-background"
            >
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.product.description}
              onChange={(e) => updateProductField('description', e.target.value)}
              placeholder="Describe your product's features, condition, and any included accessories..."
              rows={4}
              className={`w-full p-2 border border-input rounded-md bg-background ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pricing & Flexibility</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asking_price">Asking Price * ($)</Label>
              <Input
                id="asking_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.asking_price}
                onChange={(e) => updateField('asking_price', parseFloat(e.target.value) || 0)}
                placeholder="1000.00"
                className={errors.asking_price ? 'border-red-500' : ''}
              />
              {errors.asking_price && <p className="text-red-500 text-sm mt-1">{errors.asking_price}</p>}
            </div>

            <div>
              <Label htmlFor="minimum_price">Minimum Acceptable Price * ($)</Label>
              <Input
                id="minimum_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.minimum_price}
                onChange={(e) => updateField('minimum_price', parseFloat(e.target.value) || 0)}
                placeholder="800.00"
                className={errors.minimum_price ? 'border-red-500' : ''}
              />
              {errors.minimum_price && <p className="text-red-500 text-sm mt-1">{errors.minimum_price}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="flexibility_percentage">
              Negotiation Flexibility: {formData.flexibility_percentage}%
            </Label>
            <input
              id="flexibility_percentage"
              type="range"
              min="0"
              max="50"
              step="1"
              value={formData.flexibility_percentage}
              onChange={(e) => updateField('flexibility_percentage', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>Less flexible</span>
              <span>More flexible</span>
            </div>
            {formData.asking_price > 0 && (
              <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Negotiation Range:</strong> ${calculateFlexibilityRange().toFixed(2)} - ${formData.asking_price.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  The broker can negotiate within this range while respecting your minimum price.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity_available">Quantity Available *</Label>
              <Input
                id="quantity_available"
                type="number"
                min="1"
                value={formData.quantity_available}
                onChange={(e) => updateField('quantity_available', parseInt(e.target.value) || 1)}
                className={errors.quantity_available ? 'border-red-500' : ''}
              />
              {errors.quantity_available && <p className="text-red-500 text-sm mt-1">{errors.quantity_available}</p>}
            </div>

            <div>
              <Label htmlFor="deadline">Sale Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline || ''}
                onChange={(e) => updateField('deadline', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="special_conditions">Special Conditions (Optional)</Label>
            <textarea
              id="special_conditions"
              value={formData.special_conditions || ''}
              onChange={(e) => updateField('special_conditions', e.target.value)}
              placeholder="Any special terms, pickup requirements, warranties, etc."
              rows={3}
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1">
            🏷️ List Product
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
