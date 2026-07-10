"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { STAGES, type Applicant, type Stage } from "@/lib/data";
import {
  fetchApplicants,
  openResume,
  scheduleCall,
  updateStage,
  UnauthorizedError,
} from "@/lib/api";
import { clearAuth, getToken, getUser } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { ApplicantRow } from "@/components/ApplicantRow";
import { CandidateDetail } from "@/components/CandidateDetail";
import { ScheduleCallModal } from "@/components/ScheduleCallModal";
import { LoginForm } from "@/components/LoginForm";

type Tab = "All" | Stage;
const TABS: Tab[] = ["All", ...STAGES];

export default function ApplicantsPage() {
  // null = auth state not yet determined (avoids SSR/localStorage hydration mismatch)
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>("All");
  const [posting, setPosting] = useState<string>("All postings");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    // Client-only init after mount — localStorage is unavailable during SSR, so reading it in
    // an effect (rather than during render) is what avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthed(Boolean(getToken()));
    setUsername(getUser());
  }, []);

  const handleLogout = useCallback(() => {
    clearAuth();
    setAuthed(false);
    setUsername(null);
    setApplicants([]);
    setSelectedId(null);
  }, []);

  const guard = useCallback(
    (err: unknown) => {
      if (err instanceof UnauthorizedError) {
        handleLogout();
        return true;
      }
      return false;
    },
    [handleLogout],
  );

  useEffect(() => {
    if (authed !== true) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchApplicants()
      .then((data) => {
        setApplicants(data);
        setSelectedId((current) => current ?? data[0]?.id ?? null);
      })
      .catch((err) => {
        if (!guard(err)) setError("Couldn't reach the Waypoint API. Is the backend running on :8081?");
      })
      .finally(() => setLoading(false));
  }, [authed, guard]);

  const postings = useMemo(
    () => Array.from(new Set(applicants.map((a) => a.posting))),
    [applicants],
  );

  const visible = useMemo(
    () =>
      applicants.filter(
        (a) =>
          (tab === "All" || a.stage === tab) &&
          (posting === "All postings" || a.posting === posting),
      ),
    [applicants, tab, posting],
  );

  const selected = applicants.find((a) => a.id === selectedId) ?? null;

  const applyUpdate = (updated: Applicant) =>
    setApplicants((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

  const handleMoveToSelected = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      applyUpdate(await updateStage(selected.id, "Selected"));
    } catch (err) {
      if (!guard(err)) setError("Failed to update stage.");
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmCall = async (callTime: string) => {
    if (!selected) return;
    setBusy(true);
    try {
      applyUpdate(await scheduleCall(selected.id, callTime));
      setScheduling(false);
    } catch (err) {
      if (!guard(err)) setError("Failed to schedule call.");
    } finally {
      setBusy(false);
    }
  };

  const handleViewResume = async () => {
    if (!selected) return;
    try {
      await openResume(selected.id);
    } catch (err) {
      if (!guard(err)) setError("Failed to open resume.");
    }
  };

  if (authed === null) return null;
  if (authed === false) {
    return (
      <LoginForm
        onSuccess={(name) => {
          setUsername(name);
          setError(null);
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-full">
      <Navbar username={username ?? undefined} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <a href="#" className="text-sm text-muted transition hover:text-ink">
          ← Back to profile
        </a>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-ink">Applicants</h1>
            <p className="mt-1 text-muted">All candidates across your postings</p>
          </div>
          <select
            value={posting}
            onChange={(e) => setPosting(e.target.value)}
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink shadow-sm"
          >
            <option>All postings</option>
            {postings.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex flex-wrap gap-1 rounded-lg border border-line bg-surface p-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                tab === t ? "bg-cream text-forest" : "text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
            {error}
          </p>
        )}

        <div className="mt-6 max-h-[26rem] overflow-y-auto rounded-xl border border-line bg-surface shadow-sm">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-muted">Loading applicants…</p>
          ) : visible.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">
              No applicants match this filter.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {visible.map((a) => (
                <li key={a.id}>
                  <ApplicantRow
                    applicant={a}
                    selected={a.id === selectedId}
                    onSelect={() => setSelectedId(a.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected && (
          <div className="mt-6">
            <CandidateDetail
              applicant={selected}
              busy={busy}
              onViewResume={handleViewResume}
              onMoveToSelected={handleMoveToSelected}
              onScheduleCall={() => setScheduling(true)}
            />
          </div>
        )}
      </main>

      {scheduling && selected && (
        <ScheduleCallModal
          applicantName={selected.name}
          reschedule={Boolean(selected.callTime)}
          busy={busy}
          onCancel={() => setScheduling(false)}
          onConfirm={handleConfirmCall}
        />
      )}
    </div>
  );
}
