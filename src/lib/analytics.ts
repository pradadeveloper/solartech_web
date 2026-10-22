// dataLayer para GTM (GTM-WVZQJV4W). Eventos de conversión definidos en el brief:
// quote_start, quote_step_{n}, quote_complete, generate_lead, whatsapp_click,
// phone_click, file_upload, pdf_download.

type DataLayerEvent = Record<string, unknown> & { event?: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function pushEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

export type ConsentChoice = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "st_consent_v1";

/** Actualiza Consent Mode v2. GTM decide qué etiquetas disparar según esto. */
export function updateConsent(choice: { analytics: ConsentChoice; marketing: ConsentChoice }) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  // gtag() exige pasar el objeto `arguments`, no un array.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments as unknown as DataLayerEvent);
  }
  gtag("consent", "update", {
    analytics_storage: choice.analytics,
    ad_storage: choice.marketing,
    ad_user_data: choice.marketing,
    ad_personalization: choice.marketing,
  });
  pushEvent("consent_update", choice);
}
