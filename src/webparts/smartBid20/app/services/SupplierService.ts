/**
 * SupplierService — CRUD do cadastro de fornecedores (list smartbid-suppliers).
 *
 * A list é plana: categorias/PNs viram texto e os contatos viram JSON na coluna
 * `Contacts`. Aqui convertemos entre o item do SharePoint e o modelo ISupplier.
 * Static singleton pattern (mesmo padrão dos demais services).
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import {
  ISupplier,
  ISupplierInput,
  ISupplierContact,
  ISupplierProfile,
} from "../models/ISupplier";

interface SupplierListItem {
  Id: number;
  Title: string | null;
  Country?: string | null;
  Categories?: string | null;
  PartNumbers?: string | null;
  Contacts?: string | null;
  Notes?: string | null;
  Active?: boolean | null;
  Aliases?: string | null;
  Description?: string | null;
  ServiceTypes?: string | null;
  AttachmentFiles?: Array<{ FileName: string; ServerRelativeUrl: string }>;
}

/** Columns added after the list was created; provisioned by the app when allowed. */
const OPTIONAL_FIELDS = ["Aliases", "Description", "ServiceTypes"];
type ColumnMap = Record<string, boolean>;
let columnsPromise: Promise<ColumnMap> | undefined;

const LOGO_PREFIX = "logo-";
const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
export const LOGO_MAX_BYTES = 1024 * 1024;

/** Returns an error message, or null when the file is an acceptable logo. */
export function validateLogo(file: File): string | null {
  if (LOGO_TYPES.indexOf(file.type) === -1)
    return "Use a PNG, JPG, WEBP, SVG or GIF image.";
  if (file.size > LOGO_MAX_BYTES) return "The image must be 1 MB or smaller.";
  return null;
}

const SELECT_FIELDS = [
  "Id",
  "Title",
  "Country",
  "Categories",
  "PartNumbers",
  "Contacts",
  "Notes",
  "Active",
  "AttachmentFiles",
];

/** Quebra um texto (vírgula ou quebra de linha) numa lista limpa. */
function splitList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Line-only split: aliases are legal names and may contain commas. */
function splitLines(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function joinLines(values: string[]): string {
  return values
    .map((v) => v.trim())
    .filter(Boolean)
    .join("\n");
}

function joinKeywords(values: string[]): string {
  return values
    .map((v) => v.replace(/,/g, " ").trim())
    .filter(Boolean)
    .join(", ");
}

function parseContacts(raw: string | null | undefined): ISupplierContact[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (c): c is ISupplierContact =>
          !!c && typeof (c as ISupplierContact).name === "string",
      )
      .map((c) => ({
        name: c.name || "",
        email: c.email || "",
        phone: c.phone || "",
      }));
  } catch {
    return [];
  }
}

function toModel(item: SupplierListItem): ISupplier {
  const logo = (item.AttachmentFiles || []).find(
    (f) => f.FileName.toLowerCase().indexOf(LOGO_PREFIX) === 0,
  );
  return {
    id: item.Id,
    name: item.Title || "",
    aliases: splitLines(item.Aliases),
    country: item.Country || "",
    description: item.Description || "",
    keywords: splitList(item.Categories),
    serviceTypes: splitLines(item.ServiceTypes),
    partNumbers: splitList(item.PartNumbers),
    contacts: parseContacts(item.Contacts),
    notes: item.Notes || "",
    // Yes/No default Yes: só é inativo quando explicitamente false.
    active: item.Active !== false,
    logoUrl: logo ? logo.ServerRelativeUrl : undefined,
  };
}

function toFields(
  input: ISupplierInput,
  columns: ColumnMap,
): Record<string, unknown> {
  const contacts = input.contacts.filter(
    (c) => c.name.trim() || c.email.trim() || (c.phone || "").trim(),
  );
  const fields: Record<string, unknown> = {
    Title: input.name.trim(),
    Country: input.country.trim(),
    Categories: joinKeywords(input.keywords),
    PartNumbers: joinLines(input.partNumbers),
    Contacts: JSON.stringify(contacts),
    Notes: input.notes.trim(),
    Active: input.active,
  };
  if (columns.Aliases) fields.Aliases = joinLines(input.aliases);
  if (columns.Description) fields.Description = input.description.trim();
  if (columns.ServiceTypes) fields.ServiceTypes = joinLines(input.serviceTypes);
  return fields;
}

export class SupplierService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.suppliers);
  }

  /**
   * Which optional columns exist, creating the missing ones once per session.
   * Users without Manage Lists just work without them.
   */
  public static columns(): Promise<ColumnMap> {
    if (!columnsPromise) {
      columnsPromise = SupplierService._provisionColumns().catch((err) => {
        columnsPromise = undefined;
        throw err;
      });
    }
    return columnsPromise;
  }

  private static async _provisionColumns(): Promise<ColumnMap> {
    const listApi = SupplierService._list as any;
    const present: ColumnMap = {};
    let existing: string[] = [];
    try {
      const fields = (await listApi.fields.select("InternalName")()) as {
        InternalName: string;
      }[];
      existing = fields.map((f) => f.InternalName);
    } catch (err) {
      console.warn("SupplierService.columns: cannot read fields", err);
      return present;
    }
    for (const name of OPTIONAL_FIELDS) {
      if (existing.indexOf(name) >= 0) {
        present[name] = true;
        continue;
      }
      try {
        await listApi.fields.addMultilineText(name, { RichText: false });
        present[name] = true;
      } catch {
        /* insufficient permission or concurrent run */
      }
    }
    return present;
  }

  /** Lista todos os fornecedores (ordenados por nome). */
  public static async getAll(): Promise<ISupplier[]> {
    const columns = await SupplierService.columns();
    const select = SELECT_FIELDS.concat(
      OPTIONAL_FIELDS.filter((f) => columns[f]),
    );
    const items = (await SupplierService._list.items
      .select(...select)
      .expand("AttachmentFiles")
      .orderBy("Title", true)
      .top(5000)()) as SupplierListItem[];
    return items.map(toModel);
  }

  /** `logo`: new file to set. Returns the new item Id. */
  public static async create(
    input: ISupplierInput,
    logo?: File | null,
  ): Promise<number> {
    const columns = await SupplierService.columns();
    const result = await SupplierService._list.items.add(
      toFields(input, columns),
    );
    const id = (result as { data: { Id: number } }).data.Id;
    if (logo) await SupplierService._setLogo(id, logo);
    return id;
  }

  /** `logo`: new file to set; `removeLogo`: drop the current one without replacing. */
  public static async update(
    id: number,
    input: ISupplierInput,
    logo?: File | null,
    removeLogo?: boolean,
  ): Promise<void> {
    const columns = await SupplierService.columns();
    await SupplierService._list.items
      .getById(id)
      .update(toFields(input, columns));
    if (logo) await SupplierService._setLogo(id, logo);
    else if (removeLogo) await SupplierService._clearLogo(id);
  }

  /** Returns false when the Aliases column is unavailable. */
  public static async updateAliases(
    id: number,
    aliases: string[],
  ): Promise<boolean> {
    const columns = await SupplierService.columns();
    if (!columns.Aliases) return false;
    await SupplierService._list.items
      .getById(id)
      .update({ Aliases: joinLines(aliases) });
    return true;
  }

  public static async updateProfile(
    id: number,
    profile: ISupplierProfile,
  ): Promise<void> {
    const columns = await SupplierService.columns();
    const fields: Record<string, unknown> = {
      Categories: joinKeywords(profile.keywords),
    };
    if (columns.Description) fields.Description = profile.description.trim();
    if (columns.ServiceTypes)
      fields.ServiceTypes = joinLines(profile.serviceTypes);
    await SupplierService._list.items.getById(id).update(fields);
  }

  public static async remove(id: number): Promise<void> {
    await SupplierService._list.items.getById(id).delete();
  }

  private static async _clearLogo(id: number): Promise<void> {
    const item = SupplierService._list.items.getById(id);
    const files = await item.attachmentFiles();
    for (const f of files) {
      if (f.FileName.toLowerCase().indexOf(LOGO_PREFIX) === 0)
        await item.attachmentFiles.getByName(f.FileName).delete();
    }
  }

  private static async _setLogo(id: number, file: File): Promise<void> {
    const error = validateLogo(file);
    if (error) throw new Error(error);
    await SupplierService._clearLogo(id);
    const ext = (file.name.split(".").pop() || "png")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    // Timestamped name so browsers don't keep showing a cached old logo.
    await SupplierService._list.items
      .getById(id)
      .attachmentFiles.add(`${LOGO_PREFIX}${Date.now()}.${ext || "png"}`, file);
  }
}
