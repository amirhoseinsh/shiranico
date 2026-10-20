"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale, SiteContent } from "@/lib/content";
import { ArchMark, Arrow, Wordmark } from "./brand";
import styles from "./home.module.css";

type NavigationProps = Pick<SiteContent, "navigation" | "name" | "menu" | "closeMenu" | "language" | "languageLabel"> & { locale: Locale; sectionPrefix?: string; languageHref?: string };

export function Navigation({ locale, navigation, name, menu, closeMenu, language, languageLabel, sectionPrefix = "", languageHref = locale === "fa" ? "/en" : "/" }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(false);
    }
    const desktop = window.matchMedia("(min-width: 1001px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header ref={headerRef} className={styles.header}>
      <a href={locale === "fa" ? "/" : "/en"} className={styles.brand} aria-label={name}>
        <ArchMark className={styles.brandMark} />
        <span className={styles.brandType}><Wordmark /><span dir="ltr">INVEST / BUILD / OWN</span></span>
      </a>
      <div className={styles.headerTools}>
        <a href={languageHref} hrefLang={locale === "fa" ? "en" : "fa"} lang={locale === "fa" ? "en" : "fa"} aria-label={languageLabel} className={styles.language}>{language}<Arrow /></a>
        <button ref={toggleRef} className={styles.menuToggle} type="button" aria-expanded={open} aria-controls="main-navigation" aria-label={open ? closeMenu : menu} onClick={() => setOpen(!open)}>
          <span className={open ? styles.menuOpen : ""} /><span className={open ? styles.menuOpen : ""} />
        </button>
      </div>
      <nav id="main-navigation" aria-label={locale === "fa" ? "فهرست اصلی" : "Main navigation"} className={`${styles.navigation} ${open ? styles.navigationOpen : ""}`}>
        {navigation.map((item) => <a key={item.id} href={`${sectionPrefix}#${item.id}`} onClick={() => setOpen(false)}>{item.label}{item.id === "contact" ? <Arrow /> : null}</a>)}
      </nav>
    </header>
  );
}
