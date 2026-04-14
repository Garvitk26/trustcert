"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
}

export function Skeleton({ className, width, height, rounded = "rounded-md" }: SkeletonProps) {
  return (
    <div
      className={cn("animate-shimmer", rounded, className)}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-[60%]" : "w-full", className)} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 border border-white/5 rounded-[2rem] bg-white/[0.02] space-y-4", className)}>
      <Skeleton className="h-48 w-full rounded-2xl bg-white/5" />
      <SkeletonText lines={2} className="bg-white/5" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 bg-white/5" />
          <Skeleton className="h-4 w-64 bg-white/5" />
        </div>
        <Skeleton className="h-12 w-40 rounded-xl bg-white/5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[2rem] bg-amber-500/5 border border-amber-500/10" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64 rounded-[2.5rem] bg-white/[0.02] border border-white/5" />
        <Skeleton className="h-64 rounded-[2.5rem] bg-white/[0.02] border border-white/5" />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton 
      className={cn(className)} 
      width={size} 
      height={size} 
      rounded="rounded-full" 
    />
  );
}
