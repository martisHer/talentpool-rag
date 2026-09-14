"use client";

import styles from "../app/page.module.css";

type Candidate = {
  candidateId: string;
  candidateName: string;
  role: string;
  location: string;
  source: string;
  score?: number;
};

type CandidateChipsProps = {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
};

export default function CandidateChips({
  candidates,
  onSelect,
}: CandidateChipsProps) {
  return (
    <div className={styles.candidateChips}>
      {candidates.map(
        (candidate, index) => (
          <button
            key={candidate.candidateId}
            type="button"
            className={styles.candidateChip}
            onClick={() =>
              onSelect(candidate)
            }
          >
            <div
              className={styles.chipRank}
            >
              {index + 1}
            </div>

            <div
              className={styles.chipContent}
            >
              <div
                className={styles.chipName}
              >
                {candidate.candidateName}
              </div>

              <div
                className={styles.chipMeta}
              >
                {candidate.role}
                <span> · </span>
                {candidate.location}
              </div>
            </div>

            <span
              className={styles.chipArrow}
            >
              →
            </span>
          </button>
        ),
      )}
    </div>
  );
}