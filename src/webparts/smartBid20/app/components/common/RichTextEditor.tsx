import * as React from "react";
import styles from "./RichTextEditor.module.scss";

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
        className={styles.textarea}
        style={{ minHeight }}
      />
    </div>
  );
};
