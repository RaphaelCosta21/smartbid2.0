import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { SuppliersRegistry } from "./SuppliersRegistry";
import styles from "./EasiModulePage.module.scss";

/**
 * Página "Suppliers" — cadastro nativo de fornecedores (list smartbid-suppliers).
 * Não usa o EasiModuleFrame porque o gating por benchmark (opportunities/cost)
 * não se aplica aqui: os fornecedores vêm da própria lista de suppliers.
 */
export const EasiSuppliersPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Suppliers"
        subtitle="Cadastro de fornecedores do SMART BID 2.0"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        }
      />
      <SuppliersRegistry />
    </div>
  );
};
