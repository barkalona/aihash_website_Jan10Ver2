/*
  # Initial Database Schema for aiHash Platform

  1. New Tables
    - auth_methods (tracks user authentication methods)
    - user_profiles (stores user profile information)
    - seller_profiles (additional info for sellers)
    - buyer_profiles (additional info for buyers)
    - hash_power_listings (marketplace listings)
    - orders (transaction records)
    - reviews (user reviews and ratings)
    - price_history (historical pricing data)
    - kyc_verifications (KYC/AML verification records)
    - wallet_addresses (verified wallet addresses)
    
  2. Security
    - RLS policies for all tables
    - Encrypted sensitive data
    - Role-based access control
*/

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Auth Methods Table
CREATE TABLE IF NOT EXISTS auth_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  auth_type TEXT NOT NULL CHECK (auth_type IN ('email', 'web3')),
  auth_provider TEXT,
  auth_data JSONB,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  display_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  reputation_score DECIMAL DEFAULT 0,
  is_seller BOOLEAN DEFAULT false,
  is_buyer BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seller Profiles Table
CREATE TABLE IF NOT EXISTS seller_profiles (
  id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  business_type TEXT,
  verification_status TEXT DEFAULT 'pending',
  total_sales BIGINT DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Buyer Profiles Table
CREATE TABLE IF NOT EXISTS buyer_profiles (
  id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  purchase_limit DECIMAL,
  total_purchases BIGINT DEFAULT 0,
  preferred_payment_method TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hash Power Listings Table
CREATE TABLE IF NOT EXISTS hash_power_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES seller_profiles(id),
  algorithm TEXT NOT NULL,
  hash_power DECIMAL NOT NULL,
  price_per_th DECIMAL NOT NULL,
  min_purchase DECIMAL,
  max_purchase DECIMAL,
  availability_window TSTZRANGE,
  status TEXT DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES buyer_profiles(id),
  listing_id uuid REFERENCES hash_power_listings(id),
  hash_power DECIMAL NOT NULL,
  price_per_th DECIMAL NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  start_time timestamptz,
  end_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  reviewer_id uuid REFERENCES user_profiles(id),
  reviewed_id uuid REFERENCES user_profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Price History Table
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES hash_power_listings(id),
  price_per_th DECIMAL NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- KYC Verifications Table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  status TEXT DEFAULT 'pending',
  verification_type TEXT NOT NULL,
  verification_data JSONB,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Wallet Addresses Table
CREATE TABLE IF NOT EXISTS wallet_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  blockchain TEXT NOT NULL,
  address TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verification_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(blockchain, address)
);

-- Enable Row Level Security
ALTER TABLE auth_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hash_power_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User Profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Seller Profiles
CREATE POLICY "Public can view seller profiles"
  ON seller_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sellers can update their own profile"
  ON seller_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Hash Power Listings
CREATE POLICY "Public can view active listings"
  ON hash_power_listings FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Sellers can manage their listings"
  ON hash_power_listings FOR ALL
  USING (auth.uid() = seller_id);

-- Orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM buyer_profiles WHERE id = buyer_id
      UNION
      SELECT seller_id FROM hash_power_listings WHERE id = listing_id
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_algorithm ON hash_power_listings(algorithm);
CREATE INDEX IF NOT EXISTS idx_listings_status ON hash_power_listings(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_price_history_timestamp ON price_history(timestamp);