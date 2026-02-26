-- ═══════════════════════════════════════════════
-- Luxe Store — Supabase Setup
-- شغّل هذا الملف في SQL Editor في Supabase
-- ═══════════════════════════════════════════════

-- 1. إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL DEFAULT 0,
  old_price   DECIMAL(10,2),
  image       TEXT,
  images      JSONB DEFAULT '[]'::jsonb,
  stock       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all" ON products;
CREATE POLICY "public_all" ON products FOR ALL USING (true) WITH CHECK (true);

-- 3. Storage bucket for product images (optional)
-- اذهب إلى Storage في Supabase وأنشئ bucket جديد اسمه "products"
-- اجعله Public ليمكن عرض الصور مباشرة

-- 4. منتجات تجريبية
INSERT INTO products (name, description, price, old_price, image, images, stock) VALUES
  ('حقيبة جلدية فاخرة',  'حقيبة يد من الجلد الطبيعي الإيطالي، تصميم كلاسيكي أنيق يناسب جميع الإطلالات', 2500,  3800,  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1594938298603-c8148c4b4061?w=800&auto=format&fit=crop"]', 5),
  ('ساعة كلاسيك ذهبية',   'ساعة يد فاخرة بإطار ذهبي وآلية سويسرية دقيقة، مقاومة للماء حتى 50 متر',       5800,  7200,  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop"]', 3),
  ('عطر الفخامة',          'عطر شرقي فاخر من العود الأصيل مع مزيج من الورد الطائفي والمسك الأبيض',       1200,  NULL,  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop"]', 12),
  ('نظارات شمسية فاخرة',  'إطار إيطالي خالص مع عدسات مستقطبة توفر حماية UV 400 الكاملة',                 950,   1400,  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop"]', 7),
  ('حذاء رجالي إيطالي',   'حذاء مصنوع يدوياً من الجلد الإيطالي الأصيل، مريح وأنيق للمناسبات الرسمية',   3200,  NULL,  'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop"]', 4),
  ('وشاح حرير طبيعي',     'وشاح من الحرير الطبيعي الخالص بألوان متدرجة راقية، مثالي لجميع الفصول',       780,   1100,  'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop"]', 8);
