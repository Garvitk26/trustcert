"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Zap } from "lucide-react";

export default function BlockchainVisual() {
  const nodes = [0, 1, 2, 3, 4, 5];

  return (
    <div className="relative w-full py-12 flex items-center justify-center overflow-hidden">
      {/* Central Line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      
      <div className="relative flex justify-between w-full max-w-4xl px-4">
        {nodes.map((i) => (
          <div key={i} className="relative group">
            {/* Pulsing Light Effect */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute -inset-4 bg-amber-500 rounded-full blur-xl"
            />
            
            {/* Node */}
            <div className="relative h-4 w-4 rounded-sm rotate-45 bg-bg-surface border border-amber-500/50 flex items-center justify-center group-hover:border-orange-400 group-hover:bg-amber-500/10 transition-all duration-500">
               <div className="h-1 w-1 bg-amber-400 rounded-full" />
            </div>

            {/* Light Pulse "Confirmation" */}
            <motion.div
              animate={{
                opacity: [0, 1, 0],
                y: [0, -20],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5 + 0.2,
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span className="text-[8px] font-black uppercase text-amber-400 tracking-tighter shadow-lg">Confirming...</span>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-x-0 top-1/4 h-20 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#f59e0b_1px,_transparent_0)] bg-[length:40px_40px]" />
      </div>
    </div>
  );
}
