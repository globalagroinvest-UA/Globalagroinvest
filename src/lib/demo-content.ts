/**
 * Offline demo content — used whenever Sanity isn't configured yet (see
 * isSanityConfigured in src/sanity/env.ts) and as the display fallback if a
 * query genuinely fails. This is what makes `pnpm build`/`pnpm dev` work
 * out of the box before anyone has created a Sanity project, and what
 * ships as the site's initial demo content per CLAUDE.md §34.
 *
 * All figures, brand names, and company details below are FICTIONAL
 * placeholders (§34/§18/§19 explicitly forbid inventing real facts,
 * certificates, or partnerships) — replace them with the client's real
 * content in Sanity once the project is connected. Images use generated
 * placeholder art (see PlaceholderArt.tsx), never stock photography.
 */
import type {
  AboutPage,
  Advantage,
  Brand,
  BusinessDirection,
  Category,
  ContactsPage,
  HomePage,
  NewsPost,
  PlaceholderIcon,
  PortableTextBlock,
  Product,
  SiteSettings,
} from "@/types/content";

function block(text: string, style: "normal" | "h2" | "h3" = "normal"): PortableTextBlock {
  return {
    _type: "block",
    _key: `${style}-${text.slice(0, 12)}-${Math.random().toString(36).slice(2, 7)}`,
    style,
    children: [{ _type: "span", _key: "span-0", text, marks: [] }],
    markDefs: [],
  };
}

export const siteSettings: SiteSettings = {
  companyName: "ТОВ «ГЛОБАЛ АГРО ІНВЕСТ»",
  logo: {
    url: "",
    alt: "Логотип компанії ТОВ «ГЛОБАЛ АГРО ІНВЕСТ»",
    width: 160,
    height: 48,
    placeholder: { icon: "leaf", tone: "brand" },
  },
  footerDescription:
    "Постачаємо паливно-мастильні матеріали та насіння для агробізнесу по всій Україні.",
  phone: "+380 44 200 30 40",
  email: "info@globalagroinvest.ua",
  address: "м. Київ, вул. Промислова, 12",
  mapEmbedUrl: undefined,
  workingHours: "Пн–Пт: 8:00–18:00",
  socialLinks: [
    { platform: "facebook", url: "https://facebook.com" },
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "telegram", url: "https://t.me" },
    { platform: "linkedin", url: "https://linkedin.com" },
  ],
  legalInfo: "ТОВ «ГЛОБАЛ АГРО ІНВЕСТ» · Код ЄДРПОУ 12345678 (демо-дані)",
};

const advantageList: Advantage[] = [
  { _id: "adv-1", title: "Надійні постачання", description: "Дотримуємось узгоджених термінів навіть у пікові сезони посівної та збирання." },
  { _id: "adv-2", title: "Якісна продукція", description: "Працюємо лише з перевіреними виробниками ПММ та насіння." },
  { _id: "adv-3", title: "Професійна консультація", description: "Допомагаємо підібрати продукцію під конкретну техніку та культуру." },
  { _id: "adv-4", title: "Досвід роботи з агробізнесом", description: "Розуміємо специфіку галузі та сезонні навантаження господарств." },
  { _id: "adv-5", title: "Широкий асортимент", description: "ПММ, насіння провідних гібридів і супутні рішення в одного постачальника." },
  { _id: "adv-6", title: "Індивідуальний підхід", description: "Гнучкі умови співпраці для господарств будь-якого масштабу." },
];

const statsList = [
  { value: "15", suffix: "+", label: "років на ринку" },
  { value: "500", suffix: "+", label: "клієнтів-господарств" },
  { value: "24", suffix: "", label: "регіони постачання" },
  { value: "1200", suffix: "+", label: "виконаних поставок" },
];

const brandList: Brand[] = [
  { _id: "brand-fuchs", name: "FUCHS", logo: { url: "/brands/fuchs.png", alt: "Логотип FUCHS — мастильні матеріали", width: 1126, height: 520 }, url: "https://www.fuchs.com" },
  { _id: "brand-agroline", name: "АгроЛайн", logo: { url: "", alt: "Логотип АгроЛайн", width: 320, height: 160, placeholder: { icon: "award", tone: "brand" } } },
  { _id: "brand-teropaliv", name: "ТераПалив", logo: { url: "", alt: "Логотип ТераПалив", width: 320, height: 160, placeholder: { icon: "fuel", tone: "graphite" } } },
  { _id: "brand-graintech", name: "ГрейнТек", logo: { url: "", alt: "Логотип ГрейнТек", width: 320, height: 160, placeholder: { icon: "wheat", tone: "accent" } } },
  { _id: "brand-poleprime", name: "ПолеПрайм", logo: { url: "", alt: "Логотип ПолеПрайм", width: 320, height: 160, placeholder: { icon: "sprout", tone: "brand" } } },
  { _id: "brand-fieldcore", name: "ФілдКор", logo: { url: "", alt: "Логотип ФілдКор", width: 320, height: 160, placeholder: { icon: "shieldCheck", tone: "graphite" } } },
  { _id: "brand-novaseed", name: "НоваСід", logo: { url: "", alt: "Логотип НоваСід", width: 320, height: 160, placeholder: { icon: "leaf", tone: "accent" } } },
];

const businessDirections: BusinessDirection[] = [
  {
    _id: "dir-pmm",
    title: "ПММ",
    description: "Паливо та мастильні матеріали для сучасної агротехніки — від моторних олив до дизпалива.",
    image: { url: "", alt: "Каністри та бочки з паливно-мастильними матеріалами", width: 1200, height: 900, placeholder: { icon: "fuel", tone: "brand" } },
    cta: { label: "Переглянути ПММ", href: "/products/pmm", style: "primary" },
  },
  {
    _id: "dir-nasinnya",
    title: "Насіння",
    description: "Насіння провідних гібридів кукурудзи, соняшника, пшениці та інших культур.",
    image: { url: "", alt: "Насіння сільськогосподарських культур", width: 1200, height: 900, placeholder: { icon: "wheat", tone: "accent" } },
    cta: { label: "Переглянути насіння", href: "/products/nasinnya", style: "primary" },
  },
  {
    _id: "dir-other",
    title: "Інші рішення",
    description: "Додаткові продукти та сервіси для агробізнесу — уточнюйте у наших менеджерів.",
    image: { url: "", alt: "Складські потужності компанії", width: 1200, height: 900, placeholder: { icon: "warehouse", tone: "graphite" } },
    cta: { label: "Зв'язатися з нами", href: "/contacts", style: "secondary" },
  },
];

export const homePage: HomePage = {
  heroTitle: "Надійні рішення для сучасного агробізнесу",
  heroSubtitle:
    "Паливно-мастильні матеріали та насіння від перевірених брендів — з постачанням по всій Україні.",
  heroImage: {
    url: "",
    alt: "Сучасна сільськогосподарська техніка в полі",
    width: 1920,
    height: 1080,
    placeholder: { icon: "tractor", tone: "brand" },
  },
  heroCtaPrimary: { label: "Переглянути продукцію", href: "/products", style: "primary" },
  heroCtaSecondary: { label: "Зв'язатися з нами", href: "/contacts", style: "secondary" },
  introTitle: "Партнер, що розуміє агробізнес зсередини",
  introText:
    "Ми постачаємо паливно-мастильні матеріали та насіння господарствам по всій Україні — від невеликих фермерських до великих агрохолдингів. Наша мета — щоб потрібна продукція завжди була під рукою вчасно, без зайвих клопотів.",
  introImage: {
    url: "",
    alt: "Рукостискання партнерів на тлі поля",
    width: 1200,
    height: 1500,
    placeholder: { icon: "handshake", tone: "graphite" },
  },
  businessDirections,
  advantagesTitle: "Чому обирають нас",
  advantages: advantageList,
  stats: statsList,
  brandsSectionTitle: "Нам довіряють провідні бренди",
  brands: brandList,
  finalCtaTitle: "Потрібна консультація?",
  finalCtaText: "Зв'яжіться з нашим менеджером — підберемо продукцію під ваші потреби.",
  finalCtaButton: { label: "Зв'язатися з нами", href: "/contacts", style: "primary" },
};

export const aboutPage: AboutPage = {
  title: "Про компанію",
  intro:
    "«ГЛОБАЛ АГРО ІНВЕСТ» — команда, яка вже понад 15 років забезпечує господарства України паливно-мастильними матеріалами та насінням.",
  body: [
    block(
      "Ми починали з постачання ПММ для кількох господарств Київської області, а сьогодні працюємо з клієнтами у понад 20 регіонах.",
    ),
    block("Що ми пропонуємо", "h2"),
    block(
      "Асортимент компанії охоплює моторні та трансмісійні оливи, дизельне паливо, а також насіння провідних гібридів кукурудзи, соняшника, пшениці та інших культур.",
    ),
    block(
      "Ми співпрацюємо напряму з виробниками, що дозволяє тримати стабільну якість продукції та прогнозовані терміни постачання навіть у пікові сезони.",
    ),
  ],
  mainImage: {
    url: "",
    alt: "Офіс та складські потужності компанії ГЛОБАЛ АГРО ІНВЕСТ",
    width: 1400,
    height: 1000,
    placeholder: { icon: "building", tone: "graphite" },
  },
  advantagesTitle: "Чому обирають нас",
  advantages: advantageList,
  stats: statsList,
};

export const contactsPage: ContactsPage = {
  title: "Контакти",
  intro:
    "Залишились питання? Зв'яжіться з нами будь-яким зручним способом — відповідаємо протягом робочого дня.",
};

export const categories: Category[] = [
  {
    _id: "pmm",
    title: "ПММ",
    slug: "pmm",
    image: {
      url: "",
      alt: "Каністри моторного мастила",
      width: 1200,
      height: 900,
      placeholder: { icon: "droplet", tone: "brand" },
    },
    description: "Паливно-мастильні матеріали для сучасної агротехніки, зокрема мастильні матеріали марки FUCHS.",
    order: 1,
  },
  {
    _id: "nasinnya",
    title: "Насіння",
    slug: "nasinnya",
    image: {
      url: "",
      alt: "Насіння кукурудзи та соняшника",
      width: 1200,
      height: 900,
      placeholder: { icon: "sprout", tone: "accent" },
    },
    description: "Насіння провідних гібридів для високої врожайності.",
    order: 2,
  },
];

const pmmCategoryRef = { title: "ПММ", slug: "pmm" };
const nasinnyaCategoryRef = { title: "Насіння", slug: "nasinnya" };

function productImage(
  alt: string,
  icon: PlaceholderIcon,
  tone: "brand" | "graphite" | "accent",
): Product["images"][number] {
  return {
    url: "",
    alt,
    width: 1000,
    height: 1000,
    placeholder: { icon, tone },
  };
}

const pmmProducts: Product[] = [
  {
    _id: "prod-pmm-1",
    title: "Моторна олива АгроЛайн 10W-40",
    slug: "motorna-oliva-agroline-10w-40",
    category: pmmCategoryRef,
    brand: { name: "АгроЛайн" },
    shortDescription: "Напівсинтетична моторна олива для дизельних двигунів сільгосптехніки.",
    description: [block("Напівсинтетична моторна олива, розроблена для тривалої роботи дизельних двигунів агротехніки в широкому діапазоні температур.")],
    characteristics: [
      { label: "В'язкість", value: "10W-40" },
      { label: "Тип", value: "Напівсинтетика" },
      { label: "Об'єм тари", value: "20 л" },
    ],
    images: [productImage("Каністра моторної оливи АгроЛайн 10W-40", "droplet", "brand")],
    order: 1,
    status: "active",
  },
  {
    _id: "prod-pmm-2",
    title: "Моторна олива ТераПалив 15W-40",
    slug: "motorna-oliva-terapaliv-15w-40",
    category: pmmCategoryRef,
    brand: { name: "ТераПалив" },
    shortDescription: "Мінеральна моторна олива для важконавантаженої техніки.",
    description: [block("Мінеральна моторна олива для дизельних двигунів, що працюють у важких умовах експлуатації.")],
    characteristics: [
      { label: "В'язкість", value: "15W-40" },
      { label: "Тип", value: "Мінеральна" },
      { label: "Об'єм тари", value: "20 л" },
    ],
    images: [productImage("Каністра моторної оливи ТераПалив 15W-40", "droplet", "graphite")],
    order: 2,
    status: "active",
  },
  {
    _id: "prod-pmm-3",
    title: "Трансмісійна олива ГрейнТек 80W-90",
    slug: "transmisiyna-oliva-graintech-80w-90",
    category: pmmCategoryRef,
    brand: { name: "ГрейнТек" },
    shortDescription: "Трансмісійна олива для коробок передач та редукторів агротехніки.",
    description: [block("Трансмісійна олива для механічних коробок передач, роздавальних коробок та редукторів сільськогосподарської техніки.")],
    characteristics: [
      { label: "В'язкість", value: "80W-90" },
      { label: "Тип", value: "Мінеральна GL-5" },
      { label: "Об'єм тари", value: "20 л" },
    ],
    images: [productImage("Каністра трансмісійної оливи ГрейнТек 80W-90", "droplet", "accent")],
    order: 3,
    status: "active",
  },
  {
    _id: "prod-pmm-4",
    title: "Гідравлічна олива ПолеПрайм HVLP 46",
    slug: "gidravlichna-oliva-poleprime-hvlp-46",
    category: pmmCategoryRef,
    brand: { name: "ПолеПрайм" },
    shortDescription: "Гідравлічна олива для гідросистем комбайнів і тракторів.",
    description: [block("Гідравлічна олива з покращеними низькотемпературними властивостями для гідросистем сучасної техніки.")],
    characteristics: [
      { label: "Клас в'язкості", value: "HVLP 46" },
      { label: "Об'єм тари", value: "20 л" },
    ],
    images: [productImage("Каністра гідравлічної оливи ПолеПрайм HVLP 46", "droplet", "brand")],
    order: 4,
    status: "active",
  },
  {
    _id: "prod-pmm-5",
    title: "Дизельне паливо (літнє)",
    slug: "dyzelne-palyvo-litnie",
    category: pmmCategoryRef,
    shortDescription: "Оптові поставки літнього дизельного палива для агротехніки.",
    description: [block("Дизельне паливо літнього класу для безперебійної роботи техніки в теплий період.")],
    characteristics: [{ label: "Клас", value: "Літній" }],
    images: [productImage("Заправка дизельного палива", "fuel", "graphite")],
    order: 5,
    status: "active",
  },
  {
    _id: "prod-pmm-6",
    title: "Дизельне паливо (зимове)",
    slug: "dyzelne-palyvo-zymove",
    category: pmmCategoryRef,
    shortDescription: "Оптові поставки зимового дизельного палива з покращеними низькотемпературними властивостями.",
    description: [block("Дизельне паливо зимового класу, стійке до низьких температур.")],
    characteristics: [{ label: "Клас", value: "Зимовий" }],
    images: [productImage("Заправка дизельного палива взимку", "fuel", "brand")],
    order: 6,
    status: "active",
  },
  {
    _id: "prod-pmm-7",
    title: "Мастило літієве ФілдКор МС-15",
    slug: "mastylo-litieve-fieldcore-ms-15",
    category: pmmCategoryRef,
    brand: { name: "ФілдКор" },
    shortDescription: "Багатоцільове літієве мастило для вузлів тертя.",
    description: [block("Багатоцільове літієве мастило для підшипників і вузлів тертя сільськогосподарської техніки.")],
    characteristics: [
      { label: "Тип", value: "Літієве" },
      { label: "Об'єм тари", value: "5 кг" },
    ],
    images: [productImage("Туба літієвого мастила ФілдКор", "droplet", "accent")],
    order: 7,
    status: "active",
  },
  {
    _id: "prod-pmm-8",
    title: "Присадка для дизпалива НоваСід DPF Protect",
    slug: "prysadka-dyzpalyvo-novaseed-dpf-protect",
    category: pmmCategoryRef,
    brand: { name: "НоваСід" },
    shortDescription: "Присадка для захисту паливної системи та сажового фільтра.",
    description: [block("Присадка до дизельного палива, що подовжує ресурс паливної апаратури та сажового фільтра.")],
    characteristics: [{ label: "Об'єм тари", value: "1 л" }],
    images: [productImage("Флакон присадки для дизпалива НоваСід", "droplet", "graphite")],
    order: 8,
    status: "active",
  },
];

const seedProducts: Product[] = [
  {
    _id: "prod-seed-1",
    title: "Насіння кукурудзи ГрейнТек ФАО 280",
    slug: "nasinnya-kukurudzy-graintech-fao-280",
    category: nasinnyaCategoryRef,
    brand: { name: "ГрейнТек" },
    shortDescription: "Середньоранній гібрид кукурудзи з високим потенціалом врожайності.",
    description: [block("Середньоранній гібрид кукурудзи групи ФАО 280, придатний для вирощування в більшості регіонів України.")],
    characteristics: [
      { label: "Група ФАО", value: "280" },
      { label: "Схожість", value: "не менше 95%" },
      { label: "Фасування", value: "Мішок, 1 посівна одиниця" },
    ],
    images: [productImage("Насіння кукурудзи ГрейнТек", "wheat", "brand")],
    order: 1,
    status: "active",
  },
  {
    _id: "prod-seed-2",
    title: "Насіння кукурудзи АгроЛайн ФАО 300",
    slug: "nasinnya-kukurudzy-agroline-fao-300",
    category: nasinnyaCategoryRef,
    brand: { name: "АгроЛайн" },
    shortDescription: "Середньостиглий гібрид кукурудзи для інтенсивних технологій вирощування.",
    description: [block("Середньостиглий гібрид з групи ФАО 300, стабільний за посухостійкістю та урожайністю.")],
    characteristics: [
      { label: "Група ФАО", value: "300" },
      { label: "Схожість", value: "не менше 95%" },
    ],
    images: [productImage("Насіння кукурудзи АгроЛайн", "wheat", "accent")],
    order: 2,
    status: "active",
  },
  {
    _id: "prod-seed-3",
    title: "Насіння соняшника ПолеПрайм (під Євролайтинг)",
    slug: "nasinnya-sonyashnyka-poleprime-euro-lightning",
    category: nasinnyaCategoryRef,
    brand: { name: "ПолеПрайм" },
    shortDescription: "Гібрид соняшника, стійкий до гербіцидів групи Євролайтинг.",
    description: [block("Гібрид соняшника з високою олійністю, адаптований для технології Євролайтинг.")],
    characteristics: [
      { label: "Технологія", value: "Євролайтинг" },
      { label: "Схожість", value: "не менше 90%" },
    ],
    images: [productImage("Насіння соняшника ПолеПрайм", "sprout", "brand")],
    order: 3,
    status: "active",
  },
  {
    _id: "prod-seed-4",
    title: "Насіння соняшника ФілдКор класичний",
    slug: "nasinnya-sonyashnyka-fieldcore-klasychnyi",
    category: nasinnyaCategoryRef,
    brand: { name: "ФілдКор" },
    shortDescription: "Класичний гібрид соняшника з високою олійністю.",
    description: [block("Класичний, невибагливий до умов вирощування гібрид соняшника.")],
    characteristics: [{ label: "Схожість", value: "не менше 90%" }],
    images: [productImage("Насіння соняшника ФілдКор", "sprout", "graphite")],
    order: 4,
    status: "active",
  },
  {
    _id: "prod-seed-5",
    title: "Насіння пшениці озимої НоваСід Еліта",
    slug: "nasinnya-pshenytsi-ozymoi-novaseed-elita",
    category: nasinnyaCategoryRef,
    brand: { name: "НоваСід" },
    shortDescription: "Елітне насіння озимої пшениці з високим потенціалом врожайності.",
    description: [block("Насіння озимої пшениці категорії «Еліта», рекомендоване для інтенсивних технологій вирощування.")],
    characteristics: [
      { label: "Категорія", value: "Еліта" },
      { label: "Схожість", value: "не менше 92%" },
    ],
    images: [productImage("Насіння пшениці озимої НоваСід", "wheat", "accent")],
    order: 5,
    status: "active",
  },
  {
    _id: "prod-seed-6",
    title: "Насіння ріпаку озимого ТераПалив",
    slug: "nasinnya-ripaku-ozymoho-terapaliv",
    category: nasinnyaCategoryRef,
    brand: { name: "ТераПалив" },
    shortDescription: "Гібрид озимого ріпаку з високою зимостійкістю.",
    description: [block("Гібрид озимого ріпаку, що поєднує зимостійкість з високим потенціалом урожайності.")],
    characteristics: [{ label: "Схожість", value: "не менше 90%" }],
    images: [productImage("Насіння ріпаку озимого", "sprout", "brand")],
    order: 6,
    status: "active",
  },
  {
    _id: "prod-seed-7",
    title: "Насіння сої ГрейнТек ранньостиглої групи",
    slug: "nasinnya-soyi-graintech-rannostygla",
    category: nasinnyaCategoryRef,
    brand: { name: "ГрейнТек" },
    shortDescription: "Ранньостиглий сорт сої для короткого вегетаційного періоду.",
    description: [block("Ранньостиглий сорт сої, придатний для вирощування у регіонах з коротшим вегетаційним періодом.")],
    characteristics: [{ label: "Група стиглості", value: "Рання" }],
    images: [productImage("Насіння сої ГрейнТек", "leaf", "graphite")],
    order: 7,
    status: "active",
  },
  {
    _id: "prod-seed-8",
    title: "Насіння ячменю ярого АгроЛайн",
    slug: "nasinnya-yachmenyu-yaroho-agroline",
    category: nasinnyaCategoryRef,
    brand: { name: "АгроЛайн" },
    shortDescription: "Сорт ярого ячменю з високою продуктивністю.",
    description: [block("Сорт ярого ячменю, придатний для вирощування в різних ґрунтово-кліматичних умовах.")],
    characteristics: [{ label: "Схожість", value: "не менше 92%" }],
    images: [productImage("Насіння ячменю ярого", "wheat", "brand")],
    order: 8,
    status: "active",
  },
];

export const products: Product[] = [...pmmProducts, ...seedProducts];

export const newsList: NewsPost[] = [
  {
    _id: "news-1",
    title: "Компанія розширює складські потужності",
    slug: "kompaniya-rozshyryuye-skladski-potuzhnosti",
    publishedAt: "2026-02-10T09:00:00.000Z",
    excerpt: "Новий склад дозволить швидше обробляти замовлення в пікові періоди посівної та збирання.",
    coverImage: { url: "", alt: "Новий складський комплекс компанії", width: 1200, height: 800, placeholder: { icon: "warehouse", tone: "graphite" } },
    body: [
      block("Ми ввели в експлуатацію новий складський комплекс, що дозволить збільшити обсяги одночасного зберігання ПММ та насіння."),
      block("Це дасть змогу швидше обробляти замовлення клієнтів у пікові періоди посівної та збиральної кампаній."),
    ],
  },
  {
    _id: "news-2",
    title: "Новий сезон насіннєвих гібридів 2026",
    slug: "novyi-sezon-nasinnyevykh-gibrydiv-2026",
    publishedAt: "2026-01-20T09:00:00.000Z",
    excerpt: "У каталозі з'явились нові гібриди кукурудзи та соняшника для сезону 2026 року.",
    coverImage: { url: "", alt: "Насіння нового сезону", width: 1200, height: 800, placeholder: { icon: "sprout", tone: "accent" } },
    body: [block("До каталогу додано нові гібриди кукурудзи та соняшника, адаптовані до умов сезону 2026 року.")],
  },
  {
    _id: "news-3",
    title: "ГЛОБАЛ АГРО ІНВЕСТ на виставці AgroExpo 2026",
    slug: "global-agro-invest-na-vystavtsi-agroexpo-2026",
    publishedAt: "2025-11-05T09:00:00.000Z",
    excerpt: "Наша команда представила асортимент ПММ та насіння на щорічній галузевій виставці.",
    coverImage: { url: "", alt: "Стенд компанії на виставці", width: 1200, height: 800, placeholder: { icon: "globe", tone: "brand" } },
    body: [block("Наші менеджери презентували актуальний асортимент продукції та відповіли на запитання відвідувачів виставки.")],
  },
];
