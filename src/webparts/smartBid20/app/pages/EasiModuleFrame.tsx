import * as React from "react";
import { ApiClient } from "@easi/smartbid-modules";
import { PageHeader } from "../components/common/PageHeader";
import styles from "./EasiModulePage.module.scss";

type LoadState = "loading" | "empty" | "ready";

interface EasiModuleFrameProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** Módulo EASI renderizado apenas quando há dados. */
  children: React.ReactNode;
}

/**
 * Casca nativa dos módulos EASI: aplica o PageHeader do SMART BID 2.0 e decide,
 * com base nos dados reais, entre spinner (carregando), empty state nativo
 * (sem dados neste site) ou o módulo em si. Assim o usuário nunca vê o erro
 * cru de "lista não encontrada" — só as telas normais do app.
 */
export const EasiModuleFrame: React.FC<EasiModuleFrameProps> = ({
  title,
  subtitle,
  icon,
  children,
}) => {
  const [state, setState] = React.useState<LoadState>("loading");

  React.useEffect(() => {
    let cancelled = false;
    ApiClient.getBenchmarkDataset()
      .then((ds) => {
        if (cancelled) return;
        const hasData =
          (ds.opportunities?.length ?? 0) > 0 || (ds.cost?.length ?? 0) > 0;
        setState(hasData ? "ready" : "empty");
      })
      .catch(() => {
        if (!cancelled) setState("empty");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page}>
      <PageHeader title={title} subtitle={subtitle} icon={icon} />

      {state === "loading" && (
        <div className={styles.stateBox}>
          <span className={styles.spinner} />
          <p className={styles.stateText}>Carregando dados dos BIDs…</p>
        </div>
      )}

      {state === "empty" && (
        <div className={styles.stateBox}>
          <span className={styles.stateIcon}>📭</span>
          <p className={styles.stateTitle}>Nenhum dado disponível</p>
          <p className={styles.stateText}>
            Os BIDs deste módulo ficam em outro site do SharePoint. Abra a
            ferramenta no site que contém a lista de BIDs para visualizar os dados.
          </p>
        </div>
      )}

      {state === "ready" && (
        <div className={`easi-root ${styles.island}`}>{children}</div>
      )}
    </div>
  );
};
