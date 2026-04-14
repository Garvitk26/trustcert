import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-base text-amber-500 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
          <Loader2 className="h-14 w-14 animate-spin-ring relative z-10" />
        </div>
        
        <div className="space-y-2 text-center relative z-10">
          <p className="font-black text-xs tracking-[0.4em] uppercase text-amber-400 italic">Synchronizing Registry</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-1 w-1 bg-amber-500/40 rounded-full animate-bounce" style={{ animationDelay: i * 0.2 + 's' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
