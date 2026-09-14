"use client";

import { FormEvent, KeyboardEvent, useState } from "react";

import CandidateChips from "./CandidateChips";
import styles from "../app/page.module.css";

export type Candidate = {
  candidateId: string;
  candidateName: string;
  role: string;
  location: string;
  source: string;
  score?: number;
};

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  candidates?: Candidate[];
};

type ChatProps = {
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
  onCandidateSelect: (candidate: Candidate) => void;
};

const suggestions = [
  "Find frontend developers with React experience",
  "Who has experience in healthcare products?",
  "Find UX/UI designers in Berlin",
  "Who would be a good fullstack candidate?",
];

export default function Chat({
  messages,
  onMessagesChange,
  onCandidateSelect,
}: ChatProps) {
  const [question, setQuestion] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (value?: string) => {
    const searchQuestion = (value ?? question).trim();

    if (!searchQuestion || searching) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: searchQuestion,
    };

    onMessagesChange([
      ...messages,
      userMessage,
    ]);

    setQuestion("");
    setSearching(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: searchQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong.",
        );
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.answer,
        candidates: data.sources ?? [],
      };

      onMessagesChange([
        ...messages,
        userMessage,
        assistantMessage,
      ]);
    } catch (error) {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Something went wrong while searching.",
      };

      onMessagesChange([
        ...messages,
        userMessage,
        assistantMessage,
      ]);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    handleSearch();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSearch();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <section className={styles.main}>
      <div className={styles.messages}>
        {isEmpty ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              ✦
            </div>

            <h1 className={styles.emptyTitle}>
              Find the right candidate
            </h1>

            <p className={styles.emptySubtitle}>
              Ask TalentPool anything about your
              candidate pool.
            </p>

            <div className={styles.suggestionGrid}>
              {suggestions.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className={styles.suggestion}
                    onClick={() =>
                      handleSearch(
                        suggestion,
                      )
                    }
                    disabled={searching}
                  >
                    <span>
                      {suggestion}
                    </span>

                    <span className={styles.suggestionArrow}>
                      →
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? styles.messageContainer
                    : styles.messageContainer
                }
              >
                {message.role === "user" ? (
                  <div className={styles.userMessage}>
                    <div
                      className={
                        styles.userBubble
                      }
                    >
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      styles.assistantMessage
                    }
                  >
                    <div
                      className={
                        styles.assistantLabel
                      }
                    >
                      TalentPool
                    </div>

                    <div
                      className={
                        styles.assistantContent
                      }
                    >
                      {message.content}
                    </div>

                    {message.candidates &&
                      message.candidates
                        .length > 0 && (
                        <CandidateChips
                          candidates={
                            message.candidates
                          }
                          onSelect={
                            onCandidateSelect
                          }
                        />
                      )}
                  </div>
                )}
              </div>
            ))}

            {searching && (
              <div
                className={
                  styles.assistantMessage
                }
              >
                <div
                  className={
                    styles.assistantLabel
                  }
                >
                  TalentPool
                </div>

                <div
                  className={
                    styles.typingIndicator
                  }
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.composerWrapper}>
        <form
          className={styles.composer}
          onSubmit={handleSubmit}
        >
          <textarea
            id="chat-field"
            name="chat-field"
            className={styles.input}
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask about your candidates..."
            rows={1}
            disabled={searching}
          />

          <button
            type="submit"
            className={styles.sendButton}
            disabled={
              searching ||
              !question.trim()
            }
            aria-label="Search candidates"
          >
            {searching ? (
              <span className={styles.sendSpinner}>
                ...
              </span>
            ) : (
              "↑"
            )}
          </button>
        </form>

        <div className={styles.composerHint}>
          Press Enter to search · Shift + Enter
          for a new line
        </div>
      </div>
    </section>
  );
}