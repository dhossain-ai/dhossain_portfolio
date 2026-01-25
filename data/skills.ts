export type SkillGroup = {
  title: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Core Stack",
    items: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
    ],
  },
  {
    title: "Mobile & Hybrid",
    items: [
      "Flutter",
      "Dart",
      "PWA",
    ],
  },
  {
    title: "DevOps & Infrastructure",
    items: [
      "Docker",
      "Vercel",
      "Git",
      "Backend Integration",
    ],
  },
];
