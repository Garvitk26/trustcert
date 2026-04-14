"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  MoreVertical, 
  Trash2, 
  Clock, 
  CheckCircle2,
  Loader2,
  Plus,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { useInstitution } from "@/lib/context/InstitutionContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TeamSettingsPage() {
  const { activeInstitution } = useInstitution();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");

  const fetchData = async () => {
    if (!activeInstitution) return;
    try {
      const res = await fetch(`/api/institutions/${activeInstitution._id}/members`);
      if (!res.ok) throw new Error("Synchronization failure.");
      const data = await res.json();
      setMembers(data.members);
      setPendingInvites(data.pendingInvites);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeInstitution]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInstitution) return;
    setInviting(true);
    try {
      const res = await fetch(`/api/institutions/${activeInstitution._id}/invite`, {
        method: "POST",
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });
      if (!res.ok) throw new Error("Invite resolution effectively nullified.");
      showToast("Invitation effectively dispatched.", "success");
      setInviteEmail("");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center h-[500px] gap-4">
          <Loader2 className="animate-spin text-amber-500" size={32} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/50 animate-pulse">Syncing Governance Layer...</p>
       </div>
     );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="space-y-3">
            <div className="flex items-center gap-2">
               <div className="h-2 w-12 bg-amber-500 rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Institutional Governance</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Team Management</h1>
            <p className="text-xs text-muted-foreground italic uppercase tracking-widest leading-relaxed italic">
               Confined effectively to established identity registries and secure administrative access nodes.
            </p>
         </div>
         
         <div className="flex items-center gap-4 bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl backdrop-blur-md">
            <div className="text-right">
               <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Active Members</p>
               <p className="text-2xl font-black text-white italic leading-none">{members.length}</p>
            </div>
            <div className="h-10 w-[1px] bg-amber-500/10" />
            <div className="text-right">
               <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Pending</p>
               <p className="text-2xl font-black text-white italic leading-none">{pendingInvites.length}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         
         {/* MEMBER LIST */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="card-surface border-amber-500/10 rounded-[2.5rem] overflow-hidden bg-amber-500/[0.01]">
               <CardHeader className="p-8 border-b border-amber-500/5">
                  <div className="flex items-center justify-between">
                     <CardTitle className="text-xl font-black text-white uppercase italic tracking-widest">Verified Personnel</CardTitle>
                     <Users size={20} className="text-amber-500/40" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead>
                           <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                              <th className="px-8 py-6 text-left">Identity</th>
                              <th className="px-8 py-6 text-left">Permissions</th>
                              <th className="px-8 py-6 text-left">Settled At</th>
                              <th className="px-8 py-6"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {members.map((member) => (
                              <motion.tr 
                                key={member.userId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group hover:bg-white/[0.02] transition-all"
                              >
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-black text-xs">
                                          {member.name.charAt(0)}
                                       </div>
                                       <div>
                                          <p className="text-sm font-bold text-white uppercase tracking-tight">{member.name}</p>
                                          <p className="text-[10px] text-muted-foreground/60 italic lowercase">{member.email}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className={cn(
                                       "inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
                                       member.role === "owner" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                       member.role === "admin" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                       "bg-slate-500/10 border-slate-500/20 text-slate-400"
                                    )}>
                                       {member.role === "owner" && <Shield size={10} />}
                                       {member.role}
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <p className="text-[10px] font-mono text-slate-500 uppercase">{new Date(member.addedAt).toLocaleDateString()}</p>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                                       <MoreVertical size={16} />
                                    </button>
                                 </td>
                              </motion.tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </CardContent>
            </Card>

            {/* PENDING INVITES */}
            {pendingInvites.length > 0 && (
              <div className="space-y-6">
                 <h3 className="text-sm font-black text-white italic tracking-widest uppercase">Pending Authorization Nodes</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingInvites.map((invite, i) => (
                       <div key={i} className="card-surface border-amber-500/5 p-6 rounded-2xl flex items-center justify-between bg-white/[0.01]">
                          <div className="flex items-center gap-4">
                             <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500"><Mail size={14} /></div>
                             <div>
                                <p className="text-xs font-bold text-white lowercase tracking-tight">{invite.email}</p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest">{invite.role} • Expires {new Date(invite.expiresAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <Clock size={14} className="text-amber-500/20 animate-pulse" />
                       </div>
                    ))}
                 </div>
              </div>
            )}
         </div>

         {/* INVITE FORM */}
         <div className="space-y-8">
            <Card className="card-surface border-amber-500/10 p-8 rounded-[2.5rem] bg-amber-500/[0.02] space-y-8 sticky top-32">
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Expand Access</h3>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold italic">Assign additional identity verification nodes.</p>
               </div>
               
               <form onSubmit={handleInvite} className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] leading-none mb-2 block">Recipient Mail Identity</label>
                     <input 
                        type="email" 
                        required
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@institution.edu"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:border-amber-500/40 transition-all outline-none italic"
                     />
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] leading-none mb-2 block">Permissions Level</label>
                     <div className="grid grid-cols-2 gap-3">
                        {["admin", "viewer"].map(role => (
                           <button
                             key={role}
                             type="button"
                             onClick={() => setInviteRole(role)}
                             className={cn(
                                "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                inviteRole === role ? "bg-amber-500/10 border-amber-500/40 text-amber-400" : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                             )}
                           >
                              {role}
                           </button>
                        ))}
                     </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={inviting || !inviteEmail}
                    className="w-full h-14 btn-primary rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.2)]"
                  >
                     {inviting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={18} className="mr-3" />}
                     Issue Invitation
                  </Button>
               </form>

               <div className="pt-6 border-t border-white/5 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest italic leading-relaxed italic">
                     Invites effectively expire in 72 hours. <br /> Consensus required for enrollment.
                  </p>
               </div>
            </Card>
         </div>

      </div>
    </div>
  );
}
