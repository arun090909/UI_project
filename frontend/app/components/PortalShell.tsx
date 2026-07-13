"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/employer/home", label: "Home", icon: "H" },
  { href: "/employer/jobs", label: "Job Posting", icon: "J" },
  { href: "/employer/events", label: "Events Scheduling", icon: "E" },
];

export function Logo() {
  return (
    <Link className="logo" href="/employer/jobs" aria-label="Waypoint job postings">
      <span className="logo-mark" />
      <span>Waypoint</span>
    </Link>
  );
}

export function PortalHeader({ active }: { active: string }) {
  return (
    <header className="portal-header">
      <Logo />
      <nav className="portal-nav" aria-label="Employer navigation">
        {navItems.map((item) => (
          <Link
            className={active === item.label ? "nav-link active" : "nav-link"}
            href={item.href}
            key={item.href}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="account-menu">
        <NotificationMenu />
      </div>
    </header>
  );
}

function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="profile-menu">
      <button
        className="bell icon-button profile-trigger"
        type="button"
        aria-label="Open notifications menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        N
      </button>
      {isOpen ? (
        <div className="profile-dropdown" role="menu">
          <button type="button" role="menuitem">Profile</button>
          <button type="button" role="menuitem">Settings</button>
          <button type="button" role="menuitem">Logout</button>
        </div>
      ) : null}
    </div>
  );
}

export function PortalShell({
  active,
  children,
}: Readonly<{ active: string; children: React.ReactNode }>) {
  return (
    <div className="portal-page">
      <PortalHeader active={active} />
      {children}
    </div>
  );
}
