/* ============================================================
   NovaKart — data.js
   Product catalog, categories, hero banners (fictional data)
   ============================================================ */

export const CATEGORIES = [
  { id: "electronics", name: "Electronics", art: "🎧", bg: "linear-gradient(135deg,#1e3a5f,#3b6ea5)" },
  { id: "mobiles", name: "Mobiles", art: "📱", bg: "linear-gradient(135deg,#4a148c,#7c43bd)" },
  { id: "fashion", name: "Fashion", art: "👟", bg: "linear-gradient(135deg,#ad1457,#f06292)" },
  { id: "home", name: "Home & Kitchen", art: "🛋️", bg: "linear-gradient(135deg,#4e342e,#a1887f)" },
  { id: "appliances", name: "Appliances", art: "🧺", bg: "linear-gradient(135deg,#00695c,#4db6ac)" },
  { id: "books", name: "Books", art: "📚", bg: "linear-gradient(135deg,#e65100,#ffb74d)" },
  { id: "grocery", name: "Grocery", art: "🥑", bg: "linear-gradient(135deg,#33691e,#8bc34a)" },
  { id: "toys", name: "Toys & Games", art: "🧸", bg: "linear-gradient(135deg,#c62828,#ef5350)" },
];

export const HERO_SLIDES = [
  { h: "Great Freedom Festival", p: "Up to 70% off across Electronics, Fashion & more", art: "🎉", bg: "linear-gradient(120deg,#5b2a86,#a4508b 60%,#f8618f)", cta: "Shop all deals", link: "#/search?deal=1" },
  { h: "Nova+ One-Day Delivery", p: "Free fast delivery on lakhs of items. Try Nova+ today.", art: "🚚", bg: "linear-gradient(120deg,#0f4c5c,#1196ab 65%,#5bc8dd)", cta: "Explore Nova+", link: "#/search" },
  { h: "New Season Launches", p: "Latest phones, laptops & wearables just landed", art: "🚀", bg: "linear-gradient(120deg,#232f3e,#37475a 60%,#5a7391)", cta: "See what's new", link: "#/search?tag=new" },
  { h: "Home Makeover Sale", p: "Furniture & decor starting ₹199", art: "🛋️", bg: "linear-gradient(120deg,#7b3f00,#b7791f 65%,#ecc94b)", cta: "Refresh your home", link: "#/category/home" },
];

/* price = selling price (₹), mrp = strike price */
export const PRODUCTS = [
  { id: "p01", cat: "electronics", brand: "SoundCore", name: "SoundCore Pulse ANC Wireless Headphones — 40h Battery, Hi-Res Audio", art: "🎧", bg: "linear-gradient(135deg,#1f2b3a,#40597a)", price: 2999, mrp: 6999, rating: 4.4, reviews: 12832, plus: true, stock: 14, tag: "deal",
    about: ["Hybrid Active Noise Cancellation up to 35dB", "40-hour playtime with fast charge (10 min = 4 hrs)", "Dual-device Bluetooth 5.3 pairing", "Built-in mic with ENC for clear calls"],
    specs: { Colour: "Midnight Black", Connectivity: "Bluetooth 5.3", Battery: "40 hours", Weight: "245 g", Warranty: "1 year" } },
  { id: "p02", cat: "electronics", brand: "Voltix", name: "Voltix 65W GaN Fast Charger — Dual USB-C + USB-A, Compact Travel Size", art: "🔌", bg: "linear-gradient(135deg,#263238,#546e7a)", price: 1499, mrp: 2999, rating: 4.5, reviews: 8541, plus: true, stock: 40, tag: "best",
    about: ["65W total output charges laptop + phone together", "GaN II tech — 40% smaller than regular chargers", "Universal compatibility with PD 3.0 & QC 4+"],
    specs: { Ports: "2× USB-C, 1× USB-A", Output: "65W max", Weight: "112 g", Warranty: "18 months" } },
  { id: "p03", cat: "electronics", brand: "PixelView", name: "PixelView 27\" QHD IPS Monitor — 144Hz, 1ms, HDR400, Height Adjustable", art: "🖥️", bg: "linear-gradient(135deg,#1a237e,#3949ab)", price: 17999, mrp: 27999, rating: 4.6, reviews: 3211, plus: true, stock: 8, tag: "deal",
    about: ["2560×1440 QHD IPS panel with 99% sRGB", "144Hz refresh rate with 1ms MPRT", "HDR400, FreeSync & G-Sync compatible", "Ergonomic stand: height, tilt, pivot"],
    specs: { Size: "27 inch", Resolution: "2560×1440", "Refresh rate": "144 Hz", Panel: "IPS", Warranty: "3 years" } },
  { id: "p04", cat: "electronics", brand: "AeroBook", name: "AeroBook Air 14 — Ryzen 7, 16GB RAM, 512GB SSD, 1.19kg Thin & Light Laptop", art: "💻", bg: "linear-gradient(135deg,#37474f,#78909c)", price: 54990, mrp: 72990, rating: 4.3, reviews: 1876, plus: true, stock: 5,
    about: ["AMD Ryzen 7 7735HS with Radeon graphics", "16GB LPDDR5 RAM, 512GB NVMe SSD", "14\" 2.2K 300-nit display, 100% sRGB", "Just 1.19 kg with 70Wh all-day battery"],
    specs: { CPU: "Ryzen 7 7735HS", RAM: "16 GB", Storage: "512 GB SSD", Display: "14\" 2.2K", OS: "Windows 11" } },
  { id: "p05", cat: "electronics", brand: "BeatBox", name: "BeatBox Rush 16W Portable Bluetooth Speaker — IPX7 Waterproof, RGB", art: "🔊", bg: "linear-gradient(135deg,#004d40,#26a69a)", price: 1799, mrp: 3499, rating: 4.2, reviews: 22104, plus: false, stock: 55, tag: "best",
    about: ["16W stereo output with punchy bass radiator", "IPX7 — fully waterproof, pool-party ready", "TWS pairing for true stereo with 2 speakers", "12h battery, USB-C charging"],
    specs: { Output: "16 W", Rating: "IPX7", Battery: "12 hours", Bluetooth: "5.3" } },

  { id: "p06", cat: "mobiles", brand: "Nexon", name: "Nexon Z5 Pro 5G — 12GB+256GB, 200MP OIS Camera, 120Hz AMOLED", art: "📱", bg: "linear-gradient(135deg,#311b92,#7c4dff)", price: 32999, mrp: 41999, rating: 4.5, reviews: 9876, plus: true, stock: 12, tag: "new",
    about: ["200MP OIS main camera with 4K60 video", "6.7\" 120Hz AMOLED, 1800 nits peak", "5100mAh battery with 100W hyper charge", "5 years of security updates"],
    specs: { RAM: "12 GB", Storage: "256 GB", Display: "6.7\" AMOLED 120Hz", Battery: "5100 mAh", Camera: "200 MP" } },
  { id: "p07", cat: "mobiles", brand: "Nexon", name: "Nexon M3 Lite — 6GB+128GB, 50MP AI Camera, 5000mAh, Budget 5G", art: "📲", bg: "linear-gradient(135deg,#0d47a1,#42a5f5)", price: 11499, mrp: 14999, rating: 4.1, reviews: 31240, plus: true, stock: 60, tag: "best",
    about: ["Dimensity 6100+ 5G chip", "50MP AI dual camera", "90Hz 6.6\" display", "Side fingerprint + face unlock"],
    specs: { RAM: "6 GB", Storage: "128 GB", Battery: "5000 mAh", Network: "5G" } },
  { id: "p08", cat: "mobiles", brand: "Orbita", name: "Orbita Watch S2 — AMOLED Always-On, BT Calling, 12-Day Battery, SpO₂", art: "⌚", bg: "linear-gradient(135deg,#212121,#616161)", price: 2499, mrp: 5999, rating: 4.0, reviews: 18453, plus: false, stock: 33, tag: "deal",
    about: ["1.43\" AMOLED always-on display", "Bluetooth calling with dial pad", "120+ sports modes, SpO₂ & HR tracking", "IP68, 12-day typical battery"],
    specs: { Display: "1.43\" AMOLED", Battery: "12 days", Rating: "IP68" } },
  { id: "p09", cat: "mobiles", brand: "Nexon", name: "Nexon Buds Air — 32dB ANC TWS Earbuds, 45h Playtime, Quad Mic", art: "🎵", bg: "linear-gradient(135deg,#4a148c,#ab47bc)", price: 1999, mrp: 4499, rating: 4.3, reviews: 26711, plus: true, stock: 0,
    about: ["32dB hybrid ANC", "45h total playtime with case", "Quad-mic ENC for calls", "Low-latency game mode (45ms)"],
    specs: { ANC: "32 dB", Playtime: "45 hours", Bluetooth: "5.4" } },

  { id: "p10", cat: "fashion", brand: "StrideMax", name: "StrideMax CloudRun Men's Running Shoes — Breathable Knit, Memory Sole", art: "👟", bg: "linear-gradient(135deg,#880e4f,#f06292)", price: 1299, mrp: 2999, rating: 4.2, reviews: 15987, plus: true, stock: 25, tag: "deal",
    about: ["Breathable engineered knit upper", "Memory-foam insole with arch support", "Anti-skid EVA outsole", "Sizes UK 6–11"],
    specs: { Material: "Knit mesh", Sole: "EVA", Closure: "Lace-up" } },
  { id: "p11", cat: "fashion", brand: "UrbanEdge", name: "UrbanEdge Oversized Cotton T-Shirt (Pack of 2) — 240 GSM Heavyweight", art: "👕", bg: "linear-gradient(135deg,#3e2723,#8d6e63)", price: 899, mrp: 1999, rating: 4.4, reviews: 8231, plus: true, stock: 80, tag: "best",
    about: ["100% combed cotton, 240 GSM", "Drop-shoulder oversized fit", "Pre-shrunk & bio-washed", "Pack of 2: Black + Off-white"],
    specs: { Fabric: "100% cotton", GSM: "240", Fit: "Oversized" } },
  { id: "p12", cat: "fashion", brand: "Trekora", name: "Trekora 45L Travel Backpack — Laptop Sleeve, Rain Cover, USB Port", art: "🎒", bg: "linear-gradient(135deg,#1b5e20,#66bb6a)", price: 1599, mrp: 3499, rating: 4.5, reviews: 6754, plus: false, stock: 18,
    about: ["45L with 15.6\" padded laptop sleeve", "Water-resistant fabric + free rain cover", "External USB charging port", "Airline cabin-size compliant"],
    specs: { Capacity: "45 L", Laptop: "Up to 15.6\"", Warranty: "6 months" } },
  { id: "p13", cat: "fashion", brand: "Aviara", name: "Aviara Polarized Aviator Sunglasses — UV400, Gold Frame", art: "🕶️", bg: "linear-gradient(135deg,#f57f17,#ffd54f)", price: 749, mrp: 1899, rating: 4.0, reviews: 4321, plus: true, stock: 44, tag: "deal",
    about: ["Polarized UV400 lenses", "Lightweight metal alloy frame", "Includes hard case + cleaning cloth"],
    specs: { Lens: "Polarized UV400", Frame: "Metal alloy" } },

  { id: "p14", cat: "home", brand: "CozyNest", name: "CozyNest Memory Foam Pillow (Set of 2) — Cervical Support, Cooling Gel", art: "🛏️", bg: "linear-gradient(135deg,#4e342e,#a1887f)", price: 1399, mrp: 2998, rating: 4.3, reviews: 9812, plus: true, stock: 30, tag: "best",
    about: ["Contoured memory foam for neck support", "Cooling gel-infused top layer", "Removable washable bamboo cover"],
    specs: { Size: "60×40 cm", Fill: "Memory foam", Cover: "Bamboo fabric" } },
  { id: "p15", cat: "home", brand: "Lumière", name: "Lumière Smart LED Strip 5m — 16M Colours, App + Voice Control, Music Sync", art: "💡", bg: "linear-gradient(135deg,#4a148c,#e040fb)", price: 999, mrp: 2499, rating: 4.1, reviews: 13456, plus: true, stock: 65, tag: "deal",
    about: ["16 million colours, app controlled", "Works with Alexa & Google Assistant", "Music sync mode with built-in mic", "Cuttable & extendable design"],
    specs: { Length: "5 m", Control: "App / Voice", Power: "USB / adapter" } },
  { id: "p16", cat: "home", brand: "ChefCraft", name: "ChefCraft Tri-Ply Stainless Steel Kadai 24cm with Lid — Induction Ready", art: "🍳", bg: "linear-gradient(135deg,#37474f,#90a4ae)", price: 1849, mrp: 3299, rating: 4.6, reviews: 5643, plus: true, stock: 22,
    about: ["Tri-ply: steel-aluminium-steel for even heating", "Works on induction & gas", "No coating — naturally non-toxic", "Lifetime anti-warp warranty"],
    specs: { Size: "24 cm / 2.5 L", Material: "Tri-ply SS", Induction: "Yes" } },

  { id: "p17", cat: "appliances", brand: "FrostFlow", name: "FrostFlow 1.5 Ton 5-Star Inverter Split AC — Copper, PM 2.5 Filter, 2026 Model", art: "❄️", bg: "linear-gradient(135deg,#01579b,#4fc3f7)", price: 34990, mrp: 52990, rating: 4.4, reviews: 2987, plus: true, stock: 6, tag: "deal",
    about: ["5-star inverter compressor — saves up to 40% energy", "100% copper condenser with anti-corrosion coating", "PM 2.5 filter + self-clean mode", "Cools at 52°C ambient"],
    specs: { Capacity: "1.5 Ton", Rating: "5 Star", Condenser: "Copper", Warranty: "10 yrs compressor" } },
  { id: "p18", cat: "appliances", brand: "AquaPure", name: "AquaPure RO+UV+Copper Water Purifier — 8L, 7-Stage Purification", art: "🚰", bg: "linear-gradient(135deg,#006064,#4dd0e1)", price: 8999, mrp: 15999, rating: 4.2, reviews: 7654, plus: true, stock: 15,
    about: ["7-stage RO+UV+UF purification", "Copper infusion technology", "8L storage with level indicator", "Free installation included"],
    specs: { Storage: "8 L", Stages: "7", Technology: "RO+UV+Copper" } },
  { id: "p19", cat: "appliances", brand: "SpinJet", name: "SpinJet 7.5kg Fully-Automatic Front Load Washing Machine — Steam Wash", art: "🧺", bg: "linear-gradient(135deg,#004d40,#26a69a)", price: 24490, mrp: 35990, rating: 4.5, reviews: 4310, plus: true, stock: 9, tag: "best",
    about: ["1200 RPM front load with steam wash", "In-built heater removes allergens", "AI wash detects fabric & load", "5-star energy rating"],
    specs: { Capacity: "7.5 kg", RPM: "1200", Rating: "5 Star", Warranty: "12 yrs motor" } },

  { id: "p20", cat: "books", brand: "NovaPress", name: "Atomic Habits by James Clear — Tiny Changes, Remarkable Results (Paperback)", art: "📖", bg: "linear-gradient(135deg,#e65100,#ffb74d)", price: 399, mrp: 899, rating: 4.7, reviews: 98213, plus: true, stock: 120, tag: "best",
    about: ["#1 international bestseller on habit building", "Practical 4-law framework", "320 pages, English paperback"],
    specs: { Format: "Paperback", Pages: "320", Language: "English" } },
  { id: "p21", cat: "books", brand: "NovaPress", name: "The Psychology of Money by Morgan Housel (Paperback)", art: "📕", bg: "linear-gradient(135deg,#b71c1c,#ef5350)", price: 349, mrp: 599, rating: 4.6, reviews: 67542, plus: true, stock: 95,
    about: ["Timeless lessons on wealth, greed & happiness", "19 short stories on money behaviour", "252 pages, English paperback"],
    specs: { Format: "Paperback", Pages: "252", Language: "English" } },
  { id: "p22", cat: "books", brand: "NovaPress", name: "System Design Interview Vol. 1 by Alex Xu (Paperback)", art: "📘", bg: "linear-gradient(135deg,#0d47a1,#5c9ce6)", price: 2450, mrp: 3200, rating: 4.6, reviews: 12876, plus: false, stock: 28, tag: "new",
    about: ["Step-by-step framework for design interviews", "16 real interview questions with deep dives", "A must-read for senior engineering roles"],
    specs: { Format: "Paperback", Pages: "322", Language: "English" } },

  { id: "p23", cat: "grocery", brand: "FarmRoot", name: "FarmRoot California Almonds 1kg — Premium Nonpareil, Zip-Lock Pack", art: "🌰", bg: "linear-gradient(135deg,#33691e,#9ccc65)", price: 749, mrp: 1200, rating: 4.3, reviews: 21453, plus: true, stock: 70, tag: "deal",
    about: ["100% natural nonpareil almonds", "Rich in protein & vitamin E", "Resealable zip-lock freshness pack"],
    specs: { Weight: "1 kg", Type: "Nonpareil", Shelf: "12 months" } },
  { id: "p24", cat: "grocery", brand: "BrewBean", name: "BrewBean Instant Coffee 200g — 100% Arabica, Dark Roast", art: "☕", bg: "linear-gradient(135deg,#3e2723,#795548)", price: 499, mrp: 750, rating: 4.4, reviews: 9876, plus: true, stock: 88,
    about: ["100% Arabica beans, dark roasted", "Freeze-dried for rich aroma", "Makes ~100 cups"],
    specs: { Weight: "200 g", Roast: "Dark", Type: "Freeze-dried" } },

  { id: "p25", cat: "toys", brand: "BrickWorld", name: "BrickWorld Space Shuttle Building Set — 1247 Pieces, Ages 9+", art: "🚀", bg: "linear-gradient(135deg,#c62828,#ef5350)", price: 2799, mrp: 4999, rating: 4.7, reviews: 5432, plus: true, stock: 16, tag: "new",
    about: ["1247-piece detailed space shuttle model", "Opening payload bay + articulated arm", "Display stand with name plate included"],
    specs: { Pieces: "1247", Age: "9+", Size: "39 cm long" } },
  { id: "p26", cat: "toys", brand: "ZoomBotics", name: "ZoomBotics RC Stunt Car — 360° Flips, Gesture Control, 2 Batteries", art: "🏎️", bg: "linear-gradient(135deg,#1a237e,#5c6bc0)", price: 1299, mrp: 2599, rating: 4.1, reviews: 7789, plus: false, stock: 42, tag: "deal",
    about: ["Double-sided 360° flip stunts", "Gesture watch control + remote", "2 rechargeable batteries = 40 min play"],
    specs: { Control: "2.4 GHz + gesture", Play: "40 min", Age: "6+" } },
  { id: "p27", cat: "electronics", brand: "KeyForge", name: "KeyForge K68 Mechanical Keyboard — Hot-Swap, RGB, Blue Switches", art: "⌨️", bg: "linear-gradient(135deg,#212121,#757575)", price: 2299, mrp: 4499, rating: 4.5, reviews: 6210, plus: true, stock: 27, tag: "new",
    about: ["Hot-swappable blue switches", "Per-key RGB with 18 effects", "65% compact layout, detachable USB-C"],
    specs: { Layout: "65%", Switches: "Blue (hot-swap)", Backlight: "RGB" } },
  { id: "p28", cat: "home", brand: "GreenLeaf", name: "GreenLeaf Self-Watering Planter Set of 3 — Indoor Pots with Water Level Window", art: "🪴", bg: "linear-gradient(135deg,#2e7d32,#81c784)", price: 649, mrp: 1299, rating: 4.2, reviews: 3345, plus: true, stock: 50,
    about: ["Self-watering wick system — water once in 2 weeks", "Transparent water-level window", "Set of 3 (S/M/L), matte finish"],
    specs: { Material: "PP plastic", Sizes: "S, M, L", Colour: "Sage green" } },
];

export const REVIEW_SNIPPETS = [
  { name: "Rahul S.", stars: 5, title: "Excellent value for money", body: "Been using it for a month now — build quality feels premium and it works exactly as described. Delivery was a day early too." },
  { name: "Priya M.", stars: 4, title: "Very good, minor gripes", body: "Overall really happy with the purchase. Packaging was secure. Knocked one star off because the manual could be clearer." },
  { name: "Amit K.", stars: 5, title: "Exceeded expectations", body: "Honestly wasn't expecting this quality at this price. Comparing with pricier brands, this holds up really well." },
  { name: "Sneha T.", stars: 4, title: "Solid buy", body: "Does the job perfectly. Customer support was responsive when I had a setup question. Would recommend to friends." },
];

export const FREE_SHIP_THRESHOLD = 499;
export const DELIVERY_FEE = 40;
