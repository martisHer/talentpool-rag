import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const jsonDirectory = path.join(
  process.cwd(),
  "generated",
  "json"
);

const photosDirectory = path.join(
  process.cwd(),
  "generated",
  "photos"
);

const pdfDirectory = path.join(
  process.cwd(),
  "generated",
  "pdfs"
);

fs.mkdirSync(pdfDirectory, {
  recursive: true,
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderCV(
  candidate: any,
  photoDataUrl: string
) {
  const experience = candidate.experience
    .map(
      (job: any) => `
        <article class="experience">
          <div class="experience-header">
            <div>
              <h3>${escapeHtml(job.role)}</h3>
              <p class="company">
                ${escapeHtml(job.company)}
              </p>
            </div>

            <span class="dates">
              ${escapeHtml(job.start)}
              –
              ${escapeHtml(job.end)}
            </span>
          </div>

          <ul>
            ${job.description
              .map(
                (item: string) =>
                  `<li>${escapeHtml(item)}</li>`
              )
              .join("")}
          </ul>
        </article>
      `
    )
    .join("");

  const education = candidate.education
    .map(
      (item: any) => `
        <article class="education">
          <h3>
            ${escapeHtml(item.degree)}
          </h3>

          <p>
            ${escapeHtml(item.university)}
          </p>

          <span class="dates">
            ${escapeHtml(item.start)}
            –
            ${escapeHtml(item.end)}
          </span>
        </article>
      `
    )
    .join("");

  const skills = candidate.skills
    .map(
      (skill: string) =>
        `<span class="skill">
          ${escapeHtml(skill)}
        </span>`
    )
    .join("");

  const languages = candidate.languages
    .map(
      (language: any) => `
        <div class="language">
          <strong>
            ${escapeHtml(language.name)}
          </strong>

          <span>
            ${escapeHtml(language.level)}
          </span>
        </div>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <style>
          * {
            box-sizing: border-box;
          }

          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            margin: 0;
            padding: 0;
          }

          body {
            font-family:
              Arial,
              Helvetica,
              sans-serif;

            color: #1f2937;
            background: white;
          }

          .cv {
            width: 210mm;
            min-height: 297mm;
            padding:
              18mm
              18mm
              16mm;

            background: white;
          }

          .cv-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            padding-bottom: 18px;

            border-bottom:
              2px solid #111827;
          }

          .cv-header h1 {
            margin: 0;

            font-size: 32px;
            line-height: 1.1;

            color: #111827;
          }

          .cv-role {
            margin:
              8px 0 4px;

            font-size: 17px;
            font-weight: 600;
          }

          .cv-location {
            margin: 0;

            font-size: 13px;
            color: #6b7280;
          }

          .cv-photo {
            width: 92px;
            height: 92px;

            object-fit: cover;

            border-radius: 50%;
          }

          .cv-contact {
            display: flex;
            gap: 18px;

            padding:
              12px
              0
              24px;

            font-size: 10px;
            color: #4b5563;

            border-bottom:
              1px solid #e5e7eb;
          }

          .cv-content {
            padding-top: 20px;
          }

          section {
            margin-bottom: 22px;
          }

          section h2 {
            margin:
              0
              0
              10px;

            font-size: 12px;

            text-transform:
              uppercase;

            letter-spacing:
              0.12em;

            color: #2563eb;
          }

          section p {
            margin: 0;

            font-size: 11px;
            line-height: 1.55;
          }

          .experience {
            margin-bottom: 17px;

            break-inside:
              avoid;
          }

          .experience-header {
            display: flex;
            justify-content:
              space-between;

            align-items:
              flex-start;
          }

          .experience h3,
          .education h3 {
            margin: 0;

            font-size: 13px;
            color: #111827;
          }

          .company {
            margin-top: 3px !important;

            font-weight: 600;

            color: #6b7280;
          }

          .dates {
            font-size: 10px;

            color: #6b7280;

            white-space:
              nowrap;
          }

          .experience ul {
            margin:
              7px
              0
              0;

            padding-left: 16px;
          }

          .experience li {
            margin-bottom: 4px;

            font-size: 10.5px;
            line-height: 1.45;
          }

          .education {
            margin-bottom: 12px;

            break-inside:
              avoid;
          }

          .education p {
            margin-top: 3px;

            color: #6b7280;
          }

          .education .dates {
            display: block;

            margin-top: 3px;
          }

          .skills {
            display: flex;
            flex-wrap: wrap;

            gap: 6px;
          }

          .skill {
            padding:
              5px
              9px;

            border:
              1px solid #d1d5db;

            border-radius:
              999px;

            font-size: 10px;
          }

          .languages {
            display: flex;

            gap: 25px;
          }

          .language {
            display: flex;

            gap: 7px;

            font-size: 10px;
          }

          .language span {
            color: #6b7280;
          }
        </style>
      </head>

      <body>
        <div class="cv">

          <header class="cv-header">

            <div>
              <h1>
                ${escapeHtml(candidate.name)}
              </h1>

              <p class="cv-role">
                ${escapeHtml(candidate.role)}
              </p>

              <p class="cv-location">
                ${escapeHtml(candidate.location)}
              </p>
            </div>

            <img
              src="${photoDataUrl}"
              class="cv-photo"
              alt="${escapeHtml(candidate.name)}"
            />

          </header>

          <div class="cv-contact">
            <span>
              ${escapeHtml(candidate.email)}
            </span>

            <span>
              ${escapeHtml(candidate.phone)}
            </span>

            <span>
              ${escapeHtml(candidate.linkedin)}
            </span>
          </div>

          <main class="cv-content">

            <section>
              <h2>Profile</h2>

              <p>
                ${escapeHtml(candidate.summary)}
              </p>
            </section>

            <section>
              <h2>Experience</h2>

              ${experience}
            </section>

            <section>
              <h2>Education</h2>

              ${education}
            </section>

            <section>
              <h2>Skills</h2>

              <div class="skills">
                ${skills}
              </div>
            </section>

            <section>
              <h2>Languages</h2>

              <div class="languages">
                ${languages}
              </div>
            </section>

          </main>
        </div>
      </body>
    </html>
  `;
}

async function main() {
  const files = fs
    .readdirSync(jsonDirectory)
    .filter((file) =>
      file.endsWith(".json")
    );

  console.log(
    `Found ${files.length} candidates`
  );

  const browser = await chromium.launch();

  for (const file of files) {
    const jsonPath = path.join(
      jsonDirectory,
      file
    );

    const candidate = JSON.parse(
      fs.readFileSync(
        jsonPath,
        "utf-8"
      )
    );

    const photoPath = path.join(
      photosDirectory,
      `${candidate.id}.png`
    );

    if (!fs.existsSync(photoPath)) {
      console.warn(
        `⚠ Missing photo for ${candidate.name}`
      );

      continue;
    }

    const photoBase64 =
      fs.readFileSync(photoPath)
        .toString("base64");

    const photoDataUrl =
      `data:image/png;base64,${photoBase64}`;

    const html = renderCV(
      candidate,
      photoDataUrl
    );

    const page =
      await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

    const outputPath = path.join(
      pdfDirectory,
      `${candidate.id}.pdf`
    );

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
    });

    await page.close();

    console.log(
      `✓ Created ${outputPath}`
    );
  }

  await browser.close();

  console.log(
    `\n✓ Finished rendering PDFs`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});