import type { ReactNode } from "react";
import Image from "next/image";
import { content, contactEmail, type Locale } from "@/lib/content";
import { Architecture, SectorGlyph } from "./architecture";
import { ArchMark, Arrow } from "./brand";
import { Navigation } from "./navigation";
import { DrawLine } from "./draw-line";
import { ScrollLines } from "./scroll-lines";
import { ColumnRule } from "./column-rule";
import { portfolioPath } from "@/lib/portfolio";
import { SiteFooter } from "./site-footer";
import styles from "./home.module.css";

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className={styles.sectionLabel}><span className={styles.labelNumber} dir="ltr">{number}<DrawLine edge="end" /></span><span>{children}</span></div>;
}

export function HomePage({ locale }: { locale: Locale }) {
  const copy = content[locale];
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
            <ColumnRule className={styles.heroDivider} />
            <div className={styles.heroCopy}>
              <div className={styles.heroIntro}>
                <div className={styles.heroEyebrow}><span />{copy.hero.eyebrow}</div>
                <h1 id="hero-title">{copy.hero.headline.map((line, index) => <span key={line} className={index === 2 ? styles.heroEmphasis : undefined}>{index > 0 ? " " : ""}{line}</span>)}</h1>
              </div>
              <div className={styles.heroDetails}>
                <p className={styles.heroDescription}>{copy.hero.description}</p>
                <div className={styles.heroActions}>
                  <a href="#portfolio" className={styles.primaryLink}>{copy.hero.primary}<Arrow /></a>
                  <a href="#contact" className={styles.secondaryLink}>{copy.hero.secondary}</a>
                </div>
              </div>
            </div>
            <Architecture replayLabel={copy.hero.replayMotion} />
            <div className={styles.heroBase}>
              <span>{copy.hero.footnote}</span>
            </div>
          </section>
          <div className={styles.heroRule}><DrawLine /></div>
          <div className={styles.lightBody}>
            <ColumnRule className={styles.mobileRail} />
            <section id="approach" tabIndex={-1} className={`${styles.approach} ${styles.container}`} aria-labelledby="approach-title">
              <SectionLabel number={number(1)}>{copy.approach.label}</SectionLabel>
              <div className={styles.sectionIntroduction}>
                <h2 id="approach-title">{copy.approach.title}</h2>
                <p>{copy.approach.introduction}</p>
              </div>
              <div className={styles.approachGrid}>{copy.approach.items.map((item, index) => <div key={item.english} className={styles.approachItem}>
                {index > 0 ? <ColumnRule className={styles.cardDivider} /> : null}
                <DrawLine />
                <div className={styles.approachItemTop}><span dir="ltr">0{index + 1}</span><span className={styles.smallCross} aria-hidden="true">+</span></div>
                <div className={styles.approachTitle}><h3>{item.title}</h3></div>
                <p>{item.description}</p>
              </div>)}</div>
            </section>
            <section id="portfolio" tabIndex={-1} className={`${styles.portfolio} ${styles.container}`} aria-labelledby="portfolio-title">
              <div className={styles.sectionRule}><DrawLine /><SectionLabel number={number(2)}>{copy.portfolio.label}</SectionLabel></div>
              <div className={styles.sectionIntroduction}>
                <h2 id="portfolio-title">{copy.portfolio.title}</h2>
              </div>
              <div className={styles.portfolioGrid}>{copy.portfolio.companies.map((company, index) => (
                <a key={company.id} href={portfolioPath(locale, company.id)} className={styles.portfolioCompany} aria-label={`${company.name} — ${copy.portfolio.read}`} data-company={company.id}>
                  {index > 0 ? <ColumnRule className={styles.cardDivider} /> : null}
                  <div className={styles.portfolioLogoStage}>
                    <DrawLine /><DrawLine edge="bottom" /><DrawLine edge="start" /><DrawLine edge="end" />
                    <span className={styles.portfolioIndex}>{number(index + 1)}</span>
                    <Image src={company.logo} alt={company.name} width={220} height={90} className={`${styles.portfolioLogo} ${styles[`${company.id}Logo`]}`} unoptimized />
                    <span className={styles.portfolioVisit} aria-hidden="true"><Arrow /></span>
                  </div>
                  <div className={styles.portfolioInformation}>
                    <h3>{company.name}</h3>
                    <p>{company.teaser}</p>
                    <span className={styles.portfolioDomain}><DrawLine /><span>{copy.portfolio.read}</span><Arrow /></span>
                  </div>
                </a>
              ))}</div>
            </section>
            <section id="sectors" tabIndex={-1} className={`${styles.sectors} ${styles.container}`} aria-labelledby="sectors-title">
              <div className={styles.sectionRule}><DrawLine /><SectionLabel number={number(3)}>{copy.sectors.label}</SectionLabel></div>
              <div className={styles.sectionIntroduction}>
                <h2 id="sectors-title">{copy.sectors.title}</h2>
              </div>
              <div className={styles.sectorList}><ColumnRule className={styles.sectorDivider} /><DrawLine />{copy.sectors.items.map((item, index) => <article key={item.english} className={styles.sectorRow}>
                <DrawLine edge="bottom" />
                <span className={styles.sectorNumber}>{number(index + 1)}</span>
                <div className={styles.sectorName}><h3>{item.title}</h3></div>
                <p>{item.description}</p>
                <SectorGlyph index={index} />
              </article>)}</div>
            </section>
          </div>
          <section id="about" tabIndex={-1} className={styles.about} aria-labelledby="about-title">
            <DrawLine /><DrawLine edge="bottom" /><ColumnRule className={styles.mobileRail} />
            <div className={`${styles.container} ${styles.aboutInner}`}>
              <ColumnRule className={styles.aboutDivider} />
              <div className={styles.aboutContent}>
                <SectionLabel number={number(4)}>{copy.about.label}</SectionLabel>
                <h2 id="about-title">{copy.about.title[0]}<span> {copy.about.title[1]}</span></h2>
                {copy.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className={styles.aboutVisual} aria-hidden="true"><div className={styles.aboutOrbit}><svg viewBox="0 0 430 430" fill="none" stroke="currentColor" strokeWidth="1" data-draw-art=""><circle cx="215" cy="215" r="214.5" opacity=".1" /><circle cx="215" cy="215" r="180.5" opacity=".06" /><path d="M-30 74H460M-30 356H460" transform="rotate(-45 215 215)" opacity=".08" /></svg></div><ArchMark data-draw-art="" /><span dir="ltr">CONTINUITY / POSSIBILITY</span></div>
            </div>
          </section>
          <section id="contact" tabIndex={-1} className={styles.contact} aria-labelledby="contact-title">
            <ColumnRule className={styles.mobileRail} />
            <div className={styles.container}>
              <SectionLabel number={number(5)}>{copy.contact.label}</SectionLabel>
              <div className={styles.contactLayout}>
                <ColumnRule className={styles.contactDivider} />
                <h2 id="contact-title">{copy.contact.title}</h2>
                <p>{copy.contact.description}</p>
              </div>
              <a className={styles.contactEmail} href={`mailto:${contactEmail}`} aria-label={`${copy.contact.action}: ${contactEmail}`}><DrawLine edge="bottom" /><span dir="ltr">{contactEmail}</span><span className={styles.contactArrow}><svg className={styles.contactCircle} viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden="true" data-draw-art=""><circle cx="50" cy="50" r="49.5" vectorEffect="non-scaling-stroke" /></svg><Arrow /></span></a>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter locale={locale} />
      <ScrollLines />
    </>
  );
}
