import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Truck,
  UserRound,
  X,
} from "lucide-react";

type Page = "home" | "shop" | "classifieds" | "cart" | "checkout" | "login" | "success";
type Category = "All" | "Home & living" | "Fashion" | "Tech" | "Outdoors";
type Product = {
  id: number;
  name: string;
  price: number;
  category: Exclude<Category, "All">;
  condition: string;
  location: string;
  image: string;
  seller: string;
  badge?: string;
};
type Classified = {
  id: number;
  title: string;
  price: number;
  category: string;
  location: string;
  posted: string;
  image: string;
};

const products: Product[] = [
  { id: 1, name: "The Sunday Lounge Chair", price: 185, category: "Home & living", condition: "Like new", location: "Brooklyn, NY", image: "photo-1598300056393-4aac492f4344", seller: "Olive & Oak", badge: "A neighborhood fave" },
  { id: 2, name: "Everyday Canvas Tote", price: 38, category: "Fashion", condition: "Brand new", location: "Queens, NY", image: "photo-1544816155-12df9643f363", seller: "Mila Santos" },
  { id: 3, name: "35mm Film Camera", price: 120, category: "Tech", condition: "Great condition", location: "Brooklyn, NY", image: "photo-1516035069371-29a1b244cc32", seller: "Frame by Frame", badge: "Just listed" },
  { id: 4, name: "Weekend Ceramic Set", price: 64, category: "Home & living", condition: "Handmade", location: "Manhattan, NY", image: "photo-1493106641515-6b5631de4bb9", seller: "Form Studio" },
  { id: 5, name: "Trail Daypack 24L", price: 72, category: "Outdoors", condition: "Gently used", location: "Queens, NY", image: "photo-1553062407-98eeb64c6a62", seller: "Ari W." },
  { id: 6, name: "Linen Button-Up", price: 46, category: "Fashion", condition: "Like new", location: "Brooklyn, NY", image: "photo-1598033129183-c4f50c736f10", seller: "June Vintage" },
  { id: 7, name: "The Little Reading Lamp", price: 58, category: "Home & living", condition: "Great condition", location: "Brooklyn, NY", image: "photo-1507473885765-e6ed057f782c", seller: "Noah Bennett" },
  { id: 8, name: "Pocket Bluetooth Speaker", price: 32, category: "Tech", condition: "Like new", location: "Manhattan, NY", image: "photo-1608043152269-423dbba4e7e1", seller: "Sound Goods" },
];

const classifieds: Classified[] = [
  { id: 1, title: "Vintage teak dining table", price: 340, category: "Furniture", location: "Park Slope", posted: "2 hours ago", image: "photo-1604578762246-41134e37f9cc" },
  { id: 2, title: "Two tickets to Sunday’s game", price: 85, category: "Tickets", location: "Williamsburg", posted: "4 hours ago", image: "photo-1431324155629-1a6deb1dec8d" },
  { id: 3, title: "Looking for a third roommate", price: 1250, category: "Housing", location: "Bed-Stuy", posted: "Yesterday", image: "photo-1522708323590-d24dbb6b0267" },
  { id: 4, title: "Guitar lessons in the neighborhood", price: 40, category: "Services", location: "Fort Greene", posted: "Yesterday", image: "photo-1525201548942-d8732f6617a0" },
  { id: 5, title: "Set of 4 patio chairs", price: 60, category: "Furniture", location: "Carroll Gardens", posted: "2 days ago", image: "photo-1505693416388-ac5ce068fe85" },
  { id: 6, title: "Garden share: spring spots", price: 15, category: "Community", location: "Prospect Heights", posted: "2 days ago", image: "photo-1416879595882-3373a0480b5b" },
];

const categories: { label: Exclude<Category, "All">; image: string; note: string }[] = [
  { label: "Home & living", image: "photo-1600210492486-724fe5c67fb0", note: "Make room for good things" },
  { label: "Fashion", image: "photo-1483985988355-763728e1935b", note: "Wear it your way" },
  { label: "Tech", image: "photo-1519389950473-47ba0277781c", note: "Clever things, second lives" },
  { label: "Outdoors", image: "photo-1470770841072-f978cf4d019e", note: "A little more outside" },
];

const photo = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const money = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

function App() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [classifiedFilter, setClassifiedFilter] = useState("All posts");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [notice, setNotice] = useState("");

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartItems = products.filter((product) => cart[product.id]);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = `${product.name} ${product.category} ${product.seller}`.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [activeCategory, search]);
  const visibleClassifieds = classifieds.filter((listing) => classifiedFilter === "All posts" || listing.category === classifiedFilter);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setMobileMenu(false);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (productId: number) => {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
    setNotice("Added to your bag");
    window.setTimeout(() => setNotice(""), 2200);
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart((current) => {
      const quantity = (current[productId] ?? 0) + change;
      if (quantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: quantity };
    });
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  };

  return (
    <div className="app-shell">
      <div className="announcement">
        <Sparkles size={14} />
        <span>Good finds, good people — a marketplace for your neighborhood</span>
        <ArrowUpRight size={14} />
      </div>
      <header className="site-header">
        <button className="brand" onClick={() => navigate("home")} aria-label="marketday home">
          <span className="brand-mark">m<span>.</span></span>
          <span className="brand-word">marketday</span>
        </button>
        <nav className={`main-nav ${mobileMenu ? "is-open" : ""}`} aria-label="Main navigation">
          <button className={page === "home" ? "nav-link active" : "nav-link"} onClick={() => navigate("home")}>Home</button>
          <button className={page === "shop" ? "nav-link active" : "nav-link"} onClick={() => { setActiveCategory("All"); navigate("shop"); }}>Shop</button>
          <button className={page === "classifieds" ? "nav-link active" : "nav-link"} onClick={() => navigate("classifieds")}>Classifieds</button>
          <button className="nav-link nav-link-muted" onClick={() => navigate("classifieds")}>Our story</button>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-trigger" aria-label="Search" onClick={() => navigate("shop")}><Search size={20} /></button>
          <button className="icon-button account-trigger" aria-label={signedIn ? "Account" : "Sign in"} onClick={() => navigate("login")}><UserRound size={20} /><span className="action-label">{signedIn ? "Account" : "Sign in"}</span></button>
          <button className="icon-button bag-trigger" aria-label={`Shopping bag, ${cartCount} items`} onClick={() => navigate("cart")}><ShoppingBag size={20} /><span className="action-label">Bag</span><span className="bag-count">{cartCount}</span></button>
          <button className="icon-button menu-trigger" aria-label="Open menu" onClick={() => setMobileMenu((open) => !open)}>{mobileMenu ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>

      <main>
        {page === "home" && <HomePage navigate={navigate} setCategory={(category) => { setActiveCategory(category); navigate("shop"); }} addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} products={products} />}
        {page === "shop" && <ShopPage products={visibleProducts} search={search} setSearch={setSearch} category={activeCategory} setCategory={setActiveCategory} addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} />}
        {page === "classifieds" && <ClassifiedsPage listings={visibleClassifieds} filter={classifiedFilter} setFilter={setClassifiedFilter} />}
        {page === "cart" && <CartPage items={cartItems} cart={cart} subtotal={subtotal} updateQuantity={updateQuantity} navigate={navigate} />}
        {page === "checkout" && <CheckoutPage subtotal={subtotal} onBack={() => navigate("cart")} onPlaceOrder={() => { setCart({}); setOrderPlaced(true); navigate("success"); }} />}
        {page === "login" && <LoginPage signedIn={signedIn} onLogin={() => { setSignedIn(true); navigate("home"); }} />}
        {page === "success" && <SuccessPage navigate={navigate} orderPlaced={orderPlaced} />}
      </main>

      <Footer navigate={navigate} />
      {notice && <div className="toast" role="status"><Check size={17} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={14} /></button></div>}
    </div>
  );
}

function HomePage({ navigate, setCategory, addToCart, favorites, toggleFavorite, products: featuredProducts }: {
  navigate: (page: Page) => void;
  setCategory: (category: Exclude<Category, "All">) => void;
  addToCart: (id: number) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  products: Product[];
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> THE NEIGHBORHOOD MARKETPLACE</div>
          <h1>Good things<br />find <span>good people.</span></h1>
          <p>One-of-a-kind finds, right around the corner. Shop small, pass it on, make your neighborhood a little more you.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => navigate("shop")}>Explore the market <ArrowRight size={17} /></button>
            <button className="text-button" onClick={() => navigate("classifieds")}>Browse classifieds <ArrowUpRight size={16} /></button>
          </div>
          <div className="hero-social-proof">
            <div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div>
            <div><strong>12,000+</strong><span> neighbors trading good things</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <img src={photo("photo-1441986300917-64674bd600d8", 1500)} alt="A welcoming neighborhood shop filled with unique finds" />
          <div className="hero-image-label"><span className="label-sparkle"><Sparkles size={15} /></span><span><strong>Something good is</strong><br />always around the corner</span><ArrowUpRight size={16} /></div>
          <div className="hero-note"><span>LOCAL FINDS</span><strong>Made for<br />real life.</strong><ArrowDownRight size={22} /></div>
        </div>
        <div className="hero-index">01 <span>/</span> 04</div>
      </section>

      <section className="trust-strip">
        <div><ShieldCheck size={19} /><span>Good finds, verified neighbors</span></div>
        <i />
        <div><Leaf size={19} /><span>Better for your block & the planet</span></div>
        <i />
        <div><MapPin size={19} /><span>Always close to home</span></div>
        <i />
        <div><Heart size={18} /><span>Made for passing things on</span></div>
      </section>

      <section className="section category-section">
        <SectionHeading kicker="A LITTLE BIT OF EVERYTHING" title={<>Find your kind<br />of <span>good.</span></>} action="Shop all categories" onAction={() => navigate("shop")} />
        <div className="category-grid">
          {categories.map((category, index) => (
            <button className={`category-card category-card-${index + 1}`} onClick={() => setCategory(category.label)} key={category.label}>
              <img src={photo(category.image, 700)} alt="" />
              <span className="category-card-shade" />
              <span className="category-card-content"><span className="category-number">0{index + 1}</span><strong>{category.label}</strong><small>{category.note}</small></span>
              <span className="category-arrow"><ArrowUpRight size={19} /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="section finds-section">
        <SectionHeading kicker="FRESH FROM YOUR NEIGHBORHOOD" title={<>The good stuff<br /><span>doesn’t stick around.</span></>} action="See everything" onAction={() => navigate("shop")} />
        <div className="product-grid product-grid-home">
          {featuredProducts.slice(0, 4).map((product, index) => <ProductCard key={product.id} product={product} index={index} addToCart={addToCart} favorite={favorites.includes(product.id)} toggleFavorite={toggleFavorite} />)}
        </div>
      </section>

      <section className="community-banner">
        <div className="community-picture"><img src={photo("photo-1529156069898-49953e39b3ac", 1000)} alt="Friends enjoying time together in their neighborhood" /><span className="picture-sticker">A good<br />thing starts<br />with you <Heart size={15} fill="currentColor" /></span></div>
        <div className="community-copy"><div className="eyebrow"><span className="eyebrow-dot" /> MORE THAN A MARKET</div><h2>Your block has<br />a lot to <span>give.</span></h2><p>Clear a little space, find a new favorite, or meet the neighbor three doors down. Good things happen when we keep it local.</p><button className="button button-dark" onClick={() => navigate("classifieds")}>Meet your community <ArrowRight size={17} /></button><div className="community-signoff"><span>KEEP IT CLOSE. PASS IT ON.</span><ArrowUpRight size={18} /></div></div>
      </section>

      <section className="closing-cta"><span className="closing-star">✳</span><p>A good find deserves<br />a <em>second hello.</em></p><button onClick={() => navigate("shop")}>Find yours <ArrowUpRight size={17} /></button><span className="closing-sub">GOOD THINGS, CLOSE BY.</span></section>
    </>
  );
}

function SectionHeading({ kicker, title, action, onAction }: { kicker: string; title: React.ReactNode; action: string; onAction: () => void }) {
  return <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />{kicker}</div><h2>{title}</h2></div><button className="section-link" onClick={onAction}>{action}<ArrowUpRight size={16} /></button></div>;
}

function ProductCard({ product, index, addToCart, favorite, toggleFavorite }: { product: Product; index: number; addToCart: (id: number) => void; favorite: boolean; toggleFavorite: (id: number) => void }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap"><img src={photo(product.image, 750)} alt={product.name} loading="lazy" /><span className="product-index">0{index + 1}</span>{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`favorite-button ${favorite ? "is-favorite" : ""}`} onClick={() => toggleFavorite(product.id)} aria-label={favorite ? "Remove from saved items" : "Save item"}><Heart size={17} fill={favorite ? "currentColor" : "none"} /></button><button className="quick-add" onClick={() => addToCart(product.id)}>Add to bag <Plus size={15} /></button></div>
      <div className="product-info"><div className="product-meta"><span>{product.category}</span><span>{product.condition}</span></div><div className="product-title-row"><h3>{product.name}</h3><strong>{money(product.price)}</strong></div><div className="seller-row"><span className="seller-avatar">{product.seller.charAt(0)}</span><span>{product.seller}</span><span className="seller-location"><MapPin size={12} />{product.location}</span></div></div>
    </article>
  );
}

function ShopPage({ products: listedProducts, search, setSearch, category, setCategory, addToCart, favorites, toggleFavorite }: {
  products: Product[];
  search: string;
  setSearch: (value: string) => void;
  category: Category;
  setCategory: (value: Category) => void;
  addToCart: (id: number) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}) {
  return (
    <section className="listing-page section">
      <div className="page-kicker"><span className="eyebrow-dot" /> THE MARKET</div>
      <div className="listing-title-row"><div><h1>Good finds,<br /><span>right this way.</span></h1><p>A little something for your home, your closet, your next adventure.</p></div><div className="market-stats"><strong>128</strong><span>new finds<br />this week</span><ArrowDownRight size={22} /></div></div>
      <div className="shop-tools"><label className="shop-search"><Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="What are you looking for?" aria-label="Search products" />{search && <button aria-label="Clear search" onClick={() => setSearch("")}><X size={16} /></button>}</label><button className="filter-button" onClick={() => setCategory("All")}><SlidersHorizontal size={17} /> Reset filters</button><button className="sort-button" onClick={() => setCategory(category === "All" ? "Home & living" : "All")}>Featured <ChevronDown size={16} /></button></div>
      <div className="filter-chips">{(["All", "Home & living", "Fashion", "Tech", "Outdoors"] as Category[]).map((item) => <button key={item} className={category === item ? "filter-chip selected" : "filter-chip"} onClick={() => setCategory(item)}>{item}</button>)}</div>
      {listedProducts.length > 0 ? <div className="product-grid shop-product-grid">{listedProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} addToCart={addToCart} favorite={favorites.includes(product.id)} toggleFavorite={toggleFavorite} />)}</div> : <div className="empty-search"><Search size={24} /><h3>No finds just yet.</h3><p>Try a different search or browse all of the market.</p><button className="button button-dark" onClick={() => { setSearch(""); setCategory("All"); }}>Show me everything</button></div>}
      <div className="local-note"><MapPin size={18} /><p><strong>Keep it close.</strong> Everything here comes from a neighbor in your community.</p><ArrowUpRight size={17} /></div>
    </section>
  );
}

function ClassifiedsPage({ listings, filter, setFilter }: { listings: Classified[]; filter: string; setFilter: (filter: string) => void }) {
  const filters = ["All posts", "Furniture", "Tickets", "Housing", "Services", "Community"];
  return (
    <section className="classified-page section">
      <div className="classified-intro"><div><div className="page-kicker"><span className="eyebrow-dot" /> YOUR NEIGHBORHOOD, ON THE BOARD</div><h1>A little of<br /><span>everything.</span></h1><p>Looking for a thing? Offering a thing? This is where your block figures it out together.</p><div className="classified-actions"><button className="button button-dark" onClick={() => window.alert("Posting is coming soon! Check back to share something with your neighborhood.")}>Post a listing <Plus size={17} /></button><span><BadgeCheck size={16} /> Just neighbors, helping neighbors</span></div></div><div className="classified-intro-image"><img src={photo("photo-1511632765486-a01980e01a18", 1100)} alt="Neighbors sharing a moment together" /><div className="intro-image-caption"><span>THE NEIGHBORHOOD BOARD</span><strong>Local looks<br />good on you.</strong></div></div></div>
      <div className="classified-toolbar"><div><span className="eyebrow-dot" /> THE COMMUNITY BOARD <span className="listing-total">· {listings.length} listings</span></div><button className="sort-button"><SlidersHorizontal size={16} /> Sort: newest <ChevronDown size={15} /></button></div>
      <div className="filter-chips classified-chips">{filters.map((item) => <button key={item} className={filter === item ? "filter-chip selected" : "filter-chip"} onClick={() => setFilter(item)}>{item}</button>)}</div>
      {listings.length > 0 ? <div className="classified-grid">{listings.map((item, index) => <article className="classified-card" key={item.id}><div className="classified-image"><img src={photo(item.image, 780)} alt={item.title} loading="lazy" /><span className="classified-number">0{index + 1}</span><button aria-label="Save listing" className="favorite-button"><Heart size={17} /></button></div><div className="classified-card-body"><div className="classified-card-meta"><span>{item.category}</span><span>{item.posted}</span></div><div className="classified-card-title"><h3>{item.title}</h3><strong>{money(item.price)}{item.category === "Housing" && <small>/mo</small>}</strong></div><div className="classified-location"><MapPin size={14} />{item.location}, Brooklyn</div></div></article>)}</div> : <div className="empty-search"><h3>No listings in this category yet.</h3><p>Try another board, or come back soon.</p><button className="button button-dark" onClick={() => setFilter("All posts")}>See all listings</button></div>}
      <div className="classified-bottom"><span className="classified-doodle">✳</span><div><h3>Have something good to share?</h3><p>It starts with one post and a neighbor who needs just that.</p></div><button className="button button-outline" onClick={() => window.alert("Posting is coming soon! Check back to share something with your neighborhood.")}>Put it out there <ArrowUpRight size={16} /></button></div>
    </section>
  );
}

function CartPage({ items, cart, subtotal, updateQuantity, navigate }: {
  items: Product[];
  cart: Record<number, number>;
  subtotal: number;
  updateQuantity: (id: number, change: number) => void;
  navigate: (page: Page) => void;
}) {
  return (
    <section className="cart-page section">
      <button className="back-link" onClick={() => navigate("shop")}><ArrowLeft size={16} /> Keep looking</button>
      <div className="page-kicker"><span className="eyebrow-dot" /> YOUR LITTLE BAG</div>
      <div className="cart-title-row"><h1>Good choices.</h1><span>{items.length} {items.length === 1 ? "item" : "items"} · {Object.values(cart).reduce((sum, value) => sum + value, 0)} total</span></div>
      {items.length === 0 ? <div className="empty-cart"><div className="empty-bag-icon"><ShoppingBag size={30} /></div><h2>Your bag’s taking a little break.</h2><p>We think it’s ready for a good find or two.</p><button className="button button-dark" onClick={() => navigate("shop")}>Find something good <ArrowRight size={17} /></button></div> : <div className="cart-layout"><div className="cart-items">{items.map((product) => <article className="cart-item" key={product.id}><img src={photo(product.image, 480)} alt={product.name} /><div className="cart-item-info"><span>{product.category}</span><h3>{product.name}</h3><p><MapPin size={13} /> {product.location} · from {product.seller}</p><div className="quantity-control"><button aria-label={`Remove one ${product.name}`} onClick={() => updateQuantity(product.id, -1)}><Minus size={14} /></button><span>{cart[product.id]}</span><button aria-label={`Add one ${product.name}`} onClick={() => updateQuantity(product.id, 1)}><Plus size={14} /></button><button className="remove-item" aria-label={`Remove ${product.name}`} onClick={() => updateQuantity(product.id, -cart[product.id])}><Trash2 size={14} /></button></div></div><strong className="cart-item-price">{money(product.price * cart[product.id])}</strong></article>)}</div><aside className="order-summary"><h2>Your good things</h2><div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Neighborhood delivery</span><strong>{subtotal > 100 ? "On us" : "$6"}</strong></div><p className="delivery-note"><Truck size={16} /> Local delivery is free on orders over $100.</p><div className="summary-total"><span>Estimated total</span><strong>{money(subtotal + (subtotal > 100 ? 0 : 6))}</strong></div><button className="button button-dark checkout-button" onClick={() => navigate("checkout")}>Continue to checkout <ArrowRight size={17} /></button><div className="secure-note"><LockKeyhole size={13} /> Secure checkout · neighbor-approved</div><div className="summary-love"><Heart size={16} /> Shopping local feels good.</div></aside></div>}
    </section>
  );
}

function CheckoutPage({ subtotal, onBack, onPlaceOrder }: { subtotal: number; onBack: () => void; onPlaceOrder: () => void }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const total = subtotal + (subtotal > 100 ? 0 : 6);
  return (
    <section className="checkout-page section"><button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Back to your bag</button><div className="page-kicker"><span className="eyebrow-dot" /> ALMOST YOURS</div><h1>Let’s make it<br /><span>official.</span></h1><div className="checkout-layout"><form className="checkout-form" onSubmit={(event) => { event.preventDefault(); onPlaceOrder(); }}><div className="checkout-step"><span>01</span><div><h2>Where should it go?</h2><p>Delivered by a neighbor, right to your door.</p></div><ChevronDown size={18} /></div><div className="form-grid"><label className="form-field form-full">Email address<input type="email" placeholder="you@example.com" required /></label><label className="form-field form-full">Street address<input type="text" placeholder="123 Neighborhood St." required /></label><label className="form-field">City<input type="text" placeholder="Brooklyn" required /></label><label className="form-field">ZIP code<input type="text" inputMode="numeric" placeholder="11201" pattern="[0-9]{5}" required /></label></div><div className="checkout-step payment-step"><span>02</span><div><h2>How would you like to pay?</h2><p>Safe, secure, and straightforward.</p></div><LockKeyhole size={16} /></div><div className="payment-options"><button type="button" className={paymentMethod === "card" ? "payment-option selected" : "payment-option"} onClick={() => setPaymentMethod("card")}><span className="radio-dot" /> Credit or debit card <span className="card-logos">VISA · MC · AMEX</span></button>{paymentMethod === "card" && <div className="form-grid card-fields"><label className="form-field form-full">Card number<input type="text" inputMode="numeric" placeholder="0000  0000  0000  0000" required pattern="[0-9 ]{12,23}" /></label><label className="form-field">Expiration date<input type="text" placeholder="MM / YY" required /></label><label className="form-field">Security code<input type="text" inputMode="numeric" placeholder="CVC" required /></label></div>}<button type="button" className={paymentMethod === "pickup" ? "payment-option selected" : "payment-option"} onClick={() => setPaymentMethod("pickup")}><span className="radio-dot" /> Pay your neighbor at pickup <span className="pickup-label">LOCAL PICKUP</span></button></div><button className="button button-dark place-order-button" type="submit">Place your order <ArrowRight size={17} /></button><p className="checkout-legal"><LockKeyhole size={13} /> Your details stay safe. Your neighbors stay happy.</p></form><aside className="checkout-summary"><h2>A good little haul.</h2><div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Neighborhood delivery</span><strong>{subtotal > 100 ? "On us" : "$6"}</strong></div><div className="summary-total"><span>Total today</span><strong>{money(total)}</strong></div><div className="checkout-promise"><PackageCheck size={18} /><p><strong>Local, by nature.</strong><br />Your order supports a neighbor — not a warehouse.</p></div></aside></div></section>
  );
}

function LoginPage({ signedIn, onLogin }: { signedIn: boolean; onLogin: () => void }) {
  return <section className="login-page"><div className="login-image"><img src={photo("photo-1529156069898-49953e39b3ac", 1200)} alt="Neighbors sharing a picnic" /><div className="login-image-note"><span>YOUR PEOPLE ARE HERE</span><h2>Good things<br />are better<br /><em>together.</em></h2></div></div><div className="login-panel"><div className="login-panel-inner"><div className="page-kicker"><span className="eyebrow-dot" /> COME ON IN</div><h1>{signedIn ? "Welcome back." : "Hey, neighbor."}</h1><p>Sign in to save your favorites and keep the good stuff close.</p><form onSubmit={(event) => { event.preventDefault(); onLogin(); }}><label className="form-field">Email address<span className="input-icon"><Mail size={17} /><input type="email" placeholder="you@example.com" required /></span></label><label className="form-field">Password<input type="password" placeholder="Your password" required minLength={6} /></label><button className="forgot-link" type="button">Forgot password?</button><button className="button button-dark login-submit" type="submit">Sign in to marketday <ArrowRight size={17} /></button></form><div className="login-divider"><span /> OR <span /></div><button className="button button-outline email-signup" onClick={onLogin}>Continue with email <Mail size={17} /></button><p className="signup-copy">New around here? <button onClick={onLogin}>Join the neighborhood</button></p><div className="login-footnote"><ShieldCheck size={16} /> Friendly neighbors only. Always.</div></div></div></section>;
}

function SuccessPage({ navigate, orderPlaced }: { navigate: (page: Page) => void; orderPlaced: boolean }) {
  return <section className="success-page"><div className="success-mark"><Check size={34} /></div><div className="page-kicker"><span className="eyebrow-dot" /> {orderPlaced ? "IT’S A GOOD DAY" : "GOOD TO SEE YOU"}</div><h1>{orderPlaced ? <>One less thing.<br /><span>One more good thing.</span></> : <>You’re in the<br /><span>neighborhood.</span></>}</h1><p>{orderPlaced ? "Your neighbor has been notified. Your good find is on its way." : "Your account is ready. Go find something that feels like you."}</p><button className="button button-dark" onClick={() => navigate("shop")}>Back to the good stuff <ArrowRight size={17} /></button></section>;
}

function Footer({ navigate }: { navigate: (page: Page) => void }) {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand-block"><button className="brand footer-brand" onClick={() => navigate("home")}><span className="brand-mark">m<span>.</span></span><span className="brand-word">marketday</span></button><p>A little closer.<br />A little more you.</p><span className="footer-handwritten">Good things grow here <ArrowDownRight size={17} /></span></div><div className="footer-column"><span>THE MARKET</span><button onClick={() => navigate("shop")}>Shop everything</button><button onClick={() => navigate("shop")}>Home & living</button><button onClick={() => navigate("shop")}>Fashion & more</button><button onClick={() => navigate("classifieds")}>Classifieds</button></div><div className="footer-column"><span>THE NEIGHBORHOOD</span><button onClick={() => navigate("classifieds")}>Our story</button><button onClick={() => navigate("classifieds")}>How it works</button><button onClick={() => navigate("classifieds")}>Community board</button><button onClick={() => navigate("login")}>Join the neighborhood</button></div><div className="footer-newsletter"><span>GOOD THINGS, OCCASIONALLY.</span><p>Little notes from your neighborhood. No noise.</p><form onSubmit={(event) => { event.preventDefault(); window.alert("You're on the list. Talk soon, neighbor!"); }}><input type="email" aria-label="Your email address" placeholder="Your email address" required /><button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button></form><small>By subscribing, you agree to our neighborhood newsletter.</small></div></div><div className="footer-bottom"><span>© 2025 marketday. Made with a little neighborly love.</span><div><button>Privacy</button><button>Terms</button><button>Instagram <ArrowUpRight size={12} /></button></div><span className="footer-location"><MapPin size={13} /> BROOKLYN, NY & BEYOND</span></div></footer>;
}

export default App;
