"use client";

import React, { useState, useRef, useEffect } from "react";
import { useInstitution, Institution } from "@/lib/context/InstitutionContext";
import { ChevronDown, Plus, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/context/ToastContext";

export default function InstitutionSwitcher() {
  const { institutions, activeInstitution, setActiveInstitution, refreshInstitutions } = useInstitution();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowCreate(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        body: JSON.stringify({ name: newName }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      await refreshInstitutions();
      setActiveInstitution(data);
      setNewName("");
      setShowCreate(false);
      setIsOpen(false);
      showToast("Institution created successfully!", "success");
    } catch (err) {
      showToast("Failed to create institution", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSwitch = (inst: Institution) => {
    setActiveInstitution(inst);
    setIsOpen(false);
  };

  // Avatar Initials
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="relative w-full" ref={switcherRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
      >
        <div 
          className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-lg"
          style={{ backgroundColor: activeInstitution?.accentColor || "#f59e0b" }}
        >
          {activeInstitution ? getInitials(activeInstitution.name) : <Loader2 className="animate-spin" />}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-white truncate">{activeInstitution?.name || "Loading..."}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Organization</p>
        </div>
        <ChevronDown 
          size={16} 
          className={cn("text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-3 z-50 bg-[#0f2a1e] border border-white/5 rounded-2xl shadow-2xl p-2 overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto space-y-1 mb-2">
              {institutions.map((inst) => (
                <button
                  key={inst._id}
                  onClick={() => handleSwitch(inst)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-all text-left relative group"
                >
                  <div 
                    className="h-8 w-8 shrink-0 rounded-md flex items-center justify-center font-bold text-xs text-white"
                    style={{ backgroundColor: inst.accentColor }}
                  >
                    {getInitials(inst.name)}
                  </div>
                  <span className={cn("text-sm transition-colors", activeInstitution?._id === inst._id ? "text-white font-bold" : "text-muted-foreground group-hover:text-white")}>
                    {inst.name}
                  </span>
                  {activeInstitution?._id === inst._id && (
                    <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-amber-500/10 text-amber-400 text-sm font-bold transition-all"
              >
                <Plus size={16} /> Create Institution
              </button>
            </div>

            {/* Create Panel Overlay */}
            <AnimatePresence>
              {showCreate && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="absolute inset-0 bg-[#0f2a1e] p-4 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-sm">New Organization</h3>
                    <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-white p-1">
                      <X size={16} />
                    </button>
                  </div>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Name</label>
                      <Input 
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-black/20 border-white/5 focus:border-amber-500/50 h-10"
                        placeholder="Harvard University"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isCreating}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-10 rounded-xl"
                    >
                      {isCreating ? <Loader2 className="animate-spin" size={16} /> : "Create & Launch"}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
