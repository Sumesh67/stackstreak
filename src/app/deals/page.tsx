"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Flame, Tag, ExternalLink, ArrowLeft, Bell, Send, Star, Lightbulb } from "lucide-react";
import Link from "next/link";

type Deal = {
  id: string;
  title: string;
  store: string;
  emoji: string;
  savings: string;
  howToGet: string;
  expires: string;
  url: string;
  category: string;
  featured?: boolean;
};

const DEALS: Deal[] = [
  // GROCERIES
  {
    id: "ibotta",
    title: "Ibotta: $5 Welcome Bonus + Cash Back",
    store: "Ibotta",
    emoji: "💰",
    savings: "$5 welcome + up to 10% back",
    howToGet: "Download Ibotta → sign up → scan your first grocery receipt. Share YOUR invite link from the app and earn $5 for every friend who joins.",
    expires: "Ongoing",
    url: "https://ibotta.com/register?invite=dfcghsy",
    category: "Groceries",
  },
  {
    id: "fetch",
    title: "Fetch Rewards: Earn on Every Receipt",
    store: "Fetch Rewards",
    emoji: "🧾",
    savings: "Points on every receipt",
    howToGet: "Download Fetch → snap any receipt → earn points. Share YOUR referral code from the app — both you and your friend get bonus points.",
    expires: "Ongoing",
    url: "https://fetch.com",
    category: "Groceries",
  },
  {
    id: "walmart-plus",
    title: "Walmart+ Free 30-Day Trial",
    store: "Walmart",
    emoji: "🛒",
    savings: "Free delivery ($98/yr value)",
    howToGet: "Sign up at walmart.com, cancel before 30 days if not keeping",
    expires: "Ongoing",
    url: "https://walmart.com",
    category: "Groceries",
  },
  {
    id: "kroger",
    title: "Kroger Digital Coupons",
    store: "Kroger",
    emoji: "🏪",
    savings: "Avg $15/week",
    howToGet: "Create a Kroger account and clip digital coupons before shopping",
    expires: "Refreshes weekly",
    url: "https://kroger.com/savings",
    category: "Groceries",
  },
  {
    id: "aldi",
    title: "ALDI — Always 20–30% Cheaper",
    store: "ALDI",
    emoji: "🥦",
    savings: "20–30% vs name brands",
    howToGet: "Shop at your nearest ALDI — no loyalty card needed",
    expires: "Ongoing",
    url: "https://aldi.us",
    category: "Groceries",
  },
  // GAS
  {
    id: "gasbuddy",
    title: "GasBuddy: Find Cheapest Gas Near You",
    store: "GasBuddy",
    emoji: "⛽",
    savings: "Avg $0.30/gallon",
    howToGet: "Use the GasBuddy app or website before filling up",
    expires: "Ongoing",
    url: "https://gasbuddy.com",
    category: "Gas",
  },

  {
    id: "upside",
    title: "Upside App: Cash Back on Gas",
    store: "Upside",
    emoji: "🚗",
    savings: "Avg 25¢/gallon cash back",
    howToGet: "Download Upside app, find nearby offer, check in at the pump",
    expires: "Ongoing",
    url: "https://upside.com",
    category: "Gas",
  },
  {
    id: "costco-gas",
    title: "Costco Gas: Member Savings",
    store: "Costco",
    emoji: "🔵",
    savings: "$0.20–$0.40/gallon vs avg",
    howToGet: "Costco membership required ($65/yr — pays for itself in gas savings)",
    expires: "Ongoing",
    url: "https://costco.com",
    category: "Gas",
  },
  {
    id: "sams-gas",
    title: "Sam's Club Gas Stations",
    store: "Sam's Club",
    emoji: "🏷️",
    savings: "Avg $0.15–0.25/gallon",
    howToGet: "Non-members can use fuel stations with a fuel-only pass",
    expires: "Ongoing",
    url: "https://samsclub.com",
    category: "Gas",
  },
  {
    id: "grocery-gas",
    title: "Grocery Store Gas Rewards Programs",
    store: "Various",
    emoji: "🎁",
    savings: "$0.10–$0.20/gallon per $100 spent",
    howToGet: "Sign up for loyalty programs at Kroger, Giant Eagle, Safeway",
    expires: "Ongoing",
    url: "https://kroger.com",
    category: "Gas",
  },
  // RESTAURANTS
  {
    id: "mcdonalds",
    title: "McDonald's App: Free Item Weekly",
    store: "McDonald's",
    emoji: "🍔",
    savings: "Free item + deals up to 50% off",
    howToGet: "Download McDonald's app, check 'Deals' tab every week",
    expires: "Weekly refresh",
    url: "https://mcdonalds.com/app",
    category: "Restaurants",
  },
  {
    id: "chipotle",
    title: "Chipotle Rewards: Free Burrito",
    store: "Chipotle",
    emoji: "🌯",
    savings: "Free entrée after 10 purchases",
    howToGet: "Join Chipotle Rewards app, earn 10 points per visit",
    expires: "Ongoing",
    url: "https://chipotle.com",
    category: "Restaurants",
  },
  {
    id: "dominos",
    title: "Domino's Mix & Match Deal",
    store: "Domino's",
    emoji: "🍕",
    savings: "$6.99 each (mix 2+ items)",
    howToGet: "Order online at dominos.com, select Mix & Match items",
    expires: "Ongoing",
    url: "https://dominos.com",
    category: "Restaurants",
  },
  {
    id: "restaurant-com",
    title: "Restaurant.com: $25 Gift Certs for $10",
    store: "Restaurant.com",
    emoji: "🍽️",
    savings: "$15 instant savings per cert",
    howToGet: "Browse restaurant.com for local participating restaurants",
    expires: "Ongoing",
    url: "https://restaurant.com",
    category: "Restaurants",
  },
  {
    id: "seated",
    title: "Seated App: Earn Rewards for Dining",
    store: "Seated",
    emoji: "🪑",
    savings: "$10–$50 in gift card rewards",
    howToGet: "Book through the Seated app at participating restaurants",
    expires: "Ongoing",
    url: "https://seated.com",
    category: "Restaurants",
  },
  // SHOPPING
  {
    id: "honey",
    title: "Honey: Auto-Apply Coupon Codes",
    store: "Honey (by PayPal)",
    emoji: "🍯",
    savings: "Avg $10–$30 per order",
    howToGet: "Add the Honey browser extension — works automatically at checkout",
    expires: "Ongoing",
    url: "https://www.joinhoney.com/ref/stackstreak",
    category: "Shopping",
  },
  {
    id: "rakuten",
    title: "Rakuten: 1–40% Cash Back",
    store: "Rakuten",
    emoji: "💳",
    savings: "1–40% cash back at 3,500+ stores",
    howToGet: "Sign up at rakuten.com, shop through their portal or browser extension",
    expires: "Ongoing",
    url: "https://www.rakuten.com/r/STACKSTREAK",
    category: "Shopping",
  },
  {
    id: "capital-one-shopping",
    title: "Capital One Shopping (Free)",
    store: "Capital One",
    emoji: "🔍",
    savings: "Price comparison + auto coupons",
    howToGet: "Free browser extension — no Capital One card needed",
    expires: "Ongoing",
    url: "https://capitaloneshopping.com",
    category: "Shopping",
  },
  {
    id: "fb-marketplace",
    title: "Facebook Marketplace: Local Deals",
    store: "Facebook",
    emoji: "📱",
    savings: "50–70% off retail avg",
    howToGet: "Browse facebook.com/marketplace for local listings",
    expires: "Ongoing",
    url: "https://facebook.com/marketplace",
    category: "Shopping",
  },
  {
    id: "thredup",
    title: "ThredUp: Secondhand Clothing",
    store: "ThredUp",
    emoji: "👗",
    savings: "Up to 90% off retail",
    howToGet: "Shop at thredup.com — name brands at a fraction of the price",
    expires: "Ongoing",
    url: "https://thredup.com",
    category: "Shopping",
  },
  // APPS & TOOLS
  {
    id: "stackstreak",
    title: "StackStreak: Free Savings Challenges",
    store: "StackStreak",
    emoji: "🔥",
    savings: "Save $1,378+ this year",
    howToGet: "Completely free — start the 52-week challenge today",
    expires: "Ongoing",
    url: "https://stackstreak-two.vercel.app",
    category: "Apps & Tools",
    featured: true,
  },
  {
    id: "trim",
    title: "Trim: Negotiates Bills Automatically",
    store: "Trim",
    emoji: "✂️",
    savings: "Avg $100–$300 negotiated back",
    howToGet: "Connect your accounts at asktrim.com — they take a cut of savings",
    expires: "Ongoing",
    url: "https://asktrim.com",
    category: "Apps & Tools",
  },
  {
    id: "credit-karma",
    title: "Credit Karma / Mint: Free Budget Tracking",
    store: "Credit Karma",
    emoji: "📊",
    savings: "Free — replaces $15/mo budgeting apps",
    howToGet: "Sign up free at creditkarma.com — links all accounts in one view",
    expires: "Ongoing",
    url: "https://creditkarma.com",
    category: "Apps & Tools",
  },
  {
    id: "unroll",
    title: "Unroll.me: Cancel Unwanted Subscriptions",
    store: "Unroll.me",
    emoji: "🗑️",
    savings: "Avg $50–$200/yr in forgotten subs",
    howToGet: "Connect your email at unroll.me — see all subscriptions at once",
    expires: "Ongoing",
    url: "https://unroll.me",
    category: "Apps & Tools",
  },
  {
    id: "nerdwallet",
    title: "NerdWallet: Compare Financial Products",
    store: "NerdWallet",
    emoji: "🤓",
    savings: "Find best rates = $100s/yr",
    howToGet: "Free at nerdwallet.com — compare cards, loans, savings accounts",
    expires: "Ongoing",
    url: "https://nerdwallet.com",
    category: "Apps & Tools",
  },
];

const CATEGORIES = ["All", "Groceries", "Gas", "Restaurants", "Shopping", "Apps & Tools"] as const;

const CATEGORY_ICONS: Record<string, string> = {
  All: "💰",
  Groceries: "🛒",
  Gas: "⛽",
  Restaurants: "🍽️",
  Shopping: "🛍️",
  "Apps & Tools": "📱",
};

const SAVINGS_TIPS = [
  {
    icon: "💡",
    tip: "The Sunday Reset",
    desc: "Every Sunday, spend 10 minutes reviewing your upcoming week's meals. Pre-planning saves avg $80/month on impulse buys and takeout.",
  },
  {
    icon: "⏳",
    tip: "The 48-Hour Rule",
    desc: "For any non-essential purchase over $30, wait 48 hours. 70% of the time, you'll decide you don't need it. That's real money staying in your wallet.",
  },
  {
    icon: "📱",
    tip: "Stack Your Apps",
    desc: "Use Ibotta + Fetch + store loyalty app together on every grocery trip. Triple-dipping on rewards can save $30–$50 per month with zero extra effort.",
  },
];

export default function DealsPage() {
  const [category, setCategory] = useState<string>("All");
  const [email, setEmail] = useState("");
  const [alertSubmitted, setAlertSubmitted] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitData, setSubmitData] = useState({ title: "", store: "", url: "", savings: "" });
  const [submitDone, setSubmitDone] = useState(false);

  const filtered = category === "All" ? DEALS : DEALS.filter((d) => d.category === category);
  const featuredDeal = DEALS.find((d) => d.featured);

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSubmitted(true);
    setEmail("");
  };

  const handleDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitDone(true);
    setTimeout(() => { setShowSubmitForm(false); setSubmitDone(false); }, 2000);
  };

  const lastUpdated = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-6xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Flame className="text-orange-400 w-6 h-6" />
          <span className="font-black text-lg">StackStreak</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/scripts" className="text-gray-400 hover:text-white transition-colors">Scripts</Link>
          <Link href="/missions" className="text-gray-400 hover:text-white transition-colors">Missions</Link>
          <Link href="/tips" className="text-gray-400 hover:text-white transition-colors">Tips</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Refer & Earn Section */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6 mb-6">
          <h2 className="font-black text-lg mb-1 flex items-center gap-2">
            💸 Refer Friends — Earn Real Cash
          </h2>
          <p className="text-gray-400 text-sm mb-4">These apps pay YOU for every friend you invite. No approval needed — just share your personal link from inside each app.</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { emoji: "💰", app: "Ibotta", earn: "$5 per friend", steps: "1. Download Ibotta → 2. Go to Profile → 3. Share your invite code", url: "https://ibotta.com/register?invite=dfcghsy" },
              { emoji: "🧾", app: "Fetch Rewards", earn: "2,000 pts per friend", steps: "1. Download Fetch → 2. Go to Account → 3. Share your referral code", url: "https://fetch.com" },
              { emoji: "🍯", app: "Honey", earn: "500 Gold per friend", steps: "1. Install Honey extension → 2. Go to Gold → 3. Share your referral link", url: "https://joinhoney.com" },
            ].map((item) => (
              <div key={item.app} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">{item.emoji}</div>
                <div className="font-bold text-sm">{item.app}</div>
                <div className="text-green-400 font-semibold text-xs mt-0.5 mb-2">{item.earn}</div>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{item.steps}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1">
                  Get your link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">💡 Post your personal invite link in your social posts and earn every time someone signs up through you.</p>
        </div>

        {/* Affiliate Disclosure */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-gray-400">
          💡 Some links may be affiliate links — we earn a small commission if you sign up, at no extra cost to you. This helps keep StackStreak free!
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Tag className="text-orange-400 w-8 h-8" />
              This Week&apos;s Best Deals
            </h1>
            <p className="text-gray-500 text-sm mt-1">Last updated: {lastUpdated} • Curated inflation-fighting savings</p>
          </div>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-colors text-gray-400 hover:text-white"
          >
            <Send className="w-4 h-4" /> Submit a Deal
          </button>
        </div>

        {/* Featured: StackStreak */}
        {featuredDeal && (
          <div className="bg-gradient-to-r from-orange-500/15 to-yellow-500/10 border border-orange-500/30 rounded-2xl p-6 mb-8 mt-6 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> FEATURED
            </div>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{featuredDeal.emoji}</span>
              <div className="flex-1">
                <h3 className="font-black text-xl text-white">{featuredDeal.title}</h3>
                <p className="text-orange-400 font-semibold mt-1">{featuredDeal.savings}</p>
                <p className="text-gray-400 text-sm mt-2">{featuredDeal.howToGet}</p>
                <a
                  href={featuredDeal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 bg-orange-500 hover:bg-orange-400 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  Start Free <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                category === cat ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Deals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filtered.filter(d => !d.featured).map((deal) => (
            <div key={deal.id} className="bg-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl p-5 flex flex-col transition-all duration-200 group">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl shrink-0">{deal.emoji}</span>
                <div>
                  <h3 className="font-bold text-sm text-white leading-tight group-hover:text-orange-100 transition-colors">{deal.title}</h3>
                  <span className="text-xs text-gray-500 mt-0.5 block">{deal.store}</span>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 mb-3">
                <span className="text-green-400 font-bold text-sm">💰 {deal.savings}</span>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-3">{deal.howToGet}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{deal.expires === "Ongoing" ? "⬤ Ongoing" : `Expires: ${deal.expires}`}</span>
                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Get Deal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Savings Tips This Week */}
        <div className="mb-12">
          <h2 className="text-xl font-black mb-1 flex items-center gap-2">
            <Lightbulb className="text-yellow-400 w-5 h-5" /> Saving Tips This Week
          </h2>
          <p className="text-gray-500 text-sm mb-5">Actionable moves you can make right now.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {SAVINGS_TIPS.map((tip, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-yellow-500/20 transition-colors">
                <span className="text-3xl block mb-3">{tip.icon}</span>
                <h3 className="font-bold text-white mb-2">{tip.tip}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deal Alert signup */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Bell className="text-blue-400 w-6 h-6 mt-1 shrink-0" />
            <div className="flex-1">
              <h3 className="font-black text-lg">🔔 Get Deal Alerts</h3>
              <p className="text-gray-400 text-sm mt-1 mb-4">Get the best deals emailed to you every Monday morning. No spam, just savings.</p>
              {alertSubmitted ? (
                <div className="text-green-400 font-semibold">✅ You&apos;re on the list! Watch your inbox Monday morning.</div>
              ) : (
                <form onSubmit={handleAlertSubmit} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-400 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit a Deal Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#111118] border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-xl font-black mb-2">📨 Submit a Deal</h2>
            <p className="text-gray-400 text-sm mb-6">Know a great deal we missed? Share it with the community.</p>
            {submitDone ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎉</div>
                <p className="font-bold text-green-400">Thanks! We&apos;ll review your deal.</p>
              </div>
            ) : (
              <form onSubmit={handleDealSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Deal title"
                  value={submitData.title}
                  onChange={(e) => setSubmitData(p => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                />
                <input
                  type="text"
                  placeholder="Store or app name"
                  value={submitData.store}
                  onChange={(e) => setSubmitData(p => ({ ...p, store: e.target.value }))}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                />
                <input
                  type="text"
                  placeholder="Savings amount (e.g., $10 off, 20% back)"
                  value={submitData.savings}
                  onChange={(e) => setSubmitData(p => ({ ...p, savings: e.target.value }))}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                />
                <input
                  type="url"
                  placeholder="Link (https://...)"
                  value={submitData.url}
                  onChange={(e) => setSubmitData(p => ({ ...p, url: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Submit Deal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmitForm(false)}
                    className="flex-1 py-3 rounded-xl text-gray-500 hover:text-white border border-white/10 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
