export type SkillMatch = { skill: string; matched: boolean; source: string };

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  lat: number;
  lng: number;
  distance: string;
  postedDaysAgo: number;
  setting: string;
  type: string;
  salary: string;
  match: number;
  applyBy: string;
  about: string;
  requirements: string[];
  skills: string[];
  userSkillMatch: SkillMatch[];
  companyAbout: string;
  industry: string;
  companySize: string;
  founded: string;
  headquarters: string;
  benefits: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  distance: string;
};

export const jobs: Job[] = [
  {
    id: "senior-frontend-engineer",
    title: "Senior frontend engineer",
    company: "Meridian Labs",
    location: "Irving, TX",
    lat: 32.8140,
    lng: -96.9489,
    distance: "2.3 mi",
    postedDaysAgo: 1,
    setting: "On-site",
    type: "Full-time",
    salary: "$68,000 – $84,000",
    match: 92,
    applyBy: "Jul 25",
    about:
      "Meridian Labs is looking for a senior frontend engineer to lead development of their customer-facing dashboard. Strong React and TypeScript experience required, along with a track record of mentoring junior engineers.",
    requirements: [
      "4+ years building production React applications",
      "Strong TypeScript and component architecture skills",
      "Experience integrating REST APIs and handling auth flows",
      "Comfort with CSS layout and styling",
      "Based within commuting distance of Irving, TX (on-site role)",
    ],
    skills: ["React", "TypeScript", "CSS", "REST APIs"],
    userSkillMatch: [
      { skill: "React", matched: true, source: "on your resume" },
      { skill: "TypeScript", matched: true, source: "on your resume" },
      { skill: "REST APIs", matched: true, source: "on your resume" },
      { skill: "CSS", matched: false, source: "not listed — mention it below if you have it" },
    ],
    companyAbout:
      "Meridian Labs builds logistics-tracking software used by 140 warehouses across Texas. Founded in 2019 and headquartered in Irving, the company has grown to 62 people — including a 14-person engineering team split across frontend, backend, and data. Engineering works on-site four days a week with Fridays flexible.",
    industry: "Logistics software",
    companySize: "62 employees",
    founded: "2019",
    headquarters: "Irving, TX",
    benefits:
      "health, dental, and vision coverage · 401(k) with 4% match · 18 days PTO · annual learning budget. Hiring process: resume review within 5 days → 30-minute intro call → technical interview on-site → offer. Most candidates hear back at every stage within a week.",
  },
  {
    id: "product-designer",
    title: "Product designer",
    company: "Northbeam",
    location: "Dallas, TX",
    lat: 32.7767,
    lng: -96.7970,
    distance: "5.1 mi",
    postedDaysAgo: 4,
    setting: "Hybrid",
    type: "Full-time",
    salary: "$72,000 – $92,000",
    match: 87,
    applyBy: "Jul 30",
    about:
      "Northbeam is looking for a product designer to shape the UX of their analytics platform. You will work closely with engineering and product teams to deliver elegant, data-dense interfaces.",
    requirements: [
      "3+ years of product design experience",
      "Proficiency in Figma",
      "Experience designing for data-heavy applications",
      "Strong visual and interaction design fundamentals",
    ],
    skills: ["Figma", "UX research", "Prototyping", "Visual design"],
    userSkillMatch: [
      { skill: "Figma", matched: true, source: "on your resume" },
      { skill: "UX research", matched: true, source: "on your resume" },
      { skill: "Prototyping", matched: false, source: "not listed — mention it below if you have it" },
      { skill: "Visual design", matched: true, source: "on your resume" },
    ],
    companyAbout:
      "Northbeam is a marketing analytics platform trusted by over 1,000 DTC brands. Their design team of 6 works cross-functionally with product and engineering.",
    industry: "Marketing analytics",
    companySize: "85 employees",
    founded: "2020",
    headquarters: "Dallas, TX",
    benefits:
      "health and dental · unlimited PTO · $2,000 annual equipment budget · remote Fridays.",
  },
  {
    id: "backend-engineer-payments",
    title: "Backend engineer, payments",
    company: "Ferrous",
    location: "Fort Worth, TX",
    lat: 32.7555,
    lng: -97.3308,
    distance: "9.8 mi",
    postedDaysAgo: 10,
    setting: "On-site",
    type: "Full-time",
    salary: "$80,000 – $110,000",
    match: 74,
    applyBy: "Aug 5",
    about:
      "Ferrous is building next-generation payment infrastructure. We are looking for a backend engineer who can design and implement reliable, high-throughput payment flows at scale.",
    requirements: [
      "4+ years of backend engineering experience",
      "Experience with Java or Go",
      "Understanding of financial systems and compliance requirements",
      "Familiarity with distributed systems and message queues",
    ],
    skills: ["Java", "Distributed systems", "SQL", "Message queues"],
    userSkillMatch: [
      { skill: "Java", matched: true, source: "on your resume" },
      { skill: "SQL", matched: true, source: "on your resume" },
      { skill: "Distributed systems", matched: false, source: "not listed — mention it below" },
      { skill: "Message queues", matched: false, source: "not listed — mention it below" },
    ],
    companyAbout:
      "Ferrous is a Fort Worth-based fintech company focused on B2B payment rails. Founded in 2021, the company has processed over $2B in transactions.",
    industry: "Fintech",
    companySize: "40 employees",
    founded: "2021",
    headquarters: "Fort Worth, TX",
    benefits:
      "full health coverage · 401(k) · 20 days PTO · remote-optional after 6 months.",
  },
  {
    id: "customer-support-specialist",
    title: "Customer support specialist",
    company: "Northbeam",
    location: "Remote",
    lat: 32.7767,
    lng: -96.7970,
    distance: "Remote",
    postedDaysAgo: 2,
    setting: "Remote",
    type: "Part-time",
    salary: "$38,000 – $48,000",
    match: 65,
    applyBy: "Jul 28",
    about:
      "Northbeam is hiring a remote customer support specialist to help DTC brand customers get the most out of the analytics platform via chat and email.",
    requirements: [
      "1+ years in a customer support or service role",
      "Clear written communication",
      "Comfort learning a technical product",
      "Reliable internet connection for remote work",
    ],
    skills: ["Customer service", "Written communication"],
    userSkillMatch: [
      { skill: "Customer service", matched: true, source: "on your resume" },
      { skill: "Written communication", matched: false, source: "not listed — mention it below" },
    ],
    companyAbout:
      "Northbeam is a marketing analytics platform trusted by over 1,000 DTC brands. Their support team works fully remote across US time zones.",
    industry: "Marketing analytics",
    companySize: "85 employees",
    founded: "2020",
    headquarters: "Dallas, TX",
    benefits:
      "health and dental · unlimited PTO · fully remote · $500 home office stipend.",
  },
  {
    id: "warehouse-associate",
    title: "Warehouse associate",
    company: "Meridian Labs",
    location: "Plano, TX",
    lat: 33.0198,
    lng: -96.6989,
    distance: "12.4 mi",
    postedDaysAgo: 1,
    setting: "On-site",
    type: "Full-time",
    salary: "$36,000 – $42,000",
    match: 58,
    applyBy: "Jul 22",
    about:
      "Meridian Labs is hiring a warehouse associate to support pick, pack, and ship operations at their Plano fulfillment site. Forklift certification is a plus but not required — training provided.",
    requirements: [
      "Comfortable lifting up to 50 lbs repeatedly",
      "Reliable attendance for scheduled shifts",
      "Basic inventory scanning experience preferred",
      "Forklift certification a plus",
    ],
    skills: ["Inventory control", "Shipping & receiving", "Forklift certified"],
    userSkillMatch: [
      { skill: "Inventory control", matched: false, source: "not listed — mention it below" },
      { skill: "Shipping & receiving", matched: false, source: "not listed — mention it below" },
      { skill: "Forklift certified", matched: false, source: "not listed — mention it below" },
    ],
    companyAbout:
      "Meridian Labs builds logistics-tracking software used by 140 warehouses across Texas, and runs its own fulfillment site in Plano to pilot the tools it sells.",
    industry: "Logistics software",
    companySize: "62 employees",
    founded: "2019",
    headquarters: "Irving, TX",
    benefits:
      "health coverage after 60 days · paid overtime · shift differential for nights.",
  },
  {
    id: "registered-nurse",
    title: "Registered nurse",
    company: "Lakeview Health Partners",
    location: "Arlington, TX",
    lat: 32.7357,
    lng: -97.1081,
    distance: "14.1 mi",
    postedDaysAgo: 3,
    setting: "On-site",
    type: "Full-time",
    salary: "$70,000 – $92,000",
    match: 70,
    applyBy: "Aug 1",
    about:
      "Lakeview Health Partners is seeking a registered nurse for its outpatient clinic in Arlington, providing direct patient care and coordinating with physicians on treatment plans.",
    requirements: [
      "Active RN license in Texas",
      "2+ years of clinical experience",
      "BLS/CPR certification",
      "Strong patient communication skills",
    ],
    skills: ["Patient care", "CPR certified", "Clinical documentation"],
    userSkillMatch: [
      { skill: "Patient care", matched: false, source: "not listed — mention it below" },
      { skill: "CPR certified", matched: false, source: "not listed — mention it below" },
      { skill: "Clinical documentation", matched: false, source: "not listed — mention it below" },
    ],
    companyAbout:
      "Lakeview Health Partners operates four outpatient clinics across the DFW metroplex, serving over 30,000 patients a year.",
    industry: "Healthcare",
    companySize: "210 employees",
    founded: "2011",
    headquarters: "Arlington, TX",
    benefits:
      "full health, dental, vision · 401(k) with match · tuition reimbursement · shift differentials.",
  },
  {
    id: "administrative-assistant",
    title: "Administrative assistant",
    company: "Ferrous",
    location: "Grapevine, TX",
    lat: 32.9343,
    lng: -97.0781,
    distance: "16.7 mi",
    postedDaysAgo: 6,
    setting: "On-site",
    type: "Part-time",
    salary: "$32,000 – $38,000",
    match: 61,
    applyBy: "Jul 29",
    about:
      "Ferrous is looking for a part-time administrative assistant to support scheduling, correspondence, and office operations for its Grapevine satellite office.",
    requirements: [
      "1+ years in an administrative or office support role",
      "Proficiency with Microsoft Office",
      "Strong organizational skills",
      "Comfortable managing multiple calendars",
    ],
    skills: ["Microsoft Office", "Scheduling", "Office administration"],
    userSkillMatch: [
      { skill: "Microsoft Office", matched: false, source: "not listed — mention it below" },
      { skill: "Scheduling", matched: false, source: "not listed — mention it below" },
      { skill: "Office administration", matched: false, source: "not listed — mention it below" },
    ],
    companyAbout:
      "Ferrous is a Fort Worth-based fintech company focused on B2B payment rails, with a small satellite office in Grapevine.",
    industry: "Fintech",
    companySize: "40 employees",
    founded: "2021",
    headquarters: "Fort Worth, TX",
    benefits:
      "flexible part-time schedule · paid holidays · casual dress code.",
  },
  {
    id: "marketing-manager",
    title: "Marketing manager",
    company: "Northbeam",
    location: "Dallas, TX",
    lat: 32.7767,
    lng: -96.7970,
    distance: "5.1 mi",
    postedDaysAgo: 5,
    setting: "Hybrid",
    type: "Contract",
    salary: "$60,000 – $78,000",
    match: 55,
    applyBy: "Aug 3",
    about:
      "Northbeam needs a contract marketing manager for a 6-month engagement to lead campaign strategy and content across paid and organic channels.",
    requirements: [
      "3+ years running B2B marketing campaigns",
      "Experience with SEO and content strategy",
      "Comfortable presenting results to leadership",
      "Available for a 6-month contract, hybrid in Dallas",
    ],
    skills: ["Social media marketing", "SEO", "Content writing"],
    userSkillMatch: [
      { skill: "Social media marketing", matched: false, source: "not listed — mention it below" },
      { skill: "SEO", matched: false, source: "not listed — mention it below" },
      { skill: "Content writing", matched: false, source: "not listed — mention it below" },
    ],
    companyAbout:
      "Northbeam is a marketing analytics platform trusted by over 1,000 DTC brands, with a small in-house marketing team supplemented by contractors.",
    industry: "Marketing analytics",
    companySize: "85 employees",
    founded: "2020",
    headquarters: "Dallas, TX",
    benefits:
      "contract rate paid biweekly · hybrid schedule (2 days on-site) · potential for extension.",
  },
  {
    id: "qa-engineer",
    title: "QA engineer",
    company: "Ferrous",
    location: "Remote",
    lat: 32.7555,
    lng: -97.3308,
    distance: "Remote",
    postedDaysAgo: 8,
    setting: "Remote",
    type: "Full-time",
    salary: "$64,000 – $80,000",
    match: 68,
    applyBy: "Aug 8",
    about:
      "Ferrous is hiring a remote QA engineer to build automated test coverage for its payment infrastructure and partner with engineering on release quality.",
    requirements: [
      "3+ years in software QA or test automation",
      "Experience with API testing tools",
      "Familiarity with CI/CD pipelines",
      "Strong written bug reports and documentation",
    ],
    skills: ["CI/CD", "REST APIs", "SQL"],
    userSkillMatch: [
      { skill: "CI/CD", matched: false, source: "not listed — mention it below" },
      { skill: "REST APIs", matched: true, source: "on your resume" },
      { skill: "SQL", matched: false, source: "not listed — mention it below" },
    ],
    companyAbout:
      "Ferrous is a Fort Worth-based fintech company focused on B2B payment rails. Founded in 2021, the company has processed over $2B in transactions.",
    industry: "Fintech",
    companySize: "40 employees",
    founded: "2021",
    headquarters: "Fort Worth, TX",
    benefits:
      "full health coverage · 401(k) · 20 days PTO · fully remote.",
  },
  {
    id: "electrician",
    title: "Electrician",
    company: "Lakeview Health Partners",
    location: "Denton, TX",
    lat: 33.2148,
    lng: -97.1331,
    distance: "28.3 mi",
    postedDaysAgo: 12,
    setting: "On-site",
    type: "Contract",
    salary: "$52,000 – $68,000",
    match: 40,
    applyBy: "Aug 12",
    about:
      "Lakeview Health Partners needs a licensed electrician on a contract basis to lead electrical buildout for a new clinic location in Denton.",
    requirements: [
      "Licensed journeyman or master electrician",
      "Commercial buildout experience",
      "Comfortable reading electrical blueprints",
      "Available for a 3-month on-site contract",
    ],
    skills: ["Electrical wiring", "OSHA certified"],
    userSkillMatch: [
      { skill: "Electrical wiring", matched: false, source: "not listed — mention it below" },
      { skill: "OSHA certified", matched: false, source: "not listed — mention it below" },
    ],
    companyAbout:
      "Lakeview Health Partners operates four outpatient clinics across the DFW metroplex, with a fifth location breaking ground in Denton.",
    industry: "Healthcare",
    companySize: "210 employees",
    founded: "2011",
    headquarters: "Arlington, TX",
    benefits:
      "contract rate paid weekly · on-site parking · potential for future maintenance work.",
  },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "dfw-tech-career-fair", title: "DFW tech career fair", date: "Sat, Jul 18", distance: "0.8 mi" },
  { id: "product-design-meetup", title: "Product design meetup", date: "Tue, Jul 21", distance: "4.6 mi" },
];
