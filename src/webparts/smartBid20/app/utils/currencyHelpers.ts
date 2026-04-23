import { useConfigStore } from "../stores/useConfigStore";

/**
 * Returns the list of available currencies from system configuration.
 * Falls back to a default set if config has no exchange rates.
 */
export function getCurrencies(): string[] {
  const cfg = useConfigStore.getState().config;
  const rates = cfg?.currencySettings?.exchangeRates;
  if (rates && rates.length > 0) {
    const list = [cfg.currencySettings.defaultCurrency || "USD"];
    rates.forEach((r: any) => {
      if (list.indexOf(r.currency) < 0) list.push(r.currency);
    });
    return list;
  }
  return ["USD", "BRL", "EUR", "GBP", "NOK"];
}
