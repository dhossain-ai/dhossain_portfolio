import { AboutContent } from "@/components/about/about-content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn more about Shahadat Hossain's journey as an AI & Data Science Explorer, blending research, product strategy, and hands-on engineering.",
  path: "/about",
});

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shahadat Hossain",
    jobTitle: ["Applied AI student", "Full-stack developer"],
    url: "https://dhossian.com/about",
    sameAs: [
      "https://github.com/Shahadat99x",
      "https://linkedin.com/in/shahadat-ai",
      "https://x.com/shahadat_ai"
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vilnius",
      addressCountry: "Lithuania"
    },
    knowsAbout: ["Next.js", "TypeScript", "Supabase", "Flutter", "Tailwind CSS", "AI/ML", "Computer Vision"]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent />
    </>
  );
}
