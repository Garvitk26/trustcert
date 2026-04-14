"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020d0a] p-4 text-center text-amber-500">
      <div className="mb-8 rounded-full bg-rose-500/10 p-4 text-rose-500">
        <AlertTriangle size={48} />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white uppercase tracking-tighter">Something went wrong</h1>
      <p className="mb-8 max-w-md text-muted-foreground leading-relaxed">
        An error occurred during communication with the network protocol.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => reset()} className="gap-2 bg-amber-600 hover:bg-amber-500">
          <RefreshCcw size={16} />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2 border-amber-500/20 text-amber-400">
            <Home size={16} />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
