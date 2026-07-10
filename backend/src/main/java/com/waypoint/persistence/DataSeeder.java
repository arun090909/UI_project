package com.waypoint.persistence;

import com.waypoint.model.Stage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the applicant table and a demo login on first startup only (when empty). Because the
 * data now lives in PostgreSQL, edits made through the API survive restarts and are not
 * overwritten here.
 */
@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {

    private final ApplicantJpaRepository repository;
    private final UserJpaRepository users;
    private final PasswordEncoder passwordEncoder;
    private final String demoUsername;
    private final String demoPassword;

    public DataSeeder(ApplicantJpaRepository repository,
                      UserJpaRepository users,
                      PasswordEncoder passwordEncoder,
                      @Value("${app.demo-user.username}") String demoUsername,
                      @Value("${app.demo-user.password}") String demoPassword) {
        this.repository = repository;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.demoUsername = demoUsername;
        this.demoPassword = demoPassword;
    }

    @Override
    public void run(String... args) {
        seedUser();
        seedApplicants();
    }

    private void seedUser() {
        if (users.count() > 0) {
            return;
        }
        users.save(new UserEntity(demoUsername, passwordEncoder.encode(demoPassword), "RECRUITER"));
    }

    private void seedApplicants() {
        if (repository.count() > 0) {
            return;
        }
        repository.saveAll(List.of(
                new ApplicantEntity("riya-kapoor", "Riya Kapoor", "Senior frontend engineer", "Jul 2",
                        Stage.CALL_SCHEDULED, "RiyaKapoor_Resume.pdf", 92, "Jul 12, 2:00 PM", 0,
                        new ReviewEmbeddable(5, "Strong React and TypeScript background, clean portfolio, mentored two juniors at previous role.", "Priya Nandan, Hiring Manager")),
                new ApplicantEntity("derek-morales", "Derek Morales", "Senior frontend engineer", "Jul 3",
                        Stage.REVIEWED, "DerekMorales_Resume.pdf", 81, null, 1,
                        new ReviewEmbeddable(4, "Solid component architecture experience; portfolio leans on older class components.", "Priya Nandan, Hiring Manager")),
                new ApplicantEntity("nadia-silva", "Nadia Silva", "Senior frontend engineer", "Jul 3",
                        Stage.APPLIED, "NadiaSilva_Resume.pdf", 76, null, 2, null),
                new ApplicantEntity("ethan-kim", "Ethan Kim", "Senior frontend engineer", "Jul 4",
                        Stage.APPLIED, "EthanKim_Resume.pdf", 68, null, 3, null),
                new ApplicantEntity("olivia-vance", "Olivia Vance", "Senior frontend engineer", "Jul 5",
                        Stage.SELECTED, "OliviaVance_Resume.pdf", 95, "Jul 9, 11:00 AM", 4,
                        new ReviewEmbeddable(5, "Exceptional systems thinking, led a design-system rollout across four teams.", "Priya Nandan, Hiring Manager")),
                new ApplicantEntity("ana-ferreira", "Ana Ferreira", "Backend engineer, payments", "Jul 4",
                        Stage.APPLIED, "AnaFerreira_Resume.pdf", 79, null, 5, null),
                new ApplicantEntity("tomas-wu", "Tomás Wu", "Backend engineer, payments", "Jul 5",
                        Stage.REVIEWED, "TomasWu_Resume.pdf", 84, null, 6,
                        new ReviewEmbeddable(4, "Good grasp of idempotent payment flows; wants more distributed-systems depth.", "Marcus Bell, Eng Lead")),
                new ApplicantEntity("marcus-hale", "Marcus Hale", "Backend engineer, payments", "Jul 6",
                        Stage.CALL_SCHEDULED, "MarcusHale_Resume.pdf", 88, "Jul 13, 10:30 AM", 7,
                        new ReviewEmbeddable(4, "Ran ledger reconciliation at scale; strong on correctness and observability.", "Marcus Bell, Eng Lead")),
                new ApplicantEntity("priya-ghosh", "Priya Ghosh", "Backend engineer, payments", "Jul 6",
                        Stage.APPLIED, "PriyaGhosh_Resume.pdf", 72, null, 8, null)));
    }
}
