import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, Globe, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-base p-6 text-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] -z-10" />

      <div className="card-surface border-rose-500/20 p-12 md:p-16 rounded-[3rem] bg-bg-surface/50 backdrop-blur-2xl max-w-xl space-y-8 shadow-2xl relative">
        <div className="relative mx-auto w-24 h-24 mb-10">
          <div className="absolute inset-0 bg-rose-500/10 rounded-3xl animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center text-rose-500">
            <AlertTriangle size={48} className="animate-bounce" />
          </div>
        </div>

        <div className="space-y-4 text-center">
           <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">404 - LOST IN SPACE</h1>
           <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em] italic">Coordinate effectively missing from registry</p>
        </div>

        <p className="text-sm text-muted-foreground/80 leading-relaxed italic max-w-sm mx-auto">
          The registry coordinate you are attempting to settle in does not exist or has been effectively nullified on the established network.
        </p>

        <div className="pt-6">
           <Button asChild className="h-14 px-10 btn-primary rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.2)]">
              <Link href="/" className="flex items-center gap-3">
                 <Home size={18} />
                 Safe Return to Home
              </Link>
           </Button>
        </div>

        <div className="pt-8 flex flex-col items-center gap-2">
           <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest">Network Status</span>
           <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Operational Hub</span>
           </div>
        </div>
      </div>
    </div>
  );
}
