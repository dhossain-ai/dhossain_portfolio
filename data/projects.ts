export type ProjectLink = {
  label: string;
  url: string;
  kind?: "primary" | "secondary" | "tertiary";
};

export type Project = {
  title: string;
  description: string;
  year: number;
  tech: string[];
  slug: string;
  links: ProjectLink[];
  featured?: boolean;
  beta?: boolean;
  // New Case Study Fields
  tagline: string;
  statusBadge: string;
  quickFacts: {
    role: string;
    type: string;
    location?: string;
    usage?: string;
    note?: string;
  };
  whatIDid: string[];
  keyFeatures: string[];
  challengesAndLearnings: string[];
};

export const projects: Project[] = [
  {
    slug: "lexnova",
    title: "LexNova Legal Platform",
    tagline: "Web platform + admin dashboard + Android app for legal services",
    statusBadge: "Beta",
    description:
      "A legal services platform with a public site, admin dashboard, and a Flutter Android app for managing services, content, and enquiries.",
    year: 2024,
    tech: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "Flutter",
      "Cloudinary",
      "Vercel",
    ],
    links: [
      {
        label: "Live",
        url: "https://lexnovaeu.vercel.app",
        kind: "primary",
      },
      {
        label: "Code",
        url: "https://github.com/Shahadat99x/lawfirm-pwa-platform",
        kind: "secondary",
      },
    ],
    featured: true,
    beta: true,
    quickFacts: {
      role: "Solo Developer",
      type: "Web + Admin + Mobile",
      note: "Demo product for legal firms (showcase)",
    },
    whatIDid: [
      "Built responsive web UI with premium layout and content structure",
      "Implemented admin flows and backend integration",
      "Designed mobile app experience in Flutter for Android",
    ],
    keyFeatures: [
      "Role-based access flow (admin/user)",
      "Services pages + blog/knowledge content",
      "Enquiry/contact capture",
      "Media uploads and content updates",
      "Mobile-friendly UX",
      "Deployment-ready setup",
    ],
    challengesAndLearnings: [
      "Building consistent UI across web + mobile",
      "Structuring content and admin workflows",
      "Deployment + environment configuration",
      "Improving reliability through iteration and feedback",
    ],
  },
  {
    slug: "edufriends-global",
    title: "EduFriends Global",
    tagline: "Multi-role education consultancy platform (web + Android)",
    statusBadge: "Live",
    description:
      "An education consultancy platform with multiple user roles (owner, admin, student) and real usage across web and Android.",
    year: 2021,
    tech: ["React/Next.js", "Firebase", "MongoDB", "Tailwind CSS"],
    links: [
      {
        label: "Live",
        url: "https://edufriendsglobal.com",
        kind: "primary",
      },
    ],
    featured: true,
    quickFacts: {
      role: "Founder / Developer",
      type: "Web + Android",
      usage: "500+ monthly visits, 100+ Android installs",
    },
    whatIDid: [
      "Designed multi-role structure (owner/admin/student flows)",
      "Built core platform features for consultancy operations",
      "Deployed and maintained the platform with real users",
    ],
    keyFeatures: [
      "Multi-role accounts and dashboards",
      "Student/application workflow support",
      "Content/pages for services and guidance",
      "Real deployment with ongoing improvements",
    ],
    challengesAndLearnings: [
      "Designing role-based flows that scale",
      "Handling real user feedback and iteration",
      "Balancing study with shipping features",
    ],
  },
  {
    slug: "estatenova",
    title: "EstateNova Real Estate Platform",
    tagline: "Property listing and lead capture platform",
    statusBadge: "Live",
    description:
      "A real estate web platform focused on property listings, enquiry capture, and clean presentation.",
    year: 2024,
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    links: [
      {
        label: "Live",
        url: "https://estatenova.vercel.app",
        kind: "primary",
      },
      {
        label: "Code",
        url: "https://github.com/Shahadat99x/real-estate-lead-platform",
        kind: "secondary",
      },
    ],
    featured: true,
    quickFacts: {
      role: "Solo Developer",
      type: "Web Platform",
    },
    whatIDid: [
      "Built listings UI and lead capture flow",
      "Focused on clean layout and usability",
      "Deployed as a fast, responsive web app",
    ],
    keyFeatures: [
      "Property listing layout",
      "Enquiry/lead capture",
      "Mobile responsive UI",
      "Fast deployment workflow",
    ],
    challengesAndLearnings: [
      "UI consistency for cards and grids",
      "Making pages responsive across devices",
      "Shipping clean, minimal UX",
    ],
  },
];
