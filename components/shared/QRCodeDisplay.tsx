"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/context/ToastContext";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
  data: string;
  size?: number;
  label?: string;
  downloadName?: string;
  className?: string;
}

export default function QRCodeDisplay({ 
  data, 
  size = 120, 
  label, 
  downloadName = "trustcert-qr",
  className 
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: {
          dark: "#f59e0b", // Indigo
          light: "#0d0d1f" // Surface
        }
      });
    }
  }, [data, size]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${downloadName}.png`;
      link.click();
      showToast("QR Code downloaded", "success");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    showToast("Link copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="p-3 bg-[#0d0d1f] border border-amber-500/15 rounded-2xl shadow-2xl relative overflow-hidden group">
        <canvas ref={canvasRef} className="rounded-lg" />
        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {label && <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{label}</p>}

      <div className="flex gap-2 w-full">
         <Button 
          variant="outline" 
          onClick={handleCopy}
          className="flex-1 btn-secondary h-9 text-[10px] uppercase"
         >
           {copied ? <Check size={14} className="mr-1.5" /> : <Copy size={14} className="mr-1.5" />}
           Copy Link
         </Button>
         <Button 
          variant="outline" 
          onClick={handleDownload}
          className="flex-1 btn-secondary h-9 text-[10px] uppercase"
         >
           <Download size={14} className="mr-1.5" />
           Download
         </Button>
      </div>
    </div>
  );
}
