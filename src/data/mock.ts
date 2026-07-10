import { User, Event, ActivityItem } from '@/types';

export const mockUser: User = {
  id: 'u1',
  firstName: 'Jordan',
  lastName: 'Torres',
  email: 'jordan.torres@mail.com',
  phone: '(469) 555-0134',
  location: 'Irving, TX 75062',
  initials: 'JT',
  role: 'employee',
};

export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'DFW tech career fair',
    host: 'Meridian Labs',
    format: 'in-person',
    type: 'Career fair',
    date: 'Sat, Jul 18',
    time: '10:00 AM – 2:00 PM',
    registerBy: 'Jul 16, 11:59 PM',
    distance: '0.8 mi',
    capacity: { filled: 41, total: 60 },
    about:
      'An open career fair connecting Meridian Labs with engineering, design, and product talent across the Dallas–Fort Worth area. Registered attendees get priority scheduling for on-the-spot interviews and a resume review desk. Bring printed copies of your resume if you can — reviewers annotate on paper.',
    agenda: [
      { time: '10:00 AM', title: 'Doors open & check-in', detail: 'Badge pickup at the north lobby desk' },
      { time: '10:30 AM', title: 'Employer booths open', detail: 'Engineering, design, and product teams on the main floor' },
      { time: '12:00 PM', title: 'Lightning talks', detail: '15-minute sessions on hiring at Meridian Labs' },
      { time: '1:00 PM', title: 'On-the-spot interviews', detail: 'Priority slots for registered attendees' },
    ],
    eligibility: [
      'Open to students and professionals with 0–5 years of experience',
      'Located in Texas — matches your profile address',
      'At least one skill in engineering, design, or product — matches your skills',
    ],
    venue: 'Meridian Labs, 2201 N MacArthur Blvd, Irving, TX 75062 — north lobby entrance',
    weatherNote: 'Saturday forecast: sunny and clear. Outdoor booths will be open on the terrace — check-in stays indoors.',
    weatherTemp: '91°F',
    isRegistered: true,
  },
  {
    id: 'e2',
    title: 'Product design meetup',
    host: 'Northbeam',
    format: 'in-person',
    type: 'Meetup',
    date: 'Tue, Jul 21',
    time: '6:00 PM – 8:30 PM',
    registerBy: 'Jul 20, 11:59 PM',
    distance: '4.6 mi',
    capacity: { filled: 18, total: 40 },
    about: 'A casual meetup for product designers and UX researchers in the DFW area. Share work, get feedback, and meet the Northbeam design team.',
    agenda: [
      { time: '6:00 PM', title: 'Doors open', detail: 'Networking and refreshments' },
      { time: '6:30 PM', title: 'Portfolio show & tell', detail: 'Bring your work — 5 minutes per presenter' },
      { time: '7:30 PM', title: 'Open Q&A', detail: 'Northbeam design leads answer questions' },
    ],
    eligibility: [
      'Open to all designers, researchers, and design-curious engineers',
      'Located in DFW area',
    ],
    venue: 'Northbeam Studio, 3800 Maple Ave, Dallas, TX 75219',
    isRegistered: false,
  },
  {
    id: 'e3',
    title: 'Frontend engineering info session',
    host: 'Meridian Labs',
    format: 'virtual',
    type: 'Info session',
    date: 'Wed, Jul 29',
    time: '12:00 PM – 1:00 PM',
    registerBy: 'Jul 28, 11:59 PM',
    capacity: { filled: 72, total: 150 },
    about: 'A live Q&A session with Meridian Labs engineering leads about their frontend stack, hiring process, and team culture. Open to all experience levels.',
    agenda: [
      { time: '12:00 PM', title: 'Intro & team overview', detail: 'Who we are and what we build' },
      { time: '12:20 PM', title: 'Tech stack deep dive', detail: 'React, TypeScript, and our design system' },
      { time: '12:45 PM', title: 'Open Q&A', detail: 'Ask anything — process, culture, comp' },
    ],
    eligibility: [
      'Open to all — no experience requirement',
      'Laptop or phone with video call access required',
    ],
    isRegistered: false,
  },
  {
    id: 'e4',
    title: 'Resume & interview prep webinar',
    host: 'Waypoint',
    format: 'virtual',
    type: 'Webinar',
    date: 'Thu, Jul 30',
    time: '5:00 PM – 6:30 PM',
    registerBy: 'Jul 29, 11:59 PM',
    capacity: { filled: 34, total: 200 },
    about: 'A Waypoint-hosted workshop covering resume writing, LinkedIn optimization, and interview preparation. Led by career coaches with hiring manager experience.',
    agenda: [
      { time: '5:00 PM', title: 'Resume essentials', detail: 'What recruiters actually read first' },
      { time: '5:30 PM', title: 'Interview frameworks', detail: 'STAR method and common question patterns' },
      { time: '6:00 PM', title: 'Live mock Q&A', detail: 'Volunteers get real-time feedback' },
    ],
    eligibility: ['Open to all Waypoint members', 'Any experience level welcome'],
    isRegistered: true,
  },
  {
    id: 'e5',
    title: 'Fall internship open house',
    host: 'Ferrous',
    format: 'in-person',
    type: 'Info session',
    date: 'Thu, Aug 6',
    time: '2:00 PM – 5:00 PM',
    registerBy: 'Aug 4, 11:59 PM',
    distance: '6.2 mi',
    capacity: { filled: 11, total: 30 },
    about: 'Ferrous is hiring fall interns in software engineering and manufacturing operations. Come meet the team, tour the facility, and apply on the spot.',
    agenda: [
      { time: '2:00 PM', title: 'Welcome & facility tour', detail: 'See the manufacturing floor and engineering labs' },
      { time: '3:00 PM', title: 'Intern panel', detail: 'Current interns share their experience' },
      { time: '4:00 PM', title: 'On-site applications', detail: 'Apply and interview same day' },
    ],
    eligibility: [
      'Open to undergraduate and graduate students',
      'Engineering, CS, or operations background preferred',
      'Located in Texas — matches your profile address',
    ],
    venue: 'Ferrous HQ, 400 N Henderson St, Fort Worth, TX 76107',
    isRegistered: false,
  },
];

export const mockActivity: ActivityItem[] = [
  { id: 'a1', type: 'application', title: 'Applied to Senior frontend engineer', meta: 'Meridian Labs', date: 'Jul 6' },
  { id: 'a2', type: 'event', title: 'Registered for DFW tech career fair', meta: 'Sat, Jul 18', date: 'Jul 3' },
  { id: 'a3', type: 'profile', title: 'Updated skills on profile', meta: 'Added React, TypeScript', date: 'Jun 29' },
];

export const mockSkills = ['React', 'JavaScript', 'TypeScript', 'Java', 'Spring Boot', 'MongoDB', 'Tailwind', 'Git'];

export const mockInterestedRoles = ['Software developer', 'UI / UX designer', 'QA / Testing'];

export const mockPreferences = {
  salaryRange: '$55,000 – $75,000',
  employmentType: 'Full-time, Contract',
  searchRadius: 'Within 10 mi',
};

export const mockStats = {
  newMatchesThisWeek: 6,
  applicationsInReview: 3,
  upcomingEventsNearby: 2,
};
