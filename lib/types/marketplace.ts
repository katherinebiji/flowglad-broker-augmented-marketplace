// Marketplace types for FlowGlad broker system

export type UserRole = 'buyer' | 'seller' | 'both';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  images?: string[];
  specifications?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProductListing {
  id: string;
  product_id: string;
  seller_id: string;
  asking_price: number;
  minimum_price: number;
  flexibility_percentage: number; // How much they're willing to negotiate (0-100)
  currency: string;
  is_active: boolean;
  special_conditions?: string;
  deadline?: string; // When they need to sell by
  quantity_available: number;
  created_at: string;
  updated_at: string;
  // Relations
  product?: Product;
  seller?: any; // User type from Supabase
}

export interface BuyerRequest {
  id: string;
  buyer_id: string;
  product_category: string;
  description: string;
  max_budget: number;
  currency: string;
  desired_condition: string[];
  urgency: 'low' | 'medium' | 'high';
  special_requirements?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  buyer?: any; // User type from Supabase
}

export interface Negotiation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  status: 'active' | 'accepted' | 'declined' | 'cancelled' | 'expired';
  current_offer: number;
  currency: string;
  offer_history: NegotiationOffer[];
  broker_notes?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  // Relations
  listing?: ProductListing;
  buyer?: any;
  seller?: any;
}

export interface NegotiationOffer {
  id: string;
  negotiation_id: string;
  from_user_id: string;
  offer_amount: number;
  message?: string;
  is_counter_offer: boolean;
  created_at: string;
  // Relations
  from_user?: any;
}

export interface Deal {
  id: string;
  negotiation_id: string;
  final_price: number;
  currency: string;
  broker_fee: number;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method?: string;
  delivery_method?: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
  // Relations
  negotiation?: Negotiation;
}

// Chat context types for the broker system
export interface ChatContext {
  user_role?: UserRole;
  active_negotiation_id?: string;
  viewing_listing_id?: string;
  current_action?: 'listing' | 'buying' | 'negotiating' | 'browsing';
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Form types
export interface CreateListingForm {
  product: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
  asking_price: number;
  minimum_price: number;
  flexibility_percentage: number;
  currency: string;
  special_conditions?: string;
  deadline?: string;
  quantity_available: number;
}

export interface CreateBuyerRequestForm {
  product_category: string;
  description: string;
  max_budget: number;
  currency: string;
  desired_condition: string[];
  urgency: 'low' | 'medium' | 'high';
  special_requirements?: string;
}

export interface MakeOfferForm {
  listing_id: string;
  offer_amount: number;
  message?: string;
}

// Search and filter types
export interface ListingFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  condition?: string[];
  seller_id?: string;
  is_active?: boolean;
}

export interface BuyerRequestFilters {
  category?: string;
  min_budget?: number;
  max_budget?: number;
  urgency?: string[];
  buyer_id?: string;
  is_active?: boolean;
}
