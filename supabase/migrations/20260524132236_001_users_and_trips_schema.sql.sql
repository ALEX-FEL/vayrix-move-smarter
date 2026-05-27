/*
  # Create users and trips tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `phone` (text, unique, not null)
      - `first_name` (text, not null)
      - `last_name` (text, not null)
      - `avatar_url` (text, nullable)
      - `language` (text, default 'fr')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `trips`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `driver_name` (text, not null)
      - `driver_rating` (numeric, default 4.5)
      - `vehicle_plate` (text, not null)
      - `origin_address` (text, not null)
      - `origin_lat` (numeric, not null)
      - `origin_lng` (numeric, not null)
      - `destination_address` (text, not null)
      - `destination_lat` (numeric, not null)
      - `destination_lng` (numeric, not null)
      - `price` (integer, not null)
      - `status` (text, default 'completed')
      - `created_at` (timestamptz, default now())
      - `completed_at` (timestamptz, nullable)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only read and update their own profile
    - Users can only read and create their own trips
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text,
  language text DEFAULT 'fr' CHECK (language IN ('fr', 'en')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  driver_name text NOT NULL,
  driver_rating numeric DEFAULT 4.5,
  vehicle_plate text NOT NULL,
  origin_address text NOT NULL,
  origin_lat numeric NOT NULL,
  origin_lng numeric NOT NULL,
  destination_address text NOT NULL,
  destination_lat numeric NOT NULL,
  destination_lng numeric NOT NULL,
  price integer NOT NULL,
  status text DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own trips"
  ON trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_created_at ON trips(created_at);
