import { projectCards } from "../constants";
import styles from "../DonateExperience.module.css";

export default function DonateProjectsSection() {
  return (
    <section className={styles.projects} id="projects">
      <div data-donate-reveal="true" className={styles.reveal}>
        <span className={styles.sectionEyebrow}>Our Active Projects</span>
        <h2 className={styles.sectionTitle}>Programs Your Donation Funds</h2>
        <p className={styles.sectionSub}>
          Every contribution you make directly supports one of our four flagship programs - each designed for maximum community impact.
        </p>
      </div>

      <div className={styles.projectsGrid}>
        {projectCards.map((project) => (
          <article key={project.title} data-donate-reveal="true" className={`${styles.projectCard} ${styles.reveal}`}>
            <div className={styles.projectIcon}>{project.icon}</div>
            <div>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDesc}>{project.description}</p>
              <div className={styles.projectMeta}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.projectTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
