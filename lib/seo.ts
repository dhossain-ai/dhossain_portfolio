import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { absoluteUrl } from "./utils";

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
};

const baseTitle = `${siteConfig.name} | ${siteConfig.title}`;

export function buildMetadata({
  title,
  description,
  path = "/",
}: BuildMetadataInput = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : baseTitle;
  const pageDescription = description ?? siteConfig.description;
  const url = absoluteUrl(path);

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: absoluteUrl(`/og?title=${encodeURIComponent(title ?? siteConfig.name)}`),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${siteConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      site: "@your-handle",
      creator: "@your-handle",
      images: [
        absoluteUrl(`/og?title=${encodeURIComponent(title ?? siteConfig.name)}`),
      ],
    },
    icons: {
      icon: "/brand/favicon.svg",
      shortcut: "/brand/favicon.svg",
      apple: "/brand/favicon.svg",
    },
  };
}

export const defaultMetadata = buildMetadata();
