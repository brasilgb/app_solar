/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    // "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "solar-blue-dark": "#154295",
        "solar-blue-light": "#00AEEF",
        "solar-yellow-dark": "#F18800",
        "solar-yellow-light": "#FFD100",
        "solar-gray-dark": "#F1F1F1",
        "solar-gray-middle": "#F8F8F8",
        "solar-gray-light": "#FAFAFA",
        "solar-orange": "#EC6608",
      },
      fontFamily: {
        Roboto_300Light: ["Roboto_300Light"],
        Roboto_300Light_Italic: ["Roboto_300Light_Italic"],
        Roboto_400Regular: ["Roboto_400Regular"],
        Roboto_400Regular_Italic: ["Roboto_400Regular_Italic"],
        Roboto_500Medium: ["Roboto_500Medium"],
        Roboto_500Medium_Italic: ["Roboto_500Medium_Italic"],
        Roboto_700Bold: ["Roboto_700Bold"],
        Roboto_700Bold_Italic: ["Roboto_700Bold_Italic"],
      }
    },
  },
  plugins: [],
}
