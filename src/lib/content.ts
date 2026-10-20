export type Locale = "fa" | "en";
export type SectionId = "approach" | "portfolio" | "sectors" | "about" | "contact";

export interface PortfolioCompany {
  id: "wishwork" | "spash" | "iranchina";
  name: string;
  category: string;
  description: string;
  teaser: string;
  domain: string;
  url: string;
  logo: string;
}

export interface SiteContent {
  locale: Locale;
  name: string;
  title: string;
  description: string;
  skip: string;
  menu: string;
  closeMenu: string;
  navigation: { id: SectionId; label: string }[];
  language: string;
  languageLabel: string;
  hero: {
    eyebrow: string;
    headline: [string, string, string];
    description: string;
    primary: string;
    secondary: string;
    footnote: string;
    replayMotion: string;
  };
  approach: {
    label: string;
    title: string;
    introduction: string;
    items: { title: string; english: string; description: string }[];
  };
  portfolio: {
    label: string;
    title: string;
    visit: string;
    read: string;
    companies: PortfolioCompany[];
  };
  sectors: {
    label: string;
    title: string;
    items: { title: string; english: string; description: string }[];
  };
  about: {
    label: string;
    title: [string, string];
    paragraphs: string[];
  };
  contact: {
    label: string;
    title: string;
    description: string;
    action: string;
  };
  footer: { tagline: string; copyright: string; top: string };
}

const fa: SiteContent = {
  locale: "fa",
  name: "گروه سرمایه‌گذاری شیرانی",
  title: "شیرانی | سرمایه برای ساختن ارزش ماندگار",
  description: "شیرانی، گروه سرمایه‌گذاری در حوزه‌های فناوری، انرژی، فناوری مالی، هوش مصنوعی و دارایی‌های واقعی؛ با رویکرد سرمایه‌گذاری، ساختن و مالکیت بلندمدت.",
  skip: "رفتن به محتوای اصلی",
  menu: "باز کردن فهرست",
  closeMenu: "بستن فهرست",
  navigation: [
    { id: "approach", label: "رویکرد ما" },
    { id: "portfolio", label: "سرمایه‌گذاری‌ها" },
    { id: "sectors", label: "حوزه‌های فعالیت" },
    { id: "about", label: "درباره شیرانی" },
    { id: "contact", label: "ارتباط با ما" },
  ],
  language: "EN",
  languageLabel: "View the website in English",
  hero: {
    eyebrow: "گروه سرمایه‌گذاری شیرانی",
    headline: ["سرمایه برای", "ساختن ارزش", "ماندگار."],
    description: "سرمایه‌گذاری خصوصی و جسورانه، همراه با توان ساختن.",
    primary: "سرمایه‌گذاری‌های ما",
    secondary: "گفت‌وگو کنیم",
    footnote: "ریشه در ایران. نگاه به آینده.",
    replayMotion: "بازپخش",
  },
  approach: {
    label: "رویکرد ما",
    title: "همراه در ساختن.",
    introduction: "سرمایه و توان اجرا، با نگاه بلندمدت.",
    items: [
      { title: "سرمایه‌گذاری", english: "Invest", description: "پشتوانهٔ کسب‌وکارهایی با نیاز واقعی و ظرفیت رشد." },
      { title: "ساختن", english: "Build", description: "همراهی در توسعه محصول و توان اجرایی." },
      { title: "مالکیت بلندمدت", english: "Own", description: "تعهد به رشد پایدار در گذر زمان." },
    ],
  },
  portfolio: {
    label: "سرمایه‌گذاری‌های ما",
    title: "کسب‌وکارهای ما.",
    visit: "مشاهده وب‌سایت",
    read: "آشنایی بیشتر",
    companies: [
      { id: "wishwork", name: "ویش‌ورک", category: "فناوری و توسعه محصول", teaser: "طراحی و توسعه محصول دیجیتال.", description: "طراحی و توسعه محصولات دیجیتال، راهکارهای نرم‌افزاری سازمانی و هوش مصنوعی.", domain: "wishwork.org", url: "https://wishwork.org", logo: "/portfolio/wishwork.svg" },
      { id: "spash", name: "اسپاش", category: "فناوری فضای کار", teaser: "رزرو و مدیریت فضای کار.", description: "پلتفرم جست‌وجو، رزرو و مدیریت فضاهای کار اشتراکی و فضاهای کاری انعطاف‌پذیر.", domain: "spash.space", url: "https://spash.space", logo: "/portfolio/spash.svg" },
      { id: "iranchina", name: "ایران چین", category: "آموزش و خدمات بین‌المللی", teaser: "آموزش و خدمات مرتبط با چین.", description: "آموزش زبان چینی، خدمات تحصیلی و ترجمه، در پیوند میان ایران و چین.", domain: "iranchina.org", url: "https://www.iranchina.org", logo: "/portfolio/iranchina.svg" },
    ],
  },
  sectors: {
    label: "حوزه‌های فعالیت",
    title: "پنج حوزهٔ تمرکز.",
    items: [
      { title: "فناوری", english: "Technology", description: "محصولات و زیرساخت‌های دیجیتال." },
      { title: "انرژی", english: "Energy", description: "بهره‌وری و مدیریت مصرف." },
      { title: "فناوری مالی", english: "Fintech", description: "پرداخت و زیرساخت‌های مالی." },
      { title: "هوش مصنوعی", english: "Artificial intelligence", description: "هوش مصنوعی در خدمت کسب‌وکار." },
      { title: "دارایی‌های واقعی", english: "Real assets", description: "دارایی‌های مولد با نگاه بلندمدت." },
    ],
  },
  about: {
    label: "درباره شیرانی",
    title: ["ریشه‌های عمیق.", "افق‌های باز."],
    paragraphs: [
      "کسب‌وکارهایی را همراهی می‌کنیم که به نیازهای واقعی پاسخ می‌دهند و ارزش پایدار می‌سازند.",
    ],
  },
  contact: {
    label: "ارتباط با ما",
    title: "گفت‌وگو کنیم.",
    description: "برای سرمایه‌گذاری یا همکاری، در ارتباط باشیم.",
    action: "ارسال ایمیل به شیرانی",
  },
  footer: {
    tagline: "سرمایه‌گذاری / ساختن / مالکیت",
    copyright: "تمامی حقوق برای گروه سرمایه‌گذاری شیرانی محفوظ است.",
    top: "بازگشت به بالا",
  },
};

const en: SiteContent = {
  locale: "en",
  name: "SHIRANI Investment Group",
  title: "SHIRANI | Capital for enduring value",
  description: "SHIRANI invests, builds and owns across technology, energy, fintech, artificial intelligence and real assets. Private equity and venture capital with a long-term perspective.",
  skip: "Skip to main content",
  menu: "Open navigation",
  closeMenu: "Close navigation",
  navigation: [
    { id: "approach", label: "Our approach" },
    { id: "portfolio", label: "Portfolio" },
    { id: "sectors", label: "Our focus" },
    { id: "about", label: "About SHIRANI" },
    { id: "contact", label: "Get in touch" },
  ],
  language: "فا",
  languageLabel: "مشاهده وب‌سایت به زبان فارسی",
  hero: {
    eyebrow: "SHIRANI Investment Group",
    headline: ["Capital for", "enduring", "value."],
    description: "Private equity and venture capital, backed by the ability to build.",
    primary: "View our portfolio",
    secondary: "Get in touch",
    footnote: "Rooted in Iran. Looking ahead.",
    replayMotion: "Replay",
  },
  approach: {
    label: "Our approach",
    title: "Partners in building.",
    introduction: "Capital and operating support, with a long-term perspective.",
    items: [
      { title: "Invest", english: "Invest", description: "Backing real needs and the potential to grow." },
      { title: "Build", english: "Build", description: "Helping develop products and the ability to execute." },
      { title: "Own", english: "Own", description: "Staying committed to lasting value over time." },
    ],
  },
  portfolio: {
    label: "Our portfolio",
    title: "Businesses we back.",
    visit: "Visit website",
    read: "Read profile",
    companies: [
      { id: "wishwork", name: "Wish Work", category: "Technology & product engineering", teaser: "Digital product design and engineering.", description: "Digital product design and engineering, enterprise software solutions and applied artificial intelligence.", domain: "wishwork.org", url: "https://wishwork.org", logo: "/portfolio/wishwork.svg" },
      { id: "spash", name: "Spash", category: "Workspace technology", teaser: "Workspace booking and management.", description: "A platform for discovering, booking and managing coworking spaces and flexible workspaces.", domain: "spash.space", url: "https://spash.space", logo: "/portfolio/spash.svg" },
      { id: "iranchina", name: "IranChina", category: "Education & international services", teaser: "Chinese education and specialist services.", description: "Chinese language learning, study-abroad services and translation, connecting Iran and China.", domain: "iranchina.org", url: "https://www.iranchina.org", logo: "/portfolio/iranchina.svg" },
    ],
  },
  sectors: {
    label: "Our focus",
    title: "Five areas of focus.",
    items: [
      { title: "Technology", english: "Technology", description: "Digital products and infrastructure." },
      { title: "Energy", english: "Energy", description: "Efficiency and energy management." },
      { title: "Fintech", english: "Fintech", description: "Payments and financial infrastructure." },
      { title: "Artificial intelligence", english: "Artificial intelligence", description: "Practical intelligence for business." },
      { title: "Real assets", english: "Real assets", description: "Productive assets with lasting value." },
    ],
  },
  about: {
    label: "About SHIRANI",
    title: ["Deep roots.", "Open horizons."],
    paragraphs: [
      "We back businesses that meet real needs and create lasting value.",
    ],
  },
  contact: {
    label: "Get in touch",
    title: "Let’s build together.",
    description: "For investment and collaboration.",
    action: "Email SHIRANI",
  },
  footer: {
    tagline: "Invest / Build / Own",
    copyright: "SHIRANI Investment Group. All rights reserved.",
    top: "Back to top",
  },
};

export const content: Record<Locale, SiteContent> = { fa, en };
export const siteUrl = "https://shirani.co";
export const contactEmail = "contact@shirani.co";
