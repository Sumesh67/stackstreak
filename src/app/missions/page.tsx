"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { WEEKLY_MISSIONS, TIPS_CATEGORIES, type Mission } from "@/lib/tips-data";
import { Flame, CheckCircle, Circle, Trophy, ChevronRight, X, Zap } from "lucide-react";
import Link from "next/link";

export default function MissionsPage() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<Record<string, string[]>>({});
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("stackstreak_missions");
    if (saved) setCompletedTasks(JSON.parse(saved));
  }, []);

  const toggleTask = (missionId: string, taskId: string) => {
    setCompletedTasks(prev => {
      const tasks = prev[missionId] || [];
      const updated = tasks.includes(taskId)
        ? tasks.filter(id => id !== taskId)
        : [...tasks, taskId];
      const newState = { ...prev, [missionId]: updated };
      localStorage.setItem("stackstreak_missions", JSON.stringify(newState));
      return newState;
    });
  };

  const getMissionProgress = (mission: Mission) => {
    const tasks = completedTasks[mission.id] || [];
    return tasks.length;
  };

  const isMissionComplete = (mission: Mission) => {
    return getMissionProgress(mission) === mission.tasks.length;
  };

  const currentMission = WEEKLY_MISSIONS[currentWeek - 1];
  const totalSaved = WEEKLY_MISSIONS
    .filter(m => isMissionComplete(m))
    .length;

  const difficultyColor = {
    Easy: "text-green-400 bg-green-400/10 border-green-400/20",
    Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    Hard: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  const getRelatedTips = (mission: Mission) => {
    const allTips = TIPS_CATEGORIES.flatMap(c => c.tips);
    return mission.relatedTips.map(id => allTips.find(t => t.id === id)).filter(Boolean);
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
          <span className="text-orange-400 font-semibold">Missions</span>
          <Link href="/tips" className="text-gray-400 hover:text-white transition-colors">Tips</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black">🎯 Weekly Saving Missions</h1>
          <p className="text-gray-400 mt-2">Each week, one focused mission to cut your spending. Complete tasks, track your wins.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-orange-400">{totalSaved}</div>
            <div className="text-gray-500 text-xs mt-1">Missions done</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-green-400">{WEEKLY_MISSIONS.length}</div>
            <div className="text-gray-500 text-xs mt-1">Total missions</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-gray-500 text-xs">Keep going!</div>
          </div>
        </div>

        {/* Current mission spotlight */}
        <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/20 rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold mb-3">
            <Zap className="w-4 h-4" />
            THIS WEEK&apos;S MISSION
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-4xl mb-2">{currentMission.icon}</div>
              <h2 className="text-2xl font-black mb-1">{currentMission.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">{currentMission.description}</p>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${difficultyColor[currentMission.difficulty]}`}>
                  {currentMission.difficulty}
                </span>
                <span className="text-green-400 font-bold text-sm">Save {currentMission.estimatedSavings}</span>
              </div>
            </div>
            <button
              onClick={() => setExpandedMission(expandedMission === currentMission.id ? null : currentMission.id)}
              className="bg-orange-500 hover:bg-orange-400 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              {expandedMission === currentMission.id ? "Hide" : "Start →"}
            </button>
          </div>

          {/* Tasks */}
          {expandedMission === currentMission.id && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wide">Tasks</h3>
              <div className="space-y-3 mb-6">
                {currentMission.tasks.map((task) => {
                  const done = (completedTasks[currentMission.id] || []).includes(task.id);
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(currentMission.id, task.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors
                        ${done ? "bg-green-500/10 border border-green-500/20" : "bg-white/5 hover:bg-white/10 border border-transparent"}`}
                    >
                      {done ? (
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${done ? "text-gray-400 line-through" : "text-gray-200"}`}>{task.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{getMissionProgress(currentMission)}/{currentMission.tasks.length} tasks</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${(getMissionProgress(currentMission) / currentMission.tasks.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Related tips */}
              {getRelatedTips(currentMission).length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 text-sm text-gray-400 uppercase tracking-wide">Related Tips</h3>
                  <div className="space-y-2">
                    {getRelatedTips(currentMission).map((tip) => tip && (
                      <Link
                        href="/tips"
                        key={tip.id}
                        className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl px-4 py-3 transition-colors"
                      >
                        <span className="text-sm text-gray-300">{tip.title}</span>
                        <span className="text-xs text-green-400 font-semibold">{tip.savings}/mo</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Week selector */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-black text-lg">All Missions</h2>
          <div className="flex gap-1 ml-auto overflow-x-auto">
            {WEEKLY_MISSIONS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setCurrentWeek(i + 1)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-colors shrink-0
                  ${isMissionComplete(m)
                    ? "bg-green-500 text-white"
                    : currentWeek === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-white/10 text-gray-400 hover:bg-white/20"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* All missions list */}
        <div className="space-y-3">
          {WEEKLY_MISSIONS.map((mission, i) => {
            const progress = getMissionProgress(mission);
            const complete = isMissionComplete(mission);
            return (
              <button
                key={mission.id}
                onClick={() => setSelectedMission(mission)}
                className={`w-full bg-white/5 border rounded-2xl p-5 text-left transition-all hover:border-orange-500/30 group
                  ${complete ? "border-green-500/20" : "border-white/10"}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{mission.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">Week {i + 1}</span>
                      {complete && <span className="text-xs text-green-400 font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Done!</span>}
                    </div>
                    <h3 className="font-bold truncate">{mission.title}</h3>
                    {progress > 0 && !complete && (
                      <div className="text-xs text-orange-400 mt-1">{progress}/{mission.tasks.length} tasks done</div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-green-400 font-bold text-sm">{mission.estimatedSavings}</div>
                    <div className="text-gray-600 text-xs">est. savings</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mission detail modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
          <div className="bg-[#111118] border border-white/10 rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-3xl mb-2">{selectedMission.icon}</div>
                <h2 className="text-xl font-black">{selectedMission.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{selectedMission.description}</p>
              </div>
              <button onClick={() => setSelectedMission(null)} className="text-gray-500 hover:text-white ml-4">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6">
              <span className="text-green-400 font-bold">Estimated savings: {selectedMission.estimatedSavings} this week</span>
            </div>

            <h3 className="font-bold mb-3">Tasks</h3>
            <div className="space-y-2 mb-6">
              {selectedMission.tasks.map((task) => {
                const done = (completedTasks[selectedMission.id] || []).includes(task.id);
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(selectedMission.id, task.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors
                      ${done ? "bg-green-500/10 border border-green-500/20" : "bg-white/5 hover:bg-white/10 border border-transparent"}`}
                  >
                    {done ? <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />}
                    <span className={`text-sm ${done ? "text-gray-400 line-through" : "text-gray-200"}`}>{task.text}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-2">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all"
                  style={{ width: `${(getMissionProgress(selectedMission) / selectedMission.tasks.length) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">{getMissionProgress(selectedMission)}/{selectedMission.tasks.length} complete</div>
            </div>

            <button onClick={() => setSelectedMission(null)} className="w-full mt-4 py-3 rounded-xl text-gray-500 hover:text-white transition-colors text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
