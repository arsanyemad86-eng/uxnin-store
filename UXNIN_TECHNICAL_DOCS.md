# UXNIN Store — Full Technical Documentation

> **Purpose:** This document is your complete reference for explaining every part of this project to a senior developer or HR interviewer. It covers architecture, data flow, design decisions, and interview-ready answers.

---

## 1. Project Overview

**What is this project?**
UXNIN Store is a full-featured, single-page e-commerce application for premium fitness supplements targeting the Egyptian market. It is built entirely in React 18 with Vite as the build tool and requires no backend — all state is persisted via `localStorage`. The app simulates a real fitness supplement store with product browsing, cart management, wishlists, a checkout wizard, authentication, and an analytics dashboard.

**Tech Stack**

| Layer | Technology |
|---|---|
| UI Framework | React 18.3 (functional components, hooks) |
| Build Tool | Vite 5.4 |
| Routing | Custom hash-based router (no React Router) |
| State Management | React Context API + `useLocalStorage` hook |
| Charts | Chart.js 4.4 + react-chartjs-2 |
| Styling | Vanilla CSS with CSS custom properties (design tokens) |
| Deployment | GitHub Pages via `gh-pages` package |
| Package Manager | npm (ESM modules, `"type": "module"`) |

**Core Purpose and User Flow**

A user lands on the Home page → browses categories → filters and searches products in Shop → views a product detail page → adds items to cart → applies a promo code → completes a 3-step checkout wizard → sees their order appear on the Dashboard. Users can also register/login to persist their identity, and save products to a wishlist accessible from a slide-in drawer anywhere in the app.

---

## 2. Project Structure Map

### File List

```
src/
├── main.jsx                  — App entry point; mounts React root with providers
├── App.jsx                   — Central router; maps route strings to page components
├── index.css                 — Global design system (CSS variables, themes, reusable classes)
│
├── context/
│   └── AppContext.jsx         — Single global state store (cart, wishlist, orders, user, theme, routing, toast)
│
├── data/
│   └── products.js           — Static data: PRODUCTS array, CATEGORIES, ORDERS_SEED, HERO_IMAGE
│
├── components/
│   ├── Announcement.jsx      — Fixed top banner strip (promo message)
│   ├── Navbar.jsx            — Responsive navigation bar + mobile drawer + search
│   ├── Footer.jsx            — Site footer with category and company links
│   ├── ProductCard.jsx       — Reusable product tile (image, price, add-to-cart, wishlist)
│   ├── WishlistDrawer.jsx    — Slide-in wishlist panel (overlay + aside)
│   ├── SearchDropdown.jsx    — Search popup with category filter chips
│   └── Icon.jsx              — SVG icon system (inline SVG paths by name key)
│
└── pages/
    ├── Home.jsx              — Landing page: hero, categories, best sellers, new arrivals
    ├── Shop.jsx              — Filterable product grid + inline cart summary panel
    ├── Products.jsx          — Dual-role: product detail view OR full catalog listing
    ├── Cart.jsx              — Dedicated cart page with promo code and order summary
    ├── Checkout.jsx          — 3-step wizard: review → delivery details → confirm & place
    ├── Dashboard.jsx         — Admin analytics: stat cards + bar chart + donut chart + orders table
    ├── Login.jsx             — Authentication: email/password sign-in with validation
    ├── Register.jsx          — Authentication: registration with password strength meter
    └── Contact.jsx           — Contact form + store info cards
```

### ASCII Architecture Map

```
index.html
    └── main.jsx  (ReactDOM.createRoot)
            └── AppProvider  (AppContext.jsx — global state)
                    └── App.jsx  (hash router → renders Page)
                            │
                            ├── [AUTH routes — no chrome]
                            │       ├── Login.jsx
                            │       └── Register.jsx
                            │
                            └── [Standard routes — with chrome]
                                    ├── Announcement.jsx  (fixed top)
                                    ├── Navbar.jsx        (fixed nav)
                                    │       └── SearchDropdown.jsx (popup)
                                    │
                                    ├── <main>  (current Page)
                                    │       ├── Home.jsx
                                    │       │       └── ProductCard.jsx ──┐
                                    │       ├── Shop.jsx                  │
                                    │       │       └── ProductCard.jsx ──┤
                                    │       ├── Products.jsx              │  all read from
                                    │       │       └── ProductCard.jsx ──┤  data/products.js
                                    │       ├── Cart.jsx                  │
                                    │       ├── Checkout.jsx              │
                                    │       ├── Dashboard.jsx ────────────┘
                                    │       └── Contact.jsx
                                    │
                                    ├── Footer.jsx
                                    └── WishlistDrawer.jsx  (fixed overlay)

STATE FLOW:
AppContext.jsx
    ├── reads/writes → localStorage (cart, wishlist, orders, user, theme)
    ├── exposes → navigate(), addToCart(), toggleWishlist(), placeOrder(), pushToast()
    └── consumed by → ALL pages and components via useApp()
```

---

## 3. File-by-File Deep Dive

---

### `src/main.jsx`

**Purpose:** The single entry point. It bootstraps React, wraps the entire app in `AppProvider` (so every component can access global state), and mounts to `#root` in `index.html`.

**Key Sections:**
- `ReactDOM.createRoot(...)` — React 18 concurrent-mode root
- `<React.StrictMode>` — Enables double-rendering in dev to catch side effects
- `<AppProvider>` — Wraps App so Context is available everywhere

**Step-by-step logic:**
1. Vite compiles `main.jsx` as the module entry point.
2. `ReactDOM.createRoot` finds the `<div id="root">` element.
3. It renders `<AppProvider>` first, which initializes all global state from `localStorage`.
4. Inside it renders `<App />`, which reads the current hash route and displays the matching page.

**Dependencies:** `react`, `react-dom/client`, `App.jsx`, `AppContext.jsx`, `index.css`

**Potential HR Question:**
> *"Why do you wrap App in AppProvider at the root level instead of inside App itself?"*

**Model Answer:** "The provider needs to be the outermost wrapper so its context value is available to every component in the tree — including App itself. If I wrapped it inside App, App's own code (like reading `route` from context) would run before the provider is mounted, resulting in a null context error. Putting it in `main.jsx` guarantees the context exists before any child component renders."

---

### `src/App.jsx`

**Purpose:** Acts as the application's router. It reads the current `route` from context and renders the matching page component from a plain JavaScript object map — no third-party routing library needed.

**Key Sections:**

```js
const PAGES = {
  home: Home, shop: Shop, cart: Cart, products: Products,
  dashboard: Dashboard, contact: Contact, login: Login,
  register: Register, checkout: Checkout,
};
const AUTH_ROUTES = ["login", "register"];
```

- `PAGES` object — maps route string keys to component references
- `AUTH_ROUTES` array — determines which routes render without the navigation chrome
- `animKey` — a key derived from `route + params[0]` forces React to unmount/remount the page on navigation, creating a clean transition

**Step-by-step logic:**
1. `useApp()` pulls `{ route, params }` from context (derived from `window.location.hash`)
2. `PAGES[route] || Home` resolves the correct component (falls back to Home for unknown routes)
3. If the route is in `AUTH_ROUTES`, renders only `<main><Page/></main>` — no Navbar or Footer
4. Otherwise renders the full layout: Announcement → Navbar → main → Footer → WishlistDrawer

**Dependencies:** All page components, `Navbar`, `Footer`, `Announcement`, `WishlistDrawer`, `AppContext`

**Potential HR Question:**
> *"You built a custom router with a plain object map instead of React Router. What are the trade-offs of this approach?"*

**Model Answer:** "For a hash-based SPA without nested routes or route guards, a PAGES object is simpler, more readable, and eliminates a dependency. The trade-off is that it doesn't support advanced features like nested layouts, lazy loading, or route-level code splitting without extra work. React Router would be the right choice if the app needed protected routes, URL params parsing, or multiple nested layouts — but for this project the custom approach is lean and sufficient."

---

### `src/context/AppContext.jsx`

**Purpose:** The single source of truth for the entire application. It manages routing, theme, cart, wishlist, orders, user authentication state, toast notifications, and the wishlist drawer — and persists key data to `localStorage`.

**Key Sections / Functions:**

| Function | Responsibility |
|---|---|
| `useLocalStorage(key, initial)` | Generic hook that syncs state to `localStorage` via `useEffect` |
| `parseHash()` | Parses `window.location.hash` into `{ route, params }` |
| `navigate(path)` | Programmatic navigation by setting `window.location.hash` |
| `addToCart(p, qty)` | Adds item or increments quantity if item already exists |
| `removeFromCart(id)` | Filters item out of cart array |
| `updateQty(id, qty)` | Updates quantity; removes item if qty ≤ 0 |
| `clearCart()` | Resets cart to empty array |
| `toggleWishlist(p)` | Adds or removes a product from the wishlist |
| `isWished(id)` | Returns boolean — checks if product ID is in wishlist |
| `placeOrder(total)` | Creates a new order object, prepends to orders array, clears cart |
| `pushToast(msg)` | Shows a brief notification overlay; auto-dismisses after 2 seconds |
| `logout()` | Clears user state and navigates to home |

**Step-by-step logic:**
1. On mount, `parseHash()` reads the current URL to determine the initial route.
2. `useLocalStorage` reads five keys from `localStorage` to hydrate initial state.
3. A `hashchange` event listener updates `route` and `params` on every navigation.
4. `theme` changes are applied directly to `document.documentElement.dataset.theme`.
5. All cart/wishlist operations use the functional form of `setState` to avoid stale closure bugs.
6. `placeOrder` generates a sequential order ID using `"UX-" + (2849 + orders.length)`.
7. The toast system uses `useRef` to hold the `setTimeout` ID and cancel it if a new toast fires before the previous one expires.
8. The entire `value` object is passed to `AppCtx.Provider`, plus a JSX toast element rendered directly inside the provider.

**Dependencies:** `products.js` (for `ORDERS_SEED`), `Icon.jsx` (for the toast checkmark)

**Potential HR Question:**
> *"Your `useLocalStorage` hook syncs state to localStorage in a `useEffect`. What happens on the very first render — is there a race condition?"*

**Model Answer:** "No. The initial state is hydrated synchronously in the `useState` initializer function — `() => JSON.parse(localStorage.getItem(key))`. The `useEffect` only handles writes that happen after state changes. So the first render already has the correct state from storage, and the effect just keeps them in sync going forward. The only real risk would be if localStorage throws — which is caught with a try/catch."

---

### `src/data/products.js`

**Purpose:** The application's static data layer. Contains the full product catalog, category metadata, a seed dataset for orders, and the hero image reference.

**Key Exports:**

| Export | Type | Contents |
|---|---|---|
| `PRODUCTS` | Array[64] | All products with `id`, `name`, `brand`, `category`, `price`, `oldPrice`, `image`, `rating`, `stock`, `badge` |
| `CATEGORIES` | Array[7] | Category definitions with `key`, `name`, `icon` |
| `ORDERS_SEED` | Array[8] | Pre-seeded orders shown before a user places any real ones |
| `HERO_IMAGE` | String | Path to the homepage hero banner image |

**Step-by-step logic:**
1. `const B = import.meta.env.BASE_URL` reads Vite's base URL (`/uxnin-store/` in production).
2. All image paths are constructed as `B + "category/filename.png"` — making them work both locally (`/`) and on GitHub Pages (`/uxnin-store/`).
3. Products are grouped by category (ids 101–112 = whey, 201–212 = creatine, 301–310 = mass, 401–410 = pre-workout, 501–513 = vitamins, 601–604 = beta-alanine).

**Dependencies:** None (pure data). `import.meta.env.BASE_URL` is a Vite compile-time value.

**Potential HR Question:**
> *"Why use `import.meta.env.BASE_URL` for image paths instead of just relative paths or a public folder?"*

**Model Answer:** "When deployed to GitHub Pages at a subpath like `/uxnin-store/`, absolute paths starting with `/` would resolve to the server root and return 404. `import.meta.env.BASE_URL` is injected by Vite at build time to match the configured `base` option, so image paths are always correct regardless of deployment environment — locally it resolves to `/`, in production to `/uxnin-store/`."

---

### `src/index.css`

**Purpose:** The global design system. Defines CSS custom properties (design tokens) for both light and dark themes, plus all shared utility and component styles.

**Key Sections:**

```css
:root { /* Light theme tokens */ }
[data-theme="dark"] { /* Dark theme overrides */ }
```

- **Design tokens:** `--navy`, `--teal`, `--coral`, `--sky`, `--amber` (brand palette); `--bg`, `--bg-elev`, `--text`, `--text-muted`, `--border`, `--shadow`, `--radius`, `--transition` (functional tokens)
- **Layout:** `.container`, `.announce`, `.page`, responsive spacing with `--announce-height` and `--nav-height`
- **Component styles:** product cards, cart items, buttons (`.btn-teal`, `.btn-primary`, `.btn-ghost`), forms, drawers, auth pages, dashboard, checkout

**Step-by-step logic:**
1. `[data-theme="dark"]` overrides functional tokens only — brand colors remain the same in both themes.
2. `document.documentElement.dataset.theme = theme` in `AppContext.jsx` switches themes without a page reload.
3. `transition: background var(--transition), color var(--transition)` on `body` animates the theme switch.

**Dependencies:** None. Consumed globally via `import "./index.css"` in `main.jsx`.

**Potential HR Question:**
> *"Why did you use CSS custom properties for theming instead of a CSS-in-JS solution or Tailwind?"*

**Model Answer:** "CSS custom properties give you theme switching with zero JavaScript runtime overhead — you just toggle a `data-theme` attribute on the root element and the browser handles cascading the new values. Unlike CSS-in-JS, there's no style recalculation from JavaScript, and unlike Tailwind, you're not locked into utility class names. For a project this size, it's the most performant and maintainable option."

---

### `src/components/Announcement.jsx`

**Purpose:** A fixed-position top banner that displays a promotional message (free delivery threshold and discount code). Purely presentational — no props, no state.

**Key Sections:**
- Fixed `position: fixed; top: 0; zIndex: 901` places it above everything else
- The Navbar is positioned at `top: 36px` (matching `--announce-height`) to sit directly below it

**Step-by-step logic:** Renders on every page except auth routes. Hardcoded promotional copy — in a real app this would accept props or fetch from a CMS.

**Dependencies:** None.

**Potential HR Question:**
> *"The announcement bar is hardcoded. How would you make it dynamic in a production app?"*

**Model Answer:** "You'd fetch the announcement content from a CMS or API on app load and store it in context or a local state variable. You'd also want to add a dismiss button and persist the dismissal to `localStorage` so the banner doesn't reappear on every visit. For more complex promotions, the data shape would include a start/end date so the banner can be scheduled."

---

### `src/components/Navbar.jsx`

**Purpose:** The primary navigation system. Handles desktop links, a mobile slide-in drawer, product search, wishlist trigger, cart badge, dark mode toggle, and auth state display.

**Key Sections / Functions:**

| Section | Responsibility |
|---|---|
| `NAV_LINKS` array | Defines nav items with `to`, `label`, and inline SVG `icon` |
| `scrolled` state | Adds a box-shadow when the user scrolls down (scroll event listener) |
| `menuOpen` state | Controls mobile drawer visibility; locks `document.body` scroll when open |
| `searchOpen` / `searchQuery` | Controls the search form dropdown |
| `handleSearchSubmit` | Navigates to shop page on search submission |
| `toggleDark` | Calls `setTheme()` from context |
| Mobile drawer | `translateX(-100%)` → `translateX(0)` CSS transition; staggered link animation via `drawerItemIn` keyframes |
| `<style>` injection | Inline `<style>` tag with `@media` queries to show/hide hamburger vs desktop links |

**Step-by-step logic:**
1. On mount: adds scroll and mousedown (click-outside for search) event listeners, cleaned up on unmount.
2. `useEffect([route])` closes the mobile menu on every route change.
3. `useEffect([menuOpen])` locks body scroll when mobile menu is open.
4. Auth state from context determines whether to show "Sign in" button or `user.name + Logout`.
5. Cart and wishlist counts are derived from context arrays.

**Dependencies:** `AppContext`, `Icon.jsx`

**Potential HR Question:**
> *"You used an inline `<style>` tag inside the component for media queries. What's the reasoning, and are there downsides?"*

**Model Answer:** "It co-locates the responsive CSS with the component that owns it, making it easy to find and modify. The downside is that it bypasses CSS specificity rules in unpredictable ways and can be harder to override. In a larger codebase I'd extract this into a CSS module or a separate stylesheet. Here it was a pragmatic choice to keep everything in one file without adding CSS modules configuration to Vite."

---

### `src/components/Footer.jsx`

**Purpose:** Site footer with brand tagline, shop category links, company navigation links, and a support section. All links trigger `navigate()` for SPA navigation.

**Key Sections:**
- `foot-grid` — CSS grid with 4 columns (brand, shop, company, support)
- Dynamic category links — pulled from `CATEGORIES` data (excludes "all", shows first 5)

**Dependencies:** `products.js` (CATEGORIES), `AppContext`

**Potential HR Question:**
> *"The 'Support' section links (Shipping, Returns, FAQ, Privacy) have no `onClick` handlers. Is this a bug?"*

**Model Answer:** "It's a UI scaffold — these pages don't exist yet. In a real implementation they'd either navigate to dedicated pages or open modal dialogs. For an MVP or portfolio project this is acceptable as long as the user experience doesn't suggest they're clickable. Proper practice would be to disable pointer events, add a `cursor: default`, or stub out the routes."

---

### `src/components/ProductCard.jsx`

**Purpose:** A reusable product tile component. Displays product image, badge, wishlist toggle, brand, name, rating, stock, price, and an "Add to cart" button.

**Key Sections / Functions:**

```jsx
onClick={() => navigate("products/" + product.id)}  // image and name → product detail
e.stopPropagation()  // wishlist button prevents card click from firing
addToCart(product)   // adds 1 unit to cart
toggleWishlist(product) // add/remove from wishlist
pushToast(...)       // shows feedback notification
```

**Step-by-step logic:**
1. `isWished(product.id)` checks context wishlist array to set the heart button's active state.
2. Clicking the image/name area navigates to the product detail page.
3. The wishlist button uses `e.stopPropagation()` to prevent the card click handler from firing simultaneously.
4. Add to cart triggers both `addToCart` and `pushToast`.

**Dependencies:** `AppContext`, `Icon.jsx`

**Potential HR Question:**
> *"Why pass the entire `product` object to `addToCart` rather than just the product ID?"*

**Model Answer:** "The cart needs to display product data (name, image, price, brand) without having to look up the product on every render. By storing the full product snapshot in the cart, the cart page is self-contained — it doesn't need to import `PRODUCTS` or join data. The trade-off is slightly more `localStorage` space, but for a product catalog this size it's completely negligible."

---

### `src/components/WishlistDrawer.jsx`

**Purpose:** A slide-in panel (aside element) that shows the user's saved wishlist items. Accessed from the heart icon in the navbar. Allows adding to cart or viewing the product detail page from within the drawer.

**Key Sections:**
- `drawer-backdrop` — semi-transparent overlay, clicking it closes the drawer
- `drawer` CSS class with `.open` toggle — controlled by `drawerOpen` in context
- Per-item actions: "Add to cart" and "View" (navigates and closes drawer)

**Step-by-step logic:**
1. `drawerOpen` state lives in `AppContext` so Navbar can open it without a prop chain.
2. The backdrop and drawer use CSS class toggling (`.open`) for the transition — no inline styles.
3. Removing from wishlist via the X button calls `toggleWishlist(i)` which is an immutable filter in context.

**Dependencies:** `AppContext`, `Icon.jsx`

**Potential HR Question:**
> *"Why is `drawerOpen` state stored in `AppContext` instead of locally in `WishlistDrawer`?"*

**Model Answer:** "Because the Navbar — a sibling component, not a parent — needs to open the drawer when the user clicks the wishlist icon. Lifting the state up to context eliminates prop drilling and avoids making `Navbar` aware of `WishlistDrawer` directly. Context is the right solution when two unrelated components need to share a piece of UI state."

---

### `src/components/SearchDropdown.jsx`

**Purpose:** An inline search popup component that filters products in real-time by text query and category. Used within the Navbar's search form.

**Key Sections:**

```js
const filtered = useMemo(() => {
  const t = term.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const okCat = filter === "all" || p.category === filter;
    const okText = !t || p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t);
    return okCat && okText;
  }).slice(0, 8);  // cap at 8 results
}, [term, filter]);
```

- `useMemo` — prevents re-filtering the 64-product array on every render
- `onMouseDown={(e) => e.stopPropagation()}` — prevents the outside-click handler in Navbar from closing the dropdown when clicking inside it

**Dependencies:** `products.js` (PRODUCTS, CATEGORIES)

**Potential HR Question:**
> *"You used `useMemo` for the filtered list. At 64 products, is this actually necessary?"*

**Model Answer:** "At 64 products, the filtering is trivially fast and `useMemo` adds more overhead than it saves. But it's the correct pattern to establish — if the catalog grows to thousands of items, or if the filter logic becomes more expensive (fuzzy search, sorting), the memoization would matter. It also demonstrates understanding of React's performance primitives, which is valuable in itself."

---

### `src/components/Icon.jsx`

**Purpose:** A lightweight inline SVG icon system. Renders named icons from a flat `PATHS` lookup object — no external icon library, no network requests.

**Key Sections:**

```js
const PATHS = { search: ..., heart: ..., cart: ..., user: ..., ... }  // 20+ icons

export default function Icon({ name, size = 20 }) {
  return <svg ...>{PATHS[name]}</svg>;
}
```

- 20+ icons defined as JSX path/line/circle elements
- `size` prop controls both `width` and `height`
- SVG uses `fill="none"`, `stroke="currentColor"` — inherits text color from parent

**Dependencies:** None.

**Potential HR Question:**
> *"You inlined SVG icons instead of using a library like react-icons or Heroicons. What's the trade-off?"*

**Model Answer:** "Inlining only the icons you use means zero bundle overhead from unused icons — tree-shaking libraries like react-icons still require importing the specific icon and including its module. The downside is maintenance: adding a new icon requires modifying Icon.jsx manually. For a fixed-scope project this is the leanest approach. For a growing design system I'd switch to a proper icon library or sprite sheet."

---

### `src/pages/Home.jsx`

**Purpose:** The landing page. Contains the hero section, category grid, best sellers, promotional banners, new arrivals, and feature highlights — all assembled from static product data.

**Key Sections / Functions:**

| Section | Description |
|---|---|
| `featured` | `useMemo` filters products with `badge === "Best Seller"`, slices first 4 |
| `fresh` | `useMemo` filters products with `badge === "New"`, slices first 4 |
| `goToCategory(cat)` | Navigates to shop, then dispatches a custom event `uxnin:cat` with the category key |
| Hero section | Brand headline + CTA buttons |
| Category grid | Generated from `CATEGORIES`, shows product count per category |
| Banner row | Two promotional cards |
| Feature cards | 4 trust-building benefit cards |

**Step-by-step logic:**
1. `goToCategory` uses `window.dispatchEvent(new CustomEvent("uxnin:cat", { detail: cat }))` after a 50ms delay to signal the Shop page to pre-select a category after navigation completes.
2. `ProductCard` components receive product data as props and handle their own cart/wishlist interactions.

**Dependencies:** `AppContext`, `Icon.jsx`, `ProductCard.jsx`, `products.js`

**Potential HR Question:**
> *"The `goToCategory` function uses `setTimeout(..., 50)`. Why is that delay needed?"*

**Model Answer:** "Navigation via `window.location.hash` triggers a `hashchange` event which causes React to re-render and mount a new Shop component. The `uxnin:cat` custom event needs to be dispatched after the Shop component has mounted and attached its own event listener. Without the 50ms delay, the event fires while the Home page is still the active component and the Shop hasn't mounted yet, so nobody receives it. It's a timing hack — a cleaner solution would be to pass the initial category as a URL parameter, like `#/shop?cat=pre-workout`."

---

### `src/pages/Shop.jsx`

**Purpose:** The main store listing page. Combines a filterable, searchable, sortable product grid on the left with a live cart summary panel on the right.

**Key Sections / Functions:**

| Feature | Implementation |
|---|---|
| `cat` state | Active category filter (default: "all") |
| `q` state | Search query string |
| `sort` state | Sort mode: "featured" / "low" / "high" / "rating" |
| `promo` / `promoApplied` | Promo code input and application state |
| `list` (useMemo) | Derived product list: filter by category → filter by search → sort |
| `uxnin:cat` event listener | Receives category pre-selection from Home page's `goToCategory` |
| Cart summary aside | Live subtotal, discount, shipping, total calculation |
| `applyPromo()` | Validates "FIT10" code and applies 10% discount |

**Step-by-step logic:**
1. On mount, attaches `uxnin:cat` event listener; on unmount, removes it.
2. `useMemo` recomputes `list` whenever `cat`, `q`, or `sort` changes.
3. Shipping is free if cart total ≥ 300 (Egyptian Pounds), otherwise LE 50.
4. Clicking "Checkout →" navigates to the cart page (not directly to checkout).

**Dependencies:** `AppContext`, `Icon.jsx`, `ProductCard.jsx`, `products.js`

**Potential HR Question:**
> *"In the Shop page, you recalculate `subtotal`, `discount`, `shipping`, and `total` using local cart state from context. If the cart changes elsewhere, does this update?"*

**Model Answer:** "Yes, because `cart` comes from `useApp()` which is reading from `AppContext`. Any time `addToCart`, `removeFromCart`, or `updateQty` is called anywhere in the app, the context state updates and React re-renders all consumers — including Shop's cart summary panel. That's the benefit of centralizing state in context."

---

### `src/pages/Products.jsx`

**Purpose:** A dual-role page. When accessed as `#/products` (no ID), it renders a full catalog grid. When accessed as `#/products/101` (with an ID param), it renders the single product detail view.

**Key Sections:**

```js
const id = params[0];  // from URL hash: "products/101" → params = ["101"]
const product = PRODUCTS.find((p) => String(p.id) === String(id));
```

- No ID → show all products listing
- ID exists but no match → "Product not found" error state
- ID matches → full product detail view with quantity selector, add-to-cart, wishlist

**Step-by-step logic:**
1. `params` is read from `AppContext` (parsed from the hash URL).
2. Product lookup uses `String()` coercion on both sides to avoid type mismatch (URL params are strings, IDs are numbers).
3. The "You may also like" section filters same-category products, excludes the current product, and limits to 4.

**Dependencies:** `AppContext`, `Icon.jsx`, `ProductCard.jsx`, `products.js`

**Potential HR Question:**
> *"The `Products` page serves two completely different views depending on whether an ID is in the URL. Is this good design?"*

**Model Answer:** "It works but it's a code smell. Ideally these would be two separate components — a `ProductList` and a `ProductDetail` — each with a single responsibility. The trade-off is simplicity: one route to manage, one import in App.jsx. For a larger app I'd split them and introduce a proper routing mechanism with named routes, so the router's intent is explicit and each component stays focused."

---

### `src/pages/Cart.jsx`

**Purpose:** A dedicated full-page cart view. Displays all items with quantity controls, promo code input, and an order summary sidebar. Navigates to Checkout on confirmation.

**Key Sections:**
- Empty state — illustrated empty cart with CTA to shop
- `cart.map(...)` — renders each `cart-row` with qty controls and remove button
- `promo` / `promoApplied` — local state (independent from Shop page's promo state)
- `cart-summary` aside — subtotal, discount, shipping, total, checkout button

**Step-by-step logic:**
1. `cart` array is read from context; mutations (`updateQty`, `removeFromCart`) are dispatched to context.
2. `checkout()` guards against empty cart and navigates to `#/checkout`.
3. Promo code logic is duplicated here and in Shop — each page manages its own local promo state independently.

**Dependencies:** `AppContext`, `Icon.jsx`

**Potential HR Question:**
> *"The promo code logic is duplicated in Shop.jsx, Cart.jsx, and Checkout.jsx. How would you refactor this?"*

**Model Answer:** "Extract a `usePromo(subtotal)` custom hook that encapsulates `promo`, `promoApplied`, `applyPromo`, `discount`, `shipping`, and `total`. Each component calls the hook and gets back the values it needs. Alternatively, lift the promo state into `AppContext` alongside the cart, so the discount persists across page navigations — which is actually the correct UX, since applying a code on the Shop page should still be reflected on the Cart page."

---

### `src/pages/Checkout.jsx`

**Purpose:** A 3-step multi-step checkout wizard with: (0) cart review + promo, (1) delivery details form with validation, (2) order confirmation + place order.

**Key Sections / Functions:**

| Function/Component | Description |
|---|---|
| `StepBar` | Sub-component rendering the 3-step progress indicator |
| `OrderSummary` | Sub-component showing the cart summary sidebar (persistent across all steps) |
| `step` state | `0 = Review`, `1 = Details`, `2 = Confirm` |
| `form` state | Controlled form object: `firstName`, `lastName`, `email`, `phone`, `address`, `city`, `payment` |
| `validateDetails()` | Returns an errors object; checks all required fields and email format |
| `handleNext()` | Advances step; at step 1 runs validation before proceeding |
| `handlePlace()` | Calls `placeOrder(total)`, shows toast, navigates to Dashboard |
| `set(k)` | Curried change handler: `set("firstName")` returns `(e) => setForm(...)` |

**Step-by-step logic:**
1. `form` is pre-populated from `user?.name` and `user?.email` if a user is logged in.
2. Step 0 → Step 1: no validation, just advances.
3. Step 1 → Step 2: `validateDetails()` runs; if errors exist, they're displayed inline and navigation is blocked.
4. Step 2: "Place order" calls `placeOrder(total)` in context, which creates an order object, prepends to `orders`, clears the cart, and returns the order. The ID is shown in a toast.

**Dependencies:** `AppContext`, `Icon.jsx`

**Potential HR Question:**
> *"The checkout form stores `password`-equivalent fields (email, phone, address) in React state. Is there a security concern here?"*

**Model Answer:** "For a frontend-only app, form data in React state is fine — it exists only in memory during the session and is never sent to a server. The actual security concerns would arise if this were a real checkout: you'd never store card details in state, you'd use a PCI-compliant payment SDK like Stripe Elements, and the order would be created server-side after payment confirmation. For this project, the 'payment' is simulated and no sensitive data is persisted."

---

### `src/pages/Dashboard.jsx`

**Purpose:** An admin-style analytics dashboard showing KPI stat cards, a weekly sales bar chart, a product distribution donut chart, and a live orders table — all driven by the `orders` array from context.

**Key Sections / Functions:**

| Section | Description |
|---|---|
| `stats` (useMemo) | Derives revenue, orders count, AOV (average order value), unique customers, cart items |
| `barRef` / `donutRef` | React refs to `<canvas>` elements for Chart.js |
| `barInst` / `donutInst` | Refs to Chart.js instances (for cleanup on re-render) |
| `useEffect([theme])` | Destroys and recreates both charts when theme changes |
| Stat cards | Revenue, Orders, Avg Order, Customers — colored with `.coral`, `.amber`, `.sky` modifiers |
| Orders table | Maps `orders` array from context; status badges styled by CSS class |

**Step-by-step logic:**
1. `useMemo` computes stats from `orders` and `cart` arrays from context.
2. Chart.js instances are created imperatively inside `useEffect` with canvas refs.
3. Cleanup: `return () => { barInst.current.destroy(); donutInst.current.destroy(); }` prevents memory leaks and "Canvas already in use" errors on re-render.
4. The `[theme]` dependency means charts are rebuilt with correct grid/label colors whenever the user switches themes.
5. Bar chart data is hardcoded (simulated weekly sales). Donut chart data is derived dynamically from `PRODUCTS` category counts.

**Dependencies:** `AppContext`, `Icon.jsx`, `products.js`, `chart.js/auto`

**Potential HR Question:**
> *"Why do you use `useRef` for Chart.js instances instead of `useState`?"*

**Model Answer:** "`useState` would trigger a re-render every time the chart instance is stored or updated, which would cause an infinite loop — the re-render would re-run the effect, which would recreate the chart, which would update state again. `useRef` holds a mutable value that persists across renders without causing re-renders. It's the correct pattern for storing imperative API instances like Chart.js, timers, or DOM references."

---

### `src/pages/Login.jsx`

**Purpose:** The sign-in page. Validates email + password, looks up the user in the `uxnin_users` localStorage key, sets the session user in context, and navigates home.

**Key Sections / Functions:**

| Function | Description |
|---|---|
| `EyeIcon` | Inline SVG component that toggles between open/closed eye states |
| `validate()` | Returns error object; checks email format via `EMAIL_RX` regex and password length |
| `update(key, val)` | Updates form state and clears the error for that field |
| `submit(ev)` | Validates → reads `uxnin_users` from localStorage → finds matching user → sets context user |

**Step-by-step logic:**
1. Form submission is prevented with `ev.preventDefault()`.
2. `validate()` runs; if errors, they're displayed and execution stops.
3. `uxnin_users` is read from localStorage (written by Register.jsx).
4. Matching is case-insensitive on email, case-sensitive on password (plain text — no hashing).
5. Only `{ name, email }` (a "safe user") is stored in context — the password is never put in global state.
6. `setBusy(true)` disables the submit button during processing to prevent double submissions.

**Dependencies:** `AppContext`, `Icon.jsx`

**Potential HR Question:**
> *"You're storing passwords in plain text in localStorage. How would you address this in a production application?"*

**Model Answer:** "In production you never store passwords on the client at all. The authentication flow would be: (1) user submits credentials over HTTPS, (2) the server hashes the password with bcrypt and compares it to the stored hash, (3) the server returns a JWT or session cookie, (4) the client stores only the token. The password never touches the client's storage. The current approach is appropriate only for a frontend-only demo where there is no real security requirement."

---

### `src/pages/Register.jsx`

**Purpose:** The registration page. Collects first/last name, email, password with real-time strength meter, confirm password, and terms acceptance. Stores the new user in `uxnin_users` localStorage and auto-signs them in.

**Key Sections / Functions:**

| Function | Description |
|---|---|
| `scorePassword(pwd)` | Returns a strength score 0–4 based on length, mixed case, digits, and special characters |
| `STRENGTH_META` | Maps score to label ("Weak" → "Strong") and color |
| `strength` (useMemo) | Recomputes score on every password keystroke |
| `validate()` | Full validation: all required fields, email format, password length, confirm match, terms |
| `submit(ev)` | Validates → checks for duplicate email → writes to `uxnin_users` → sets context user |

**Step-by-step logic:**
1. `scorePassword` runs as `useMemo` on every `form.password` change, driving the 4-bar strength indicator.
2. Duplicate email check compares lowercase-normalized emails.
3. The new user object stored in localStorage includes the password (plain text — see Login note).
4. Only the `{ name, email }` safe user is passed to `setUser()`.

**Dependencies:** `AppContext`, `Icon.jsx`

**Potential HR Question:**
> *"Walk me through the `scorePassword` function. How does it calculate strength?"*

**Model Answer:** "It starts at 0 and adds 1 point for each of four criteria: (1) length ≥ 6, (2) length ≥ 10, (3) contains both uppercase and lowercase letters, (4) contains both a digit and a special character. The result is clamped to 4 with `Math.min`. This gives a 0–4 integer that maps to 'Weak', 'Fair', 'Good', 'Strong'. It's a simple additive scoring approach — not cryptographically rigorous but sufficient for UI feedback."

---

### `src/pages/Contact.jsx`

**Purpose:** A contact page with store information cards (email, phone, showroom, delivery) and a contact form. Form submission shows a 3-second success state, then resets.

**Key Sections:**
- `form` state — controlled form: `name`, `email`, `subject`, `msg`
- `sent` state — toggles the button text to "✓ Message sent" for 3 seconds
- `submit(e)` — prevents default, sets `sent = true`, resets form, auto-resets after 3s with `setTimeout`

**Dependencies:** `Icon.jsx` only. No context needed.

**Potential HR Question:**
> *"The contact form doesn't actually send an email. How would you implement real form submission?"*

**Model Answer:** "You'd integrate a service like EmailJS (client-side email), Formspree (no-backend form endpoint), or a custom backend API endpoint that uses Nodemailer. The `submit` function would make a `fetch` POST call with the form data, await the response, and conditionally show success or error state. For this portfolio project, simulating the success state is sufficient to demonstrate the UX pattern."

---

## 4. Data Flow Explanation

### User Interactions → State Changes → UI Updates

```
User clicks "Add to cart" on ProductCard
  → addToCart(product) called (from AppContext via useApp())
  → setCart(prev => [...prev, { ...product, qty: 1 }]) (functional update)
  → cart state in AppContext updates
  → useEffect in AppContext: localStorage.setItem("uxnin.cart", JSON.stringify(newCart))
  → All components reading cart from useApp() re-render:
      • Navbar cart badge count updates
      • Shop page cart summary updates
      • Cart page list updates
  → pushToast("Added to cart") called
  → toast state { msg, show: true }
  → Toast div renders with class "show" (CSS transition fades it in)
  → 2s timeout: toast.show = false (CSS transition fades it out)
```

### localStorage Keys

| Key | Type | What's stored | Read | Written |
|---|---|---|---|---|
| `uxnin.cart` | Array | Cart items (full product + qty) | On app init | Every cart mutation |
| `uxnin.wishlist` | Array | Wishlist items (full product) | On app init | Every wishlist toggle |
| `uxnin.orders` | Array | All orders (seeded + placed) | On app init | On `placeOrder()` |
| `uxnin.user` | Object\|null | `{ name, email }` — no password | On app init | On login/register/logout |
| `uxnin.theme` | String | `"light"` or `"dark"` | On app init | On theme toggle |
| `uxnin_users` | Array | Registered users with passwords | On login/register | On Register submit |

> Note: `uxnin_users` uses a different key format (underscore, no dot) — it's written directly by the auth pages, not through the `useLocalStorage` hook in `AppContext`.

### Routing Flow

```
User clicks a nav link
  → navigate("shop") called
  → window.location.hash = "#/shop"
  → "hashchange" event fires
  → onHash() listener calls setLoc(parseHash())
  → parseHash() returns { route: "shop", params: [] }
  → AppContext state updates: { route, params }
  → App.jsx re-reads route from useApp()
  → PAGES["shop"] = Shop → Shop component renders
  → window.scrollTo({ top: 0, behavior: "instant" }) called
```

### Custom Event Cross-Component Communication

```
Home.jsx: goToCategory("creatine")
  → navigate("shop")                          // hash changes, Shop mounts
  → setTimeout(50ms)
  → window.dispatchEvent(new CustomEvent("uxnin:cat", { detail: "creatine" }))

Shop.jsx (now mounted):
  → useEffect listener receives "uxnin:cat"
  → setCat("creatine")
  → useMemo recomputes filtered list for creatine only
  → UI updates to show only creatine products
```

### API Calls / External Dependencies
None. This is a fully static frontend with no API calls. All data is either hardcoded in `products.js` or persisted/read from `localStorage`.

---

## 5. Key Technical Decisions

### Decision 1: Custom Hash-Based Router (No React Router)

**What:** Routing is implemented using `window.location.hash`, a `hashchange` event listener, and a plain JavaScript PAGES object map. No React Router or any routing library.

**Why it matters:** Hash routing works on static file hosts (like GitHub Pages) without server-side configuration. React Router's `BrowserRouter` would require a server that redirects all 404s to `index.html`.

**Interview defense:** "Hash routing was the simplest deployment-compatible solution. `window.location.hash = '#/shop'` does not trigger a page reload, the `hashchange` event is 100% cross-browser, and GitHub Pages serves it correctly out of the box. The trade-off is less clean URLs, but for a portfolio project that's negligible."

---

### Decision 2: Single Global Context Instead of Multiple Contexts or Redux

**What:** One `AppContext` manages all global state: routing, theme, cart, wishlist, orders, user, toast, and drawer.

**Why it matters:** Avoids prop drilling across a 3-level component tree. For a project of this size, splitting into CartContext, AuthContext, UIContext etc. would add complexity without benefit.

**Interview defense:** "Redux is overkill for a project with no async state, no complex state machines, and no time-travel debugging needs. A single context with well-named action functions gives me the same separation of concerns. If this app scaled and re-render performance became an issue, I'd split the context or add `useReducer` with selective subscriptions using `useMemo`."

---

### Decision 3: `useLocalStorage` Custom Hook for All Persistence

**What:** A single generic `useLocalStorage(key, initial)` hook handles all read/write operations to `localStorage`. It initializes state from storage synchronously and syncs writes via `useEffect`.

**Why it matters:** Centralizes storage logic, handles JSON serialization/deserialization, and catches storage errors — all in one place. Every persisted state variable uses the same pattern.

**Interview defense:** "The custom hook eliminates boilerplate. Without it, every piece of persisted state would need duplicate initialization code and a `useEffect` to write changes. By abstracting it, storage behavior is consistent and easy to test. The synchronous initialization is important — it means the first render already has the correct state, avoiding a flash of default content."

---

### Decision 4: CSS Custom Properties for Theming (Not Tailwind or CSS-in-JS)

**What:** All colors and design tokens are CSS variables defined in `:root` and overridden in `[data-theme="dark"]`. Theme switching is done by toggling `document.documentElement.dataset.theme`.

**Why it matters:** No JavaScript runtime overhead for theme switching. The browser handles cascading. Smooth transitions via `transition` on `body`. No build-time dependency on a utility framework.

**Interview defense:** "Tailwind would have required PostCSS configuration and utility class purging to be efficient. CSS-in-JS would add runtime overhead and complexity. CSS variables give you a proper design system — change one token and it propagates everywhere. The `[data-theme]` attribute selector is a well-established pattern used by major design systems."

---

### Decision 5: `import.meta.env.BASE_URL` for Image Paths

**What:** All product image paths in `products.js` are prefixed with `const B = import.meta.env.BASE_URL`. This resolves to `/` in development and `/uxnin-store/` in production.

**Why it matters:** The app is deployed to GitHub Pages at a subpath. Hardcoded absolute paths (`/images/...`) would break in production. Relative paths would break if the app is served from a different directory.

**Interview defense:** "This is a Vite-specific pattern. The `base` option in `vite.config.js` (or package.json's deploy script) sets the subpath, and `import.meta.env.BASE_URL` is automatically injected at build time. It's the recommended way to handle assets in Vite apps deployed to subpaths."

---

### Decision 6: Chart.js with Imperative `useRef` (Not `react-chartjs-2` Wrappers)

**Wait — actually the import `import Chart from "chart.js/auto"` is used directly with refs, not the react-chartjs-2 wrapper.**

**What:** Chart.js is used imperatively via canvas refs. Charts are created in `useEffect`, stored in refs for cleanup, and destroyed/recreated on theme changes.

**Why it matters:** Direct Chart.js gives full control over configuration and imperative lifecycle. The `chart.js/auto` import includes all chart types and auto-registers them, simplifying setup.

**Interview defense:** "I used the direct Chart.js API because I needed precise control over chart cleanup — the `destroy()` method must be called before recreating a chart on the same canvas. Using refs for the Chart.js instances avoids triggering re-renders when the chart object is stored or updated. This pattern is the correct way to integrate any imperative third-party DOM library with React."

---

### Decision 7: Dual-Role `Products.jsx` Page (Listing + Detail)

**What:** `Products.jsx` serves two different views depending on whether a URL param is present: a full product grid (`#/products`) or a single product detail (`#/products/101`).

**Why it matters:** Reduces the number of routes registered in `App.jsx`. Both views share the same route namespace, making the URL structure intuitive (`products` = products section).

**Interview defense:** "It's a pragmatic decision for a small app. In a production system I'd separate these concerns into distinct components with explicit routes. The current approach makes the code harder to read because you have to scan for the conditional rendering logic — it violates the Single Responsibility Principle. I'd refactor this if the codebase grew."

---

## 6. Interview Cheat Sheet

When asked **"Tell me about a project you built"** — say this:

- "I built **UXNIN Store**, a full-featured e-commerce SPA for fitness supplements, targeting the Egyptian market."
- "Stack: **React 18 + Vite**, no backend — all state is persisted via `localStorage`. Deployed to **GitHub Pages**."
- "I implemented a **custom hash-based router** from scratch — no React Router — because hash routing works on static hosts without server configuration."
- "Global state lives in a single **React Context** using a custom `useLocalStorage` hook for persistence. Cart, wishlist, orders, user session, theme, and toast notifications are all managed there."
- "The product catalog has **64 SKUs across 6 categories** — whey protein, creatine, mass gainers, pre-workout, vitamins, beta-alanine."
- "Key UI features: **3-step checkout wizard** with form validation, **real-time search with category filters**, **slide-in wishlist drawer**, **light/dark theme** with CSS custom properties, responsive mobile nav drawer."
- "The **Dashboard** page uses Chart.js with canvas refs to render a weekly sales bar chart and a catalog distribution donut chart — both rebuild on theme change to match the active color scheme."
- "Authentication stores users in localStorage — full registration with **password strength scoring** and login with session persistence. Passwords are plain text (frontend-only demo), which I'd address with server-side hashing in production."
- "Key technical decisions I'd defend: custom router over React Router for static deployment, single Context over Redux for simplicity at this scale, CSS variables over Tailwind for zero-runtime theming, and `import.meta.env.BASE_URL` for subpath-compatible image assets."
- "If I extended it: I'd add a real backend (Node/Express + PostgreSQL), JWT auth, server-side cart persistence, real payment integration (Stripe), and split the Context into domain-specific stores."
