import type { ReactNode } from "react";
import { peyda } from "@/lib/fonts";
import "../globals.css";

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={peyda.variable}>
      <body>{children}</body>
    </html>
  );
}
