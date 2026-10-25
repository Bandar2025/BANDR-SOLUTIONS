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
        'تم تأكيد تطابق اسم المشروع مع الاسم الفعلي للمنصة (Rufid Markets)، وتم الاحتفاظ بالرابط السحابي ولقطة الشاشة الحقيقية.',
      verificationNotesEn:
        'Confirmed alignment of project identity with Rufid Markets storefront branding; cloud URL and genuine screenshot preserved.',
    },
    genuineScreenshotPath: '/screenshots/novaro.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة مشروع منصة رفيد ماركتس (Rufid Markets) للتجارة الإلكترونية الذكية',
    thumbnailAltEn: 'Rufid Markets AI-Powered E-Commerce & Marketplace Platform storefront preview',
    galleryMediaIds: [],
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
    nameAr: 'FRESH',
    nameEn: 'FRESH',
    category: 'e-commerce',
    categoryLabelAr: 'المتاجر الإلكترونية',
    categoryLabelEn: 'E-Commerce',
    descriptionAr: 'مشروع متجر رقمي ضمن معرض الأعمال.',
    descriptionEn: 'An e-commerce and digital-store project showcased in the portfolio.',
    engineeringContributionAr:
      'بناء وتنسيق واجهة متجر رقمي لعرض المنتجات وتنظيم تجربة التصفح ضمن مشاريع التجارة الإلكترونية.',
    engineeringContributionEn:
      'Design and structuring of a digital store interface presented within the e-commerce portfolio collection.',
    verifiedFactsAr: [
      'مشروع متجر رقمي وإلكتروني مضاف ضمن قائمة مشاريع Bandr Solutions.',
      'الرابط الأساسي مزود مباشرة من المالك.',
    ],
    verifiedFactsEn: [
      'Digital store and e-commerce project included in the Bandr Solutions portfolio inventory.',
      'Canonical URL provided directly by the owner.',
    ],
    unverifiedBoundariesAr:
      'يُعرض المشروع بوصفه المحايد المعتمد دون ادعاء مزايا خلفية أو بوابات دفع غير متحقق منها.',
    unverifiedBoundariesEn:
      'Presented with its neutral owner-supplied description without claiming unverified backend integrations or payment workflows.',
    technologies: [],
    technologiesSource: 'not_claimed',
    url: 'https://fresh-copy-49a90ea2.base44.app/',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://fresh-copy-49a90ea2.base44.app/',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'not_yet_observed',
      workflowsTested: false,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم تزويد رابط المشروع — لم يتم التحقق من الوظائف بعد',
      statusSummaryEn: 'Project URL provided — functionality not yet verified',
      verificationNotesAr:
        'تم إدراج الرابط الرسمي المزود من المالك. يتطلب التحقق من سلوك الواجهة ومسارات الشراء فتح المشروع في جلسة متصفح تفاعلية.',
      verificationNotesEn:
        'Exact owner-supplied URL is linked. Full observation of the main interface and core workflows requires interactive browser verification.',
    },
    genuineScreenshotPath: '/screenshots/fresh.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة مشروع متجر FRESH الرقمي',
    thumbnailAltEn: 'FRESH digital store project preview',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#0EA5E9',
      secondaryHex: '#0284C7',
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
    nameAr: 'باويرا جلوبال ستور — متجر مستلزمات الحيوانات الأليفة',
    nameEn: 'Pawera Global Store — Pet Supplies E-Commerce Platform',
    category: 'e-commerce',
    categoryLabelAr: 'التجارة الإلكترونية ومستلزمات الحيوانات',
    categoryLabelEn: 'E-Commerce & Pet Supplies',
    descriptionAr:
      'Pawera Global Store منصة تجارة إلكترونية متخصصة في مستلزمات الحيوانات الأليفة، تستهدف تنظيم تجربة التسوق وعرض المنتجات وتصنيفاتها ومعلوماتها ضمن متجر رقمي متجاوب.\n\nيركز المشروع على توفير تجربة تسوق منظمة لمنتجات الحيوانات الأليفة، تشمل تصفح المنتجات حسب الفئة، وعرض صفحات تفصيلية تتضمن الصور والأسعار والمعلومات ذات الصلة، إلى جانب أقسام تعريفية وخدمات مساندة للعميل بحسب الوظائف المتاحة في المتجر.\n\nيتطلب تطوير تجربة المتجر الاهتمام بوضوح الصور والأسعار، وسهولة اكتشاف المنتجات، وسلاسة التنقل، واستجابة الواجهة على الهواتف والأجهزة اللوحية والكمبيوتر.\n\nالهدف: توفير متجر رقمي متخصص يجعل اكتشاف مستلزمات الحيوانات الأليفة ومقارنتها والوصول إلى معلوماتها أكثر سهولة وتنظيمًا.',
    descriptionEn:
      'Pawera Global Store — Pet Supplies E-Commerce Platform\n\nPawera Global Store is a specialized e-commerce project focused on presenting pet supplies through a structured and responsive online shopping experience.\n\nThe store is designed to organize product discovery and browsing, with category-based navigation and detailed product pages containing images, prices, and relevant product information, alongside company information and customer-support content where those features are available.\n\nThe project emphasizes clear product presentation, accessible navigation, consistent shopping interactions, and a responsive experience across mobile phones, tablets, and desktop devices.\n\nProject Objective: To provide an organized digital shopping experience for pet supplies, making product discovery and access to product information easier for customers.',
    engineeringContributionAr:
      'تطوير واجهة متجر إلكتروني متجاوبة بـ React و TypeScript و Tailwind CSS وتصنيفات منتجات متخصصة للحيوانات الأليفة.',
    engineeringContributionEn:
      'Developing a responsive e-commerce storefront interface with React, TypeScript, Tailwind CSS, and pet-supplies catalog organization.',
    verifiedFactsAr: [
      'منصة تجارة إلكترونية متخصصة في مستلزمات ورعاية الحيوانات الأليفة.',
      'الرابط المباشر للمتجر متاح ومزود من المالك: https://pawere-global-store-bandr.lovable.app.',
    ],
    verifiedFactsEn: [
      'Specialized e-commerce storefront dedicated to pet supplies and accessories.',
      'Canonical live URL provided by the project owner: https://pawere-global-store-bandr.lovable.app.',
    ],
    unverifiedBoundariesAr:
      'يُعرض المتجر بوصفه المحايد المعتمد دون ادعاء أرقام مبيعات أو إحصائيات شحن أو تقييمات غير متحقق منها.',
    unverifiedBoundariesEn:
      'Presented with factual storefront scope without claiming unverified sales metrics or carrier integration numbers.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'shadcn/ui', 'Lovable'],
    technologiesSource: 'cv_stated',
    url: 'https://pawere-global-store-bandr.lovable.app',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://pawere-global-store-bandr.lovable.app',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'not_yet_observed',
      workflowsTested: false,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم تزويد الرابط الرسمي لمتجر Pawera Global Store — متاح للزيارة المباشرة',
      statusSummaryEn: 'Official Pawera Global Store URL provided — available for direct access',
      verificationNotesAr:
        'الرابط الرسمي https://pawere-global-store-bandr.lovable.app موثق ومعتمد للمعاينة.',
      verificationNotesEn:
        'Canonical URL https://pawere-global-store-bandr.lovable.app preserved and documented.',
    },
    genuineScreenshotPath: '/screenshots/pawere.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة متجر باويرا جلوبال ستور لمستلزمات الحيوانات الأليفة',
    thumbnailAltEn: 'Pawera Global Store Pet Supplies E-Commerce Platform preview',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#3B82F6',
      secondaryHex: '#4F46E5',
      domainCode: 'ECOM-03',
      diagramType: 'global_catalog',
    },
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
    genuineScreenshotPath: '/screenshots/school-management.png',
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
      workflowsTested: false,
      publiclyAccessible: 'ai_studio_applet_requires_session_check',
      statusSummaryAr: 'تم دمج مشروع نظام إدارة المستشفيات مع ساحة الصحة في منصة واحدة موحدة معتمدة',
      statusSummaryEn: 'Hospital Management System successfully merged with Seha Square into a unified platform',
      verificationNotesAr:
        'تم توحيد مشروع ساحة الصحة ونظام إدارة المستشفيات بنجاح بناءً على طلب المالك في كيان رقمي واحد شامل.',
      verificationNotesEn:
        'Successfully merged Seha Square and Hospital Management System into a single comprehensive digital platform per owner request.',
    },
    genuineScreenshotPath: '/screenshots/sehasquare.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة منصة ساحة الصحة ونظام إدارة المستشفيات',
    thumbnailAltEn: 'Seha Square & Hospital Management Platform preview',
    galleryMediaIds: [],
    screenshotCaptionAr: 'لقطة شاشة حقيقية لواجهة منصة ساحة الصحة ونظام إدارة المستشفيات المدمجة',
    screenshotCaptionEn: 'Genuine owner-supplied screenshot of the unified Seha Square & Hospital Management Platform',
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
    nameAr: 'إنجازك التقني — حلول تقنية وأتمتة الأعمال',
    nameEn: 'ENJAZAK TECH — Business Automation & Technology Solutions',
    category: 'web-development',
    categoryLabelAr: 'حلول تقنية وأتمتة الأعمال',
    categoryLabelEn: 'IT Solutions & Business Automation',
    descriptionAr:
      'إنجازك التقني شركة حلول تقنية متكاملة تهدف إلى مساعدة المشاريع التجارية والمؤسسات على بناء بنية تقنية منظمة ومترابطة، من خلال تصميم وتنفيذ الشبكات، وتجهيز أنظمة كاميرات المراقبة، وحلول نقاط البيع والمحاسبة وإدارة المخزون، وتكامل الأنظمة، والدعم الفني والصيانة.\n\nتتبنى الشركة نهجًا متكاملًا يبدأ بدراسة احتياجات العميل وتخطيط الحل التقني المناسب، مرورًا بتجهيز المعدات والتركيب والتهيئة والاختبار، وصولًا إلى تدريب المستخدمين والتسليم وتقديم الدعم بعد التشغيل وفق نطاق الخدمة المتفق عليه.\n\nيمثل الموقع الإلكتروني للشركة قناة رقمية للتعريف بالخدمات والحلول، وعرض المشاريع، وتسهيل التواصل مع العملاء المحتملين وتقديم طلبات الاستشارة وعروض الأسعار.\n\nويتضمن نطاق المنتج الرقمي بوابة إدارية يُفترض أن تدعم إدارة محتوى الموقع والمشاريع والعملاء المحتملين بحسب الوظائف والصلاحيات التي تم تنفيذها والتحقق منها فعليًا.\n\nالهدف: توفير بيئة تقنية متكاملة تقلل الفجوات التنفيذية وتدعم الكفاءة التشغيلية للمؤسسات والشركات.',
    descriptionEn:
      'ENJAZAK TECH — Business Automation & Technology Solutions\n\nEnjazak Tech is a technology solutions company focused on helping businesses and institutions design, deploy, connect, and manage their technology infrastructure.\n\nIts service scope includes network design and installation, internal connectivity, CCTV surveillance systems, point-of-sale solutions, accounting and inventory systems, systems integration, technical support, and maintenance, according to each client\'s requirements.\n\nThe company\'s delivery approach covers requirements assessment, technical planning, equipment selection, installation, configuration, testing, staff training, handover, and post-deployment support within the agreed project scope.\n\nIts corporate website provides a digital presence for presenting services, showcasing projects, explaining sector-specific solutions, and collecting customer inquiries or quotation requests where those capabilities are implemented.\n\nProject Objective: To provide businesses with coordinated technology solutions that reduce vendor fragmentation, connect compatible systems, and support more organized and efficient operations.',
    engineeringContributionAr:
      'تطوير موقع تعريفي احترافي وبوابة إدارة مركزية بـ React و TypeScript و Tailwind CSS ومُستضاف عبر Vercel لعرض خدمات الشبكات والكاميرات ونقاط البيع وأتمتة الأعمال.',
    engineeringContributionEn:
      'Engineering a corporate web portal and administrative management interface built with React, TypeScript, Tailwind CSS, and hosted on Vercel.',
    verifiedFactsAr: [
      'شركة حلول تقنية وأتمتة أعمال متكاملة تشمل الشبكات والكاميرات ونقاط البيع والدعم الفني.',
      'الرابط الرسمي مستضاف ومتاح للزيارة مباشرة عبر منصة Vercel: https://injazak-tech.vercel.app/.',
    ],
    verifiedFactsEn: [
      'Integrated technology and business automation solutions provider offering infrastructure, CCTV, POS, and IT support.',
      'Official live canonical website deployed and accessible on Vercel: https://injazak-tech.vercel.app/.',
    ],
    unverifiedBoundariesAr:
      'الوظائف الداخلية لبوابة الإدارة المساندة تخضع لتأكيد الصلاحيات والوظائف المكتملة في بيئة النشر.',
    unverifiedBoundariesEn:
      'Internal administrative management workflows and lead portal access remain subject to verified user permissions.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'Vercel'],
    technologiesSource: 'cv_stated',
    url: 'https://injazak-tech.vercel.app/',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://injazak-tech.vercel.app/',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'not_yet_observed',
      workflowsTested: false,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم تزويد الرابط الرسمي لمنصة إنجازك التقني — متاح للزيارة المباشرة',
      statusSummaryEn: 'Official ENJAZAK TECH URL provided — available for direct access',
      verificationNotesAr:
        'الرابط الرسمي https://injazak-tech.vercel.app/ موثق ومعتمد للمعاينة المباشرة.',
      verificationNotesEn:
        'Canonical URL https://injazak-tech.vercel.app/ preserved and documented.',
    },
    genuineScreenshotPath: '/screenshots/injazak-tech.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة موقع إنجازك التقني لحلول وأتمتة الأعمال',
    thumbnailAltEn: 'ENJAZAK TECH Business Automation & Technology Solutions preview',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#3B82F6',
      secondaryHex: '#1E40AF',
      domainCode: 'WEB-06',
      diagramType: 'corporate_web',
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
    genuineScreenshotPath: '/screenshots/lumen-yemeni.png',
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
    nameAr: 'FIREAI — نظام التحكم الذكي في اكتشاف الحرائق والاستجابة لها',
    nameEn: 'FIREAI — Intelligent Fire Detection, Monitoring & Suppression System',
    category: 'ai-iot',
    categoryLabelAr: 'الذكاء الاصطناعي والأنظمة المدمجة (AI & IoT)',
    categoryLabelEn: 'AI & Embedded Systems Prototype',
    descriptionAr:
      'FIREAI مشروع تخرج يهدف إلى تطوير نظام ذكي لاكتشاف الحرائق ومراقبة الظروف المحيطة ودعم الاستجابة الآلية، من خلال الجمع بين الرؤية الحاسوبية والذكاء الاصطناعي والحساسات والأنظمة المدمجة.\n\nيعتمد النموذج الأولي على نموذج رؤية حاسوبية مدرب لاكتشاف الحريق في الصور، وكاميرا ESP32-CAM لالتقاط المشاهد، وأردوينو متصل بالحساسات والمكونات الإلكترونية، إلى جانب منصة برمجية تعمل على الكمبيوتر لمعالجة الصور ومتابعة بيانات النظام.\n\nتتمثل الفكرة الهندسية في دمج نتائج تحليل الصور مع قراءات الحساسات ضمن آلية لاتخاذ القرار، بما يتيح تطوير الكشف عن مؤشرات الحريق، وإصدار التنبيهات، ودعم التحكم في آلية الاستجابة وفق شروط أمان محددة.\n\nشمل التطوير السابق تدريب نماذج لاكتشاف الحريق، ومقارنة عدد من النماذج على المعالج المركزي (CPU)، وتحليل زمن الاستدلال ومعدل الإطارات.\n\nالهدف: بناء أساس تقني يجمع بين الذكاء الاصطناعي والأنظمة المدمجة للمساعدة في الكشف المبكر عن الحرائق وتنسيق الاستجابة لها.',
    descriptionEn:
      'FIREAI — Intelligent Fire Detection, Monitoring & Suppression System\n\nFIREAI is an AI and embedded-systems graduation project focused on developing an intelligent fire detection and response-control system by combining computer vision, environmental sensors, embedded electronics, and computer-based software.\n\nThe prototype combines a trained fire detection model, an ESP32-CAM camera, an Arduino controller connected to sensors and electronic components, and a computer application for image processing and system monitoring.\n\nThe intended architecture combines visual detection results with sensor readings in a decision process designed to identify potential fire events, generate alerts, and support response-control actions under defined safety conditions.\n\nPrevious development work included training and evaluating fire detection models, testing CPU inference performance, analyzing confidence thresholds, and assessing detection behavior on image and video inputs.\n\nProject Objective: To establish a practical AI and embedded-systems foundation for early fire detection and coordinated response.',
    engineeringContributionAr:
      'تطوير نموذج أولي يربط نماذج الرؤية الحاسوبية (Ultralytics YOLO, OpenCV, PyTorch) بكاميرا ESP32-CAM ومتحكم أردوينو وحساسات بيئية لمعالجة الصور وإصدار التنبيهات.',
    engineeringContributionEn:
      'Developing an AI/IoT graduation prototype integrating Ultralytics YOLO, OpenCV, and PyTorch with ESP32-CAM and Arduino microcontrollers for real-time visual detection, sensor telemetry, and alerting.',
    verifiedFactsAr: [
      'مشروع تخرج موثق يجمع بين الذكاء الاصطناعي والرؤية الحاسوبية والأنظمة المدمجة.',
      'التقنيات المستخدمة: Python, PyTorch, Ultralytics YOLO, OpenCV, NumPy, Arduino, ESP32-CAM, JSON.',
      'نتائج القياس المعياري السابقة على CPU: YOLOv8n (109.25ms / 8.70 FPS)، YOLO11n (123.28ms / 7.64 FPS)، و SAINet v11.1 (596.79ms / 1.67 FPS).',
    ],
    verifiedFactsEn: [
      'Documented graduation project integrating computer vision, AI, and embedded IoT hardware.',
      'Verified stack: Python, PyTorch, Ultralytics YOLO, OpenCV, NumPy, Arduino, ESP32-CAM, JSON.',
      'Recorded CPU benchmark results: YOLOv8n (109.25 ms / 8.70 FPS), YOLO11n (123.28 ms / 7.64 FPS), SAINet v11.1 (596.79 ms / 1.67 FPS).',
    ],
    unverifiedBoundariesAr:
      'نموذج أولي هندسي؛ لا يُقدم كنظام إطفاء آلي صناعي معتمد دون اختبارات أمان في بيئة حقيقية.',
    unverifiedBoundariesEn:
      'Engineering prototype; does not claim industrial safety certification or fully automated live fire suppression without controlled site validation.',
    technologies: ['Python', 'PyTorch', 'Ultralytics YOLO', 'OpenCV', 'NumPy', 'Arduino', 'ESP32-CAM', 'JSON'],
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
      statusSummaryAr: 'مشروع تخرج ونموذج أولي هندسي — تم تقييم أداء النماذج ومقارنتها على CPU',
      statusSummaryEn: 'Graduation Project Prototype — CPU Model Benchmarking & Integration Evaluated',
      verificationNotesAr:
        'دراسة حالة موثقة لنموذج تخرج أولي لاكتشاف الحرائق بالذكاء الاصطناعي والأنظمة المدمجة.',
      verificationNotesEn:
        'Documented graduation project case study for AI fire detection and embedded IoT control.',
    },
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: 'مخطط دراسة حالة مشروع FIREAI لاكتشاف الحرائق بالذكاء الاصطناعي والأنظمة المدمجة',
    thumbnailAltEn: 'FIREAI Intelligent Fire Detection & Embedded Suppression System case study diagram',
    galleryMediaIds: [],
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
    technologies: [],
    technologiesSource: 'not_claimed',
    url: 'https://ai.studio/apps/c27cded8-c97c-4b53-9592-d6b2abfad8c6?fullscreenApplet=true',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://ai.studio/apps/c27cded8-c97c-4b53-9592-d6b2abfad8c6?fullscreenApplet=true',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'not_yet_observed',
      workflowsTested: false,
      publiclyAccessible: 'ai_studio_applet_requires_session_check',
      statusSummaryAr: 'تم تزويد رابط المشروع — الوصف عام وبانتظار مراجعة المالك للوحدات الداخلية',
      statusSummaryEn: 'Project URL provided — general description flagged for owner review',
      verificationNotesAr:
        'تطبيق Google AI Studio قد يتطلب إعادة توجيه أو تسجيل دخول في المتصفح لمعاينة الواجهة الكاملة؛ يُستخدم الرسم التوضيحي الصادق للفئة الصحية إلى حين رفع لقطة شاشة حقيقية من المالك.',
      verificationNotesEn:
        'Google AI Studio application may require browser sign-in or redirect to inspect the full interface; uses an honest healthcare category illustration until the owner uploads a genuine screenshot.',
    },
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: 'رسم توضيحي لمشروع نظام إدارة المستشفيات',
    thumbnailAltEn: 'Hospital Management System category illustration',
    galleryMediaIds: [],
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
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: 'رسم توضيحي لمنصة تاساور للتوأم الرقمي والذكاء التشغيلي الصناعي',
    thumbnailAltEn: 'Tasour Digital Twin Platform schematic illustration',
    galleryMediaIds: [],
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
    platformNameEn: 'LinkedIn — Saeed Bandar',
    roleLabelAr: 'التواصل المهني والشبكة الاحترافية',
    roleLabelEn: 'Professional Network',
    handle: 'saeed-bandar',
    url: 'https://www.linkedin.com/in/saeed-bandar',
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
