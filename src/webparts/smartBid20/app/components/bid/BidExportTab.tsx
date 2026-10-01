import * as React from "react";
import {
  BadgeCheck,
  Boxes,
  Calculator,
  Check,
  CircleCheck,
  ClipboardList,
  Clock,
  Download,
  Factory,
  FileDown,
  FileSpreadsheet,
  FileText,
  Info,
  LoaderCircle,
  Lock,
  ShieldAlert,
  TriangleAlert,
  Truck,
  Wrench,
} from "lucide-react";
import { BidExcelSheetKey, IBid } from "../../models";
import { useBidStore } from "../../stores/useBidStore";
import { useUIStore } from "../../stores/useUIStore";
import { createActivityLogEntry } from "../../utils/activityLogHelpers";
import { getAssetsCostCompleteness } from "../../utils/costCalculations";
import { buildCostSummaryView } from "../../utils/costSummaryView";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatHours,
} from "../../utils/formatters";
import {
  BID_EXCEL_SHEETS,
  getBidApprovalState,
} from "../../utils/bidExcelExport/context";
import {
  NO_SUPPLIER_LABEL,
  buildSupplierRows,
  getBidContingency,
  summarizeSuppliers,
} from "../../utils/bidExcelExport/rows";
import {
  exportBidToExcel,
  getBidExcelFilename,
} from "../../utils/bidExcelExport";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { getCurrentRevisionLetter } from "./RevisionsTab";
import styles from "./BidExportTab.module.scss";

interface BidExportTabProps {
  bid: IBid;
  currentUser: { displayName: string; email: string };
  onSave?: (patch: Partial<IBid>) => void;
}

const SHEET_ICONS: Record<BidExcelSheetKey, React.ReactNode> = {
  info: <Info size={18} />,
  costSummary: <Calculator size={18} />,
  scope: <ClipboardList size={18} />,
  assets: <Boxes size={18} />,
  hours: <Clock size={18} />,
  prepMob: <Wrench size={18} />,
  logistics: <Truck size={18} />,
  certifications: <BadgeCheck size={18} />,
  suppliers: <Factory size={18} />,
};

const SHEET_ACCENTS: Record<BidExcelSheetKey, string> = {
  info: styles.accentInfo,
  costSummary: styles.accentCost,
  scope: styles.accentScope,
  assets: styles.accentAssets,
  hours: styles.accentHours,
  prepMob: styles.accentPrep,
  logistics: styles.accentLogistics,
  certifications: styles.accentCerts,
  suppliers: styles.accentSuppliers,
};

interface ICheck {
  ok: boolean;
  label: string;
}

const plural = (n: number, word: string): string =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

export const BidExportTab: React.FC<BidExportTabProps> = ({
  bid,
  currentUser,
  onSave,
}) => {
  const addToast = useUIStore((s) => s.addToast);
  const [selected, setSelected] = React.useState<BidExcelSheetKey[]>([]);
  const [includeNotes, setIncludeNotes] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const exportedBy = currentUser.displayName || currentUser.email;
  const approval = React.useMemo(() => getBidApprovalState(bid), [bid]);

  const view = React.useMemo(() => buildCostSummaryView(bid), [bid]);
  const supplierRows = React.useMemo(() => buildSupplierRows(bid), [bid]);
  const completeness = React.useMemo(
    () =>
      getAssetsCostCompleteness(
        bid.scopeItems || [],
        bid.assetBreakdown || [],
        getBidContingency(bid),
      ),
    [bid],
  );
  const s = view.summary;
  const revision = getCurrentRevisionLetter(bid);
  const fileName = getBidExcelFilename(bid);
  const opp = bid.opportunityInfo;

  const stats = React.useMemo((): Record<BidExcelSheetKey, string> => {
    const scopeCount = (bid.scopeItems || []).filter(
      (i) => !i.isSection,
    ).length;
    const prepCount =
      (bid.rtsItems || []).length +
      (bid.mobilizationItems || []).length +
      (bid.consumableItems || []).length;
    const certCount = (bid.certificationsBreakdown || []).filter(
      (i) => !i.isSection,
    ).length;
    const suppliers = summarizeSuppliers(supplierRows).filter(
      (sp) => sp.supplier !== NO_SUPPLIER_LABEL,
    ).length;
    return {
      info: `${bid.crmNumber || bid.bidNumber} · Rev ${revision}`,
      costSummary: `${formatCurrency(s.totalCostUSD)} total`,
      scope: plural(scopeCount, "item"),
      assets: `${plural((bid.assetBreakdown || []).length, "item")} · ${formatCurrencyCompact(s.assetsCostUSD)}`,
      hours: `${formatHours(view.hours.total)} · ${formatCurrencyCompact(s.totalHoursCostUSD)}`,
      prepMob: `${plural(prepCount, "item")} · ${formatCurrencyCompact(s.rtsCostUSD + s.mobilizationCostUSD + s.consumablesCostUSD)}`,
      logistics: `${plural((bid.logisticsBreakdown || []).length, "item")} · ${formatCurrencyCompact(s.logisticsCostUSD)}`,
      certifications: `${plural(certCount, "item")} · ${formatCurrencyCompact(s.certificationsCostUSD)}`,
      suppliers: `${plural(supplierRows.length, "line")} · ${plural(suppliers, "supplier")}`,
    };
  }, [bid, view, supplierRows, revision]);

  const checks = React.useMemo((): ICheck[] => {
    const list: ICheck[] = [];
    list.push(
      approval.approved
        ? { ok: true, label: "BID approved (Close Out · Completed)" }
        : {
            ok: false,
            label: `BID not approved yet — ${approval.statusLabel} · ${approval.phaseLabel}`,
          },
    );
    const missing = s.missingRateCurrencies || [];
    if (!(s.ptaxUsed > 0)) {
      list.push({ ok: false, label: "No USD→BRL rate registered on this BID" });
    } else if (missing.length > 0) {
      list.push({
        ok: false,
        label: `No exchange rate for ${missing.join(", ")} — left out of USD totals`,
      });
    } else {
      list.push({
        ok: true,
        label: `Exchange rates registered (1 USD = ${s.ptaxUsed.toFixed(4)} BRL)`,
      });
    }
    list.push(
      completeness.totalMissing > 0
        ? {
            ok: false,
            label: `${completeness.totalMissing} of ${plural(completeness.totalItems, "asset line")} without cost`,
          }
        : { ok: true, label: "All asset lines have costs mapped" },
    );
    if (view.uncategorized.usd > 0) {
      list.push({
        ok: false,
        label: `${formatCurrency(view.uncategorized.usd)} of assets without CAPEX/OPEX`,
      });
    }
    const noSupplier = supplierRows.filter((r) => !r.supplier).length;
    list.push(
      noSupplier > 0
        ? {
            ok: false,
            label: `${plural(noSupplier, "procured line")} without supplier`,
          }
        : { ok: true, label: "Supplier informed on every procured line" },
    );
    const noLead = supplierRows.filter((r) => r.leadTime === null).length;
    list.push(
      noLead > 0
        ? {
            ok: false,
            label: `${plural(noLead, "procured line")} without lead time`,
          }
        : { ok: true, label: "Lead time informed on every procured line" },
    );
    return list;
  }, [s, view, completeness, supplierRows, approval]);

  const warnings = checks.filter((c) => !c.ok).length;
  const optionalKeys = BID_EXCEL_SHEETS.filter((d) => !d.required).map(
    (d) => d.key,
  );
  const isSelected = (key: BidExcelSheetKey): boolean =>
    selected.indexOf(key) >= 0;
  const selectedDefs = BID_EXCEL_SHEETS.filter(
    (d) => d.required || isSelected(d.key),
  );

  const toggle = (key: BidExcelSheetKey): void => {
    setSelected((prev) =>
      prev.indexOf(key) >= 0 ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const logExport = (name: string): void => {
    if (!onSave) return;
    const sheetNames = selectedDefs.map((d) => d.name);
    const detail = `"${name}" (Rev ${revision} · ${plural(sheetNames.length, "sheet")})`;
    const entry = createActivityLogEntry(
      approval.approved ? "BID_EXPORTED" : "BID_EXPORTED_UNAPPROVED",
      approval.approved
        ? `Excel exported: ${detail}`
        : `Excel exported WITHOUT BID approval (status: ${approval.statusLabel} · phase: ${approval.phaseLabel}): ${detail}`,
      currentUser.email,
      exportedBy,
      {
        format: "xlsx",
        fileName: name,
        revision,
        sheets: sheetNames,
        includeNotes,
        approved: approval.approved,
        status: bid.currentStatus,
        phase: bid.currentPhase,
        totalCostUSD: s.totalCostUSD,
        totalCostBRL: s.totalCostBRL,
        dataWarnings: checks.filter((c) => !c.ok).map((c) => c.label),
      },
    );
    // Read the store: the BID may have changed while the workbook was generated
    const latest =
      useBidStore.getState().bids.find((b) => b.bidNumber === bid.bidNumber) ||
      bid;
    onSave({ activityLog: [...(latest.activityLog || []), entry] });
  };

  const runExport = async (): Promise<void> => {
    setBusy(true);
    try {
      const name = await exportBidToExcel(bid, {
        sheets: selectedDefs.map((d) => d.key),
        includeNotes,
        exportedBy,
      });
      logExport(name);
      addToast({
        type: approval.approved ? "success" : "warning",
        title: approval.approved
          ? "Excel exported"
          : "Excel exported — NOT APPROVED",
        message: name,
      });
    } catch (err) {
      console.error("[BidExportTab] Excel export failed:", err);
      addToast({
        type: "error",
        title: "Export failed",
        message: "The Excel file could not be generated. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = (): void => {
    if (approval.approved) {
      runExport().catch(() => undefined);
    } else {
      setConfirmOpen(true);
    }
  };

  const confirmUnapprovedExport = (): void => {
    setConfirmOpen(false);
    runExport().catch(() => undefined);
  };

  return (
    <div className={styles.root}>
      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className={styles.heroIcon}>
          <FileDown size={26} />
        </div>
        <div className={styles.heroText}>
          <div className={styles.heroEyebrowRow}>
            <span className={styles.eyebrow}>Export</span>
            {bid.crmNumber?.trim() && bid.bidNumber ? (
              <span className={styles.reqBadge}>{bid.bidNumber}</span>
            ) : null}
          </div>
          <h2 className={styles.heroTitle}>
            {[opp && opp.client, opp && opp.projectName]
              .filter(Boolean)
              .join(" · ") || "—"}
          </h2>
          <p className={styles.heroSub}>
            {bid.crmNumber?.trim() || bid.bidNumber}
          </p>
        </div>
        <div className={styles.heroMeta}>
          <span className={styles.revChip}>Rev {revision}</span>
          <span className={styles.heroTotalLabel}>Total cost</span>
          <span className={styles.heroTotal}>
            {formatCurrency(s.totalCostUSD)}
          </span>
          <span className={styles.heroTotalSub}>
            {formatCurrency(s.totalCostBRL, "BRL")}
          </span>
        </div>
      </section>

      {!approval.approved && (
        <div className={styles.approvalAlert} role="alert">
          <span className={styles.approvalAlertIcon}>
            <ShieldAlert size={20} />
          </span>
          <div className={styles.approvalAlertBody}>
            <strong className={styles.approvalAlertTitle}>
              This BID is not approved yet
            </strong>
            <span className={styles.approvalAlertText}>
              Current status: <b>{approval.statusLabel}</b> · Phase:{" "}
              <b>{approval.phaseLabel}</b>. A BID is only approved in Close
              Out · Completed. You can still export, but every sheet of the
              workbook will be marked as <b>NOT APPROVED</b> and the export will
              be recorded in the Activity Log.
            </span>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Export a BID that is not approved?"
        message={`This BID is in "${approval.statusLabel}" (phase: ${approval.phaseLabel}) and has not completed the approval flow. The workbook will be marked as NOT APPROVED and this export will be recorded in the Activity Log under your name.`}
        confirmLabel="Export anyway"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={confirmUnapprovedExport}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className={styles.layout}>
        <div className={styles.main}>
          {/* ─── Step 1: format ─── */}
          <section className={styles.step}>
            <header className={styles.stepHeader}>
              <span className={styles.stepNo}>1</span>
              <div>
                <h3 className={styles.stepTitle}>Format</h3>
                <p className={styles.stepSub}>Choose the file type</p>
              </div>
            </header>
            <div className={styles.formatGrid}>
              <button
                type="button"
                className={`${styles.formatCard} ${styles.formatActive}`}
                aria-pressed="true"
              >
                <span className={styles.formatIcon}>
                  <FileSpreadsheet size={22} />
                </span>
                <span className={styles.formatBody}>
                  <span className={styles.formatName}>Excel workbook</span>
                  <span className={styles.formatDesc}>
                    .xlsx · formatted for commercial pricing
                  </span>
                </span>
                <CircleCheck size={20} className={styles.formatCheck} />
              </button>
              <button
                type="button"
                className={styles.formatCard}
                disabled
                title="PDF export is coming soon"
              >
                <span className={styles.formatIcon}>
                  <FileText size={22} />
                </span>
                <span className={styles.formatBody}>
                  <span className={styles.formatName}>PDF report</span>
                  <span className={styles.formatDesc}>
                    Printable BID summary
                  </span>
                </span>
                <span className={styles.soonBadge}>Coming soon</span>
              </button>
            </div>
          </section>

          {/* ─── Step 2: contents ─── */}
          <section className={styles.step}>
            <header className={styles.stepHeader}>
              <span className={styles.stepNo}>2</span>
              <div>
                <h3 className={styles.stepTitle}>Contents</h3>
                <p className={styles.stepSub}>
                  {selectedDefs.length} of {BID_EXCEL_SHEETS.length} sheets
                  selected
                </p>
              </div>
              <div className={styles.stepActions}>
                <button
                  type="button"
                  className={`${styles.linkBtn} ${selected.length === optionalKeys.length ? styles.linkBtnActive : ""}`}
                  onClick={() => setSelected(optionalKeys)}
                >
                  Select all
                </button>
                <span className={styles.dot}>·</span>
                <button
                  type="button"
                  className={`${styles.linkBtn} ${selected.length === 0 ? styles.linkBtnActive : ""}`}
                  onClick={() => setSelected([])}
                >
                  Required only
                </button>
              </div>
            </header>
            <div className={styles.sheetGrid}>
              {BID_EXCEL_SHEETS.map((def) => {
                const on = !!def.required || isSelected(def.key);
                return (
                  <label
                    key={def.key}
                    className={[
                      styles.sheetCard,
                      SHEET_ACCENTS[def.key],
                      on ? styles.sheetOn : "",
                      def.required ? styles.sheetLocked : "",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      className={styles.srOnly}
                      checked={on}
                      disabled={!!def.required}
                      onChange={() => toggle(def.key)}
                    />
                    <span className={styles.sheetIcon}>
                      {SHEET_ICONS[def.key]}
                    </span>
                    <span className={styles.sheetBody}>
                      <span className={styles.sheetName}>{def.name}</span>
                      <span className={styles.sheetDesc}>
                        {def.description}
                      </span>
                      <span className={styles.sheetStat}>{stats[def.key]}</span>
                    </span>
                    {def.required ? (
                      <span
                        className={styles.requiredTag}
                        title="Always included"
                      >
                        <Lock size={11} /> Required
                      </span>
                    ) : (
                      <span className={styles.checkBox} aria-hidden="true">
                        {on && <Check size={13} strokeWidth={3} />}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            <label className={styles.optionRow}>
              <input
                type="checkbox"
                className={styles.srOnly}
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
              />
              <span
                className={`${styles.switch} ${includeNotes ? styles.switchOn : ""}`}
                aria-hidden="true"
              />
              <span className={styles.optionText}>
                <span className={styles.optionName}>
                  Include notes & comments
                </span>
                <span className={styles.optionDesc}>
                  Adds the Notes / Comments column to the item sheets
                </span>
              </span>
            </label>
          </section>
        </div>

        {/* ─── Side panel: preview + checks + download ─── */}
        <aside className={styles.side}>
          <div className={styles.summaryCard}>
            <h3 className={styles.panelTitle}>Workbook preview</h3>
            <div className={styles.workbook}>
              <div className={styles.workbookBody}>
                <FileSpreadsheet size={16} />
                <span className={styles.workbookName}>{fileName}</span>
              </div>
              <div className={styles.tabStrip}>
                {selectedDefs.map((d) => (
                  <span
                    key={d.key}
                    className={`${styles.sheetTab} ${SHEET_ACCENTS[d.key]}`}
                  >
                    {d.name}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.figures}>
              <div className={styles.figure}>
                <span className={styles.figureLabel}>CAPEX</span>
                <span className={styles.figureValue}>
                  {formatCurrency(view.capex.usd)}
                </span>
              </div>
              <div className={styles.figure}>
                <span className={styles.figureLabel}>OPEX</span>
                <span className={styles.figureValue}>
                  {formatCurrency(view.opex.usd)}
                </span>
              </div>
              <div className={styles.figure}>
                <span className={styles.figureLabel}>PTAX (USD→BRL)</span>
                <span className={styles.figureValue}>
                  {s.ptaxUsed > 0 ? s.ptaxUsed.toFixed(4) : "—"}
                </span>
                {view.fx.capturedDate && (
                  <span className={styles.figureSub}>
                    Registered {formatDate(view.fx.capturedDate)}
                  </span>
                )}
              </div>
              <div className={styles.figure}>
                <span className={styles.figureLabel}>Hours</span>
                <span className={styles.figureValue}>
                  {formatHours(view.hours.total)}
                </span>
              </div>
            </div>

            <div className={styles.checksHeader}>
              <h4 className={styles.panelSubtitle}>Data checks</h4>
              <span
                className={`${styles.checksBadge} ${warnings ? styles.checksWarn : styles.checksOk}`}
              >
                {warnings ? plural(warnings, "warning") : "All good"}
              </span>
            </div>
            <ul className={styles.checks}>
              {checks.map((c) => (
                <li
                  key={c.label}
                  className={`${styles.check} ${c.ok ? styles.checkOk : styles.checkWarn}`}
                >
                  {c.ok ? (
                    <CircleCheck size={15} />
                  ) : (
                    <TriangleAlert size={15} />
                  )}
                  <span>{c.label}</span>
                </li>
              ))}
            </ul>
            {warnings > 0 && (
              <p className={styles.hint}>
                Warnings don&apos;t block the export — they are also noted in
                the workbook.
              </p>
            )}

            <button
              type="button"
              className={styles.downloadBtn}
              onClick={handleDownload}
              disabled={busy}
            >
              {busy ? (
                <>
                  <LoaderCircle size={18} className={styles.spin} /> Generating
                  workbook…
                </>
              ) : (
                <>
                  <Download size={18} /> Download Excel
                </>
              )}
            </button>
            <p className={styles.hint}>
              Values match the BID Details tabs at the moment of the export.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
