import * as React from "react";
import styles from "./SuppliersRegistry.module.scss";
import { SupplierService, validateLogo } from "../services/SupplierService";
import {
  ISupplier,
  ISupplierContact,
  ISupplierInput,
} from "../models/ISupplier";
import { useUIStore } from "../stores/useUIStore";

const emptyContact = (): ISupplierContact => ({
  name: "",
  email: "",
  phone: "",
});

interface FormState {
  name: string;
  country: string;
  categoriesText: string;
  pnsText: string;
  contacts: ISupplierContact[];
  notes: string;
  active: boolean;
}

const emptyForm = (): FormState => ({
  name: "",
  country: "",
  categoriesText: "",
  pnsText: "",
  contacts: [emptyContact()],
  notes: "",
  active: true,
});

const formFromSupplier = (s: ISupplier): FormState => ({
  name: s.name,
  country: s.country,
  categoriesText: s.categories.join(", "),
  pnsText: s.partNumbers.join("\n"),
  contacts: s.contacts.length ? s.contacts.map((c) => ({ ...c })) : [emptyContact()],
  notes: s.notes,
  active: s.active,
});

const splitCommas = (raw: string): string[] =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

const splitLines = (raw: string): string[] =>
  raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const SupplierLogo: React.FC<{ name: string; url?: string | null }> = ({
  name,
  url,
}) =>
  url ? (
    <img className={styles.logo} src={url} alt={`Logo ${name}`} />
  ) : (
    <span className={styles.logoFallback}>{initials(name)}</span>
  );

/**
 * Cadastro nativo de fornecedores (list smartbid-suppliers): formulário +
 * tabela com editar/excluir, no visual do SMART BID 2.0.
 */
export const SuppliersRegistry: React.FC = () => {
  const addToast = useUIStore((s) => s.addToast);

  const [suppliers, setSuppliers] = React.useState<ISupplier[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");

  // editing: null = form fechado; "new" = criando; número = editando aquele Id.
  const [editing, setEditing] = React.useState<"new" | number | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Object URLs from the file picker must be released when replaced.
  React.useEffect(() => {
    if (!logoPreview || logoPreview.indexOf("blob:") !== 0) return undefined;
    return () => URL.revokeObjectURL(logoPreview);
  }, [logoPreview]);

  const load = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const rows = await SupplierService.getAll();
      setSuppliers(rows);
    } catch (err) {
      console.error("[Suppliers] falha ao carregar", err);
      setError(
        "Could not load suppliers. Check that the smartbid-suppliers list exists on this site.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const set = (patch: Partial<FormState>): void =>
    setForm((f) => ({ ...f, ...patch }));

  const setContact = (i: number, patch: Partial<ISupplierContact>): void =>
    setForm((f) => ({
      ...f,
      contacts: f.contacts.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    }));

  const addContactRow = (): void =>
    setForm((f) => ({ ...f, contacts: [...f.contacts, emptyContact()] }));

  const removeContactRow = (i: number): void =>
    setForm((f) => ({
      ...f,
      contacts:
        f.contacts.length > 1
          ? f.contacts.filter((_, idx) => idx !== i)
          : f.contacts,
    }));

  const resetLogo = (url: string | null): void => {
    setLogoFile(null);
    setLogoPreview(url);
    setRemoveLogo(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const pickLogo = (file: File | undefined): void => {
    if (!file) return;
    const error = validateLogo(file);
    if (error) {
      addToast({ type: "warning", title: error });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setRemoveLogo(false);
  };

  const clearLogo = (): void => {
    resetLogo(null);
    setRemoveLogo(true);
  };

  const openNew = (): void => {
    setForm(emptyForm());
    resetLogo(null);
    setEditing("new");
  };

  const openEdit = (s: ISupplier): void => {
    setForm(formFromSupplier(s));
    resetLogo(s.logoUrl || null);
    setEditing(s.id);
  };

  const closeForm = (): void => {
    setEditing(null);
    setForm(emptyForm());
    resetLogo(null);
  };

  const submit = async (): Promise<void> => {
    if (!form.name.trim()) {
      addToast({ type: "warning", title: "Enter the supplier name." });
      return;
    }
    setSaving(true);
    const input: ISupplierInput = {
      name: form.name,
      country: form.country,
      categories: splitCommas(form.categoriesText),
      partNumbers: splitLines(form.pnsText),
      contacts: form.contacts,
      notes: form.notes,
      active: form.active,
    };
    try {
      if (editing === "new") {
        await SupplierService.create(input, logoFile);
        addToast({ type: "success", title: "Supplier added." });
      } else if (typeof editing === "number") {
        await SupplierService.update(editing, input, logoFile, removeLogo);
        addToast({ type: "success", title: "Supplier updated." });
      }
      closeForm();
      await load();
    } catch (err) {
      console.error("[Suppliers] falha ao salvar", err);
      addToast({
        type: "error",
        title: "Could not save the supplier.",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: ISupplier): Promise<void> => {
    if (!window.confirm(`Remove supplier "${s.name}"?`)) return;
    setDeletingId(s.id);
    try {
      await SupplierService.remove(s.id);
      addToast({ type: "info", title: "Supplier removed." });
      if (editing === s.id) closeForm();
      await load();
    } catch (err) {
      console.error("[Suppliers] falha ao remover", err);
      addToast({
        type: "error",
        title: "Could not remove the supplier.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => {
      const hay = [
        s.name,
        s.country,
        s.categories.join(" "),
        s.partNumbers.join(" "),
        s.contacts.map((c) => `${c.name} ${c.email}`).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }, [query, suppliers]);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search by name, country, category or PN…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {editing === null && (
          <button className={styles.btnPrimary} onClick={openNew}>
            ＋ Add supplier
          </button>
        )}
      </div>

      {editing !== null && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              {editing === "new" ? "New supplier" : "Edit supplier"}
            </h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.grid}>
              <div className={styles.fieldFull}>
                <label className={styles.label}>
                  Logo{" "}
                  <span className={styles.hint}>
                    (PNG, JPG, WEBP, SVG or GIF - up to 1 MB)
                  </span>
                </label>
                <div className={styles.logoField}>
                  <span className={styles.logoPreview}>
                    <SupplierLogo name={form.name} url={logoPreview} />
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    className={styles.hiddenInput}
                    onChange={(e) => pickLogo(e.target.files?.[0])}
                  />
                  <button
                    className={styles.btnGhost}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    {logoPreview ? "Change image" : "Choose image"}
                  </button>
                  {logoPreview && (
                    <button
                      className={styles.linkBtn}
                      onClick={clearLogo}
                      disabled={saving}
                    >
                      Remove logo
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Supplier name *</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => set({ name: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Country</label>
                <input
                  className={styles.input}
                  value={form.country}
                  onChange={(e) => set({ country: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  Categories{" "}
                  <span className={styles.hint}>(comma-separated)</span>
                </label>
                <input
                  className={styles.input}
                  placeholder="ROV Tooling, Survey Equipment"
                  value={form.categoriesText}
                  onChange={(e) => set({ categoriesText: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  Part Numbers{" "}
                  <span className={styles.hint}>(one per line)</span>
                </label>
                <textarea
                  className={styles.textarea}
                  value={form.pnsText}
                  onChange={(e) => set({ pnsText: e.target.value })}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Contacts</label>
                {form.contacts.map((c, i) => (
                  <div key={i} className={styles.contactRow}>
                    <input
                      className={styles.input}
                      placeholder="Name"
                      value={c.name}
                      onChange={(e) => setContact(i, { name: e.target.value })}
                    />
                    <input
                      className={styles.input}
                      placeholder="E-mail"
                      value={c.email}
                      onChange={(e) => setContact(i, { email: e.target.value })}
                    />
                    <input
                      className={styles.input}
                      placeholder="Phone"
                      value={c.phone || ""}
                      onChange={(e) => setContact(i, { phone: e.target.value })}
                    />
                    <button
                      className={styles.iconBtn}
                      onClick={() => removeContactRow(i)}
                      disabled={form.contacts.length <= 1}
                      title="Remove contact"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button className={styles.linkBtn} onClick={addContactRow}>
                  ＋ Add contact
                </button>
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Notes</label>
                <textarea
                  className={styles.textarea}
                  value={form.notes}
                  onChange={(e) => set({ notes: e.target.value })}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => set({ active: e.target.checked })}
                  />
                  Active supplier
                </label>
              </div>
            </div>

            <div className={styles.footer}>
              <button
                className={styles.btnGhost}
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={() => void submit()}
                disabled={saving}
              >
                {saving
                  ? "Saving…"
                  : editing === "new"
                    ? "Add"
                    : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          Suppliers <span className={styles.subtle}>({filtered.length})</span>
        </h3>
      </div>

      {loading ? (
        <div className={`${styles.card} ${styles.stateBox}`}>
          <span className={styles.spinner} />
          <p className={styles.stateText}>Loading suppliers…</p>
        </div>
      ) : error ? (
        <div className={`${styles.card} ${styles.stateBox}`}>
          <span className={styles.stateIcon}>⚠️</span>
          <p className={styles.stateTitle}>Failed to load</p>
          <p className={styles.stateText}>{error}</p>
          <button className={styles.btnGhost} onClick={() => void load()}>
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${styles.card} ${styles.stateBox}`}>
          <span className={styles.stateIcon}>📇</span>
          <p className={styles.stateTitle}>
            {suppliers.length === 0
              ? "No suppliers yet"
              : "No results for this search"}
          </p>
          <p className={styles.stateText}>
            {suppliers.length === 0
              ? "Use “Add supplier” to register the first one."
              : "Try different search terms."}
          </p>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`${styles.supplierCard} ${
                editing === s.id ? styles.supplierCardEditing : ""
              }`}
            >
              <div className={styles.supplierHead}>
                <SupplierLogo name={s.name} url={s.logoUrl} />
                <div className={styles.supplierTitleBlock}>
                  <p className={styles.supplierName} title={s.name}>
                    {s.name || "(no name)"}
                  </p>
                  <p className={styles.subtle}>{s.country || "Country not set"}</p>
                </div>
                {s.active ? (
                  <span className={styles.badgeActive}>Active</span>
                ) : (
                  <span className={styles.badgeInactive}>Inactive</span>
                )}
              </div>

              {s.categories.length > 0 && (
                <div className={styles.chips}>
                  {s.categories.map((c) => (
                    <span key={c} className={styles.chip}>
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.supplierMeta}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Contact</span>
                  {s.contacts.length ? (
                    <span className={styles.metaValue}>
                      {s.contacts[0].name || s.contacts[0].email}
                      {s.contacts[0].name && s.contacts[0].email && (
                        <span className={styles.subtle}> · {s.contacts[0].email}</span>
                      )}
                      {s.contacts.length > 1 && (
                        <span className={styles.subtle}> +{s.contacts.length - 1}</span>
                      )}
                    </span>
                  ) : (
                    <span className={styles.subtle}>-</span>
                  )}
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Part Numbers</span>
                  <span className={styles.metaValue}>
                    {s.partNumbers.length || <span className={styles.subtle}>-</span>}
                  </span>
                </div>
              </div>

              {s.notes && <p className={styles.supplierNotes}>{s.notes}</p>}

              <div className={styles.supplierActions}>
                <button className={styles.iconBtn} onClick={() => openEdit(s)}>
                  Edit
                </button>
                <button
                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                  onClick={() => void remove(s)}
                  disabled={deletingId === s.id}
                >
                  {deletingId === s.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
