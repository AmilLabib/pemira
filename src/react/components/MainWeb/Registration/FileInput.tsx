import React from "react";

interface Props {
  id?: string;
  label: string;
  accept?: string;
  file?: File | null;
  previewUrl?: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showTemplate?: boolean;
  templateHref?: string;
  templateText?: string;
  error?: string | undefined;
}

const FileInput: React.FC<Props> = ({
  id,
  label,
  accept,
  file,
  previewUrl,
  onFileChange,
  showTemplate = false,
  templateHref = "#",
  templateText = "Download template",
  error,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <label className="flex-1 overflow-hidden rounded-full bg-[#0b2b5a] px-5 py-3 text-xs text-ellipsis whitespace-nowrap text-white">
          {file
            ? `${file.name} ${file.size ? `(${Math.round(file.size / 1024)} KB)` : ""}`
            : "No File Selected"}
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200">
          <input
            id={id}
            type="file"
            accept={accept}
            onChange={onFileChange}
            className="sr-only"
          />
          <span>Upload</span>
        </label>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="preview"
            className="h-20 w-20 rounded object-cover"
          />
        )}
      </div>
      {showTemplate && (
        <div className="">
          <a
            className="text-sm text-sky-600"
            href={templateHref}
            onClick={(e) => {
              if (!templateHref || templateHref === "#") {
                e.preventDefault();
              }
            }}
            target={templateHref && templateHref !== "#" ? "_blank" : undefined}
            rel={
              templateHref && templateHref !== "#"
                ? "noopener noreferrer"
                : undefined
            }
          >
            {templateText}
          </a>
        </div>
      )}
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
};

export default FileInput;
