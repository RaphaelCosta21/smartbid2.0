import * as React from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  minHeight = 120,
  className,
}) => {
  return (
    <div className={className}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          minHeight,
          padding: 16,
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          resize: "vertical",
          fontSize: 14,
          fontFamily: "inherit",
          background: "var(--input-bg, #fff)",
          color: "var(--text-primary)",
          outline: "none",
        }}
      />
    </div>
  );
};
