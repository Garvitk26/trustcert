"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export default function TypewriterHeadline({ 
  phrases, 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  pauseTime = 2000 
}: TypewriterProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullPhrase = phrases[currentPhraseIndex];
      
      if (!isDeleting) {
        // Typing
        setCurrentText(fullPhrase.substring(0, currentText.length + 1));
        
        if (currentText === fullPhrase) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        setCurrentText(fullPhrase.substring(0, currentText.length - 1));
        
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(handleTyping, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="relative inline-block min-h-[1.2em]">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400">
        {currentText}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="absolute -right-1 bottom-1 w-[3px] h-[80%] bg-amber-500 typewriter-cursor"
      />
    </span>
  );
}
