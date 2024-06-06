/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  colors: {
    text: "var(--text)",
    background: "var(--background)",
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    accent: "var(--accent)",
  },
  daisyui: {
    themes: ["light", "dark"],
    themes: [
      {
        light: {
          primary: "#6513eb",
          secondary: "#b393d6",
          accent: "#ff5eb4",
          neutral: "#221a33",
          "base-100": "#faf9fc",
        },
        dark: {
          primary: "#6613ec",
          secondary: "#49296b",
          accent: "#a30057",
          neutral: "#261736",
          "base-100": "#050307",
        },
      },
    ],
  },
};
