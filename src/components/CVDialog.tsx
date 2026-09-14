"use client";

import styles from "../app/page.module.css";

type Candidate = {
  candidateId: string;
  candidateName: string;
  role: string;
  location: string;
};

type CVDialogProps = {
  candidate: Candidate | null;
  onClose: () => void;
};

export default function CVDialog({
  candidate,
  onClose,
}: CVDialogProps) {
  if (!candidate) {
    return null;
  }

  return (
    <div
      className={styles.dialogOverlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.cvDialog}
        onClick={(event) =>
          event.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-dialog-title"
      >
        <div className={styles.dialogHeader}>
          <div>
            <div
              id="cv-dialog-title"
              className={styles.dialogTitle}
            >
              {candidate.candidateName}
            </div>

            <div
              className={styles.dialogSubtitle}
            >
              {candidate.role} ·{" "}
              {candidate.location}
            </div>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close CV"
          >
            ×
          </button>
        </div>

        <div className={styles.pdfContainer}>
          <iframe
            src={`/api/cv/${candidate.candidateId}`}
            className={styles.pdfPreview}
            title={`${candidate.candidateName} CV`}
          />
        </div>
      </div>
    </div>
  );
}