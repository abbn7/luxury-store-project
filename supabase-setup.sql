-- Run this SQL in your Supabase SQL Editor to create the products table

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  old_price DECIMAL(10,2),
  image TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- Allow anyone to insert/update/delete (since admin is client-side)
CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

-- Insert sample products
INSERT INTO products (name, description, price, old_price, image, stock) VALUES
  ('حقيبة جلدية فاخرة', 'حقيبة يد فاخرة مصنوعة من أجود أنواع الجلد الإيطالي، تصميم أنيق يناسب كل المناسبات', 1200, 1800, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop', 5),
  ('ساعة ذهبية كلاسيك', 'ساعة يد فاخرة بإطار ذهبي وميناء أبيض نقي، دقة سويسرية عالية', 3500, 4200, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop', 3),
  ('عطر الملوك', 'عطر فاخر ينبثق من قلب العود الأصيل مع لمسات من الورد والياسمين', 850, NULL, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop', 10),
  ('نظارات فاخرة', 'نظارات شمسية بإطار ذهبي وعدسات مستقطبة بنسبة حماية UV 100%', 650, 900, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop', 7),
  ('حذاء جلدي إيطالي', 'حذاء رجالي فاخر مصنوع يدوياً من الجلد الإيطالي الأصيل', 1450, NULL, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop', 4),
  ('وشاح حرير', 'وشاح من الحرير الطبيعي بألوان متدرجة وتصميم فريد من نوعه', 420, 580, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop', 12);
