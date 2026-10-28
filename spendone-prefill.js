// SpendOne order window handoff: reads order data from the URL fragment
// (#orderNo=...&street=...), keeps it for this tab and removes it from the address bar.
// Loaded in <head> on every page that can be the entry point, before anything touches location.hash.
// Card data is never part of the fragment; values are only ever set via .value / textContent.
window.readSpendOnePrefill = function () {
  const params = new URLSearchParams(location.hash.slice(1));
  if (!params.has("orderNo")) {
    // Not a SpendOne link (or already consumed): use what this tab stored
    try { return JSON.parse(sessionStorage.getItem("spendonePrefill") ?? "null"); }
    catch { return null; }
  }

  const prefill = {
    orderNo: params.get("orderNo"),
    invoiceEmail: params.get("invoiceEmail"),
    companyName: params.get("companyName"),
    street: params.get("street"),
    postcodeCity: params.get("postcodeCity"),
    country: params.get("country"),
    taxId: params.get("taxId"),
    buyer: params.get("buyer"),
    total: params.get("total"),
    items: [...params]
      .filter(([key]) => key.startsWith("item-"))
      .map(([key, name]) => ({ id: key.slice(5), name })),
  };

  try { sessionStorage.setItem("spendonePrefill", JSON.stringify(prefill)); } catch {}
  // Drop the fragment, keep path and query
  history.replaceState(null, "", location.pathname + location.search);
  return prefill;
};

window.spendOnePrefill = window.readSpendOnePrefill();
