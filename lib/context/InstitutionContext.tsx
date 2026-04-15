"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

export interface Institution {
  _id: string;
  name: string;
  slug: string;
  accentColor: string;
  walletAddress?: string;
  ownerId: string;
  certPrefix?: string;
  verifiedDomain?: string;
  metadata?: Record<string, any>;
  members: Array<{ userId: string; role: "owner" | "admin" | "viewer" }>;
  [key: string]: any; // Allow additional fields from MongoDB
}

interface InstitutionContextType {
  institutions: Institution[];
  activeInstitution: Institution | null;
  setActiveInstitution: (inst: Institution) => void;
  loading: boolean;
  refreshInstitutions: () => Promise<void>;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export function InstitutionProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [activeInstitution, setActiveInstitutionElement] = useState<Institution | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tc_active_inst");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const refreshInstitutions = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/institutions");
      const data = await res.json();
      setInstitutions(data);

      // Validate sync
      if (activeInstitution) {
        const freshData = data.find((i: Institution) => i._id === activeInstitution._id);
        if (freshData) {
          // Update active institution with fresh data from server
          setActiveInstitution(freshData);
        } else if (data.length > 0) {
          setActiveInstitution(data[0]);
        }
      } else if (data.length > 0) {
        setActiveInstitution(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch institutions", err);
    } finally {
      setLoading(false);
    }
  };

  const setActiveInstitution = (inst: Institution) => {
    setActiveInstitutionElement(inst);
    localStorage.setItem("tc_active_inst", JSON.stringify(inst));
  };

  useEffect(() => {
    if (session) refreshInstitutions();
  }, [session]);

  return (
    <InstitutionContext.Provider value={{ institutions, activeInstitution, setActiveInstitution, loading, refreshInstitutions }}>
      {children}
    </InstitutionContext.Provider>
  );
}

export function useInstitution() {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error("useInstitution must be used within an InstitutionProvider");
  }
  return context;
}
