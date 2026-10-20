import { content, type Locale } from "@/lib/content";
import { ArchMark, Arrow, Wordmark } from "./brand";
import { ColumnRule } from "./column-rule";
import { DrawLine } from "./draw-line";
import styles from "./home.module.css";

export function SiteFooter({ locale, languageHref = locale === "fa" ? "/en" : "/" }: { locale: Locale; languageHref?: string }) {
  const copy = content[locale];
  const isPersian = locale === "fa";
  return (
    <footer className={styles.footer}>
      <ColumnRule className={styles.mobileRail} />
      <div className={styles.container}>
        <div className={styles.footerTop}><a href={isPersian ? "/" : "/en"} aria-label={copy.name} className={styles.footerBrand}><ArchMark /><Wordmark /></a><span>{copy.footer.tagline}</span><a href="#top" className={styles.backToTop}>{copy.footer.top}<Arrow direction="up" /></a></div>
        <div className={styles.footerBottom}><DrawLine /><span><bdi>© {new Intl.NumberFormat(locale, { useGrouping: false }).format(new Date().getFullYear())}</bdi> {copy.footer.copyright}</span><a href={languageHref} hrefLang={isPersian ? "en" : "fa"} lang={isPersian ? "en" : "fa"}>{isPersian ? "English version" : "نسخه فارسی"}<Arrow /></a><span dir="ltr">SHIRANI.CO</span></div>
      </div>
    </footer>
  );
}
