import Script from "next/script";
import { CONSENT_STORAGE_KEY } from "@/lib/analytics";

/** Consent Mode v2 en "denied" por defecto (restaura la elección guardada) y luego GTM. */
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  const consentDefaults = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  functionality_storage: 'granted', security_storage: 'granted', wait_for_update: 500
});
try {
  var c = JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}') || 'null');
  if (c) gtag('consent', 'update', {
    analytics_storage: c.analytics, ad_storage: c.marketing, ad_user_data: c.marketing, ad_personalization: c.marketing
  });
} catch (e) {}
`;

  const gtmLoader = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;

  return (
    <>
      {/* Inline y síncrono en <head>: debe ejecutarse antes de que cargue GTM. */}
      <script id="consent-defaults" dangerouslySetInnerHTML={{ __html: consentDefaults }} />
      <Script id="gtm" strategy="afterInteractive">
        {gtmLoader}
      </Script>
    </>
  );
}

export function GoogleTagManagerNoScript({ gtmId }: { gtmId: string }) {
  return (
    <noscript>
      <iframe
        title="Google Tag Manager"
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
