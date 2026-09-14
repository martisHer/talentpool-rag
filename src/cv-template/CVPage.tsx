import React from "react";
import type { Candidate } from "../types";

type CVPageProps = {
  candidate: Candidate;
  photoPath: string;
};

export function CVPage({
  candidate,
  photoPath,
}: CVPageProps) {
  return (
    <div className="cv">
      <header className="cv-header">
        <div>
          <h1>{candidate.name}</h1>

          <p className="cv-role">
            {candidate.role}
          </p>

          <p className="cv-location">
            {candidate.location}
          </p>
        </div>

        <img
          src={photoPath}
          alt={candidate.name}
          className="cv-photo"
        />
      </header>

      <div className="cv-contact">
        <span>{candidate.email}</span>
        <span>{candidate.phone}</span>
        <span>{candidate.linkedin}</span>
      </div>

      <main className="cv-content">
        <section>
          <h2>Profile</h2>

          <p>{candidate.summary}</p>
        </section>

        <section>
          <h2>Experience</h2>

          {candidate.experience.map(
            (experience, index) => (
              <article
                className="experience"
                key={`${experience.company}-${index}`}
              >
                <div className="experience-header">
                  <div>
                    <h3>
                      {experience.role}
                    </h3>

                    <p className="company">
                      {experience.company}
                    </p>
                  </div>

                  <span className="dates">
                    {experience.start} –{" "}
                    {experience.end}
                  </span>
                </div>

                <ul>
                  {experience.description.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </article>
            )
          )}
        </section>

        <section>
          <h2>Education</h2>

          {candidate.education.map(
            (education, index) => (
              <article
                className="education"
                key={`${education.university}-${index}`}
              >
                <h3>
                  {education.degree}
                </h3>

                <p>
                  {education.university}
                </p>

                <span className="dates">
                  {education.start} –{" "}
                  {education.end}
                </span>
              </article>
            )
          )}
        </section>

        <section>
          <h2>Skills</h2>

          <div className="skills">
            {candidate.skills.map((skill) => (
              <span
                className="skill"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2>Languages</h2>

          <div className="languages">
            {candidate.languages.map(
              (language) => (
                <div
                  className="language"
                  key={language.name}
                >
                  <strong>
                    {language.name}
                  </strong>

                  <span>
                    {language.level}
                  </span>
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}