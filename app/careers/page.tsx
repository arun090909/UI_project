"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { jobs, type Job } from "@/lib/mockData";

type FilterKey = "datePosted" | "distance" | "employmentType" | "workType" | "salary";

const DATE_OPTIONS = ["Recently posted", "Within 24 hours", "This week", "No preference"];
const DISTANCE_OPTIONS = ["Within 5 mi", "Within 10 mi", "Within 25 mi", "Within 50 mi", "Within 100 mi", "Anywhere in USA"];
const EMPLOYMENT_OPTIONS = ["Full-time", "Contract", "Part-time"];
const WORK_OPTIONS = ["Onsite", "Hybrid", "Remote"];

const JOB_TITLE_SUGGESTIONS = [
  // Software & IT
  "Software engineer", "Senior frontend engineer", "Backend engineer", "Full-stack developer",
  "Mobile developer", "DevOps engineer", "QA engineer", "Data analyst", "Data scientist",
  "Machine learning engineer", "Product manager", "Product designer", "UX researcher",
  "Engineering manager", "Site reliability engineer", "Security engineer",
  // Healthcare
  "Registered nurse", "Medical assistant", "Phlebotomist", "Pharmacy technician",
  "Home health aide", "Physical therapist", "Medical billing specialist",
  // Retail & sales
  "Sales associate", "Retail store manager", "Account executive", "Sales representative",
  "Cashier", "Merchandiser",
  // Warehouse & logistics
  "Warehouse associate", "Forklift operator", "Delivery driver", "Logistics coordinator",
  "Supply chain analyst", "Inventory specialist",
  // Admin & office
  "Administrative assistant", "Office manager", "Executive assistant", "Data entry clerk",
  "Bookkeeper", "Payroll specialist",
  // Skilled trades
  "Electrician", "Plumber", "HVAC technician", "Welder", "Carpenter", "Maintenance technician",
  // Hospitality & food service
  "Barista", "Bartender", "Restaurant server", "Line cook", "Hotel front desk agent", "Housekeeper",
  // Marketing & design
  "Marketing manager", "Social media manager", "Graphic designer", "Content writer", "SEO specialist",
  // Finance & education
  "Financial analyst", "Accountant", "Teacher", "Curriculum developer",
  // Customer support
  "Customer support specialist", "Call center representative",
];

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

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}

// ── Helpers for filtering ──

function parseSalaryRangeK(salary: string): [number, number] {
  const nums = salary.match(/[\d,]+/g)?.map((n) => parseInt(n.replace(/,/g, ""), 10)) ?? [];
  if (nums.length === 0) return [0, 0];
  if (nums.length === 1) return [nums[0] / 1000, nums[0] / 1000];
  return [nums[0] / 1000, nums[1] / 1000];
}

function parseDistanceOptionMiles(opt: string): number {
  if (!opt || opt === "Anywhere in USA") return Infinity;
  const n = parseFloat(opt.replace(/[^\d.]/g, ""));
  return Number.isNaN(n) ? Infinity : n;
}

function withinDatePosted(daysAgo: number, opt: string): boolean {
  switch (opt) {
    case "Within 24 hours": return daysAgo <= 1;
    case "Recently posted": return daysAgo <= 3;
    case "This week": return daysAgo <= 7;
    default: return true; // "No preference" or unset
  }
}

function settingToWorkType(setting: string): string {
  return setting === "On-site" ? "Onsite" : setting;
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function RadioFilterDropdown({
  name, label, options, isOpen, isActive, selectedValue, dropdownRef, onToggle, onSelect,
}: {
  name: string;
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
        {selectedValue || label}
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}><ChevronIcon /></span>
      </button>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 bg-surface border border-line rounded-[10px] shadow-[0_12px_28px_rgba(23,27,30,0.1)] p-2 min-w-[180px] z-10">
          {options.map((opt) => {
            const checked = selectedValue === opt;
            return (
              <label key={opt}
                className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-md text-[13px] text-ink-soft cursor-pointer hover:bg-paper">
                <input
                  type="radio"
                  name={name}
                  checked={checked}
                  onChange={() => onSelect(opt)}
                  className="w-[15px] h-[15px] accent-accent shrink-0 cursor-pointer"
                />
                <span className={checked ? "text-ink font-medium" : ""}>{opt}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MultiFilterDropdown({
  label, options, isOpen, isActive, selectedValues, dropdownRef, onToggle, onToggleOption,
}: {
  label: string;
  options: string[];
  isOpen: boolean;
  isActive: boolean;
  selectedValues: string[];
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onToggle: () => void;
  onToggleOption: (val: string) => void;
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
        {selectedValues.length > 0 ? selectedValues.join(", ") : label}
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}><ChevronIcon /></span>
      </button>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 bg-surface border border-line rounded-[10px] shadow-[0_12px_28px_rgba(23,27,30,0.1)] p-2 min-w-[180px] z-10">
          {options.map((opt) => {
            const checked = selectedValues.includes(opt);
            return (
              <div key={opt} onClick={() => onToggleOption(opt)}
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLoc, setSearchLoc] = useState("");
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);

  const filteredTitleSuggestions = (() => {
    const query = searchTitle.trim().toLowerCase();
    if (!query) return [];
    return JOB_TITLE_SUGGESTIONS
      .filter((t) => t.toLowerCase().includes(query))
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(query) ? 0 : 1;
        const bStarts = b.toLowerCase().startsWith(query) ? 0 : 1;
        return aStarts !== bStarts ? aStarts - bStarts : a.localeCompare(b);
      })
      .slice(0, 10);
  })();

  const [openDropdown, setOpenDropdown] = useState<FilterKey | null>(null);
  const [filters, setFilters] = useState<Record<"datePosted" | "distance" | "employmentType", string>>({
    datePosted: "",
    distance: "",
    employmentType: "",
  });
  const [workTypes, setWorkTypes] = useState<string[]>([]);

  const [salaryMin, setSalaryMin] = useState(40);
  const [salaryMax, setSalaryMax] = useState(140);
  const fillRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [locationError, setLocationError] = useState("");

  function jobDistanceMiles(job: Job): number {
    if (userCoords) return haversineMiles(userCoords.lat, userCoords.lng, job.lat, job.lng);
    const n = parseFloat(job.distance);
    return Number.isNaN(n) ? Infinity : n;
  }

  const filteredJobs = useMemo(() => {
    const distanceMax = parseDistanceOptionMiles(filters.distance);
    const salLo = salaryMin;
    const salHi = salaryMax >= 200 ? Infinity : salaryMax;
    const titleQuery = searchTitle.trim().toLowerCase();
    const locQuery = searchLoc.trim().toLowerCase();

    return jobs.filter((job) => {
      if (titleQuery && !`${job.title} ${job.company}`.toLowerCase().includes(titleQuery)) return false;
      if (locQuery && job.setting !== "Remote" && !job.location.toLowerCase().includes(locQuery)) return false;
      if (filters.employmentType && job.type !== filters.employmentType) return false;
      if (workTypes.length > 0 && !workTypes.includes(settingToWorkType(job.setting))) return false;
      if (!withinDatePosted(job.postedDaysAgo, filters.datePosted)) return false;
      if (job.setting !== "Remote" && jobDistanceMiles(job) > distanceMax) return false;
      const [jobLo, jobHi] = parseSalaryRangeK(job.salary);
      if (jobHi < salLo || jobLo > salHi) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle, searchLoc, filters, workTypes, salaryMin, salaryMax, userCoords]);

  const selectedJob = filteredJobs.find((j) => j.id === selectedId) ?? filteredJobs[0] ?? null;

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

  function setFilter(key: "datePosted" | "distance" | "employmentType", val: string) {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === val ? "" : val }));
  }

  function toggleWorkType(val: string) {
    setWorkTypes((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  }

  function clearFilters() {
    setFilters({ datePosted: "", distance: "", employmentType: "" });
    setWorkTypes([]);
    setSalaryMin(40); setSalaryMax(140);
  }

  function isFilterActive(key: "datePosted" | "distance" | "employmentType") {
    return filters[key] !== "";
  }

  function handleLocationInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    // Once it looks like a ZIP entry (starts with a digit), keep it digits-only.
    if (/^\d/.test(val)) {
      setSearchLoc(val.replace(/\D/g, "").slice(0, 5));
    } else {
      setSearchLoc(val);
    }
  }

  function locateMe() {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Location isn't supported by your browser.");
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city = data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.county;
          const state = data?.address?.state;
          if (city && state) setSearchLoc(`${city}, ${state}`);
        } catch {
          // Reverse geocoding is best-effort — distance filtering still works from raw coordinates.
        }
        setLocatingUser(false);
      },
      () => {
        setLocationError("Couldn't get your location — check browser permissions.");
        setLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function runSearch() {
    setOpenDropdown(null);
  }

  // Detect the user's current location automatically on page load, so
  // distances and the location field are populated without a manual click.
  const hasAutoLocatedRef = useRef(false);
  useEffect(() => {
    if (hasAutoLocatedRef.current) return;
    hasAutoLocatedRef.current = true;
    locateMe();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <div className="max-w-[1180px] mx-auto px-11 py-9 pb-16">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h1 className="font-serif font-medium text-[26px] mb-1 tracking-[-0.01em]">Find your next role</h1>
            <p className="text-[13.5px] text-muted">Search jobs matched to your skills</p>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="bg-surface border border-line rounded-[10px] p-5.5 mb-4">
          <div className="flex items-stretch border border-line rounded-[8px] overflow-hidden bg-surface">
            <div className="relative flex items-center gap-2.5 px-4 py-3 flex-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-muted">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                type="text"
                placeholder="Job title or role, e.g. Frontend engineer"
                value={searchTitle}
                onChange={(e) => { setSearchTitle(e.target.value); setShowTitleSuggestions(true); }}
                onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
                onFocus={() => setShowTitleSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 120)}
                className="border-none outline-none bg-transparent font-sans text-[14px] text-ink w-full placeholder:text-muted"
              />
              {showTitleSuggestions && filteredTitleSuggestions.length > 0 && (
                <div className="absolute top-[calc(100%+9px)] left-0 right-0 bg-surface border border-line rounded-[10px] shadow-[0_12px_28px_rgba(23,27,30,0.1)] overflow-y-auto max-h-[260px] z-20">
                  {filteredTitleSuggestions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { setSearchTitle(t); setShowTitleSuggestions(false); }}
                      className="w-full text-left px-4 py-2.5 text-[13.5px] text-ink hover:bg-accent-soft hover:text-accent transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px bg-line self-center h-8" />
            <div className="flex items-center gap-2.5 px-4 py-3" style={{ minWidth: "260px" }}>
              <PinIcon />
              <input
                type="text"
                placeholder="City or zip code"
                value={searchLoc}
                onChange={handleLocationInputChange}
                onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
                className="border-none outline-none bg-transparent font-sans text-[14px] text-ink w-full placeholder:text-muted"
              />
              <button
                type="button"
                onClick={locateMe}
                title="Use my current location"
                disabled={locatingUser}
                className="shrink-0 text-muted hover:text-accent transition-colors disabled:opacity-60"
              >
                {locatingUser ? <SpinnerIcon /> : <PinIcon />}
              </button>
            </div>
            <button onClick={runSearch} className="bg-accent text-white px-6 text-[13.5px] font-medium hover:opacity-90 transition-opacity shrink-0">
              Search
            </button>
          </div>

          {locationError && <p className="text-[11.5px] text-error mt-2">{locationError}</p>}
          {userCoords && !locationError && (
            <p className="text-[11.5px] text-accent mt-2">Showing distances from your current location.</p>
          )}

          {/* Filters */}
          <div className="flex items-center gap-2.5 flex-wrap mt-3.5" ref={dropdownRef}>
            <RadioFilterDropdown
              name="employmentType"
              label="Employment type" options={EMPLOYMENT_OPTIONS}
              isOpen={openDropdown === "employmentType"} isActive={isFilterActive("employmentType")}
              selectedValue={filters.employmentType} dropdownRef={dropdownRef}
              onToggle={() => toggleDropdown("employmentType")} onSelect={(val) => setFilter("employmentType", val)}
            />
            <RadioFilterDropdown
              name="distance"
              label="Distance" options={DISTANCE_OPTIONS}
              isOpen={openDropdown === "distance"} isActive={isFilterActive("distance")}
              selectedValue={filters.distance} dropdownRef={dropdownRef}
              onToggle={() => toggleDropdown("distance")} onSelect={(val) => setFilter("distance", val)}
            />
            <div className="w-px h-4.5 bg-line mx-0.5" />
            <RadioFilterDropdown
              name="datePosted"
              label="Date posted" options={DATE_OPTIONS}
              isOpen={openDropdown === "datePosted"} isActive={isFilterActive("datePosted")}
              selectedValue={filters.datePosted} dropdownRef={dropdownRef}
              onToggle={() => toggleDropdown("datePosted")} onSelect={(val) => setFilter("datePosted", val)}
            />
            <MultiFilterDropdown
              label="Work type" options={WORK_OPTIONS}
              isOpen={openDropdown === "workType"} isActive={workTypes.length > 0}
              selectedValues={workTypes} dropdownRef={dropdownRef}
              onToggle={() => toggleDropdown("workType")} onToggleOption={toggleWorkType}
            />

            {/* Salary dropdown */}
            <div className="relative" ref={openDropdown === "salary" ? dropdownRef : undefined}>
              <button
                type="button"
                onClick={() => toggleDropdown("salary")}
                className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-full text-[12.5px] font-medium transition-all ${
                  salaryMin !== 40 || salaryMax !== 140
                    ? "bg-accent-soft border-accent text-accent"
                    : "bg-surface border-line text-ink-soft hover:border-ink-soft"
                }`}
              >
                Salary <ChevronIcon />
              </button>
              {openDropdown === "salary" && (
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
          <span className="text-[12.5px] text-muted">{filteredJobs.length} results</span>
        </div>

        {/* ── Split shell ── */}
        <div className="grid border border-line rounded-[10px] overflow-hidden bg-surface" style={{ gridTemplateColumns: "290px 1fr" }}>

          {/* Left list */}
          <div className="bg-paper border-r border-line p-2.5 max-h-[640px] overflow-y-auto">
            {filteredJobs.length === 0 && (
              <p className="text-[12.5px] text-muted px-3.5 py-6 text-center">No jobs match your filters.</p>
            )}
            {filteredJobs.map((job) => (
              <div key={job.id} onClick={() => setSelectedId(job.id)}
                className={`px-3.5 py-3 rounded-md cursor-pointer mb-0.5 border-l-[3px] transition-colors ${
                  selectedJob?.id === job.id
                    ? "bg-accent-soft border-l-accent"
                    : "border-l-transparent hover:bg-black/[0.02]"
                }`}>
                <p className={`text-[13.5px] font-semibold m-0 mb-0.5 ${selectedJob?.id === job.id ? "text-accent" : "text-ink"}`}>{job.title}</p>
                <p className="text-[12px] text-muted m-0">
                  {job.company} · {job.setting === "Remote" ? "Remote" : `${jobDistanceMiles(job).toFixed(1)} mi`} · {job.match}% match
                </p>
              </div>
            ))}
          </div>

          {/* Right detail */}
          {selectedJob ? (
            <JobDetail job={selectedJob} distanceLabel={selectedJob.setting === "Remote" ? "Remote" : `${jobDistanceMiles(selectedJob).toFixed(1)} mi`} />
          ) : (
            <div className="flex items-center justify-center p-8 text-[13.5px] text-muted">
              Try adjusting your filters to see more roles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobDetail({ job, distanceLabel }: { job: Job; distanceLabel: string }) {
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
          { k: "Distance", v: distanceLabel },
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
