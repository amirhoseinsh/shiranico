import Image from "next/image";
import { content, contactEmail, type Locale } from "@/lib/content";
import { backingStories, getPortfolioCompany, portfolioIds, portfolioLabels, portfolioPath, portfolioProfiles, type PortfolioId } from "@/lib/portfolio";
import { Arrow } from "./brand";
import { ColumnRule } from "./column-rule";
import { DrawLine } from "./draw-line";
import { Navigation } from "./navigation";
import { ScrollLines } from "./scroll-lines";
import { SiteFooter } from "./site-footer";
import shared from "./home.module.css";
import styles from "./portfolio-page.module.css";

export function PortfolioPage({ locale, id }: { locale: Locale; id: PortfolioId }) {
  const copy = content[locale];
  const company = getPortfolioCompany(locale, id);
  const profile = portfolioProfiles[locale][id];
  const story = backingStories[locale][id];
  const labels = portfolioLabels[locale];
  const home = locale === "fa" ? "/" : "/en";
  const otherLanguage = portfolioPath(locale === "fa" ? "en" : "fa", id);
  const nextId = portfolioIds[(portfolioIds.indexOf(id) + 1) % portfolioIds.length];
  const nextCompany = getPortfolioCompany(locale, nextId);
  const number = (value: number) => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(value);

  return (
    <>
      <a href="#main" className={shared.skip}>{copy.skip}</a>
      <div id="top" className={shared.darkOpening}>
        <div className={shared.container}><Navigation locale={locale} navigation={copy.navigation} name={copy.name} menu={copy.menu} closeMenu={copy.closeMenu} language={copy.language} languageLabel={copy.languageLabel} sectionPrefix={home} languageHref={otherLanguage} /></div>
        <main id="main" tabIndex={-1}>
          <section className={`${shared.container} ${styles.hero}`} aria-labelledby="company-title">
            <ColumnRule className={styles.heroDivider} />
            <div className={styles.heroCopy}>
              <a href={`${home}#portfolio`} className={styles.back}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4M11 5L4 12L11 19" stroke="currentColor" strokeWidth="1.2" /></svg>{labels.back}</a>
              <p className={styles.eyebrow}>{company.category}</p>
              <h1 id="company-title">{company.name}</h1>
              <p className={styles.tagline}>{profile.tagline}</p>
              <a href={company.url} target="_blank" rel="noopener noreferrer" className={styles.website} data-company-website=""><bdi>{company.domain}</bdi><Arrow /></a>
            </div>
            <div className={styles.logoPanel}>
              <DrawLine /><DrawLine edge="bottom" /><DrawLine edge="start" /><DrawLine edge="end" />
              <span className={styles.panelCaption} dir="ltr">SHIRANI / PORTFOLIO</span>
              <Image src={company.logo} alt={company.name} width={320} height={160} className={`${styles.companyLogo} ${styles[id]}`} unoptimized priority />
              <span className={styles.panelDomain} dir="ltr">{company.domain}</span>
            </div>
          </section>
          <div className={styles.paper}>
            <div className={shared.container}>
              <section className={styles.split} aria-labelledby="overview-title">
                <ColumnRule className={styles.splitDivider} />
                <div className={styles.sectionCaption}><span>{number(1)}</span><h2 id="overview-title">{labels.overview}</h2></div>
                <div className={styles.prose}>{profile.introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  <div className={styles.sources} aria-label={labels.sources}>{profile.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<Arrow /></a>)}</div>
                </div>
              </section>
              <section className={styles.capabilities} aria-labelledby="capabilities-title">
                <DrawLine />
                <div className={styles.sectionCaption}><span>{number(2)}</span><h2 id="capabilities-title">{labels.capabilities}</h2></div>
                <div className={styles.capabilityGrid}>{profile.capabilities.map((capability, index) => <article className={styles.capability} key={capability.title}>
                  <ColumnRule className={styles.capabilityRail} />
                  {index > 0 ? <ColumnRule className={styles.cardDivider} /> : null}
                  <span className={styles.itemNumber}>{number(index + 1)}</span><h3>{capability.title}</h3><p>{capability.description}</p>
                </article>)}</div>
              </section>
            </div>
          </div>
          <section className={styles.backing} id="backing" aria-labelledby="backing-title">
            <DrawLine /><DrawLine edge="bottom" />
            <div className={`${shared.container} ${styles.split}`}>
              <ColumnRule className={styles.splitDivider} />
              <div className={styles.sectionCaption}><span>{number(3)}</span><h2 id="backing-title">{labels.why}</h2></div>
              <div className={styles.prose}><p className={styles.backingLead}>{story.introduction}</p>{story.reasons.map(reason => <div key={reason.title} className={styles.reason}><DrawLine /><h3>{reason.title}</h3><p>{reason.description}</p></div>)}</div>
            </div>
          </section>
          <section className={`${shared.container} ${styles.closing}`} aria-label={labels.next}>
            <a href={portfolioPath(locale, nextId)} className={styles.nextCompany}><span>{labels.next}</span><strong>{nextCompany.name}</strong><Arrow /></a>
            <DrawLine edge="bottom" />
            <div className={styles.conversation}><DrawLine /><p>{labels.conversation}</p><a href={`mailto:${contactEmail}`}>{labels.contact}<Arrow /></a></div>
          </section>
        </main>
      </div>
      <SiteFooter locale={locale} languageHref={otherLanguage} />
      <ScrollLines />
    </>
  );
}
