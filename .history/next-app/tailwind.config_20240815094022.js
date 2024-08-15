module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#effef3",
          100: "#dafee6",
          200: "#b8facd",
          300: "#81f4a7",
          400: "#43e578",
          500: "#1acd55",
          600: "#0fa942",
          700: "#108538",
          800: "#126930",
          900: "#115629",
          950: "#033014",
        },
        "blue-annotation": "#2D8CF0",
        "green-annotation": "#19BE6B",
        "yellow-annotation": "#FFBB00",
        "red-annotation": "#E23C39",
        "purple-annotation": "#B620E0",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  safelist: [
    {
      pattern: /bg-(red|green|blue|purple|yellow)-annotation/,
      variants: ["lg", "hover", "focus", "lg:hover"],
    },
    {
      pattern: /border-(red|green|blue|purple|yellow)-annotation/,
      variants: ["lg", "hover", "focus", "lg:hover"],
    },
    {
      pattern: /to-(red|green|blue|purple|yellow)-annotation/,
      variants: ["lg", "hover", "focus", "lg:hover"],
    },
    {
      pattern: /text-(red|green|blue|purple|yellow)-annotation/,
    },
  ],
  plugins: [
    require("@designbycode/tailwindcss-text-stroke"),
    require("tailwind-scrollbar"),
  ],
};
