import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Geist } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/components/i18n/language-provider"
import "maplibre-gl/dist/maplibre-gl.css"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500"],
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https:/timelessapp.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: "Timeless",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Timeless",
    startupImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  title: {
    default: "Timeless — Ver el pasado desde el lugar real",
    template: "%s | Timeless",
  },
  description:
    "Experiencias históricas inmersivas 180° desde el móvil para comprender el patrimonio desde el lugar real.",

  keywords: [
    "Timeless",
    "Málaga",
    "turismo cultural",
    "patrimonio histórico",
    "realidad aumentada",
    "reconstrucción histórica",
    "experiencias inmersivas",
    "historia de Málaga",
  ],

  authors: [{ name: "Timeless" }],
  creator: "Timeless",
  publisher: "Timeless",

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "Timeless — Ver el pasado desde el lugar real",
    description:
      "Experiencias históricas inmersivas 180° desde el móvil para comprender el patrimonio desde el lugar real.",
    url: "/",
    siteName: "Timeless",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Timeless — experiencia histórica inmersiva",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Timeless — Ver el pasado desde el lugar real",
    description:
      "Experiencias históricas inmersivas 180° desde el móvil para comprender el patrimonio desde el lugar real.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: "/",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1a160e",
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
