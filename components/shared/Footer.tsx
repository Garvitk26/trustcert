import React from "react";
import Link from "next/link";
import { ShieldCheck, MessageSquare, Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer() {
  const productLinks = [
    { name: "Verify Certificate", href: "/" },
    { name: "Issue Certificate", href: "/institution/issue" },
    { name: "Analytics Dashboard", href: "/institution/analytics" },
    { name: "Registry Management", href: "/institution/certificates" },
  ];

  const companyLinks = [
    { name: "About", href: "/about" },
    { name: "Team", href: "/about/team" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Security", href: "/contact" },
  ];

  const socialLinks = [
    { 
      name: "X",
      href: "#", 
      color: "hover:text-amber-400",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    { 
      name: "Github",
      href: "#", 
      color: "hover:text-orange-400",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )
    },
    { 
      name: "Linkedin",
      href: "#", 
      color: "hover:text-yellow-400",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
  ];

  return (
    <footer className="bg-[#08080f] border-t border-amber-500/10 py-20 relative z-[10]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Column 1: Brand */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-gradient-to-tr from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
               <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="text-xl font-black gradient-text">TrustCert</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
            Decentralized credential verification on Stellar blockchain. Permanently recording and securing professional identity.
          </p>
          <div className="flex gap-4">
             {socialLinks.map((social, i) => (
                <Link key={i} href={social.href} className={cn("text-muted-foreground transition-colors", social.color)}>
                   <social.icon size={20} />
                </Link>
             ))}
          </div>
        </div>

        {/* Column 2: Product */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-tight">Product</h4>
          <ul className="space-y-4">
            {productLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-amber-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Company */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-tight">Company</h4>
          <ul className="space-y-4">
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-orange-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-tight">Legal</h4>
          <ul className="space-y-4">
            {legalLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-yellow-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
         <p className="text-xs text-muted-foreground">
            © 2025 <span className="text-white font-semibold">TrustCert</span>. Built on Stellar blockchain. 
            All certificates are permanently recorded on-chain.
         </p>
         <div className="flex gap-6">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-amber-500/50">
               <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
               Network Status: Operational
            </div>
         </div>
      </div>
    </footer>
  );
}
