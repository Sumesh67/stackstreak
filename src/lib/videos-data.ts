export type Video = {
  id: string;
  youtubeId: string;
  title: string;
  creator: string;
  category: string;
  saves: string; // estimated savings
  duration: string;
  tags: string[];
};

export const VIDEOS: Video[] = [
  // Groceries
  {
    id: "v1",
    youtubeId: "iiYgGPDgOVE",
    title: "Cut Your Grocery Bill in Half",
    creator: "@BudgetBites",
    category: "groceries",
    saves: "$150/mo",
    duration: "0:58",
    tags: ["groceries", "meal prep", "savings"],
  },
  {
    id: "v2",
    youtubeId: "6PsNvxnKoLQ",
    title: "5 Grocery Hacks Nobody Tells You",
    creator: "@FrugalLiving",
    category: "groceries",
    saves: "$80/mo",
    duration: "0:45",
    tags: ["groceries", "hacks"],
  },
  {
    id: "v3",
    youtubeId: "UcnNJe5FWQY",
    title: "Stop Wasting Food — Freeze Everything",
    creator: "@ZeroWasteKitchen",
    category: "groceries",
    saves: "$100/mo",
    duration: "1:02",
    tags: ["groceries", "food waste"],
  },
  // Subscriptions
  {
    id: "v4",
    youtubeId: "ZHbvVWXK0YM",
    title: "I Cancelled 6 Subscriptions and Saved $200",
    creator: "@MinimalistMoney",
    category: "subscriptions",
    saves: "$200/mo",
    duration: "0:52",
    tags: ["subscriptions", "cancel", "audit"],
  },
  {
    id: "v5",
    youtubeId: "sBs3eDT4YeQ",
    title: "How to Negotiate Your Bills Down (Script Included)",
    creator: "@BillNinja",
    category: "bills",
    saves: "$120/mo",
    duration: "0:59",
    tags: ["bills", "negotiate", "internet"],
  },
  // Food
  {
    id: "v6",
    youtubeId: "HYe2DYkY1XE",
    title: "Meal Prep for the Whole Week — $3/Meal",
    creator: "@BudgetMeals",
    category: "food",
    saves: "$250/mo",
    duration: "1:00",
    tags: ["meal prep", "food", "cooking"],
  },
  {
    id: "v7",
    youtubeId: "Z_5tBJiWAMo",
    title: "Delete DoorDash and Save $300 a Month",
    creator: "@NoMoreDelivery",
    category: "food",
    saves: "$300/mo",
    duration: "0:47",
    tags: ["delivery", "doordash", "food"],
  },
  // Shopping
  {
    id: "v8",
    youtubeId: "6mkT0FBjwlA",
    title: "48-Hour Rule: Stop Buying Things You Don't Need",
    creator: "@SmartSpender",
    category: "shopping",
    saves: "$100/mo",
    duration: "0:55",
    tags: ["shopping", "impulse", "mindset"],
  },
  {
    id: "v9",
    youtubeId: "JhDd1V-AHNE",
    title: "Buy Secondhand First — Always",
    creator: "@ThriftQueen",
    category: "shopping",
    saves: "$150/mo",
    duration: "0:50",
    tags: ["thrift", "secondhand", "shopping"],
  },
  // Mindset
  {
    id: "v10",
    youtubeId: "U_-GKqx8pzY",
    title: "The Psychology of Saving Money",
    creator: "@MoneyMindset",
    category: "mindset",
    saves: "Priceless",
    duration: "1:00",
    tags: ["mindset", "habits", "psychology"],
  },
  {
    id: "v11",
    youtubeId: "xPwBKzLkFzM",
    title: "Why You're Broke (It's Not What You Think)",
    creator: "@FinanceFix",
    category: "mindset",
    saves: "$200+/mo",
    duration: "0:58",
    tags: ["mindset", "habits", "money"],
  },
  // Inflation hacks
  {
    id: "v12",
    youtubeId: "bbnX4EvUOMg",
    title: "Beating Inflation at the Grocery Store",
    creator: "@InflationProof",
    category: "groceries",
    saves: "$120/mo",
    duration: "0:54",
    tags: ["inflation", "groceries", "2025"],
  },
];

export const VIDEO_CATEGORIES = [
  { id: "all", name: "All", icon: "🔥" },
  { id: "groceries", name: "Groceries", icon: "🛒" },
  { id: "subscriptions", name: "Subscriptions", icon: "📱" },
  { id: "bills", name: "Bills", icon: "💡" },
  { id: "food", name: "Food", icon: "🍕" },
  { id: "shopping", name: "Shopping", icon: "🛍️" },
  { id: "mindset", name: "Mindset", icon: "🧠" },
];
