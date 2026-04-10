import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { RichTextEditor } from "../components/common/RichTextEditor";
import { FileUpload } from "../components/common/FileUpload";
import { PersonaCard } from "../components/common/PersonaCard";
import { useRequestStore } from "../stores/useRequestStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { sanitizeText } from "../utils/validators";
import {
  calculatePriority,
  getTodayISO,
  isToday,
  countBusinessDays,
} from "../utils/businessDays";
import { PRIORITY_COLORS } from "../utils/constants";
import { SERVICE_LINES, BID_TYPES } from "../utils/constants";
import { IPersonRef } from "../models/IUser";
import { BidPriority } from "../models/IBidStatus";
import styles from "./CreateRequestPage.module.scss";

interface FormData {
  client: string;
  clientContact: string;
  crmNumber: string;
  projectName: string;
  projectDescription: string;
  division: string;
  serviceLine: string;
  projectManager: IPersonRef | null;
  projectManagerSearch: string;
  bidType: string;
  desiredDueDate: string;
  vessel: string;
  field: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  client: "",
  clientContact: "",
  crmNumber: "",
  projectName: "",
  projectDescription: "",
  division: "",
  serviceLine: "",
  projectManager: null,
  projectManagerSearch: "",
  bidType: "Firm",
  desiredDueDate: "",
  vessel: "",
  field: "",
  notes: "",
};

const STEPS = [
  { number: 1, title: "Client & Project", icon: "📋" },
  { number: 2, title: "BID Details", icon: "🔧" },
  { number: 3, title: "Additional Info", icon: "📎" },
  { number: 4, title: "Review & Submit", icon: "✅" },
];

// Mock people for Project Manager picker
const MOCK_PEOPLE: IPersonRef[] = [
  {
    name: "Fernanda Lima",
    email: "flima@oceaneering.com",
    role: "Engineering Manager",
    photoUrl: "",
  },
  {
    name: "Carlos Eduardo",
    email: "ceduardo@oceaneering.com",
    role: "Project Manager",
    photoUrl: "",
  },
  {
    name: "Marcos Santos",
    email: "msantos@oceaneering.com",
    role: "Senior PM",
    photoUrl: "",
  },
  {
    name: "Ana Costa",
    email: "acosta@oceaneering.com",
    role: "Project Manager",
    photoUrl: "",
  },
  {
    name: "João Silva",
    email: "jsilva@oceaneering.com",
    role: "Engineering Lead",
    photoUrl: "",
  },
  {
    name: "Ricardo Alves",
    email: "ralves@oceaneering.com",
    role: "Project Manager",
    photoUrl: "",
  },
];

export const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const config = useConfigStore((s) => s.config);
  const addRequest = useRequestStore((s) => s.setRequests);
  const requests = useRequestStore((s) => s.requests);
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [showPeoplePicker, setShowPeoplePicker] = React.useState(false);
  const peoplePickerRef = React.useRef<HTMLDivElement>(null);

  const todayISO = getTodayISO();

  // Computed priority from due date
  const computedPriority: BidPriority = form.desiredDueDate
    ? calculatePriority(form.desiredDueDate)
    : "Normal";

  // Business days until due date
  const businessDaysUntilDue = form.desiredDueDate
    ? countBusinessDays(new Date(), new Date(form.desiredDueDate))
    : null;

  // Config-driven lists
  const clientOptions = config?.clientList?.filter((c) => c.isActive) || [];
  const divisionOptions = config?.divisions?.filter((d) => d.isActive) || [];

  // Filtered people for PM picker
  const filteredPeople = form.projectManagerSearch
    ? MOCK_PEOPLE.filter(
        (p) =>
          p.name
            .toLowerCase()
            .includes(form.projectManagerSearch.toLowerCase()) ||
          p.email
            .toLowerCase()
            .includes(form.projectManagerSearch.toLowerCase()),
      )
    : MOCK_PEOPLE;

  // Close people picker on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        peoplePickerRef.current &&
        !peoplePickerRef.current.contains(e.target as Node)
      ) {
        setShowPeoplePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateField = (field: keyof FormData, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: sanitizeText(value) }));
  };

  const validateStep = (): boolean => {
    const stepErrors: string[] = [];
    if (step === 0) {
      if (!form.client) stepErrors.push("Client is required.");
      if (!form.projectName) stepErrors.push("Project Name is required.");
      if (!form.division) stepErrors.push("Division is required.");
      if (!form.projectDescription) stepErrors.push("Description is required.");
      setErrors(stepErrors);
      return stepErrors.length === 0;
    }
    if (step === 1) {
      if (!form.serviceLine) stepErrors.push("Service Line is required.");
      if (!form.bidType) stepErrors.push("BID Type is required.");
      if (!form.desiredDueDate)
        stepErrors.push("Desired Due Date is required.");
      setErrors(stepErrors);
      return stepErrors.length === 0;
    }
    setErrors([]);
    return true;
  };

  const handleNext = (): void => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
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
      crmNumber: form.crmNumber,
      projectName: form.projectName,
      projectDescription: form.projectDescription,
      division: form.division as any,
      serviceLine: form.serviceLine,
      projectManager: form.projectManager,
      bidType: form.bidType as any,
      priority: computedPriority,
      desiredDueDate: form.desiredDueDate,
      creationDate: new Date().toISOString(),
      createdBy: {
        name: currentUser.displayName,
        email: currentUser.email,
        role: currentUser.role,
        photoUrl: currentUser.photoUrl,
      },
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

  const handleClose = (): void => {
    navigate(-1);
  };

  const progressPercent = (step / (STEPS.length - 1)) * 100;
  const priorityColor = PRIORITY_COLORS[computedPriority] || "#3b82f6";

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>
              <svg
                width="22"
                height="22"
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
              New BID Request
            </h2>
            <p className={styles.subtitle}>
              Fill in the details to create a new BID request
            </p>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Step Indicator ── */}
        <div className={styles.stepIndicator}>
          <div className={styles.stepRow}>
            {STEPS.map((s, i) => (
              <div
                key={s.number}
                className={`${styles.stepItem} ${i === step ? styles.stepActive : ""} ${i < step ? styles.stepCompleted : ""}`}
              >
                <div className={styles.stepNumber}>
                  {i < step ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    s.number
                  )}
                </div>
                <span className={styles.stepTitle}>{s.title}</span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`${styles.stepConnector} ${i < step ? styles.stepConnectorFilled : ""}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ── Form Body ── */}
        <div className={styles.formBody}>
          {errors.length > 0 && (
            <div className={styles.errorBox}>
              {errors.map((e, i) => (
                <div key={i}>⚠ {e}</div>
              ))}
            </div>
          )}

          {/* ── Step 0: Client & Project Information ── */}
          {step === 0 && (
            <>
              <div className={styles.stepLabel}>
                📋 Client & Project Information
              </div>
              <div className={styles.formGrid}>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Client *</span>
                  <select
                    className={styles.formInput}
                    value={form.client}
                    onChange={(e) => updateField("client", e.target.value)}
                  >
                    <option value="">Select client...</option>
                    {clientOptions.length > 0
                      ? clientOptions.map((c) => (
                          <option key={c.id} value={c.value}>
                            {c.label}
                          </option>
                        ))
                      : [
                          "Petrobras",
                          "Shell",
                          "Equinor",
                          "TotalEnergies",
                          "Enauta",
                          "PRIO",
                          "Subsea7",
                          "MODEC",
                          "Saipem",
                          "SBM Offshore",
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                  </select>
                </label>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Client Contact</span>
                  <input
                    className={styles.formInput}
                    value={form.clientContact}
                    onChange={(e) =>
                      updateField("clientContact", e.target.value)
                    }
                    placeholder="Contact name"
                  />
                </label>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>CRM</span>
                  <input
                    className={styles.formInput}
                    value={form.crmNumber}
                    onChange={(e) => updateField("crmNumber", e.target.value)}
                    placeholder="e.g. CRM-2026-001"
                  />
                </label>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Project Name *</span>
                  <input
                    className={styles.formInput}
                    value={form.projectName}
                    onChange={(e) => updateField("projectName", e.target.value)}
                    placeholder="e.g. Subsea Manifold Installation"
                  />
                </label>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Division *</span>
                  <select
                    className={styles.formInput}
                    value={form.division}
                    onChange={(e) => updateField("division", e.target.value)}
                  >
                    <option value="">Select division...</option>
                    {divisionOptions.length > 0
                      ? divisionOptions.map((d) => (
                          <option key={d.id} value={d.value}>
                            {d.label}
                          </option>
                        ))
                      : ["OPG", "SSR-Survey", "SSR-ROV", "SSR-Integrated"].map(
                          (d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ),
                        )}
                  </select>
                </label>
                <label className={styles.formGroupFull}>
                  <span className={styles.formLabel}>Description *</span>
                  <RichTextEditor
                    value={form.projectDescription}
                    onChange={(v) => updateField("projectDescription", v)}
                    placeholder="Describe the project scope and requirements..."
                    minHeight={80}
                  />
                </label>
              </div>
            </>
          )}

          {/* ── Step 1: BID Internal Details ── */}
          {step === 1 && (
            <>
              <div className={styles.stepLabel}>🔧 BID Internal Details</div>
              <div className={styles.formGrid}>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Service Line *</span>
                  <select
                    className={styles.formInput}
                    value={form.serviceLine}
                    onChange={(e) => updateField("serviceLine", e.target.value)}
                  >
                    <option value="">Select service line...</option>
                    {SERVICE_LINES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Project Manager with PersonaCard picker */}
                <div className={styles.formGroup} ref={peoplePickerRef}>
                  <span className={styles.formLabel}>Project Manager *</span>
                  {form.projectManager ? (
                    <div className={styles.selectedPersona}>
                      <PersonaCard
                        name={form.projectManager.name}
                        email={form.projectManager.email}
                        role={form.projectManager.role}
                        photoUrl={form.projectManager.photoUrl}
                        size="small"
                      />
                      <button
                        className={styles.removePersona}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            projectManager: null,
                            projectManagerSearch: "",
                          }))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.peoplePickerWrapper}>
                      <input
                        className={styles.formInput}
                        value={form.projectManagerSearch}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            projectManagerSearch: e.target.value,
                          }));
                          setShowPeoplePicker(true);
                        }}
                        onFocus={() => setShowPeoplePicker(true)}
                        placeholder="Search by name or email..."
                      />
                      {showPeoplePicker && (
                        <div className={styles.peopleDropdown}>
                          {filteredPeople.length === 0 ? (
                            <div className={styles.peopleDropdownEmpty}>
                              No results found
                            </div>
                          ) : (
                            filteredPeople.map((person) => (
                              <div
                                key={person.email}
                                className={styles.peopleDropdownItem}
                                onClick={() => {
                                  setForm((prev) => ({
                                    ...prev,
                                    projectManager: person,
                                    projectManagerSearch: "",
                                  }));
                                  setShowPeoplePicker(false);
                                }}
                              >
                                <PersonaCard
                                  name={person.name}
                                  email={person.email}
                                  role={person.role}
                                  photoUrl={person.photoUrl}
                                  size="small"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>BID Type *</span>
                  <select
                    className={styles.formInput}
                    value={form.bidType}
                    onChange={(e) => updateField("bidType", e.target.value)}
                  >
                    <option value="">Select BID type...</option>
                    {BID_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Creation Date - readonly */}
                <div className={styles.formGroup}>
                  <span className={styles.formLabel}>Creation Date</span>
                  <input
                    type="date"
                    className={`${styles.formInput} ${styles.readonlyInput}`}
                    value={todayISO}
                    readOnly
                    disabled
                  />
                </div>

                {/* Created By - readonly PersonaCard */}
                <div className={styles.formGroup}>
                  <span className={styles.formLabel}>Created By</span>
                  <div className={styles.readonlyPersona}>
                    <PersonaCard
                      name={currentUser.displayName}
                      email={currentUser.email}
                      role={currentUser.jobTitle || currentUser.role}
                      photoUrl={currentUser.photoUrl}
                      size="small"
                    />
                  </div>
                </div>

                {/* Desired Due Date */}
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Desired Due Date *</span>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={form.desiredDueDate}
                    min={todayISO}
                    onChange={(e) =>
                      updateField("desiredDueDate", e.target.value)
                    }
                  />
                </label>

                {/* Auto-calculated Priority */}
                <div className={styles.formGroup}>
                  <span className={styles.formLabel}>Priority (automatic)</span>
                  <div
                    className={styles.priorityBadgeDisplay}
                    style={{
                      background: `${priorityColor}18`,
                      border: `1px solid ${priorityColor}50`,
                      color: priorityColor,
                    }}
                  >
                    <span
                      className={styles.priorityDot}
                      style={{ background: priorityColor }}
                    />
                    {computedPriority}
                    {businessDaysUntilDue !== null && (
                      <span className={styles.priorityDays}>
                        ({businessDaysUntilDue} business day
                        {businessDaysUntilDue !== 1 ? "s" : ""})
                      </span>
                    )}
                  </div>
                </div>

                {/* Date notifications */}
                {form.desiredDueDate && (
                  <div className={styles.formGroupFull}>
                    {isToday(form.desiredDueDate) && (
                      <div className={styles.dateWarningCritical}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>
                          <strong>Same-day request:</strong> You must contact
                          the Engineering Manager before submitting a BID
                          request for today.
                        </span>
                      </div>
                    )}
                    {computedPriority === "Urgent" &&
                      !isToday(form.desiredDueDate) && (
                        <div className={styles.dateWarningUrgent}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          <span>
                            <strong>Urgent:</strong> Due date is within 4
                            business days. This BID will be flagged as high
                            priority.
                          </span>
                        </div>
                      )}
                    {computedPriority === "Normal" && (
                      <div className={styles.dateInfoNormal}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>
                          Standard timeline — due within 5 to 14 business days.
                        </span>
                      </div>
                    )}
                    {computedPriority === "Low" && (
                      <div className={styles.dateInfoLow}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>
                          Extended timeline — more than 14 business days until
                          due date.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Step 2: Additional Info ── */}
          {step === 2 && (
            <>
              <div className={styles.stepLabel}>📎 Additional Information</div>
              <div className={styles.formGrid}>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Vessel</span>
                  <input
                    className={styles.formInput}
                    value={form.vessel}
                    onChange={(e) => updateField("vessel", e.target.value)}
                    placeholder="Vessel name"
                  />
                </label>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Field</span>
                  <input
                    className={styles.formInput}
                    value={form.field}
                    onChange={(e) => updateField("field", e.target.value)}
                    placeholder="Field name"
                  />
                </label>
                <label className={styles.formGroupFull}>
                  <span className={styles.formLabel}>Notes</span>
                  <textarea
                    className={`${styles.formInput} ${styles.textareaInput}`}
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Any special notes or instructions..."
                  />
                </label>
                <div className={styles.formGroupFull}>
                  <span className={styles.formLabel}>Attachments</span>
                  <FileUpload
                    accept=".pdf,.xlsx,.docx,.zip,.dwg"
                    multiple
                    onUpload={(files) =>
                      setUploadedFiles((prev) => [...prev, ...files])
                    }
                  />
                  {uploadedFiles.length > 0 && (
                    <div className={styles.attachmentsList}>
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className={styles.reviewAttachmentItem}>
                          📎 {f.name}
                          <span className={styles.reviewAttachmentSize}>
                            {(f.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Step 3: Review & Submit ── */}
          {step === 3 && (
            <div className={styles.reviewSection}>
              <div className={styles.reviewTitle}>✅ Review & Submit</div>

              {/* Client & Project */}
              <div className={styles.reviewGroupLabel}>
                📋 Client & Project Information
              </div>
              <div className={styles.reviewGrid}>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>Client</span>
                  <span className={styles.reviewCellValue}>
                    {form.client || "—"}
                  </span>
                </div>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>Client Contact</span>
                  <span className={styles.reviewCellValue}>
                    {form.clientContact || "—"}
                  </span>
                </div>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>CRM</span>
                  <span className={styles.reviewCellValue}>
                    {form.crmNumber || "—"}
                  </span>
                </div>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>Division</span>
                  <span className={styles.reviewCellValue}>
                    {form.division || "—"}
                  </span>
                </div>
                <div className={styles.reviewCellFull}>
                  <span className={styles.reviewCellLabel}>Project Name</span>
                  <span className={styles.reviewCellValue}>
                    {form.projectName || "—"}
                  </span>
                </div>
                <div className={styles.reviewCellFull}>
                  <span className={styles.reviewCellLabel}>Description</span>
                  <span className={styles.reviewCellValue}>
                    {form.projectDescription || "—"}
                  </span>
                </div>
              </div>

              {/* BID Internal Details */}
              <div className={styles.reviewGroupLabel}>
                🔧 BID Internal Details
              </div>
              <div className={styles.reviewGrid}>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>Service Line</span>
                  <span className={styles.reviewCellValue}>
                    {form.serviceLine || "—"}
                  </span>
                </div>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>BID Type</span>
                  <span className={styles.reviewCellValue}>{form.bidType}</span>
                </div>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>
                    Project Manager
                  </span>
                  <span className={styles.reviewCellValue}>
                    {form.projectManager ? (
                      <PersonaCard
                        name={form.projectManager.name}
                        email={form.projectManager.email}
                        role={form.projectManager.role}
                        photoUrl={form.projectManager.photoUrl}
                        size="small"
                      />
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>Created By</span>
                  <span className={styles.reviewCellValue}>
                    <PersonaCard
                      name={currentUser.displayName}
                      email={currentUser.email}
                      role={currentUser.jobTitle || currentUser.role}
                      photoUrl={currentUser.photoUrl}
                      size="small"
                    />
                  </span>
                </div>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>Creation Date</span>
                  <span className={styles.reviewCellValue}>{todayISO}</span>
                </div>
                <div className={styles.reviewCell}>
                  <span className={styles.reviewCellLabel}>
                    Desired Due Date
                  </span>
                  <span className={styles.reviewCellValue}>
                    {form.desiredDueDate || "—"}
                  </span>
                </div>
                <div className={styles.reviewCellFull}>
                  <span className={styles.reviewCellLabel}>Priority</span>
                  <div
                    className={styles.priorityBadgeDisplay}
                    style={{
                      background: `${priorityColor}18`,
                      border: `1px solid ${priorityColor}50`,
                      color: priorityColor,
                      display: "inline-flex",
                      width: "auto",
                    }}
                  >
                    <span
                      className={styles.priorityDot}
                      style={{ background: priorityColor }}
                    />
                    {computedPriority}
                    {businessDaysUntilDue !== null && (
                      <span className={styles.priorityDays}>
                        ({businessDaysUntilDue} business day
                        {businessDaysUntilDue !== 1 ? "s" : ""})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {(form.vessel ||
                form.field ||
                form.notes ||
                uploadedFiles.length > 0) && (
                <>
                  <div className={styles.reviewGroupLabel}>
                    📎 Additional Information
                  </div>
                  <div className={styles.reviewGrid}>
                    {form.vessel && (
                      <div className={styles.reviewCell}>
                        <span className={styles.reviewCellLabel}>Vessel</span>
                        <span className={styles.reviewCellValue}>
                          {form.vessel}
                        </span>
                      </div>
                    )}
                    {form.field && (
                      <div className={styles.reviewCell}>
                        <span className={styles.reviewCellLabel}>Field</span>
                        <span className={styles.reviewCellValue}>
                          {form.field}
                        </span>
                      </div>
                    )}
                    {form.notes && (
                      <div className={styles.reviewCellFull}>
                        <span className={styles.reviewCellLabel}>Notes</span>
                        <span className={styles.reviewCellValue}>
                          {form.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {uploadedFiles.length > 0 && (
                <div className={styles.reviewAttachments}>
                  <span className={styles.formLabel}>
                    Attachments ({uploadedFiles.length})
                  </span>
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className={styles.reviewAttachmentItem}>
                      📎 {f.name}
                      <span className={styles.reviewAttachmentSize}>
                        {(f.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            Step {step + 1} of {STEPS.length}
          </div>
          <div className={styles.footerButtons}>
            <button
              onClick={() => (step > 0 ? setStep((s) => s - 1) : handleClose())}
              className={styles.btnSecondary}
            >
              {step > 0 ? "← Back" : "Cancel"}
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={handleNext} className={styles.btnPrimary}>
                Next →
              </button>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className={styles.btnSubmit}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Submit Request
              </button>
            )}
          </div>
        </div>
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
