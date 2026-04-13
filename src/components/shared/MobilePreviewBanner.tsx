"use client";

import React from "react";

// Remove this component after taking screenshots
// Only for submission screenshot documentation
export function MobilePreviewBanner() {
  return (
    <div className="fixed bottom-4 left-4 z-50 
                    bg-white/10 backdrop-blur-md border border-white/20 
                    rounded-lg px-3 py-2 text-xs
                    text-white md:hidden shadow-xl
                    animate-bounce">
      📱 Mobile View — 375px
    </div>
  );
}
