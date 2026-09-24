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
  country: string;
  categories: string[];
  partNumbers: string[];
  contacts: ISupplierContact[];
  notes: string;
  active: boolean;
  /** Server-relative URL of the logo attachment, if any. */
  logoUrl?: string;
}

/** Payload de criação/edição (sem o Id gerado pelo SharePoint). */
export type ISupplierInput = Omit<ISupplier, "id" | "logoUrl">;
