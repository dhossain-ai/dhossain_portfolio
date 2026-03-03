import { buildMetadata } from "@/lib/seo";
import { CVContent } from "./cv-content";

export const metadata = buildMetadata({
  title: "CV - Shahadat Hossain",
  description:
    "Full-Stack Developer & Applied AI Student. View my resume and explore my projects.",
  path: "/cv",
});

export default function CVPage() {
  return <CVContent />;
}
