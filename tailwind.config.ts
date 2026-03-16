import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C1917",
        mist: "#F4F1EA",
        clay: "#DCCFC0",
        sage: "#6C7A67",
        pine: "#325346",
        sand: "#F9F7F2"
      },
      boxShadow: {
        panel: "0 18px 45px rgba(28, 25, 23, 0.08)"
      },
      backgroundImage: {
        "soft-radial":
          "radial-gradient(circle at top, rgba(108, 122, 103, 0.18), transparent 42%)"
      }
    }
  },
  plugins: []
};

export default config;
