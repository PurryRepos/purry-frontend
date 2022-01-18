module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    container: {
      padding: {
        xl: "2rem",
        "2xl": "10rem",
      },
    },
  },
  plugins: [require("daisyui")],
};
