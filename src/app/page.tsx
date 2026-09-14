"use client";

import { useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import UploadCVs, {
  UploadResult,
} from "@/components/UploadCVs";
import CandidateList, {
  Candidate,
} from "@/components/CandidateList";
import Chat, {
  Message,
} from "@/components/Chat";
import CVDialog from "@/components/CVDialog";

import styles from "./page.module.css";

export default function Home() {
  const [uploadedCandidates, setUploadedCandidates] =
    useState<UploadResult[]>([]);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const isReady =
    uploadedCandidates.length > 0;

  /*
   * Get the candidates from the most recent
   * assistant response.
   *
   * These are already ranked by the RAG
   * search endpoint.
   */
  const latestResults = useMemo(() => {
    const latestAssistantMessage =
      [...messages]
        .reverse()
        .find(
          (message) =>
            message.role === "assistant" &&
            message.candidates &&
            message.candidates.length > 0,
        );

    return (
      latestAssistantMessage?.candidates ?? []
    );
  }, [messages]);

  /*
   * Used by CandidateList to visually identify
   * candidates that appeared in the latest search.
   */
  const rankedCandidateIds = useMemo(
    () =>
      new Set(
        latestResults.map(
          (candidate) =>
            candidate.candidateId,
        ),
      ),
    [latestResults],
  );

  /*
   * Keep the uploaded candidate pool in the sidebar,
   * but move the candidates returned by the latest
   * search to the top in their ranking order.
   */
  const sortedCandidates = useMemo(() => {
    if (!latestResults.length) {
      return uploadedCandidates;
    }

    const ranking = new Map(
      latestResults.map(
        (candidate, index) => [
          candidate.candidateId,
          index,
        ],
      ),
    );

    return [...uploadedCandidates].sort(
      (a, b) => {
        const rankA = ranking.get(
          a.candidateId,
        );

        const rankB = ranking.get(
          b.candidateId,
        );

        // Neither candidate appeared in the
        // latest search.
        if (
          rankA === undefined &&
          rankB === undefined
        ) {
          return 0;
        }

        // Candidates from the latest search
        // should appear before the others.
        if (rankA === undefined) {
          return 1;
        }

        if (rankB === undefined) {
          return -1;
        }

        return rankA - rankB;
      },
    );
  }, [
    uploadedCandidates,
    latestResults,
  ]);

  const handleUploaded = (
    candidates: UploadResult[],
  ) => {
    setUploadedCandidates(candidates);

    // Start with a clean chat after uploading
    // a new candidate pool.
    setMessages([]);

    setSelectedCandidate(null);
  };

  const handleNewSearch = () => {
    /*
     * "New search" completely resets the app.
     *
     * This returns the UI to the initial
     * upload state.
     */
    setUploadedCandidates([]);
    setMessages([]);
    setSelectedCandidate(null);
  };

  const handleCandidateSelect = (
    candidate: Candidate,
  ) => {
    setSelectedCandidate(candidate);
  };

  return (
    <main className={styles.page}>
      <Navbar
        showNewSearch={isReady}
        onNewSearch={handleNewSearch}
      />

      {!isReady ? (
        <div className={styles.uploadPage}>
          <UploadCVs
            onUploaded={handleUploaded}
          />
        </div>
      ) : (
        <div className={styles.app}>
          <CandidateList
            candidates={sortedCandidates}
            rankedCandidateIds={
              rankedCandidateIds
            }
            onSelect={
              handleCandidateSelect
            }
          />

          <Chat
            messages={messages}
            onMessagesChange={
              setMessages
            }
            onCandidateSelect={
              handleCandidateSelect
            }
          />
        </div>
      )}

      <CVDialog
        candidate={selectedCandidate}
        onClose={() =>
          setSelectedCandidate(null)
        }
      />
    </main>
  );
}