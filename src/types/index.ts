export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  initials: string;
  role: 'employee' | 'employer';
  avatarUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'applied' | 'review' | 'shortlisted' | 'rejected';
  note?: string;
  noteType?: 'info' | 'warn';
  trackStep: number; // 0=applied,1=review,2=shortlisted,3=decision
}

export interface Event {
  id: string;
  title: string;
  host: string;
  format: 'in-person' | 'virtual';
  type: string;
  date: string;
  time: string;
  registerBy: string;
  distance?: string;
  capacity: { filled: number; total: number };
  about: string;
  agenda: AgendaItem[];
  eligibility: string[];
  venue?: string;
  weatherNote?: string;
  weatherTemp?: string;
  isRegistered?: boolean;
}

export interface AgendaItem {
  time: string;
  title: string;
  detail: string;
}

export interface Skill {
  name: string;
}

export interface ActivityItem {
  id: string;
  type: 'application' | 'event' | 'profile';
  title: string;
  meta: string;
  date: string;
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}
