module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "abasa-hero":
          "url('https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page.png')",
      },
    },
  },
  plugins: [],
};
