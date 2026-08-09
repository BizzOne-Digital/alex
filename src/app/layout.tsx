import type { Metadata } from "next";
import { Figtree, Oswald, Outfit } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { DEFAULT_SITE_SETTINGS } from "@/lib/defaults";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: DEFAULT_SITE_SETTINGS.defaultSeoTitle,
    template: "%s | Ikasa Renovations",
  },
  description: DEFAULT_SITE_SETTINGS.defaultSeoDescription,
  icons: {
    icon: "/brand/ikasa-favicon.svg",
    shortcut: "/brand/ikasa-favicon.svg",
    apple: "/brand/ikasa-favicon.svg",
  },
  openGraph: {
    title: DEFAULT_SITE_SETTINGS.defaultSeoTitle,
    description: DEFAULT_SITE_SETTINGS.defaultSeoDescription,
    siteName: DEFAULT_SITE_SETTINGS.companyName,
    type: "website",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: DEFAULT_SITE_SETTINGS.companyName,
  description: DEFAULT_SITE_SETTINGS.shortDescription,
  url: "https://ikasarenovations.ca",
  telephone: DEFAULT_SITE_SETTINGS.phoneTel,
  email: DEFAULT_SITE_SETTINGS.email,
  image: "/brand/ikasa-logo.svg",
  priceRange: "$$",
  areaServed: {
    "@type": "Text",
    name: "Contact for service area availability",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${figtree.variable} ${oswald.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body className="flex min-h-dvh w-full max-w-[100vw] flex-col overflow-x-clip bg-ikasa-warm-white text-ikasa-black font-sans">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
