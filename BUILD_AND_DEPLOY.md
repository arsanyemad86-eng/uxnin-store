# UXNIN — Build & Deploy

## 1. Project layout

```
frontend/
├── index.html              # Vite entry
├── package.json
├── vite.config.js          # base: '/uxnin-store/'  +  emptyOutDir: false
├── .gitignore
├── scripts/
│   └── deploy.mjs          # one-shot build + force-push to gh-pages
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css           # design tokens (--navy/--teal/--coral/--sky/--amber)
│   ├── data/products.js    # 60+ products across 6 categories + seed orders
│   ├── context/
│   │   └── AppContext.jsx  # routing, theme, cart, wishlist, orders, toast
│   ├── components/
│   │   ├── Announcement.jsx
│   │   ├── Footer.jsx
│   │   ├── Icon.jsx
│   │   ├── Navbar.jsx              # sticky + dark mode + search dropdown + cart/wishlist badges
│   │   ├── ProductCard.jsx
│   │   ├── SearchDropdown.jsx      # filterable, real-time
│   │   └── WishlistDrawer.jsx      # slide-in from right
│   └── pages/
│       ├── Home.jsx
│       ├── Shop.jsx        # grid + sticky cart panel + category pills + promo (FIT10)
│       ├── Cart.jsx
│       ├── Products.jsx    # product detail page
│       ├── Dashboard.jsx   # stat cards + Chart.js bar + donut + orders table
│       └── Contact.jsx
└── dist/
    ├── index.html          # PRE-BUILT, works without npm — uses React via CDN
    ├── 404.html            # gh-pages SPA fallback
    ├── .nojekyll
    ├── creatine/  …images…
    ├── whey-protein/ …
    ├── mass/ …
    ├── pre-workout/ …
    ├── vitamins/ …
    ├── beta-alanine/ …
    └── Banner_3.jpg, Limitless-Banner.png, OIP.webp, Best-seller-_-AR.png
```

## 2. Build (run on your machine)

```powershell
cd C:\programming\project-CV\uxnin-project\frontend
npm install            # only if node_modules is missing
npm run build          # produces dist/ (keeps image folders intact — emptyOutDir: false)
```

`dist/` is already populated. The build step replaces `dist/index.html` and `dist/assets/` with the Vite-bundled output but leaves all image folders untouched (`emptyOutDir: false`).

> **Tip:** If you skip `npm run build`, the existing `dist/index.html` is a fully working standalone version that loads React, Babel, and Chart.js from CDN. It deploys as-is.

## 3. Force-push the dist folder to `master`

### Option A — One command (recommended)

```powershell
cd C:\programming\project-CV\uxnin-project\frontend
npm run deploy:gh
```

This runs `scripts/deploy.mjs`, which:
1. Runs `npm run build`
2. Writes `dist/.nojekyll`
3. `cd dist`, inits a fresh git repo, commits everything, and force-pushes to `master` on `https://github.com/arsanyemad86-eng/uxnin-store`.

### Option B — Manual

```powershell
cd C:\programming\project-CV\uxnin-project\frontend
npm run build

cd dist
if (Test-Path .git) { Remove-Item .git -Recurse -Force }
git init -b master
git config user.email "arsanyemad86@gmail.com"
git config user.name  "arsany"
git add -A
git commit -m "deploy: UXNIN store"
git remote add origin https://github.com/arsanyemad86-eng/uxnin-store.git
git push -f origin master
```

## 4. Enable GitHub Pages

Once after the first push:
- Open `https://github.com/arsanyemad86-eng/uxnin-store/settings/pages`
- Source: **Deploy from a branch**
- Branch: **master** · Folder: **/ (root)** · Save

Live URL: **`https://arsanyemad86-eng.github.io/uxnin-store/`**

## 5. Verification checklist

After deployment, verify each feature on the live site:

- [ ] Announcement bar: "Free delivery on orders over LE 300"
- [ ] Sticky navbar with shadow on scroll
- [ ] Dark mode toggle persists across reloads (`localStorage` key `uxnin.theme`)
- [ ] Search dropdown filters by category (chips) and real-time query
- [ ] Page transitions: opacity fade between routes
- [ ] Wishlist drawer slides in from the right with backdrop
- [ ] Shop: category pills filter the grid; sticky cart panel updates live
- [ ] Promo code `FIT10` applies a 10% discount
- [ ] Cart page: add / remove / quantity controls work
- [ ] Dashboard: stat cards reflect localStorage `uxnin.orders`
- [ ] Dashboard: Chart.js bar (weekly sales) + donut (catalog by category) render
- [ ] Orders table visible
- [ ] Contact page: form fields, validation, submit feedback
- [ ] All 60+ product images load
