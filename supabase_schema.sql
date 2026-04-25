-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT,
  size TEXT NOT NULL,
  details TEXT,
  image_url TEXT,
  unit TEXT NOT NULL,
  price NUMERIC,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure sku column exists if the table was created previously
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;

-- Create the Storage Bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');


-- Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  business_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quotation Items Table
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Initial Settings
INSERT INTO site_settings (key, value) VALUES ('whatsapp_number', '8801711763315') ON CONFLICT (key) DO NOTHING;

-- RLS (Row Level Security) - Basic setup
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public Access Policies
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read on settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on quotations" ON quotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on quotation_items" ON quotation_items FOR INSERT WITH CHECK (true);

-- Admin (Authenticated) Access Policies
CREATE POLICY "Allow admin CRUD on products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin CRUD on settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin CRUD on quotations" ON quotations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin CRUD on quotation_items" ON quotation_items FOR ALL USING (auth.role() = 'authenticated');
