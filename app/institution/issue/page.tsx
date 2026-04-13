"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Table,
  BadgeCheck,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import Papa from "papaparse";
import { signTransaction } from "@stellar/freighter-api";
import { useInstitution } from "@/lib/context/InstitutionContext";
import { useToast } from "@/lib/context/ToastContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CertificatePreview from "@/components/shared/CertificatePreview";
import IssuanceProgress from "@/components/shared/IssuanceProgress";
import TransactionSuccessCard from "@/components/shared/TransactionSuccessCard";
import { getAccountBalance } from "@/lib/stellar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Step = 1 | 2 | 3;
type InputMode = "single" | "bulk";
type Template = "Academic" | "Corporate" | "Digital";

interface CertData {
  recipient_name: string;
  recipient_email: string;
  course_name: string;
  issue_date: string;
  student_wallet?: string;
  isValid?: boolean;
}

export default function IssuanceWizard() {
  const { activeInstitution } = useInstitution();
  const { showToast } = useToast();
  
  // Wizard State
  const [step, setStep] = useState<Step>(1);
  const [template, setTemplate] = useState<Template>("Academic");
  const [inputMode, setInputMode] = useState<InputMode>("bulk");
  const [data, setData] = useState<CertData[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

  // Submission State
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuanceStage, setIssuanceStage] = useState(1);
  const [issuanceError, setIssuanceError] = useState<string | null>(null);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [lastTxHash, setLastTxHash] = useState("");
  const [updatedBalance, setUpdatedBalance] = useState("0");

  // Bulk Upload
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((row: any) => ({
          recipient_name: row.recipient_name || "",
          recipient_email: row.recipient_email || "",
          course_name: row.course_name || "",
          issue_date: row.issue_date || new Date().toISOString().split("T")[0],
          student_wallet: row.student_wallet || "",
          isValid: !!(row.recipient_name && row.recipient_email && row.course_name)
        }));
        setData(parsedData);
        setSelectedRowIndex(0);
        showToast(`Successfully parsed ${parsedData.length} records.`, "success");
      },
      error: (err) => {
        showToast(`CSV Parsing Error: ${err.message}`, "error");
      }
    });
  };

  const addSingleRow = () => {
    setData([...data, { recipient_name: "", recipient_email: "", course_name: "", issue_date: new Date().toISOString().split("T")[0], isValid: false }]);
  };

  const updateRow = (index: number, updates: Partial<CertData>) => {
    const newData = [...data];
    newData[index] = { ...newData[index], ...updates };
    newData[index].isValid = !!(newData[index].recipient_name && newData[index].recipient_email && newData[index].course_name);
    setData(newData);
  };

  const removeRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    if (selectedRowIndex >= newData.length) setSelectedRowIndex(Math.max(0, newData.length - 1));
  };

  const validateAll = () => data.length > 0 && data.every(row => row.isValid);

  const handleIssuance = async () => {
    if (!activeInstitution?.walletAddress) {
      showToast("Institution wallet not linked. Please configure in settings.", "error");
      return;
    }

    setIsIssuing(true);
    setIssuanceStage(1);
    setIssuanceError(null);

    try {
      // 1. Backend Prep - Save records as 'pending'
      const prepRes = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificates: data,
          templateId: template,
          institutionId: activeInstitution._id
        })
      });

      if (!prepRes.ok) throw new Error("Failed to prepare certificates on backend.");
      const { certificates: issuedCerts } = await prepRes.json();

      // 2. Build Stellar Transaction (for lead certificate in batch or single)
      setIssuanceStage(2);
      const stellarRes = await fetch("/api/certificates/confirm", { // Internal helper to build XDR
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           issuer: activeInstitution.walletAddress,
           certId: issuedCerts[0].certId,
           certHash: issuedCerts[0].hash,
           studentWallet: data[0].student_wallet
        })
      });

      if (!stellarRes.ok) throw new Error("Failed to generate Stellar transaction.");
      const { xdr } = await stellarRes.json();

      // 3. User Signature via Freighter
      setIssuanceStage(3);
      const signedTx = await signTransaction(xdr, { networkPassphrase: "Test SDF Network ; September 2015" });
      
      // 4. Submit to Ledger & Finalize
      setIssuanceStage(4);
      const finalRes = await fetch("/api/certificates/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          signedXdr: signedTx.signedTxXdr, 
          certIds: issuedCerts.map((c: any) => c.id) 
        })
      });

      if (!finalRes.ok) throw new Error("Ledger settlement failed.");
      const { txHash: confirmedHash } = await finalRes.json();
      
      // Fetch fresh balance after tx
      if (activeInstitution?.walletAddress) {
        const bal = await getAccountBalance(activeInstitution.walletAddress);
        setUpdatedBalance(bal);
      }

      setLastTxHash(confirmedHash);
      setIssuanceStage(5); // Success!
      setShowSuccessCard(true);
      showToast("Certificates issued effectively on-chain.", "success");
      
    } catch (err: any) {
      console.error("Issuance Error:", err);
      setIssuanceError(err.message || "An unexpected error occurred during issuance.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-base relative">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <AnimatePresence>
          {isIssuing && !showSuccessCard && (
            <IssuanceProgress 
              currentStage={issuanceStage} 
              error={issuanceError} 
              onClose={() => setIsIssuing(false)} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuccessCard && (
            <TransactionSuccessCard 
              title="Certificates Issued!"
              subtitle={`${data.length} credential${data.length > 1 ? 's' : ''} effectively anchored to Stellar`}
              txHash={lastTxHash}
              amount={(data.length * 0.00001).toString()}
              walletAddress={activeInstitution?.walletAddress}
              walletBalance={updatedBalance}
              extraDetails={[
                { label: "Institution", value: activeInstitution?.name || "" },
                { label: "Template", value: template },
                { label: "Records", value: data.length.toString() }
              ]}
              onClose={() => {
                setShowSuccessCard(false);
                setIsIssuing(false);
                setStep(1);
                setData([]);
              }}
            />
          )}
        </AnimatePresence>

        {/* Wizard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="h-2 w-10 bg-indigo-500 rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Credential Pipeline</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Issuance Wizard</h1>
          </div>
          
          {/* Stepper Visual */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-2 rounded-2xl">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500",
                  step === s ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]" : 
                  step > s ? "bg-indigo-500/10 text-indigo-400" : "bg-white/5 text-muted-foreground"
                )}
              >
                {step > s ? <CheckCircle2 size={18} /> : <span className="font-bold">{s}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* --- STEP 1: SELECT TEMPLATE --- */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "Academic", icon: ShieldCheck, desc: "Classic institutional design for degrees & diplomas." },
                { id: "Corporate", icon: Zap, desc: "Modern professional design for workforce training." },
                { id: "Digital", icon: Globe, desc: "Web3 aesthetic for digital-native skills & events." }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id as Template)}
                  className={cn(
                    "card-surface border-indigo-500/10 p-8 rounded-3xl text-left transition-all duration-500 group relative overflow-hidden",
                    template === t.id && "border-indigo-500/40 bg-indigo-500/5 ring-1 ring-indigo-500/20 shadow-2xl"
                  )}
                >
                  {template === t.id && (
                    <div className="absolute top-4 right-4 h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                       <CheckCircle2 size={14} />
                    </div>
                  )}
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                    template === t.id ? "bg-indigo-500/10 text-indigo-400" : "bg-white/5 text-muted-foreground"
                  )}>
                    <t.icon size={32} />
                  </div>
                  <h3 className={cn("text-xl font-bold mb-2", template === t.id ? "text-white" : "text-muted-foreground")}>{t.id} Template</h3>
                  <p className="text-sm text-muted-foreground/60 leading-relaxed italic">{t.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-12">
               <StepButton onClick={() => setStep(2)} disabled={false} icon={<ArrowRight size={18} />}>Proceed to Data Input</StepButton>
            </div>
          </motion.div>
        )}

        {/* --- STEP 2: DATA INPUT --- */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                   <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl w-fit relative z-30">
                      <button 
                        onClick={() => setInputMode("bulk")} 
                        className={cn("px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", inputMode === "bulk" ? "bg-indigo-500 text-white shadow-lg" : "text-muted-foreground hover:text-white")}
                      >
                        Bulk CSV
                      </button>
                      <button 
                         onClick={() => {
                            setInputMode("single");
                            if (data.length === 0) {
                               addSingleRow();
                            }
                         }} 
                         className={cn("px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", inputMode === "single" ? "bg-indigo-500 text-white shadow-lg" : "text-muted-foreground hover:text-white")}
                      >
                         Single Entry
                      </button>
                   </div>

                   {inputMode === "bulk" ? (
                     <div className="space-y-6">
                        <div className="p-12 border-2 border-dashed border-indigo-500/10 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 bg-indigo-500/[0.02] group transition-colors hover:border-indigo-500/20">
                            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                               <Upload size={32} />
                            </div>
                            <div className="space-y-1">
                               <p className="text-sm font-bold text-white">Upload Certificate Dataset</p>
                               <p className="text-xs text-muted-foreground italic">Drag and drop your .csv file here or browse</p>
                            </div>
                            <input 
                              type="file" 
                              accept=".csv" 
                              onChange={handleCSVUpload} 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                            />
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                           <FileText size={20} className="text-violet-400" />
                           <div className="text-xs">
                              <p className="font-bold text-white">Requirement:</p>
                              <p className="text-muted-foreground italic">CSV must include: recipient_name, recipient_email, course_name</p>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-6">
                        <div className="card-surface p-8 border-indigo-500/10 rounded-3xl space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <InputGroup label="Recipient Full Name" placeholder="e.g. John Doe" value={data[0]?.recipient_name || ""} onChange={(v: string) => updateRow(0, { recipient_name: v })} />
                              <InputGroup label="Recipient Email" placeholder="e.g. john@example.com" value={data[0]?.recipient_email || ""} onChange={(v: string) => updateRow(0, { recipient_email: v })} />
                              <InputGroup label="Course / Qualification" placeholder="e.g. MBA Specialization" value={data[0]?.course_name || ""} onChange={(v: string) => updateRow(0, { course_name: v })} />
                              <InputGroup label="Issue Date" type="date" value={data[0]?.issue_date || ""} onChange={(v: string) => updateRow(0, { issue_date: v })} />
                           </div>
                        </div>
                     </div>
                   )}
                </div>
                
                {/* Visual Help Side */}
                <div className="w-full md:w-[400px] h-fit sticky top-24">
                   <div className="card-surface border-indigo-500/10 p-6 rounded-[2.5rem] space-y-4">
                      <div className="h-56 bg-black/40 rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center relative">
                         <div className="absolute inset-0 scale-[0.6] origin-center -rotate-6">
                           <CertificatePreview 
                             template={template} 
                             recipientName={data[0]?.recipient_name || ""} 
                             courseName={data[0]?.course_name || ""} 
                             institutionName={activeInstitution?.name || "The Institution"} 
                             date={data[0]?.issue_date || "2025.01.01"} 
                           />
                         </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest leading-none">Template Preview</h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic uppercase italic">A stylized simulation of the immutable asset effectively confined to the ledger.</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex justify-between pt-12 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(1)} className="btn-ghost flex items-center gap-2">
                   <ArrowLeft size={18} /> Reconfigure Template
                </Button>
                <StepButton onClick={() => setStep(3)} disabled={data.length === 0} icon={<ArrowRight size={18} />}>Proceed to Review</StepButton>
             </div>
          </motion.div>
        )}

        {/* --- STEP 3: REVIEW & SIGN --- */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                   <div className="card-surface border-indigo-500/10 rounded-3xl overflow-hidden">
                      <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/5">
                         <div className="flex items-center gap-2">
                            <Table size={16} className="text-violet-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-300">Data Validation Matrix</span>
                         </div>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase">{data.length} Records Detected</span>
                      </div>
                      <div className="max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                           <thead className="sticky top-0 bg-bg-surface z-10 border-b border-white/5">
                              <tr className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">
                                 <th className="p-4 pl-6">Recipient Name</th>
                                 <th className="p-4">Email</th>
                                 <th className="p-4">Course</th>
                                 <th className="p-4 text-right pr-6">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/[0.03]">
                              {data.map((row, i) => (
                                <tr 
                                  key={i} 
                                  onClick={() => setSelectedRowIndex(i)}
                                  className={cn(
                                    "transition-colors cursor-pointer group",
                                    selectedRowIndex === i ? "bg-indigo-500/[0.03]" : "hover:bg-white/[0.01]",
                                    !row.isValid && "border-l-4 border-l-rose-500/50"
                                  )}
                                >
                                   <td className="p-4 pl-6 text-sm font-bold text-white">{row.recipient_name || "---"}</td>
                                   <td className="p-4 text-xs text-muted-foreground italic">{row.recipient_email || "---"}</td>
                                   <td className="p-4 text-xs font-bold text-indigo-400">{row.course_name || "---"}</td>
                                   <td className="p-4 pr-6 text-right">
                                      {row.isValid ? (
                                        <BadgeCheck size={16} className="ml-auto text-indigo-500" />
                                      ) : (
                                        <AlertCircle size={16} className="ml-auto text-rose-500" />
                                      )}
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                      </div>
                   </div>
                   
                   {!validateAll() && (
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
                         <AlertCircle size={18} className="text-rose-400" />
                         <p className="text-xs font-bold text-rose-300 italic uppercase">Warning: Some records contain effectively null or invalid data fields.</p>
                      </div>
                   )}
                </div>

                {/* Focus Preview */}
                <div className="space-y-6 h-fit sticky top-24">
                   <div className="card-surface border-indigo-500/10 p-4 rounded-[2.5rem] relative overflow-hidden group">
                      <div className="absolute top-4 right-4 z-20">
                         <div className="badge-violet badge text-[8px] italic">Focus Preview</div>
                      </div>
                      <div className="aspect-[1.4/1] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
                         <div className="absolute inset-0 scale-[0.7] transform-gpu">
                            <CertificatePreview 
                              template={template} 
                              recipientName={data[selectedRowIndex]?.recipient_name || ""} 
                              courseName={data[selectedRowIndex]?.course_name || ""} 
                              institutionName={activeInstitution?.name || "The Institution"} 
                              date={data[selectedRowIndex]?.issue_date || "2025.01.01"} 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="card-surface border-indigo-500/10 p-8 rounded-3xl space-y-6 bg-gradient-to-br from-indigo-500/5 to-transparent">
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase text-white tracking-[0.2em] leading-none">Execute Issuance</h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic uppercase italic">Commence the cryptographical settlement of effectively verified credentials on the Stellar ledger.</p>
                      </div>
                      <Button 
                        onClick={handleIssuance}
                        disabled={!validateAll() || isIssuing}
                        className="w-full h-14 btn-primary text-lg font-black rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all active:scale-95"
                      >
                         <ShieldCheck className="mr-3" /> Confirm & Issue to Ledger
                      </Button>
                      <p className="text-[8px] text-center text-muted-foreground uppercase tracking-widest font-bold">Network: Stellar Public Testnet v3001v</p>
                   </div>
                </div>
             </div>

             <div className="flex justify-between pt-12 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(2)} className="btn-ghost flex items-center gap-2">
                   <ArrowLeft size={18} /> Modify Selection
                </Button>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Transaction Value</p>
                   <p className="text-xl font-black text-white italic tracking-tighter uppercase">{data.length * 0.00001} XLM</p>
                </div>
             </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">{label}</label>
       <input 
         type={type}
         placeholder={placeholder}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-muted-foreground/30 font-medium"
       />
    </div>
  );
}

function StepButton({ children, onClick, disabled, icon }: any) {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled}
      className={cn(
        "btn-primary h-14 px-10 text-lg flex items-center gap-3 transition-all active:scale-95",
        disabled && "opacity-50 grayscale cursor-not-allowed"
      )}
    >
       {children}
       {icon}
    </Button>
  );
}
