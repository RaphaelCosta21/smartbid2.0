import * as React from "react";
import { useConfigStore } from "../../stores/useConfigStore";
import {
  activeConfigOptions,
  configOptionLabel,
} from "../../utils/clarificationHelpers";
import { qualificationCategoryValue } from "../../utils/qualificationHelpers";
import { SuggestionInput } from "../common/SuggestionInput";

export interface QualificationCategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

/** Qualification Categories (System Configuration) as suggestions; any other text is kept as typed. */
export const QualificationCategoryInput: React.FC<
  QualificationCategoryInputProps
> = ({
  value,
  onChange,
  id,
  className,
  placeholder = "Select or type a category",
  autoFocus,
}) => {
  const list = useConfigStore((s) => s.config?.qualificationCategories);
  const options = React.useMemo(() => activeConfigOptions(list), [list]);
  const labels = React.useMemo(() => options.map((o) => o.label), [options]);

  return (
    <SuggestionInput
      id={id}
      className={className}
      value={configOptionLabel(list, value)}
      suggestions={labels}
      customHint="Custom category"
      placeholder={placeholder}
      title="Category (System Configuration - Qualification Categories, or free text)"
      autoFocus={autoFocus}
      onChange={(text) => onChange(qualificationCategoryValue(options, text))}
      onBlur={(text) => {
        const next = qualificationCategoryValue(options, text.trim());
        if (next !== value) onChange(next);
      }}
    />
  );
};
