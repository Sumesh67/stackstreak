"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { VIDEOS, VIDEO_CATEGORIES } from "@/lib/videos-data";
import { Flame, Play, Heart, Share2, Bookmark, ChevronUp, ChevronDown, ExternalLink, Video, Tag } from "lucide-react";
import Link from "next/link";

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === "all"
    ? VIDEOS
    : VIDEOS.filter(v => v.category === activeCategory);

  const activeVideo = filtered[activeIndex];

  const goNext = () => setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
  const goPrev = () => setActiveIndex(i => Math.max(i - 1, 0));

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // Touch/swipe
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStart.current = null;
  };

  const toggleLike = (id: string) => setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSave = (id: string) => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const categoryColor: Record<string, string> = {
    groceries: "bg-green-500/20 text-green-400",
    subscriptions: "bg-purple-500/20 text-purple-400",
    bills: "bg-yellow-500/20 text-yellow-400",
    food: "bg-red-500/20 text-red-400",
    shopping: "bg-blue-500/20 text-blue-400",
    mindset: "bg-pink-500/20 text-pink-400",
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-6xl mx-auto w-full">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Flame className="text-orange-400 w-6 h-6" />
          <span className="font-black text-lg">StackStreak</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/missions" className="text-gray-400 hover:text-white transition-colors">Missions</Link>
          <Link href="/tips" className="text-gray-400 hover:text-white transition-colors">Tips</Link>
          <span className="text-orange-400 font-semibold">Learn</span>
          <Link href="/scripts" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"><Video className="w-4 h-4" /> Scripts</Link>
          <Link href="/deals" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"><Tag className="w-4 h-4" /> Deals</Link>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left: category filter + video list (desktop) */}
        <div className="lg:w-72 shrink-0">
          <h2 className="font-black text-lg mb-4">📱 Money Tips in Shorts</h2>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            The fastest way to learn how to save — curated short videos on groceries, bills, habits and more.
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {VIDEO_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveIndex(0); }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors
                  ${activeCategory === cat.id
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Video list (desktop sidebar) */}
          <div className="hidden lg:flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2">
            {filtered.map((video, i) => (
              <button
                key={video.id}
                onClick={() => setActiveIndex(i)}
                className={`flex items-start gap-3 p-3 rounded-xl text-left transition-colors
                  ${activeIndex === i ? "bg-orange-500/10 border border-orange-500/30" : "bg-white/5 hover:bg-white/10 border border-transparent"}`}
              >
                {/* Thumbnail */}
                <div className="w-16 h-10 rounded-lg bg-white/10 overflow-hidden shrink-0 relative">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold line-clamp-2 leading-tight">{video.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{video.creator}</p>
                  <p className="text-xs text-green-400 font-semibold mt-0.5">Save {video.saves}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: main video player — TikTok style */}
        <div className="flex-1 flex flex-col items-center">
          {activeVideo && (
            <div
              className="relative w-full max-w-sm"
              ref={containerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Video card */}
              <div className="bg-[#111118] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* YouTube embed */}
                <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                  {playing === activeVideo.id ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black">
                      <img
                        src={`https://img.youtube.com/vi/${activeVideo.youtubeId}/maxresdefault.jpg`}
                        alt={activeVideo.title}
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${activeVideo.youtubeId}/hqdefault.jpg`;
                        }}
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <button
                          onClick={() => setPlaying(activeVideo.id)}
                          className="w-16 h-16 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
                        >
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </button>
                        <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">
                          Tap to watch
                        </span>
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${categoryColor[activeVideo.category] || "bg-gray-500/20 text-gray-400"}`}>
                          {activeVideo.category}
                        </span>
                      </div>
                      {/* Duration */}
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {activeVideo.duration}
                      </div>
                    </div>
                  )}
                </div>

                {/* Video info */}
                <div className="p-4">
                  <h3 className="font-black text-base leading-tight mb-1">{activeVideo.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{activeVideo.creator}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {activeVideo.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-green-400 font-bold text-sm">Save {activeVideo.saves}</span>
                  </div>
                </div>
              </div>

              {/* Side actions */}
              <div className="absolute right-[-56px] top-1/3 flex flex-col gap-4 hidden sm:flex">
                <button
                  onClick={() => toggleLike(activeVideo.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors
                    ${liked.includes(activeVideo.id) ? "bg-red-500" : "bg-white/10 hover:bg-white/20"}`}>
                    <Heart className={`w-5 h-5 ${liked.includes(activeVideo.id) ? "fill-white text-white" : "text-white"}`} />
                  </div>
                  <span className="text-xs text-gray-400">{liked.includes(activeVideo.id) ? "Liked" : "Like"}</span>
                </button>

                <button
                  onClick={() => toggleSave(activeVideo.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors
                    ${saved.includes(activeVideo.id) ? "bg-orange-500" : "bg-white/10 hover:bg-white/20"}`}>
                    <Bookmark className={`w-5 h-5 ${saved.includes(activeVideo.id) ? "fill-white text-white" : "text-white"}`} />
                  </div>
                  <span className="text-xs text-gray-400">{saved.includes(activeVideo.id) ? "Saved" : "Save"}</span>
                </button>

                <a
                  href={`https://youtube.com/watch?v=${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">YouTube</span>
                </a>
              </div>

              {/* Up/Down navigation */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <span className="text-gray-500 text-sm flex items-center">
                  {activeIndex + 1} / {filtered.length}
                </span>
                <button
                  onClick={goNext}
                  disabled={activeIndex === filtered.length - 1}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Swipe hint on mobile */}
              <p className="text-center text-gray-600 text-xs mt-2 lg:hidden">Swipe up/down to browse</p>
            </div>
          )}

          {/* Mobile video list */}
          <div className="lg:hidden mt-6 w-full max-w-sm">
            <h3 className="font-bold mb-3 text-sm text-gray-400">More videos</h3>
            <div className="space-y-2">
              {filtered.map((video, i) => i !== activeIndex && (
                <button
                  key={video.id}
                  onClick={() => { setActiveIndex(i); setPlaying(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 rounded-xl p-3 text-left transition-colors"
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-14 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold line-clamp-1">{video.title}</p>
                    <p className="text-xs text-green-400 mt-0.5">Save {video.saves}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
