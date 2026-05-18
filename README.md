# UXNIN

Premium fitness supplements e-commerce storefront — multi-page React app with cart, wishlist, checkout, and a live analytics dashboard.

## Live Demo

https://arsanyemad86-eng.github.io/uxnin-store/

> Replace the link above with your deployed GitHub Pages URL.

## Features

- Shopping cart with quantity controls and persistent state
- Wishlist drawer (add/remove, count badge)
- 3-step checkout flow (review → details → confirm) with form validation
- Dashboard with revenue, orders, AOV, customers, weekly sales chart and category donut
- Dark mode toggle (theme persisted in localStorage)
- Promo code system (e.g. `FIT10` → 10% off)
- Product search with live dropdown suggestions
- URL hash routing with deep links (e.g. `#/products/<id>`, `#/shop`)
- Toast notifications and a responsive layout

## Tech Stack

- HTML5 and CSS3 (custom properties for theming: `--navy`, `--teal`, `--coral`, `--sky`, `--amber`)
- JavaScript (ES2022)
- React 18 + Vite (build tool and dev server)
- Chart.js 4 (dashboard visualizations)
- localStorage (cart, wishlist, orders, user, theme persistence)

No backend — the app is fully client-side.

## Project Structure

```
frontend/
├── index.html               # Vite entry HTML
├── package.json             # Scripts and dependencies
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Router + layout shell
│   ├── index.css            # Global styles and theme tokens
│   ├── components/          # Shared UI (Navbar, Footer, ProductCard, etc.)
│   ├── context/
│   │   └── AppContext.jsx   # Global state (cart, wishlist, orders, theme)
│   ├── data/
│   │   └── products.js      # Product catalog and seed orders
│   └── pages/               # Home, Shop, Products, Cart, Checkout,
│                            # Dashboard, Login, Register, Contact
└── dist/                    # Production build output (generated)
```

## Run Locally

Prerequisites: Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build
npm run preview
```

The dev server runs on `http://localhost:5173` by default.

## Deployment

The project is configured for GitHub Pages:

```bash
npm run deploy:gh
```
