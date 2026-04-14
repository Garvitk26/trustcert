"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ShieldCheck, LayoutDashboard, UserCircle, LogIn, ArrowRight } from "lucide-react";
import WalletButton from "./WalletButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Verify", href: "/verify" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={cn(
      "sticky top-0 w-full h-[64px] z-[50] transition-all duration-300 border-b",
      scrolled ? "bg-[#08080f]/85 backdrop-blur-md border-amber-500/10" : "bg-transparent border-transparent"
    )}>
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-gradient-to-tr from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
             <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="text-xl font-black gradient-text">TrustCert</span>
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "relative text-sm font-semibold transition-colors duration-200",
                isActive(link.href) ? "gradient-text" : "text-muted-foreground hover:text-white"
              )}
            >
              {link.name}
              {isActive(link.href) && (
                <motion.div 
                  layoutId="navUnderline" 
                  className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-amber-500" 
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-6">
           <WalletButton />
           
           <div className="h-4 w-px bg-white/10" />

           {session ? (
             <Button asChild className="btn-primary flex items-center gap-2">
               <Link href={session.user.role === "institution" ? "/institution/dashboard" : "/student/portal"}>
                 <LayoutDashboard size={16} /> Dashboard
               </Link>
             </Button>
           ) : (
             <div className="flex items-center gap-3">
                <Button asChild variant="ghost" className="btn-ghost">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="btn-primary">
                  <Link href="/signup">Get Started</Link>
                </Button>
             </div>
           )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-white"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#08080f] border-b border-amber-500/10 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className={cn("text-lg font-bold", isActive(link.href) ? "gradient-text" : "text-muted-foreground")}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/5" />
              <div className="flex flex-col gap-4">
                <WalletButton />
                {session ? (
                   <Button asChild className="w-full btn-primary h-12">
                     <Link href={session.user.role === "institution" ? "/institution/dashboard" : "/student/portal"}>
                       Dashboard
                     </Link>
                   </Button>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="w-full text-center h-12">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full btn-primary h-12">
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
