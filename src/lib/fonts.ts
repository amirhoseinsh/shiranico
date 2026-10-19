import localFont from "next/font/local";

export const peyda = localFont({
  src: [
    { path: "../assets/fonts/PeydaWeb-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/PeydaWeb-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/PeydaWeb-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/PeydaWeb-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-peyda",
  display: "swap",
  preload: true,
  fallback: ["Tahoma", "Arial", "sans-serif"],
});
