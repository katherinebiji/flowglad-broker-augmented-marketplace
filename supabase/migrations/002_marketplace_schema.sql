-- Marketplace schema for FlowGlad broker system

-- Create enum types
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'both');
CREATE TYPE product_condition AS ENUM ('new', 'like-new', 'good', 'fair', 'poor');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE negotiation_status AS ENUM ('active', 'accepted', 'declined', 'cancelled', 'expired');
CREATE TYPE deal_status AS ENUM ('pending', 'completed', 'cancelled');

-- Add user role to existing users table (if it doesn't exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'both';

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    condition product_condition NOT NULL,
    images TEXT[], -- Array of image URLs
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product listings table
CREATE TABLE product_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asking_price DECIMAL(10,2) NOT NULL,
    minimum_price DECIMAL(10,2) NOT NULL,
    flexibility_percentage INTEGER NOT NULL CHECK (flexibility_percentage >= 0 AND flexibility_percentage <= 100),
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    special_conditions TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    quantity_available INTEGER DEFAULT 1 CHECK (quantity_available > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_price_range CHECK (minimum_price <= asking_price)
);

-- Buyer requests table
CREATE TABLE buyer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    max_budget DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    desired_condition product_condition[] NOT NULL,
    urgency urgency_level DEFAULT 'medium',
    special_requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Negotiations table
CREATE TABLE negotiations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES product_listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status negotiation_status DEFAULT 'active',
    current_offer DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    broker_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    
    UNIQUE(listing_id, buyer_id) -- One negotiation per buyer per listing
);

-- Negotiation offers table
CREATE TABLE negotiation_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negotiation_id UUID NOT NULL REFERENCES negotiations(id) ON DELETE CASCADE,
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offer_amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    is_counter_offer BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negotiation_id UUID NOT NULL REFERENCES negotiations(id) ON DELETE CASCADE,
    final_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    broker_fee DECIMAL(10,2) DEFAULT 0,
    status deal_status DEFAULT 'pending',
    payment_method VARCHAR(100),
    delivery_method VARCHAR(100),
    completion_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_product_listings_seller ON product_listings(seller_id);
CREATE INDEX idx_product_listings_category ON product_listings(product_id);
CREATE INDEX idx_product_listings_active ON product_listings(is_active);
CREATE INDEX idx_product_listings_price ON product_listings(asking_price, minimum_price);

CREATE INDEX idx_buyer_requests_buyer ON buyer_requests(buyer_id);
CREATE INDEX idx_buyer_requests_category ON buyer_requests(product_category);
CREATE INDEX idx_buyer_requests_active ON buyer_requests(is_active);
CREATE INDEX idx_buyer_requests_budget ON buyer_requests(max_budget);

CREATE INDEX idx_negotiations_listing ON negotiations(listing_id);
CREATE INDEX idx_negotiations_buyer ON negotiations(buyer_id);
CREATE INDEX idx_negotiations_seller ON negotiations(seller_id);
CREATE INDEX idx_negotiations_status ON negotiations(status);

CREATE INDEX idx_negotiation_offers_negotiation ON negotiation_offers(negotiation_id);
CREATE INDEX idx_negotiation_offers_user ON negotiation_offers(from_user_id);

CREATE INDEX idx_deals_negotiation ON deals(negotiation_id);
CREATE INDEX idx_deals_status ON deals(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_listings_updated_at BEFORE UPDATE ON product_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_requests_updated_at BEFORE UPDATE ON buyer_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_negotiations_updated_at BEFORE UPDATE ON negotiations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiation_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Products: Anyone can read, only authenticated users can create/update their own
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Users can create products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own products" ON products FOR UPDATE USING (true); -- Products don't have user association directly

-- Product listings: Anyone can read active listings, sellers can manage their own
CREATE POLICY "Active listings are viewable by everyone" ON product_listings 
    FOR SELECT USING (is_active = true OR seller_id = auth.uid());
CREATE POLICY "Sellers can create listings" ON product_listings 
    FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own listings" ON product_listings 
    FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own listings" ON product_listings 
    FOR DELETE USING (auth.uid() = seller_id);

-- Buyer requests: Buyers can manage their own, sellers can view active ones
CREATE POLICY "Active buyer requests are viewable by authenticated users" ON buyer_requests 
    FOR SELECT USING (auth.role() = 'authenticated' AND (is_active = true OR buyer_id = auth.uid()));
CREATE POLICY "Buyers can create requests" ON buyer_requests 
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update their own requests" ON buyer_requests 
    FOR UPDATE USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can delete their own requests" ON buyer_requests 
    FOR DELETE USING (auth.uid() = buyer_id);

-- Negotiations: Participants can view and update their own negotiations
CREATE POLICY "Users can view their negotiations" ON negotiations 
    FOR SELECT USING (auth.uid() IN (buyer_id, seller_id));
CREATE POLICY "Buyers can create negotiations" ON negotiations 
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants can update negotiations" ON negotiations 
    FOR UPDATE USING (auth.uid() IN (buyer_id, seller_id));

-- Negotiation offers: Participants can view and create offers in their negotiations
CREATE POLICY "Users can view offers in their negotiations" ON negotiation_offers 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM negotiations n 
            WHERE n.id = negotiation_id AND auth.uid() IN (n.buyer_id, n.seller_id)
        )
    );
CREATE POLICY "Users can create offers in their negotiations" ON negotiation_offers 
    FOR INSERT WITH CHECK (
        auth.uid() = from_user_id AND
        EXISTS (
            SELECT 1 FROM negotiations n 
            WHERE n.id = negotiation_id AND auth.uid() IN (n.buyer_id, n.seller_id)
        )
    );

-- Deals: Participants can view their deals
CREATE POLICY "Users can view their deals" ON deals 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM negotiations n 
            WHERE n.id = negotiation_id AND auth.uid() IN (n.buyer_id, n.seller_id)
        )
    );
CREATE POLICY "Users can create deals from their negotiations" ON deals 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM negotiations n 
            WHERE n.id = negotiation_id AND auth.uid() IN (n.buyer_id, n.seller_id)
        )
    );
CREATE POLICY "Users can update their deals" ON deals 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM negotiations n 
            WHERE n.id = negotiation_id AND auth.uid() IN (n.buyer_id, n.seller_id)
        )
    );
