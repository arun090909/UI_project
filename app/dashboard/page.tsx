"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getProfile } from "@/lib/profile";

export default function DashboardPage() {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    setFirstName(getProfile()?.firstName || null);
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {/* ── Hero ── */}
      <div className="bg-ink text-white px-12 py-16 relative overflow-hidden">
        <div className="absolute -right-[100px] -top-[100px] w-[320px] h-[320px] rounded-full border border-white/[0.07]" />
        <div className="absolute right-[60px] top-[60px] w-[170px] h-[170px] rounded-full border border-white/[0.07]" />
        <div className="max-w-[1180px] mx-auto relative z-10">
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#8FD9B8] mb-4">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </p>
          <h1 className="font-serif font-medium text-[40px] leading-[1.24] max-w-[620px] mb-4 tracking-[-0.01em]">
            The jobs and events actually worth your commute.
          </h1>
          <p className="text-[15px] text-[#C7CBC5] max-w-[500px] leading-[1.75] mb-8">
            Waypoint matches you to roles and career events based on your skills, not just your keywords. New matches land here every week.
          </p>
          <div className="flex gap-10 border-t border-white/[0.12] pt-6 flex-wrap">
            {[
              { val: "1,200+", lbl: "employers on Waypoint" },
              { val: "18,400", lbl: "roles posted this year" },
              { val: "92%", lbl: "top match accuracy" },
            ].map(({ val, lbl }) => (
              <div key={lbl}>
                <p className="font-mono text-[20px] text-white m-0 mb-1">{val}</p>
                <p className="text-[11.5px] text-[#8B9089] uppercase tracking-[0.05em] m-0">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-11">

        {/* ── About ── */}
        <div className="py-13 border-b border-line">
          <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-3.5">About Waypoint</p>
          <div className="grid gap-14" style={{ gridTemplateColumns: "1.1fr 1fr" }}>
            <div>
              <h2 className="font-serif font-medium text-[26px] mb-4 tracking-[-0.01em] leading-[1.3]">
                Built to shorten the distance between good people and good jobs.
              </h2>
              <p className="text-[14.5px] leading-[1.8] text-ink-soft mb-4">
                Waypoint started with a simple observation: most job boards optimize for volume, not fit. So we built a platform that ranks opportunities by real skill match and real distance — not just keyword overlap — and pairs it with local hiring events so a first conversation doesn&apos;t have to wait on a resume.
              </p>
              <p className="text-[14.5px] leading-[1.8] text-ink-soft mb-4">
                Employers post once and reach candidates who are actually qualified and actually nearby. Job seekers see fewer, better matches instead of an endless scroll.
              </p>
              <p className="text-[14.5px] leading-[1.8] text-ink-soft">
                Founded in 2024, Waypoint now works with companies ranging from early-stage startups to established manufacturers, connecting them with talent through both online matching and in-person hiring events.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3.5 content-start">
              {[
                { icon: <path d="M12 21s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z"/>, sub: <circle cx="12" cy="9" r="2.5"/>, title: "Local-first matching", desc: "Ranked by real commute distance, not just city name." },
                { icon: <><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></>, sub: null, title: "Verified employers", desc: "Every company on Waypoint is reviewed before posting." },
                { icon: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></>, sub: null, title: "In-person events", desc: "Career fairs and info sessions, not just online listings." },
                { icon: <><path d="M4 4v16h16"/><path d="M8 15l4-5 3 3 5-6"/></>, sub: null, title: "Skill-based ranking", desc: "Matches improve as your profile and applications grow." },
              ].map(({ title, desc, icon, sub }) => (
                <div key={title} className="bg-surface border border-line rounded-[10px] p-5">
                  <div className="w-8 h-8 rounded-[7px] bg-accent-soft text-accent flex items-center justify-center mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{icon}{sub}</svg>
                  </div>
                  <h4 className="text-[13.5px] font-semibold mb-1.5">{title}</h4>
                  <p className="text-[12px] text-muted leading-relaxed m-0">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Get started ── */}
        <div className="py-13 border-b border-line">
          <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-3.5">Get started</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                title: "Browse careers",
                desc: "Search open roles and events by title, distance, and job type.",
                cta: "Explore →",
                href: "/careers",
                icon: <><path d="M7 3h8l4 4v14H7z"/><path d="M7 10h10M7 14h10M7 18h6"/></>,
              },
              {
                title: "Track applications",
                desc: "See status updates on every role you've applied to, in one place.",
                cta: "View applications →",
                href: "#",
                icon: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></>,
              },
              {
                title: "Complete your profile",
                desc: "Add skills and a resume so matches get sharper over time.",
                cta: "Edit profile →",
                href: "#",
                icon: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-4 4.5-6 7-6s5.5 2 7 6"/></>,
              },
            ].map(({ title, desc, cta, href, icon }) => (
              <Link key={title} href={href}
                className="bg-surface border border-line rounded-[10px] p-6 cursor-pointer transition-all hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(23,27,30,0.06)] no-underline text-ink">
                <div className="w-[38px] h-[38px] rounded-[8px] bg-accent-soft text-accent flex items-center justify-center mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{icon}</svg>
                </div>
                <h3 className="font-serif text-[17px] font-medium mb-1.5 tracking-[-0.01em]">{title}</h3>
                <p className="text-[12.5px] text-muted leading-relaxed mb-3.5">{desc}</p>
                <span className="text-[12.5px] font-medium text-accent">{cta}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="py-13 border-b border-line">
          <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-3.5">How Waypoint works</p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { n: "1", title: "Tell us your skills", desc: "Add your skills and resume once — no separate application for every role." },
              { n: "2", title: "Get ranked matches", desc: "We surface roles and events by fit and by distance from your zip code." },
              { n: "3", title: "Apply or show up", desc: "Apply in a click, or register for a nearby event to meet employers directly." },
            ].map(({ n, title, desc }) => (
              <div key={n}>
                <div className="font-mono text-[12px] text-accent bg-accent-soft w-[26px] h-[26px] rounded-full flex items-center justify-center mb-3.5">{n}</div>
                <h4 className="font-serif text-[15.5px] font-medium mb-1.5">{title}</h4>
                <p className="text-[12.5px] text-muted leading-[1.65] m-0 max-w-[280px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Activity ── */}
        <div className="py-13">
          <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-3.5">Your activity</p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { val: "6", lbl: "new matches this week" },
              { val: "3", lbl: "applications in review" },
              { val: "2", lbl: "upcoming events nearby" },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="bg-surface border border-line rounded-[10px] p-5">
                <p className="font-serif text-[24px] font-medium m-0">{val}</p>
                <p className="text-[12px] text-muted mt-1 m-0">{lbl}</p>
              </div>
            ))}
          </div>

          <div className="border border-line rounded-[10px] bg-surface overflow-hidden">
            {[
              {
                icon: <><path d="M7 3h8l4 4v14H7z"/><path d="M7 10h10M7 14h10M7 18h6"/></>,
                name: "Applied to Senior frontend engineer",
                meta: "Meridian Labs",
                when: "Jul 6",
              },
              {
                icon: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></>,
                name: "Registered for DFW tech career fair",
                meta: "Sat, Jul 18",
                when: "Jul 3",
              },
              {
                icon: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-4 4.5-6 7-6s5.5 2 7 6"/></>,
                name: "Updated skills on profile",
                meta: "Added React, TypeScript",
                when: "Jun 29",
              },
            ].map(({ icon, name, meta, when }, i) => (
              <div key={i} className="flex items-center gap-3.5 px-4.5 py-3.5 border-b border-line last:border-b-0">
                <div className="w-8 h-8 rounded-full bg-paper border border-line flex items-center justify-center shrink-0 text-ink-soft">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{icon}</svg>
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold m-0">{name}</p>
                  <p className="text-[12px] text-muted mt-0.5 m-0">{meta}</p>
                </div>
                <span className="ml-auto font-mono text-[12px] text-muted">{when}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="text-center text-[12px] text-muted py-7 border-t border-line">
        © 2026 Waypoint. Built for job seekers and employers in DFW.
      </div>
    </div>
  );
}
