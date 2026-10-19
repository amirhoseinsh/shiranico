export type Locale = "fa" | "en";
export type SectionId = "approach" | "portfolio" | "sectors" | "about" | "contact";

export interface PortfolioCompany {
  id: "wishwork" | "spash" | "iranchina";
  name: string;
  category: string;
  description: string;
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
    scroll: string;
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
    introduction: string;
    visit: string;
    companies: PortfolioCompany[];
  };
  sectors: {
    label: string;
    title: string;
    introduction: string;
    items: { title: string; english: string; description: string }[];
  };
  about: {
    label: string;
    title: [string, string];
    paragraphs: string[];
    signature: string;
  };
  contact: {
    label: string;
    title: [string, string];
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
    description: "سرمایه، اندیشه و توان اجرا را کنار هم می‌آوریم؛ برای ساختن و توسعه کسب‌وکارهایی که فراتر از امروز، ارزش خلق می‌کنند.",
    primary: "آشنایی با رویکرد ما",
    secondary: "شروع یک گفت‌وگو",
    footnote: "ریشه در ایران، نگاه به افق‌های پیش رو",
    scroll: "کشف کنید",
    replayMotion: "بازپخش",
  },
  approach: {
    label: "رویکرد ما",
    title: "فراتر از سرمایه،\nهمراه در ساختن.",
    introduction: "سرمایه‌گذاری جسورانه و سرمایه‌گذاری خصوصی، دو مسیر مکمل برای ما هستند. در هر دو، به پیوند سرمایه با توان عملیاتی و نگاه بلندمدت باور داریم.",
    items: [
      { title: "سرمایه‌گذاری", english: "Invest", description: "فرصت‌ها را در تلاقی نیازهای واقعی و ظرفیت رشد جست‌وجو می‌کنیم؛ از ایده‌های نو تا کسب‌وکارهای آماده توسعه." },
      { title: "ساختن", english: "Build", description: "در کنار سرمایه، در مسیر شکل‌گیری محصول، توسعه کسب‌وکار و تقویت توان اجرایی مشارکت می‌کنیم." },
      { title: "مالکیت بلندمدت", english: "Own", description: "ارزش را در گذر زمان می‌سازیم؛ با مالکیت مسئولانه، همراهی مستمر و توجه به پایداری کسب‌وکار." },
    ],
  },
  portfolio: {
    label: "سرمایه‌گذاری‌های ما",
    title: "کسب‌وکارهایی که\nدر ساختنشان همراهیم.",
    introduction: "از زیرساخت‌های دیجیتال تا فضاهای کار و آموزش؛ سرمایه‌گذاری‌های ما، روایت‌هایی از ساختن و توسعه کسب‌وکار هستند.",
    visit: "مشاهده وب‌سایت",
    companies: [
      { id: "wishwork", name: "ویش‌ورک", category: "فناوری و توسعه محصول", description: "طراحی و توسعه محصولات دیجیتال، راهکارهای نرم‌افزاری سازمانی و هوش مصنوعی.", domain: "wishwork.org", url: "https://wishwork.org", logo: "/portfolio/wishwork.svg" },
      { id: "spash", name: "اسپاش", category: "فناوری فضای کار", description: "پلتفرم جست‌وجو، رزرو و مدیریت فضاهای کار اشتراکی و فضاهای کاری انعطاف‌پذیر.", domain: "spash.space", url: "https://spash.space", logo: "/portfolio/spash.svg" },
      { id: "iranchina", name: "ایران چین", category: "آموزش و خدمات بین‌المللی", description: "آموزش زبان چینی، خدمات تحصیلی و ترجمه، در پیوند میان ایران و چین.", domain: "iranchina.org", url: "https://www.iranchina.org", logo: "/portfolio/iranchina.svg" },
    ],
  },
  sectors: {
    label: "حوزه‌های فعالیت",
    title: "پنج حوزه.\nیک نگاه به آینده.",
    introduction: "بر حوزه‌هایی تمرکز داریم که پیوند آن‌ها می‌تواند ظرفیت‌های تازه‌ای برای اقتصاد و زندگی ایجاد کند.",
    items: [
      { title: "فناوری", english: "Technology", description: "محصولات، پلتفرم‌ها و زیرساخت‌های دیجیتال که شیوه کار و زندگی را بهبود می‌دهند." },
      { title: "انرژی", english: "Energy", description: "راهکارهای تولید، مدیریت و مصرف بهینه انرژی؛ برای بهره‌وری بیشتر و زیرساختی پایدارتر." },
      { title: "فناوری مالی", english: "Fintech", description: "خدمات و زیرساخت‌های مالی که مبادله، تأمین مالی و دسترسی به فرصت‌ها را کارآمدتر می‌کنند." },
      { title: "هوش مصنوعی", english: "Artificial intelligence", description: "کاربردهای عملی داده و هوش مصنوعی برای تصمیم‌های بهتر، بهره‌وری و حل مسائل واقعی." },
      { title: "دارایی‌های واقعی", english: "Real assets", description: "دارایی‌ها و زیرساخت‌های ملموس که با مدیریت فعال و فناوری، ظرفیت ارزش‌آفرینی بلندمدت دارند." },
    ],
  },
  about: {
    label: "درباره شیرانی",
    title: ["ریشه‌های عمیق.", "افق‌های باز."],
    paragraphs: [
      "شیرانی یک گروه سرمایه‌گذاری با تمرکز بر سرمایه‌گذاری خصوصی، سرمایه‌گذاری جسورانه و ساختن کسب‌وکار است. نقطه مشترک این مسیرها برای ما، خلق ارزش ماندگار است.",
      "هویت ما از ایران الهام می‌گیرد؛ از اندیشه ساختن، پیوند اجزا و نگاه به تداوم. با همین ریشه‌ها، فرصت‌ها را با نگاهی باز به فناوری، صنعت و آینده دنبال می‌کنیم.",
    ],
    signature: "اندیشه‌ای برای فردا. تعهدی برای ماندن.",
  },
  contact: {
    label: "ارتباط با ما",
    title: ["آینده، با یک", "گفت‌وگو آغاز می‌شود."],
    description: "برای بررسی فرصت‌های سرمایه‌گذاری، توسعه کسب‌وکار یا شکل‌دادن به یک همکاری تازه، با ما در ارتباط باشید.",
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
    description: "We bring together capital, ideas and the ability to execute. To build and grow businesses that create value beyond today.",
    primary: "Explore our approach",
    secondary: "Start a conversation",
    footnote: "Rooted in Iran. Open to what comes next.",
    scroll: "Explore",
    replayMotion: "Replay",
  },
  approach: {
    label: "Our approach",
    title: "Beyond capital.\nA partner in building.",
    introduction: "Venture capital and private equity are complementary paths. Across both, we believe in connecting capital with operating capability and a long-term perspective.",
    items: [
      { title: "Invest", english: "Invest", description: "We look for opportunity where real needs meet the potential for growth, from new ideas to businesses ready for their next chapter." },
      { title: "Build", english: "Build", description: "We contribute beyond capital, participating in product creation, business development and the capabilities needed to execute." },
      { title: "Own", english: "Own", description: "We take the long view, building value through responsible ownership, sustained involvement and resilient businesses." },
    ],
  },
  portfolio: {
    label: "Our portfolio",
    title: "Businesses we\nhelp build.",
    introduction: "From digital infrastructure to workspaces and education, our investments reflect different ways of building and growing businesses.",
    visit: "Visit website",
    companies: [
      { id: "wishwork", name: "Wish Work", category: "Technology & product engineering", description: "Digital product design and engineering, enterprise software solutions and applied artificial intelligence.", domain: "wishwork.org", url: "https://wishwork.org", logo: "/portfolio/wishwork.svg" },
      { id: "spash", name: "Spash", category: "Workspace technology", description: "A platform for discovering, booking and managing coworking spaces and flexible workspaces.", domain: "spash.space", url: "https://spash.space", logo: "/portfolio/spash.svg" },
      { id: "iranchina", name: "IranChina", category: "Education & international services", description: "Chinese language learning, study-abroad services and translation, connecting Iran and China.", domain: "iranchina.org", url: "https://www.iranchina.org", logo: "/portfolio/iranchina.svg" },
    ],
  },
  sectors: {
    label: "Our focus",
    title: "Five sectors.\nOne forward view.",
    introduction: "We focus on fields whose connections can unlock new possibilities for the economy and everyday life.",
    items: [
      { title: "Technology", english: "Technology", description: "Digital products, platforms and infrastructure that improve how people live and work." },
      { title: "Energy", english: "Energy", description: "Solutions for energy production, management and efficient consumption, supporting more resilient infrastructure." },
      { title: "Fintech", english: "Fintech", description: "Financial services and infrastructure that make transactions, financing and access to opportunity more efficient." },
      { title: "Artificial intelligence", english: "Artificial intelligence", description: "Practical applications of data and AI for better decisions, greater productivity and real-world problems." },
      { title: "Real assets", english: "Real assets", description: "Tangible assets and infrastructure with the potential to create lasting value through active management and technology." },
    ],
  },
  about: {
    label: "About SHIRANI",
    title: ["Deep roots.", "Open horizons."],
    paragraphs: [
      "SHIRANI is an investment group focused on private equity, venture capital and building businesses. What connects these paths is a commitment to enduring value.",
      "Our identity draws from Iran: the intention to build, the connection between parts, and a sense of continuity. With these roots, we take an open view of technology, industry and the future.",
    ],
    signature: "Ideas for tomorrow. Commitment for the long term.",
  },
  contact: {
    label: "Get in touch",
    title: ["The future starts", "with a conversation."],
    description: "To explore an investment opportunity, grow a business or begin a new partnership, we would like to hear from you.",
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
