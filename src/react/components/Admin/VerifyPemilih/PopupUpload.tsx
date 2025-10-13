import React, { useEffect, useState } from "react";
import { useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
};

export default function PopupUpload({ open, onClose, onSubmit }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setFile(null);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const maxBytes = 10 * 1024 * 1024; // 10 MB

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      setError(null);
      return;
    }

    const isCsv =
      f.type === "text/csv" || /\.csv$/i.test(f.name) || f.type === "";

    if (!isCsv) {
      setFile(null);
      setError("Please select a CSV file.");
      return;
    }

    if (f.size > maxBytes) {
      setFile(null);
      setError("File exceeds maximum size of 10 MB.");
      return;
    }

    setFile(f);
    setError(null);
  }

  function handleSubmit() {
    if (!file) {
      setError("Please choose a CSV file before submitting.");
      return;
    }
    onSubmit(file);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-white opacity-80 blur-2xl"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload CSV</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-gray-600">Select CSV file</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className="w-full flex items-center gap-3 border rounded-full px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50"
              aria-label="Choose CSV file"
            >
              {/* upload icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 5 17 10" />
                <line x1="12" y1="5" x2="12" y2="19" />
              </svg>

              <span className="flex-1 text-left truncate">
                {file
                  ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
                  : "Choose a CSV file..."}
              </span>

              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                Browse
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-2xl border text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file}
              className={`px-4 py-2 rounded-2xl text-white ${
                file
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
