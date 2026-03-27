"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { TIPS_CATEGORIES, type Tip } from "@/lib/tips-data";
import { ChevronRight, X, CheckCircle, Flame, Video, Tag } from "lucide-react";
import Link from "next/link";

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState(TIPS_CATEGORIES[0].id);
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [saved, setSaved] = useState<string[]>([]);

  const category = TIPS_CATEGORIES.find((c) => c.id === activeCategory)!;

  const effortColor = {
    Easy: "text-green-400 bg-green-400/10",
    Medium: "text-yellow-400 bg-yellow-400/10",
    Hard: "text-red-400 bg-red-400/10",
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-6xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Flame className="text-orange-400 w-6 h-6" />
          <span className="font-black text-lg">StackStreak</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/missions" className="text-gray-400 hover:text-white transition-colors">Missions</Link>
          <span className="text-orange-400 font-semibold">Tips</span>
          <Link href="/scripts" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"><Video className="w-4 h-4" /> Scripts</Link>
          <Link href="/deals" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"><Tag className="w-4 h-4" /> Deals</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black">💡 Money-Saving Tips</h1>
          <p className="text-gray-400 mt-2">Real, actionable ways to spend less — organized by category.</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {TIPS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors
                ${activeCategory === cat.id
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Tips grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {category.tips.map((tip) => (
            <button
              key={tip.id}
              onClick={() => setSelectedTip(tip)}
              className="bg-white/5 border border-white/10 hover:border-orange-500/40 rounded-2xl p-5 text-left transition-all hover:bg-white/8 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${effortColor[tip.effort]}`}>
                      {tip.effort}
                    </span>
                    {saved.includes(tip.id) && (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Saved
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold mb-1">{tip.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{tip.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors shrink-0 mt-1" />
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-500">Estimated savings</span>
                <span className="text-sm font-bold text-green-400">{tip.savings}/mo</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tip Detail Modal */}
      {selectedTip && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
          <div className="bg-[#111118] border border-white/10 rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${effortColor[selectedTip.effort]} mb-3 inline-block`}>
                  {selectedTip.effort}
                </span>
                <h2 className="text-xl font-black">{selectedTip.title}</h2>
              </div>
              <button onClick={() => setSelectedTip(null)} className="text-gray-500 hover:text-white transition-colors ml-4">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4">{selectedTip.description}</p>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6">
              <span className="text-green-400 font-bold">Estimated savings: {selectedTip.savings}/month</span>
            </div>

            {selectedTip.steps && selectedTip.steps.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-3">How to do it:</h3>
                <div className="space-y-3">
                  {selectedTip.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSaved(prev => prev.includes(selectedTip.id) ? prev.filter(id => id !== selectedTip.id) : [...prev, selectedTip.id]);
                }}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2
                  ${saved.includes(selectedTip.id)
                    ? "bg-green-500/20 text-green-400 border border-green-500/20"
                    : "bg-orange-500 hover:bg-orange-400 text-white"
                  }`}
              >
                {saved.includes(selectedTip.id) ? <><CheckCircle className="w-4 h-4" /> Saved!</> : "✓ I'll try this"}
              </button>
              <button
                onClick={() => setSelectedTip(null)}
                className="px-4 py-3 rounded-xl text-gray-500 hover:text-white transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
