// All image paths are relative — Vite's `base` ('/uxnin-store/') will be applied
// automatically to references that start with `/`, but here we want them
// resolvable both at root and at /uxnin-store/, so we use absolute paths
// prefixed with the base.
import React from "react";
const B = import.meta.env.BASE_URL; // '/uxnin-store/' in production

export const PRODUCTS = [
  // Whey Protein
  { id: 101, name: "Optimum Nutrition Gold Standard 100% Whey", brand: "Optimum Nutrition", category: "whey-protein", price: 2200, oldPrice: 2500, image: B + "whey-protein/whey-protein-optimum-nutrition-gold-standard-100-whey-protein-29serv.png", rating: 4.9, stock: 24, badge: "Best Seller" },
  { id: 102, name: "Optimum Nutrition Gold Standard 100% Isolate", brand: "Optimum Nutrition", category: "whey-protein", price: 2750, oldPrice: 0, image: B + "whey-protein/whey-protein-optimum-nutrition-gold-standard-100-isolate-44serv-132kg.png", rating: 4.8, stock: 12 },
  { id: 103, name: "Muscletech Nitrotech Whey Gold 31 Serv", brand: "Muscletech", category: "whey-protein", price: 1990, oldPrice: 2200, image: B + "whey-protein/whey-protein-muscletech-nitrotech-whey-gold-31serv.png", rating: 4.7, stock: 18 },
  { id: 104, name: "Muscletech Cell-Tech Performance Series", brand: "Muscletech", category: "whey-protein", price: 2100, oldPrice: 0, image: B + "whey-protein/whey-protein-muscletech-performance-series-cell-tech-28serv-1.png", rating: 4.6, stock: 9 },
  { id: 105, name: "Now Sports Whey Protein Isolate 2268g", brand: "Now Sports", category: "whey-protein", price: 2950, oldPrice: 0, image: B + "whey-protein/whey-protein-now-sports-whey-protein-isolate-81serv-2268g.png", rating: 4.7, stock: 6 },
  { id: 106, name: "DY Nutrition Shadowhey Hydrolysate 90 Serv", brand: "DY Nutrition", category: "whey-protein", price: 2650, oldPrice: 2900, image: B + "whey-protein/whey-protein-dy-nutrition-shadowhey-hydrolysate-hydrolysed-whey-protein-90serv-2270g.png", rating: 4.8, stock: 14, badge: "New" },
  { id: 107, name: "Bad Ass 100% Whey Concentrate Vanilla", brand: "Bad Ass", category: "whey-protein", price: 2390, oldPrice: 0, image: B + "whey-protein/whey-protein-bad-ass-whey-100-whey-protein-concentrate-66serv-2kg-vanilla-ice-cream.png", rating: 4.5, stock: 22 },
  { id: 108, name: "Bad Ass Zero 100% Isolate Snickers", brand: "Bad Ass", category: "whey-protein", price: 2790, oldPrice: 3050, image: B + "whey-protein/whey-protein-bad-ass-zero-100-whey-protein-isolate-66serv-2kg-snikers.png", rating: 4.8, stock: 11 },
  { id: 109, name: "Yava Labs Pure Elite Whey Concentrate", brand: "Yava Labs", category: "whey-protein", price: 2150, oldPrice: 0, image: B + "whey-protein/whey-protein-yava-labs-pure-elite-whey-protein-concentrate-66serv-2kg-vanilla-ice-cream.png", rating: 4.4, stock: 17 },
  { id: 110, name: "Limitless Alpha Whey Isolate 30 Serv", brand: "Limitless", category: "whey-protein", price: 1490, oldPrice: 1690, image: B + "whey-protein/whey-protein-limitless-alpha-whey-protein-isolate-30serv-1kg.png", rating: 4.6, stock: 25 },
  { id: 111, name: "Limitless Alpha Whey Concentrate 30 Serv", brand: "Limitless", category: "whey-protein", price: 1290, oldPrice: 0, image: B + "whey-protein/whey-protein-limitless-alpha-whey-protein-concentrate-30serv-1kg.png", rating: 4.5, stock: 30 },
  { id: 112, name: "ASN Advanced 100% Whey Protein 30 Serv", brand: "ASN", category: "whey-protein", price: 1390, oldPrice: 0, image: B + "whey-protein/whey-protein-asn-advanced-100-whey-protein-30serv.png", rating: 4.4, stock: 28 },

  // Creatine
  { id: 201, name: "Optimum Nutrition Creatine 120 Serv", brand: "Optimum Nutrition", category: "creatine", price: 850, oldPrice: 950, image: B + "creatine/creatine-optimum-nutrition-creatine-120serv.png", rating: 4.9, stock: 42, badge: "Best Seller" },
  { id: 202, name: "Dymatize Creatine Micronized", brand: "Dymatize", category: "creatine", price: 790, oldPrice: 0, image: B + "creatine/creatine-dymatize-creatine-micronized.png", rating: 4.8, stock: 36 },
  { id: 203, name: "Rule One Creatine Monohydrate 75 Serv", brand: "Rule One", category: "creatine", price: 690, oldPrice: 0, image: B + "creatine/creatine-rule-one-creatine-monohydrate-75serv.png", rating: 4.7, stock: 22 },
  { id: 204, name: "Universal Creatine Monohydrate Classic", brand: "Universal", category: "creatine", price: 590, oldPrice: 690, image: B + "creatine/creatine-universal-creatine-monohydrate-classic-series-40serv.png", rating: 4.6, stock: 31 },
  { id: 205, name: "Allmax Creatine 100% Micronized 80 Serv", brand: "Allmax", category: "creatine", price: 720, oldPrice: 0, image: B + "creatine/creatine-allmax-nutrition-creatine-100-micronized-80serv.png", rating: 4.7, stock: 19 },
  { id: 206, name: "Max Muscle Creatine 999 Creapure 40 Serv", brand: "Max Muscle", category: "creatine", price: 990, oldPrice: 1100, image: B + "creatine/creatine-max-muscle-creatine-999-creapure-40serv.png", rating: 4.9, stock: 14, badge: "Premium" },
  { id: 207, name: "Big Ramy Labs Red Rex Creatine 60 Serv", brand: "Big Ramy Labs", category: "creatine", price: 750, oldPrice: 0, image: B + "creatine/creatine-big-ramy-labs-red-rex-creatine-5000mg-60serv-300g.png", rating: 4.7, stock: 16, badge: "New" },
  { id: 208, name: "Limitless Alpha Creatine Mono 90 Serv", brand: "Limitless", category: "creatine", price: 650, oldPrice: 750, image: B + "creatine/creatine-limitless-alpha-creatine-monohydrate-micronized-90serv-450g.png", rating: 4.6, stock: 28 },
  { id: 209, name: "Kevin Levrone Gold Creatine 60 Serv", brand: "Kevin Levrone", category: "creatine", price: 690, oldPrice: 0, image: B + "creatine/creatine-kevin-levrone-gold-creatine-60serv.png", rating: 4.5, stock: 17 },
  { id: 210, name: "Bad Ass Creatine Monohydrate 60 Serv", brand: "Bad Ass", category: "creatine", price: 590, oldPrice: 0, image: B + "creatine/creatine-bad-ass-creatine-monohydrate-60serv-300g.png", rating: 4.5, stock: 25 },
  { id: 211, name: "Skeleton Nutrition Creatine 165 Serv", brand: "Skeleton", category: "creatine", price: 990, oldPrice: 0, image: B + "creatine/creatine-skeleton-nutrition-creatine-monohydrate-165serv-495g.png", rating: 4.7, stock: 11 },
  { id: 212, name: "Quamtrax Pure 100% Creatine 100 Serv", brand: "Quamtrax", category: "creatine", price: 720, oldPrice: 0, image: B + "creatine/creatine-quamtrax-pure-100-creatine-monohydrate-100serv.png", rating: 4.6, stock: 21 },

  // Mass Gainers
  { id: 301, name: "Optimum Nutrition Serious Mass 5lb", brand: "Optimum Nutrition", category: "mass", price: 1490, oldPrice: 1690, image: B + "mass/mass-optimum-nutrition-serious-mass-16serv-5-1.png", rating: 4.8, stock: 18, badge: "Best Seller" },
  { id: 302, name: "Optimum Nutrition Serious Mass 2lb", brand: "Optimum Nutrition", category: "mass", price: 990, oldPrice: 0, image: B + "mass/mass-optimum-nutrition-serious-mass-8serv-2.png", rating: 4.7, stock: 15 },
  { id: 303, name: "Dymatize Super Mass Gainer 2.7kg", brand: "Dymatize", category: "mass", price: 1690, oldPrice: 0, image: B + "mass/mass-dymatize-super-mass-gainer-8serv-27kg.png", rating: 4.7, stock: 9 },
  { id: 304, name: "Nutrabolics Mass Fusion Gainer 5lb", brand: "Nutrabolics", category: "mass", price: 1590, oldPrice: 1790, image: B + "mass/mass-nutrabolics-mass-fusion-gainer-22serv-5-1.png", rating: 4.6, stock: 12 },
  { id: 305, name: "DY Nutrition Game Changer Mass 3kg", brand: "DY Nutrition", category: "mass", price: 1390, oldPrice: 0, image: B + "mass/mass-dy-nutrition-game-changer-mass-revolutionary-mass-gainer-20serv-3000g.png", rating: 4.7, stock: 14, badge: "New" },
  { id: 306, name: "DY Nutrition Metabolic Mass Gainer 6kg", brand: "DY Nutrition", category: "mass", price: 2390, oldPrice: 0, image: B + "mass/mass-dy-nutrition-metabolic-mass-gainer-lean-muscle-catalyst-40serv-6kg.png", rating: 4.8, stock: 7 },
  { id: 307, name: "Bad Ass Mass Vanilla 3kg", brand: "Bad Ass", category: "mass", price: 1290, oldPrice: 1490, image: B + "mass/mass-bad-ass-mass-30serving-3kg-vanilla.png", rating: 4.5, stock: 16 },
  { id: 308, name: "Big Ramy Red Rex Big Mass 5.4kg", brand: "Big Ramy Labs", category: "mass", price: 1990, oldPrice: 0, image: B + "mass/mass-big-ramy-labs-red-rex-big-mass-16serv-5443g.png", rating: 4.7, stock: 10 },
  { id: 309, name: "Big Ramy Beef Mass 2.7kg", brand: "Big Ramy Labs", category: "mass", price: 1790, oldPrice: 0, image: B + "mass/mass-big-ramy-labs-building-bigger-bodies-beef-mass-14serv-2722g-vanilla.png", rating: 4.6, stock: 8 },
  { id: 310, name: "Novogen Pharma Mass Gainer 5lb", brand: "Novogen", category: "mass", price: 1190, oldPrice: 0, image: B + "mass/mass-novogen-pharma-mass-gainer-16serv-5.png", rating: 4.4, stock: 19 },

  // Pre-Workout
  { id: 401, name: "Optimum Nutrition Gold Standard Pre-Workout", brand: "Optimum Nutrition", category: "pre-workout", price: 1290, oldPrice: 1490, image: B + "pre-workout/pre-workout-optimum-nutrition-gold-standard-pre-workout-30serv-1.png", rating: 4.8, stock: 17, badge: "Best Seller" },
  { id: 402, name: "JNX Sports The Shadow Pre-Workout 30 Serv", brand: "JNX Sports", category: "pre-workout", price: 1190, oldPrice: 0, image: B + "pre-workout/pre-workout-jnxsports-the-shadow-pre-workout-30serv-1.png", rating: 4.7, stock: 22 },
  { id: 403, name: "GAT Sport Nitraflex Pre-Workout 30 Serv", brand: "GAT Sport", category: "pre-workout", price: 1090, oldPrice: 0, image: B + "pre-workout/pre-workout-gat-sport-nitraflex-pre-workout-30serv.png", rating: 4.6, stock: 14 },
  { id: 404, name: "BSN N.O.-Xplode Legendary Pre-Workout", brand: "BSN", category: "pre-workout", price: 1390, oldPrice: 1590, image: B + "pre-workout/pre-workout-bsn-no-xplode-legendary-pre-workout-30serv-1.png", rating: 4.8, stock: 13 },
  { id: 405, name: "DY Nutrition Blood & Guts Pre-Workout", brand: "DY Nutrition", category: "pre-workout", price: 1190, oldPrice: 0, image: B + "pre-workout/pre-workout-dy-nutrition-blood-guts-the-mind-body-pre-workout-20serv-380g.png", rating: 4.7, stock: 19 },
  { id: 406, name: "Max Muscle No Joke Reda Ragab Series", brand: "Max Muscle", category: "pre-workout", price: 1490, oldPrice: 0, image: B + "pre-workout/pre-workout-max-muscle-no-joke-hardcore-pre-workout-reda-ragab-signature-series-1serv-1930g.png", rating: 4.9, stock: 6, badge: "Limited" },
  { id: 407, name: "Big Ramy Red Rex Stomp Pre-Workout", brand: "Big Ramy Labs", category: "pre-workout", price: 1290, oldPrice: 1390, image: B + "pre-workout/pre-workout-big-ramy-labs-red-rex-stomp-pre-workout-massive-pumps-endurance-26serv-455g-1.png", rating: 4.7, stock: 11, badge: "New" },
  { id: 408, name: "Universal Fury Pre-Workout 30 Serv", brand: "Universal", category: "pre-workout", price: 990, oldPrice: 0, image: B + "pre-workout/pre-workout-universal-fury-pre-workout-30serv.png", rating: 4.5, stock: 24 },
  { id: 409, name: "Challenger The Pump Xtreme 30 Serv", brand: "Challenger", category: "pre-workout", price: 890, oldPrice: 0, image: B + "pre-workout/pre-workout-challenger-nutrition-the-pump-xtreme-pre-workout-30serv-258g.png", rating: 4.5, stock: 17 },
  { id: 410, name: "Muscleseed Big Bang Pre-Workout", brand: "Muscleseed", category: "pre-workout", price: 790, oldPrice: 0, image: B + "pre-workout/pre-workout-muscleseed-big-bang-pre-workout-30serv-300g.png", rating: 4.4, stock: 21 },

  // Vitamins
  { id: 501, name: "Universal Animal Pak 22 Serv", brand: "Universal", category: "vitamins", price: 990, oldPrice: 0, image: B + "vitamins/vitamins-universal-animal-pak-22serv.png", rating: 4.9, stock: 16, badge: "Best Seller" },
  { id: 502, name: "Centrum Silver Multivitamin Men 50+", brand: "Centrum", category: "vitamins", price: 690, oldPrice: 790, image: B + "vitamins/vitamins-centrum-silver-multivitamin-for-men-50-200serv-200tabs.png", rating: 4.7, stock: 22 },
  { id: 503, name: "Centrum Silver Multivitamin Women 50+", brand: "Centrum", category: "vitamins", price: 690, oldPrice: 0, image: B + "vitamins/vitamins-centrum-silver-multivitamin-for-women-50-100serv-100tabs.png", rating: 4.7, stock: 18 },
  { id: 504, name: "Muscletech Platinum Multivitamin 30 Serv", brand: "Muscletech", category: "vitamins", price: 590, oldPrice: 0, image: B + "vitamins/vitamins-muscletech-platinum-multivitamin-30serv-90tabs.png", rating: 4.6, stock: 28 },
  { id: 505, name: "Rule One Men's Multi Active 60 Serv", brand: "Rule One", category: "vitamins", price: 690, oldPrice: 0, image: B + "vitamins/vitamins-rule-one-men-s-multi-active-lifestyle-60serv.png", rating: 4.7, stock: 19 },
  { id: 506, name: "Natrol Biotin 10000mg 100 Serv", brand: "Natrol", category: "vitamins", price: 490, oldPrice: 0, image: B + "vitamins/vitamins-natrol-biotin-10000mg-100serv-100tabs.png", rating: 4.6, stock: 31 },
  { id: 507, name: "Natrol Omega 3-6-9 90 Serv", brand: "Natrol", category: "vitamins", price: 590, oldPrice: 690, image: B + "vitamins/vitamins-natrol-omega-3-6-9-90serv.png", rating: 4.7, stock: 26 },
  { id: 508, name: "Redcon1 Omega-3 Fish Oil 90 Serv", brand: "Redcon1", category: "vitamins", price: 590, oldPrice: 0, image: B + "vitamins/vitamins-redcon1-omega3-fish-oil-1000mg-90serv.png", rating: 4.7, stock: 24 },
  { id: 509, name: "Genesisvit Vitamin D3 10000IU 100 Serv", brand: "Genesisvit", category: "vitamins", price: 390, oldPrice: 490, image: B + "vitamins/vitamins-genesisvit-pharma-vitamin-d3-10000iu-100serv-100tabs.png", rating: 4.8, stock: 35 },
  { id: 510, name: "Genesisvit Zinc 50mg 100 Serv", brand: "Genesisvit", category: "vitamins", price: 290, oldPrice: 0, image: B + "vitamins/vitamins-genesisvit-pharma-zinc-50mg-100serv-100tabs.png", rating: 4.7, stock: 41 },
  { id: 511, name: "Puritan's Pride Hydrolyzed Collagen 45 Serv", brand: "Puritan's Pride", category: "vitamins", price: 690, oldPrice: 0, image: B + "vitamins/vitamins-puritan-s-pride-hydrolyzed-collagen-45serv.png", rating: 4.7, stock: 17 },
  { id: 512, name: "Puritan's Pride Magnesium 250mg 100 Serv", brand: "Puritan's Pride", category: "vitamins", price: 390, oldPrice: 0, image: B + "vitamins/vitamins-puritan-s-pride-magnesium-250mg-100serv.png", rating: 4.6, stock: 29 },
  { id: 513, name: "Redcon1 Vitamin C 1000mg 120 Serv", brand: "Redcon1", category: "vitamins", price: 490, oldPrice: 0, image: B + "vitamins/vitamins-redcon1-vitamin-c-1000mg-basic-training-series-120serv-120tabs.png", rating: 4.8, stock: 22, badge: "New" },

  // Beta Alanine
  { id: 601, name: "Allmax Beta Alanine 125 Serv", brand: "Allmax", category: "beta-alanine", price: 690, oldPrice: 0, image: B + "beta-alanine/beta-alanine-allmax-beta-alanine-125serv.png", rating: 4.7, stock: 19, badge: "Best Seller" },
  { id: 602, name: "Redcon1 Beta Alanine 3200mg 30 Serv", brand: "Redcon1", category: "beta-alanine", price: 590, oldPrice: 690, image: B + "beta-alanine/beta-alanine-redcon1-beta-alanine-3200mg-30serv.png", rating: 4.6, stock: 24 },
  { id: 603, name: "Bad Ass Beta Alanine 100 Serv", brand: "Bad Ass", category: "beta-alanine", price: 490, oldPrice: 0, image: B + "beta-alanine/beta-alanine-bad-ass-beta-alanine-100serv-300g.png", rating: 4.5, stock: 27 },
  { id: 604, name: "Muscle Add Beta Alanine 3200mg 30 Serv", brand: "Muscle Add", category: "beta-alanine", price: 450, oldPrice: 0, image: B + "beta-alanine/beta-alanine-muscle-add-beta-alanine-3200mg-30serv.png", rating: 4.5, stock: 21 },
];

export const CATEGORIES = [
  { key: "all",          name: "All Products", icon: "★" },
  { key: "whey-protein", name: "Whey Protein",  icon: "whey" },
  { key: "creatine",     name: "Creatine",       icon: "creatine" },
  { key: "mass",         name: "Mass Gainers",   icon: "mass" },
  { key: "pre-workout",  name: "Pre-Workout",    icon: "pre" },
  { key: "vitamins",     name: "Vitamins",       icon: "vitamins" },
  { key: "beta-alanine", name: "Beta Alanine",   icon: "beta" },
];

export const ORDERS_SEED = [
  { id: "UX-2841", customer: "Ahmed Hassan", total: 2390, status: "delivered", date: "May 02, 2026" },
  { id: "UX-2842", customer: "Mohamed Saeed", total: 1290, status: "shipped", date: "May 04, 2026" },
  { id: "UX-2843", customer: "Sarah Khaled", total: 990, status: "processing", date: "May 06, 2026" },
  { id: "UX-2844", customer: "Omar Ali", total: 3490, status: "delivered", date: "May 06, 2026" },
  { id: "UX-2845", customer: "Yara Adel", total: 1790, status: "shipped", date: "May 08, 2026" },
  { id: "UX-2846", customer: "Karim Tarek", total: 590, status: "cancelled", date: "May 09, 2026" },
  { id: "UX-2847", customer: "Layla Ezz", total: 2150, status: "processing", date: "May 09, 2026" },
  { id: "UX-2848", customer: "Hossam Youssef", total: 4290, status: "delivered", date: "May 10, 2026" },
];

export const HERO_IMAGE = B + "Limitless-Banner.png";
