"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { jobs, calendarEvents, type Job } from "@/lib/mockData";

type FilterKey = "datePosted" | "distance" | "employmentType" | "workType";

const DATE_OPTIONS = ["Recently posted", "Within 24 hours", "This week", "No preference"];
const DISTANCE_OPTIONS = ["Within 5 mi", "Within 10 mi", "Within 25 mi", "Within 50 mi", "Within 100 mi", "Anywhere in USA"];
const EMPLOYMENT_OPTIONS = ["Full-time", "Contract", "Part-time"];
const WORK_OPTIONS = ["Onsite", "Hybrid", "Remote"];

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function FilterDropdown({
  label, options, isOpen, isActive, selectedValue, dropdownRef, onToggle, onSelect,
}: {
  label: string;
  options: string[];
  isOpen: boolean;
  isActive: boolean;
  selectedValue: string;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onToggle: () => void;
  onSelect: (val: string) => void;
}) {
  return (
    <div className="relative" ref={isOpen ? dropdownRef : undefined}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-full text-[12.5px] font-medium transition-all ${
          isActive ? "bg-accent-soft border-accent text-accent" : "bg-surface border-line text-ink-soft hover:border-ink-soft"
        }`}
      >
        {label}
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}><ChevronIcon /></span>
      </button>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 bg-surface border border-line rounded-[10px] shadow-[0_12px_28px_rgba(23,27,30,0.1)] p-2 min-w-[180px] z-10">
          {options.map((opt) => {
            const checked = selectedValue === opt;
            return (
              <div key={opt} onClick={() => onSelect(opt)}
                className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-md text-[13px] text-ink-soft cursor-pointer hover:bg-paper">
                <span className={`w-[15px] h-[15px] border rounded flex items-center justify-center shrink-0 ${checked ? "bg-accent border-accent" : "border-line"}`}>
                  {checked && <CheckIcon />}
                </span>
                <span className={checked ? "text-ink font-medium" : ""}>{opt}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CareersPage() {
  const [selectedId, setSelectedId] = useState<string>(jobs[0].id);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLoc, setSearchLoc] = useState("");

  const [openDropdown, setOpenDropdown] = useState<FilterKey | null>(null);
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    datePosted: "No preference",
    distance: "Within 10 mi",
    employmentType: "Full-time",
    workType: "",
  });

  const [salaryMin, setSalaryMin] = useState(40);
  const [salaryMax, setSalaryMax] = useState(140);
  const fillRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedJob = jobs.find((j) => j.id === selectedId) ?? jobs[0];

  function updateSalaryFill(min: number, max: number) {
    if (!fillRef.current) return;
    const range = 200 - 20;
    const leftPct = ((min - 20) / range) * 100;
    const rightPct = ((max - 20) / range) * 100;
    fillRef.current.style.left = `${leftPct}%`;
    fillRef.current.style.width = `${rightPct - leftPct}%`;
  }

  useEffect(() => { updateSalaryFill(salaryMin, salaryMax); }, [salaryMin, salaryMax]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleDropdown(key: FilterKey) {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  function setFilter(key: FilterKey, val: string) {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }

  function clearFilters() {
    setFilters({ datePosted: "", distance: "", employmentType: "", workType: "" });
    setSalaryMin(40); setSalaryMax(140);
  }

  function isFilterActive(key: FilterKey) {
    const defaults: Record<FilterKey, string> = { datePosted: "", distance: "", employmentType: "", workType: "" };
    return filters[key] !== "" && filters[key] !== defaults[key];
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <div className="max-w-[1180px] mx-auto px-11 py-9 pb-16">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h1 className="font-serif font-medium text-[26px] mb-1 tracking-[-0.01em]">Find your next role</h1>
            <p className="text-[13.5px] text-muted">Search jobs and events matched to your skills</p>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="bg-surface border border-line rounded-[10px] p-5.5 mb-4">
          <div className="flex items-stretch border border-line rounded-[8px] overflow-hidden bg-surface">
            <div className="flex items-center gap-2.5 px-4 py-3 flex-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-muted">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                type="text"
                placeholder="Job title or role, e.g. Frontend engineer"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="border-none outline-none bg-transparent font-sans text-[14px] text-ink w-full placeholder:text-muted"
              />
            </div>
            <div className="w-px bg-line self-center h-8" />
            <div className="flex items-center gap-2.5 px-4 py-3" style={{ minWidth: "260px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-muted">
                <path d="M12 21s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>
              </svg>
              <input
                type="text"
                placeholder="City or zip code"
                value={searchLoc}
                onChange={(e) => setSearchLoc(e.target.value)}
                className="border-none outline-none bg-transparent font-sans text-[14px] text-ink w-full placeholder:text-muted"
              />
            </div>
            <button className="bg-accent text-white px-6 text-[13.5px] font-medium hover:opacity-90 transition-opacity shrink-0">
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2.5 flex-wrap mt-3.5" ref={dropdownRef}>
            <FilterDropdown
              label="Date posted" options={DATE_OPTIONS}
              isOpen={openDropdown === "datePosted"} isActive={isFilterActive("datePosted")}
              selectedValue={filters.datePosted} dropdownRef={dropdownRef}
              onToggle={() => toggleDropdown("datePosted")} onSelect={(val) => setFilter("datePosted", val)}
            />
            <FilterDropdown
              label="Distance" options={DISTANCE_OPTIONS}
              isOpen={openDropdown === "distance"} isActive={isFilterActive("distance")}
              selectedValue={filters.distance} dropdownRef={dropdownRef}
              onToggle={() => toggleDropdown("distance")} onSelect={(val) => setFilter("distance", val)}
            />
            <div className="w-px h-4.5 bg-line mx-0.5" />
            <FilterDropdown
              label="Employment type" options={EMPLOYMENT_OPTIONS}
              isOpen={openDropdown === "employmentType"} isActive={isFilterActive("employmentType")}
              selectedValue={filters.employmentType} dropdownRef={dropdownRef}
              onToggle={() => toggleDropdown("employmentType")} onSelect={(val) => setFilter("employmentType", val)}
            />
            <FilterDropdown
              label="Work type" options={WORK_OPTIONS}
              isOpen={openDropdown === "workType"} isActive={isFilterActive("workType")}
              selectedValue={filters.workType} dropdownRef={dropdownRef}
              onToggle={() => toggleDropdown("workType")} onSelect={(val) => setFilter("workType", val)}
            />

            {/* Salary dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("workType")}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-line rounded-full text-[12.5px] font-medium text-ink-soft bg-surface hover:border-ink-soft transition-all"
              >
                Salary <ChevronIcon />
              </button>
              {openDropdown === "workType" && (
                <div className="absolute top-[calc(100%+8px)] left-0 bg-surface border border-line rounded-[10px] shadow-[0_12px_28px_rgba(23,27,30,0.1)] p-4 w-[250px] z-10">
                  <div className="flex justify-between items-center mb-3.5">
                    <span className="font-mono text-[13px] font-medium text-ink bg-paper border border-line rounded-md px-2.5 py-1.5">
                      ${salaryMin}k
                    </span>
                    <span className="text-[12px] text-muted">to</span>
                    <span className="font-mono text-[13px] font-medium text-ink bg-paper border border-line rounded-md px-2.5 py-1.5">
                      {salaryMax >= 200 ? "$200k+" : `$${salaryMax}k`}
                    </span>
                  </div>
                  <div className="range-wrap">
                    <div className="range-track" />
                    <div className="range-fill" ref={fillRef} />
                    <input type="range" min="20" max="200" step="5" value={salaryMin}
                      onChange={(e) => {
                        const v = Math.min(+e.target.value, salaryMax - 5);
                        setSalaryMin(v);
                      }} />
                    <input type="range" min="20" max="200" step="5" value={salaryMax}
                      onChange={(e) => {
                        const v = Math.max(+e.target.value, salaryMin + 5);
                        setSalaryMax(v);
                      }} />
                  </div>
                  <div className="flex justify-between text-[10.5px] text-muted mt-0.5">
                    <span>$20k</span><span>$200k+</span>
                  </div>
                </div>
              )}
            </div>

            <button onClick={clearFilters} className="text-[12.5px] text-muted ml-auto underline underline-offset-2 cursor-pointer">
              Clear all
            </button>
          </div>
        </div>

        {/* ── Results header ── */}
        <div className="flex justify-between items-baseline mb-3.5">
          <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted">Recommended for you</p>
          <span className="text-[12.5px] text-muted">{jobs.length + calendarEvents.length} results</span>
        </div>

        {/* ── Split shell ── */}
        <div className="grid border border-line rounded-[10px] overflow-hidden bg-surface" style={{ gridTemplateColumns: "290px 1fr" }}>

          {/* Left list */}
          <div className="bg-paper border-r border-line p-2.5 max-h-[640px] overflow-y-auto">
            <p className="text-[10.5px] font-semibold tracking-[0.06em] uppercase text-muted px-3 py-3 pb-1.5">Jobs</p>
            {jobs.map((job) => (
              <div key={job.id} onClick={() => setSelectedId(job.id)}
                className={`px-3.5 py-3 rounded-md cursor-pointer mb-0.5 border-l-[3px] transition-colors ${
                  selectedId === job.id
                    ? "bg-accent-soft border-l-accent"
                    : "border-l-transparent hover:bg-black/[0.02]"
                }`}>
                <p className={`text-[13.5px] font-semibold m-0 mb-0.5 ${selectedId === job.id ? "text-accent" : "text-ink"}`}>{job.title}</p>
                <p className="text-[12px] text-muted m-0">{job.company} · {job.distance} · {job.match}% match</p>
              </div>
            ))}

            <p className="text-[10.5px] font-semibold tracking-[0.06em] uppercase text-muted px-3 py-3 pb-1.5 mt-1">Events</p>
            {calendarEvents.map((ev) => (
              <div key={ev.id} className="px-3.5 py-3 rounded-md cursor-pointer mb-0.5 border-l-[3px] border-l-transparent hover:bg-black/[0.02]">
                <p className="text-[13.5px] font-semibold m-0 mb-0.5 text-ink">{ev.title}</p>
                <p className="text-[12px] text-muted m-0">{ev.date} · {ev.distance}</p>
              </div>
            ))}
          </div>

          {/* Right detail */}
          <JobDetail job={selectedJob} />
        </div>
      </div>
    </div>
  );
}

function JobDetail({ job }: { job: Job }) {
  return (
    <div className="p-8 pr-9">
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <h2 className="font-serif text-[22px] font-medium mb-1.5 tracking-[-0.01em]">{job.title}</h2>
          <p className="text-[13px] text-muted m-0">{job.company}</p>
        </div>
        <Link href={`/careers/apply/${job.id}`}
          className="bg-accent text-white border border-accent px-4 py-2.5 rounded-md text-[13px] font-medium hover:opacity-90 transition-opacity no-underline shrink-0">
          Apply now
        </Link>
      </div>

      <div className="flex gap-7 flex-wrap my-5 pb-5 border-b border-line">
        {[
          { k: "Distance", v: job.distance },
          { k: "Setting", v: job.setting },
          { k: "Type", v: job.type },
        ].map(({ k, v }) => (
          <div key={k}>
            <p className="text-[11px] text-muted uppercase tracking-[0.05em] m-0 mb-1.5">{k}</p>
            <p className="font-mono text-[14px] font-medium m-0">{v}</p>
          </div>
        ))}
        <div>
          <p className="text-[11px] text-muted uppercase tracking-[0.05em] m-0 mb-1.5">Match</p>
          <div className="flex items-center gap-2">
            <div className="w-[70px] h-[5px] bg-line rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${job.match}%` }} />
            </div>
            <span className="font-mono text-[12px] text-ink-soft">{job.match}</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-2.5">About the role</p>
      <p className="text-[14.5px] leading-[1.75] text-ink-soft max-w-[620px]">{job.about}</p>

      <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-2.5 mt-6">Required skills</p>
      <div className="flex flex-wrap gap-2">
        {job.skills.map((s) => (
          <span key={s} className="text-[12.5px] px-3 py-1.5 border border-line rounded-full text-ink-soft bg-surface">{s}</span>
        ))}
      </div>
    </div>
  );
}
