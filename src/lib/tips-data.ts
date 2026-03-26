export type Tip = {
  id: string;
  title: string;
  description: string;
  savings: string; // estimated monthly savings
  effort: "Easy" | "Medium" | "Hard";
  category: string;
  steps?: string[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  tips: Tip[];
};

export const TIPS_CATEGORIES: Category[] = [
  {
    id: "groceries",
    name: "Groceries",
    icon: "🛒",
    color: "from-green-500 to-emerald-600",
    tips: [
      {
        id: "g1",
        title: "Shop with a list — never without one",
        description: "Impulse buys account for 40-60% of grocery spending. A list keeps you focused and out.",
        savings: "$80–$150/mo",
        effort: "Easy",
        category: "groceries",
        steps: [
          "Before going to the store, check what you already have",
          "Plan 5-7 meals for the week",
          "Write your list organized by store section (produce, dairy, etc.)",
          "Stick to the list — if it's not on it, don't buy it",
        ],
      },
      {
        id: "g2",
        title: "Buy store brands instead of name brands",
        description: "Store brands are made by the same manufacturers 80% of the time. You're paying for packaging.",
        savings: "$40–$80/mo",
        effort: "Easy",
        category: "groceries",
        steps: [
          "Start with low-risk items: pasta, canned goods, spices, cleaning supplies",
          "Compare ingredients — they're usually identical",
          "Give each one a fair try before judging",
        ],
      },
      {
        id: "g3",
        title: "Eat before you shop",
        description: "Shopping hungry increases your spend by 30%+. Science backs this up.",
        savings: "$30–$60/mo",
        effort: "Easy",
        category: "groceries",
      },
      {
        id: "g4",
        title: "Freeze everything you won't use in 3 days",
        description: "The average family throws away $1,500/year in wasted food. Freeze bread, meat, leftovers.",
        savings: "$80–$120/mo",
        effort: "Easy",
        category: "groceries",
        steps: [
          "Freeze bread before it goes stale",
          "Portion and freeze meat on the day you buy it",
          "Freeze bananas, berries, and overripe fruit for smoothies",
          "Batch cook and freeze soups, chili, and rice",
        ],
      },
      {
        id: "g5",
        title: "Use cashback apps every grocery run",
        description: "Ibotta, Fetch, and Checkout 51 give you cash back just for uploading your receipt.",
        savings: "$15–$40/mo",
        effort: "Easy",
        category: "groceries",
        steps: [
          "Download Ibotta and Fetch (both free)",
          "Before shopping, check for offers on items you already planned to buy",
          "After shopping, snap your receipt",
          "Cash out when you hit the minimum (usually $20)",
        ],
      },
    ],
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    icon: "📱",
    color: "from-purple-500 to-pink-600",
    tips: [
      {
        id: "s1",
        title: "Audit every subscription you're paying for",
        description: "The average American pays for 3-4 subscriptions they forgot about. Find and cancel them now.",
        savings: "$50–$200/mo",
        effort: "Medium",
        category: "subscriptions",
        steps: [
          "Check your bank/credit card statement for recurring charges",
          "List every subscription with its monthly cost",
          "Ask yourself: did I use this in the last 30 days?",
          "Cancel everything with a 'no' — you can always re-subscribe",
          "Use Privacy.com to block future auto-renewals",
        ],
      },
      {
        id: "s2",
        title: "Share streaming subscriptions with family",
        description: "Netflix, Spotify, Apple One — most have family plans that split cost between 4-6 people.",
        savings: "$20–$50/mo",
        effort: "Easy",
        category: "subscriptions",
        steps: [
          "List all your streaming services and their family plan prices",
          "Find 2-4 trusted people (family, close friends) to split with",
          "One person pays, others Venmo/Zelle their share monthly",
          "Set a reminder to collect payment each month",
        ],
      },
      {
        id: "s3",
        title: "Switch to annual billing for services you use daily",
        description: "Annual plans are typically 15-30% cheaper. If you use it every day, pay yearly.",
        savings: "$10–$40/mo",
        effort: "Easy",
        category: "subscriptions",
      },
      {
        id: "s4",
        title: "Rotate streaming services — don't stack them",
        description: "Watch everything on Netflix this month, then cancel and switch to Hulu. Never pay for two at once.",
        savings: "$15–$30/mo",
        effort: "Easy",
        category: "subscriptions",
        steps: [
          "Pick one streaming service per month",
          "Binge what you want",
          "Cancel before the next billing date",
          "Switch to the next one",
        ],
      },
    ],
  },
  {
    id: "bills",
    name: "Bills & Utilities",
    icon: "💡",
    color: "from-yellow-500 to-orange-500",
    tips: [
      {
        id: "b1",
        title: "Call and negotiate every bill annually",
        description: "Internet, insurance, phone — companies have retention departments with the power to cut your bill 10-30%.",
        savings: "$50–$150/mo",
        effort: "Medium",
        category: "bills",
        steps: [
          "Call your internet provider and say: 'I'm thinking of switching to [competitor]. What can you do for me?'",
          "Mention a specific competitor offer you've seen",
          "Ask to speak to the 'retention' or 'loyalty' department",
          "Same script works for phone, insurance, and cable",
          "If they say no, actually switch — the savings are usually worth it",
        ],
      },
      {
        id: "b2",
        title: "Lower your thermostat by 2 degrees",
        description: "Each degree lower saves about 3% on heating bills. 2 degrees = ~$20-40/month in winter.",
        savings: "$20–$40/mo",
        effort: "Easy",
        category: "bills",
        steps: [
          "Set heat to 68°F when home, 65°F when sleeping, 60°F when away",
          "Use blankets and slippers instead of turning up heat",
          "A programmable thermostat pays for itself in 2-3 months",
        ],
      },
      {
        id: "b3",
        title: "Unplug devices you're not using",
        description: "'Vampire power' — devices on standby — account for 10% of your electric bill.",
        savings: "$10–$20/mo",
        effort: "Easy",
        category: "bills",
      },
      {
        id: "b4",
        title: "Switch to a low-cost phone carrier",
        description: "Mint Mobile, Visible, and Cricket use the same towers as big carriers for $15-25/month.",
        savings: "$30–$80/mo",
        effort: "Medium",
        category: "bills",
        steps: [
          "Check coverage at mintmobile.com or visible.com",
          "Keep your existing number (it transfers for free)",
          "Buy a 3-month plan first to test before committing to a year",
        ],
      },
    ],
  },
  {
    id: "food",
    name: "Eating Out",
    icon: "🍕",
    color: "from-red-500 to-orange-600",
    tips: [
      {
        id: "f1",
        title: "Meal prep Sunday — cook once, eat 4x",
        description: "Spending 2 hours Sunday cooking saves you 5+ nights of takeout. $3/meal vs $15/meal.",
        savings: "$150–$300/mo",
        effort: "Medium",
        category: "food",
        steps: [
          "Pick 2 proteins (chicken thighs + ground beef work great)",
          "Cook a big batch of rice or pasta",
          "Roast a tray of vegetables",
          "Portion into 4-5 containers in the fridge",
          "Mix and match throughout the week",
        ],
      },
      {
        id: "f2",
        title: "Delete food delivery apps for 30 days",
        description: "DoorDash/Uber Eats markup is 20-30% + delivery fees + tips. Every order costs 40-60% more than the restaurant.",
        savings: "$100–$250/mo",
        effort: "Medium",
        category: "food",
      },
      {
        id: "f3",
        title: "Coffee at home — one switch, massive savings",
        description: "$5 coffee daily = $1,825/year. A good coffee maker + beans = $200/year.",
        savings: "$100–$150/mo",
        effort: "Easy",
        category: "food",
        steps: [
          "Buy a basic drip coffee maker or French press ($20-40)",
          "Buy whole beans and grind at home (better taste, same cost)",
          "Allow yourself one coffee shop visit per week as a treat",
        ],
      },
      {
        id: "f4",
        title: "Use restaurant apps and loyalty programs",
        description: "Chipotle, Starbucks, McDonald's, Chick-fil-A — all have apps with free items and points.",
        savings: "$20–$50/mo",
        effort: "Easy",
        category: "food",
      },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "🛍️",
    color: "from-blue-500 to-cyan-600",
    tips: [
      {
        id: "sh1",
        title: "The 48-hour rule for non-essential purchases",
        description: "Wait 48 hours before buying anything over $30 that wasn't planned. 70% of the time, you'll realize you don't need it.",
        savings: "$50–$200/mo",
        effort: "Easy",
        category: "shopping",
        steps: [
          "When you want to buy something non-essential, add it to a 'maybe' list instead",
          "Wait 48 hours",
          "If you still want it and can afford it, buy it — no guilt",
          "Most of the time, the urge passes",
        ],
      },
      {
        id: "sh2",
        title: "Buy secondhand first",
        description: "Facebook Marketplace, ThredUp, eBay, Poshmark. Most items are available used for 50-80% less.",
        savings: "$50–$300/mo",
        effort: "Easy",
        category: "shopping",
      },
      {
        id: "sh3",
        title: "Use browser extensions that auto-find coupons",
        description: "Honey and Capital One Shopping automatically apply coupon codes at checkout. Free, takes 10 seconds to install.",
        savings: "$20–$60/mo",
        effort: "Easy",
        category: "shopping",
        steps: [
          "Install Honey from the Chrome Web Store (free)",
          "Shop normally online",
          "Honey automatically tests coupon codes at checkout",
          "It also alerts you to price drops on items you view",
        ],
      },
    ],
  },
];

export type Mission = {
  id: string;
  week: number;
  title: string;
  description: string;
  estimatedSavings: string;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: string;
  tasks: { id: string; text: string }[];
  relatedTips: string[]; // tip IDs
};

export const WEEKLY_MISSIONS: Mission[] = [
  {
    id: "m1",
    week: 1,
    title: "The Subscription Purge",
    description: "Most people are paying for 3-4 subscriptions they forgot about. This week, hunt them down and cancel.",
    estimatedSavings: "$50–$200",
    difficulty: "Easy",
    icon: "🔍",
    tasks: [
      { id: "t1", text: "Open your bank statement and highlight every recurring charge" },
      { id: "t2", text: "List all subscriptions with their monthly cost" },
      { id: "t3", text: "Cancel any subscription you didn't use in the last 30 days" },
      { id: "t4", text: "Set a calendar reminder to review subscriptions every 3 months" },
    ],
    relatedTips: ["s1", "s2", "s4"],
  },
  {
    id: "m2",
    week: 2,
    title: "Grocery Glow-Up",
    description: "Cut your grocery bill without eating worse. Small changes, big savings.",
    estimatedSavings: "$80–$150",
    difficulty: "Easy",
    icon: "🛒",
    tasks: [
      { id: "t1", text: "Plan meals for the entire week before shopping" },
      { id: "t2", text: "Write a list and stick to it — no impulse items" },
      { id: "t3", text: "Download Ibotta or Fetch and earn cashback on your receipt" },
      { id: "t4", text: "Try one store brand item you'd normally buy name brand" },
    ],
    relatedTips: ["g1", "g2", "g5"],
  },
  {
    id: "m3",
    week: 3,
    title: "Call Your Way to Savings",
    description: "One 20-minute phone call can save you $50-150/month. Companies have retention deals they never advertise.",
    estimatedSavings: "$50–$150",
    difficulty: "Medium",
    icon: "📞",
    tasks: [
      { id: "t1", text: "Call your internet provider and ask for a better rate" },
      { id: "t2", text: "Call your phone carrier and ask what deals they have" },
      { id: "t3", text: "Get a competing quote for your car or home insurance" },
      { id: "t4", text: "Log your total savings from these calls" },
    ],
    relatedTips: ["b1", "b4"],
  },
  {
    id: "m4",
    week: 4,
    title: "The No-Spend Weekend",
    description: "Go one full weekend spending $0 on non-essentials. Free fun only. You'll be surprised what you discover.",
    estimatedSavings: "$50–$150",
    difficulty: "Medium",
    icon: "🧊",
    tasks: [
      { id: "t1", text: "Plan 3 free activities before the weekend (hiking, library, board games)" },
      { id: "t2", text: "Cook all meals at home — no restaurants or delivery" },
      { id: "t3", text: "Delete delivery apps from your phone for the weekend" },
      { id: "t4", text: "Track every dollar you would have spent but didn't" },
    ],
    relatedTips: ["f1", "f2", "f3"],
  },
  {
    id: "m5",
    week: 5,
    title: "Meal Prep Mastery",
    description: "Spend 2 hours Sunday and eat well all week for $3-4/meal instead of $12-20.",
    estimatedSavings: "$150–$300",
    difficulty: "Medium",
    icon: "🍳",
    tasks: [
      { id: "t1", text: "Pick 2 simple proteins to batch cook (chicken, ground beef, eggs)" },
      { id: "t2", text: "Cook a big pot of rice or pasta" },
      { id: "t3", text: "Roast a sheet pan of vegetables" },
      { id: "t4", text: "Portion into 5 containers — lunch sorted for the week" },
    ],
    relatedTips: ["f1", "f4", "g4"],
  },
  {
    id: "m6",
    week: 6,
    title: "Smart Shopping Rules",
    description: "Install a browser extension and practice the 48-hour rule. Stop spending money on things you don't need.",
    estimatedSavings: "$50–$200",
    difficulty: "Easy",
    icon: "🛍️",
    tasks: [
      { id: "t1", text: "Install the Honey extension on Chrome" },
      { id: "t2", text: "Write down 3 recent purchases you regretted" },
      { id: "t3", text: "Practice the 48-hour rule on one purchase this week" },
      { id: "t4", text: "Browse Facebook Marketplace for one thing you'd normally buy new" },
    ],
    relatedTips: ["sh1", "sh2", "sh3"],
  },
  {
    id: "m7",
    week: 7,
    title: "The Utility Bill Attack",
    description: "Lower your monthly bills without changing your lifestyle much. Small tweaks, permanent savings.",
    estimatedSavings: "$30–$80",
    difficulty: "Easy",
    icon: "💡",
    tasks: [
      { id: "t1", text: "Lower your thermostat by 2 degrees and see if you notice" },
      { id: "t2", text: "Unplug devices not in use (TV, game console, phone chargers)" },
      { id: "t3", text: "Switch to LED bulbs in your 3 most-used rooms" },
      { id: "t4", text: "Compare your electric bill to last month" },
    ],
    relatedTips: ["b2", "b3"],
  },
  {
    id: "m8",
    week: 8,
    title: "The Coffee & Convenience Audit",
    description: "Small daily habits add up to thousands per year. This week, track and cut the quiet leaks.",
    estimatedSavings: "$100–$200",
    difficulty: "Easy",
    icon: "☕",
    tasks: [
      { id: "t1", text: "Track every single purchase under $10 for 7 days" },
      { id: "t2", text: "Calculate your monthly coffee shop spend" },
      { id: "t3", text: "Brew coffee at home every day this week" },
      { id: "t4", text: "Identify your 3 biggest small-spend habits" },
    ],
    relatedTips: ["f3", "f4", "sh1"],
  },
];
