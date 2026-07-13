import { PortalShell } from "../../components/PortalShell";

export default function EmployerHomePage() {
  return (
    <PortalShell active="Home">
      <main className="dashboard-layout">
        <section className="not-found-panel" aria-labelledby="home-not-found-title">
          <p className="eyebrow">Merged from another team</p>
          <h1 id="home-not-found-title">Page not found</h1>
          <p>
            The Home page is not available in this employer portal build. Use
            Job Posting or Events Scheduling from the menu.
          </p>
        </section>
      </main>
    </PortalShell>
  );
}
