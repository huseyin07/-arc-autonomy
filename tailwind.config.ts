import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#080b0d", panel: "#0e1316", line: "#20292e", acid: "#95f5c3", muted: "#89969c" }, fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"], mono: ["IBM Plex Mono", "SFMono-Regular", "Consolas", "monospace"] } } },
  plugins: [],
} satisfies Config;
