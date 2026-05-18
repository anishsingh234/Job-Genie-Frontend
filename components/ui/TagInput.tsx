"use client";

import { useState, type KeyboardEvent } from "react";
import { Badge } from "./Badge";

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function TagInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter…",
  error,
}: TagInputProps) {
  const [input, setInput] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = input.trim();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div
        className={`flex flex-wrap items-center gap-2 rounded-xl border bg-bg-surface px-3 py-2.5 transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
          ${error ? "border-danger" : "border-border-subtle"}`}
      >
        {value.map((tag) => (
          <Badge key={tag} variant="primary" size="md">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1.5 hover:text-white transition-colors"
            >
              ×
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
        />
      </div>
      {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
    </div>
  );
}
