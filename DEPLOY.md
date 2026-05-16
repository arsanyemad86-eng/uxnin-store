# UXNIN — build & deploy

## Project layout

```
frontend/
├─ index.html              ← Vite entry (loads /src/main.jsx)
├─ vite.config.js          ← base: '/uxnin-store/', emptyOutDir: false
├─ package.json
├─ public/
│  ├─ .nojekyll            ← copied to dist on every build (GH Pages)
│  └─ 404.html             ← SPA fallback for deep links
├─ scripts/
│  └─ deploy.mjs           ← build + force-push to gh-pages master
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ index.css
│  ├─ context/AppContext.jsx
│  ├─ data/products.js
│  ├─ components/  (Navbar, Announcement, Footer, WishlistDrawer,
│  │                SearchDropdown, ProductCard, Icon)
│  └─ pages/       (Home, Shop, Cart, Products, Dashboard, Contact)
└─ dist/                   ← Vite build output + image folders
   ├─ creatine/  whey-protein/  mass/  pre-workout/  vitamins/  beta-alanine/
   └─ Banner_3.jpg, Limitless-Banner.png, OIP.webp, Best-seller-_-AR.png
```

## Run locally

```bash
cd C:\programming\project-CV\uxnin-project\frontend
npm install   # if a fresh install is ever needed
npm run dev   # Vite dev server, opens on http://localhost:5173/uxnin-store/
```

## Build

```bash
npm run build
```

Vite writes the bundled `index.html` and `assets/` into `dist/`. The existing
image subfolders survive because `vite.config.js` has `emptyOutDir: false`.

## Deploy to GitHub Pages (one shot)

```bash
npm run deploy:gh
```

This runs `npm run build`, drops `.nojekyll` into `dist/`, then force-pushes
the `dist/` folder to `master` on `https://github.com/arsanyemad86-eng/uxnin-store`.

After the first push, enable GitHub Pages in the repo settings:
**Settings → Pages → Source = Deploy from a branch → master → / (root) → Save.**

Live URL: `https://arsanyemad86-eng.github.io/uxnin-store/`

## Manual deploy (equivalent commands)

If you'd rather run the deploy steps by hand:

```bash
# 1. Build
npm run build

# 2. Push the dist folder to master, force
cd dist
git init -b master
git add -A
git commit -m "deploy: UXNIN store"
git remote add origin https://github.com/arsanyemad86-eng/uxnin-store.git
git push -f origin master
cd ..
```

## Notes

- **Routing** uses hash-based URLs (`#/shop`, `#/products/101`) so the site works
  on GitHub Pages without server-side rewrite rules. The `404.html` SPA shim
  in `public/` redirects deep paths back to the hash router.
- **Dark mode** is persisted in `localStorage["uxnin.theme"]`.
- **Cart, wishlist, and orders** are persisted in `localStorage`
  (`uxnin.cart`, `uxnin.wishlist`, `uxnin.orders`). The Dashboard reads these
  in real time.
- **Promo code:** `FIT10` → 10% off the order subtotal.
- **Free shipping** kicks in automatically over `LE 300`.
