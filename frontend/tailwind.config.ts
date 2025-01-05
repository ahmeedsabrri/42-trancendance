import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'footer-texture': "url('/img/footer-texture.png')",
        'background' :"url('/images/background.jpeg')",
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
	  require("tailwind-scrollbar"),
  ],
} satisfies Config;
