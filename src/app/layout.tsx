import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TopBar } from "@/components/layout/top-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/gtm";
import { CookieBanner } from "@/components/analytics/cookie-banner";
import { ClickTracker } from "@/components/analytics/click-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd } from "@/lib/seo";
import { site } from "@/content/site";

// Fuentes variables (un archivo por familia): cada archivo extra que llega obliga a
// re-maquetar la página entera, y eso pesaba segundos en móviles de gama media.
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// La mono solo aparece en cifras y etiquetas pequeñas: sin precarga para no competir con el LCP.
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Paneles solares para empresas en Colombia | Solartech",
    template: "%s | Solartech",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Blog de Solartech" }] } },
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`light ${montserrat.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <GoogleTagManager gtmId={site.gtmId} />
      </head>
      <body className="min-h-dvh">
        <GoogleTagManagerNoScript gtmId={site.gtmId} />
        <ThemeProvider>
          <a href="#contenido" className="sr-only z-[60] rounded-full bg-copper px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
            Saltar al contenido
          </a>
          <TopBar />
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppButton />
          <CookieBanner />
          <ClickTracker />
        </ThemeProvider>
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
