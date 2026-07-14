"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Field, SelectField, TextAreaField } from "../components/FormControls";
import { registerEmployer } from "../lib/api";

const hiringAreas = ["Engineering", "Design", "Sales", "Operations", "Healthcare", "Logistics", "Admin", "Internships"];
const requiredFields = [
  ["Company name", "companyName"],
  ["Industry", "industry"],
  ["Company size", "companySize"],
  ["Founded", "founded"],
  ["First name", "firstName"],
  ["Last name", "lastName"],
  ["Work email", "workEmail"],
  ["Phone", "phone"],
  ["Password", "password"],
  ["Re-enter password", "confirmPassword"],
  ["City", "city"],
  ["State", "state"],
  ["Street address", "streetAddress"],
  ["ZIP code", "zipCode"],
] as const;

export default function CreateAccountPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    const city = String(form.get("city") ?? "").trim();
    const state = String(form.get("state") ?? "").trim();
    const streetAddress = String(form.get("streetAddress") ?? "").trim();
    const zipCode = String(form.get("zipCode") ?? "").trim();
    const missingFields = requiredFields
      .filter(([, name]) => !String(form.get(name) ?? "").trim())
      .map(([label]) => label);

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}.`);
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords must match.");
      setIsSubmitting(false);
      return;
    }

    const addressValidation = await validateAddress({
      city,
      state,
      streetAddress,
      zipCode,
    });

    if (!addressValidation.valid) {
      setError(addressValidation.message);
      setIsSubmitting(false);
      return;
    }

    const selectedHiringAreas = form.getAll("hiringAreas").map(String);

    try {
      await registerEmployer({
        companyName: String(form.get("companyName") ?? "").trim(),
        industry: String(form.get("industry") ?? "").trim(),
        companySize: String(form.get("companySize") ?? "").trim(),
        founded: String(form.get("founded") ?? "").trim() || undefined,
        firstName: String(form.get("firstName") ?? "").trim(),
        lastName: String(form.get("lastName") ?? "").trim(),
        workEmail: String(form.get("workEmail") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim(),
        password,
        city,
        streetAddress,
        zipCode,
        careersContactEmail: String(form.get("careersContactEmail") ?? "").trim() || undefined,
        website: String(form.get("website") ?? "").trim() || undefined,
        aboutCompany: String(form.get("aboutCompany") ?? "").trim() || undefined,
        hiringAreas: selectedHiringAreas,
      });
      router.push("/employer/jobs");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to create employer account.";
      setError(
        message === "Failed to fetch"
          ? "Backend is not running or cannot be reached. Start the Spring Boot backend on http://localhost:8080, then submit again."
          : message,
      );
      setIsSubmitting(false);
    }
  }

  return (
    <main className="signup-wrap account-reference-page">
      <section className="signup-card account-reference-card">
        <aside className="brand-panel account-reference-brand" aria-label="Waypoint employer benefits">
          <div>
            <Link className="logo" href="/employer-create-account">
              <span className="logo-mark" />
              <span>Waypoint</span>
            </Link>
            <h1>Reach the right candidates, not just more of them.</h1>
            <dl className="proof-list">
              <div>
                <dt>92%</dt>
                <dd>Avg. applicant skill fit</dd>
              </div>
              <div>
                <dt>2.3 mi</dt>
                <dd>Avg. candidate distance</dd>
              </div>
              <div>
                <dt>3 min</dt>
                <dd>To publish a posting</dd>
              </div>
            </dl>
            <p>Post once, meet qualified candidates nearby - and pair postings with local hiring events to shorten the path to a first conversation.</p>
          </div>
        </aside>

        <section className="account-form account-reference-form" aria-labelledby="create-account-title">
          <header>
            <h2 id="create-account-title">Create your account</h2>
            <p>Company details first - then post your first opening in minutes.</p>
          </header>

          <div className="role-toggle" role="tablist" aria-label="Account type">
            <button type="button">Employee</button>
            <button className="active" type="button">Employer</button>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>Company info</legend>
              <div className="form-grid">
                <Field label="Company name *" name="companyName" required />
                <SelectField label="Industry *" name="industry" required defaultValue="">
                  <option value="">Select industry</option>
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Education</option>
                  <option>Logistics</option>
                  <option>Retail</option>
                </SelectField>
                <SelectField label="Company size *" name="companySize" required defaultValue="">
                  <option value="">Select size</option>
                  <option>1-10</option>
                  <option>11-50</option>
                  <option>51-200</option>
                  <option>201-500</option>
                  <option>501+</option>
                </SelectField>
                <Field label="Founded *" name="founded" required />
              </div>
            </fieldset>

            <fieldset>
              <legend>Hiring contact</legend>
              <div className="form-grid">
                <Field label="First name *" name="firstName" required />
                <Field label="Last name *" name="lastName" required />
                <Field label="Work email *" name="workEmail" required type="email" />
                <Field label="Phone *" name="phone" required type="tel" />
                <Field label="Password *" name="password" required type="password" />
                <Field label="Re-enter password *" name="confirmPassword" required type="password" />
              </div>
              <p className="helper-copy">This person manages postings and applicants. You can add teammates later.</p>
            </fieldset>

            <fieldset>
              <legend>Company address</legend>
              <div className="form-grid address-grid account-address-grid">
                <Field label="City *" name="city" required />
                <SelectField label="State *" name="state" required defaultValue="">
                  <option value="">Select</option>
                  <option>TX</option>
                  <option>CA</option>
                  <option>NY</option>
                  <option>FL</option>
                  <option>IL</option>
                </SelectField>
                <Field label="Street address *" name="streetAddress" required />
                <Field label="ZIP code *" name="zipCode" required />
              </div>
              <p className="helper-copy">Used to place your postings and events for nearby candidates.</p>
            </fieldset>

            <fieldset>
              <legend>Careers details</legend>
              <div className="form-grid careers-grid">
                <Field label="Careers contact email" name="careersContactEmail" type="email" />
                <Field label="Website" name="website" />
                <TextAreaField label="About the company" name="aboutCompany" />
              </div>
              <p className="helper-copy">Shown to candidates on your postings.</p>
            </fieldset>

            <fieldset>
              <legend>Hiring for</legend>
              <div className="pill-group" role="group" aria-label="Hiring categories">
                {hiringAreas.map((area) => (
                  <label className="pill-option" key={area}>
                    <input name="hiringAreas" type="checkbox" value={area} />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
              <p className="helper-copy">Optional - helps us suggest event formats and candidate pools.</p>
            </fieldset>

            {error ? <p className="form-error" role="alert">{error}</p> : null}

            <button className="primary-action create-account-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating account..." : "Create employer account"}
            </button>
            <p className="signin-copy">
              Already have an account? <Link href="/employer/jobs">Sign in</Link>
            </p>
          </form>
        </section>
      </section>
    </main>
  );
}

async function validateAddress(address: {
  city: string;
  state: string;
  streetAddress: string;
  zipCode: string;
}): Promise<{ valid: boolean; message: string }> {
  try {
    const response = await fetch("/api/validate-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address),
    });
    const result = (await response.json().catch(() => null)) as { valid?: boolean; message?: string } | null;

    if (!response.ok || !result?.valid) {
      return {
        valid: false,
        message: result?.message ?? "City, state, ZIP code, and street address do not match.",
      };
    }

    return { valid: true, message: "" };
  } catch {
    return {
      valid: false,
      message: "Unable to validate the address right now. Check your connection and try again.",
    };
  }
}

