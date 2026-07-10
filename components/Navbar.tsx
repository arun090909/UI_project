"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfile, StoredProfile } from "@/lib/profile";

const NAV_LINKS = [
  { label: "Home", href: "/dashboard" },
  { label: "Careers", href: "/careers" },
  { label: "Events", href: "#" },
  { label: "Profile", href: "#" },
  { label: "Contact Us", href: "#" },
];

function initialsOf(profile: StoredProfile | null) {
  if (!profile) return "?";
  const f = profile.firstName.trim()[0] ?? "";
  const l = profile.lastName.trim()[0] ?? "";
  return (f + l).toUpperCase() || "?";
}

export default function Navbar() {
  const pathname = usePathname();
  const profile = useProfile();

  return (
    <nav className="sticky top-0 z-20 bg-surface border-b border-line flex items-center justify-between h-16 px-11">
      {/* Brandmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8.5" fill="none" stroke="#171B1E" strokeWidth="1.3" />
          <circle cx="10" cy="10" r="3" fill="#1D4B3D" />
        </svg>
        <span className="font-serif font-medium text-[19px] tracking-[-0.01em]">Waypoint</span>
      </div>

      {/* Nav links — hidden on small screens */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-md text-[13.5px] font-medium transition-colors ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-ink-soft hover:bg-paper"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="relative text-ink-soft cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
            <path d="M10 21h4" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-[7px] h-[7px] rounded-full bg-amber border-[1.5px] border-surface" />
        </div>
        <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-[11px] font-semibold shrink-0 cursor-pointer select-none overflow-hidden">
          {profile?.avatarSrc
            ? <img src={profile.avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            : initialsOf(profile)}
        </div>
      </div>
    </nav>
  );
}
