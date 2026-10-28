export type Language = 'ar' | 'en';

export type ProjectCategory =
  | 'all'
  | 'e-commerce'
  | 'enterprise-accounting'
  | 'ai-iot'
  | 'web-development'
  | 'education-tech'
  | 'healthcare-tech';

export type EvidenceSource =
  | 'cv_verified'
  | 'owner_supplied'
  | 'observed_behavior'
  | 'untested_functionality';

export interface LinkVerificationMatrix {
  urlSupplied: boolean;
  suppliedUrl: string | null;
  alternativeUrl?: string | null;
  alternativeUrlStatusAr?: string;
  alternativeUrlStatusEn?: string;
  urlOpened: 'not_yet_checked' | 'opened_with_branding_note' | 'not_applicable';
  interfaceObserved:
    | 'not_yet_observed'
    | 'owner_screenshot_supplied'
    | 'storefront_title_differs_flagged'
    | 'not_applicable';
  workflowsTested: boolean;
  publiclyAccessible:
    | 'pending_browser_verification'
    | 'ai_studio_applet_requires_session_check'
    | 'case_study_no_public_url';
  statusSummaryAr: string;
  statusSummaryEn: string;
  verificationNotesAr: string;
  verificationNotesEn: string;
}

export interface CaseStudyArchitecture {
  problemStatementAr: string;
  problemStatementEn: string;
  architectureLayersAr: string[];
  architectureLayersEn: string[];
  keyEngineeringContributionsAr: string[];
  keyEngineeringContributionsEn: string[];
  dataAndValidationNotesAr: string;
  dataAndValidationNotesEn: string;
}

export interface ProjectGalleryItem {
  id: string;
  projectId: string;
  fileName: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  dataUrl: string;
  altAr: string;
  altEn: string;
  status: 'published' | 'draft';
}

export interface ProjectSpecificationPillar {
  id: string;
  index: string;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  statusType: 'implemented' | 'extensible';
  itemsAr: string[];
  itemsEn: string[];
}

export interface ProjectItem {
  id: string;
  slug: string;
  displayOrder: number;
  featured: boolean;
  status?: 'published' | 'draft';
  nameAr: string;
  nameEn: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabelAr: string;
  categoryLabelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  engineeringContributionAr: string;
  engineeringContributionEn: string;
  verifiedFactsAr: string[];
  verifiedFactsEn: string[];
  unverifiedBoundariesAr: string;
  unverifiedBoundariesEn: string;
  technologies: string[];
  technologiesSource: 'cv_stated' | 'not_claimed';
  url: string | null;
  sourceUrl?: string | null;
  isCaseStudyOnly: boolean;
  verification: LinkVerificationMatrix;
  /**
   * Genuine screenshot path if supplied by owner in /public/screenshots/...
   * or uploaded persistently via the Private Admin Dashboard (thumbnailUrl).
   */
  genuineScreenshotPath?: string | null;
  thumbnailUrl?: string | null;
  thumbnailAltAr?: string;
  thumbnailAltEn?: string;
  galleryMediaIds?: string[];
  screenshotCaptionAr?: string;
  screenshotCaptionEn?: string;
  illustrativeTheme: {
    accentHex: string;
    secondaryHex: string;
    domainCode: string;
    diagramType:
      | 'ecommerce_storefront'
      | 'digital_commerce'
      | 'global_catalog'
      | 'school_platform'
      | 'healthcare_portal'
      | 'corporate_web'
      | 'ai_web_platform'
      | 'accounting_ledger'
      | 'fire_cv_iot';
  };
  caseStudy?: CaseStudyArchitecture;
  specificationPillars?: ProjectSpecificationPillar[];
  targetAudienceAr?: string[];
  targetAudienceEn?: string[];
  valuePropositionAr?: string;
  valuePropositionEn?: string;
}

export interface ProfessionalProfile {
  id: string;
  platformNameAr: string;
  platformNameEn: string;
  roleLabelAr: string;
  roleLabelEn: string;
  handle: string;
  url: string;
  descriptionAr: string;
  descriptionEn: string;
  ctaAr: string;
  ctaEn: string;
  categoryType: 'code_repository' | 'professional_network' | 'freelance_platform';
}

export interface SkillGroup {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  skills: {
    nameEn: string;
    nameAr: string;
  }[];
}

export type ServiceCategory =
  | 'software-development'
  | 'ai-automation'
  | 'reports-data'
  | 'research-studies'
  | 'professional-docs'
  | 'design-quality';

export interface ServiceCategoryMeta {
  id: ServiceCategory;
  index: string;
  labelAr: string;
  labelEn: string;
  shortDescAr: string;
  shortDescEn: string;
  iconName: string;
}

export interface ServiceItem {
  id: string;
  index: string;
  category: ServiceCategory;
  categoryLabelAr: string;
  categoryLabelEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  scopePointsAr: string[];
  scopePointsEn: string[];
  expectedDeliverablesAr: string[];
  expectedDeliverablesEn: string[];
  iconKey?: string;
}

export type PhoneDisplayMode = 'click-to-call' | 'visible' | 'hidden';

export interface OwnerProfileConfig {
  brandName: string;
  monogram: string;
  taglineEn: string;
  taglineAr: string;
  fullNameEn: string;
  fullNameAr: string;
  titleEn: string;
  titleAr: string;
  locationEn: string;
  locationAr: string;
  email: string;
  phone: string;
  defaultPhoneDisplayMode: PhoneDisplayMode;
  education: {
    degreeEn: string;
    degreeAr: string;
    universityEn: string;
    universityAr: string;
    graduationEn: string;
    graduationAr: string;
  };
  languages: {
    languageEn: string;
    languageAr: string;
    proficiencyEn: string;
    proficiencyAr: string;
  }[];
  aboutBrandAr: string;
  aboutBrandEn: string;
  cvSummaryAr: string;
  cvSummaryEn: string;
}

export const OWNER_PROFILE: OwnerProfileConfig = {
  brandName: 'Bandr Solutions',
  monogram: 'BS',
  taglineEn: 'Building Digital Experiences That Matter',
  taglineAr: 'نصنع تجارب رقمية تصنع الفرق',
  fullNameEn: 'Saeed Ismail Mohammed Bandar',
  fullNameAr: 'سعيد إسماعيل محمد بندر',
  titleEn: 'Full Stack Engineer & AI Specialist',
  titleAr: 'مهندس برمجيات متكامل ومتخصص في الذكاء الاصطناعي',
  locationEn: 'Taiz, Yemen — Remote Worldwide',
  locationAr: 'تعز، اليمن — العمل عن بُعد عالمياً',
  email: 'bandr246899@gmail.com',
  phone: '+967 782264165',
  defaultPhoneDisplayMode: 'click-to-call',
  education: {
    degreeEn: 'Bachelor of Computer Science & Information Technology',
    degreeAr: 'بكالوريوس علوم الحاسوب وتقنية المعلومات',
    universityEn: 'Al-Hikma University, Yemen',
    universityAr: 'جامعة الحكمة، اليمن',
    graduationEn: 'Graduated May 2025',
    graduationAr: 'تخرج مايو 2025',
  },
  languages: [
    {
      languageEn: 'Arabic',
      languageAr: 'اللغة العربية',
      proficiencyEn: 'Native',
      proficiencyAr: 'اللغة الأم',
    },
    {
      languageEn: 'English',
      languageAr: 'اللغة الإنجليزية',
      proficiencyEn: 'Professional Working Proficiency (as stated in CV)',
      proficiencyAr: 'كفاءة مهنية في العمل (كما هو موثق في السيرة الذاتية)',
    },
  ],
  aboutBrandAr:
    'Bandr Solutions مساحة رقمية لعرض المشاريع والأعمال التقنية، تجمع بين التصميم العصري وتطوير التجارب الرقمية وتقديم حلول ويب تلبي احتياجات المشاريع.',
  aboutBrandEn:
    'Bandr Solutions is a digital portfolio showcasing technology projects, modern web experiences, and digital solutions designed around practical project needs.',
  cvSummaryAr:
    'مهندس برمجيات متكامل (Full Stack) ومتخصص في الذكاء الاصطناعي حاصل على بكالوريوس علوم الحاسوب وتقنية المعلومات من جامعة الحكمة (مايو 2025). يتركز العمل الهندسي على تطوير تطبيقات الويب التفاعلية، المتاجر الإلكترونية، الأنظمة المحاسبية وإدارة المستودعات، وحلول الرؤية الحاسوبية المدمجة وتقييم نماذج اللغة الكبيرة (LLMs) وهندسة البيانات.',
  cvSummaryEn:
    'Full Stack Engineer and AI Specialist holding a Bachelor of Computer Science & Information Technology from Al-Hikma University (May 2025). Focused on building responsive web applications, e-commerce storefronts, enterprise accounting and warehouse systems, embedded computer-vision solutions, and structured LLM evaluation and data workflows.',
};

export const PROJECT_CATEGORIES: {
  id: ProjectCategory;
  labelAr: string;
  labelEn: string;
}[] = [
  { id: 'all', labelAr: 'جميع المشاريع', labelEn: 'All Projects' },
  { id: 'e-commerce', labelAr: 'المتاجر الإلكترونية', labelEn: 'E-Commerce' },
  { id: 'education-tech', labelAr: 'تقنيات التعليم', labelEn: 'Education Technology' },
  { id: 'healthcare-tech', labelAr: 'التقنيات الصحية', labelEn: 'Healthcare Technology' },
  { id: 'web-development', labelAr: 'مشاريع الويب', labelEn: 'Web Development' },
  {
    id: 'enterprise-accounting',
    labelAr: 'الأنظمة المحاسبية والمستودعات',
    labelEn: 'Enterprise Accounting',
  },
  { id: 'ai-iot', labelAr: 'الذكاء الاصطناعي وإنترنت الأشياء', labelEn: 'AI & IoT' },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'novaro',
    slug: 'rufid-markets-ecommerce-platform',
    displayOrder: 1,
    featured: true,
    status: 'published',
    nameAr: 'رفيد ماركتس — منصة التجارة الإلكترونية الذكية',
    nameEn: 'Rufid Markets — AI-Powered E-Commerce & Marketplace Platform',
    category: 'e-commerce',
    categoryLabelAr: 'التجارة الإلكترونية والذكاء الاصطناعي',
    categoryLabelEn: 'E-Commerce & Marketplace',
    descriptionAr:
      'رفيد ماركتس (Rufid Markets) مشروع منصة تجارة إلكترونية يهدف إلى تنظيم عمليات البيع والشراء الرقمية من خلال واجهة متجر ولوحة إدارة مركزية للمنتجات والتصنيفات والطلبات والعملاء والمخزون، ضمن تجربة قابلة للتوسع والتكامل مع خدمات الأعمال.\n\nيركز المشروع على تسهيل إدارة المنتجات وبياناتها، وتنظيم دورة الطلب، ومتابعة المخزون والعمليات التجارية. كما يتضمن توجهًا لتوظيف الذكاء الاصطناعي في إعداد أوصاف المنتجات وتحسين المحتوى التسويقي وبيانات تحسين محركات البحث (SEO).\n\nتتجه المنصة إلى دعم التكامل مع مزودي الدفع والشحن والخدمات الخارجية عبر واجهات API، وفق ما هو منفذ ومتاح في التطبيق الفعلي.\n\nالهدف: توفير بيئة تجارة رقمية منظمة تجمع إدارة المتجر والعمليات التشغيلية وتحسين محتوى المنتجات ضمن منصة واحدة.',
    descriptionEn:
      'Rufid Markets is an e-commerce and marketplace project designed to organize online retail operations through a storefront and a centralized administration interface.\n\nThe platform focuses on product catalog management, categories, orders, customers, inventory, and commerce workflows. Its AI-oriented direction includes product description generation, marketing content enhancement, and search engine optimization (SEO).\n\nThe architecture is intended to support integrations with payment providers, shipping services, and external APIs where those integrations are implemented and available.\n\nProject Objective: To provide an extensible digital commerce platform combining store management, operational workflows, and AI-assisted product content capabilities.',
    engineeringContributionAr:
      'بناء معمارية منصة تجارة إلكترونية متكاملة مع واجهة متجر متجاوبة ولوحة إدارة مركزية للمنتجات والطلبات والمخزون وهندسة محتوى SEO.',
    engineeringContributionEn:
      'Architectural development of an e-commerce and marketplace platform with responsive storefront, centralized order and inventory operations, and AI-assisted catalog SEO.',
    verifiedFactsAr: [
      'منصة تجارة إلكترونية ذكية تهدف إلى تنظيم عمليات البيع والشراء وإدارة المنتجات والمخزون.',
      'الرابط المباشر يعمل بنجاح ومستضاف سحابياً عبر منصة Google Cloud Run.',
    ],
    verifiedFactsEn: [
      'AI-powered e-commerce and marketplace platform managing storefront and centralized catalog workflows.',
      'Live canonical web app deployed and operational on Google Cloud Run.',
    ],
    unverifiedBoundariesAr:
      'تكاملات الدفع الإلكتروني المباشر وبوابات الشحن قيد التطوير والربط عبر APIs، ولا يُدّعى اكتمالها الإنتاجي دون تحقق فعلي.',
    unverifiedBoundariesEn:
      'External payment gateways and automated shipping carrier APIs remain under development and subject to verified production testing.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Cloud Run'],
    technologiesSource: 'cv_stated',
    url: 'https://novaro-161052207749.europe-west2.run.app/',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://novaro-161052207749.europe-west2.run.app/',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'owner_screenshot_supplied',
      workflowsTested: false,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم تزويد الرابط الرسمي لمنصة Rufid Markets — التطبيق متاح للزيارة',
      statusSummaryEn: 'Canonical Rufid Markets URL provided — application available for live inspection',
      verificationNotesAr:
        'تم تأكيد تطابق اسم المشروع مع الاسم الفعلي للمنصة (Rufid Markets)، وتم الاحتفاظ بالرابط السحابي ولقطات الشاشة الحقيقية للمنصة.',
      verificationNotesEn:
        'Confirmed alignment of project identity with Rufid Markets storefront branding; cloud URL and genuine screenshots preserved.',
    },
    genuineScreenshotPath: '/assets/projects/rufid/rufid-01-home.png',
    thumbnailUrl: '/assets/projects/rufid/rufid-01-home.png',
    thumbnailAltAr: 'معاينة مشروع منصة رفيد ماركتس (Rufid Markets) للتجارة الإلكترونية الذكية',
    thumbnailAltEn: 'Rufid Markets AI-Powered E-Commerce & Marketplace Platform storefront preview',
    galleryMediaIds: [],
    screenshotCaptionAr: 'الواجهة الرئيسية لمنصة رفيد ماركتس (Rufid Markets) — العروض الخاطفة وتصفح المنتجات الفاخرة',
    screenshotCaptionEn: 'Rufid Markets Primary Storefront — Flash Deals & Curated Product Catalog',
    illustrativeTheme: {
      accentHex: '#2563EB',
      secondaryHex: '#1D4ED8',
      domainCode: 'ECOM-01',
      diagramType: 'ecommerce_storefront',
    },
  },
  {
    id: 'fresh',
    slug: 'fresh-digital-store',
    displayOrder: 2,
    featured: true,
    status: 'published',
    nameAr: 'فريش (FRESH) — متجر الفواكه والخضروات الطازجة ولوحة إدارة المخزون',
    nameEn: 'FRESH — Fresh Produce E-Commerce & Inventory Management Platform',
    category: 'e-commerce',
    categoryLabelAr: 'التجارة الإلكترونية وإدارة المخزون',
    categoryLabelEn: 'E-Commerce & Inventory Management',
    descriptionAr:
      'فريش (FRESH) منصة تجارة إلكترونية متكاملة متخصصة في بيع وتوصيل الفواكه والخضروات والورقيات الطازجة، تجمع بين واجهة تسوق عصرية متوافقة مع الجوال أولاً ولوحة تحكم إدارية شاملة لإدارة المنتجات والمخزون والفئات والطلبات.\n\nتوفر واجهة المتجر للعملاء تجربة تسوق سلسة باللغة العربية (RTL) تشمل البحث الفوري، لافتات العروض الأسبوعية (مثل خصم 20% على الخضروات الورقية)، تصفح الأقسام المصنفة (فواكه، خضروات، ورقيات)، صفحات تفاصيل المنتجات مع التسعير بالكيلو بالريال السعودي (ر.س) واقتراح المنتجات المشابهة، وسلة تسوق تفاعلية تتيح التحكم الدقيق بالأوزان والكميات.\n\nكما يتضمن التطبيق ملفاً شخصياً للعميل لإدارة الطلبات والمفضلة وعناوين التوصيل المحفوظة، وصفحة إعدادات متقدمة لتخصيص المظهر (فاتح، داكن، أو تلقائي حسب النظام) واللغة والعملة، إلى جانب لوحة إدارة متكاملة (/admin) لمتابعة إجمالي المنتجات، تنبيهات نفاد وانخفاض المخزون، وإدارة الفئات والكميات المتوفرة لحظياً.\n\nالهدف: تقديم تجربة متجر بقالة ومنتجات طازجة متكاملة تربط سلاسة التسوق الرقمي للعميل بدقة إدارة المخزون والتشغيل التجاري.',
    descriptionEn:
      'FRESH is an end-to-end e-commerce and inventory management platform specialized in fresh fruits, vegetables, and leafy greens, combining a mobile-first Arabic (RTL) customer storefront with a comprehensive administrative control panel.\n\nThe customer storefront delivers an intuitive shopping journey featuring instant product search, promotional weekly offer banners, visual category navigation (Fruits, Vegetables, Leafy Greens), detailed product views with per-kilogram SAR pricing and related item recommendations, and an interactive shopping cart with granular weight and quantity controls.\n\nAdditionally, the platform includes a customer profile hub for managing orders, favorites, and saved delivery addresses, an appearance & regional settings screen (Light, Dark, and System themes), and a dedicated Admin Dashboard (/admin) for monitoring total active products, low-stock and out-of-stock alerts, category slugs, and real-time inventory quantities.\n\nProject Objective: To provide a cohesive digital grocery and fresh-produce commerce experience uniting customer-facing shopping convenience with real-time inventory and catalog administration.',
    engineeringContributionAr:
      'تصميم وتطوير واجهة متجر إلكتروني متجاوبة للمنتجات الطازجة مع سلة تسوق تفاعلية، إعدادات ثيمات متعددة، ولوحة تحكم إدارية لإدارة المخزون والفئات.',
    engineeringContributionEn:
      'Design and engineering of a responsive fresh-produce e-commerce storefront with interactive weight-based cart logic, multi-theme settings, and an administrative inventory & category management dashboard.',
    verifiedFactsAr: [
      'واجهة متجر إلكتروني متكاملة للفواكه والخضروات والورقيات الطازجة بالريال السعودي (ر.س) مع دعم كامل للغة العربية (RTL).',
      'لوحة تحكم إدارية (/admin) لمتابعة إجمالي المنتجات، حالات نفاد وانخفاض المخزون، وإدارة الفئات والكميات.',
      'موثق بـ 9 لقطات شاشة حقيقية تشمل الرئيسية، تفاصيل المنتج، السلة، الفئات، حساب العميل، الإعدادات، ولوحات الإدارة والمخزون.',
    ],
    verifiedFactsEn: [
      'Complete Arabic (RTL) fresh-produce e-commerce storefront with per-kilogram SAR pricing, category filtering, and interactive shopping cart.',
      'Integrated Admin Dashboard (/admin) tracking active products, low/out-of-stock alerts, category management, and inventory levels.',
      'Documented with 9 genuine interface screenshots covering customer storefront flows, theme settings, and admin inventory operations.',
    ],
    unverifiedBoundariesAr:
      'يُعرض المشروع بواجهاته الحقيقية الموثقة للعميل ولوحة الإدارة؛ تخضع بوابات الدفع البنكي والربط اللوجستي الخارجي لبيئة النشر الإنتاجية.',
    unverifiedBoundariesEn:
      'Presented with its verified storefront and admin interfaces; live banking payment gateways and third-party courier APIs remain subject to production deployment configuration.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Base44'],
    technologiesSource: 'cv_stated',
    url: 'https://fresh-copy-49a90ea2.base44.app/',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://fresh-copy-49a90ea2.base44.app/',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'owner_screenshot_supplied',
      workflowsTested: true,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم توثيق واجهات المتجر وسلة التسوق ولوحة إدارة المخزون بلقطات شاشة حقيقية',
      statusSummaryEn: 'Storefront, cart workflows, and admin inventory dashboard verified with genuine screenshots',
      verificationNotesAr:
        'تم إرفاق ومعالجة 9 لقطات شاشة حقيقية توثق الواجهة الرئيسية، تفاصيل المنتج، سلة التسوق، الفئات، الملف الشخصي، الإعدادات، ولوحة التحكم وإدارة المخزون.',
      verificationNotesEn:
        'Attached and optimized 9 genuine screenshots documenting the storefront home, product detail view, shopping cart, categories, profile, settings, and admin inventory dashboard.',
    },
    genuineScreenshotPath: '/assets/projects/fresh/fresh-home.png',
    thumbnailUrl: '/assets/projects/fresh/fresh-home.png',
    thumbnailAltAr: 'الواجهة الرئيسية لمتجر FRESH للفواكه والخضروات الطازجة ولوحة إدارة المخزون',
    thumbnailAltEn: 'FRESH Fresh Produce E-Commerce & Inventory Management Platform main interface',
    galleryMediaIds: [],
    screenshotCaptionAr: 'الواجهة الرئيسية لمتجر FRESH — العروض الأسبوعية وتصفح الفواكه والخضروات والورقيات الطازجة',
    screenshotCaptionEn: 'FRESH Primary Storefront — Weekly Offers & Fresh Fruits, Vegetables, and Leafy Greens Catalog',
    illustrativeTheme: {
      accentHex: '#15803D',
      secondaryHex: '#16A34A',
      domainCode: 'ECOM-02',
      diagramType: 'digital_commerce',
    },
  },
  {
    id: 'pawere-global-store',
    slug: 'pawere-global-store',
    displayOrder: 3,
    featured: true,
    status: 'published',
    nameAr: 'Pawere Global Store — منصة التجارة الإلكترونية الذكية وإدارة المتاجر المتكاملة',
    nameEn: 'Pawere Global Store — Intelligent E-Commerce & Store Management Platform',
    category: 'e-commerce',
    categoryLabelAr: 'منصات التجارة الإلكترونية الذكية وإدارة المتاجر',
    categoryLabelEn: 'Intelligent E-Commerce & Store Management',
    descriptionAr:
      'Pawere Global Store هو مشروع منصة تجارة إلكترونية ذكية، مصممة لتوفير بيئة متكاملة لإنشاء المتاجر الإلكترونية وإدارتها وتخصيصها وتطويرها وفق احتياجات الأنشطة التجارية المختلفة. لا يقتصر المشروع على عرض المنتجات وبيعها، بل يستهدف الجمع بين إدارة المنتجات والطلبات والمخزون، وتحسين الظهور في محركات البحث (SEO)، وتخصيص تصميم المتجر، وربط قنوات البيع والخدمات التجارية الخارجية ضمن منظومة موحدة.\n\nتستهدف المنصة أصحاب المتاجر ورواد الأعمال والتجار الذين يرغبون في إدارة أعمالهم الرقمية بمرونة، مع الاستفادة من الأتمتة والذكاء الاصطناعي لتحسين تجربة التسوق، واكتشاف المنتجات عبر البحث الذكي (بالصوت والصورة والنص)، وتقديم الاقتراحات والعروض المناسبة للعملاء.\n\nالهدف: بناء منصة مرنة وقابلة للتوسع تساعد على إدارة المتاجر الإلكترونية بمختلف أنواعها، وتمنح المستخدم القدرة على تخصيص تجربة المتجر وتطوير عملياته التجارية من لوحة تحكم مركزية واحدة لتقليل تعقيد إدارة التجارة الإلكترونية.\n\nحالة المشروع: واجهة المتجر التفاعلية ومسارات البحث الذكي والشحن وبرنامج التسويق بالعمولة والاستدامة ومركز المساعدة منشورة وموثقة؛ بينما تندرج تكاملات المنصات الخارجية (Shopify، Salla، Amazon، AliExpress) والدروب شيبينغ وبوابات الدفع ضمن المعمارية القابلة للتوسع.',
    descriptionEn:
      'Pawere Global Store — Intelligent E-Commerce & Store Management Platform\n\nPawere Global Store is an intelligent e-commerce platform designed to provide an integrated environment for building, managing, customizing, and scaling online stores across diverse commercial activities. Rather than limiting scope to basic product listings, the project unites catalog, order, and inventory management, SEO discoverability, storefront theme customization, and external sales-channel integrations within a cohesive ecosystem.\n\nThe platform empowers store owners, entrepreneurs, and merchants to manage digital operations with agility while leveraging AI-assisted product discovery (natural language, voice, and visual search UI), smart recommendations, affiliate partnerships, and sustainability impact tracking.\n\nProject Objective: To deliver a flexible, scalable platform that enables merchants to customize their storefront experience and orchestrate end-to-end commercial workflows from a single unified hub.\n\nProject Status: Core storefront UI, AI-powered search interface, shipping workflows, tiered affiliate portal, sustainability dashboard, and help center are live and verified; external marketplace connectors (Shopify, Salla, Amazon, AliExpress), dropshipping automation, and live payment gateway settlements represent extensible architecture modules.',
    engineeringContributionAr:
      'تصميم وتطوير منظومة المتجر الإلكتروني التفاعلي بـ React و TypeScript و Tailwind CSS و shadcn/ui، بما يشمل واجهة البحث الذكي بالذكاء الاصطناعي (نص/صوت/صورة)، وبوابة التسويق بالعمولة المتدرجة، ولوحة مؤشرات الاستدامة البيئية، ونظام الشحن والتوصيل، ومركز مساعدة العملاء.',
    engineeringContributionEn:
      'Engineered the responsive multi-route commerce storefront using React, TypeScript, Tailwind CSS, and shadcn/ui, including the AI-Powered Search modal (text, voice, visual), tiered Affiliate Program portal, Sustainability Impact tracker, UK Shipping calculators, and interactive Help Center.',
    verifiedFactsAr: [
      'واجهة متجر إلكتروني منشورة وتفاعلية بالكامل مع شريط بحث ذكي مدعوم بالذكاء الاصطناعي (AI-Powered Search) يدعم البحث النصي والصوتي والبصري.',
      'تنظيم متكامل لأقسام المتجر والفئات التخصصية مع سلة تسوق وصفحات معلومات الشحن والتوصيل السريع خلال 24 ساعة (Standard & UK Express Next Day).',
      'بوابة برنامج التسويق بالعمولة (Affiliate Program) بهيكل عمولات متدرج من 4 طبقات (Starter 4%، Growth 5.5%، Pro 7%، Elite 8%) ومتطلبات الانضمام.',
      'لوحة التزامات الاستدامة والأثر البيئي (Sustainability Commitment) تتضمن مؤشرات التقدم البيئي والشراكات المعتمدة (RSPCA, WWF UK, Woodland Trust).',
      'مركز مساعدة ودعم فني تفاعلي (Help Center) مع قنوات الدردشة والبريد والهاتف والأسئلة الشائعة للأوامر والشحن.',
      'الرابط الرسمي المباشر للمنصة متاح للمعاينة: https://pawere-global-store-bandr.lovable.app.',
    ],
    verifiedFactsEn: [
      'Live interactive e-commerce storefront featuring an AI-Powered Search modal with natural language, voice, and camera search capabilities.',
      'Structured category navigation, shopping cart workflow, and dedicated Shipping Information hub with Standard (2–3 days) and UK Express Next Day tiers.',
      'Complete Affiliate Program portal featuring a 4-tier commission structure (Starter 4%, Growth 5.5%, Pro 7%, Elite 8%) and onboarding workflow.',
      'Dedicated Sustainability Commitment dashboard displaying environmental progress bars, carbon-neutral metrics, and charity partners.',
      'Interactive Help Center with live chat, email, and phone support channels plus expandable order and delivery FAQ accordions.',
      'Canonical deployed URL supplied by owner: https://pawere-global-store-bandr.lovable.app.',
    ],
    unverifiedBoundariesAr:
      'يتم التمييز بشفافية بين الواجهات المنشورة فعليًا في المتجر الحالي وبين قدرات التوسع المعماري المخطط لها (مثل الربط الفعلي مع Shopify و Salla و Amazon و AliExpress، وأتمتة الدروب شيبينغ مع الموردين، وتفعيل التحصيل المالي لبوابات الدفع الخلفية).',
    unverifiedBoundariesEn:
      'Explicitly distinguishes between live implemented storefront modules and planned extensible capabilities (such as live API synchronization with Shopify, Salla, Amazon, AliExpress, automated supplier dropshipping pipelines, and live payment gateway processing).',
    technologies: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'shadcn/ui',
      'AI Search UI',
      'E-Commerce Architecture',
      'SEO Optimization',
      'Lovable',
    ],
    technologiesSource: 'cv_stated',
    url: 'https://pawere-global-store-bandr.lovable.app',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://pawere-global-store-bandr.lovable.app',
      urlOpened: 'opened_with_branding_note',
      interfaceObserved: 'owner_screenshot_supplied',
      workflowsTested: true,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم توثيق 13 لقطة شاشة حقيقية للمنصة ومساراتها التفاعلية والرابط المباشر متاح',
      statusSummaryEn: '13 genuine platform screenshots verified across core routes; live URL accessible',
      verificationNotesAr:
        'تم التحقق البصري من الواجهة الرئيسية، البحث الذكي بالذكاء الاصطناعي، الفئات، الشحن (/shipping)، التسويق بالعمولة (/affiliates)، الاستدامة (/sustainability)، من نحن (/about)، مركز المساعدة (/help)، وسلة التسوق (/cart).',
      verificationNotesEn:
        'Visually verified across home hero, AI-Powered Search modal, categories, shipping (/shipping), affiliates (/affiliates), sustainability (/sustainability), about (/about), help center (/help), and shopping cart (/cart).',
    },
    genuineScreenshotPath: '/assets/projects/pawere/pawere-01-hero.png',
    thumbnailUrl: '/assets/projects/pawere/pawere-01-hero.png',
    thumbnailAltAr: 'الواجهة الرئيسية لمنصة Pawere Global Store للتجارة الإلكترونية الذكية',
    thumbnailAltEn: 'Pawere Global Store Intelligent E-Commerce Platform main storefront',
    screenshotCaptionAr: 'الواجهة الرئيسية لمنصة Pawere Global Store والبحث الذكي',
    screenshotCaptionEn: 'Pawere Global Store Main Storefront & AI Search Navigation',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#EA580C',
      secondaryHex: '#3B82F6',
      domainCode: 'ECOM-03',
      diagramType: 'global_catalog',
    },
    specificationPillars: [
      {
        id: 'catalog-management',
        index: '01',
        titleAr: 'إدارة المتجر والمنتجات والمخزون',
        titleEn: 'Store, Catalog & Inventory Management',
        badgeAr: 'واجهة أساسية مفعّلة',
        badgeEn: 'Core Storefront UI',
        statusType: 'implemented',
        itemsAr: [
          'إضافة المنتجات وتنظيمها داخل أقسام وفئات واضحة مع إدارة الصور والأسعار وحالة التوفر.',
          'تنظيم المخزون ومتابعة الكميات المتاحة وعرض المنتجات المميزة والعروض الموسمية والخصومات.',
        ],
        itemsEn: [
          'Organize products into structured categories with pricing, media, variants, and availability states.',
          'Track inventory levels and showcase featured collections, seasonal offers, and promotional discounts.',
        ],
      },
      {
        id: 'theme-customization',
        index: '02',
        titleAr: 'تخصيص المتجر وتجربة العرض المتجاوبة',
        titleEn: 'Storefront Customization & Responsive UX',
        badgeAr: 'واجهة أساسية مفعّلة',
        badgeEn: 'Core Storefront UI',
        statusType: 'implemented',
        itemsAr: [
          'تخصيص الثيمات والمظهر العام للمتجر والتحكم في الواجهات والأقسام الرئيسية وطريقة عرض المنتجات.',
          'مواءمة الهوية البصرية مع طبيعة النشاط التجاري عبر واجهة متجاوبة للجوال والأجهزة اللوحية وسطح المكتب.',
        ],
        itemsEn: [
          'Customize storefront themes, hero sections, and category layouts to match brand identity.',
          'Deliver a mobile-first responsive experience across smartphones, tablets, and desktop viewports.',
        ],
      },
      {
        id: 'ai-search-discovery',
        index: '03',
        titleAr: 'البحث الذكي والاقتراحات بالذكاء الاصطناعي',
        titleEn: 'AI-Powered Search & Smart Recommendations',
        badgeAr: 'واجهة البحث الذكي موثقة',
        badgeEn: 'Verified AI Search UI',
        statusType: 'implemented',
        itemsAr: [
          'البحث الذكي داخل المتجر عبر النص الطبيعي أو الصوت أو الكاميرا لتسهيل وصول العميل إلى المنتجات بسرعة.',
          'اقتراح منتجات وعروض وبدائل مكملة بناءً على سياق التصفح لتقليل وقت البحث وتحسين الاكتشاف.',
        ],
        itemsEn: [
          'Interactive AI-Powered Search supporting natural-language prompts, voice input, and visual camera search.',
          'Context-aware product suggestions, alternatives, and complementary offers to accelerate discovery.',
        ],
      },
      {
        id: 'orders-shipping',
        index: '04',
        titleAr: 'إدارة الطلبات والشحن وتجربة الشراء',
        titleEn: 'Order Workflow & Multi-Tier Shipping',
        badgeAr: 'مسارات الشحن والسلة موثقة',
        badgeEn: 'Verified Cart & Shipping',
        statusType: 'implemented',
        itemsAr: [
          'تنظيم سلة التسوق وعملية إتمام الطلب ومتابعة حالات الطلب من الاستلام حتى التنفيذ والشحن.',
          'إدارة خيارات التوصيل القياسي (2–3 أيام) والتوصيل السريع في اليوم التالي (Next Day Delivery) والشحن المجاني.',
        ],
        itemsEn: [
          'Streamlined shopping cart and checkout flow with order tracking from placement to fulfillment.',
          'Dedicated shipping module featuring Standard (2–3 business days), Express Next Day Delivery, and free shipping thresholds.',
        ],
      },
      {
        id: 'affiliate-sustainability',
        index: '05',
        titleAr: 'منظومة التسويق بالعمولة والاستدامة ودعم العملاء',
        titleEn: 'Affiliate Program, Sustainability & Help Center',
        badgeAr: 'منشور وموثق بالصور',
        badgeEn: 'Live & Screenshot Verified',
        statusType: 'implemented',
        itemsAr: [
          'بوابة شركاء النجاح (Affiliate Program) بعمولات متدرجة من 4% إلى 8% ولوحة تتبع الإحالات والمكافآت.',
          'لوحة الاستدامة والأثر البيئي (Sustainability) ومركز المساعدة التفاعلي (Help Center) للدردشة والأسئلة الشائعة.',
        ],
        itemsEn: [
          'Tiered Affiliate Program portal (Starter 4% to Elite 8%) with partner analytics and onboarding rules.',
          'Sustainability impact tracker (carbon neutrality, packaging, tree planting) and multi-channel Help Center.',
        ],
      },
      {
        id: 'seo-discoverability',
        index: '06',
        titleAr: 'تحسين محركات البحث (SEO) والظهور الرقمي',
        titleEn: 'Search Engine Optimization (SEO) Architecture',
        badgeAr: 'بنية مهيأة وقابلة للتخصيص',
        badgeEn: 'SEO-Ready Structure',
        statusType: 'implemented',
        itemsAr: [
          'تهيئة صفحات المتجر والمنتجات والمسارات المنظمة (/shipping, /affiliates, /sustainability, /help) للظهور في محركات البحث.',
          'إدارة العناوين والأوصاف التعريفية وتحسين بنية المحتوى لزيادة قابلية الاكتشاف العضوي.',
        ],
        itemsEn: [
          'Clean semantic routing (/shipping, /affiliates, /sustainability, /about, /help) engineered for search engine indexing.',
          'Customizable page titles, meta descriptions, and structured content hierarchy for organic discoverability.',
        ],
      },
      {
        id: 'payment-gateways',
        index: '07',
        titleAr: 'بوابات الدفع والخدمات المالية',
        titleEn: 'Payment Gateways & Financial Settlement',
        badgeAr: 'قابلية توسع وتكامل',
        badgeEn: 'Extensible Integration',
        statusType: 'extensible',
        itemsAr: [
          'إمكانية التوسع لربط وسائل الدفع الإلكتروني المتعددة وإدارة إعدادات التحصيل حسب السوق المستهدف.',
          'تنظيم الفواتير وبيانات العمليات الشرائية والمدفوعات الآمنة.',
        ],
        itemsEn: [
          'Extensible architecture designed to connect multi-currency electronic payment gateways by target market.',
          'Structured invoicing and transaction record management.',
        ],
      },
      {
        id: 'global-marketplaces',
        index: '08',
        titleAr: 'التكامل مع منصات التجارة والأسواق العالمية',
        titleEn: 'Global Marketplaces & E-Commerce Connectors',
        badgeAr: 'توسع مستقبلي (Shopify / Salla / Amazon)',
        badgeEn: 'Planned Connectors',
        statusType: 'extensible',
        itemsAr: [
          'قابلية الربط والتكامل مع منصات التجارة الإلكترونية الإقليمية والعالمية مثل Shopify و Salla.',
          'إمكانية التوسع للتكامل مع الأسواق العالمية مثل Amazon و AliExpress ومزامنة المنتجات والبيانات التجارية.',
        ],
        itemsEn: [
          'Designed for integration with leading e-commerce platforms including Shopify and Salla.',
          'Extensible connector roadmap for global marketplaces such as Amazon and AliExpress for cross-channel catalog sync.',
        ],
      },
      {
        id: 'dropshipping-suppliers',
        index: '09',
        titleAr: 'الدروب شيبينغ وإدارة الموردين',
        titleEn: 'Dropshipping & Supplier Fulfillment',
        badgeAr: 'نموذج تشغيل قابل للتوسع',
        badgeEn: 'Extensible Fulfillment',
        statusType: 'extensible',
        itemsAr: [
          'دعم نماذج البيع المرنة مثل الدروب شيبينغ واستيراد المنتجات وإدارة بيانات الموردين.',
          'متابعة توفر المنتجات لدى الموردين وتمرير الطلبات وفق آلية التشغيل المعتمدة.',
        ],
        itemsEn: [
          'Supports flexible fulfillment models including dropshipping product import and supplier directory management.',
          'Automated stock monitoring and order forwarding workflows.',
        ],
      },
      {
        id: 'intelligent-automation',
        index: '10',
        titleAr: 'الأتمتة والتطوير الذكي وتحليلات الأداء',
        titleEn: 'Intelligent Automation & Store Analytics',
        badgeAr: 'محرك ذكي قابل للتوسع',
        badgeEn: 'Smart Automation Layer',
        statusType: 'extensible',
        itemsAr: [
          'أتمتة المهام المتكررة في إدارة المنتجات والعروض والمساعدة في تحسين المحتوى التسويقي ووصف المنتجات.',
          'دعم اتخاذ القرار عبر مؤشرات وتقارير تساعد التاجر على فهم أداء المتجر وسلوك التسوق.',
        ],
        itemsEn: [
          'Automates repetitive catalog and promotional workflows while assisting with AI marketing copy optimization.',
          'Decision-support KPIs and analytical reporting to evaluate store conversion and growth.',
        ],
      },
      {
        id: 'multi-purpose-scalability',
        index: '11',
        titleAr: 'إدارة متعددة الاستخدامات وقابلية التوسع',
        titleEn: 'Multi-Purpose Modular Scalability',
        badgeAr: 'معمارية معيارية',
        badgeEn: 'Modular Architecture',
        statusType: 'implemented',
        itemsAr: [
          'تصميم مرن يصلح لأنواع متعددة من المتاجر والأنشطة التجارية والمنتجات التخصصية والعامة.',
          'بنية برمجية معيارية قابلة للتطوير لإضافة ميزات أو تكاملات وصلاحيات إدارية جديدة بكفاءة.',
        ],
        itemsEn: [
          'Versatile multi-vertical architecture adaptable to specialized retail niches or general multi-category stores.',
          'Modular codebase engineered for rapid feature expansion and centralized administrative control.',
        ],
      },
    ],
    targetAudienceAr: [
      'أصحاب المتاجر الإلكترونية الناشئة والمتوسطة الباحثون عن هوية رقمية احترافية.',
      'التجار ورواد الأعمال الراغبون في التحول الرقمي وتوسيع قنوات البيع.',
      'مشاريع البيع المباشر (D2C) ونماذج الدروب شيبينغ والتسويق بالعمولة.',
      'العلامات التجارية التي تحتاج متجرًا ذكيًا قابلاً للتخصيص والتوسع.',
    ],
    targetAudienceEn: [
      'Emerging and mid-sized online store owners seeking a high-trust digital storefront.',
      'Merchants and entrepreneurs pursuing digital transformation and multi-channel expansion.',
      'Direct-to-Consumer (D2C), affiliate-driven, and dropshipping commerce ventures.',
      'Brands requiring a customizable, AI-ready, and scalable e-commerce ecosystem.',
    ],
    valuePropositionAr:
      'يقدم Pawere Global Store تصورًا حديثًا لمنصة تجارة إلكترونية لا تكتفي بكونها متجرًا تقليديًا، بل تعمل كمنظومة ذكية قابلة للتخصيص والتكامل، تجمع بين تجربة التسوق، وإدارة العمليات، وتحسين الظهور الرقمي (SEO)، والذكاء الاصطناعي، والربط مع قنوات التجارة العالمية.',
    valuePropositionEn:
      'Pawere Global Store delivers a modern blueprint for an intelligent e-commerce platform—transcending traditional static storefronts to operate as a customizable, integration-ready ecosystem uniting shopping UX, operational management, SEO discoverability, AI-assisted search, and global commerce channels.',
  },
  {
    id: 'integrated-school-management',
    slug: 'al-manara-yemen-school-management-erp',
    displayOrder: 4,
    featured: true,
    status: 'published',
    nameAr: 'مجمع منارة اليمن التعليمي والتربوي النموذجي',
    nameEn: 'Al-Manara Yemen — School Management ERP',
    category: 'education-tech',
    categoryLabelAr: 'تقنيات التعليم وإدارة المدارس',
    categoryLabelEn: 'Education Tech / School ERP',
    descriptionAr:
      'مجمع منارة اليمن التعليمي والتربوي النموذجي هو مشروع نظام برمجي لإدارة العمليات المدرسية والأكاديمية ضمن منصة رقمية موحدة، بهدف تنظيم بيانات الطلاب والمعلمين والصفوف والمواد والأعوام الدراسية وتسهيل إدارة إجراءات الكنترول الأكاديمي.\n\nيركز المشروع على تنظيم عمليات رصد الدرجات والاختبارات، وتطبيق قواعد التقييم والحسابات الأكاديمية وفق إعدادات النظام، ومتابعة اكتمال الرصد والبيانات المرجعية، مع التوجه نحو توفير آليات للمراجعة والاعتماد وتتبع التعديلات.\n\nتتضمن الرؤية الوظيفية دعم تقارير النتائج وكشوف الدرجات والشهادات، والترتيب الأكاديمي، وخدمات الطلاب وأولياء الأمور، والحضور والغياب، والرسوم المدرسية، وفق مراحل التطوير الفعلية.\n\nتتبنى المعمارية نهجًا معياريًا يسمح بتطوير وحدات إضافية تدريجيًا مع الحفاظ على توافقها مع البيانات والشاشات الحالية.\n\nالهدف: تقليل الاعتماد على السجلات والإجراءات اليدوية، وتنظيم البيانات المدرسية، وتحسين اتساق عمليات الرصد والمراجعة والتقارير الأكاديمية.\n\nحالة المشروع: تطوير تدريجي؛ موضح أدناه الوظائف والوحدات المكتملة والمختبرة مقابل القدرات المستقبلية.',
    descriptionEn:
      'Al-Manara Yemen is a school management ERP project designed to organize academic and administrative workflows within a unified digital platform.\n\nThe project focuses on student, teacher, classroom, subject, examination, and academic-year data, with particular emphasis on grade entry and academic control workflows.\n\nIts functional direction includes configurable assessment rules, academic calculations, missing-grade monitoring, reference-data management, and workflows for reviewing, approving, and tracking academic record changes.\n\nThe broader roadmap includes academic reports, result statements, printable certificates, student ranking, parent and student services, attendance management, school fees, and further administrative functions, depending on the actual implementation status.\n\nThe architecture follows a modular approach that supports incremental development while aiming to preserve compatibility with existing records and application components.\n\nProject Objective: To reduce manual school administration, improve the organization of academic data, and establish a reliable foundation for grade management, review, and reporting.\n\nProject Status: Under incremental development, with individual modules classified according to verified implementation and testing evidence.',
    engineeringContributionAr:
      'تصميم وبناء نظام إدارة مدرسية معياري لتنظيم العمليات الأكاديمية ورصد الدرجات وإدارة الكنترول المدرسي وفق قواعد تقييم قابلة للضبط.',
    engineeringContributionEn:
      'Design and architecture of a modular school ERP platform structuring academic data, grade entry, and examination control workflows.',
    verifiedFactsAr: [
      'الاسم الرسمي المعتمد: مجمع منارة اليمن التعليمي والتربوي النموذجي (Al-Manara Yemen — School Management ERP).',
      'الرابط الرسمي مستضاف كتطبيق تفاعلي عبر منصة Google AI Studio.',
      'التقنيات المؤكدة في المعمارية الحالية: React, TypeScript, Node.js, Vite.',
    ],
    verifiedFactsEn: [
      'Official brand title: "مجمع منارة اليمن التعليمي والتربوي النموذجي" / "Al-Manara Yemen — School Management ERP".',
      'Hosted interactively on Google AI Studio.',
      'CV/Code verified technology stack: React, TypeScript, Node.js, Vite.',
    ],
    unverifiedBoundariesAr:
      'يتم تصنيف الميزات بوضوح بين الوظائف المكتملة والوحدات قيد التطوير (مثل حضور الطلاب والرسوم وبوابة أولياء الأمور)؛ لا يدعي النظام استخدام قواعد بيانات غير مؤكدة.',
    unverifiedBoundariesEn:
      'Features are transparently classified between core verified modules and roadmap items (such as attendance, fees, and parent portals); does not claim unverified database engines.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Vite'],
    technologiesSource: 'cv_stated',
    url: 'https://ai.studio/apps/8f028adf-0856-41be-b51c-1b6b9e4e044d?fullscreenApplet=true',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://ai.studio/apps/8f028adf-0856-41be-b51c-1b6b9e4e044d?fullscreenApplet=true',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'not_yet_observed',
      workflowsTested: false,
      publiclyAccessible: 'ai_studio_applet_requires_session_check',
      statusSummaryAr: 'تم تزويد الرابط الرسمي لمجمع منارة اليمن — متاح للزيارة المباشرة',
      statusSummaryEn: 'Canonical Al-Manara Yemen URL provided — available for direct access',
      verificationNotesAr:
        'مرتبط بالرابط الرسمي لمنصة Google AI Studio الخاص بمشروع مجمع منارة اليمن التعليمي.',
      verificationNotesEn:
        'Linked directly to the official Google AI Studio application for Al-Manara Yemen.',
    },
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة نظام مجمع منارة اليمن التعليمي',
    thumbnailAltEn: 'Al-Manara Yemen School Management ERP preview',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#2563EB',
      secondaryHex: '#7C3AED',
      domainCode: 'EDTECH-04',
      diagramType: 'school_platform',
    },
  },
  {
    id: 'sehasquare',
    slug: 'seha-square-healthcare-platform',
    displayOrder: 5,
    featured: true,
    status: 'published',
    nameAr: 'ساحة الصحة ونظام إدارة المستشفيات — المنصة الشاملة للرعاية الصحية',
    nameEn: 'Seha Square — Comprehensive Smart Healthcare & Hospital Management Platform',
    category: 'healthcare-tech',
    categoryLabelAr: 'التقنيات الصحية وإدارة المستشفيات',
    categoryLabelEn: 'HealthTech & Hospital Management ERP',
    descriptionAr:
      'ساحة الصحة ونظام إدارة المستشفيات هي منصة صحية رقمية متكاملة تهدف إلى إدارة العمليات الإدارية والتشغيلية للمستشفيات والمراكز الصحية وتسهيل الوصول إلى الخدمات الطبية وتنظيم المواعيد.\n\nيركز المشروع على تجربة المريض، إدارة السجلات الطبية والملفات، مواعيد العيادات والأطباء، التنسيق بين الأقسام، ولوحات تحكم مقدمي الرعاية الصحية والإدارة. يجمع المشروع بين قدرات منصة ساحة الصحة الرقمية ونظام إدارة المستشفيات الشامل (Hospital Management System) ضمن بيئة عمل آمنة، قابلة للتوسع، وتدعم اللغة العربية باتجاه (RTL).\n\nتتضمن المنصة واجهات متجاوبة لإدارة حجز المواعيد، ملفات المرضى والتخصصات، ومتابعة سير العمل الطبي والإداري.\n\nالهدف: توفير نظام موحد وشامل يجمع خدمات الرعاية الصحية وإدارة المستشفيات لتسهيل العمليات التشغيلية وتحسين تجربة المرضى والمستشفيات.',
    descriptionEn:
      'Seha Square & Hospital Management Platform is an integrated digital healthcare and hospital administration solution combining patient care, appointment scheduling, and comprehensive hospital operational workflows into a unified platform.\n\nThe project covers patient records, doctor scheduling, clinic management, and healthcare provider dashboards, uniting the Seha Square digital ecosystem with full Hospital Management System capabilities.\n\nProject Objective: To provide a unified platform streamlining healthcare services and hospital administration for improved operational efficiency and patient experience.',
    engineeringContributionAr:
      'تصميم وتطوير منصة صحية ومستشفيات متكاملة تدير مواعيد المرضى، السجلات الطبية، والعمليات التشغيلية للمستشفيات بـ React و TypeScript و Tailwind CSS.',
    engineeringContributionEn:
      'Development of an integrated healthcare and hospital management platform organizing patient appointments, medical records, and hospital operations using React, TypeScript, and Tailwind CSS.',
    verifiedFactsAr: [
      'الاسم المعتمد المدمج: ساحة الصحة ونظام إدارة المستشفيات (Seha Square & Hospital Management Platform).',
      'تم دمج مشروع نظام إدارة المستشفيات ومنصة ساحة الصحة في كيان برمجي ومهني واحد موحد ضمن فئة التقنيات الصحية.',
      'الرابط الرسمي المعتمد مستضاف على منصة Google AI Studio ومرفق بلقطة الشاشة الحقيقية.',
    ],
    verifiedFactsEn: [
      'Unified brand: Seha Square & Hospital Management Platform.',
      'Merged Seha Square and Hospital Management System into a single cohesive healthcare platform.',
      'Canonical URL hosted on Google AI Studio with owner-supplied genuine screenshot.',
    ],
    unverifiedBoundariesAr:
      'تخضع التكاملات مع الأجهزة الطبية الحية وأنظمة المستشفيات المركزية لاختبارات التحقق الميداني.',
    unverifiedBoundariesEn:
      'Live medical device integrations and central institutional EHR workflows remain subject to site validation.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Google AI Studio'],
    technologiesSource: 'cv_stated',
    url: 'https://ai.studio/apps/e6164f67-bf4a-405d-92d1-b9ecdf04a25f',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://ai.studio/apps/e6164f67-bf4a-405d-92d1-b9ecdf04a25f',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'owner_screenshot_supplied',
      workflowsTested: true,
      publiclyAccessible: 'ai_studio_applet_requires_session_check',
      statusSummaryAr: 'تم دمج مشروع نظام إدارة المستشفيات مع ساحة الصحة وتوثيق الواجهات الحقيقية للمنصة',
      statusSummaryEn: 'Unified Seha Square & Hospital Management Platform verified with genuine interface screenshots',
      verificationNotesAr:
        'تم إرفاق ومعالجة لقطات الشاشة الحقيقية للواجهة الرئيسية، لوحة الطبيب، تطبيق المريض، المساعد الذكي SehaBot، ولوحة الإدارة العليا Console V2.0.',
      verificationNotesEn:
        'Genuine cropped screenshots supplied covering the main portal, doctor dashboard, patient mobile app, SehaBot AI assistant, and SuperAdmin Console V2.0.',
    },
    genuineScreenshotPath: '/assets/projects/sehasquare/seha-01-hero.png',
    thumbnailUrl: '/assets/projects/sehasquare/seha-01-hero.png',
    thumbnailAltAr: 'الواجهة الرئيسية لمنصة ساحة الصحة الذكية ونظام إدارة المستشفيات',
    thumbnailAltEn: 'Seha Square & Hospital Management Platform main interface',
    galleryMediaIds: [],
    screenshotCaptionAr: 'الواجهة الرئيسية لمنصة ساحة الصحة الذكية وإدارة الرعاية الصحية الحديثة (SehaSquare Excellence)',
    screenshotCaptionEn: 'Main landing interface of Seha Square Smart Healthcare & Hospital Management Platform',
    illustrativeTheme: {
      accentHex: '#0D9488',
      secondaryHex: '#2563EB',
      domainCode: 'HEALTH-05',
      diagramType: 'healthcare_portal',
    },
  },
  {
    id: 'injazak-tech',
    slug: 'enjazak-tech-solutions',
    displayOrder: 6,
    featured: true,
    status: 'published',
    nameAr: 'إنجازك التقني | ENJAZAK TECH — إدارة وأتمتة أعمال وحلول تقنية',
    nameEn: 'ENJAZAK TECH — Business Management, Automation & Technology Solutions',
    category: 'web-development',
    categoryLabelAr: 'حلول تقنية متكاملة وأتمتة أعمال',
    categoryLabelEn: 'Technology Solutions Integrator & Business Automation',
    descriptionAr:
      'إنجازك التقني (Enjazak Tech) هو مشروع لشركة حلول تقنية متكاملة مقرها صنعاء – الجمهورية اليمنية، متخصصة في تجهيز الشركات والمؤسسات والأنشطة التجارية بالبنية التحتية التقنية والأنظمة الرقمية اللازمة لتشغيل أعمالها بكفاءة وأمان وتنظيم احترافي.\n\nيركز المشروع على تقديم حلول مترابطة تبدأ من تأسيس الشبكات الداخلية والسيرفرات، وتركيب أنظمة كاميرات المراقبة والأمن، مرورًا بتوفير وتنفيذ أنظمة المحاسبة ونقاط البيع وإدارة المخزون، وصولًا إلى أتمتة إجراءات العمل، وربط الأنظمة، وتقديم الدعم الفني والصيانة المستمرة.\n\nكما يتضمن المشروع منصة رقمية حديثة تمثل الواجهة الرسمية للشركة على الإنترنت (مُستضافة عبر Vercel)، وتعمل كقناة تعريفية وتسويقية وتشغيلية لاستعراض الخدمات، وعرض الحلول المخصصة حسب كل قطاع (المطاعم والكافيهات، المولات والمحلات، المستشفيات والعيادات، الصيدليات، المدارس، والشركات)، وإبراز المشاريع المنفذة ومنهجية التنفيذ السداسية، واستقبال طلبات الاستشارة والمعاينة الميدانية وعروض الأسعار.\n\nوإلى جانب الموقع العام، يشمل نطاق المنصة بوابة إدارة داخلية (/admin) مخصصة لإدارة المشاريع، ومتابعة العملاء المحتملين وطلبات الاستشارة والتوظيف، وتحليل الأداء، ومراقبة سجل النشاطات الإدارية وفق الصلاحيات المعتمدة.\n\nالرؤية والرسالة: أن تكون "إنجازك التقني" شريكًا تقنيًا موثوقًا للمؤسسات في اليمن عبر بناء بنية تقنية مستقرة وآمنة وقابلة للتوسع تجمع الشبكات، الأنظمة الأمنية، البرمجيات التشغيلية، وأتمتة الأعمال تحت مظلة هندسية واحدة من المعاينة وحتى التدريب والدعم المستمر.',
    descriptionEn:
      'Enjazak Tech is an integrated technology solutions company based in Sana\'a, Yemen, dedicated to equipping businesses, institutions, and commercial ventures with reliable IT infrastructure, security systems, and operational software.\n\nThe company delivers end-to-end solutions spanning LAN network engineering, server setup, and CCTV surveillance systems, through to POS, accounting, inventory management, workflow automation, systems integration, and ongoing technical support.\n\nAlongside its field engineering services, the project features a modern bilingual corporate platform deployed on Vercel. It serves as an interactive showcase and lead-generation hub presenting core services, sector-tailored packages (restaurants & cafes, malls & retail, hospitals & clinics, pharmacies, schools, and corporate offices), portfolio projects, a 6-step engineering delivery methodology, and instant consultation/site-survey booking.\n\nThe digital product scope also encompasses an internal Admin Portal (/admin) designed for managing portfolio projects, tracking CRM leads and consultation/career requests, viewing analytical charts, and auditing administrative activity logs under role-based access controls.\n\nVision & Mission: To act as a trusted single-window technology integrator in Yemen—replacing vendor fragmentation with cohesive, scalable infrastructure and business automation from initial site inspection through staff training and post-deployment support.',
    engineeringContributionAr:
      'تصميم وتطوير المنصة الرقمية التعريفية والتشغيلية لشركة إنجازك التقني بـ React 19 و TypeScript و Tailwind CSS و Framer Motion مع هيكلة بوابة الإدارة (/admin) ونظام متابعة العملاء (CRM) ومخططات التحليلات بـ Recharts وخدمات Firebase.',
    engineeringContributionEn:
      'Architected and developed the bilingual RTL/LTR corporate web platform and administrative CRM portal (/admin) using React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, and Firebase services deployed on Vercel.',
    verifiedFactsAr: [
      'الاسم الرسمي المعتمد: إنجازك التقني | ENJAZAK TECH — إدارة وأتمتة أعمال وحلول تقنية (مقرها صنعاء – اليمن، بخبرة تتجاوز +10 سنوات في السوق اليمني).',
      'الرابط الرسمي المباشر منشور ويعمل عبر منصة Vercel: https://injazak-tech.vercel.app/.',
      'توثيق كامل لواجهات الموقع الحقيقية عبر 7 لقطات شاشة عالية الدقة تشمل: الواجهة الرئيسية، الخدمات، الحلول القطاعية، معرض المشاريع، منهجية العمل السداسية، قسم من نحن، وشركاء التكنولوجيا العالميين (Cisco, Hikvision, Dell, HP, MikroTik, Ubiquiti).',
      'دعم ثنائي اللغة (العربية RTL والإنجليزية LTR) مع التبديل بين الوضع الداكن والفاتح وتصميم متجاوب.',
    ],
    verifiedFactsEn: [
      'Official identity: ENJAZAK TECH — Business Management, Automation & Technology Solutions (based in Sana\'a, Yemen, showcasing 10+ years of market experience).',
      'Live canonical deployment verified on Vercel: https://injazak-tech.vercel.app/.',
      'Documented with 7 genuine cropped interface screenshots covering Hero, Services, Sector Solutions, Portfolio Showcase, 6-Step Methodology, About Us, and Global Tech Partners (Cisco, Hikvision, Dell, HP, MikroTik, Ubiquiti).',
      'Full bilingual RTL/LTR support, Dark/Light theme switching, and responsive glassmorphic dark-gold UI.',
    ],
    unverifiedBoundariesAr:
      'تُعرض قدرات بوابة الإدارة الخلفية (/admin)، وقواعد أمان Firestore الفعلية، ومراحل التطوير المستقبلية الخمس (بوابة العملاء، عروض الأسعار الآلية، تذاكر الصيانة، وأتمتة إشعارات واتساب/البريد) بشفافية كخصائص ضمن نطاق المنتج وخارطة الطريق، وتخضع للتحقق من بيئة النشر والصلاحيات.',
    unverifiedBoundariesEn:
      'Internal Admin Portal (/admin) persistence, production Firestore security rules, and the 5-stage future roadmap (Client Portal, Dynamic Quotations, Support Ticketing, and WhatsApp/Email automation) are transparently documented as product-scope and roadmap capabilities subject to deployment environment verification.',
    technologies: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'Framer Motion',
      'Firebase Auth & Firestore',
      'Recharts',
      'Lucide Icons',
      'Vercel',
    ],
    technologiesSource: 'cv_stated',
    url: 'https://injazak-tech.vercel.app/',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://injazak-tech.vercel.app/',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'owner_screenshot_supplied',
      workflowsTested: true,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم توثيق المنصة الحية على Vercel وإرفاق 7 لقطات شاشة حقيقية محسنة لواجهات الموقع',
      statusSummaryEn: 'Live Vercel platform documented with 7 genuine optimized interface screenshots',
      verificationNotesAr:
        'تم اقتصاص وتحسين 7 لقطات شاشة حقيقية من الموقع المباشر https://injazak-tech.vercel.app/ وتوثيق المواصفات الفنية والخدمية الشاملة.',
      verificationNotesEn:
        'Cropped and optimized 7 genuine screenshots from https://injazak-tech.vercel.app/ alongside the complete bilingual technical and service specification.',
    },
    genuineScreenshotPath: '/assets/projects/injazak/injazak-01-hero.png',
    thumbnailUrl: '/assets/projects/injazak/injazak-01-hero.png',
    thumbnailAltAr: 'الواجهة الرئيسية لمنصة إنجازك التقني (ENJAZAK TECH) لحلول الشبكات والكاميرات والأنظمة وأتمتة الأعمال',
    thumbnailAltEn: 'ENJAZAK TECH Main Hero Interface — Business Management, Automation & Technology Solutions',
    galleryMediaIds: [],
    screenshotCaptionAr:
      'الواجهة الرئيسية لمنصة إنجازك التقني (ENJAZAK TECH): نصمم المستقبل الرقمي بفخامة ودقة — شبكات، كاميرات، أنظمة، وأتمتة أعمال',
    screenshotCaptionEn:
      'ENJAZAK TECH Primary Hero Showcase: Designing the Digital Future with Precision — Networks, CCTV, ERP/POS Systems & Business Automation',
    illustrativeTheme: {
      accentHex: '#D4AF37',
      secondaryHex: '#0F172A',
      domainCode: 'WEB-06',
      diagramType: 'corporate_web',
    },
    specificationPillars: [
      {
        id: 'injazak-network-infrastructure',
        index: '01',
        titleAr: 'تصميم وتنفيذ الشبكات والبنية التحتية (IT Infrastructure & LAN)',
        titleEn: 'Network Engineering & IT Infrastructure',
        badgeAr: 'خدمة أساسية منفذة',
        badgeEn: 'Core Service Track',
        statusType: 'implemented',
        itemsAr: [
          'دراسة الموقع وتخطيط نقاط الشبكة وتنفيذ التمديدات السلكية واللاسلكية (LAN / Wi-Fi) للمكاتب والمباني والمؤسسات.',
          'تركيب وتنظيم كبائن الشبكة (Racks)، السويتشات، الراوترات، نقاط الوصول (Access Points)، وتجهيز السيرفرات المحلية.',
          'تنظيم عناوين الشبكة، تقسيمها، رفع كفاءة الاتصال الداخلي، واختبار استقرار وأداء البنية التحتية.',
        ],
        itemsEn: [
          'Site survey, network point planning, and structured wired/wireless (LAN / Wi-Fi) cabling for offices and multi-floor facilities.',
          'Installation and organization of server racks, switches, routers, access points, and local on-premise servers.',
          'IP subnetting, internal connectivity optimization, and rigorous network stability testing.',
        ],
      },
      {
        id: 'injazak-cctv-security',
        index: '02',
        titleAr: 'أنظمة كاميرات المراقبة والأمن البصري (CCTV & Surveillance)',
        titleEn: 'CCTV Surveillance & Visual Security Systems',
        badgeAr: 'خدمة أساسية منفذة',
        badgeEn: 'Core Service Track',
        statusType: 'implemented',
        itemsAr: [
          'معاينة المواقع وتحديد زوايا التغطية المناسبة وتوريد وتركيب الكاميرات الداخلية والخارجية عالية الدقة.',
          'إعداد أجهزة التسجيل الشبكية والرقمية (NVR / DVR) وتنظيم وحدات التخزين وفترات الاحتفاظ بالتسجيلات.',
          'ربط أنظمة المراقبة بالهواتف الذكية وأجهزة الإدارة للمتابعة عن بُعد مع صيانة دورية وفحص جودة التسجيل.',
        ],
        itemsEn: [
          'Field site assessment, blind-spot analysis, and installation of indoor/outdoor high-definition security cameras.',
          'Configuration of NVR/DVR recording appliances, storage retention policies, and backup power readiness.',
          'Remote mobile/desktop live monitoring setup coupled with preventive maintenance and recording health checks.',
        ],
      },
      {
        id: 'injazak-pos-accounting',
        index: '03',
        titleAr: 'أنظمة المحاسبة ونقاط البيع والمخزون (POS, Accounting & Inventory)',
        titleEn: 'POS, Accounting & Inventory Management Systems',
        badgeAr: 'خدمة أساسية منفذة',
        badgeEn: 'Core Service Track',
        statusType: 'implemented',
        itemsAr: [
          'تجهيز أنظمة نقاط البيع (POS) للمحلات والمطاعم والصيدليات والأنشطة التجارية وإعداد الفواتير والمبيعات والمشتريات.',
          'ربط طابعات الفواتير، قارئات الباركود، شاشات الكاشير، وصناديق النقد، وإدارة الأصناف والمخزون والمستودعات.',
          'إعداد التقارير المالية والتشغيلية وتخصيص صلاحيات المستخدمين (كاشير، محاسب، مدير) وتدريب الطاقم.',
        ],
        itemsEn: [
          'Turnkey POS deployment for retail stores, restaurants, and pharmacies covering sales, purchasing, and invoicing.',
          'Hardware integration with receipt printers, barcode scanners, cashier terminals, and cash drawers alongside stock tracking.',
          'Financial/operational reporting, role-based staff permissions (cashier, accountant, manager), and on-site user training.',
        ],
      },
      {
        id: 'injazak-business-automation',
        index: '04',
        titleAr: 'أتمتة الأعمال وتكامل الأنظمة والدعم الفني (Automation & Support)',
        titleEn: 'Business Automation, Integration & Technical Support',
        badgeAr: 'خدمة أساسية منفذة',
        badgeEn: 'Core Service Track',
        statusType: 'implemented',
        itemsAr: [
          'تحويل الإجراءات الورقية واليدوية إلى إجراءات رقمية منظمة وربط المبيعات بالمخزون والمحاسبة والتقارير.',
          'تقليل التكرار والأخطاء التشغيلية، تنظيم صلاحيات الموظفين، وتسهيل متابعة الأداء اليومي من قِبل الإدارة.',
          'تقديم خدمات الدعم الفني (عن بُعد أو ميدانيًا)، عقود الصيانة الدورية، وحل أعطال الشبكات والأجهزة والبرمجيات.',
        ],
        itemsEn: [
          'Digitizing manual paper workflows and synchronizing sales, inventory, accounting, and executive reporting.',
          'Eliminating repetitive data entry errors, enforcing staff access controls, and enabling real-time managerial oversight.',
          'Remote and on-site technical support, preventive maintenance contracts, and infrastructure troubleshooting.',
        ],
      },
      {
        id: 'injazak-sector-solutions',
        index: '05',
        titleAr: 'الحلول المخصصة حسب القطاعات (6 قطاعات حيوية)',
        titleEn: 'Sector-Tailored Industry Solutions (6 Key Verticals)',
        badgeAr: 'حلول قطاعية متخصصة',
        badgeEn: '6 Industry Verticals',
        statusType: 'implemented',
        itemsAr: [
          'المطاعم والكافيهات، والمولات والمحلات التجارية: نقاط بيع سريعة، إدارة الطاولات والطلبات، الباركود، الجرد، وكاميرات مراقبة الكاشير والصالات.',
          'المستشفيات والمراكز الطبية، والصيدليات: شبكات داخلية مستقرة، ربط الأقسام والاستقبال، إدارة الأصناف الدوائية وتواريخ الصلاحية، وأنظمة المراقبة.',
          'المدارس والمؤسسات التعليمية، والشركات والمكاتب: شبكات الفصول والإدارة، السيرفرات ومشاركة الملفات، الأنظمة المالية والإدارية، والدعم الفني.',
        ],
        itemsEn: [
          'Restaurants & Cafes, Malls & Retail: High-speed POS, table/kitchen order routing, barcode scanning, stock audits, and cashier/hall CCTV.',
          'Hospitals & Clinics, Pharmacies: Reliable multi-department LAN, reception connectivity, batch/expiry drug inventory tracking, and facility security.',
          'Schools & Educational Institutions, Corporate Offices: Campus/office networking, file servers, administrative/financial systems, and IT support.',
        ],
      },
      {
        id: 'injazak-web-methodology',
        index: '06',
        titleAr: 'الموقع التعريفي التفاعلي ومنهجية التنفيذ السداسية',
        titleEn: 'Interactive Corporate Website & 6-Step Engineering Methodology',
        badgeAr: 'واجهة منشورة وموثقة',
        badgeEn: 'Verified Live UI',
        statusType: 'implemented',
        itemsAr: [
          'واجهة رئيسية احترافية بهوية بصرية فاخرة (الداكن والذهبي)، شريط شركاء التكنولوجيا العالميين (Cisco, Hikvision, Dell, HP, MikroTik, Ubiquiti)، وتبديل اللغة (AR/EN) والمظهر.',
          'معرض مشاريع تفاعلي قابل للتصفية حسب الفئة (الكل، شبكات، مراقبة، أنظمة، أتمتة) مع نافذة تفاصيل المشروع (Modal) ومعرض صور ونتائج.',
          'منهجية تنفيذ هندسية من 6 مراحل: (01 معاينة المشروع، 02 التخطيط والتصميم، 03 التركيب والتنفيذ، 04 البرمجة والتشغيل، 05 التدريب والتسليم، 06 الدعم الفني) بالإضافة إلى الأسئلة الشائعة، التوظيف، ونموذج طلب الاستشارة.',
        ],
        itemsEn: [
          'Luxury dark-and-gold responsive storefront featuring global technology partners (Cisco, Hikvision, Dell, HP, MikroTik, Ubiquiti), AR/EN language toggle, and Dark/Light mode.',
          'Filterable project portfolio (All, Networks, Surveillance, Systems, Automation) with interactive detail modals, image galleries, and outcomes.',
          'Structured 6-step engineering delivery lifecycle (01 Site Survey, 02 Planning & Design, 03 Installation, 04 Configuration, 05 Training & Handover, 06 Technical Support) plus FAQ, Careers, and Consultation booking.',
        ],
      },
      {
        id: 'injazak-admin-crm',
        index: '07',
        titleAr: 'لوحة الإدارة المركزية ونظام متابعة العملاء (/admin CRM Portal)',
        titleEn: 'Central Admin Portal & CRM Lead Management (/admin)',
        badgeAr: 'نطاق إداري وتشغيلي',
        badgeEn: 'Admin & CRM Scope',
        statusType: 'extensible',
        itemsAr: [
          'إدارة المشاريع (إضافة، تعديل، حذف، تمييز المشاريع، وإدارة معرض الصور والنتائج) من داخل لوحة التحكم.',
          'إدارة العملاء المحتملين وطلبات التواصل (CRM): متابعة حالة الطلب (جديد، تم التواصل، قيد التفاوض، تم الإغلاق، ملغي)، تصدير CSV، والتواصل المباشر عبر واتساب أو الاتصال.',
          'لوحة تحليلات بيانية (Recharts) لتوزيع المشاريع وحالات الطلبات، مع إدارة طلبات التوظيف وسجل النشاطات الإدارية (Activity Log).',
        ],
        itemsEn: [
          'Full CRUD portfolio management enabling admins to add, edit, feature, or remove projects and multi-image galleries.',
          'CRM lead pipeline tracking inquiry statuses (New, Contacted, Negotiating, Closed, Cancelled) with CSV export and one-click WhatsApp/Call actions.',
          'Recharts analytical visualizations for project categories and lead conversion alongside career application reviews and admin Activity Logs.',
        ],
      },
      {
        id: 'injazak-security-governance',
        index: '08',
        titleAr: 'معمارية الأمان وحوكمة البيانات والصلاحيات (Security & RBAC)',
        titleEn: 'Security Architecture, Data Governance & RBAC',
        badgeAr: 'حوكمة وأمان البيانات',
        badgeEn: 'Security & RBAC',
        statusType: 'extensible',
        itemsAr: [
          'مصادقة المشرفين عبر Firebase Authentication مع التحقق من الأدوار والصلاحيات (Role-Based Access Control) لعزل مسارات الإدارة (/admin).',
          'قواعد أمان Firestore للفصل بين القراءة العامة للمشاريع المنشورة، وإنشاء طلبات التواصل، وتقييد عمليات التعديل والحذف والاطلاع على بيانات العملاء بالمشرفين فقط.',
          'التحقق من المدخلات وتنظيف الحقول قبل الحفظ، مع تسجيل العمليات الإدارية الحساسة في سجل النشاطات (Activity Log).',
        ],
        itemsEn: [
          'Admin authentication via Firebase Auth paired with Role-Based Access Control (RBAC) protecting internal /admin routes.',
          'Granular Firestore security rules separating public project reads and inquiry submissions from admin-only lead data and mutations.',
          'Strict payload validation and sanitization complemented by an auditable administrative Activity Log.',
        ],
      },
      {
        id: 'injazak-future-roadmap',
        index: '09',
        titleAr: 'خارطة التطوير المستقبلية (5 مراحل استراتيجية)',
        titleEn: '5-Phase Strategic Product Roadmap',
        badgeAr: 'توسع مستقبلي (5 مراحل)',
        badgeEn: '5-Phase Roadmap',
        statusType: 'extensible',
        itemsAr: [
          'المرحلة 1 و 2: إطلاق بوابة العملاء (Client Portal) لمتابعة حالة المشاريع والفواتير، ونظام عروض الأسعار التقديرية التفاعلي مع تصدير PDF.',
          'المرحلة 3 و 4: نظام تذاكر الدعم الفني والصيانة (Support Ticketing & SLA) مع جدولة الزيارات الميدانية، وتوسيع لوحة التحليلات ومؤشرات الأداء.',
          'المرحلة 5: أتمتة الإشعارات الفورية عبر البريد الإلكتروني وواتساب عند وصول طلب استشارة أو تحديث حالة مشروع.',
        ],
        itemsEn: [
          'Phases 1 & 2: Dedicated Client Portal for tracking project milestones/invoices and an interactive Quotation Builder with PDF export.',
          'Phases 3 & 4: Technical Support Ticketing & SLA tracking system with field-visit scheduling and advanced conversion analytics.',
          'Phase 5: Automated WhatsApp and email notification pipelines triggered on new consultation leads and project updates.',
        ],
      },
    ],
    targetAudienceAr: [
      'المطاعم والكافيهات والسلاسل الغذائية الباحثة عن أنظمة نقاط بيع (POS) وإدارة طلبات ومراقبة متكاملة.',
      'المولات والمراكز التجارية ومحلات التجزئة والسوبرماركت التي تحتاج شبكات، باركود، جرد مخزني، وكاميرات أمنية.',
      'المستشفيات والعيادات والمراكز الطبية والصيدليات الراغبة في بنية شبكية مستقرة وأنظمة إدارة أصناف ومواعيد.',
      'المدارس والمؤسسات التعليمية والشركات والمكاتب التي تتطلب تجهيز شبكات وسيرفرات وأنظمة محاسبية ودعمًا فنيًا مستمرًا.',
    ],
    targetAudienceEn: [
      'Restaurants, cafes, and F&B chains seeking integrated POS, kitchen order routing, inventory, and CCTV monitoring.',
      'Commercial malls, supermarkets, and retail stores requiring structured networks, barcode systems, stock control, and surveillance.',
      'Hospitals, medical clinics, and pharmacies needing reliable multi-department LAN infrastructure and expiry/inventory management.',
      'Schools, educational complexes, and corporate offices looking for turnkey server setup, accounting ERP, and ongoing IT support.',
    ],
    valuePropositionAr:
      'يقدم مشروع "إنجازك التقني" نموذجًا متكاملًا لشركة حلول تقنية وأتمتة أعمال تجمع بين التجهيز الميداني (الشبكات، السيرفرات، وكاميرات المراقبة) والأنظمة البرمجية (نقاط البيع، المحاسبة، والمخزون) والمنصة الرقمية التفاعلية مع لوحة إدارة CRM، مما يجنّب العميل تشتت التعامل مع عدة موردين ويضمن له شريكًا هندسيًا واحدًا من المعاينة وحتى التدريب والدعم الفني.',
    valuePropositionEn:
      'Enjazak Tech delivers a unified Technology Solutions Integrator model bridging field hardware engineering (LAN networks, servers, CCTV surveillance) with operational software (POS, accounting, inventory) and an interactive digital platform with built-in CRM—eliminating vendor fragmentation from initial site survey through training and long-term support.',
    caseStudy: {
      problemStatementAr:
        'تواجه العديد من الشركات والمؤسسات التجارية في السوق المحلي تحديات تشغيلية ناتجة عن الاعتماد على الإجراءات اليدوية، وضعف البنية التحتية للشبكات، وغياب الربط بين المبيعات والمخزون والمحاسبة، وتشتت الخدمات بين عدة جهات منفصلة للشبكات والكاميرات والبرمجيات.',
      problemStatementEn:
        'Many local businesses and institutions struggle with fragmented vendors for networking, CCTV, and software, alongside manual paper processes, unstable internal connectivity, and disconnected sales, inventory, and accounting records.',
      architectureLayersAr: [
        'طبقة الواجهة الأمامية التفاعلية (React 19, TypeScript, Tailwind CSS, Framer Motion): موقع تعريفي ثنائي اللغة (RTL/LTR) يستعرض الخدمات، الحلول القطاعية، المشاريع، ومنهجية التنفيذ السداسية.',
        'طبقة بوابة الإدارة ومتابعة العملاء (/admin, Recharts, Lucide): إدارة المشاريع والوسائط، تتبع طلبات الاستشارة والعملاء المحتملين (CRM)، مراجعة طلبات التوظيف، وسجل النشاطات.',
        'طبقة الخدمات السحابية والأمان (Firebase Auth & Firestore, Vercel): مصادقة المشرفين، تخزين البيانات اللحظي، قواعد الصلاحيات (RBAC)، والنشر السحابي السريع.',
      ],
      architectureLayersEn: [
        'Interactive Frontend Layer (React 19, TypeScript, Tailwind CSS, Framer Motion): Bilingual RTL/LTR corporate storefront showcasing services, 6 industry verticals, portfolio modals, and 6-step methodology.',
        'Admin & CRM Operations Layer (/admin, Recharts, Lucide): Portfolio CRUD management, lead status pipeline with CSV export, career applications review, and audit Activity Logs.',
        'Cloud Persistence & Security Layer (Firebase Auth & Firestore, Vercel): Role-based authentication, real-time collections, security rules isolation, and global edge hosting.',
      ],
      keyEngineeringContributionsAr: [
        'بناء واجهة مستخدم فاخرة بالثيم الداكن والذهبي تدعم العربية والإنجليزية وتستعرض 6 قطاعات أعمال رئيسية ومنهجية تنفيذ من 6 مراحل.',
        'تطوير معرض أعمال تفاعلي قابل للتصفية مع نوافذ تفاصيل غنية وصور متعددة لكل مشروع منفذ.',
        'هيكلة لوحة إدارة متكاملة (/admin) تشمل إدارة العملاء المحتملين (CRM)، الرسوم البيانية (Recharts)، وتصدير البيانات (CSV).',
      ],
      keyEngineeringContributionsEn: [
        'Engineered a dark-and-gold bilingual interface presenting 6 industry-specific solution packages and a 6-stage engineering delivery workflow.',
        'Built an interactive filterable project showcase with detailed case modals and multi-image galleries.',
        'Structured a comprehensive /admin portal featuring CRM lead pipelines, Recharts analytics, and CSV reporting.',
      ],
      dataAndValidationNotesAr:
        'الواجهة الأمامية منشورة وموثقة عبر الرابط الرسمي https://injazak-tech.vercel.app/ و7 لقطات شاشة حقيقية؛ بينما تُصنّف وحدات الإدارة الخلفية وخارطة الطريق المستقبلية بوضوح ضمن نطاق التطوير والصلاحيات.',
      dataAndValidationNotesEn:
        'Public storefront is live at https://injazak-tech.vercel.app/ and verified via 7 genuine screenshots; internal admin persistence and roadmap modules are transparently scoped.',
    },
  },
  {
    id: 'lumen-yemeni',
    slug: 'lumen-of-yemeni-ai-platform',
    displayOrder: 7,
    featured: true,
    status: 'published',
    nameAr: 'لومن اليمني — منصة الذكاء الاصطناعي والإبداع الرقمي',
    nameEn: 'Lumen of Yemeni — AI-Powered Creative & Productivity Platform',
    category: 'web-development',
    categoryLabelAr: 'الذكاء الاصطناعي متعدد الوسائط والإبداع الرقمي',
    categoryLabelEn: 'Multimodal AI & Digital Productivity',
    descriptionAr:
      'Lumen of Yemeni منصة رقمية تهدف إلى جمع أدوات الذكاء الاصطناعي في مساحة عمل موحدة تساعد الأفراد وصناع المحتوى والمطورين والطلاب ورواد الأعمال والشركات على تحويل الأفكار إلى محتوى رقمي وسير عمل أكثر إنتاجية.\n\nيركز المشروع على تجربة موحدة لخدمات الذكاء الاصطناعي، تشمل المساعد الذكي والمحادثة النصية، وتوليد الصور، ومعالجة الصوت، وتحويل النص إلى كلام، وتوليد الموسيقى والفيديو بحسب الخدمات التي يدعمها الإصدار الفعلي.\n\nتستهدف الرؤية التقنية إنشاء بنية مرنة تسمح بالتكامل مع مزودي الذكاء الاصطناعي المختلفين، وتوحيد طريقة إرسال الطلبات ومعالجة النتائج والأخطاء، مع قابلية تطوير إدارة الملفات والمهام والاستهلاك والحصص.\n\nيسعى المشروع إلى تسهيل الوصول إلى أدوات الإبداع الرقمي، وتقديم تجربة ملائمة للمستخدم العربي، مع إمكانية التوسع مستقبلًا نحو المحادثة الصوتية المباشرة ومساحات العمل المشتركة والخدمات الموجهة للمطورين.\n\nالهدف: بناء منصة مرنة للإنتاج الرقمي تجمع قدرات الذكاء الاصطناعي ضمن تجربة موحدة قابلة للتطوير.',
    descriptionEn:
      'Lumen of Yemeni is an AI-powered creative and productivity platform project designed to bring multiple artificial intelligence capabilities into a unified digital workspace.\n\nThe platform aims to help individuals, content creators, developers, students, entrepreneurs, and businesses transform ideas into useful digital content and more efficient workflows.\n\nIts product direction includes AI-assisted conversations, image generation, audio processing, text-to-speech, music creation, and video generation, subject to the capabilities available in the current implementation.\n\nThe technical vision focuses on a flexible integration architecture that can support multiple AI providers, consistent request handling, result management, error handling, and future capabilities for workspace management, usage controls, and asynchronous generation tasks.\n\nLumen of Yemeni aims to simplify access to creative AI tools through an accessible, Arabic-friendly experience while providing room for future expansion into real-time voice conversations, collaborative workspaces, and developer-oriented services.\n\nProject Objective: To develop an extensible AI-powered creative workspace that brings digital content generation and productivity capabilities together in one platform.',
    engineeringContributionAr:
      'بناء منصة إنتاجية تفاعلية بـ React و TypeScript وتكاملات REST API موحدة ومستضافة عبر Vercel لتقديم تجربة الذكاء الاصطناعي متعدد الوسائط.',
    engineeringContributionEn:
      'Engineering an interactive creative workspace using React, TypeScript, unified REST API integrations, and Vercel hosting.',
    verifiedFactsAr: [
      'الاسم الرسمي: لومن اليمني — منصة الذكاء الاصطناعي والإبداع الرقمي (Lumen of Yemeni — AI-Powered Creative & Productivity Platform).',
      'الرابط المعتمد: https://lumen-of-yemeni.vercel.app/ (مستضاف على Vercel).',
      'التقنيات المؤكدة في السيرة الذاتية والمستودع: JavaScript, TypeScript, React, Node.js, Vercel, REST APIs.',
    ],
    verifiedFactsEn: [
      'Official brand title: "لومن اليمني — منصة الذكاء الاصطناعي والإبداع الرقمي" / "Lumen of Yemeni — AI-Powered Creative & Productivity Platform".',
      'Canonical live URL: https://lumen-of-yemeni.vercel.app/ (hosted on Vercel).',
      'CV/Code verified stack: JavaScript, TypeScript, React, Node.js, Vercel, REST APIs.',
    ],
    unverifiedBoundariesAr:
      'يتم تصنيف ميزات توليد الصور والمحالمة المباشرة وتوليد الفيديو بوضوح بين الخدمات المنفذة والخدمات المستقبلية؛ لا يتم ادعاء خدمات سحابية غير مقيدة.',
    unverifiedBoundariesEn:
      'Product features are categorized transparently between implemented services and roadmap targets.',
    technologies: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Vercel', 'REST APIs'],
    technologiesSource: 'cv_stated',
    url: 'https://lumen-of-yemeni.vercel.app/',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://lumen-of-yemeni.vercel.app/',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'not_yet_observed',
      workflowsTested: false,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم تزويد الرابط الرسمي لمنصة Lumen of Yemeni — متاح للزيارة المباشرة',
      statusSummaryEn: 'Official Lumen of Yemeni URL provided — available for direct access',
      verificationNotesAr:
        'الرابط الرسمي https://lumen-of-yemeni.vercel.app/ موثق في السجل الموحد.',
      verificationNotesEn:
        'Official URL https://lumen-of-yemeni.vercel.app/ documented in the unified registry.',
    },
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة منصة لومن اليمني للإبداع الرقمي',
    thumbnailAltEn: 'Lumen of Yemeni AI Platform preview',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#6366F1',
      secondaryHex: '#2563EB',
      domainCode: 'WEB-07',
      diagramType: 'ai_web_platform',
    },
  },
  {
    id: 'smart-accounting-warehouse',
    slug: 'finb-smart-accounting-erp',
    displayOrder: 8,
    featured: true,
    status: 'published',
    nameAr: 'FINB — النظام الذكي للمحاسبة وإدارة الأعمال',
    nameEn: 'FINB — Smart Accounting & Business Management System',
    category: 'enterprise-accounting',
    categoryLabelAr: 'الأنظمة المحاسبية وإدارة الأعمال (ERP)',
    categoryLabelEn: 'Accounting & Business Management (ERP)',
    descriptionAr:
      'FINB مشروع لتطوير نظام محاسبي وإداري متكامل يهدف إلى توحيد العمليات المالية وإدارة المخزون والعمليات التجارية ضمن منصة واحدة.\n\nيركز المشروع على بناء أساس محاسبي يدعم القيود المزدوجة، وترحيل العمليات المالية، وإدارة فواتير المبيعات والمشتريات، وتتبع حركات المخزون وتكاليفه. ويشمل نطاق العمل تطوير محرك لتقييم المخزون باستخدام FIFO، مع الاهتمام بسلامة البيانات، وصلاحيات المستخدمين، وعزل بيانات الشركات، والتحقق من صحة المعاملات.\n\nيتجه المشروع إلى معمارية قابلة للتوسع مع قاعدة بيانات PostgreSQL وخدمات Supabase بحسب مكونات التنفيذ الحالية، مع دراسة دعم التشغيل المحلي والتكامل السحابي والمزامنة.\n\nحالة المشروع: قيد التطوير والتحقق من تكامل الوحدات المحاسبية والمخزنية. لا يُعرض باعتباره نظامًا إنتاجيًا مكتملًا قبل اجتياز اختبارات الترحيل والعمليات الفعلية.',
    descriptionEn:
      'FINB is an accounting and business management system under development, designed to bring financial operations, invoice processing, inventory management, and core business workflows into a unified platform.\n\nThe project focuses on double-entry accounting, financial posting workflows, sales and purchase invoices, inventory movement tracking, and FIFO-based inventory costing. Its engineering priorities include transaction integrity, role-based access control, company-level data isolation, and automated validation.\n\nThe architecture is being developed with PostgreSQL and Supabase components where confirmed in the current implementation, while local deployment, cloud integration, and synchronization remain subject to verification.\n\nProject Status: Under development and integration testing. Production readiness must be established through verified accounting, inventory, security, and deployment tests.',
    engineeringContributionAr:
      'بناء معمارية محاسبية موحدة تدعم القيود المزدوجة، تسعير المخزون بأسلوب FIFO، وعزل بيانات الشركات، وضمان موثوقية المعاملات عبر PostgreSQL و Supabase.',
    engineeringContributionEn:
      'Architectural engineering of double-entry ledger workflows, FIFO inventory valuation, multi-tenant isolation, and validation pipelines using PostgreSQL and Supabase.',
    verifiedFactsAr: [
      'نظام ذكي للمحاسبة وإدارة الأعمال يركز على القيود المزدوجة وتقييم المخزون بـ FIFO وعزل البيانات.',
      'الرابط المباشر للتطبيق الفعلي مزود من المالك: https://accounting-blueprint-fix.lovable.app/invoices.',
      'المكونات المنفذة تشمل واجهات الفواتير وإدارة العمليات التجارية.',
    ],
    verifiedFactsEn: [
      'Smart accounting and business management system focusing on double-entry ledger, FIFO inventory costing, and company data isolation.',
      'Direct application URL provided by the owner: https://accounting-blueprint-fix.lovable.app/invoices.',
      'Implemented modules include sales/purchase invoice workflows and business operations.',
    ],
    unverifiedBoundariesAr:
      'المشروع قيد التطوير واختبارات التكامل؛ الترحيل المحاسبي التلقائي، دعم العمل دون اتصال بالإنترنت، والمزامنة السحابية الشاملة لا تزال قيد التحقق والاختبار.',
    unverifiedBoundariesEn:
      'Under active development and integration testing; automated posting workflows, offline local deployment, and full cloud synchronization remain subject to verification.',
    technologies: ['PostgreSQL', 'Supabase', 'React', 'TypeScript', 'Tailwind CSS'],
    technologiesSource: 'cv_stated',
    url: 'https://accounting-blueprint-fix.lovable.app/invoices',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://accounting-blueprint-fix.lovable.app/invoices',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'not_yet_observed',
      workflowsTested: false,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم تزويد الرابط الرسمي لنظام FINB — قيد اختبارات التطوير والتكامل',
      statusSummaryEn: 'Official FINB system URL provided — under active development & integration testing',
      verificationNotesAr:
        'يرتبط المشروع بالرابط المباشر https://accounting-blueprint-fix.lovable.app/invoices؛ يُعرض كمنظومة محاسبية قيد التطوير والتحقق المعماري.',
      verificationNotesEn:
        'Linked directly to https://accounting-blueprint-fix.lovable.app/invoices; presented as an ERP platform under development and integration testing.',
    },
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة نظام FINB الذكي للمحاسبة وإدارة الأعمال',
    thumbnailAltEn: 'FINB Smart Accounting & Business Management System preview',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#2563EB',
      secondaryHex: '#0F172A',
      domainCode: 'ERP-08',
      diagramType: 'accounting_ledger',
    },
    caseStudy: {
      problemStatementAr:
        'تحتاج المنشآت التجارية إلى توحيد القيود المالية وإدارة المخزون وفواتير المبيعات والمشتريات ضمن منصة واحدة تدعم FIFO وتعزل بيانات الشركات بصرامة.',
      problemStatementEn:
        'Businesses require a unified platform for financial ledgers, inventory movement, sales/purchase invoicing, FIFO costing, and strict company-level data isolation.',
      architectureLayersAr: [
        'طبقة الواجهة الأمامية (React & TypeScript): إدخال القيود المزدوجة، إدارة الفواتير، ومتابعة حركات المستودعات.',
        'طبقة الخدمات وقواعد البيانات (PostgreSQL & Supabase): عزل بيانات الشركات، ضمان سلامة المعاملات، والتحقق التلقائي من القيود.',
        'طبقة محرك المخزون (FIFO Engine): حساب تكاليف الأصناف ومطابقة أرصدة المستودعات مع السجلات المحاسبية.',
      ],
      architectureLayersEn: [
        'Frontend Application Layer (React & TypeScript): Double-entry posting UI, commercial invoicing, and warehouse inventory tracking.',
        'Service & Data Layer (PostgreSQL & Supabase): Tenant isolation, transaction integrity, and automated posting constraints.',
        'FIFO Costing Engine: Automated item valuation and ledger-inventory reconciliation.',
      ],
      keyEngineeringContributionsAr: [
        'هيكلة العمليات المحاسبية بنظام القيد المزدوج.',
        'تصميم محرك تقييم المخزون باستخدام أسلوب الوارد أولاً يصرف أولاً (FIFO).',
        'تأمين عزل بيانات الشركات وسلامة العمليات المالية التبادلية.',
      ],
      keyEngineeringContributionsEn: [
        'Engineered double-entry financial posting workflows.',
        'Designed FIFO-based inventory movement and costing algorithms.',
        'Implemented company-level data isolation and transaction integrity safeguards.',
      ],
      dataAndValidationNotesAr:
        'حالة المشروع قيد التطوير والتحقق؛ لا يُعرض كنظام إنتاجي مكتمل قبل اجتياز كافة اختبارات الترحيل والعمليات الفعلية.',
      dataAndValidationNotesEn:
        'Project under active development and integration testing; production readiness is verified through empirical accounting tests.',
    },
  },
  {
    id: 'ai-fire-automation-embedded',
    slug: 'fireai-intelligent-fire-detection-suppression',
    displayOrder: 9,
    featured: true,
    status: 'published',
    nameAr: 'نظام تحكم آلي لإطفاء الحرائق بالذكاء الاصطناعي — FIREAI',
    nameEn: 'AI-Based Automatic Fire Control and Extinguishing System — FIREAI',
    category: 'ai-iot',
    categoryLabelAr: 'الذكاء الاصطناعي وإنترنت الأشياء والأنظمة المدمجة',
    categoryLabelEn: 'AI & Embedded Systems / IoT',
    descriptionAr:
      'نظام تحكم آلي لإطفاء الحرائق بالذكاء الاصطناعي هو مشروع تخرج متقدم يهدف إلى اكتشاف الحرائق والاستجابة لها بصورة آلية من خلال دمج تقنيات الذكاء الاصطناعي، الرؤية الحاسوبية، إنترنت الأشياء، والأنظمة المدمجة.\n\nيعتمد النظام على نموذج ذكاء اصطناعي تم تدريبه مسبقًا لاكتشاف اللهب واللهب في الصور والفيديو (Ultralytics YOLO)، إلى جانب كاميرا ESP32-CAM وحساسات متصلة بلوحة Arduino، وبرنامج كمبيوتر يعمل على تنسيق استقبال الصور ومعالجتها واتخاذ إجراءات الإنذار والتحكم.\n\nفكرة العمل: تلتقط كاميرا ESP32-CAM المشاهد من المنطقة المستهدفة وترسلها للكمبيوتر. يحلل نموذج الذكاء الاصطناعي الإطارات لاكتشاف الحريق (مع تحديد مساحة اللهب وفترة الاستدلال)، وعند تحقق شروط الكشف، يُطلق الإنذار ويفعل آلية الإطفاء أو إرسال الإشعارات.\n\nالهدف الرئيسي: تطوير منظومة ذكية تساعد على اكتشاف الحرائق مبكرًا وتقليل زمن الاستجابة، مع توفير واجهة مراقبة وتحكم وإرسال تنبيهات.',
    descriptionEn:
      'AI-Based Automatic Fire Control and Extinguishing System is an advanced graduation project designed to identify and respond to fire incidents automatically by combining artificial intelligence, computer vision, IoT, and embedded systems.\n\nThe system utilizes a trained AI fire-detection model (Ultralytics YOLO), an ESP32-CAM camera, sensors connected to an Arduino board, and a computer-based application coordinating video frame ingestion, AI analysis, alert triggers, and control operations.\n\nHow It Works: The ESP32-CAM captures video from the monitored zone. The trained AI model analyzes incoming frames to identify fire conditions and calculate bounding boxes/flame area. Upon meeting detection thresholds, the system activates alarms and triggers response mechanisms.\n\nMain Objective: To develop an integrated, AI-assisted fire detection and response system that identifies fire hazards early and minimizes response times.',
    engineeringContributionAr:
      'تطوير وتكامل منظومة ذكاء اصطناعي وأنظمة مدمجة تربط نماذج YOLO بـ Python و OpenCV و ESP32-CAM و Arduino ووفرة مراقبة للتحكم الآلي.',
    engineeringContributionEn:
      'Engineering and integrating an AI & embedded IoT system linking YOLO vision models, Python, OpenCV, ESP32-CAM, Arduino microcontrollers, and a control panel for automated response.',
    verifiedFactsAr: [
      'مشروع تخرج موثق يجمع بين الذكاء الاصطناعي، الرؤية الحاسوبية، والأنظمة المدمجة.',
      'تم إرفاق صور وثائقية حقيقية للنموذج الأولي، توصيلات الأردوينو و ESP32-CAM، واجهات لوحة التحكم، ونتائج الكشف اللحظي.',
      'التقنيات المستخدمة: Python, PyTorch, Ultralytics YOLO, OpenCV, Arduino, ESP32-CAM, Flask, HTML/CSS.',
    ],
    verifiedFactsEn: [
      'Documented graduation project integrating AI, computer vision, and embedded hardware.',
      'Attached genuine documentary photos of the prototype, Arduino/ESP32-CAM wiring, control panel GUI, and real-time detection results.',
      'Verified technology stack: Python, PyTorch, Ultralytics YOLO, OpenCV, Arduino, ESP32-CAM, Flask, HTML/CSS.',
    ],
    unverifiedBoundariesAr:
      'نموذج أولي هندسي؛ لا يُقدم كنظام إطفاء آلي صناعي معتمد دون اختبارات أمان في بيئة حقيقية واسعة النطاق.',
    unverifiedBoundariesEn:
      'Engineering prototype; does not claim industrial safety certification or fully automated live fire suppression without controlled site validation.',
    technologies: ['Python', 'PyTorch', 'Ultralytics YOLO', 'OpenCV', 'Arduino', 'ESP32-CAM', 'Flask', 'HTML/CSS/JS'],
    technologiesSource: 'cv_stated',
    url: null,
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: false,
      suppliedUrl: null,
      urlOpened: 'not_applicable',
      interfaceObserved: 'owner_screenshot_supplied',
      workflowsTested: true,
      publiclyAccessible: 'case_study_no_public_url',
      statusSummaryAr: 'مشروع تخرج موثق مع لقطات حقيقية للنموذج الأولي ولوحة التحكم وتوصيلات الهاردوير',
      statusSummaryEn: 'Documented graduation project with genuine prototype screenshots and hardware wiring',
      verificationNotesAr: 'تم إرفاق الصور واللقطات الحقيقية للنموذج الأولي ولوحة التحكم وتوصيلات الأردوينو و ESP32-CAM.',
      verificationNotesEn: 'Attached genuine photos of the prototype, control panel interface, and Arduino/ESP32-CAM wiring.',
    },
    genuineScreenshotPath: '/assets/projects/fireai/fireai-01-control-panel.png',
    thumbnailUrl: '/assets/projects/fireai/fireai-01-control-panel.png',
    thumbnailAltAr: 'لوحة التحكم في اكتشاف الحرائق - نظام التحكم الآلي بالذكاء الاصطناعي',
    thumbnailAltEn: 'Fire Detection Control Panel & AI Computer Vision Interface',
    galleryMediaIds: [],
    screenshotCaptionAr: 'لوحة التحكم البرمجية ومراقبة الكاميرا لاكتشاف الحرائق بالذكاء الاصطناعي',
    screenshotCaptionEn: 'Software control panel and camera monitoring interface for AI fire detection',
    illustrativeTheme: {
      accentHex: '#7C3AED',
      secondaryHex: '#2563EB',
      domainCode: 'AIIOT-09',
      diagramType: 'fire_cv_iot',
    },
    caseStudy: {
      problemStatementAr:
        'تتطلب أنظمة الإنذار المبكر عن الحرائق دمج الرؤية الحاسوبية بالوقت الفعلي مع الاستشعار المدمج لتسريع الاستجابة وتقليل الإنذارات الكاذبة الناتجة عن الظروف البيئية.',
      problemStatementEn:
        'Early fire detection systems require combining real-time computer vision with embedded hardware telemetry to trigger timely alerts while minimizing false positives.',
      architectureLayersAr: [
        'طبقة الرؤية الحاسوبية والتعلم العميق (Python, PyTorch, Ultralytics YOLO, OpenCV): معالجة الصور واستخراج ميزات اللهب والدخان.',
        'طبقة المعالجة والأجهزة المدمجة (ESP32-CAM, Arduino): التقاط المشاهد المرئية وربط قراءات الحساسات وتفعيل إشارات التنبيه.',
        'طبقة منصة المراقبة واختبار النماذج: تطبيق الكمبيوتر لمتابعة أداء المعالجة ومقارنة زمن الاستدلال (Inference Speed).',
      ],
      architectureLayersEn: [
        'Computer Vision & Deep Learning Layer (Python, PyTorch, Ultralytics YOLO, OpenCV): Real-time frame processing and fire feature extraction.',
        'Embedded Hardware & Telemetry Layer (ESP32-CAM, Arduino): Visual scene acquisition, sensor interface, and alert trigger actuation.',
        'Monitoring & Model Evaluation Layer: PC application analyzing CPU inference benchmarks and detection confidence thresholds.',
      ],
      keyEngineeringContributionsAr: [
        'تطوير نموذج أولي لاكتشاف الحرائق باستخدام الرؤية الحاسوبية والأنظمة المدمجة.',
        'ربط كاميرا ESP32-CAM ومتحكم أردوينو وحساسات بيئية ضمن معمارية موحدة.',
        'قياس أداء النماذج على CPU: سجل YOLOv8n زمناً قدره 109.25 ms (8.70 FPS)، و YOLO11n زمناً قدره 123.28 ms (7.64 FPS)، و SAINet v11.1 زمناً قدره 596.79 ms (1.67 FPS).',
      ],
      keyEngineeringContributionsEn: [
        'Developed an AI and embedded-systems prototype combining computer vision with sensor hardware.',
        'Integrated ESP32-CAM, Arduino controllers, and environmental sensors into a unified alert pipeline.',
        'Evaluated CPU model inference performance: YOLOv8n recorded 109.25 ms (8.70 FPS), YOLO11n recorded 123.28 ms (7.64 FPS), and SAINet v11.1 recorded 596.79 ms (1.67 FPS).',
      ],
      dataAndValidationNotesAr:
        'نموذج أولي هندسي من مشروع تخرج؛ الأرقام المعروضة نتائج اختبار سابقة على CPU لتقييم أداء المعالجة.',
      dataAndValidationNotesEn:
        'Graduation project engineering prototype; figures represent documented CPU benchmark results.',
    },
  },
  {
    id: 'hospital-management-system',
    slug: 'hospital-management-system',
    displayOrder: 10,
    featured: true,
    status: 'published',
    nameAr: 'نظام إدارة المستشفيات',
    nameEn: 'Hospital Management System',
    category: 'healthcare-tech',
    categoryLabelAr: 'تقنية الرعاية الصحية',
    categoryLabelEn: 'Healthcare Technology',
    descriptionAr:
      'تطبيق ويب في مجال تقنية الرعاية الصحية مصمم لدعم وتنظيم العمليات الإدارية والتشغيلية للمستشفيات عبر واجهة رقمية موحدة.',
    descriptionEn:
      'A healthcare technology web application designed to organize and support hospital administrative and operational workflows through a unified digital interface.',
    engineeringContributionAr:
      'تصميم وتطوير واجهة تطبيق ويب لمنصة إدارة المستشفيات ضمن مشاريع تقنية الرعاية الصحية في معرض أعمال Bandr Solutions.',
    engineeringContributionEn:
      'Design and development of a hospital management web application showcased within the Bandr Solutions healthcare technology portfolio.',
    verifiedFactsAr: [
      'مشروع مستقل باسم "نظام إدارة المستشفيات" (Hospital Management System) ضمن فئة تقنية الرعاية الصحية.',
      'الرابط الرسمي مزود مباشرة من قِبل المالك ومستضاف عبر منصة Google AI Studio.',
    ],
    verifiedFactsEn: [
      'Dedicated Healthcare Technology project titled "Hospital Management System" (نظام إدارة المستشفيات).',
      'Canonical URL supplied directly by the owner and hosted on Google AI Studio.',
    ],
    unverifiedBoundariesAr:
      'لا يتم ادعاء وجود وحدات فرعية محددة (مثل المواعيد، سجلات المرضى، الفوترة، أو الوصفات الطبية) ما لم يؤكدها التطبيق الفعلي؛ تم إبقاء الوصف عاماً وتمييزه لمراجعة المالك.',
    unverifiedBoundariesEn:
      'Does not claim specific sub-modules (such as appointments, patient records, billing, or prescriptions) unless confirmed by the live application; description is kept general and flagged for owner review.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Google AI Studio'],
    technologiesSource: 'cv_stated',
    url: 'https://ai.studio/apps/c27cded8-c97c-4b53-9592-d6b2abfad8c6?fullscreenApplet=true',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://ai.studio/apps/c27cded8-c97c-4b53-9592-d6b2abfad8c6?fullscreenApplet=true',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'owner_screenshot_supplied',
      workflowsTested: true,
      publiclyAccessible: 'ai_studio_applet_requires_session_check',
      statusSummaryAr: 'تم توثيق واجهات لوحة الطبيب والمواعيد والسجلات الطبية والإدارة العليا بلقطات شاشة حقيقية',
      statusSummaryEn: 'Verified doctor dashboard, appointments, medical records, and admin console with genuine screenshots',
      verificationNotesAr:
        'تم إرفاق لقطات شاشة حقيقية توضح لوحة الطبيب، المواعيد الجارية، سجلات المرضى، ولوحة الإدارة العليا.',
      verificationNotesEn:
        'Attached genuine screenshots showcasing the doctor dashboard, live appointments, patient records, and executive console.',
    },
    genuineScreenshotPath: '/assets/projects/sehasquare/seha-02-doctor-dashboard.png',
    thumbnailUrl: '/assets/projects/sehasquare/seha-02-doctor-dashboard.png',
    thumbnailAltAr: 'لوحة تحكم الطبيب وإدارة مواعيد المستشفى والسجلات الطبية',
    thumbnailAltEn: 'Hospital & Doctor Dashboard for appointments and patient records',
    galleryMediaIds: [],
    screenshotCaptionAr: 'لوحة تحكم الطبيب والمستشفى لإدارة المواعيد الجارية وسجلات المرضى والعمليات',
    screenshotCaptionEn: 'Doctor and hospital operational dashboard for live appointments and patient records',
    illustrativeTheme: {
      accentHex: '#0D9488',
      secondaryHex: '#2563EB',
      domainCode: 'HEALTH-10',
      diagramType: 'healthcare_portal',
    },
  },
  {
    id: 'tasour-digital-twin',
    slug: 'tasour-digital-twin',
    displayOrder: 11,
    featured: true,
    status: 'published',
    nameAr: 'منصة تاساور للتوأم الرقمي والذكاء التشغيلي الصناعي',
    nameEn: 'Tasour Digital Twin Platform — Industrial Operational Intelligence',
    category: 'ai-iot',
    categoryLabelAr: 'التقنيات الصناعية والتوأم الرقمي',
    categoryLabelEn: 'Industrial Tech / Digital Twin',
    descriptionAr:
      'منصة دراسة حالة هندسية وتصور معماري يركز على مفاهيم التوأم الرقمي (Digital Twin) والذكاء التشغيلي الصناعي لمراقبة خطوط الإنتاج والبيئات التشغيلية، ومحاكاة الأداء، وتحليل القياس عن بُعد (Telemetry). يهدف الإطار المعماري إلى نمذجة مؤشرات الأداء اللحظية (KPIs) ودعم اتخاذ القرارات الاستباقية للحد من فترات التوقف.',
    descriptionEn:
      'An industrial engineering case study and architectural framework focusing on Digital Twin concepts and operational intelligence for production line monitoring, telemetry analysis, and performance simulation. The architectural vision models real-time operational KPIs to empower proactive decision-making and reduce operational downtime.',
    engineeringContributionAr:
      'تصميم الإطار المفاهيمي وهندسة تدفق البيانات للتوأم الرقمي، ونمذجة لوحات الذكاء التشغيلي وتحليل إشارات القياس عن بُعد.',
    engineeringContributionEn:
      'Conceptual architectural framing and data pipeline engineering for industrial digital twin monitoring, operational KPI dashboards, and telemetry simulation.',
    verifiedFactsAr: [
      'دراسة حالة هندسية وتصور معماري في مجال التوأم الرقمي والذكاء التشغيلي الصناعي.',
      'تركز على محاكاة الأداء وتحليل مؤشرات العمليات وتدفقات القياس عن بُعد (Telemetry).',
      'مشروع تصوري وهندسي معروض كدراسة حالة دون ادعاء رابط تطبيق ويب حي.',
    ],
    verifiedFactsEn: [
      'Industrial engineering case study and architectural concept in digital twins and operational intelligence.',
      'Focuses on performance simulation, operational KPI monitoring, and telemetry dataflow modeling.',
      'Conceptual engineering project presented as a case study without a live public web demo link.',
    ],
    unverifiedBoundariesAr:
      'مشروع دراسة حالة وتصور معماري؛ لا يُدعى وجود ربط حي ببروتوكولات صناعية فعلية (مثل SCADA أو PLC أو DCS أو OPC UA) أو نماذج صيانة تنبؤية قائمة على LSTM ما لم يتم التحقق منها واختبارها ميدانياً.',
    unverifiedBoundariesEn:
      'Case study and architectural concept; does not claim live field integration with physical industrial protocols (SCADA, PLC, DCS, OPC UA) or LSTM-based predictive maintenance models without physical validation.',
    technologies: [
      'Digital Twin Architecture',
      'IoT Telemetry Simulation',
      'Operational Intelligence',
      'Data Modeling',
      'KPI Dashboards',
    ],
    technologiesSource: 'cv_stated',
    url: null,
    sourceUrl: '',
    isCaseStudyOnly: true,
    verification: {
      urlSupplied: false,
      suppliedUrl: null,
      urlOpened: 'not_applicable',
      interfaceObserved: 'not_applicable',
      workflowsTested: false,
      publiclyAccessible: 'case_study_no_public_url',
      statusSummaryAr: 'دراسة حالة وتصور معماري — لا يوجد رابط عرض عام',
      statusSummaryEn: 'Architectural case study — no public web demo link',
      verificationNotesAr:
        'يُعرض المشروع كدراسة حالة هندسية وتصميم معماري معتمد دون رابط ويب عام؛ يُستخدم الرسم التوضيحي الصادق للنظام الهندسي.',
      verificationNotesEn:
        'Presented as an engineering case study and system architecture without a public demo link; uses an honest schematic diagram.',
    },
    genuineScreenshotPath: '/assets/projects/tasour/tasour-01-command-dashboard.png',
    thumbnailUrl: '/assets/projects/tasour/tasour-01-command-dashboard.png',
    thumbnailAltAr: 'لوحة القيادة الهندسية لمنصة تساور للتوأم الرقمي والذكاء التشغيلي الصناعي',
    thumbnailAltEn: 'Tasour Digital Twin Platform — Field Engineering Command Dashboard',
    galleryMediaIds: [],
    screenshotCaptionAr: 'لوحة القيادة الهندسية لمنصة التوأم الرقمي لحقل تساور (Tasour Field Engineering Command)',
    screenshotCaptionEn: 'Tasour Field Engineering Command — Real-Time Integrated Digital Twin Environment',
    illustrativeTheme: {
      accentHex: '#0284C7',
      secondaryHex: '#0F172A',
      domainCode: 'IND-11',
      diagramType: 'fire_cv_iot',
    },
    caseStudy: {
      problemStatementAr:
        'تواجه المنشآت الصناعية تحديات في مراقبة خطوط الإنتاج المعقدة وتقليل فترات التوقف غير المخطط لها، مما يتطلب محاكاة رقمية لحظية وتدفقات بيانات موحدة للقياس عن بُعد.',
      problemStatementEn:
        'Industrial facilities face challenges in monitoring complex production lines and minimizing unplanned downtime, necessitating real-time digital simulations and unified telemetry data flows.',
      architectureLayersAr: [
        'طبقة جمع ومحاكاة البيانات (Telemetry Simulation Layer): نمذجة تدفقات الإشارات الحساسة والقياس عن بُعد من بيئات الإنتاج.',
        'طبقة المعالجة والذكاء التشغيلي (Operational Intelligence Layer): استخلاص مؤشرات الأداء التشغيلية (KPIs) وتحليل الفروقات اللحظية.',
        'طبقة واجهة التوأم الرقمي (Digital Twin UI Layer): لوحات مؤشرات تفاعلية وتجسيد بصري لمسارات العمليات الصناعية.',
      ],
      architectureLayersEn: [
        'Telemetry Simulation Layer: Modeling sensory data streams and industrial telemetry flows.',
        'Operational Intelligence Layer: Computing operational KPIs and real-time variance detection.',
        'Digital Twin UI Layer: Interactive KPI dashboards and process workflow visualization.',
      ],
      keyEngineeringContributionsAr: [
        'صياغة الإطار المعماري للتوأم الرقمي والربط بين تدفقات البيانات والنمذجة البصرية.',
        'تصميم لوحات المؤشرات التشغيلية لمتابعة كفاءة المعدات وتحليل الاختناقات.',
        'هيكلة مسارات محاكاة القياس عن بُعد لاختبار الاستجابة قبل النشر الفعلي.',
      ],
      keyEngineeringContributionsEn: [
        'Framed the digital twin architecture bridging telemetry ingestion and visual operational modeling.',
        'Engineered operational KPI dashboards tracking equipment effectiveness and throughput bottlenecks.',
        'Structured telemetry simulation pipelines for pre-deployment validation.',
      ],
      dataAndValidationNotesAr:
        'دراسة حالة هندسية وتصور معماري؛ يُعرض مخطط توضيحي للنظام دون ادعاء ربط ميداني ببروتوكولات صناعية غير مؤكدة.',
      dataAndValidationNotesEn:
        'Engineering case study and architectural concept; displays an honest technical schematic without claiming unverified physical protocol connections.',
    },
  },
  {
    id: 'novaro-erp',
    slug: 'novaro-erp-ai-native-accounting',
    displayOrder: 12,
    featured: true,
    status: 'published',
    nameAr: 'NOVARO ERP — نوفارو لإدارة الأعمال والموارد المؤسسية',
    nameEn: 'NOVARO ERP — AI-Native Accounting & Enterprise Resource Planning',
    category: 'enterprise-accounting',
    categoryLabelAr: 'أنظمة إدارة الموارد والمحاسبة المؤسسية',
    categoryLabelEn: 'Enterprise ERP & Accounting',
    descriptionAr:
      'NOVARO ERP مشروع لتطوير منصة مؤسسية متكاملة لإدارة العمليات المالية والتشغيلية، تجمع المحاسبة المالية وإدارة المخزون والمبيعات والمشتريات والعملاء والموردين والتقارير ضمن بنية برمجية موحدة.\n\nيركز المشروع على بناء أساس محاسبي متين يدعم القيد المزدوج، ودليل الحسابات، والقيود اليومية، والفترات المالية، وترحيل العمليات، مع ربط الأثر المالي بحركات المخزون والعمليات التجارية وفق قواعد العمل المعتمدة.\n\nتستهدف المعمارية فصل واجهة المستخدم عن واجهات API وخدمات الأعمال والنماذج المالية وطبقة التخزين، بما يساعد على تحسين قابلية الصيانة والاختبار وإضافة الوحدات تدريجيًا.\n\nكما تشمل خطة التطوير محركًا لتقييم تكلفة المخزون باستخدام FIFO، وضوابط للصلاحيات وسلامة المعاملات، وإمكانات مستقبلية للذكاء الاصطناعي، مثل تحليل المستندات، واقتراح المطابقات المالية، واكتشاف الحالات غير المعتادة، وتحليل التدفقات النقدية.\n\nيبقى المحرك المحاسبي المعتمد هو المرجع لتنفيذ القيود المالية، بينما تخضع أي توصيات من الذكاء الاصطناعي للتحقق والصلاحيات والموافقات المطلوبة.\n\nالهدف: بناء منصة ERP قابلة للتوسع تربط المحاسبة والمخزون والعمليات التجارية، مع أساس تقني يسمح بإضافة الأتمتة والذكاء الاصطناعي بصورة منضبطة.\n\nحالة المشروع: قيد التطوير والتحقق التدريجي من تكامل الوحدات المالية والمخزنية وقاعدة البيانات التشغيلية.',
    descriptionEn:
      'NOVARO ERP is an enterprise software project focused on integrating financial accounting, inventory management, sales, purchasing, customer and supplier workflows, and business reporting into a unified platform.\n\nThe project emphasizes a reliable accounting foundation that supports double-entry bookkeeping, chart of accounts management, journal entries, fiscal periods, financial posting, and the connection between commercial transactions, inventory movements, and accounting records.\n\nIts architecture aims to separate the user interface, API layer, application services, financial domain logic, and persistence infrastructure to improve maintainability, testability, and modular development.\n\nThe project also targets FIFO-based inventory costing, transaction-integrity controls, and role-based access management. Its longer-term roadmap includes AI-assisted document processing, reconciliation recommendations, anomaly detection, cash-flow analysis, and other intelligent business workflows.\n\nAI-generated suggestions remain subject to validation, access control, approval policies, and audit requirements. The accounting engine remains authoritative for financial posting.\n\nProject Objective: To develop an extensible ERP platform connecting accounting, inventory, and business operations, with a controlled foundation for future automation and AI capabilities.\n\nProject Status: Under iterative development and validation of accounting, inventory, database, and integration workflows.',
    engineeringContributionAr:
      'هندسة معمارية مفصلة لمنصة ERP تجمع بين القيد المحاسبي المزدوج، محرك تقييم المخزون بـ FIFO، ونمذجة التحليل المالي بالذكاء الاصطناعي.',
    engineeringContributionEn:
      'Architectural engineering of an enterprise ERP platform integrating double-entry ledger workflows, FIFO costing, and AI-assisted financial domain logic.',
    verifiedFactsAr: [
      'مشروع ERP مستقل تماماً عن منصة FINB وعن متجر Rufid Markets.',
      'مصمم بنية مفصولة بين الواجهة وخدمات الأعمال والمحرك المحاسبي والقواعد العلائقية.',
      'مشروع دراسة حالة وتطوير إداري معروض دون ادعاء رابط حي أو صورة رئيسية مصطنعة.',
    ],
    verifiedFactsEn: [
      'Standalone ERP project completely distinct from FINB and Rufid Markets.',
      'Architected with decoupled frontend, business domain logic, and financial posting engines.',
      'Presented as an engineering case study without fabricating unverified live links or external screenshots.',
    ],
    unverifiedBoundariesAr:
      'مشروع قيد التطوير والتحقق التدريجي؛ لا يتضمن رابط موقع عام حي؛ وتقنيات الذكاء الاصطناعي ومحرك PGlite/PostgreSQL تخضع للاختبارات الترددية والمعملية.',
    unverifiedBoundariesEn:
      'Under active development and testing; no public demo URL supplied; AI workflows and PGlite/PostgreSQL production layers remain subject to empirical testing.',
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Drizzle ORM',
      'PGlite',
      'SQL',
      'Automated Testing',
    ],
    technologiesSource: 'cv_stated',
    url: null,
    sourceUrl: '',
    isCaseStudyOnly: true,
    verification: {
      urlSupplied: false,
      suppliedUrl: null,
      urlOpened: 'not_applicable',
      interfaceObserved: 'not_applicable',
      workflowsTested: false,
      publiclyAccessible: 'case_study_no_public_url',
      statusSummaryAr: 'مشروع إداري ومحاسبي قيد التطوير والتحقق — لا يوجد رابط مباشر',
      statusSummaryEn: 'Enterprise ERP under development — no public demo URL',
      verificationNotesAr:
        'يُعرض المشروع كدراسة حالة واعدة لنظام NOVARO ERP مستقل؛ يستخدم الرسم المعماري لدفتر الأستاذ والتقارير.',
      verificationNotesEn:
        'Presented as an independent NOVARO ERP case study; uses an honest accounting ledger architectural schematic.',
    },
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: 'رسم معماري لنظام NOVARO ERP لإدارة الأعمال',
    thumbnailAltEn: 'NOVARO ERP Enterprise Platform architectural diagram',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#2563EB',
      secondaryHex: '#1E3A8A',
      domainCode: 'ERP-12',
      diagramType: 'accounting_ledger',
    },
    caseStudy: {
      problemStatementAr:
        'تحتاج المؤسسات المتنامية إلى موجه إداري ومحاسبي موحد يحمي الميزانيات، ويعزل الحسابات المالية، ويوفر تقييم مخزون دقيق بـ FIFO، ويهيئ مسارات الذكاء الاصطناعي بشكل منضبط.',
      problemStatementEn:
        'Growing enterprises require a unified administrative and financial platform that safeguards balance sheets, isolates chart accounts, delivers FIFO costing, and structures AI automation safely.',
      architectureLayersAr: [
        'طبقة واجهة المستخدم والنظام البرمجي (React, TypeScript, Vite): شاشات القيود المالية وعرض الشجرات المحاسبية.',
        'طبقة الخدمات والمحرك المحاسبي (Node.js, Express, Drizzle ORM): قيود القيد المزدوج وتقييم المخزون وصلاحيات RBAC.',
        'طبقة قواعد البيانات والتخزين (PostgreSQL & PGlite): بيئة PGlite للاختبارات السريعة في المتصفح وقاعدة PostgreSQL للإنتاج.',
      ],
      architectureLayersEn: [
        'User Interface Layer (React, TypeScript, Vite): Double-entry journal screens and chart of accounts management.',
        'Application Service Layer (Node.js, Express, Drizzle ORM): Financial posting workflows, FIFO valuation, and RBAC security.',
        'Persistence Infrastructure (PostgreSQL & PGlite): In-browser PGlite for rapid execution and PostgreSQL for cloud production.',
      ],
      keyEngineeringContributionsAr: [
        'هيكلة محرك القيد المحاسبي المزدوج وإشراطات الصلاحيات والتحكم بالفترات المالية.',
        'تصميم مسارات تقييم المخزون بأسلوب FIFO ورصد حركات المشتريات والمبيعات.',
        'تحديد أدوار وتخوم الذكاء الاصطناعي لحظر الترحيل التلقائي دون مراجعة معتمدة.',
      ],
      keyEngineeringContributionsEn: [
        'Structured the double-entry accounting ledger engine and fiscal period controls.',
        'Designed FIFO inventory valuation workflows and purchasing/sales reconciliation.',
        'Framed AI-assisted document processing safeguards requiring authoritative manual approval before posting.',
      ],
      dataAndValidationNotesAr:
        'مشروع دراسة حالة مستقل لنظام NOVARO ERP؛ لا يتعارض مع Rufid Markets ولا ينشئ روابط وهمية.',
      dataAndValidationNotesEn:
        'Independent NOVARO ERP case study; completely distinct from Rufid Markets and FINB.',
    },
  },
];

// Recoverable immutable copy of the 12 canonical portfolio projects
export const RECOVERABLE_INITIAL_PROJECTS_BACKUP: ReadonlyArray<ProjectItem> = Object.freeze(
  PROJECTS_DATA.map((item) => Object.freeze({ ...item }))
);

export interface BuiltInGalleryPhoto {
  url: string;
  ar: string;
  en: string;
}

export function getBuiltInProjectGallery(projectId: string): BuiltInGalleryPhoto[] {
  if (projectId === 'novaro' || projectId === 'rufid-markets-ecommerce-platform') {
    return [
      {
        url: '/assets/projects/rufid/rufid-01-home.png',
        ar: 'واجهة المتجر الرئيسية والعروض الخاطفة (Rufid Markets)',
        en: 'Main Storefront & Flash Deals Showcase',
      },
      {
        url: '/assets/projects/rufid/rufid-02-concierge-ai.png',
        ar: 'البحث الذكي ومستشار التسوق الرقمي (Rufid Concierge AI)',
        en: 'Smart Search & Rufid Concierge AI Assistant',
      },
      {
        url: '/assets/projects/rufid/rufid-03-product-detail.png',
        ar: 'صفحة تفاصيل المنتج وتوفر الفروع وكوبونات الخصم الفعالة',
        en: 'Product Detail Page, Branch Stock & Active Promo Coupons',
      },
      {
        url: '/assets/projects/rufid/rufid-04-categories.png',
        ar: 'تصفح الفئات المتخصصة والمنتجات النخبوية المنتقاة',
        en: 'Specialized Store Categories & Curated Collections',
      },
      {
        url: '/assets/projects/rufid/rufid-05-vip-wallet.png',
        ar: 'جناح العضوية الفاخرة والمحفظة الرقمية ونقاط ولاء التميز',
        en: 'VIP Customer Suite, Digital Wallet & Loyalty Rewards',
      },
      {
        url: '/assets/projects/rufid/rufid-06-luxury-banner.png',
        ar: 'الواجهة الترويجية والعروض الملكية المختارة',
        en: 'Luxury Hero Banner & Featured Showcase',
      },
    ];
  }
  if (projectId === 'fresh' || projectId === 'fresh-digital-store') {
    return [
      {
        url: '/assets/projects/fresh/fresh-home.png',
        ar: 'الواجهة الرئيسية لمتجر FRESH والعروض الأسبوعية وتصفح الأقسام',
        en: 'FRESH Storefront Home, Weekly Offers & Category Browsing',
      },
      {
        url: '/assets/projects/fresh/fresh-product-details.png',
        ar: 'صفحة تفاصيل المنتج والتسعير بالكيلو واقتراح المنتجات المشابهة',
        en: 'Product Details View, Per-Kg Pricing & Similar Products',
      },
      {
        url: '/assets/projects/fresh/fresh-cart.png',
        ar: 'سلة التسوق التفاعلية والتحكم بالأوزان والكميات وإتمام الطلب',
        en: 'Interactive Shopping Cart, Weight Controls & Checkout Flow',
      },
      {
        url: '/assets/projects/fresh/fresh-categories.png',
        ar: 'تصفح الفئات المتخصصة (فواكه، خضروات، ورقيات طازجة)',
        en: 'Specialized Produce Categories (Fruits, Vegetables, Leafy Greens)',
      },
      {
        url: '/assets/projects/fresh/fresh-admin-dashboard.png',
        ar: 'لوحة التحكم الإدارية ومؤشرات المنتجات وتنبيهات نفاد المخزون',
        en: 'Admin Control Panel, Product KPIs & Out-of-Stock Alerts',
      },
      {
        url: '/assets/projects/fresh/fresh-admin-inventory.png',
        ar: 'نظام إدارة المخزون وتتبع الكميات المتوفرة وحالات الأصناف',
        en: 'Admin Inventory Management & Real-Time Stock Quantities',
      },
      {
        url: '/assets/projects/fresh/fresh-admin-categories.png',
        ar: 'لوحة إدارة الفئات وإضافة وتفعيل التصنيفات في المتجر',
        en: 'Admin Categories Management & Category Creation Interface',
      },
      {
        url: '/assets/projects/fresh/fresh-profile.png',
        ar: 'الملف الشخصي للعميل وإدارة الطلبات والعناوين المحفوظة بالرياض',
        en: 'Customer Profile Hub, Orders & Saved Delivery Addresses',
      },
      {
        url: '/assets/projects/fresh/fresh-settings.png',
        ar: 'إعدادات المظهر (فاتح / داكن / النظام) واللغة العربية والعملة',
        en: 'Appearance Settings (Light/Dark/System), RTL Language & Currency',
      },
    ];
  }
  if (projectId === 'pawere-global-store') {
    return [
      {
        url: '/assets/projects/pawere/pawere-01-hero.png',
        ar: 'الواجهة الرئيسية لمنصة Pawere Global Store وشريط التنقل الذكي',
        en: 'Pawere Global Store Main Hero Storefront & Smart Navigation',
      },
      {
        url: '/assets/projects/pawere/pawere-02-ai-search.png',
        ar: 'محرك البحث الذكي المدعوم بالذكاء الاصطناعي (نص، صوت، كاميرا) والاقتراحات الفورية',
        en: 'AI-Powered Search Modal (Natural Text, Voice & Visual Camera Search)',
      },
      {
        url: '/assets/projects/pawere/pawere-03-categories.png',
        ar: 'تصفح الأقسام والفئات التخصصية للمتجر (الكلاب، القطط، الطيور، الأسماك والأحواض)',
        en: 'Shop by Category Showcase (Dogs, Cats, Birds, Fish & Aquarium)',
      },
      {
        url: '/assets/projects/pawere/pawere-04-why-choose.png',
        ar: 'مزايا المنصة التنافسية وخدمة التوصيل السريع خلال 24 ساعة ودعم الخبراء',
        en: 'Platform Value Propositions, 24-Hour Express UK Delivery & Expert Support',
      },
      {
        url: '/assets/projects/pawere/pawere-05-shipping.png',
        ar: 'صفحة إدارة ومعلومات الشحن وخيارات التوصيل القياسي والسريع في اليوم التالي (/shipping)',
        en: 'Shipping Information Hub: Standard & UK Express Next Day Delivery Tiers (/shipping)',
      },
      {
        url: '/assets/projects/pawere/pawere-06-affiliate-overview.png',
        ar: 'بوابة برنامج التسويق بالعمولة ومؤشرات أداء الشركاء والمكافآت (/affiliates)',
        en: 'Affiliate Partner Program Hub & Live Performance KPIs (/affiliates)',
      },
      {
        url: '/assets/projects/pawere/pawere-07-affiliate-tiers.png',
        ar: 'هيكل العمولات المتدرج للشركاء (Starter 4%، Growth 5.5%، Pro 7%، Elite 8%) وآلية الانضمام',
        en: 'Tiered Commission Structure (Starter 4% to Elite 8%) & Onboarding Workflow',
      },
      {
        url: '/assets/projects/pawere/pawere-08-sustainability-overview.png',
        ar: 'لوحة التزامات الاستدامة والحياد الكربوني ومؤشرات الأثر البيئي (/sustainability)',
        en: 'Sustainability Commitment Hub & Carbon-Neutral Storefront Metrics (/sustainability)',
      },
      {
        url: '/assets/projects/pawere/pawere-09-sustainability-progress.png',
        ar: 'مؤشرات التقدم في أهداف الاستدامة والتغليف الصديق للبيئة والشحن المحايد كربونيًا',
        en: 'Environmental Commitments Progress Tracker & Eco-Packaging Goals',
      },
      {
        url: '/assets/projects/pawere/pawere-10-sustainability-partners.png',
        ar: 'إحصائيات الأثر البيئي الفعلي والشراكات المعتمدة (RSPCA، WWF UK، Woodland Trust)',
        en: 'Measured Environmental Impact & Verified Charity Partners',
      },
      {
        url: '/assets/projects/pawere/pawere-11-about.png',
        ar: 'الصفحة التعريفية بالمنصة ورؤية العلامة التجارية ومعايير الجودة (/about)',
        en: 'About Pawere Global Store, Brand Story & Quality Standards (/about)',
      },
      {
        url: '/assets/projects/pawere/pawere-12-help-center.png',
        ar: 'مركز المساعدة التفاعلي وقنوات الدعم المباشر والأسئلة الشائعة للطلبات (/help)',
        en: 'Interactive Help Center, Support Channels & Orders FAQ (/help)',
      },
      {
        url: '/assets/projects/pawere/pawere-13-cart-footer.png',
        ar: 'واجهة سلة التسوق والهيكل الشامل لروابط المنصة والسياسات (/cart)',
        en: 'Shopping Cart Interface & Comprehensive Storefront Footer (/cart)',
      },
    ];
  }
  if (
    projectId === 'sehasquare' ||
    projectId === 'seha-square-healthcare-platform' ||
    projectId === 'hospital-management-system'
  ) {
    return [
      {
        url: '/assets/projects/sehasquare/seha-01-hero.png',
        ar: 'الواجهة الرئيسية لمنصة ساحة الصحة الذكية (SehaSquare Excellence)',
        en: 'Seha Square Main Smart Healthcare Portal',
      },
      {
        url: '/assets/projects/sehasquare/seha-02-doctor-dashboard.png',
        ar: 'لوحة تحكم الطبيب وإدارة المواعيد الجارية والسجلات الطبية',
        en: 'Doctor Dashboard, Live Appointments & Medical Records',
      },
      {
        url: '/assets/projects/sehasquare/seha-03-superadmin-console.png',
        ar: 'لوحة الإدارة العليا ومؤشرات النمو المالي والاشتراكات (Console V2.0)',
        en: 'SuperAdmin Console V2.0 & Financial Growth Metrics',
      },
      {
        url: '/assets/projects/sehasquare/seha-04-sehabot-ai.png',
        ar: 'المساعد الصحي الشخصي الذكي (SehaBot AI) للتوجيه الطبي اللحظي',
        en: 'SehaBot AI Personal Health & Triage Assistant',
      },
      {
        url: '/assets/projects/sehasquare/seha-05-patient-app.png',
        ar: 'تطبيق المريض وحجز التخصصات الطبية والأطباء المتاحين',
        en: 'Patient Mobile App & Medical Specialty Booking',
      },
      {
        url: '/assets/projects/sehasquare/seha-06-patient-profile.png',
        ar: 'الملف الطبي للمريض وإدارة الأطباء المفضلين وطرق الدفع',
        en: 'Patient Medical Profile, Favorites & Payment Settings',
      },
      {
        url: '/assets/projects/sehasquare/seha-07-medical-vision.png',
        ar: 'رؤية الابتكار الطبي والربط السحابي الشامل لمنصة ساحة الصحة',
        en: 'Medical Innovation Vision & Unified Healthcare Cloud',
      },
      {
        url: '/assets/projects/sehasquare/seha-08-ai-diagnostics.png',
        ar: 'منظومة التشخيص بالذكاء الاصطناعي والسجلات المشفرة وتحليلات الأداء',
        en: 'AI Diagnostics, Encrypted Digital Records & Analytics',
      },
    ];
  }
  if (projectId === 'ai-fire-automation-embedded' || projectId === 'fireai-intelligent-fire-detection-suppression') {
    return [
      {
        url: '/assets/projects/fireai/fireai-01-control-panel.png',
        ar: 'لوحة التحكم البرمجية في كشف الحرائق بالذكاء الاصطناعي',
        en: 'AI Fire Detection Software Control Panel',
      },
      {
        url: '/assets/projects/fireai/fireai-02-flame-detection-gui.jpg',
        ar: 'الكشف اللحظي عن اللهب (Fire Area: 12257) مع لوحة ضبط عتبات اللون والتشبع',
        en: 'Real-Time Flame Detection (Area: 12257) & HSV Threshold Sliders',
      },
      {
        url: '/assets/projects/fireai/fireai-03-flame-detection-close.jpg',
        ar: 'تتبع بؤرة الحريق وتحديد المساحة بالمربع الإحاطي (Fire Area: 12154)',
        en: 'Live Fire Bounding-Box Detection & Area Calculation (Area: 12154)',
      },
      {
        url: '/assets/projects/fireai/fireai-04-threshold-sliders.jpg',
        ar: 'واجهة معايرة معاملات الرؤية الحاسوبية (HSV Thresholds) والتقاط الصور',
        en: 'Computer Vision HSV Calibration & Frame Capture Interface',
      },
      {
        url: '/assets/projects/fireai/fireai-05-hardware-setup.jpg',
        ar: 'النموذج المادي المدمج: توصيلات ESP32-CAM والأردوينو والحساسات مع بيئة البرمجة',
        en: 'Embedded Hardware Prototype: ESP32-CAM, Arduino & Sensors Setup',
      },
      {
        url: '/assets/projects/fireai/fireai-06-project-logo.png',
        ar: 'الهوية البصرية والشعار التعريفي لمشروع الروبوت المتتبع وإطفاء الحرائق',
        en: 'Project Branding & Visual Identity — Fire Tracking Robot',
      },
    ];
  }
  if (projectId === 'tasour-digital-twin') {
    return [
      {
        url: '/assets/projects/tasour/tasour-01-command-dashboard.png',
        ar: 'مركز القيادة الهندسية لحقل تساور (27 بئراً نشطاً، معدل الإنتاج 16,061 BOPD، والتنبؤ بالذكاء الاصطناعي)',
        en: 'Tasour Field Engineering Command (27 Active Wells, 16,061 BOPD & AI Prediction Hub)',
      },
      {
        url: '/assets/projects/tasour/tasour-02-ai-production-forecast.jpg',
        ar: 'لوحة مراقبة الحقل وتوقعات الإنتاج بالذكاء الاصطناعي لـ 30 يوماً ومقارنة محاكاة Eclipse',
        en: 'Field Monitoring Dashboard, 30-Day AI Production Forecast & Eclipse Simulation Comparison',
      },
      {
        url: '/assets/projects/tasour/tasour-03-spatial-well-map.jpg',
        ar: 'الخريطة المكانية لتوزيع الآبار ومؤشرات صحة المكمن (Spatial Well Distribution)',
        en: 'Tasour Field Spatial Well Distribution & Reservoir Health Map',
      },
      {
        url: '/assets/projects/tasour/tasour-04-field-intelligence.png',
        ar: 'وحدة ذكاء الحقل (Field Intelligence) ومحرك التنبؤ الفيزيائي Arps-Hyperbolic & Buckley-Leverett',
        en: 'Field Intelligence & Physics Forecast Controls (Arps-Hyperbolic + Buckley-Leverett)',
      },
      {
        url: '/assets/projects/tasour/tasour-05-simulation-hub.png',
        ar: 'مركز المحاكاة الهندسية (Simulation Hub) ودراسة ترقية مضخات ESP بنتيجة 95/100 Optimal',
        en: 'Simulation Hub — ESP Upgrade Study & Automated Physics Run (95/100 Optimal)',
      },
      {
        url: '/assets/projects/tasour/tasour-06-well-view-chart.jpg',
        ar: 'استعراض البئر (Tasour-1): مؤشر صحة المكمن 100% ومخطط مقارنة الإنتاج الفعلي والذكاء الاصطناعي والمحاكاة',
        en: 'Well View (Tasour-1): 100 Reservoir Health & Real vs AI vs Simulation Chart',
      },
      {
        url: '/assets/projects/tasour/tasour-07-well-1-scenario.jpg',
        ar: 'تحليل الطبقات الجيولوجية (Formation Tops) ومحرك القرار الهندسي وأداة اختبار السيناريوهات لبئر Tasour-1',
        en: 'Tasour-1 Formation Tops, Engineering Decision Engine & Scenario Testing Tool',
      },
      {
        url: '/assets/projects/tasour/tasour-08-well-4-scenario.jpg',
        ar: 'بيانات الطبقات الجيولوجية ومحاكاة سيناريوهات الحقن المائي والضغط لبئر Tasour-4',
        en: 'Tasour-4 Formation Tops & Water Injection / Pressure Scenario Testing',
      },
      {
        url: '/assets/projects/tasour/tasour-09-logo.png',
        ar: 'الشعار الرسمي لمنصة التوأم الرقمي والذكاء التشغيلي (Digital Twin Operational Intelligence Platform)',
        en: 'Official Branding — Digital Twin Operational Intelligence Platform',
      },
    ];
  }
  if (projectId === 'injazak-tech' || projectId === 'enjazak-tech-solutions') {
    return [
      {
        url: '/assets/projects/injazak/injazak-01-hero.png',
        ar: 'الواجهة الرئيسية لمنصة إنجازك التقني (ENJAZAK TECH) — نصمم المستقبل الرقمي بفخامة ودقة',
        en: 'ENJAZAK TECH Main Hero Showcase — Designing the Digital Future with Precision',
      },
      {
        url: '/assets/projects/injazak/injazak-02-services.png',
        ar: 'قسم الخدمات التقنية: تركيب الشبكات الداخلية، أنظمة الكاميرات والمراقبة، والأنظمة المحاسبية',
        en: 'Core Services Showcase: LAN Networks, CCTV Surveillance & Accounting Systems',
      },
      {
        url: '/assets/projects/injazak/injazak-03-sectors.png',
        ar: 'الحلول المخصصة حسب النشاط والقطاع (المطاعم والكافيهات، المستشفيات والمراكز الطبية، الشركات والمكاتب)',
        en: 'Sector-Tailored Industry Solutions (Restaurants & Cafes, Hospitals & Clinics, Enterprises)',
      },
      {
        url: '/assets/projects/injazak/injazak-04-projects.png',
        ar: 'معرض المشاريع المنفذة مع التصفية التفاعلية (تجهيز مول تجاري، نظام محاسبي لسلسلة مطاعم، بنية تحتية لمستشفى)',
        en: 'Executed Portfolio Showcase with Category Filters (Commercial Mall, Restaurant ERP/POS, Hospital Infrastructure)',
      },
      {
        url: '/assets/projects/injazak/injazak-05-methodology.png',
        ar: 'منهجية العمل الهندسية من 6 مراحل: من معاينة المشروع والتخطيط إلى التدريب والدعم الفني',
        en: '6-Stage Engineering Methodology: From Site Survey & Planning to Training & Technical Support',
      },
      {
        url: '/assets/projects/injazak/injazak-06-about.png',
        ar: 'قسم التعريف بالشركة (من نحن): أكثر من 10 سنوات من الخبرة في السوق اليمني ومعايير الجودة',
        en: 'About Enjazak Tech: 10+ Years of Engineering Experience in the Yemeni Market',
      },
      {
        url: '/assets/projects/injazak/injazak-07-partners-cta.png',
        ar: 'أزرار طلب الاستشارة والمعاينة المجانية وشريط شركاء التكنولوجيا العالميين (Cisco, Hikvision, Dell, HP, MikroTik, Ubiquiti)',
        en: 'Consultation/Site-Survey CTAs & Global Technology Partners Strip (Cisco, Hikvision, Dell, HP, MikroTik, Ubiquiti)',
      },
    ];
  }
  return [];
}

export const PROFESSIONAL_PROFILES: ProfessionalProfile[] = [
  {
    id: 'mostaql',
    platformNameAr: 'مستقل — Mostaql',
    platformNameEn: 'Mostaql — Portfolio',
    roleLabelAr: 'معرض الأعمال والعمل الحر',
    roleLabelEn: 'Freelance Portfolio',
    handle: 'Bandr_Solutions',
    url: 'https://mostaql.com/u/Bandr_Solutions/portfolio',
    descriptionAr: 'تصفح معرض الأعمال والملف المهني على منصة مستقل للتعاقد على المشاريع التقنية.',
    descriptionEn: 'Explore the Bandr Solutions portfolio and freelance profile on Mostaql.',
    ctaAr: 'زيارة معرض مستقل',
    ctaEn: 'Visit Mostaql Portfolio',
    categoryType: 'freelance_platform',
  },
  {
    id: 'khamsat',
    platformNameAr: 'خمسات — Khamsat',
    platformNameEn: 'Khamsat — Profile',
    roleLabelAr: 'الخدمات التقنية المصغرة والمخصصة',
    roleLabelEn: 'Freelance Digital Services',
    handle: 'bandr_2026',
    url: 'https://khamsat.com/user/bandr_2026',
    descriptionAr: 'استعرض الخدمات التقنية وتطوير الويب المتاحة عبر الحساب المهني في منصة خمسات.',
    descriptionEn: 'View available web development and technical services on the Khamsat profile.',
    ctaAr: 'زيارة حساب خمسات',
    ctaEn: 'Visit Khamsat Profile',
    categoryType: 'freelance_platform',
  },
  {
    id: 'baaeed',
    platformNameAr: 'بعيد — Baaeed',
    platformNameEn: 'Baaeed — Profile',
    roleLabelAr: 'الملف المهني للعمل عن بُعد',
    roleLabelEn: 'Remote Professional Profile',
    handle: 'bandr__amlan',
    url: 'https://baaeed.com/u/bandr__amlan',
    descriptionAr: 'الاطلاع على الملف المهني للعمل التقني عن بُعد عبر منصة بعيد.',
    descriptionEn: 'Explore the remote engineering professional profile on Baaeed.',
    ctaAr: 'زيارة حساب بعيد',
    ctaEn: 'Visit Baaeed Profile',
    categoryType: 'freelance_platform',
  },
  {
    id: 'linkedin',
    platformNameAr: 'لينكدإن — LinkedIn',
    platformNameEn: 'LinkedIn — Bander Mohammed Esmail',
    roleLabelAr: 'التواصل المهني والشبكة الاحترافية',
    roleLabelEn: 'Professional Network',
    handle: 'bander-mohammed-esmail-18a665345',
    url: 'https://www.linkedin.com/in/bander-mohammed-esmail-18a665345',
    descriptionAr: 'تواصل مباشرة عبر الحساب المهني الرسمي على منصة LinkedIn.',
    descriptionEn: 'Connect directly via the official LinkedIn professional profile.',
    ctaAr: 'التواصل عبر LinkedIn',
    ctaEn: 'Connect on LinkedIn',
    categoryType: 'professional_network',
  },
  {
    id: 'github',
    platformNameAr: 'GitHub — Bandar2025',
    platformNameEn: 'GitHub — Bandar2025',
    roleLabelAr: 'مستودعات الأكواد البرمجية والملف الهندسي',
    roleLabelEn: 'Code Repositories & Engineering Profile',
    handle: 'Bandar2025',
    url: 'https://github.com/Bandar2025',
    descriptionAr:
      'وجهة مستودعات الأكواد البرمجية والمشاريع المفتوحة على GitHub (معروضة كحساب ومستودع برمجي منفصل عن تطبيقات الويب المنشورة).',
    descriptionEn:
      'Code repository and developer profile destination on GitHub (presented as a code repository profile, distinct from deployed web applications).',
    ctaAr: 'استعراض GitHub',
    ctaEn: 'Explore GitHub Profile',
    categoryType: 'code_repository',
  },
];

export const TECHNICAL_SKILLS_INVENTORY: SkillGroup[] = [
  {
    id: 'backend-apis',
    titleAr: 'تطوير الواجهات الخلفية وواجهات البرمجة (Backend & APIs)',
    titleEn: 'Backend and APIs',
    summaryAr: 'بناء الخوادم، واجهات البرمجة القياسية، وهيكلة نقاط النهاية الآمنة.',
    summaryEn: 'Server-side engineering, RESTful services, and secure endpoint architectures.',
    skills: [
      { nameEn: 'Node.js', nameAr: 'Node.js' },
      { nameEn: 'Express.js', nameAr: 'Express.js' },
      { nameEn: 'Python', nameAr: 'Python' },
      { nameEn: 'Django', nameAr: 'Django' },
      { nameEn: 'Flask', nameAr: 'Flask' },
      { nameEn: 'FastAPI', nameAr: 'FastAPI' },
      { nameEn: 'RESTful APIs', nameAr: 'واجهات برمجة RESTful APIs' },
      { nameEn: 'Secure Endpoint Architectures', nameAr: 'معمارية نقاط النهاية الآمنة' },
    ],
  },
  {
    id: 'frontend',
    titleAr: 'تطوير الواجهات الأمامية (Frontend)',
    titleEn: 'Frontend',
    summaryAr: 'بناء تطبيقات الصفحة الواحدة، التصميم المتجاوب، وتجربة المستخدم المتوافقة مع الجوال أولاً.',
    summaryEn: 'Single-page applications, responsive layouts, and mobile-first interface development.',
    skills: [
      { nameEn: 'React.js', nameAr: 'React.js' },
      { nameEn: 'Single Page Applications (SPA)', nameAr: 'تطبيقات الصفحة الواحدة (SPA)' },
      { nameEn: 'HTML5', nameAr: 'HTML5' },
      { nameEn: 'CSS3', nameAr: 'CSS3' },
      { nameEn: 'Tailwind CSS', nameAr: 'Tailwind CSS' },
      { nameEn: 'Responsive Layouts', nameAr: 'التخطيطات المتجاوبة' },
      { nameEn: 'Mobile-First Development', nameAr: 'التطوير المتوافق مع الجوال أولاً' },
    ],
  },
  {
    id: 'databases',
    titleAr: 'قواعد البيانات وهيكلة البيانات (Databases)',
    titleEn: 'Databases',
    summaryAr: 'تصميم قواعد البيانات العلائقية وغير العلائقية، التطبيع، وتحسين مسارات التجميع.',
    summaryEn: 'Relational and document databases, normalization, relational mapping, and aggregation optimization.',
    skills: [
      { nameEn: 'MongoDB', nameAr: 'MongoDB' },
      { nameEn: 'MySQL', nameAr: 'MySQL' },
      { nameEn: 'SQLite', nameAr: 'SQLite' },
      { nameEn: 'Database Normalization', nameAr: 'تطبيع قواعد البيانات (Normalization)' },
      { nameEn: 'Relational Mapping', nameAr: 'الربط العلائقي (Relational Mapping)' },
      { nameEn: 'Aggregation Pipelines', nameAr: 'مسارات التجميع (Aggregation Pipelines)' },
      { nameEn: 'Database Design & Optimization', nameAr: 'تصميم وتحسين قواعد البيانات' },
    ],
  },
  {
    id: 'ai-computer-vision',
    titleAr: 'الذكاء الاصطناعي والرؤية الحاسوبية (AI & Computer Vision)',
    titleEn: 'AI and Computer Vision',
    summaryAr: 'تدريب نماذج الرؤية الحاسوبية، دمج وتقييم نماذج اللغة الكبيرة، وهندسة الأوامر.',
    summaryEn: 'Deep learning vision models, Large Language Model integration, evaluation, and prompt engineering.',
    skills: [
      { nameEn: 'TensorFlow', nameAr: 'TensorFlow' },
      { nameEn: 'Keras', nameAr: 'Keras' },
      { nameEn: 'Computer Vision', nameAr: 'الرؤية الحاسوبية (Computer Vision)' },
      { nameEn: 'Large Language Model Integration', nameAr: 'دمج نماذج اللغة الكبيرة (LLM Integration)' },
      { nameEn: 'LLM Evaluation', nameAr: 'تقييم أداء نماذج اللغة (LLM Evaluation)' },
      { nameEn: 'Prompt Engineering', nameAr: 'هندسة الأوامر (Prompt Engineering)' },
    ],
  },
  {
    id: 'data-evaluation',
    titleAr: 'البيانات والتقييم التقني (Data & Technical Evaluation)',
    titleEn: 'Data and Technical Evaluation',
    summaryAr: 'معالجة البيانات، إعداد مجموعات التدريب، التحقق من الصيغ، ومراجعة الأكواد والتقارير التقنية.',
    summaryEn: 'Data analysis, training-set preparation, annotation workflows, and technical code validation.',
    skills: [
      { nameEn: 'Pandas', nameAr: 'Pandas' },
      { nameEn: 'NumPy', nameAr: 'NumPy' },
      { nameEn: 'Data-Format Verification', nameAr: 'التحقق من صيغ البيانات' },
      { nameEn: 'Training-Set Generation', nameAr: 'بناء مجموعات بيانات التدريب' },
      { nameEn: 'Annotation Workflows', nameAr: 'مسارات ترميز وتوصيف البيانات (Annotation)' },
      { nameEn: 'Data Validation', nameAr: 'التحقق من صحة البيانات (Data Validation)' },
      { nameEn: 'Technical Reporting', nameAr: 'إعداد التقارير التقنية' },
      { nameEn: 'Code Validation', nameAr: 'مراجعة والتحقق من الكود البرمجي' },
    ],
  },
  {
    id: 'tools-deployment',
    titleAr: 'الأدوات والنشر السحابي (Tools & Deployment)',
    titleEn: 'Tools and Deployment',
    summaryAr: 'إدارة الإصدارات، الاتصال اللحظي، والنشر عبر بيئات الاستضافة السحابية المتعددة.',
    summaryEn: 'Version control, real-time communication, and cloud deployment workflows.',
    skills: [
      { nameEn: 'Git', nameAr: 'Git' },
      { nameEn: 'GitHub', nameAr: 'GitHub' },
      { nameEn: 'Socket.io', nameAr: 'Socket.io' },
      { nameEn: 'Vercel', nameAr: 'Vercel' },
      { nameEn: 'Lovable', nameAr: 'Lovable' },
      { nameEn: 'Cloud Platforms', nameAr: 'المنصات السحابية (Cloud Platforms)' },
      { nameEn: 'Cross-Environment Deployments', nameAr: 'النشر عبر البيئات المتعددة' },
    ],
  },
];

export const SERVICE_CATEGORIES_DATA: ServiceCategoryMeta[] = [
  {
    id: 'software-development',
    index: '01',
    labelAr: 'تطوير البرمجيات والأنظمة',
    labelEn: 'Software & Systems',
    shortDescAr: 'تصميم وبناء المواقع، المتاجر الإلكترونية، أنظمة الإدارة المتكاملة، ولوحات التحكم.',
    shortDescEn: 'Building web applications, digital storefronts, ERP systems, and API architectures.',
    iconName: 'Code2',
  },
  {
    id: 'ai-automation',
    index: '02',
    labelAr: 'الذكاء الاصطناعي والأتمتة',
    labelEn: 'AI & Automation',
    shortDescAr: 'دمج نماذج الذكاء الاصطناعي، بناء المساعدين الأذكياء، وهندسة تكامل الأنظمة وسير العمل.',
    shortDescEn: 'LLM integrations, custom AI assistants, automated pipelines, and workflow orchestration.',
    iconName: 'Bot',
  },
  {
    id: 'reports-data',
    index: '03',
    labelAr: 'التقارير وتحليل البيانات',
    labelEn: 'Reports & Data Analysis',
    shortDescAr: 'تحليل البيانات، إعداد التقارير الموثقة، وبناء لوحات المؤشرات والرسوم البيانية.',
    shortDescEn: 'Data cleaning, analytical reports, KPI dashboards, and performance benchmarking.',
    iconName: 'BarChart3',
  },
  {
    id: 'research-studies',
    index: '04',
    labelAr: 'الأبحاث والدراسات',
    labelEn: 'Research & Studies',
    shortDescAr: 'المساعدة في إعداد الدراسات التقنية، مراجعة الأدبيات، وتنظيم وتوثيق المراجع.',
    shortDescEn: 'Technical exploratory research, literature review synthesis, and citation formatting.',
    iconName: 'BookMarked',
  },
  {
    id: 'professional-docs',
    index: '05',
    labelAr: 'المستندات المهنية والتعليمية',
    labelEn: 'Professional Docs',
    shortDescAr: 'صياغة السير الذاتية، خطابات التقديم، المقترحات الفنية، والأدلة التعليمية المتقنة.',
    shortDescEn: 'CV optimization, tailored cover letters, technical proposals, and training manuals.',
    iconName: 'FileText',
  },
  {
    id: 'design-quality',
    index: '06',
    labelAr: 'التصميم والجودة التقنية',
    labelEn: 'Design & Quality Assurance',
    shortDescAr: 'تصميم واجهات UI/UX، تدقيق إمكانية الوصول، فحص الأداء، واختبار البرمجيات.',
    shortDescEn: 'Responsive UI/UX design, accessibility auditing, QA testing, and performance audits.',
    iconName: 'CheckCircle2',
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  // ==========================================
  // Category 1: Software & Systems Development
  // ==========================================
  {
    id: 'web-design-dev',
    index: '01',
    category: 'software-development',
    categoryLabelAr: 'تطوير البرمجيات والأنظمة',
    categoryLabelEn: 'Software & Systems',
    iconKey: 'Globe',
    titleAr: 'تصميم وتطوير مواقع وتطبيقات الويب',
    titleEn: 'Web Application Design & Development',
    descriptionAr:
      'بناء مواقع وتطبيقات ويب عصرية ومتجاوبة بالكامل باللغتين العربية والإنجليزية، مع التركيز على وضوح المعمارية وسرعة التصفح.',
    descriptionEn:
      'Building modern, responsive bilingual web applications focused on structural clarity, fast loading, and clean architecture.',
    scopePointsAr: [
      'تطوير تطبيقات الصفحة الواحدة (SPA) والمنصات التفاعلية بـ React.js و Tailwind CSS',
      'دعم كامل للتخطيطات ثنائية الاتجاه: العربية (RTL) والإنجليزية (LTR)',
      'تكامل احترافي مع واجهات البرمجة RESTful APIs والخدمات الخلفية',
    ],
    scopePointsEn: [
      'Single-page applications (SPA) and interactive platforms with React.js & Tailwind CSS',
      'Full bilingual RTL/LTR architectural support across all devices',
      'Seamless integration with RESTful APIs and modern backend endpoints',
    ],
    expectedDeliverablesAr: [
      'كود مصدري منظم وموثق ومبني بأحدث معايير TypeScript',
      'واجهات تفاعلية متجاوبة 100% مع الهواتف والكمبيوتر',
      'تهيئة محركات البحث (SEO) وتحسين سرعة التحميل الأولى',
    ],
    expectedDeliverablesEn: [
      'Clean, documented TypeScript source codebase adhering to best practices',
      'Fully responsive UI optimized for mobile, tablet, and desktop',
      'Basic SEO metadata configuration and initial load performance tuning',
    ],
  },
  {
    id: 'ecommerce-dev',
    index: '02',
    category: 'software-development',
    categoryLabelAr: 'تطوير البرمجيات والأنظمة',
    categoryLabelEn: 'Software & Systems',
    iconKey: 'ShoppingCart',
    titleAr: 'إنشاء وتطوير المتاجر الإلكترونية',
    titleEn: 'E-Commerce Storefront Development',
    descriptionAr:
      'تطوير واجهات المتاجر الرقمية وتجارب التسوق المصممة لعرض المنتجات بوضوح، مع تصنيف مرن وتجربة سلة شراء سلسة.',
    descriptionEn:
      'Developing digital storefronts and catalog browsing experiences engineered for intuitive product discovery and checkout.',
    scopePointsAr: [
      'تصميم واجهات عرض المنتجات، التصنيفات، وسلة الشراء المتوافقة مع الجوال أولاً',
      'تنظيم هيكل البيانات وتجربة التصفح المريح والفلاتر الذكية',
      'تهيئة الواجهات للربط مع بوابات الدفع وأنظمة إدارة المخزون',
    ],
    scopePointsEn: [
      'Mobile-first product catalog, product filtering, and shopping cart layouts',
      'Structured catalog data schemas and intuitive navigation flows',
      'Frontend readiness for payment gateways and inventory tracking integrations',
    ],
    expectedDeliverablesAr: [
      'واجهة متجر إلكتروني تفاعلية متكاملة مع سلة المشتريات',
      'لوحة استعراض الطلبات والمنتجات سهلة التحديث',
      'تجربة شراء سريعة ومهيأة للربط مع بوابات الدفع',
    ],
    expectedDeliverablesEn: [
      'Complete interactive storefront interface with stateful cart management',
      'Product and order catalog viewer ready for backend binding',
      'Streamlined checkout flow structured for payment gateway connection',
    ],
  },
  {
    id: 'management-erp-systems',
    index: '03',
    category: 'software-development',
    categoryLabelAr: 'تطوير البرمجيات والأنظمة',
    categoryLabelEn: 'Software & Systems',
    iconKey: 'Layers',
    titleAr: 'بناء أنظمة الإدارة والمحاسبة والمخزون',
    titleEn: 'ERP, Inventory & Administrative Systems',
    descriptionAr:
      'تطوير أنظمة إدارة الأعمال، المحاسبة المزدوجة، إدارة المستودعات، والمنصات الإدارية للمؤسسات التعليمية والصحية.',
    descriptionEn:
      'Engineering enterprise management platforms, double-entry accounting interfaces, inventory trackers, and institutional portals.',
    scopePointsAr: [
      'بناء شاشات قيود المحاسبة وسندات القبض والصرف وإدارة الدليل المحاسبي',
      'إدارة الصلاحيات متعددة الأدوار (RBAC) لحماية بيانات المؤسسة',
      'أنظمة إدارة الطلاب والمدارس وبوابات السجلات الصحية والعيادات',
    ],
    scopePointsEn: [
      'Accounting journal entry screens, voucher management, and chart of accounts',
      'Role-based access control (RBAC) securing organizational data boundaries',
      'School academic platforms and healthcare clinic record management portals',
    ],
    expectedDeliverablesAr: [
      'لوحة نظام إدارية متكاملة تدعم الأذونات المتعددة للمستخدمين',
      'شاشات إدارة السجلات والجداول مع ميزات البحث والتصدير',
      'توثيق معمارية قواعد البيانات والتدفقات الإجرائية للنظام',
    ],
    expectedDeliverablesEn: [
      'Comprehensive administrative management portal with multi-role permissions',
      'Data ledger management screens with search, filter, and export capabilities',
      'Documented database schema and business logic workflows',
    ],
  },
  {
    id: 'dashboards-apis',
    index: '04',
    category: 'software-development',
    categoryLabelAr: 'تطوير البرمجيات والأنظمة',
    categoryLabelEn: 'Software & Systems',
    iconKey: 'Database',
    titleAr: 'تطوير لوحات التحكم وقواعد البيانات وواجهات API',
    titleEn: 'Dashboards, Databases & API Development',
    descriptionAr:
      'بناء لوحات تحكم متقدمة لإدارة المحتوى والعمليات، مع هندسة قواعد البيانات وتطوير نقاط النهاية الآمنة والسريعة.',
    descriptionEn:
      'Building administrative control panels, structured database architectures, and secure RESTful API endpoints.',
    scopePointsAr: [
      'تصميم نماذج وقواعد البيانات (PostgreSQL, Firestore, MongoDB)',
      'هندسة واجهات برمجة RESTful سريعة ومحمية بالمصادقة',
      'لوحات تحكم إدارية تفاعلية للتحكم بالمحتوى والمستخدمين لحظياً',
    ],
    scopePointsEn: [
      'Database schema modeling and optimization (PostgreSQL, Firestore, MongoDB)',
      'Secure, high-performance RESTful API endpoints with authentication guards',
      'Real-time administrative dashboards for operational and content management',
    ],
    expectedDeliverablesAr: [
      'واجهات برمجة موثقة مع آليات المصادقة والتحقق من صحة المدخلات',
      'لوحة تحكم إدارية مريحة لإدارة البيانات والمستخدمين',
      'مخطط هيكلة قاعدة البيانات مع قواعد أمان مشددة',
    ],
    expectedDeliverablesEn: [
      'Documented API endpoints with authentication and payload validation',
      'Administrative dashboard for user and record management',
      'Optimized database schema with strict security access rules',
    ],
  },
  {
    id: 'digital-prototyping',
    index: '05',
    category: 'software-development',
    categoryLabelAr: 'تطوير البرمجيات والأنظمة',
    categoryLabelEn: 'Software & Systems',
    iconKey: 'Cpu',
    titleAr: 'بناء النماذج الأولية للمنتجات الرقمية (MVP)',
    titleEn: 'Digital Product Prototyping (MVP)',
    descriptionAr:
      'تحويل أفكار المشاريع والأنظمة التقنية إلى نماذج أولية تفاعلية وقابلة للاستعراض السريع للتحقق من الجدوى قبل الاستثمار الكامل.',
    descriptionEn:
      'Translating innovative product concepts into interactive functional MVP prototypes for early user validation and feedback.',
    scopePointsAr: [
      'بناء نماذج تفاعلية قابلة للنقر والاستعراض المباشر خلال فترات وجيزة',
      'التحقق من رحلة المستخدم الرئيسية (Core User Journey) وتصميم التدفقات',
      'توثيق النطاق التقني وهيكلة المتطلبات للمراحل التطويرية اللاحقة',
    ],
    scopePointsEn: [
      'Interactive, clickable prototypes deployed for immediate stakeholder review',
      'Validation of core user journeys and interaction workflows',
      'Technical scope specification and milestone roadmap for future scale',
    ],
    expectedDeliverablesAr: [
      'تطبيق نموذج أولي يعمل ومتاح عبر رابط مباشر للاستعراض',
      'ملف توثيق المعمارية التقنية والتوصيات الفنية للتوسع',
    ],
    expectedDeliverablesEn: [
      'Live, deployed prototype link ready for stakeholder review and testing',
      'Architecture documentation and technical recommendations for production',
    ],
  },

  // ==========================================
  // Category 2: AI & Automation
  // ==========================================
  {
    id: 'ai-llm-integration',
    index: '06',
    category: 'ai-automation',
    categoryLabelAr: 'الذكاء الاصطناعي والأتمتة',
    categoryLabelEn: 'AI & Automation',
    iconKey: 'Sparkles',
    titleAr: 'دمج نماذج الذكاء الاصطناعي في التطبيقات',
    titleEn: 'AI & Large Language Model Integration',
    descriptionAr:
      'ربط وتوظيف نماذج الذكاء الاصطناعي التوليدي ونماذج اللغة (Gemini, Claude, GPT) داخل تطبيقات الويب لتقديم ميزات ذكية وتفاعلية.',
    descriptionEn:
      'Integrating generative AI and LLM APIs (Gemini, Claude, GPT) into web apps to deliver context-aware smart capabilities.',
    scopePointsAr: [
      'تكامل واجهات Gemini SDK و OpenAI في الخوادم الخلفية دون كشف المفاتيح للعميل',
      'دعم الاستجابات اللحظية المتدفقة (Streaming Responses) لتقليل زمن الانتظار',
      'معالجة وتلخيص النصوص واستخراج البيانات المنظمة بتنسيق JSON دقيق',
    ],
    scopePointsEn: [
      'Server-side SDK integration ensuring zero client-side API key exposure',
      'Streaming responses for immediate interactive feedback and minimal latency',
      'Text extraction, smart summarization, and guaranteed structured JSON output',
    ],
    expectedDeliverablesAr: [
      'نقطة نهاية خادم آمنة تتواصل مع نموذج الذكاء الاصطناعي المحدد',
      'واجهة مستخدم تفاعلية تعرض المخرجات بسلاسة مع دعم التدفق اللحظي',
      'ضوابط حماية من الأخطاء وقيود استهلاك الموارد',
    ],
    expectedDeliverablesEn: [
      'Secure server proxy endpoint communicating with the chosen AI model',
      'Interactive UI seamlessly rendering streaming tokens and structured output',
      'Robust error handling, rate limiting, and timeout fallback mechanisms',
    ],
  },
  {
    id: 'custom-ai-assistants',
    index: '07',
    category: 'ai-automation',
    categoryLabelAr: 'الذكاء الاصطناعي والأتمتة',
    categoryLabelEn: 'AI & Automation',
    iconKey: 'Bot',
    titleAr: 'تصميم مساعدين وروبوتات محادثة ذكية متخصصة',
    titleEn: 'Custom AI Assistants & Specialized Chatbots',
    descriptionAr:
      'بناء مساعدين رقميين وروبوتات دردشة ذكية مخصصة لمجال عملك، قادرة على الإجابة على استفسارات المستخدمين بالاستناد لبياناتك الخاصة.',
    descriptionEn:
      'Designing specialized conversational agents and assistants trained on your business guidelines and knowledge base.',
    scopePointsAr: [
      'تخصيص تعليمات النظام (System Instructions) وتحديد سلوك وشخصية المساعد',
      'ربط المساعد بقاعدة معرفية ومستندات مرجعية للإجابة الدقيقة دون هلوسة',
      'توفير واجهة محادثة عربية وإنجليزية أنيقة مع حفظ سياق الحوار',
    ],
    scopePointsEn: [
      'Custom system instructions tuning ensuring accurate tone and scope boundaries',
      'Knowledge-base grounded responses minimizing hallucination',
      'Elegant bilingual conversational interface with persistent chat history',
    ],
    expectedDeliverablesAr: [
      'مساعد محادثة متكامل يمكن تضمينه في موقعك أو تطبيقه',
      'دليل إرشادي لتحديث قاعدة المعرفة وتعليمات النظام دورياً',
    ],
    expectedDeliverablesEn: [
      'Embeddable conversational assistant interface for web apps',
      'Operating guide for ongoing knowledge base updates and prompt tuning',
    ],
  },
  {
    id: 'workflow-automation',
    index: '08',
    category: 'ai-automation',
    categoryLabelAr: 'الذكاء الاصطناعي والأتمتة',
    categoryLabelEn: 'AI & Automation',
    iconKey: 'Zap',
    titleAr: 'أتمتة المهام وسير العمل والعمليات المتكررة',
    titleEn: 'Workflow & Repetitive Task Automation',
    descriptionAr:
      'تحويل المهام اليدوية والعمليات الروتينية إلى مسارات عمل مؤتمتة تنفذ ذاتياً، لتقليل الأخطاء البشرية وتوفير الوقت والجهد.',
    descriptionEn:
      'Automating manual workflows, scheduled routines, and repetitive data processing to eliminate errors and save operational time.',
    scopePointsAr: [
      'أتمتة إرسال الإشعارات والتقارير المجدولة وتحديث السجلات تلقائياً',
      'بناء مشغلات أحداث (Event-driven Webhooks) للربط بين المنصات المختلفة',
      'معالجة البيانات والملفات تلقائياً فور رفعها دون تدخل يدوي',
    ],
    scopePointsEn: [
      'Automated scheduled reporting, notifications, and periodic data synchronization',
      'Event-driven webhook pipelines bridging disparate external tools',
      'Automated background file processing and transformation pipelines',
    ],
    expectedDeliverablesAr: [
      'سكريبتات ومسارات أتمتة تعمل بموثوقية مع سجل تشغيل مفصل',
      'آليات مراقبة وتنبيه في حال حدوث أي توقف أو فشل في التنفيذ',
    ],
    expectedDeliverablesEn: [
      'Reliable automation scripts with comprehensive execution logging',
      'Status monitoring and alerting alerts on process exceptions',
    ],
  },
  {
    id: 'api-orchestration',
    index: '09',
    category: 'ai-automation',
    categoryLabelAr: 'الذكاء الاصطناعي والأتمتة',
    categoryLabelEn: 'AI & Automation',
    iconKey: 'Network',
    titleAr: 'بناء تكاملات بين الأنظمة والخدمات الخارجية',
    titleEn: 'System Integrations & API Orchestration',
    descriptionAr:
      'الربط البرمجي بين أدواتك ومنصاتك المختلفة (سحابة، دفع، بريد، قواعد بيانات) لتنسيق تدفق البيانات بسلاسة وأمان.',
    descriptionEn:
      'Connecting disparate services and external platforms (cloud, payment, mail, storage) into unified, secure data workflows.',
    scopePointsAr: [
      'الربط مع خدمات الدفع، التخزين السحابي، وواجهات خدمات الرسائل والبريد',
      'توحيد صيغ البيانات المتبادلة بين الأنظمة المختلفة (Data Serialization)',
      'حماية عمليات الربط وإدارة رموز المصادقة والـ API Tokens بأمان',
    ],
    scopePointsEn: [
      'Integration with cloud storage, payment providers, and messaging webhooks',
      'Data format normalization and payload transformation across services',
      'Token management and secret protection following security best practices',
    ],
    expectedDeliverablesAr: [
      'تكامل برمجي موثوق بين الأنظمة المستهدفة مع معالجة كافة حالات الخطأ',
      'توثيق نقاط الربط والمفاتيح والمتغيرات البيئية اللازمة',
    ],
    expectedDeliverablesEn: [
      'Robust API integration pipeline with graceful degradation handling',
      'Integration reference guide covering endpoints and environment setup',
    ],
  },

  // ==========================================
  // Category 3: Reports & Data Analysis
  // ==========================================
  {
    id: 'structured-reports',
    index: '10',
    category: 'reports-data',
    categoryLabelAr: 'التقارير وتحليل البيانات',
    categoryLabelEn: 'Reports & Data Analysis',
    iconKey: 'FileSpreadsheet',
    titleAr: 'إعداد تقارير إدارية وتقنية منظمة',
    titleEn: 'Structured Technical & Administrative Reports',
    descriptionAr:
      'إعداد تقارير إدارية وتقنية مفصلة مبنية على بيانات واقعية، توضح مجريات المشاريع وتوثق القرارات المعمارية والنتائج التشغيلية.',
    descriptionEn:
      'Authoring structured administrative and technical reports grounded in verifiable data, documenting project architecture and outcomes.',
    scopePointsAr: [
      'صياغة تقارير التدقيق الفني ومراجعة البنية التحتية البرمجية',
      'توثيق مصادر البيانات، الفرضيات، والقيود التشغيلية بنزاهة وشفافية',
      'تنظيم المعلومات في جداول ومخططات تسهل اتخاذ القرارات الإدارية',
    ],
    scopePointsEn: [
      'Technical architecture auditing and infrastructure review documentation',
      'Transparent disclosure of data sources, assumptions, and constraints',
      'Data synthesis into clear executive tables and decision-making summaries',
    ],
    expectedDeliverablesAr: [
      'تقرير فني منظم بصيغة PDF أو Markdown جاهز للمشاركة والعرض',
      'ملخص تنفيذي يركز على الأولويات والتوصيات الملموسة',
    ],
    expectedDeliverablesEn: [
      'Structured technical report in PDF or Markdown ready for presentation',
      'Executive summary highlighting priorities and actionable findings',
    ],
  },
  {
    id: 'data-cleaning-analysis',
    index: '11',
    category: 'reports-data',
    categoryLabelAr: 'التقارير وتحليل البيانات',
    categoryLabelEn: 'Reports & Data Analysis',
    iconKey: 'Filter',
    titleAr: 'تنظيف البيانات وتحليلها وتلخيصها',
    titleEn: 'Data Cleaning, Transformation & Summarization',
    descriptionAr:
      'معالجة مجموعات البيانات الأولية، إزالة القيم الشاذة، وتلخيص المؤشرات الأساسية لاستخراج رؤى واضحة دون أي استنتاجات مضللة.',
    descriptionEn:
      'Preprocessing raw datasets, handling outliers, and aggregating key metrics into actionable, accurate analytical summaries.',
    scopePointsAr: [
      'تنقية الجداول ومعالجة القيم المفقودة والمتكررة باستخدام Python و Pandas',
      'استخراج المؤشرات الإحصائية الرئيسية وتحويل البيانات إلى صيغ قياسية',
      'إعداد مجموعات بيانات نظيفة وجاهزة للاستخدام في التدريب أو العرض',
    ],
    scopePointsEn: [
      'Table scrubbing and null-value handling using Python and Pandas pipelines',
      'Descriptive statistics extraction and standardized data format validation',
      'Clean dataset outputs prepared for downstream modeling or reporting',
    ],
    expectedDeliverablesAr: [
      'مجموعة بيانات نظيفة ومنظمة بصيغ Excel أو CSV أو JSON',
      'ملخص إحصائي يوضح خصائص البيانات ونقاط القوة والقيود',
    ],
    expectedDeliverablesEn: [
      'Scrubbed, normalized dataset delivered in CSV, Excel, or JSON formats',
      'Statistical summary report detailing data distribution and limitations',
    ],
  },
  {
    id: 'kpi-dashboards',
    index: '12',
    category: 'reports-data',
    categoryLabelAr: 'التقارير وتحليل البيانات',
    categoryLabelEn: 'Reports & Data Analysis',
    iconKey: 'LineChart',
    titleAr: 'إنشاء الجداول والمؤشرات ولوحات المعلومات (Dashboards)',
    titleEn: 'KPI Dashboards & Data Visualization',
    descriptionAr:
      'تصميم لوحات معلومات تفاعلية تعرض مؤشرات الأداء الحقيقية والرسوم البيانية التوضيحية لمتابعة العمليات التقنية والتجارية بسهولة.',
    descriptionEn:
      'Designing visual KPI dashboards and interactive charts tracking operational and business metrics with high legibility.',
    scopePointsAr: [
      'تصميم مخططات بيانية واضحة وسريعة القراءة مع الالتزام بالتباين المريح',
      'عرض الأرقام الحقيقية الموثقة مع تجنب المؤشرات الوهمية أو غير الدقيقة',
      'لوحات معلومات تتكيف مع شاشات الهواتف وأجهزة سطح المكتب بسلاسة',
    ],
    scopePointsEn: [
      'Legible visual chart components maintaining high accessible contrast',
      'Truthful metric presentation strictly avoiding fabricated progress indicators',
      'Responsive dashboard layout adapting across mobile and desktop screens',
    ],
    expectedDeliverablesAr: [
      'لوحة معلومات برمجية تفاعلية مربوطة بمصادر البيانات الحقيقية',
      'مكونات رسومية جاهزة لإعادة الاستخدام في تقارير دورية',
    ],
    expectedDeliverablesEn: [
      'Interactive dashboard UI integrated with authentic data endpoints',
      'Reusable visualization components for recurring performance monitoring',
    ],
  },

  // ==========================================
  // Category 4: Research & Studies
  // ==========================================
  {
    id: 'tech-research-assistance',
    index: '13',
    category: 'research-studies',
    categoryLabelAr: 'الأبحاث والدراسات',
    categoryLabelEn: 'Research & Studies',
    iconKey: 'Search',
    titleAr: 'المساعدة في إعداد الأبحاث التقنية والدراسات',
    titleEn: 'Technical Research & Exploratory Studies',
    descriptionAr:
      'المساعدة في البحث المكتبي المنظم واستكشاف أحدث الممارسات والتقنيات البرمجية، وتقديم ملخصات موضوعية تدعم التخطيط الأكاديمي والمهني.',
    descriptionEn:
      'Assisting in structured desk research, synthesizing emerging technical literature, and authoring objective study briefs.',
    scopePointsAr: [
      'جمع المصادر الموثوقة والمقالات العلمية والتقنية المحكمة ذات الصلة',
      'تلخيص الدراسات واستخلاص الفروق والنتائج دون ادعاء تجارب لم تُجرَ',
      'هيكلة موضوعات البحث وتقديم مقارنات مبنية على أدلة مثبتة',
    ],
    scopePointsEn: [
      'Curating peer-reviewed technical papers and authentic engineering resources',
      'Literature summarization strictly distinguishing factual evidence from inference',
      'Research structuring with evidence-based technical framework comparisons',
    ],
    expectedDeliverablesAr: [
      'ملف بحث مكتبي منظم يتضمن مراجعة المصادر والمقارنة التحليلية',
      'قائمة مصادر موثقة وفق المعايير الأكاديمية المعتمدة',
    ],
    expectedDeliverablesEn: [
      'Structured technical research brief synthesizing literature and comparisons',
      'Verified bibliography formatted according to target standard guidelines',
    ],
  },
  {
    id: 'citation-management',
    index: '14',
    category: 'research-studies',
    categoryLabelAr: 'الأبحاث والدراسات',
    categoryLabelEn: 'Research & Studies',
    iconKey: 'BookOpen',
    titleAr: 'تنظيم وتوثيق المراجع الأكاديمية والمهنية',
    titleEn: 'Citation Formatting & Reference Management',
    descriptionAr:
      'تنسيق المراجع وقوائم المصادر وفق الأنماط المعتمدة (APA, IEEE, Harvard) مع التحقق من صحة الروابط وبيانات النشر بدقة وأمانة.',
    descriptionEn:
      'Formatting citations and reference bibliographies adhering to target styles (APA, IEEE, Harvard) with source URL verification.',
    scopePointsAr: [
      'تنسيق الاقتباسات داخل النص وقائمة المراجع في نهاية البحث أو التقرير',
      'التحقق من صحة أسماء المؤلفين وسنوات النشر وعناوين الدوريات',
      'تنظيم مكتبة المراجع لتسهيل التعديل والتحديث المستقبلي',
    ],
    scopePointsEn: [
      'In-text citation and end-of-document reference list alignment',
      'Author name, publication date, and journal metadata verification',
      'Bibliography categorization facilitating ongoing document updates',
    ],
    expectedDeliverablesAr: [
      'قائمة مراجع منسقة وخالية من الأخطاء التنسيقية بصيغة Word أو Markdown',
    ],
    expectedDeliverablesEn: [
      'Polished, style-compliant bibliography file formatted in Word or Markdown',
    ],
  },

  // ==========================================
  // Category 5: Professional & Educational Docs
  // ==========================================
  {
    id: 'professional-cv-optimization',
    index: '15',
    category: 'professional-docs',
    categoryLabelAr: 'المستندات المهنية والتعليمية',
    categoryLabelEn: 'Professional Docs',
    iconKey: 'UserCheck',
    titleAr: 'إنشاء السيرة الذاتية وتحسينها وفق الوظيفة',
    titleEn: 'Professional CV Crafting & Job-Targeted Optimization',
    descriptionAr:
      'صياغة سيرة ذاتية هندسية ومهنية متوافقة مع أنظمة الفرز الآلي (ATS)، تبرز مهاراتك وخبراتك الحقيقية دون أي تزييف أو ادعاءات غير موثقة.',
    descriptionEn:
      'Crafting ATS-friendly engineering and professional CVs highlighting verified achievements without fabrication.',
    scopePointsAr: [
      'تنظيم الهيكل المهني: الملخص، الخبرات، المشاريع، المهارات، والتعليم',
      'صياغة نقاط الإنجاز بصيغة أفعال قوية موجهة للأثر والنتائج الملموسة',
      'مواءمة الكلمات المفتاحية مع متطلبات الوظيفة المستهدفة بدقة',
    ],
    scopePointsEn: [
      'Structural formatting: Profile, Work History, Projects, Skills, and Education',
      'Impact-focused bullet points utilizing active accomplishment verbs',
      'Targeted keyword alignment matching job descriptions and ATS requirements',
    ],
    expectedDeliverablesAr: [
      'نسخة سيرة ذاتية جاهزة بصيغة PDF وأخرى قابلة للتحرير بـ Word',
      'توجيهات مخصصة لكيفية تكييف السيرة لكل فرصة عمل جديدة',
    ],
    expectedDeliverablesEn: [
      'Polished CV provided in both ATS-tested PDF and editable Word formats',
      'Personalized guidance on tailoring the document for specific job roles',
    ],
  },
  {
    id: 'cover-letters-proposals',
    index: '16',
    category: 'professional-docs',
    categoryLabelAr: 'المستندات المهنية والتعليمية',
    categoryLabelEn: 'Professional Docs',
    iconKey: 'Send',
    titleAr: 'صياغة خطابات التقديم والمقترحات المهنية',
    titleEn: 'Cover Letters & Professional Proposals',
    descriptionAr:
      'كتابة خطابات تقديم مقنعة وعروض عمل ومراسلات رسمية بالعربية والإنجليزية تعبر عن قيمتك المهنية بأسلوب رصين ومباشر.',
    descriptionEn:
      'Writing tailored cover letters, client outreach messages, and project proposals communicating professional value clearly.',
    scopePointsAr: [
      'صياغة خطاب تقديم مخصص يربط بين مهارات المتقدم ومتطلبات الجهة',
      'إعداد مقترحات المشاريع التقنية (Technical Proposals) بأسلوب مقنع ومنظم',
      'مراسلات مهنية ورسمية موجهة لمسؤولي التوظيف والعملاء المحتملين',
    ],
    scopePointsEn: [
      'Tailored cover letters linking candidate experience to company needs',
      'Structured technical proposals outlining milestones, deliverables, and scope',
      'Professional outreach copy for recruiters, hiring managers, and prospective clients',
    ],
    expectedDeliverablesAr: [
      'خطاب تقديم ومقترح مهني مصاغ بعناية وجاهز للإرسال المباشر',
    ],
    expectedDeliverablesEn: [
      'Carefully tailored cover letter and project proposal text ready for dispatch',
    ],
  },
  {
    id: 'educational-guides',
    index: '17',
    category: 'professional-docs',
    categoryLabelAr: 'المستندات المهنية والتعليمية',
    categoryLabelEn: 'Professional Docs',
    iconKey: 'GraduationCap',
    titleAr: 'إعداد التقارير التعليمية والأدلة التدريبية والملخصات',
    titleEn: 'Educational Guides, Training Manuals & Summaries',
    descriptionAr:
      'إعداد محتوى تعليمي تقني مبسط، أدلة استخدام للأنظمة (User Manuals)، وملخصات تدريبية تسهل نقل المعرفة وفهم الأنظمة المعقدة.',
    descriptionEn:
      'Authoring step-by-step developer documentation, user manuals, and structured educational guides simplifying technical workflows.',
    scopePointsAr: [
      'كتابة أدلة خطوة بخطوة (Step-by-step) لتشغيل واستخدام الأنظمة البرمجية',
      'إعداد شروحات توضيحية للمفاهيم الهندسية ومسارات التطوير',
      'تنسيق لغوي وبصري متناسق يسهل القراءة والرجوع السريع للمعلومات',
    ],
    scopePointsEn: [
      'Step-by-step software setup guides and end-user system manuals',
      'Clear technical walkthroughs explaining architectural flows and best practices',
      'Visual formatting with screenshots and callouts facilitating rapid learning',
    ],
    expectedDeliverablesAr: [
      'دليل تعليمي أو تدريبي منظم بصيغة PDF أو Markdown مدعم بالأمثلة',
    ],
    expectedDeliverablesEn: [
      'Comprehensive educational guide delivered in formatted PDF or Markdown',
    ],
  },

  // ==========================================
  // Category 6: Design & Technical Quality
  // ==========================================
  {
    id: 'ui-ux-design-service',
    index: '18',
    category: 'design-quality',
    categoryLabelAr: 'التصميم والجودة التقنية',
    categoryLabelEn: 'Design & Quality Assurance',
    iconKey: 'Palette',
    titleAr: 'تصميم واجهات وتجربة المستخدم (UI/UX)',
    titleEn: 'User Interface & Experience Design (UI/UX)',
    descriptionAr:
      'تصميم واجهات رقمية جذابة تجمع بين الوضوح البصري، التباين المريح للقراءة، والتنقل البديهي على جميع أحجام الشاشات.',
    descriptionEn:
      'Designing intuitive user interfaces balancing typographic elegance, comfortable contrast, and seamless navigation.',
    scopePointsAr: [
      'بناء أنظمة تصميم متسقة تدعم الوضعين الداكن والفاتح ومبادئ Zero-Pill',
      'تحسين مسارات التفاعل وتسهيل الوصول عبر لوحة المفاتيح',
      'تصميم لوحات التحكم للأنظمة التعليمية، الصحية، والمحاسبية بكفاءة عالية',
    ],
    scopePointsEn: [
      'Cohesive dark and light design systems following strict typographic hierarchy',
      'Streamlined interaction flows and full accessible keyboard navigation',
      'Dashboard UI layouts crafted for high data-density enterprise applications',
    ],
    expectedDeliverablesAr: [
      'مكونات واجهة مستخدم متناسقة وموثقة ومبنية بأحدث ممارسات CSS',
      'مخطط تفاعلي واضح لرحلة المستخدم وتجربة التصفح المتكاملة',
    ],
    expectedDeliverablesEn: [
      'Modular UI components documented and built with modern CSS variables',
      'Cohesive user flow layouts optimized for high conversion and readability',
    ],
  },
  {
    id: 'quality-testing-audits',
    index: '19',
    category: 'design-quality',
    categoryLabelAr: 'التصميم والجودة التقنية',
    categoryLabelEn: 'Design & Quality Assurance',
    iconKey: 'ShieldCheck',
    titleAr: 'اختبار التطبيقات ومراجعة جودة الكود والأداء',
    titleEn: 'Application QA Testing & Code Quality Audits',
    descriptionAr:
      'فحص التطبيقات لاكتشاف الأخطاء الوظيفية، مراجعة الكود البرمجي، وتحسين سرعة استجابة الموقع وتوافقه مع معايير الويب العالمية.',
    descriptionEn:
      'Rigorous functional QA testing, edge-case reproduction, code refactoring, and Web Vitals speed optimization.',
    scopePointsAr: [
      'اختبار الوظائف ومسارات المستخدمين واكتشاف الأخطاء البرمجية وتوثيقها',
      'تدقيق التوافق مع الهواتف الذكية ومتصفحات الويب المختلفة ومعايير إمكانية الوصول',
      'تحسين سرعة التحميل، ضغط الأصول، وتقليل حجم حزم الجافاسكربت',
    ],
    scopePointsEn: [
      'Comprehensive functional testing and detailed reproducible bug logging',
      'Cross-browser and mobile device compatibility verification',
      'Page speed optimization, asset minification, and Core Web Vitals tuning',
    ],
    expectedDeliverablesAr: [
      'تقرير فحص الجودة والأداء يتضمن قائمة المشكلات المكتشفة والحلول المقترحة',
      'إصلاحات برمجية مباشرة للمشكلات المتفق عليها لتحسين مؤشرات الأداء',
    ],
    expectedDeliverablesEn: [
      'Detailed QA audit report highlighting observed issues with step-by-step fixes',
      'Targeted code optimizations boosting speed benchmarks and responsiveness',
    ],
  },
];


export const UI_TRANSLATIONS = {
  ar: {
    nav: {
      home: 'الرئيسية',
      projects: 'المشاريع',
      services: 'الخدمات',
      about: 'نبذة والسيرة',
      contact: 'تواصل معي',
      switchLang: 'English',
      switchLangAria: 'Switch language to English',
    },
    hero: {
      kicker: 'Bandr Solutions · نصنع تجارب رقمية تصنع الفرق',
      headline: 'أحوّل الأفكار إلى تجارب رقمية احترافية',
      subtext:
        'اكتشف مجموعة من المشاريع الرقمية والمتاجر الإلكترونية والحلول التقنية التي أعمل على تطويرها.',
      primaryCta: 'استكشف أعمالي',
      secondaryCta: 'تواصل معي',
      ownerBadge: 'سعيد إسماعيل محمد بندر · مهندس برمجيات متكامل ومتخصص ذكاء اصطناعي',
      sceneLabel: 'مجسم معماري تفاعلي ثلاثي الأبعاد — BS Core',
      enable3D: 'تشغيل العرض ثلاثي الأبعاد',
      disable3D: 'الوضع الثابت الخفيف (SVG)',
      finishLabel: 'السطح المعدني',
      explodeLabel: 'تفكيك المكونات',
      cameraLabel: 'زاوية الكاميرا',
      hideControls: 'إخفاء أدوات المجسم',
      showControls: 'إظهار أدوات المجسم',
    },
    projects: {
      sectionKicker: 'معرض الأعمال والأنظمة الهندسية',
      sectionTitle: 'المشاريع المميزة ودراسات الحالة',
      sectionSubtitle:
        'سجل كامل يضم المشاريع البرمجية والهندسية المنشورة (مفصولة بدقة عن الحسابات المهنية)، مع توضيح شفاف لحالة الروابط والنطاق الموثق في السيرة الذاتية.',
      ecommerceTitle: 'المتاجر الإلكترونية',
      ecommerceSubtitle: 'مشاريع التجارة الإلكترونية والمتاجر الرقمية ضمن أعمال Bandr Solutions.',
      webAndPlatformsTitle: 'مشاريع الويب والمنصات التخصصية',
      webAndPlatformsSubtitle: 'تطبيقات الويب، تقنيات التعليم، والتقنيات الصحية.',
      caseStudiesTitle: 'دراسات الحالة والأنظمة الهندسية',
      caseStudiesSubtitle:
        'أنظمة وحلول برمجية هندسية تشمل نظام المحاسبة وإدارة الأعمال ونظام الذكاء الاصطناعي والاستجابة الآلية.',
      visitProject: 'زيارة المشروع',
      viewDetails: 'عرض التفاصيل وحالة التحقق',
      viewCaseStudy: 'قراءة دراسة الحالة الهندسية',
      noPublicUrlBadge: 'دراسة حالة هندسية — لا يتوفر رابط عام',
      illustrativeNotice: 'رسم توضيحي للفئة — وليس لقطة شاشة للتطبيق',
      genuineScreenshotBadge: 'لقطة شاشة حقيقية للمشروع',
      uploadScreenshotCta: 'إدارة الصور',
      filterLabel: 'تصفية حسب الفئة:',
      showingCount: 'عرض',
      ofCount: 'من أصل',
      projectsWord: 'مشاريع',
      modalClose: 'إغلاق النافذة',
      modalVerificationHeading: 'مصفوفة التحقق من الرابط والحالة (5 نقاط)',
      modalUrlSupplied: 'تزويد الرابط من المالك',
      modalUrlOpened: 'حالة فتح الرابط',
      modalInterfaceObserved: 'معاينة الواجهة الرئيسية',
      modalWorkflowsTested: 'اختبار المسارات الوظيفية',
      modalPublicAccess: 'إتاحة الوصول العام',
      modalVerifiedFacts: 'الحقائق الموثقة (السيرة الذاتية / بيانات المالك)',
      modalUnverifiedScope: 'حدود النطاق غير المتحقق منه (شفافية العرض)',
      modalEngineeringRole: 'المساهمة الهندسية',
      modalTechStack: 'التقنيات المستخدمة',
      modalTechNotClaimed: 'لم يتم ادعاء تقنيات غير موثقة لهذا الرابط؛ يقتصر العرض على البيانات المؤكدة.',
      modalAltUrlLabel: 'رابط بديل مزود (قيد المراجعة):',
      modalGalleryHeading: 'معرض صور المشروع',
      modalSourceCodeBtn: 'مستودع الكود البرمجي (Source)',
    },
    profiles: {
      sectionKicker: 'الحسابات المهنية ومنصات العمل الحر',
      sectionTitle: 'الحسابات المهنية ومستودعات الكود',
      sectionSubtitle:
        'استكشف ملفاتي المهنية وتاريخ أعمالي عبر منصات العمل الحر، شبكة LinkedIn، ومستودعات GitHub البرمجية.',
    },
    services: {
      sectionKicker: 'مجالات العمل والحلول المقدمة',
      sectionTitle: 'الخدمات التقنية',
      sectionSubtitle:
        'مجموعة من الخدمات ومجالات العمل في تطوير المواقع والمتاجر الإلكترونية وتصميم الواجهات وبناء النماذج الأولية.',
      inquireService: 'اطلب هذه الخدمة',
    },
    about: {
      sectionKicker: 'الملف المهني والسيرة الذاتية',
      sectionTitle: 'نبذة عن Bandr Solutions والمهندس سعيد بندر',
      brandIntroHeading: 'هوية Bandr Solutions',
      cvSummaryHeading: 'الملف الهندسي (من السيرة الذاتية)',
      educationHeading: 'المؤهل الأكاديمي',
      languagesHeading: 'اللغات',
      skillsHeading: 'مخزون المهارات التقنية الكامل (حسب السيرة الذاتية)',
      skillsSubtitle:
        'جميع المهارات مصنفة كما وردت في السيرة الذاتية الرسمية دون نسب مئوية مصطنعة أو ادعاءات غير موثقة.',
    },
    contact: {
      sectionKicker: 'تواصل ومناقشة المشاريع',
      sectionTitle: 'تواصل معي',
      sectionSubtitle:
        'يسعدني التواصل لمناقشة مشروعك القادم عبر البريد الإلكتروني الرسمي، أو منصات العمل الحر، أو عبر نموذج تجهيز ملخص المشروع أدناه.',
      directChannelsTitle: 'قنوات التواصل المباشرة والموثقة',
      emailLabel: 'البريد الإلكتروني الرسمي',
      locationLabel: 'الموقع ونطاق العمل',
      phoneLabel: 'رقم الهاتف والتواصل الهاتفي',
      phonePrivacyLabel: 'وضع عرض رقم الهاتف:',
      phoneModeClickToCall: 'زر اتصال وإظهار عند الطلب',
      phoneModeVisible: 'إظهار الرقم مباشرة',
      phoneModeHidden: 'إخفاء الرقم العام',
      revealPhoneBtn: 'إظهار رقم الهاتف للاتصال',
      callNowBtn: 'اتصال هاتفي مباشر',
      formTitle: 'مُجهّز ملخص المشروع (مع تحقق فوري)',
      formNotice:
        'لا يقوم هذا النموذج بإرسال وهمي لخادم غير موجود؛ بل يتحقق من بياناتك ويُنشئ رسالة مشروع منظمة جاهزة للنسخ أو الفتح المباشر في تطبيق البريد الإلكتروني لديك لإرسالها إلى bandr246899@gmail.com.',
      nameLabel: 'الاسم الكامل',
      namePlaceholder: 'أدخل اسمك أو اسم الجهة',
      emailInputLabel: 'البريد الإلكتروني للتواصل',
      emailPlaceholder: 'name@example.com',
      projectTypeLabel: 'نوع المشروع المطلوب',
      projectTypePlaceholder: 'اختر نوع المشروع',
      messageLabel: 'تفاصيل المشروع والاحتياجات',
      messagePlaceholder: 'اشرح فكرة المشروع، الأهداف، أو الروابط المرجعية...',
      submitPrepareBtn: 'تجهيز ملخص المشروع للإرسال',
      copyBriefBtn: 'نسخ ملخص المشروع',
      copiedSuccess: 'تم نسخ ملخص المشروع إلى الحافظة بنجاح!',
      openMailClientBtn: 'فتح في تطبيق البريد الإلكتروني (mailto)',
      resetFormBtn: 'تعديل البيانات',
      errors: {
        nameRequired: 'يرجى إدخال الاسم الكامل (حرفين على الأقل).',
        emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح.',
        projectTypeRequired: 'يرجى اختيار نوع المشروع.',
        messageShort: 'يرجى كتابة تفاصيل المشروع (15 حرفاً على الأقل).',
      },
    },
    footer: {
      navigation: 'روابط التنقل',
      verifiedProjects: 'المشاريع ودراسات الحالة',
      professionalProfiles: 'الحسابات المهنية',
      backToTop: 'العودة إلى الأعلى',
      rights: 'جميع الحقوق محفوظة.',
      transparencyNote:
        'معرض أعمال مبني على بيانات حقيقية وموثقة من السيرة الذاتية والروابط المزودة من المالك.',
    },
    notFound: {
      code: '404',
      title: 'الصفحة غير موجودة',
      description: 'عذراً، المسار الذي تحاول الوصول إليه غير متوفر في موقع Bandr Solutions.',
      backHome: 'العودة إلى الصفحة الرئيسية',
    },
  },
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      services: 'Services',
      about: 'About & CV',
      contact: 'Contact',
      switchLang: 'العربية',
      switchLangAria: 'التبديل إلى اللغة العربية',
    },
    hero: {
      kicker: 'Bandr Solutions · Building Digital Experiences That Matter',
      headline: 'I Turn Ideas Into Exceptional Digital Experiences',
      subtext:
        'Explore a collection of digital projects, e-commerce experiences, and technology solutions.',
      primaryCta: 'Explore My Work',
      secondaryCta: 'Get in Touch',
      ownerBadge: 'Saeed Ismail Mohammed Bandar · Full Stack Engineer & AI Specialist',
      sceneLabel: 'Interactive 3D Architectural Emblem — BS Core',
      enable3D: 'Enable Interactive 3D View',
      disable3D: 'Switch to Static SVG Emblem',
      finishLabel: 'Material Finish',
      explodeLabel: 'Exploded View',
      cameraLabel: 'Camera Preset',
      hideControls: 'Hide 3D Controls',
      showControls: 'Show 3D Controls',
    },
    projects: {
      sectionKicker: 'Software Portfolio & Engineering Registry',
      sectionTitle: 'Featured Projects & Case Studies',
      sectionSubtitle:
        'Complete inventory of published software and engineering projects (strictly separated from professional profiles), with transparent link verification status and CV-verified scope.',
      ecommerceTitle: 'E-Commerce Projects',
      ecommerceSubtitle: 'Dedicated e-commerce storefronts and digital stores showcased in the Bandr Solutions portfolio.',
      webAndPlatformsTitle: 'Web, EdTech & Healthcare Projects',
      webAndPlatformsSubtitle: 'Corporate web projects, school management systems, and healthcare platforms.',
      caseStudiesTitle: 'Engineering Case Studies & Systems',
      caseStudiesSubtitle:
        'Comprehensive software engineering systems including accounting ERP, inventory management, and embedded AI response control.',
      visitProject: 'Visit Project',
      viewDetails: 'View Details & Verification',
      viewCaseStudy: 'Read Engineering Case Study',
      noPublicUrlBadge: 'Engineering Case Study — No Public Demo URL',
      illustrativeNotice: 'Illustrative Category Graphic — Not an Application Screenshot',
      genuineScreenshotBadge: 'Genuine Project Screenshot',
      uploadScreenshotCta: 'Manage Images',
      filterLabel: 'Filter by Category:',
      showingCount: 'Showing',
      ofCount: 'of',
      projectsWord: 'projects',
      modalClose: 'Close Modal',
      modalVerificationHeading: '5-Point Link & Verification Status',
      modalUrlSupplied: 'URL Supplied by Owner',
      modalUrlOpened: 'URL Opened Status',
      modalInterfaceObserved: 'Main Interface Observed',
      modalWorkflowsTested: 'Core Workflows Tested',
      modalPublicAccess: 'Public Accessibility',
      modalVerifiedFacts: 'Verified Facts (CV / Owner Specification)',
      modalUnverifiedScope: 'Unverified Scope Boundaries (Transparency Notice)',
      modalEngineeringRole: 'Engineering Contribution',
      modalTechStack: 'Technologies',
      modalTechNotClaimed: 'No unverified technology stack claimed for this external link; only confirmed facts are shown.',
      modalAltUrlLabel: 'Alternative Supplied URL (Flagged for Review):',
      modalGalleryHeading: 'Project Image Gallery',
      modalSourceCodeBtn: 'Source Code / Repository',
    },
    profiles: {
      sectionKicker: 'Freelance & Professional Accounts',
      sectionTitle: 'Professional Profiles & Code Repositories',
      sectionSubtitle:
        'Explore my professional profiles, freelance portfolios, and code repositories across Mostaql, Khamsat, Baaeed, LinkedIn, and GitHub.',
    },
    services: {
      sectionKicker: 'Areas of Work & Capabilities',
      sectionTitle: 'Services Offered',
      sectionSubtitle:
        'Practical web development, e-commerce engineering, UI/UX design, digital product prototyping, and website maintenance services.',
      inquireService: 'Discuss This Service',
    },
    about: {
      sectionKicker: 'Professional Profile & Curriculum Vitae',
      sectionTitle: 'About Bandr Solutions & Saeed Bandar',
      brandIntroHeading: 'About Bandr Solutions',
      cvSummaryHeading: 'Professional Engineering Summary (CV)',
      educationHeading: 'Academic Credentials',
      languagesHeading: 'Languages',
      skillsHeading: 'Complete Technical Skills Inventory (CV Source of Truth)',
      skillsSubtitle:
        'All technical skills are grouped directly from the supplied CVs without fabricated proficiency percentages or unverified claims.',
    },
    contact: {
      sectionKicker: 'Project Inquiries & Direct Channels',
      sectionTitle: 'Get in Touch',
      sectionSubtitle:
        'Connect directly via verified email, LinkedIn, or freelance platforms, or use the validated project brief builder below to prepare your inquiry.',
      directChannelsTitle: 'Verified Direct Contact Channels',
      emailLabel: 'Official Email',
      locationLabel: 'Location & Availability',
      phoneLabel: 'Phone & Direct Call',
      phonePrivacyLabel: 'Public Phone Display Mode:',
      phoneModeClickToCall: 'Click-to-Call / Reveal on Action',
      phoneModeVisible: 'Display Number Directly',
      phoneModeHidden: 'Hide Public Number',
      revealPhoneBtn: 'Reveal Phone Number',
      callNowBtn: 'Call Directly',
      formTitle: 'Validated Project Inquiry Builder',
      formNotice:
        'This form does not fake a backend submission. It validates your input client-side and formats a structured project brief that you can copy with one click or open directly in your email client addressed to bandr246899@gmail.com.',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name or organization',
      emailInputLabel: 'Your Email Address',
      emailPlaceholder: 'name@example.com',
      projectTypeLabel: 'Project Category',
      projectTypePlaceholder: 'Select a project category',
      messageLabel: 'Project Details & Scope',
      messagePlaceholder: 'Describe your project goals, timeline, or reference links...',
      submitPrepareBtn: 'Validate & Format Project Brief',
      copyBriefBtn: 'Copy Formatted Brief',
      copiedSuccess: 'Project brief copied to clipboard!',
      openMailClientBtn: 'Open in Email Client (mailto)',
      resetFormBtn: 'Edit Inquiry Details',
      errors: {
        nameRequired: 'Please enter your name (at least 2 characters).',
        emailInvalid: 'Please enter a valid email address.',
        projectTypeRequired: 'Please select a project category.',
        messageShort: 'Please provide project details (at least 15 characters).',
      },
    },
    footer: {
      navigation: 'Navigation',
      verifiedProjects: 'Projects & Case Studies',
      professionalProfiles: 'Professional Profiles',
      backToTop: 'Back to Top',
      rights: 'All rights reserved.',
      transparencyNote:
        'Portfolio grounded strictly in verified CV facts and owner-supplied project links.',
    },
    notFound: {
      code: '404',
      title: 'Page Not Found',
      description: 'The route you requested does not exist on the Bandr Solutions portfolio.',
      backHome: 'Return to Home Page',
    },
  },
};
