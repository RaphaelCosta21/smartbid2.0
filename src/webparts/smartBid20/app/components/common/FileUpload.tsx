import * as React from "react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onUpload: (files: File[]) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSizeMB = 25,
  onUpload,
  className,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null): void => {
    if (!files) return;
    const validFiles = Array.from(files).filter(
      (f) => f.size <= maxSizeMB * 1024 * 1024,
    );
    if (validFiles.length > 0) onUpload(validFiles);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={className}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        padding: 32,
        border: `2px dashed ${isDragOver ? "var(--accent-color, #3B82F6)" : "var(--border-subtle)"}`,
        borderRadius: 12,
        background: isDragOver
          ? "var(--accent-color, #3B82F6)10"
          : "transparent",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: "none" }}
      />
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-secondary)"
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>
        Drag &amp; drop files here or click to browse
      </p>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", opacity: 0.7 }}>
        Max {maxSizeMB}MB per file
      </p>
    </div>
  );
};
