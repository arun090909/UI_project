"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { saveProfile, emailExists, markJustRegistered } from "@/lib/profile";
import { US_STATES, zipMatchesState } from "@/lib/address";

const ROLE_OPTIONS = [
  "Software developer", "QA / Testing", "Data analyst", "UI / UX designer",
  "Retail & sales", "Warehouse & logistics", "Healthcare", "Admin & office",
];

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const SKILL_SUGGESTIONS = [
  // Software & IT
  "Java", "Python", "JavaScript", "TypeScript", "Spring Boot", "React", "Angular",
  "Node.js", "MongoDB", "SQL", "PostgreSQL", "AWS", "Azure", "Docker", "Kubernetes",
  "Git", "REST APIs", "CI/CD", "Data analysis", "Machine learning",
  // Healthcare
  "CPR certified", "Patient care", "Phlebotomy", "Medical billing", "EHR/EMR systems",
  "Nursing", "Clinical documentation", "First aid",
  // Retail & sales
  "Customer service", "Sales", "Cash handling", "Point of sale (POS)", "Merchandising",
  "Inventory management", "Upselling", "Cold calling",
  // Warehouse & logistics
  "Forklift certified", "Inventory control", "Shipping & receiving", "Supply chain",
  "OSHA certified", "Pallet jack operation", "Warehouse management systems (WMS)",
  // Admin & office
  "Microsoft Excel", "Microsoft Office", "Data entry", "Scheduling", "Bookkeeping",
  "Payroll", "Office administration", "Written communication",
  // Skilled trades
  "Electrical wiring", "Plumbing", "HVAC", "Welding", "Carpentry", "CDL license",
  // Hospitality & food service
  "Food safety certified", "Barista", "Bartending", "Housekeeping", "Event planning",
  // Marketing & design
  "Social media marketing", "SEO", "Graphic design", "Adobe Photoshop", "Content writing",
  // Finance & education
  "Accounting", "Financial analysis", "QuickBooks", "Teaching", "Curriculum development",
];

const LOCATION_SUGGESTIONS = [
  "Birmingham, AL", "Anchorage, AK", "Phoenix, AZ", "Little Rock, AR",
  "Los Angeles, CA", "San Francisco, CA", "San Diego, CA", "Denver, CO",
  "Hartford, CT", "Wilmington, DE", "Washington, DC", "Miami, FL", "Orlando, FL",
  "Tampa, FL", "Atlanta, GA", "Honolulu, HI", "Boise, ID", "Chicago, IL",
  "Indianapolis, IN", "Des Moines, IA", "Wichita, KS", "Louisville, KY",
  "New Orleans, LA", "Portland, ME", "Baltimore, MD", "Boston, MA", "Detroit, MI",
  "Minneapolis, MN", "Jackson, MS", "Kansas City, MO", "Billings, MT",
  "Omaha, NE", "Las Vegas, NV", "Manchester, NH", "Newark, NJ", "Jersey City, NJ",
  "Albuquerque, NM", "New York, NY", "Brooklyn, NY", "Buffalo, NY",
  "Charlotte, NC", "Raleigh, NC", "Fargo, ND", "Columbus, OH", "Cleveland, OH",
  "Oklahoma City, OK", "Portland, OR", "Philadelphia, PA", "Pittsburgh, PA",
  "Providence, RI", "Charleston, SC", "Sioux Falls, SD", "Nashville, TN",
  "Memphis, TN", "Irving, TX", "Dallas, TX", "Plano, TX", "Fort Worth, TX",
  "Arlington, TX", "Frisco, TX", "McKinney, TX", "Denton, TX", "Garland, TX",
  "Grapevine, TX", "Austin, TX", "Houston, TX", "San Antonio, TX",
  "Salt Lake City, UT", "Burlington, VT", "Richmond, VA", "Virginia Beach, VA",
  "Seattle, WA", "Spokane, WA", "Charleston, WV", "Milwaukee, WI",
  "Cheyenne, WY", "Remote",
];

type FormData = {
  firstName: string; lastName: string; email: string; phone: string;
  password: string; confirmPassword: string;
  street: string; city: string; state: string; zip: string;
  salaryMin: string; salaryMax: string;
};

type Errors = Partial<Record<keyof FormData | "skills" | "roles" | "zipMismatch", boolean>>;

function passwordStrength(pw: string): { label: string; pct: number; barColor: string; textColor: string } {
  if (!pw) return { label: "", pct: 0, barColor: "", textColor: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (pw.length < 8 || score <= 1) return { label: "Weak", pct: 33, barColor: "bg-error", textColor: "text-error" };
  if (score <= 3) return { label: "Medium", pct: 66, barColor: "bg-amber", textColor: "text-amber" };
  return { label: "Strong", pct: 100, barColor: "bg-accent", textColor: "text-accent" };
}

function inputCls(hasError?: boolean) {
  return `w-full px-3.5 py-[11px] border rounded-md text-[14px] font-sans text-ink bg-surface outline-none transition-colors focus:border-accent ${
    hasError ? "border-error" : "border-line"
  }`;
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="mb-3.5 pb-2 border-b border-line">
        <h3 className="font-serif text-[15.5px] font-medium m-0">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FieldWrap({
  label, required, error, errorMsg, children, colSpan,
}: {
  label: string; required?: boolean; error?: boolean;
  errorMsg?: string; children: React.ReactNode; colSpan?: boolean;
}) {
  return (
    <div className={`mb-0.5 ${colSpan ? "col-span-2" : ""}`}>
      <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
      {error && errorMsg && (
        <p className="text-[11.5px] text-error mt-1.5">{errorMsg}</p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [invalidSkillAttempt, setInvalidSkillAttempt] = useState(false);

  const [locations, setLocations] = useState<string[]>([]);
  const [locInput, setLocInput] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    password: "", confirmPassword: "",
    street: "", city: "", state: "", zip: "",
    salaryMin: "", salaryMax: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showFormError, setShowFormError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  function getInitials() {
    const f = form.firstName.trim()[0] ?? "";
    const l = form.lastName.trim()[0] ?? "";
    return (f + l).toUpperCase() || "?";
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  // Only known skills (case-insensitive exact match) may be added — free-form
  // text is rejected so junk/invalid entries can't slip into the list.
  function addSkill(v: string) {
    v = v.trim();
    if (!v) return;
    const match = SKILL_SUGGESTIONS.find((s) => s.toLowerCase() === v.toLowerCase());
    if (!match || skills.map((s) => s.toLowerCase()).includes(match.toLowerCase())) {
      setInvalidSkillAttempt(true);
      return;
    }
    setSkills((prev) => [...prev, match]);
    setInvalidSkillAttempt(false);
  }

  const filteredSkillSuggestions = (() => {
    const query = skillInput.trim().toLowerCase();
    if (!query) return [];
    return SKILL_SUGGESTIONS
      .filter((s) =>
        s.toLowerCase().includes(query) &&
        !skills.map((k) => k.toLowerCase()).includes(s.toLowerCase())
      )
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(query) ? 0 : 1;
        const bStarts = b.toLowerCase().startsWith(query) ? 0 : 1;
        return aStarts !== bStarts ? aStarts - bStarts : a.localeCompare(b);
      });
  })();

  function handleSkillKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
      if (SKILL_SUGGESTIONS.some((s) => s.toLowerCase() === skillInput.trim().toLowerCase())) {
        setSkillInput("");
      }
    }
    if (e.key === "Backspace" && !skillInput && skills.length) {
      setSkills((prev) => prev.slice(0, -1));
    }
  }

  function addLocation(v: string) {
    v = v.trim();
    if (!v || locations.length >= 3 || locations.map((s) => s.toLowerCase()).includes(v.toLowerCase())) return;
    setLocations((prev) => [...prev, v]);
  }

  const filteredLocationSuggestions = locInput.trim()
    ? LOCATION_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(locInput.trim().toLowerCase()) &&
        !locations.map((l) => l.toLowerCase()).includes(s.toLowerCase())
      ).slice(0, 8)
    : [];

  function handleLocKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addLocation(locInput);
      setLocInput("");
    }
    if (e.key === "Backspace" && !locInput && locations.length) {
      setLocations((prev) => prev.slice(0, -1));
    }
  }

  function toggleRole(r: string) {
    setSelectedRoles((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  }

  function toggleType(t: string) {
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  function setField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const e: Errors = {};
    let taken = false;
    if (!form.firstName.trim()) e.firstName = true;
    if (!form.lastName.trim()) e.lastName = true;
    if (!form.email.trim() || !form.email.includes("@")) {
      e.email = true;
    } else if (emailExists(form.email)) {
      e.email = true;
      taken = true;
    }
    setEmailTaken(taken);
    if (!form.phone.trim()) e.phone = true;
    if (form.password.length < 8) e.password = true;
    if (!form.confirmPassword || form.confirmPassword !== form.password) e.confirmPassword = true;
    if (!form.street.trim()) e.street = true;
    if (!form.city.trim()) e.city = true;
    if (!form.state) e.state = true;
    if (!/^\d{5}$/.test(form.zip)) {
      e.zip = true;
    } else if (form.state && !zipMatchesState(form.zip, form.state)) {
      e.zip = true;
      e.zipMismatch = true;
    }
    if (skills.length < 3) e.skills = true;
    if (selectedRoles.length === 0) e.roles = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) {
      setShowFormError(true);
      setTimeout(() => {
        document.querySelector("[data-haserror='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    saveProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      avatarSrc,
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state,
      zip: form.zip,
      locations,
      skills,
      roles: selectedRoles,
    });
    markJustRegistered();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <div className="text-center">
          <svg className="w-14 h-14 mx-auto mb-5" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8.5" fill="none" stroke="#1D4B3D" strokeWidth="1.3" />
            <circle cx="10" cy="10" r="3" fill="#1D4B3D" />
          </svg>
          <h1 className="font-serif text-2xl font-medium mb-2 tracking-[-0.01em]">Account created</h1>
          <p className="text-[13.5px] text-muted max-w-sm mx-auto leading-relaxed mb-6">
            Welcome to Waypoint. Your matches are being prepared — upload your resume from the dashboard to sharpen them further.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-accent text-white px-6 py-3 rounded-md text-[13.5px] font-medium hover:opacity-90 transition-opacity"
          >
            Go to dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex items-start justify-center py-8 px-6">
      <div className="w-full max-w-[1020px] bg-surface border border-line rounded-xl overflow-hidden shadow-[0_24px_60px_rgba(23,27,30,0.08)]">
        <div className="grid min-h-[640px]" style={{ gridTemplateColumns: "340px 1fr" }}>

          {/* ── Left visual panel ── */}
          <div className="hidden md:flex flex-col bg-ink text-white p-11 relative overflow-hidden">
            <div className="absolute -right-[70px] -bottom-[70px] w-[220px] h-[220px] rounded-full border border-white/[0.08]" />
            <div className="absolute -right-[14px] -bottom-[14px] w-[120px] h-[120px] rounded-full border border-white/[0.08]" />

            <div className="flex items-center gap-2.5 relative z-10">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8.5" fill="none" stroke="#fff" strokeWidth="1.3" />
                <circle cx="10" cy="10" r="3" fill="#fff" />
              </svg>
              <span className="font-serif font-medium text-xl tracking-[-0.01em]">Waypoint</span>
            </div>

            <h2 className="font-serif font-medium text-[25px] leading-[1.34] mt-10 mb-8 tracking-[-0.01em] relative z-10">
              Tell us what you do. We&apos;ll find what&apos;s nearby.
            </h2>

            <div className="flex flex-col gap-5 relative z-10">
              {[
                { val: "2.3 mi", lbl: "avg. match distance" },
                { val: "92%", lbl: "top skill fit" },
                { val: "41", lbl: "registered this week" },
              ].map(({ val, lbl }) => (
                <div key={lbl}>
                  <p className="font-mono text-lg text-white m-0 mb-0.5">{val}</p>
                  <p className="text-[11px] text-[#8B9089] uppercase tracking-[0.05em] m-0">{lbl}</p>
                </div>
              ))}
            </div>

            <p className="text-[12.5px] text-[#B7BDB8] leading-relaxed mt-auto relative z-10 max-w-[260px]">
              One account, two portals. Employers post once; employees see only what&apos;s relevant to their skills and their zip code.
            </p>
          </div>

          {/* ── Right form panel ── */}
          <div className="p-11 overflow-y-auto" style={{ paddingRight: "52px", paddingBottom: "48px" }}>
            <h1 className="font-serif text-[23px] font-medium mb-1.5 tracking-[-0.01em]">Create your account</h1>
            <p className="text-[13.5px] text-muted mb-5">Four quick sections, and your matches start working.</p>

            {showFormError && (
              <div className="bg-error-soft text-error text-[13px] rounded-md px-3.5 py-2.5 mb-4">
                A few required fields still need attention — they&apos;re marked below.
              </div>
            )}

            {/* ── Profile picture ── */}
            <SectionBlock title="Profile picture">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center font-serif text-xl font-medium shrink-0 overflow-hidden">
                  {avatarSrc
                    ? <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                    : getInitials()}
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="self-start text-[12.5px] font-medium px-4 py-2 rounded-md border border-line bg-surface text-ink hover:border-ink-soft transition-colors"
                  >
                    Add photo
                  </button>
                  <p className="text-[11.5px] text-muted leading-snug">Optional — a photo helps employers recognize you at events. JPG or PNG, up to 5 MB.</p>
                  <input ref={avatarInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleAvatarChange} />
                </div>
              </div>
            </SectionBlock>

            {/* ── Personal info ── */}
            <SectionBlock title="Personal info">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                <FieldWrap label="First name" required error={errors.firstName} errorMsg="Enter your first name.">
                  <div data-haserror={errors.firstName ? "true" : "false"}>
                    <input type="text" placeholder="Priya" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} className={inputCls(errors.firstName)} />
                  </div>
                </FieldWrap>
                <FieldWrap label="Last name" required error={errors.lastName} errorMsg="Enter your last name.">
                  <input type="text" placeholder="Sharma" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} className={inputCls(errors.lastName)} />
                </FieldWrap>
                <FieldWrap
                  label="Email" required error={errors.email}
                  errorMsg={emailTaken ? "An account with this email already exists." : "Enter a valid email."}
                >
                  <input
                    type="email" placeholder="name@company.com" value={form.email}
                    onChange={(e) => { setField("email", e.target.value); setEmailTaken(false); }}
                    className={inputCls(errors.email)}
                  />
                </FieldWrap>
                <FieldWrap label="Phone" required error={errors.phone} errorMsg="Enter a phone number.">
                  <input type="tel" placeholder="(469) 555-0134" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className={inputCls(errors.phone)} />
                </FieldWrap>
                <FieldWrap label="Password" required error={errors.password} errorMsg="Password needs at least 8 characters.">
                  <input type="password" placeholder="8+ characters" value={form.password} onChange={(e) => setField("password", e.target.value)} className={inputCls(errors.password)} />
                  <div className="mt-1.5">
                    <p className="text-[11.5px] text-muted leading-snug">Minimum 8 characters.</p>
                    {form.password && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 rounded-full bg-line overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${passwordStrength(form.password).barColor}`}
                            style={{ width: `${passwordStrength(form.password).pct}%` }}
                          />
                        </div>
                        <span className={`text-[11.5px] font-medium ${passwordStrength(form.password).textColor}`}>
                          {passwordStrength(form.password).label}
                        </span>
                      </div>
                    )}
                  </div>
                </FieldWrap>
                <FieldWrap label="Re-enter password" required error={errors.confirmPassword} errorMsg="Passwords don't match.">
                  <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} className={inputCls(errors.confirmPassword)} />
                </FieldWrap>
              </div>
            </SectionBlock>

            {/* ── Address ── */}
            <SectionBlock title="Address">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                <FieldWrap label="Street address" required error={errors.street} errorMsg="Enter your street address." colSpan>
                  <input type="text" placeholder="2201 N MacArthur Blvd" value={form.street} onChange={(e) => setField("street", e.target.value)} className={inputCls(errors.street)} />
                </FieldWrap>
                <FieldWrap label="City" required error={errors.city} errorMsg="Enter your city.">
                  <input type="text" placeholder="Irving" value={form.city} onChange={(e) => setField("city", e.target.value)} className={inputCls(errors.city)} />
                </FieldWrap>
                <FieldWrap label="State" required error={errors.state} errorMsg="Select your state.">
                  <select value={form.state} onChange={(e) => setField("state", e.target.value)} className={inputCls(errors.state)}>
                    {US_STATES.map((s, i) => (
                      <option key={i} value={s}>{s === "" ? "Select state" : s}</option>
                    ))}
                  </select>
                </FieldWrap>
                <FieldWrap
                  label="ZIP code" required error={errors.zip}
                  errorMsg={errors.zipMismatch ? "This ZIP code doesn't match the selected state." : "Enter a 5-digit ZIP."}
                >
                  <input type="text" placeholder="75062" maxLength={5} value={form.zip} onChange={(e) => setField("zip", e.target.value)} className={inputCls(errors.zip)} />
                </FieldWrap>
              </div>
            </SectionBlock>

            {/* ── Preferred locations ── */}
            <SectionBlock title="Preferred locations">
              <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">Top 3 preferred locations</label>
              <div
                className="flex flex-wrap gap-1.5 p-2.5 border border-line rounded-md bg-surface cursor-text focus-within:border-accent transition-colors"
                onClick={() => document.getElementById("locInput")?.focus()}
              >
                {locations.map((loc, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-accent-soft text-accent text-[12.5px] font-medium px-2.5 py-1.5 rounded-full">
                    {loc}
                    <button type="button" onClick={(e) => { e.stopPropagation(); setLocations((p) => p.filter((_, j) => j !== i)); }} className="font-bold opacity-65 hover:opacity-100 leading-none">×</button>
                  </span>
                ))}
                <input
                  id="locInput"
                  type="text"
                  value={locInput}
                  onChange={(e) => { setLocInput(e.target.value); setShowLocationSuggestions(true); }}
                  onKeyDown={handleLocKey}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 120)}
                  placeholder={locations.length >= 3 ? "Limit reached — remove one to add another" : "Type a city, any state (up to 3)"}
                  disabled={locations.length >= 3}
                  className="border-none outline-none flex-1 min-w-[180px] text-[13.5px] bg-transparent text-ink py-1 disabled:cursor-not-allowed"
                />
              </div>
              {showLocationSuggestions && locations.length < 3 && filteredLocationSuggestions.length > 0 && (
                <div className="mt-1.5 border border-line rounded-md bg-surface overflow-hidden">
                  {filteredLocationSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { addLocation(s); setLocInput(""); }}
                      className="w-full text-left px-3.5 py-2 text-[13px] text-ink hover:bg-accent-soft hover:text-accent transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11.5px] text-muted mt-1.5">Optional — jobs in these cities are boosted in your matches alongside your home address. Start typing to search cities across every state.</p>
            </SectionBlock>

            {/* ── Skills ── */}
            <SectionBlock title="Skills">
              <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">
                Add at least 3 skills <span className="text-error">*</span>
              </label>
              <div
                className={`flex flex-wrap gap-1.5 p-2.5 border rounded-md bg-surface cursor-text focus-within:border-accent transition-colors ${errors.skills ? "border-error" : "border-line"}`}
                onClick={() => document.getElementById("skillInput")?.focus()}
              >
                {skills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-accent-soft text-accent text-[12.5px] font-medium px-2.5 py-1.5 rounded-full">
                    {skill}
                    <button type="button" onClick={(e) => { e.stopPropagation(); setSkills((p) => p.filter((_, j) => j !== i)); }} className="font-bold opacity-65 hover:opacity-100 leading-none">×</button>
                  </span>
                ))}
                <input
                  id="skillInput"
                  type="text"
                  value={skillInput}
                  onChange={(e) => { setSkillInput(e.target.value); setShowSkillSuggestions(true); setInvalidSkillAttempt(false); }}
                  onKeyDown={handleSkillKey}
                  onFocus={() => setShowSkillSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 120)}
                  placeholder="Type a skill and press Enter"
                  className="border-none outline-none flex-1 min-w-[180px] text-[13.5px] bg-transparent text-ink py-1"
                />
              </div>
              {errors.skills && <p className="text-[11.5px] text-error mt-1.5">Add at least 3 skills so matching can work.</p>}
              {invalidSkillAttempt && (
                <p className="text-[11.5px] text-error mt-1.5">
                  &ldquo;{skillInput.trim()}&rdquo; isn&apos;t a recognized skill — pick one from the suggestions below.
                </p>
              )}
              {showSkillSuggestions && filteredSkillSuggestions.length > 0 && (
                <div className="mt-1.5 border border-line rounded-md bg-surface overflow-y-auto max-h-[240px]">
                  {filteredSkillSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { addSkill(s); setSkillInput(""); }}
                      className="w-full text-left px-3.5 py-2 text-[13px] text-ink hover:bg-accent-soft hover:text-accent transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </SectionBlock>

            {/* ── Interested roles ── */}
            <SectionBlock title="Interested roles">
              <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">
                Pick one or more <span className="text-error">*</span>
              </label>
              <div className={`flex flex-wrap gap-2 ${errors.roles ? "outline outline-1 outline-error outline-offset-4 rounded-md" : ""}`}>
                {ROLE_OPTIONS.map((role) => (
                  <button key={role} type="button" onClick={() => toggleRole(role)}
                    className={`text-[13px] font-medium border px-4 py-2 rounded-full select-none transition-all ${
                      selectedRoles.includes(role)
                        ? "bg-accent border-accent text-white"
                        : "bg-surface border-line text-ink-soft hover:border-accent hover:text-accent"
                    }`}>
                    {role}
                  </button>
                ))}
              </div>
              {errors.roles && <p className="text-[11.5px] text-error mt-1.5">Select at least one role you&apos;re interested in.</p>}
            </SectionBlock>

            {/* ── Salary range ── */}
            <SectionBlock title="Salary range">
              <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">Expected annual salary</label>
              <div className="grid items-center gap-2.5 max-w-[420px]" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[13.5px]">$</span>
                  <input type="text" inputMode="numeric" placeholder="45,000" value={form.salaryMin}
                    onChange={(e) => setField("salaryMin", e.target.value.replace(/[^0-9,]/g, ""))}
                    className="w-full pl-6 pr-3 py-[11px] border border-line rounded-md text-[14px] text-ink bg-surface outline-none focus:border-accent transition-colors" />
                </div>
                <span className="text-muted text-[13px]">to</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[13.5px]">$</span>
                  <input type="text" inputMode="numeric" placeholder="65,000" value={form.salaryMax}
                    onChange={(e) => setField("salaryMax", e.target.value.replace(/[^0-9,]/g, ""))}
                    className="w-full pl-6 pr-3 py-[11px] border border-line rounded-md text-[14px] text-ink bg-surface outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              <p className="text-[11.5px] text-muted mt-1.5">Only jobs inside your range get boosted in your matches.</p>
            </SectionBlock>

            {/* ── Employment type ── */}
            <SectionBlock title="Preferred employment type">
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_TYPES.map((type) => (
                  <button key={type} type="button" onClick={() => toggleType(type)}
                    className={`text-[13px] font-medium border px-4 py-2 rounded-full select-none transition-all ${
                      selectedTypes.includes(type)
                        ? "bg-accent border-accent text-white"
                        : "bg-surface border-line text-ink-soft hover:border-accent hover:text-accent"
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </SectionBlock>

            {/* ── Submit ── */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-[13px] text-[13.5px] font-medium rounded-md border border-accent bg-accent text-white hover:opacity-90 transition-opacity mt-1.5"
            >
              Create account
            </button>

            <p className="text-[12.5px] text-muted text-center mt-4">
              Already have an account?{" "}
              <Link href="#" className="text-ink font-medium no-underline hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
