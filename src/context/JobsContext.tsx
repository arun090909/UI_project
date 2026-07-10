'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Job } from '@/types';

interface JobsContextValue {
  appliedJobs: Job[];
  applyToJob: (job: Job) => void;
}

const JobsContext = createContext<JobsContextValue | null>(null);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);

  function applyToJob(job: Job) {
    setAppliedJobs((prev) => (prev.some((j) => j.id === job.id) ? prev : [...prev, job]));
  }

  return (
    <JobsContext.Provider value={{ appliedJobs, applyToJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used inside JobsProvider');
  return ctx;
}
