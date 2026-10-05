/**
 * useRegisterQuotationSuppliers — After a quotation is saved, adds its new
 * suppliers to the Suppliers page and learns document names as aliases.
 * Never blocks or fails the quotation save itself.
 */
import * as React from "react";
import { ISupplierEntry, useSupplierStore } from "../stores/useSupplierStore";
import { useUIStore } from "../stores/useUIStore";

export function useRegisterQuotationSuppliers(): (
  entries: ISupplierEntry[],
) => void {
  const ensure = useSupplierStore((s) => s.ensureSuppliersForQuotations);
  const addToast = useUIStore((s) => s.addToast);

  return React.useCallback(
    (entries: ISupplierEntry[]) => {
      ensure(entries)
        .then(({ created }) => {
          if (created.length === 1) {
            addToast({
              type: "success",
              title: `Supplier "${created[0].name}" added to Suppliers`,
            });
          } else if (created.length > 1) {
            addToast({
              type: "success",
              title: `${created.length} suppliers added to Suppliers`,
            });
          }
        })
        .catch((err) => {
          console.error("Supplier registration failed", err);
          addToast({
            type: "warning",
            title:
              "Quotation saved, but the supplier could not be added to Suppliers",
          });
        });
    },
    [ensure, addToast],
  );
}
