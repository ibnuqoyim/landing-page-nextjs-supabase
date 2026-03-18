# Kudapanmu_ya - Next.js Deployment

## 🚀 Deploy ke Netlify

### 1. Build Project
```bash
npm run build
```

### 2. Deploy ke Netlify
**Option A: Drag & Drop**
- Buka [Netlify](https://app.netlify.com/drop)
- Drag folder `out` ke Netlify

**Option B: Git Push**
```bash
git init
git add .
git commit -m "Deploy Kudapanmu_ya"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### 3. Netlify Configuration
- **Build command:** `npm run build`
- **Publish directory:** `out`
- **Node version:** `20`

## ⚙️ Config yang sudah diset:
- ✅ Static export (`output: 'export'`)
- ✅ Netlify redirects (`netlify.toml`)
- ✅ Image optimization disabled
- ✅ Trailing slash enabled

## 📁 Output Structure:
```
out/
├── index.html (Homepage)
├── cart/index.html (Cart page)
├── order/index.html (Order page)
├── 404.html (Error page)
└── _next/ (Next.js assets)
```

## 🔧 Troubleshooting:
1. **Page not found** → Pastikan publish directory: `out`
2. **Build error** → Coba `npm run build` lagi
3. **CSS tidak load** → Cek file paths di `index.html`
4. **Images tidak muncul** → `unoptimized: true` sudah aktif

## 🌐 Live Site:
Setelah deploy, website akan accessible di:
- Main page: `https://your-site.netlify.app/`
- Cart: `https://your-site.netlify.app/cart`
- Order: `https://your-site.netlify.app/order`
