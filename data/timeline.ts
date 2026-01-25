export type TimelineItem = {
  title: string;
  organization: string;
  location: string;
  date: string;
  description: string;
  highlighted?: boolean;
};

export const timeline: TimelineItem[] = [
  {
    title: "BSc in Applied Artificial Intelligence",
    organization: "VILNIUS TECH",
    location: "Vilnius, Lithuania",
    date: "Sep 2023 – Present",
    description:
      "• Applied AI undergraduate student focused on software engineering + AI foundations\n• Building real full-stack projects alongside study",
    highlighted: true,
  },
  {
    title: "Erasmus Exchange Semester",
    organization: "Erasmus Programme",
    location: "Lisbon, Portugal",
    date: "5 months",
    description:
      "• International academic experience through Erasmus exchange\n• Adapted to a new learning environment and culture",
  },
  {
    title: "Junior IT Specialist",
    organization: "Al Tayef Overseas Ltd.",
    location: "Dhaka, Bangladesh",
    date: "2019 – 2021",
    description:
      "• Provided IT support and technical assistance\n• Managed WordPress website updates, hosting, and content maintenance\n• Troubleshot day-to-day system issues",
  },
  {
    title: "Founder / Developer",
    organization: "EduFriends Global",
    location: "Remote",
    date: "2021 – Present",
    description:
      "• Built a multi-role education consultancy platform\n• Worked on role-based flows and real user-facing features",
  },
];

