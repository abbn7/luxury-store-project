# 🛍️ Luxe Store — متجر فاخر

متجر إلكتروني فاخر مبني بـ Next.js 14، Tailwind CSS، وSupabase.

## 🚀 خطوات التشغيل

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. إعداد Supabase
1. افتح [Supabase Dashboard](https://supabase.com/dashboard)
2. انتقل إلى SQL Editor
3. انسخ محتوى ملف `supabase-setup.sql` وشغله لإنشاء الجدول والبيانات التجريبية

### 3. متغيرات البيئة
ملف `.env.local` موجود بالفعل مع المفاتيح الصحيحة.

للتغيير:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourstore.com
```

### 4. تشغيل المشروع
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Mode

1. انتقل إلى أسفل الصفحة (Footer)
2. اضغط على النقطة الصغيرة في الركن الأيمن السفلي
3. اكتب الإيميل المحدد في `NEXT_PUBLIC_ADMIN_EMAIL`
4. سيظهر شريط Admin في أعلى الصفحة

## 📦 النشر على Vercel

```bash
npm run build
```

ثم ارفع على GitHub وانشر من Vercel مباشرة.

## 📁 هيكل المشروع

```
luxury-store/
├── app/
│   ├── layout.js
│   ├── page.js          ← الصفحة الرئيسية
│   ├── cart/page.js     ← السلة
│   └── product/[id]/    ← تفاصيل المنتج
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx       ← Admin input مخفي هنا
│   ├── ProductCard.jsx
│   ├── AdminModal.jsx
│   └── ThemeToggle.jsx
├── lib/
│   └── supabase.js      ← CRUD operations
└── supabase-setup.sql   ← SQL لإنشاء الجدول
```
