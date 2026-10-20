import { content, type Locale, type PortfolioCompany } from "./content";

export const portfolioIds = ["wishwork", "spash", "iranchina"] as const;
export type PortfolioId = PortfolioCompany["id"];

export function isPortfolioId(value: string): value is PortfolioId {
  return portfolioIds.some(id => id === value);
}

export function portfolioPath(locale: Locale, id: PortfolioId) {
  return `${locale === "en" ? "/en" : ""}/portfolio/${id}`;
}

export function getPortfolioCompany(locale: Locale, id: PortfolioId) {
  return content[locale].portfolio.companies.find(company => company.id === id)!;
}

interface PortfolioProfile {
  tagline: string;
  introduction: [string, string];
  capabilities: { title: string; description: string }[];
  sources: { label: string; url: string }[];
}

export interface BackingStory {
  introduction: string;
  reasons: { title: string; description: string }[];
}

// Investment reasons come from SHIRANI, independently of public company facts.
export const backingStories: Record<Locale, Record<PortfolioId, BackingStory>> = {
  fa: {
    wishwork: {
      introduction: "ما در ویش‌ورک توان تبدیل نیازهای واقعی کسب‌وکارها به محصولات دیجیتال کاربردی را می‌بینیم. دلیل همراهی ما، خلق ارزشی است که با رشد کسب‌وکار و تغییر نیاز مشتری، همچنان مفید بماند.",
      reasons: [
        { title: "حل مسئله واقعی", description: "ارزش فناوری را در کاری می‌سنجیم که برای مشتری انجام می‌دهد؛ از ساده‌تر شدن فرایندها تا شکل‌گیری یک محصول قابل استفاده." },
        { title: "توان ساختن در بلندمدت", description: "طراحی و مهندسی محصول، قابلیتی است که می‌تواند در مراحل مختلف رشد یک کسب‌وکار به کار گرفته شود. این توان اجرایی با نگاه ما به ساختن ارزش پایدار هم‌راستاست." },
      ],
    },
    spash: {
      introduction: "اسپاش را به‌دلیل پیوند فناوری با یک نیاز روزمره همراهی کردیم: پیدا کردن و استفاده از فضای کار. دسترسی آسان‌تر برای کاربران و ابزارهای کاربردی برای مدیران فضا، مبنای ارزش پایدار این کسب‌وکار در نگاه ماست.",
      reasons: [
        { title: "استفاده بهتر از فضاهای موجود", description: "ارتباط میان متقاضیان و ارائه‌دهندگان فضا می‌تواند به استفاده بهتر از ظرفیت‌های موجود کمک کند؛ مسیری که فناوری را به دارایی و نیاز واقعی متصل می‌کند." },
        { title: "فایده برای هر دو سوی پلتفرم", description: "به خدمتی باور داریم که هم انتخاب و رزرو را برای کاربر ساده‌تر کند و هم مدیریت روزمره را برای ارائه‌دهنده بهبود دهد. تداوم این فایده، معیار ما برای ارزش‌آفرینی است." },
      ],
    },
    iranchina: {
      introduction: "همراهی ما با ایران چین بر ارزش کاربردی آموزش و ارتباط بنا شده است. یادگیری زبان و دسترسی به خدمات تخصصی می‌تواند توان افراد را برای تحصیل، کار و همکاری تقویت کند؛ ظرفیتی که ارزش آن در گذر زمان باقی می‌ماند.",
      reasons: [
        { title: "دانش و مهارت قابل استفاده", description: "آموزش زمانی ارزش ماندگار ایجاد می‌کند که به توانایی واقعی فرد تبدیل شود. ما به نقشی توجه داریم که یادگیری زبان می‌تواند در مسیر تحصیلی و حرفه‌ای افراد داشته باشد." },
        { title: "پاسخ به نیازهای مشخص", description: "آموزش زبان، راهنمایی تحصیلی و ترجمه تخصصی، هر کدام به یک نیاز روشن پاسخ می‌دهند. پیوند این خدمات، با مأموریت ما برای خلق ارزش پایدار از راه حل مسائل واقعی هم‌راستاست." },
      ],
    },
  },
  en: {
    wishwork: {
      introduction: "We backed Wish Work for its ability to turn real business needs into useful digital products. We see lasting value in engineering that continues to serve customers as their businesses and needs develop.",
      reasons: [
        { title: "Solving real problems", description: "We judge technology by the work it does for customers, from simplifying an operational process to bringing a useful product into service." },
        { title: "The capability to keep building", description: "Product design and engineering can support a business through different stages of growth. That operating capability fits our commitment to building enduring value." },
      ],
    },
    spash: {
      introduction: "We backed Spash because it connects technology with an everyday need: finding and using workspace. We see lasting value in making that experience useful for both the people booking space and the businesses operating it.",
      reasons: [
        { title: "Making better use of existing space", description: "Connecting workspace users with operators can help put existing capacity to better use. It gives technology a practical role in how real spaces are accessed and used." },
        { title: "Value on both sides", description: "We believe in services that make choosing and booking easier for users while helping operators with their daily work. The continuing usefulness of that service is what matters to us." },
      ],
    },
    iranchina: {
      introduction: "We backed IranChina for the practical value of education and communication. Language learning and access to specialist services can strengthen people’s ability to study, work and collaborate, creating capabilities with lasting value.",
      reasons: [
        { title: "Knowledge people can use", description: "Education creates enduring value when it becomes a practical capability. We look at how language learning can support people through their educational and professional lives." },
        { title: "Meeting clear needs", description: "Language education, study guidance and specialist translation each address a clear need. Connecting those services fits our mission to create lasting value by solving real problems." },
      ],
    },
  },
};

export const portfolioLabels = {
  fa: {
    back: "بازگشت به سرمایه‌گذاری‌ها", overview: "درباره کسب‌وکار", capabilities: "محصول و خدمات",
    why: "چرا همراه شدیم", next: "کسب‌وکار بعدی", visit: "مشاهده وب‌سایت", sources: "بیشتر درباره این کسب‌وکار",
    conversation: "برای ساختن کسب‌وکار بعدی، گفت‌وگو کنیم.", contact: "ارتباط با شیرانی",
  },
  en: {
    back: "Back to portfolio", overview: "The business", capabilities: "Products & services",
    why: "Why we backed them", next: "Next business", visit: "Visit website", sources: "More about the business",
    conversation: "Let’s talk about the next business to build.", contact: "Get in touch with SHIRANI",
  },
} satisfies Record<Locale, Record<string, string>>;

export const portfolioProfiles: Record<Locale, Record<PortfolioId, PortfolioProfile>> = {
  fa: {
    wishwork: {
      tagline: "از ایده تا محصول؛ با طراحی و مهندسی.",
      introduction: [
        "ویش‌ورک شریک فناوری کسب‌وکارها در طراحی و توسعه محصولات دیجیتال است. این مجموعه، طراحی تجربه کاربر و مهندسی نرم‌افزار را برای تبدیل نیازهای کسب‌وکار به محصول کنار هم قرار می‌دهد.",
        "فعالیت ویش‌ورک از نرم‌افزارهای اختصاصی تا راهکارهای سازمانی و کاربردهای هوش مصنوعی را در بر می‌گیرد. اسپاش نیز در وب‌سایت ویش‌ورک به‌عنوان محصول توسعه‌یافته توسط این مجموعه معرفی شده است.",
      ],
      capabilities: [
        { title: "طراحی و توسعه محصول", description: "طراحی تجربه و توسعه نرم‌افزارهای اختصاصی متناسب با نیاز هر کسب‌وکار." },
        { title: "راهکارهای سازمانی", description: "مشاوره و پیاده‌سازی سامانه‌های برنامه‌ریزی منابع سازمانی و سامان‌دهی فرایندهای عملیاتی." },
        { title: "هوش مصنوعی کاربردی", description: "توسعه و استقرار راهکارهای هوش مصنوعی و اتصال آن‌ها به محصولات و فرایندهای کاری." },
      ],
      sources: [{ label: "ویش‌ورک", url: "https://wishwork.org" }, { label: "راهکارهای نرم‌افزاری", url: "https://wishwork.org/solution/software/" }],
    },
    spash: {
      tagline: "فضای کار، در دسترس‌تر.",
      introduction: [
        "اسپاش پلتفرمی برای پیدا کردن و رزرو فضاهای کاری انعطاف‌پذیر است؛ از صندلی و میز کار تا دفتر، اتاق جلسه و فضای رویداد. کاربران می‌توانند بر اساس مکان، زمان و نوع فضا، گزینه مناسب خود را انتخاب کنند.",
        "در سوی دیگر این پلتفرم، مدیران فضاها ابزارهایی برای مدیریت رزروها، پرداخت‌ها و ارتباط با مشتریان در اختیار دارند. اسپاش تجربه رزرو را به فعالیت روزمره مجموعه‌های ارائه‌دهنده فضا متصل می‌کند.",
      ],
      capabilities: [
        { title: "کشف و مقایسه فضا", description: "جست‌وجوی فضای کاری بر اساس موقعیت، تاریخ و نوع استفاده موردنیاز." },
        { title: "رزرو و پرداخت آنلاین", description: "انتخاب فضای در دسترس، ثبت رزرو، پرداخت آنلاین و دریافت فاکتور." },
        { title: "مدیریت مجموعه", description: "پنل ارائه‌دهندگان برای مدیریت تقویم فضا، رزروها، پرداخت‌ها و ارتباط با مشتریان." },
      ],
      sources: [{ label: "اسپاش", url: "https://spash.space" }, { label: "راهکار ارائه‌دهندگان فضا", url: "https://spash.space/provider-guide" }],
    },
    iranchina: {
      tagline: "زبان و دانش، پلی میان ایران و چین.",
      introduction: [
        "مؤسسه ایران چین در حوزه آموزش زبان چینی و آمادگی آزمون HSK، راهنمایی تحصیل در چین و خدمات ترجمه فعالیت می‌کند. دوره‌های آنلاین و منابع آموزشی، بخشی از مسیر یادگیری این مجموعه هستند.",
        "در کنار آموزش، ایران چین خدمات بررسی پرونده تحصیلی و پیگیری درخواست پذیرش، و هماهنگی مترجم برای شرکت‌ها و رویدادها ارائه می‌کند. اپلیکیشن فرهنگ لغت فارسی و چینی نیز از ابزارهای یادگیری این مجموعه است.",
      ],
      capabilities: [
        { title: "آموزش زبان چینی", description: "دوره‌های آنلاین، آمادگی آزمون HSK، محتوای آموزشی و فرهنگ لغت فارسی و چینی." },
        { title: "مسیر تحصیل در چین", description: "بررسی شرایط، انتخاب دانشگاه و رشته، آماده‌سازی مدارک و پیگیری درخواست پذیرش." },
        { title: "ترجمه و ارتباط حرفه‌ای", description: "هماهنگی مترجم برای مذاکره تجاری، نمایشگاه، همایش و جلسات آنلاین." },
      ],
      sources: [{ label: "ایران چین", url: "https://www.iranchina.org" }, { label: "خدمات تخصصی", url: "https://www.iranchina.org/services" }],
    },
  },
  en: {
    wishwork: {
      tagline: "From an idea to a product, through design and engineering.",
      introduction: [
        "Wish Work is a technology partner for businesses building digital products. It brings user experience design and software engineering together to turn business needs into working products.",
        "Its work spans custom software, enterprise systems and applied artificial intelligence. Wish Work also presents Spash on its website as a product developed by its team.",
      ],
      capabilities: [
        { title: "Product design & engineering", description: "Experience design and custom software development shaped around each business’s needs." },
        { title: "Enterprise systems", description: "ERP consulting and implementation, connecting software with the way an organisation operates." },
        { title: "Applied artificial intelligence", description: "Building and deploying AI solutions, and integrating them into products and business workflows." },
      ],
      sources: [{ label: "Wish Work", url: "https://wishwork.org" }, { label: "Software solutions", url: "https://wishwork.org/solution/software/" }],
    },
    spash: {
      tagline: "Making workspace more accessible.",
      introduction: [
        "Spash helps people discover and book flexible workspaces, from individual desks to offices, meeting rooms and event spaces. Users can search by location, date and the kind of space they need.",
        "For workspace operators, the platform brings booking, payment and customer communication tools together. It connects the experience of finding a workspace with the practical work of running one.",
      ],
      capabilities: [
        { title: "Workspace discovery", description: "Finding spaces by location, availability and intended use." },
        { title: "Online booking & payment", description: "Selecting available space, making a reservation, paying online and receiving an invoice." },
        { title: "Operator tools", description: "A provider dashboard for space calendars, bookings, payments and customer communication." },
      ],
      sources: [{ label: "Spash", url: "https://spash.space" }, { label: "For workspace operators", url: "https://spash.space/provider-guide" }],
    },
    iranchina: {
      tagline: "Connecting Iran and China through language and knowledge.",
      introduction: [
        "IranChina offers Chinese language learning and HSK preparation, guidance on studying in China, and translation services. Online classes and learning resources form part of its educational offering.",
        "Alongside language teaching, it supports university application preparation and follow-up, and coordinates interpreters for businesses and events. Its Persian–Chinese dictionary app provides another way for learners to practise and explore the language.",
      ],
      capabilities: [
        { title: "Chinese language learning", description: "Online courses, HSK preparation, educational resources and a Persian–Chinese dictionary." },
        { title: "Studying in China", description: "Profile assessment, university and programme selection, document preparation and application follow-up." },
        { title: "Translation & interpretation", description: "Coordinating interpreters for business meetings, exhibitions, conferences and online sessions." },
      ],
      sources: [{ label: "IranChina", url: "https://www.iranchina.org" }, { label: "Specialist services", url: "https://www.iranchina.org/services" }],
    },
  },
};
