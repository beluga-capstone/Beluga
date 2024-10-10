import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "hover-on-surface": "var(--hover-on-surface)",
        surface: "var(--surface)",
        "light-surface": "#ededed",
        "on-surface": "var(--on-surface)",
      },
    },
  },
  plugins: [],
};
export default config;
