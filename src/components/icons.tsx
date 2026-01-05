import { type LucideProps } from "lucide-react";

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v8" />
      <path d="M10 10c.5-1 2-1 2.5-2A2 2 0 0 0 10 6" />
      <path d="M14 14c-.5 1-2 1-2.5 2a2 2 0 0 1 2.5 2" />
    </svg>
  ),
};
