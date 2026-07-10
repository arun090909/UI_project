export type SkillMatch = { skill: string; matched: boolean; source: string };

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  distance: string;
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
    distance: "2.3 mi",
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
    distance: "5.1 mi",
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
    distance: "9.8 mi",
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
];

export const calendarEvents: CalendarEvent[] = [
  { id: "dfw-tech-career-fair", title: "DFW tech career fair", date: "Sat, Jul 18", distance: "0.8 mi" },
  { id: "product-design-meetup", title: "Product design meetup", date: "Tue, Jul 21", distance: "4.6 mi" },
];
