import * as React from "react";
import { IBidTemplate } from "../../models/IBidTemplate";

interface TemplateImportWizardProps {
  isOpen: boolean;
  templates: IBidTemplate[];
  onImport: (template: IBidTemplate) => void;
  onClose: () => void;
}

export const TemplateImportWizard: React.FC<TemplateImportWizardProps> = ({
  isOpen,
  templates,
  onImport,
  onClose,
}) => {
  const [step, setStep] = React.useState(0);
  const [selected, setSelected] = React.useState<IBidTemplate | null>(null);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--card-bg, #fff)",
          borderRadius: 16,
          padding: 24,
          maxWidth: 640,
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h3 style={{ margin: 0 }}>Import Template — Step {step + 1}/2</h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            ×
          </button>
        </div>

        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Select a template to import:
            </p>
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelected(t);
                  setStep(1);
                }}
                style={{
                  padding: 16,
                  border: `1px solid ${selected?.id === t.id ? "var(--accent-color)" : "var(--border-subtle)"}`,
                  borderRadius: 8,
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {t.division} · {t.equipmentItems.length} items
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && selected && (
          <div>
            <p style={{ fontSize: 14 }}>
              Import <strong>{selected.name}</strong> with{" "}
              {selected.equipmentItems.length} equipment items?
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button
                onClick={() => setStep(0)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={() => {
                  onImport(selected);
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "var(--accent-color, #3B82F6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
