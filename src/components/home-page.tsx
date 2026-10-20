import type { ReactNode } from "react";
import Image from "next/image";
import { content, contactEmail, type Locale } from "@/lib/content";
import { Architecture, SectorGlyph } from "./architecture";
import { ArchMark, Arrow, Wordmark } from "./brand";
import { Navigation } from "./navigation";
import styles from "./home.module.css";

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className={styles.sectionLabel}><span className={styles.labelNumber} dir="ltr">{number}</span><span>{children}</span></div>;
}

export function HomePage({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const isPersian = locale === "fa";
  const number = (index: number) => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(index);

  return (
    <>
      <a href="#main" className={styles.skip}>{copy.skip}</a>
      <div className={styles.darkOpening} id="top">
        <div className={styles.container}>
          <Navigation locale={locale} navigation={copy.navigation} name={copy.name} menu={copy.menu} closeMenu={copy.closeMenu} language={copy.language} languageLabel={copy.languageLabel} />
        </div>
        <main id="main" tabIndex={-1}>
          <section className={`${styles.hero} ${styles.container}`} aria-labelledby="hero-title">
            <div className={styles.heroCopy}>
              <div className={styles.heroIntro}>
                <div className={styles.heroEyebrow}><span />{copy.hero.eyebrow}</div>
                <h1 id="hero-title">{copy.hero.headline.map((line, index) => <span key={line} className={index === 2 ? styles.heroEmphasis : undefined}>{index > 0 ? " " : ""}{line}</span>)}</h1>
              </div>
              <div className={styles.heroDetails}>
                <p className={styles.heroDescription}>{copy.hero.description}</p>
                <div className={styles.heroActions}>
                  <a href="#approach" className={styles.primaryLink}>{copy.hero.primary}<Arrow /></a>
                  <a href="#contact" className={styles.secondaryLink}>{copy.hero.secondary}</a>
                </div>
              </div>
            </div>
            <Architecture replayLabel={copy.hero.replayMotion} />
            <div className={styles.heroBase}>
              <span>{copy.hero.footnote}</span>
              <a href="#approach" className={styles.explore}>{copy.hero.scroll}<Arrow direction="down" /></a>
              <span className={styles.heroCoordinates} dir="ltr">PERSPECTIVE / LONG TERM</span>
            </div>
          </section>
          <div className={styles.focusStrip}>
            <div className={styles.container}>{copy.sectors.items.map((item) => <a key={item.english} href="#sectors">{item.title}<span aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth=".8"><path d="M8 1V15M1 8H15M3 3L13 13M3 13L13 3" /></svg></span></a>)}</div>
          </div>
          <div className={styles.lightBody}>
            <section id="approach" tabIndex={-1} className={`${styles.approach} ${styles.container}`} aria-labelledby="approach-title">
              <SectionLabel number={number(1)}>{copy.approach.label}</SectionLabel>
              <div className={styles.sectionIntroduction}>
                <h2 id="approach-title">{copy.approach.title}</h2>
                <p>{copy.approach.introduction}</p>
              </div>
              <div className={styles.approachGrid}>{copy.approach.items.map((item, index) => <div key={item.english} className={styles.approachItem}>
                <div className={styles.approachItemTop}><span dir="ltr">0{index + 1}</span><span className={styles.smallCross} aria-hidden="true">+</span></div>
                <div className={styles.approachTitle}>{isPersian ? <span className={styles.englishCaption} lang="en" dir="ltr">{item.english}</span> : null}<h3>{item.title}</h3></div>
                <p>{item.description}</p>
              </div>)}</div>
            </section>
            <section id="portfolio" tabIndex={-1} className={`${styles.portfolio} ${styles.container}`} aria-labelledby="portfolio-title">
              <SectionLabel number={number(2)}>{copy.portfolio.label}</SectionLabel>
              <div className={styles.sectionIntroduction}>
                <h2 id="portfolio-title">{copy.portfolio.title}</h2>
                <p>{copy.portfolio.introduction}</p>
              </div>
              <div className={styles.portfolioGrid}>{copy.portfolio.companies.map((company, index) => (
                <a key={company.id} href={company.url} target="_blank" rel="noopener noreferrer" className={styles.portfolioCompany} aria-label={`${company.name} — ${copy.portfolio.visit}`} data-company={company.id}>
                  <div className={styles.portfolioLogoStage}>
                    <span className={styles.portfolioIndex}>{number(index + 1)}</span>
                    <Image src={company.logo} alt={company.name} width={220} height={90} className={`${styles.portfolioLogo} ${styles[`${company.id}Logo`]}`} unoptimized />
                    <span className={styles.portfolioVisit} aria-hidden="true"><Arrow /></span>
                  </div>
                  <div className={styles.portfolioInformation}>
                    <span className={styles.portfolioCategory}>{company.category}</span>
                    <h3>{company.name}</h3>
                    <p>{company.description}</p>
                    <span className={styles.portfolioDomain} dir="ltr">{company.domain}<Arrow /></span>
                  </div>
                </a>
              ))}</div>
            </section>
            <section id="sectors" tabIndex={-1} className={`${styles.sectors} ${styles.container}`} aria-labelledby="sectors-title">
              <SectionLabel number={number(3)}>{copy.sectors.label}</SectionLabel>
              <div className={styles.sectionIntroduction}>
                <h2 id="sectors-title">{copy.sectors.title}</h2>
                <p>{copy.sectors.introduction}</p>
              </div>
              <div className={styles.sectorList}>{copy.sectors.items.map((item, index) => <article key={item.english} className={styles.sectorRow}>
                <span className={styles.sectorNumber}>{number(index + 1)}</span>
                <div className={styles.sectorName}><h3>{item.title}</h3>{isPersian ? <span lang="en" dir="ltr">{item.english}</span> : null}</div>
                <p>{item.description}</p>
                <SectorGlyph index={index} />
              </article>)}</div>
            </section>
          </div>
          <section id="about" tabIndex={-1} className={styles.about} aria-labelledby="about-title">
            <div className={`${styles.container} ${styles.aboutInner}`}>
              <div className={styles.aboutContent}>
                <SectionLabel number={number(4)}>{copy.about.label}</SectionLabel>
                <h2 id="about-title">{copy.about.title[0]}<span> {copy.about.title[1]}</span></h2>
                {copy.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <div className={styles.aboutSignature}><span />{copy.about.signature}</div>
              </div>
              <div className={styles.aboutVisual} aria-hidden="true"><div className={styles.aboutOrbit} /><ArchMark /><span dir="ltr">CONTINUITY / POSSIBILITY</span></div>
            </div>
          </section>
          <section id="contact" tabIndex={-1} className={styles.contact} aria-labelledby="contact-title">
            <div className={styles.container}>
              <SectionLabel number={number(5)}>{copy.contact.label}</SectionLabel>
              <div className={styles.contactLayout}>
                <h2 id="contact-title">{copy.contact.title[0]}<span> {copy.contact.title[1]}</span></h2>
                <p>{copy.contact.description}</p>
              </div>
              <a className={styles.contactEmail} href={`mailto:${contactEmail}`} aria-label={`${copy.contact.action}: ${contactEmail}`}><span dir="ltr">{contactEmail}</span><span className={styles.contactArrow}><Arrow /></span></a>
            </div>
          </section>
        </main>
      </div>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerTop}><a href={isPersian ? "/" : "/en"} aria-label={copy.name} className={styles.footerBrand}><ArchMark /><Wordmark /></a><span>{copy.footer.tagline}</span><a href="#top" className={styles.backToTop}>{copy.footer.top}<Arrow direction="up" /></a></div>
          <div className={styles.footerBottom}><span><bdi>© {new Intl.NumberFormat(locale, { useGrouping: false }).format(new Date().getFullYear())}</bdi> {copy.footer.copyright}</span><a href={isPersian ? "/en" : "/"} hrefLang={isPersian ? "en" : "fa"} lang={isPersian ? "en" : "fa"}>{isPersian ? "English version" : "نسخه فارسی"}<Arrow /></a><span dir="ltr">SHIRANI.CO</span></div>
        </div>
      </footer>
    </>
  );
}
