import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { RichTextEditor } from "../components/common/RichTextEditor";
import { FileUpload } from "../components/common/FileUpload";
import { useRequestStore } from "../stores/useRequestStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { validateBidRequest, sanitizeText } from "../utils/validators";
import {
  DIVISIONS,
  SERVICE_LINES,
  BID_TYPES,
  BID_SIZES,
  PRIORITIES,
} from "../utils/constants";

interface FormData {
  client: string;
  clientContact: string;
  projectName: string;
  projectDescription: string;
  division: string;
  serviceLine: string;
  bidType: string;
  bidSize: string;
  priority: string;
  desiredDueDate: string;
  region: string;
  vessel: string;
  field: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  client: "",
  clientContact: "",
  projectName: "",
  projectDescription: "",
  division: "",
  serviceLine: "",
  bidType: "Firm",
  bidSize: "Standard",
  priority: "Normal",
  desiredDueDate: "",
  region: "Brazil",
  vessel: "",
  field: "",
  notes: "",
};

export const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const addRequest = useRequestStore((s) => s.setRequests);
  const requests = useRequestStore((s) => s.requests);
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

  const steps = [
    "Client & Project",
    "BID Details",
    "Additional Info",
    "Review & Submit",
  ];

  const updateField = (field: keyof FormData, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: sanitizeText(value) }));
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      const result = validateBidRequest({
        client: form.client,
        projectName: form.projectName,
        division: form.division,
        desiredDueDate: form.desiredDueDate,
      });
      setErrors(result.errors);
      return result.isValid;
    }
    setErrors([]);
    return true;
  };

  const handleNext = (): void => {
    if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleSubmit = (): void => {
    const reqNum = requests.length + 6;
    const padded =
      reqNum < 100
        ? reqNum < 10
          ? "00" + reqNum
          : "0" + reqNum
        : String(reqNum);
    const newReq = {
      id: `REQ-${Date.now()}`,
      requestNumber: `REQ-2026-${padded}`,
      requestedBy: {
        name: currentUser.displayName,
        email: currentUser.email,
        role: currentUser.role,
      },
      requestDate: new Date().toISOString(),
      client: form.client,
      clientContact: form.clientContact,
      projectName: form.projectName,
      projectDescription: form.projectDescription,
      division: form.division as any,
      serviceLine: form.serviceLine,
      bidType: form.bidType as any,
      bidSize: form.bidSize as any,
      priority: form.priority as any,
      desiredDueDate: form.desiredDueDate,
      region: form.region,
      vessel: form.vessel,
      field: form.field,
      attachments: [],
      notes: form.notes,
      status: "submitted" as const,
      assignedTo: null,
      assignedDate: null,
      rejectionReason: null,
      convertedBidNumber: null,
    };
    addRequest([...requests, newReq]);
    navigate("/requests");
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--border-subtle)",
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    fontSize: 14,
    outline: "none",
    width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="New Request"
        subtitle="Create a new BID request"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        }
      />

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: i === step ? 600 : 400,
                background:
                  i <= step
                    ? "var(--accent-color, #3B82F6)"
                    : "var(--border-subtle)",
                color: i <= step ? "#fff" : "var(--text-secondary)",
              }}
            >
              {i + 1}. {s}
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 24,
                  height: 1,
                  background: "var(--border-subtle)",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "#EF444420",
            border: "1px solid #EF4444",
            color: "#EF4444",
            fontSize: 13,
          }}
        >
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}

      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid var(--border-subtle)",
        }}
      >
        {step === 0 && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Client *</span>
              <input
                style={inputStyle}
                value={form.client}
                onChange={(e) => updateField("client", e.target.value)}
                placeholder="e.g. Petrobras"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                Client Contact
              </span>
              <input
                style={inputStyle}
                value={form.clientContact}
                onChange={(e) => updateField("clientContact", e.target.value)}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                Project Name *
              </span>
              <input
                style={inputStyle}
                value={form.projectName}
                onChange={(e) => updateField("projectName", e.target.value)}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Division *</span>
              <select
                style={inputStyle}
                value={form.division}
                onChange={(e) => updateField("division", e.target.value)}
              >
                <option value="">Select...</option>
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                gridColumn: "1 / -1",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>Description</span>
              <RichTextEditor
                value={form.projectDescription}
                onChange={(v) => updateField("projectDescription", v)}
                placeholder="Describe the project scope and requirements..."
                minHeight={80}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                Desired Due Date *
              </span>
              <input
                type="date"
                style={inputStyle}
                value={form.desiredDueDate}
                onChange={(e) => updateField("desiredDueDate", e.target.value)}
              />
            </label>
          </div>
        )}

        {step === 1 && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                Service Line
              </span>
              <select
                style={inputStyle}
                value={form.serviceLine}
                onChange={(e) => updateField("serviceLine", e.target.value)}
              >
                <option value="">Select...</option>
                {SERVICE_LINES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>BID Type</span>
              <select
                style={inputStyle}
                value={form.bidType}
                onChange={(e) => updateField("bidType", e.target.value)}
              >
                {BID_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>BID Size</span>
              <select
                style={inputStyle}
                value={form.bidSize}
                onChange={(e) => updateField("bidSize", e.target.value)}
              >
                {BID_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Priority</span>
              <select
                style={inputStyle}
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {step === 2 && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Region</span>
              <input
                style={inputStyle}
                value={form.region}
                onChange={(e) => updateField("region", e.target.value)}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Vessel</span>
              <input
                style={inputStyle}
                value={form.vessel}
                onChange={(e) => updateField("vessel", e.target.value)}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Field</span>
              <input
                style={inputStyle}
                value={form.field}
                onChange={(e) => updateField("field", e.target.value)}
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                gridColumn: "1 / -1",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>Notes</span>
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </label>
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>Attachments</span>
              <FileUpload
                accept=".pdf,.xlsx,.docx,.zip,.dwg"
                multiple
                onUpload={(files) =>
                  setUploadedFiles((prev) => [...prev, ...files])
                }
              />
              {uploadedFiles.length > 0 && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    marginTop: 4,
                  }}
                >
                  {uploadedFiles.map((f, i) => (
                    <div key={i}>
                      {f.name} ({(f.size / 1024).toFixed(0)} KB)
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h4 style={{ margin: 0, fontWeight: 600 }}>Review your request:</h4>
            {[
              ["Client", form.client],
              ["Project", form.projectName],
              ["Division", form.division],
              ["Service Line", form.serviceLine || "—"],
              ["Type", form.bidType],
              ["Size", form.bidSize],
              ["Priority", form.priority],
              ["Due Date", form.desiredDueDate || "—"],
              ["Region", form.region || "—"],
              ["Vessel", form.vessel || "—"],
              ["Field", form.field || "—"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{ display: "flex", gap: 12, fontSize: 14 }}
              >
                <span style={{ fontWeight: 600, minWidth: 120 }}>{label}:</span>
                <span style={{ color: "var(--text-secondary)" }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() =>
            step > 0 ? setStep((s) => s - 1) : navigate("/requests")
          }
          style={{
            padding: "10px 24px",
            borderRadius: 8,
            border: "1px solid var(--border-subtle)",
            background: "transparent",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {step > 0 ? "Back" : "Cancel"}
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={handleNext}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background: "var(--accent-color, #3B82F6)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background: "#10B981",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Submit Request
          </button>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Submit BID Request?"
        message={`This will create a new request for "${form.projectName}" to ${form.client}.`}
        confirmLabel="Submit"
        onConfirm={() => {
          setShowConfirm(false);
          handleSubmit();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};
