import type { ReactNode } from "react";
import { peyda } from "@/lib/fonts";
import "../globals.css";

export default function PersianLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={peyda.variable}>
      <body>{children}</body>
    </html>
  );
}
