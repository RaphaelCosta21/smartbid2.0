/**
 * ISupplier — modelo do cadastro de fornecedores (list smartbid-suppliers).
 *
 * A list é plana: arrays (categorias, PNs) são persistidos como texto e os
 * contatos como JSON na coluna `Contacts`. O SupplierService faz a conversão.
 */
export interface ISupplierContact {
  name: string;
  email: string;
  phone?: string;
}

export interface ISupplier {
  /** SharePoint item Id. */
  id: number;
  name: string;
  /** Other names of the same company (legal names, spellings seen on quotations). */
  aliases: string[];
  country: string;
  description: string;
  /** Stored in the legacy `Categories` column. */
  keywords: string[];
  /** Ids of systemConfig.supplierServiceTypes options (ids survive renames). */
  serviceTypes: string[];
  partNumbers: string[];
  contacts: ISupplierContact[];
  notes: string;
  active: boolean;
  /** Server-relative URL of the logo attachment, if any. */
  logoUrl?: string;
}

/** Payload de criação/edição (sem o Id gerado pelo SharePoint). */
export type ISupplierInput = Omit<ISupplier, "id" | "logoUrl">;

/** AI-generated (or user-edited) profile fields of a supplier. */
export interface ISupplierProfile {
  description: string;
  keywords: string[];
  serviceTypes: string[];
}
