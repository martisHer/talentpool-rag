"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

import styles from "../app/page.module.css";

export type UploadResult = {
  candidateId: string;
  candidateName: string;
  role: string;
  location: string;
  chunks: number;
  source: string;
};

type UploadCVsProps = {
  onUploaded: (
    candidates: UploadResult[],
  ) => void;
};

export default function UploadCVs({
  onUploaded,
}: UploadCVsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [showFiles, setShowFiles] = useState(false);

  const addFiles = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf"),
    );

    if (!pdfFiles.length) {
      setError("Please select PDF files.");
      return;
    }

    setError("");

    setFiles((currentFiles) => {
      const existingNames = new Set(
        currentFiles.map((file) => file.name),
      );

      const uniqueFiles = pdfFiles.filter(
        (file) => !existingNames.has(file.name),
      );

      return [...currentFiles, ...uniqueFiles];
    });
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      addFiles(Array.from(event.target.files));
    }

    // Allow selecting the same file again later.
    event.target.value = "";
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setDragging(false);

    if (uploading) {
      return;
    }

    addFiles(Array.from(event.dataTransfer.files));
  };

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    if (!uploading) {
      setDragging(true);
    }
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleUpload = () => {
    if (!files.length || uploading) {
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round(
          (event.loaded / event.total) * 100,
        );

        setProgress(percentage);
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);

        if (
          xhr.status < 200 ||
          xhr.status >= 300
        ) {
          throw new Error(
            data.error ||
              "Failed to process CVs.",
          );
        }

        setProgress(100);

        onUploaded(data.files);
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to process CVs.",
        );
      } finally {
        setUploading(false);
      }
    };

    xhr.onerror = () => {
      setError(
        "Unable to connect to the server. Please try again.",
      );

      setUploading(false);
    };

    xhr.onabort = () => {
      setError("Upload was cancelled.");
      setUploading(false);
    };

    xhr.send(formData);
  };

  const totalSize = files.reduce(
    (total, file) => total + file.size,
    0,
  );

  const formattedSize =
    totalSize >= 1024 * 1024
      ? `${(
          totalSize /
          1024 /
          1024
        ).toFixed(1)} MB`
      : `${Math.max(
          1,
          Math.round(totalSize / 1024),
        )} KB`;

  return (
    <section className={styles.uploadSection}>
      <div className={styles.uploadHeader}>
        <div className={styles.uploadEyebrow}>
          Candidate workspace
        </div>

        <h1 className={styles.uploadTitle}>
          Build your candidate pool
        </h1>

        <p className={styles.uploadSubtitle}>
          Upload CVs and let TalentPool find the
          right candidates using natural language.
        </p>
      </div>

      <div
        className={`${styles.dropzone} ${
          dragging ? styles.dropzoneDragging : ""
        } ${
          uploading ? styles.dropzoneUploading : ""
        }`}
        onClick={() =>
          !uploading && inputRef.current?.click()
        }
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={uploading ? -1 : 0}
        onKeyDown={(event) => {
          if (
            !uploading &&
            (event.key === "Enter" ||
              event.key === " ")
          ) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          hidden
          onChange={handleFileChange}
          disabled={uploading}
        />

        <div className={styles.uploadIcon}>
          ↑
        </div>

        <div className={styles.dropzoneTitle}>
          Drop your CVs here
        </div>

        <div className={styles.dropzoneSubtitle}>
          or click to browse · PDF files only
        </div>
      </div>

      {files.length > 0 && (
        <div className={styles.selectedFiles}>
          <div className={styles.selectedSummary}>
            <div
              className={
                styles.selectedSummaryInfo
              }
            >
              <div
                className={
                  styles.selectedSummaryIcon
                }
              >
                ✓
              </div>

              <div>
                <div
                  className={styles.selectedTitle}
                >
                  {files.length} CV
                  {files.length !== 1
                    ? "s"
                    : ""}{" "}
                  selected
                </div>

                <div
                  className={
                    styles.selectedSubtitle
                  }
                >
                  {formattedSize} · PDF files
                </div>
              </div>
            </div>

            <button
              type="button"
              className={
                styles.viewFilesButton
              }
              onClick={(event) => {
                event.stopPropagation();
                setShowFiles(
                  (current) => !current,
                );
              }}
              disabled={uploading}
            >
              {showFiles
                ? "Hide files"
                : "View files"}

              <span
                className={
                  showFiles
                    ? styles.chevronUp
                    : styles.chevronDown
                }
              >
                ↓
              </span>
            </button>
          </div>

          {showFiles && (
            <div className={styles.fileList}>
              {files.map((file) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className={styles.fileItem}
                >
                  <div className={styles.fileIcon}>
                    PDF
                  </div>

                  <div
                    className={
                      styles.fileDetails
                    }
                  >
                    <div
                      className={
                        styles.fileName
                      }
                    >
                      {file.name}
                    </div>

                    <div
                      className={
                        styles.fileSize
                      }
                    >
                      {(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!uploading && (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleUpload}
            >
              Process {files.length} CV
              {files.length !== 1
                ? "s"
                : ""}
              <span>→</span>
            </button>
          )}
        </div>
      )}

      {uploading && (
        <div className={styles.uploadProgress}>
          <div
            className={styles.progressHeader}
          >
            <span>Processing CVs</span>
            <span>{progress}%</span>
          </div>

          <div
            className={styles.progressTrack}
          >
            <div
              className={styles.progressBar}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div
            className={styles.progressText}
          >
            Uploading your candidate pool...
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </section>
  );
}