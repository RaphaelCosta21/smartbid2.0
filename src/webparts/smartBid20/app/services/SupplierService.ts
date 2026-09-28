/**
 * SupplierService — CRUD do cadastro de fornecedores (list smartbid-suppliers).
 *
 * A list é plana: categorias/PNs viram texto e os contatos viram JSON na coluna
 * `Contacts`. Aqui convertemos entre o item do SharePoint e o modelo ISupplier.
 * Static singleton pattern (mesmo padrão dos demais services).
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import {
  ISupplier,
  ISupplierInput,
  ISupplierContact,
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
  AttachmentFiles?: Array<{ FileName: string; ServerRelativeUrl: string }>;
}

const LOGO_PREFIX = "logo-";
const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
export const LOGO_MAX_BYTES = 1024 * 1024;

/** Returns an error message, or null when the file is an acceptable logo. */
export function validateLogo(file: File): string | null {
  if (LOGO_TYPES.indexOf(file.type) === -1)
    return "Use uma imagem PNG, JPG, WEBP, SVG ou GIF.";
  if (file.size > LOGO_MAX_BYTES) return "A imagem deve ter no máximo 1 MB.";
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
    country: item.Country || "",
    categories: splitList(item.Categories),
    partNumbers: splitList(item.PartNumbers),
    contacts: parseContacts(item.Contacts),
    notes: item.Notes || "",
    // Yes/No default Yes: só é inativo quando explicitamente false.
    active: item.Active !== false,
    logoUrl: logo ? logo.ServerRelativeUrl : undefined,
  };
}

function toFields(input: ISupplierInput): Record<string, unknown> {
  const contacts = input.contacts.filter(
    (c) => c.name.trim() || c.email.trim() || (c.phone || "").trim(),
  );
  return {
    Title: input.name.trim(),
    Country: input.country.trim(),
    Categories: input.categories
      .map((c) => c.trim())
      .filter(Boolean)
      .join(", "),
    PartNumbers: input.partNumbers
      .map((p) => p.trim())
      .filter(Boolean)
      .join("\n"),
    Contacts: JSON.stringify(contacts),
    Notes: input.notes.trim(),
    Active: input.active,
  };
}

export class SupplierService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.suppliers);
  }

  /** Lista todos os fornecedores (ordenados por nome). */
  public static async getAll(): Promise<ISupplier[]> {
    const items = (await SupplierService._list.items
      .select(...SELECT_FIELDS)
      .expand("AttachmentFiles")
      .orderBy("Title", true)
      .top(5000)()) as SupplierListItem[];
    return items.map(toModel);
  }

  /** `logo`: new file to set; `removeLogo`: drop the current one without replacing. */
  public static async create(
    input: ISupplierInput,
    logo?: File | null,
  ): Promise<void> {
    const result = await SupplierService._list.items.add(toFields(input));
    const id = (result as { data: { Id: number } }).data.Id;
    if (logo) await SupplierService._setLogo(id, logo);
  }

  public static async update(
    id: number,
    input: ISupplierInput,
    logo?: File | null,
    removeLogo?: boolean,
  ): Promise<void> {
    await SupplierService._list.items.getById(id).update(toFields(input));
    if (logo) await SupplierService._setLogo(id, logo);
    else if (removeLogo) await SupplierService._clearLogo(id);
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
