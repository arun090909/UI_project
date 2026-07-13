"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { applicants } from "../../components/data";
import { DetailDialog } from "../../components/DetailDialog";
import { Field, SelectField, TextAreaField } from "../../components/FormControls";
import { PortalShell } from "../../components/PortalShell";
import { createJobPosting } from "../../lib/api";
import { useLocalStorageState } from "../../lib/useLocalStorageState";

const STORAGE_KEY = "waypoint.employer.postedJobs";

type PostedJob = {
  id: string;
  jobId: string;
  title: string;
  workType: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: string[];
  description: string;
  applicationDeadline?: string;
  resumeRequired: true;
  status: "Published";
  postedOn: string;
  applicants: number;
  reviewed: number;
  interviewing: number;
};

export default function JobsDashboard() {
  const [jobs, setJobs] = useLocalStorageState<PostedJob[]>(STORAGE_KEY, []);
  const [editingJob, setEditingJob] = useState<PostedJob | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [detailType, setDetailType] = useState<"posting" | "openings" | "applicants" | null>(null);
  const [selectedResume, setSelectedResume] = useState<(typeof applicants)[number] | null>(null);
  const selected = jobs[selectedIndex] ?? null;

  function handleSave(job: PostedJob) {
    setJobs((current) => {
      const existingIndex = current.findIndex((item) => item.id === job.id);
      if (existingIndex === -1) {
        setSelectedIndex(0);
        return [job, ...current];
      }

      const next = [...current];
      next[existingIndex] = job;
      setSelectedIndex(existingIndex);
      return next;
    });
    setEditingJob(null);
  }

  return (
    <PortalShell active="Job Posting">
      <main className="dashboard-layout">
        <section className="dashboard-header">
          <div>
            <h1>Job Posting Dashboard</h1>
            <p>Meridian Labs</p>
          </div>
          <button className="primary-action compact" onClick={() => setEditingJob(createEmptyJob())} type="button">
            + New posting
          </button>
        </section>

        <section className="stat-grid" aria-label="Posting summary">
          <button className="stat-card clickable-card" onClick={() => setDetailType("openings")} type="button">
            <span className="mini-icon">J</span>
            <div>
              <strong>{jobs.length}</strong>
              <span>Open postings</span>
            </div>
          </button>
          <button className="stat-card clickable-card" onClick={() => setDetailType("applicants")} type="button">
            <span className="mini-icon">A</span>
            <div>
              <strong>{jobs.reduce((total, job) => total + job.applicants, 0)}</strong>
              <span>New applicants</span>
            </div>
          </button>
        </section>

        <div className="jobs-grid">
          <aside className="posting-list" aria-label="Your postings">
            <h2>Your postings</h2>
            {jobs.length === 0 ? (
              <div className="empty-state">
                <strong>No job postings yet</strong>
                <small>Click New posting to publish your first role.</small>
              </div>
            ) : (
              jobs.map((job, index) => (
                <button
                  className={index === selectedIndex ? "posting-item active" : "posting-item"}
                  key={job.id}
                  onClick={() => {
                    setSelectedIndex(index);
                    setDetailType("posting");
                  }}
                  type="button"
                >
                  <span className="mini-icon">B</span>
                  <span>
                    <strong>{job.title}</strong>
                    <small>{job.location} · {job.employmentType}</small>
                  </span>
                </button>
              ))
            )}
          </aside>

          {selected ? (
            <section className="job-detail" aria-labelledby="selected-job-title">
              <header>
                <div>
                  <h2 id="selected-job-title">{selected.title}</h2>
                  <p>{selected.status}</p>
                </div>
                <button className="secondary-action" onClick={() => setEditingJob(selected)} type="button">
                  Edit
                </button>
              </header>

              <dl className="job-meta">
                <div>
                  <dt>Job ID</dt>
                  <dd>{selected.jobId}</dd>
                </div>
                <div>
                  <dt>Work type</dt>
                  <dd>{selected.workType}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{selected.location}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{selected.employmentType}</dd>
                </div>
                <div>
                  <dt>Salary</dt>
                  <dd>{formatSalary(selected)}</dd>
                </div>
                <div>
                  <dt>Posted</dt>
                  <dd>{selected.postedOn}</dd>
                </div>
              </dl>

              <div className="pipeline" aria-label="Applicant pipeline">
                <span style={{ width: "48%" }}>Applied ({selected.applicants})</span>
                <span style={{ width: "28%" }}>Reviewed ({selected.reviewed})</span>
                <span style={{ width: "24%" }}>Interviewing ({selected.interviewing})</span>
              </div>

              {selected.applicants > 0 ? (
                <div className="applicant-table">
                  {applicants.map((applicant) => (
                    <article className="applicant-row" key={applicant.name}>
                      <span className="avatar small">{applicant.initials}</span>
                      <div>
                        <strong>{applicant.name}</strong>
                        <small>{applicant.role}</small>
                      </div>
                      <button className="resume resume-link" onClick={() => setSelectedResume(applicant)} type="button">
                        Open resume
                      </button>
                      <span className={`status-chip ${applicant.stage.toLowerCase()}`}>{applicant.stage}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state inline">
                  <strong>No applicants yet</strong>
                  <small>Applicants will appear here after candidates apply to this posting.</small>
                </div>
              )}
            </section>
          ) : (
            <section className="job-detail empty-detail">
              <h2>No posting selected</h2>
              <p>Published jobs will appear here after you create them.</p>
            </section>
          )}
        </div>
      </main>

      {editingJob ? (
        <PostingModal
          initialJob={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleSave}
        />
      ) : null}
      {detailType ? (
        <JobDetailDialog
          detailType={detailType}
          jobs={jobs}
          onClose={() => setDetailType(null)}
          onEdit={(job) => {
            setDetailType(null);
            setEditingJob(job);
          }}
          selected={selected}
        />
      ) : null}
      {selectedResume ? (
        <DetailDialog
          title={`${selectedResume.name} Resume`}
          subtitle={selectedResume.role}
          onClose={() => setSelectedResume(null)}
          items={[
            { label: "Candidate", value: selectedResume.name },
            { label: "Resume file", value: `${selectedResume.name.replaceAll(" ", "-").toLowerCase()}-resume.pdf` },
            { label: "Skills", value: "React, TypeScript, API integration" },
            { label: "Experience", value: "3+ years relevant experience" },
            { label: "Status", value: "Resume attached and required" },
          ]}
        />
      ) : null}
    </PortalShell>
  );
}

function JobDetailDialog({
  detailType,
  jobs,
  selected,
  onClose,
  onEdit,
}: {
  detailType: "posting" | "openings" | "applicants";
  jobs: PostedJob[];
  selected: PostedJob | null;
  onClose: () => void;
  onEdit: (job: PostedJob) => void;
}) {
  if (detailType === "posting" && selected) {
    return (
      <div className="modal-backdrop detail-backdrop" role="presentation">
        <section className="modal-card detail-card" role="dialog" aria-modal="true" aria-labelledby="job-detail-title">
          <header>
            <div>
              <h2 id="job-detail-title">{selected.title}</h2>
              <p>{selected.location} · {selected.employmentType}</p>
            </div>
            <button className="ghost-button" onClick={onClose} type="button" aria-label="Close details">x</button>
          </header>
          <dl className="detail-list">
            {[
              { label: "Job ID", value: selected.jobId },
              { label: "Work Type", value: selected.workType },
              { label: "Status", value: selected.status },
              { label: "Salary", value: formatSalary(selected) },
              { label: "Required Skills", value: selected.requiredSkills.join(", ") || "Not provided" },
              { label: "Next Action", value: "Edit this posting when role details change" },
            ].map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <footer className="detail-actions">
            <button className="secondary-action" onClick={() => onEdit(selected)} type="button">Edit posting</button>
          </footer>
        </section>
      </div>
    );
  }

  if (detailType === "posting") {
    return null;
  }

  const summaries = {
    openings: {
      title: "Open postings",
      subtitle: "Jobs you published",
      items: [
        { label: "Published", value: jobs.length },
        { label: "Most recent", value: jobs[0]?.title ?? "No postings yet" },
        { label: "Resume required", value: "All postings" },
      ],
    },
    applicants: {
      title: "New applicants",
      subtitle: "Candidate activity from your posted jobs",
      items: [
        { label: "Total applicants", value: jobs.reduce((total, job) => total + job.applicants, 0) },
        { label: "Reviewed", value: jobs.reduce((total, job) => total + job.reviewed, 0) },
        { label: "Interviewing", value: jobs.reduce((total, job) => total + job.interviewing, 0) },
      ],
    },
  }[detailType];

  return <DetailDialog {...summaries} onClose={onClose} />;
}

function PostingModal({
  initialJob,
  onClose,
  onSave,
}: {
  initialJob: PostedJob;
  onClose: () => void;
  onSave: (job: PostedJob) => void;
}) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditingExisting = Boolean(initialJob.postedOn);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const salaryMin = parseOptionalNumber(form.get("salaryMin"));
    const salaryMax = parseOptionalNumber(form.get("salaryMax"));
    const job: PostedJob = {
      ...initialJob,
      jobId: String(form.get("jobId") ?? ""),
      title: String(form.get("title") ?? ""),
      workType: String(form.get("workType") ?? ""),
      location: String(form.get("location") ?? ""),
      employmentType: String(form.get("employmentType") ?? ""),
      experienceLevel: String(form.get("experienceLevel") ?? ""),
      salaryMin,
      salaryMax,
      requiredSkills: String(form.get("requiredSkills") ?? "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      description: String(form.get("description") ?? ""),
      applicationDeadline: String(form.get("applicationDeadline") ?? "") || undefined,
      resumeRequired: true,
      status: "Published",
      postedOn: initialJob.postedOn || formatToday(),
    };

    onSave(job);

    try {
      await createJobPosting({
        jobId: job.jobId,
        title: job.title,
        workType: job.workType,
        location: job.location,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        requiredSkills: job.requiredSkills,
        description: job.description,
        applicationDeadline: job.applicationDeadline,
        resumeRequired: true,
      });
    } catch (caught) {
      if (!isDevelopmentApiError(caught)) {
        setError(caught instanceof Error ? caught.message : "Unable to sync posting with backend.");
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="posting-modal-title">
        <header>
          <h2 id="posting-modal-title">{isEditingExisting ? "Edit Posting" : "New Posting"}</h2>
          <button className="ghost-button" onClick={onClose} type="button" aria-label="Close modal">x</button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Field label="Job ID *" name="jobId" placeholder="e.g. JOB-1024" required defaultValue={initialJob.jobId} />
            <Field label="Job title *" name="title" placeholder="e.g. Senior Frontend Engineer" required defaultValue={initialJob.title} />
            <SelectField label="Work Type *" name="workType" required defaultValue={initialJob.workType}>
              <option value="">Select work type</option>
              <option>Hybrid</option>
              <option>Onsite</option>
              <option>Fully Remote</option>
            </SelectField>
            <Field label="Location *" name="location" placeholder="e.g. Irving, TX" required defaultValue={initialJob.location} />
            <SelectField label="Employment type *" name="employmentType" required defaultValue={initialJob.employmentType}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </SelectField>
            <SelectField label="Experience level *" name="experienceLevel" required defaultValue={initialJob.experienceLevel}>
              <option value="">Select level</option>
              <option>Entry</option>
              <option>Mid</option>
              <option>Senior</option>
            </SelectField>
            <Field label="Salary min" name="salaryMin" placeholder="e.g. 80000" defaultValue={initialJob.salaryMin ?? ""} />
            <Field label="Salary max" name="salaryMax" placeholder="e.g. 120000" defaultValue={initialJob.salaryMax ?? ""} />
            <Field label="Required skills" name="requiredSkills" placeholder="React, TypeScript, REST APIs" defaultValue={initialJob.requiredSkills.join(", ")} />
          </div>
          <TextAreaField
            label="Description *"
            name="description"
            placeholder="Describe the role, responsibilities, and qualifications."
            required
            defaultValue={initialJob.description}
          />
          <div className="form-grid">
            <Field label="Application deadline" name="applicationDeadline" type="date" defaultValue={initialJob.applicationDeadline ?? ""} />
            <div className="required-note">
              <strong>Resume required</strong>
              <span>Every applicant must attach a resume before applying.</span>
            </div>
          </div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <footer className="modal-actions">
            <button className="ghost-button" onClick={onClose} type="button">Cancel</button>
            <button className="primary-action compact" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : isEditingExisting ? "Save changes" : "Publish posting"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function createEmptyJob(): PostedJob {
  return {
    id: crypto.randomUUID(),
    jobId: "",
    title: "",
    workType: "",
    location: "",
    employmentType: "Full-time",
    experienceLevel: "",
    requiredSkills: [],
    description: "",
    resumeRequired: true,
    status: "Published",
    postedOn: "",
    applicants: 0,
    reviewed: 0,
    interviewing: 0,
  };
}

function formatSalary(job: PostedJob) {
  if (!job.salaryMin && !job.salaryMax) {
    return "Not provided";
  }

  return `$${job.salaryMin?.toLocaleString() ?? "0"}-$${job.salaryMax?.toLocaleString() ?? "0"}`;
}

function formatToday() {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date());
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const cleaned = String(value ?? "").replace(/[$,]/g, "").trim();
  return cleaned ? Number(cleaned) : undefined;
}

function isDevelopmentApiError(caught: unknown) {
  if (!(caught instanceof Error)) {
    return false;
  }

  return caught.message === "Failed to fetch" || caught.message.includes("401") || caught.message.includes("403");
}
