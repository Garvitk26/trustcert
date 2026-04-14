"use client";

import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_FEEDS = [
  { institution: "Stanford University", student: "Parth K.", course: "B.Sc. Computer Science", time: new Date(Date.now() - 1000 * 60 * 2) },
  { institution: "MIT", student: "Sarah J.", course: "Full Stack Development", time: new Date(Date.now() - 1000 * 60 * 5) },
  { institution: "Google", student: "Alex M.", course: "Professional Cloud Architect", time: new Date(Date.now() - 1000 * 60 * 12) },
  { institution: "Hardvard", student: "Emily R.", course: "Data Science Specialization", time: new Date(Date.now() - 1000 * 60 * 25) },
  { institution: "Berkeley", student: "Liam W.", course: "Cybersecurity Fundamentals", time: new Date(Date.now() - 1000 * 60 * 45) },
];

export default function LiveVerificationFeed() {
  const [feeds, setFeeds] = useState(MOCK_FEEDS);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new feeds
      const newFeed = {
        institution: ["Oxford", "NUS", "IIT Bombay", "Caltech"][Math.floor(Math.random() * 4)],
        student: ["James L.", "Wei C.", "Priya S.", "Emma D."][Math.floor(Math.random() * 4)],
        course: ["Blockchain Mastery", "AI Ethics", "Quantum Computing", "MBA"][Math.floor(Math.random() * 4)],
        time: new Date()
      };
      setFeeds(prev => [newFeed, ...prev.slice(0, 4)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-surface border-amber-500/10 rounded-3xl p-6 overflow-hidden relative">
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Live Verification Feed</h3>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {feeds.map((feed, i) => (
            <motion.div
              key={`${feed.student}-${feed.time.getTime()}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="mt-1 p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                <ShieldCheck size={16} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-slate-300 leading-tight">
                  <span className="text-white font-bold">{feed.institution}</span> verified <span className="text-amber-400">{feed.student}</span>'s {feed.course}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    {formatDistanceToNow(feed.time, { addSuffix: true })}
                  </span>
                  <div className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[8px] font-black uppercase text-orange-400">
                    On-Chain
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fade effect at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-surface to-transparent pointer-events-none" />
    </div>
  );
}
