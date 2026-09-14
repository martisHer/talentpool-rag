"use client";

import styles from "../app/page.module.css";

export type Candidate = {
  candidateId: string;
  candidateName: string;
  role: string;
  location: string;
  source: string;
  score?: number;
};

type CandidateListProps = {
  candidates: Candidate[];
  rankedCandidateIds: Set<string>;
  onSelect: (candidate: Candidate) => void;
};

export default function CandidateList({
  candidates,
  rankedCandidateIds,
  onSelect,
}: CandidateListProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarTitle}>
          Candidates
        </div>

        <div className={styles.sidebarCount}>
          {candidates.length}
        </div>
      </div>

      <div className={styles.candidateList}>
        {candidates.map((candidate, index) => {
          const isRanked =
            rankedCandidateIds.has(
              candidate.candidateId,
            );

          return (
            <div
              key={candidate.candidateId}
              className={styles.candidateRow}
              onClick={() =>
                onSelect(candidate)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  onSelect(candidate);
                }
              }}
            >
              <div
                className={styles.candidateRank}
              >
                {isRanked ? (
                  <span
                    className={styles.rankStar}
                  >
                    ★
                  </span>
                ) : (
                  index + 1
                )}
              </div>

              <div
                className={styles.candidateInfo}
              >
                <div
                  className={styles.candidateName}
                >
                  {candidate.candidateName}
                </div>

                <div
                  className={styles.candidateMeta}
                >
                  <span>
                    {candidate.role}
                  </span>

                  <span className={styles.metaSeparator}>
                    ·
                  </span>

                  <span>
                    {candidate.location}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={styles.deleteButton}
                aria-label={`Remove ${candidate.candidateName}`}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}