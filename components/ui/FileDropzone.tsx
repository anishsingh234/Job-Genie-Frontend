"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";

interface FileDropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  error?: string;
}

export function FileDropzone({
  onFile,
  accept = ".pdf",
  maxSizeMB = 10,
  label = "Drop your file here",
  description,
  error: externalError,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        setError(`File exceeds ${maxSizeMB}MB limit`);
        return;
      }
      setFileName(file.name);
      onFile(file);
    },
    [maxSizeMB, onFile]
  );

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  const displayError = externalError || error;

  return (
    <div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300
          ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border-default bg-bg-surface hover:border-primary/50 hover:bg-bg-card"}
          ${displayError ? "border-danger" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {/* Upload icon */}
          <div className={`rounded-xl p-3 transition-colors ${isDragging ? "bg-primary/10 text-primary" : "bg-bg-elevated text-text-muted"}`}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>

          {fileName ? (
            <div>
              <p className="text-sm font-medium text-accent">{fileName}</p>
              <p className="text-xs text-text-muted mt-1">Click to replace</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-text-primary">{label}</p>
              <p className="text-xs text-text-muted mt-1">
                {description || `${accept.toUpperCase().replace(".", "")} up to ${maxSizeMB}MB`}
              </p>
            </div>
          )}
        </div>
      </div>

      {displayError && (
        <p className="text-xs text-danger mt-2">{displayError}</p>
      )}
    </div>
  );
}
