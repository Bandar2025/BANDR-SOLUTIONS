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

export interface ServiceItem {
  id: string;
  index: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  scopePointsAr: string[];
  scopePointsEn: string[];
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
    slug: 'novaro-ecommerce',
    displayOrder: 1,
    featured: true,
    status: 'published',
    nameAr: 'NOVARO',
    nameEn: 'NOVARO',
    category: 'e-commerce',
    categoryLabelAr: 'المتاجر الإلكترونية',
    categoryLabelEn: 'E-Commerce',
    descriptionAr: 'مشروع متجر إلكتروني ضمن أعمال Bandr Solutions.',
    descriptionEn: 'A dedicated e-commerce project presented as part of the Bandr Solutions portfolio.',
    engineeringContributionAr:
      'تطوير وتقديم واجهة متجر إلكتروني مخصصة لعرض المنتجات وتجربة التسوق الرقمي ضمن معرض أعمال Bandr Solutions.',
    engineeringContributionEn:
      'Development and presentation of a dedicated digital storefront experience showcased within the Bandr Solutions portfolio.',
    verifiedFactsAr: [
      'مصنف من قِبل المالك كمشروع متجر إلكتروني (وليس نظام ERP).',
      'الرابط المباشر مزود من قِبل مالك المشروع.',
    ],
    verifiedFactsEn: [
      'Identified by the project owner as a dedicated e-commerce store (not an ERP system).',
      'Canonical URL supplied directly by the project owner.',
    ],
    unverifiedBoundariesAr:
      'لا يتم ادعاء تكاملات دفع أو شحن أو أعداد منتجات محددة؛ كما تم وضع علامة مراجعة للمالك للتأكد من تطابق عنوان الواجهة الظاهر على الرابط مع اسم العلامة NOVARO.',
    unverifiedBoundariesEn:
      'Specific payment gateways, shipping integrations, or inventory counts are not claimed. Flagged for manual owner review because the storefront title returned during initial link inspection appeared different from the NOVARO label.',
    technologies: [],
    technologiesSource: 'not_claimed',
    url: 'https://novaro-161052207749.europe-west2.run.app/',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://novaro-161052207749.europe-west2.run.app/',
      urlOpened: 'opened_with_branding_note',
      interfaceObserved: 'storefront_title_differs_flagged',
      workflowsTested: false,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم تزويد رابط المشروع — لم يتم التحقق من الوظائف بعد (ملاحظة مراجعة الاسم)',
      statusSummaryEn: 'Project URL provided — functionality not yet verified (branding review flagged)',
      verificationNotesAr:
        'الرابط المقدم محفوظ كما هو. لوحظ خلال الفحص الأولي أن عنوان المتجر الظاهر قد يختلف عن اسم NOVARO، لذا تم إبقاء الاسم المعتمد من المالك مع تمييزه للمراجعة اليدوية.',
      verificationNotesEn:
        'Owner-supplied URL preserved unchanged. Initial link inspection returned a storefront title differing from the NOVARO name; label is preserved pending manual owner confirmation.',
    },
    genuineScreenshotPath: '/screenshots/novaro.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة مشروع متجر NOVARO الإلكتروني',
    thumbnailAltEn: 'NOVARO e-commerce project preview',
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
    nameAr: 'Pawere Global Store',
    nameEn: 'Pawere Global Store',
    category: 'e-commerce',
    categoryLabelAr: 'المتاجر الإلكترونية',
    categoryLabelEn: 'E-Commerce',
    descriptionAr: 'مشروع متجر إلكتروني ضمن قسم التجارة الرقمية.',
    descriptionEn: 'A global-store project included in the e-commerce portfolio.',
    engineeringContributionAr:
      'تطوير واجهة متجر إلكتروني حديثة ضمن قسم التجارة الرقمية في معرض أعمال Bandr Solutions.',
    engineeringContributionEn:
      'Development of a global e-commerce storefront interface within the digital commerce portfolio.',
    verifiedFactsAr: [
      'مدرج ضمن قسم المتاجر الإلكترونية لـ Bandr Solutions.',
      'الرابط المباشر مزود من قِبل المالك.',
    ],
    verifiedFactsEn: [
      'Included in the Bandr Solutions e-commerce portfolio section.',
      'Canonical URL supplied by the project owner.',
    ],
    unverifiedBoundariesAr:
      'لا يتم ادعاء أعداد منتجات أو طرق دفع أو تكاملات شحن أو إدارة طلبات غير مؤكدة.',
    unverifiedBoundariesEn:
      'Does not claim unverified product counts, payment methods, shipping integrations, or order-management capabilities.',
    technologies: [],
    technologiesSource: 'not_claimed',
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
      statusSummaryAr: 'تم تزويد رابط المشروع — لم يتم التحقق من الوظائف بعد',
      statusSummaryEn: 'Project URL provided — functionality not yet verified',
      verificationNotesAr:
        'الرابط المزود متاح للزيارة المباشرة؛ لم يتم ادعاء اختبار مسارات الطلبات الداخلية دون فحص تفاعلي.',
      verificationNotesEn:
        'Owner-supplied URL is linked directly; internal checkout and catalog workflows remain marked as not yet verified.',
    },
    genuineScreenshotPath: '/screenshots/pawere.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة مشروع متجر Pawere Global Store',
    thumbnailAltEn: 'Pawere Global Store project preview',
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
    slug: 'integrated-school-management-system',
    displayOrder: 4,
    featured: true,
    status: 'published',
    nameAr: 'نظام إدارة المدارس المتكامل',
    nameEn: 'Integrated School Management System',
    category: 'education-tech',
    categoryLabelAr: 'تقنيات التعليم وإدارة المدارس',
    categoryLabelEn: 'Education Technology / School Management',
    descriptionAr:
      'نظام رقمي متكامل لإدارة المدارس، يهدف إلى تنظيم العمليات المدرسية وتسهيل الوصول إلى الخدمات والبيانات التعليمية من خلال منصة موحدة.',
    descriptionEn:
      'An integrated digital school management platform designed to organize school operations and streamline access to educational information and services through a unified system.',
    engineeringContributionAr:
      'تصميم وبناء منصة رقمية موحدة لتنظيم العمليات الإدارية والتعليمية وتسهيل الوصول إلى البيانات والخدمات المدرسية.',
    engineeringContributionEn:
      'Design and implementation of a unified educational management platform structuring school workflows and information access.',
    verifiedFactsAr: [
      'مشروع تقنيات تعليم (EdTech) مضاف بالاسم والوصف والرابط الرسمي من قِبل المالك.',
      'مستضاف كتطبيق ويب تفاعلي عبر منصة Google AI Studio.',
    ],
    verifiedFactsEn: [
      'Education Technology project added with exact bilingual title, description, and URL provided by the owner.',
      'Hosted as an interactive web application on Google AI Studio.',
    ],
    unverifiedBoundariesAr:
      'لا يتم تسمية وحدات فرعية تفصيلية (مثل الحضور، الدرجات، الرسوم، أو بوابات أولياء الأمور) أو ادعاء مقاييس أداء قبل التحقق المباشر من الواجهة الفعلية.',
    unverifiedBoundariesEn:
      'Specific sub-modules (such as attendance, grading, fee collection, or parent portals) and institutional deployment metrics are not claimed prior to direct interface inspection.',
    technologies: [],
    technologiesSource: 'not_claimed',
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
      statusSummaryAr: 'تم تزويد رابط المشروع — لم يتم التحقق من الوظائف بعد',
      statusSummaryEn: 'Project URL provided — functionality not yet verified',
      verificationNotesAr:
        'تطبيقات Google AI Studio قد تتطلب إعادة توجيه أو تشغيل JavaScript أو تسجيل دخول في المتصفح لعرض الواجهة الكاملة.',
      verificationNotesEn:
        'Google AI Studio applications may require browser redirects, client-side JavaScript execution, or authentication to inspect the live interface.',
    },
    genuineScreenshotPath: '/screenshots/school-management.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة نظام إدارة المدارس المتكامل',
    thumbnailAltEn: 'Integrated School Management System preview',
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
    slug: 'sehasquare-healthcare-platform',
    displayOrder: 5,
    featured: true,
    status: 'published',
    nameAr: 'ساحة الصحة — SehaSquare',
    nameEn: 'SehaSquare — ساحة الصحة',
    category: 'healthcare-tech',
    categoryLabelAr: 'التقنيات الصحية وإدارة المواعيد',
    categoryLabelEn: 'Healthcare Technology',
    descriptionAr:
      'منصة ذكية للرعاية الصحية تهدف إلى تسهيل حجز المواعيد الطبية وتنظيم الوصول إلى الخدمات الصحية، مع توفير النصائح والإرشادات التوعوية للمرضى. صُممت بواجهة عصرية تدعم تجربة استخدام واضحة وسلسة للمرضى ومقدمي الخدمات الطبية.',
    descriptionEn:
      'SehaSquare is a modern healthcare platform designed to simplify medical appointment booking and improve access to healthcare services, with educational health guidance for patients through a contemporary, user-friendly interface.',
    engineeringContributionAr:
      'تطوير واجهة منصة صحية باللغة العربية تركز على تبسيط حجز المواعيد الطبية وتقديم الإرشادات الصحية التوعوية بتجربة استخدام واضحة.',
    engineeringContributionEn:
      'Development of a patient-focused healthcare web interface streamlining appointment booking and health awareness guidance.',
    verifiedFactsAr: [
      'الاسم المعتمد بالعربية "ساحة الصحة" وبالإنجليزية "SehaSquare".',
      'زوّد المالك لقطة شاشة حقيقية لواجهة الصفحة الرئيسية العربية للمنصة.',
      'الرابط الرسمي المعتمد مزود من قِبل المالك على منصة Google AI Studio.',
    ],
    verifiedFactsEn: [
      'Official bilingual brand: "ساحة الصحة" (Arabic) and "SehaSquare" (English).',
      'Owner supplied a genuine screenshot of the Arabic healthcare landing page.',
      'Exact canonical URL provided by the owner on Google AI Studio.',
    ],
    unverifiedBoundariesAr:
      'لا يتم ادعاء وجود سجلات صحية إلكترونية شاملة للمستشفيات (EHR)، أو بوابات دفع طبية، أو تشخيص بالذكاء الاصطناعي الطبي، أو أعداد مرضى ومستشفيات غير موثقة.',
    unverifiedBoundariesEn:
      'Does not claim hospital-wide EHR deployments, payment processing, certified medical AI diagnostics, or unverified patient/hospital counts.',
    technologies: [],
    technologiesSource: 'not_claimed',
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
      statusSummaryAr: 'تم تزويد رابط المشروع ولقطة شاشة المالك — لم يتم اختبار المسارات التفاعلية بعد',
      statusSummaryEn: 'Project URL & owner screenshot supplied — interactive workflows not yet verified',
      verificationNotesAr:
        'الرابط المعتمد (https://ai.studio/apps/e6164f67-bf4a-405d-92d1-b9ecdf04a25f) محفوظ بدقة. يدعم النظام عرض لقطة الشاشة الحقيقية لصفحة "ساحة الصحة" العربية عبر المسار /screenshots/sehasquare.png أو عبر لوحة التحكم الخاصة (/admin).',
      verificationNotesEn:
        'Exact owner-supplied canonical URL (https://ai.studio/apps/e6164f67-bf4a-405d-92d1-b9ecdf04a25f) is preserved. Configured to render the genuine SehaSquare screenshot from /screenshots/sehasquare.png or via the private /admin image manager.',
    },
    genuineScreenshotPath: '/screenshots/sehasquare.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'لقطة شاشة حقيقية لواجهة منصة ساحة الصحة (SehaSquare) العربية',
    thumbnailAltEn: 'Genuine owner-supplied screenshot of the SehaSquare Arabic healthcare landing page',
    galleryMediaIds: [],
    screenshotCaptionAr: 'لقطة شاشة حقيقية لواجهة منصة ساحة الصحة (SehaSquare) العربية المزودة من المالك',
    screenshotCaptionEn: 'Genuine owner-supplied screenshot of the SehaSquare Arabic healthcare landing page',
    illustrativeTheme: {
      accentHex: '#0D9488',
      secondaryHex: '#2563EB',
      domainCode: 'HEALTH-05',
      diagramType: 'healthcare_portal',
    },
  },
  {
    id: 'injazak-tech',
    slug: 'injazak-tech-corporate',
    displayOrder: 6,
    featured: true,
    status: 'published',
    nameAr: 'Injazak Tech Corporate Website',
    nameEn: 'Injazak Tech Corporate Website',
    category: 'web-development',
    categoryLabelAr: 'مشاريع الويب',
    categoryLabelEn: 'Web Development',
    descriptionAr: 'مشروع ويب معروض ضمن أعمال Bandr Solutions.',
    descriptionEn: 'A web project showcased in the Bandr Solutions portfolio.',
    engineeringContributionAr:
      'تطوير موقع ويب تعريفي واحترافي لعرض الخدمات والمشاريع التقنية ضمن أعمال تطوير الويب.',
    engineeringContributionEn:
      'Development of a corporate technology web presence showcased as part of the Bandr Solutions web portfolio.',
    verifiedFactsAr: [
      'مشروع تطوير ويب مستضاف على Vercel ومزود برابط مباشر من المالك.',
    ],
    verifiedFactsEn: [
      'Web development project hosted on Vercel with an owner-supplied canonical URL.',
    ],
    unverifiedBoundariesAr:
      'يُقدم المشروع بوصفه المحايد دون ادعاء نتائج تجارية أو أرقام عملاء غير موثقة.',
    unverifiedBoundariesEn:
      'Presented with a factual description without claiming unverified client metrics or business outcomes.',
    technologies: [],
    technologiesSource: 'not_claimed',
    url: 'https://injazak-tech.vercel.app/#projects',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: 'https://injazak-tech.vercel.app/#projects',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'not_yet_observed',
      workflowsTested: false,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم تزويد رابط المشروع — لم يتم التحقق من الوظائف بعد',
      statusSummaryEn: 'Project URL provided — functionality not yet verified',
      verificationNotesAr:
        'الرابط يشير مباشرة إلى قسم المشاريع في موقع Injazak Tech كما زوّده المالك.',
      verificationNotesEn:
        'Links directly to the owner-supplied Injazak Tech URL.',
    },
    genuineScreenshotPath: '/screenshots/injazak-tech.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة مشروع موقع Injazak Tech التقني',
    thumbnailAltEn: 'Injazak Tech corporate website preview',
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
    nameAr: 'Lumen of Yemeni AI Platform',
    nameEn: 'Lumen of Yemeni AI Platform',
    category: 'web-development',
    categoryLabelAr: 'مشاريع الويب ومنصات الذكاء الاصطناعي',
    categoryLabelEn: 'Web Development',
    descriptionAr: 'مشروع منصة ويب وذكاء اصطناعي معروض ضمن أعمال Bandr Solutions.',
    descriptionEn: 'A web and AI platform project showcased in the Bandr Solutions portfolio.',
    engineeringContributionAr:
      'تطوير واجهة منصة ويب حديثة ضمن مشاريع Bandr Solutions مع توحيد البطاقة التعريفية لمنع تكرار الروابط.',
    engineeringContributionEn:
      'Web platform interface showcased in the portfolio, consolidated into a single canonical entry to avoid duplicate cards.',
    verifiedFactsAr: [
      'يعتمد الرابط الرسمي المعتمد https://lumen-of-yemeni.vercel.app/ في بطاقة مشروع واحدة موحدة.',
      'مشروع منصة ويب وذكاء اصطناعي مستضاف على Vercel ومزود مباشرة من قِبل المالك.',
    ],
    verifiedFactsEn: [
      'Uses the canonical owner-supplied URL https://lumen-of-yemeni.vercel.app/ in a single consolidated project card.',
      'Web and AI platform project hosted on Vercel and supplied directly by the owner.',
    ],
    unverifiedBoundariesAr:
      'لا يتم إنشاء بطاقات مكررة للمشروع، ولا يتم ادعاء ميزات ذكاء اصطناعي خلفية غير متحقق منها.',
    unverifiedBoundariesEn:
      'Maintains a single canonical project record and does not claim unverified backend AI capabilities.',
    technologies: [],
    technologiesSource: 'not_claimed',
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
      statusSummaryAr: 'تم تزويد الرابط الرسمي للمشروع — متاح للزيارة المباشرة',
      statusSummaryEn: 'Canonical project URL provided — available for direct visit',
      verificationNotesAr:
        'تم اعتماد الرابط الرسمي المحدث https://lumen-of-yemeni.vercel.app/ في سجل موحد للمشروع.',
      verificationNotesEn:
        'Updated to the canonical URL https://lumen-of-yemeni.vercel.app/ in a single unified project entry.',
    },
    genuineScreenshotPath: '/screenshots/lumen-yemeni.png',
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة منصة Lumen of Yemeni',
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
    slug: 'smart-accounting-warehouse-management',
    displayOrder: 8,
    featured: true,
    status: 'published',
    nameAr: 'نظام المحاسبة وإدارة المخزون والمستودعات',
    nameEn: 'Accounting & Inventory Management System',
    category: 'enterprise-accounting',
    categoryLabelAr: 'الأنظمة المحاسبية وإدارة المستودعات',
    categoryLabelEn: 'Enterprise Accounting',
    descriptionAr:
      'منصة هندسية متكاملة لإدارة العمليات المحاسبية التجارية والفواتير ودفاتر الأستاذ وحركة المخزون والمستودعات مع تقارير مهيكلة وتحسين استعلامات قواعد البيانات.',
    descriptionEn:
      'An enterprise accounting and inventory management system for commercial invoicing, ledger workflows, warehouse stock control, structured reporting, transactional data integrity, and MongoDB aggregation optimization.',
    engineeringContributionAr:
      'بناء معمارية Full-Stack باستخدام React.js و Node.js و Express.js و MongoDB لضبط القيود المحاسبية والفواتير وحركة المخزون وتحسين أداء استعلامات التجميع (Aggregation Pipelines).',
    engineeringContributionEn:
      'Full-stack engineering with React.js, Node.js, Express.js, and MongoDB governing invoicing, ledger workflows, warehouse stock records, transactional integrity, and optimized MongoDB aggregation pipelines.',
    verifiedFactsAr: [
      'موثق في السيرة الذاتية الرسمية للمهندس سعيد بندر ومزود برابط المشروع العام المباشر.',
      'التقنيات المعتمدة في السيرة الذاتية: React.js, Node.js, Express.js, MongoDB.',
      'النطاق الهندسي يشمل: الفواتير ودفاتر الأستاذ التجارية، بيانات المخزون والمستودعات، التقارير المهيكلة، سلامة البيانات التبادلية، وتحسين استعلامات MongoDB Aggregation.',
    ],
    verifiedFactsEn: [
      'Documented in Saeed Ismail Mohammed Bandar’s official CV and linked to the owner-supplied public application URL.',
      'CV-verified stack: React.js, Node.js, Express.js, MongoDB.',
      'CV-verified engineering scope: commercial accounting invoices and ledger workflows, inventory and warehouse data, structured reporting, transactional data integrity, and MongoDB aggregation query optimization.',
    ],
    unverifiedBoundariesAr:
      'الرابط المباشر https://accounting-blueprint-fix.lovable.app/invoices مزود من المالك؛ لا يتم ادعاء أرقام مالية أو إيرادات عملاء غير موثقة.',
    unverifiedBoundariesEn:
      'Direct public URL https://accounting-blueprint-fix.lovable.app/invoices supplied by the owner; no fabricated client revenue metrics are claimed.',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
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
      statusSummaryAr: 'تم تزويد الرابط الرسمي للنظام المحاسبي — متاح للزيارة ودراسة الحالة',
      statusSummaryEn: 'Public Accounting & Inventory System URL provided — available for live visit & case study',
      verificationNotesAr:
        'يرتبط المشروع بالرابط المباشر https://accounting-blueprint-fix.lovable.app/invoices مع الاحتفاظ بتفاصيل المعمارية الهندسية الموثقة في السيرة الذاتية.',
      verificationNotesEn:
        'Linked directly to https://accounting-blueprint-fix.lovable.app/invoices while preserving all CV-verified architectural and technology details.',
    },
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: 'معاينة نظام المحاسبة وإدارة المخزون والمستودعات',
    thumbnailAltEn: 'Accounting & Inventory Management System preview',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#2563EB',
      secondaryHex: '#0F172A',
      domainCode: 'ERP-08',
      diagramType: 'accounting_ledger',
    },
    caseStudy: {
      problemStatementAr:
        'تحتاج المنشآت التجارية إلى ربط دقيق بين القيود المحاسبية المالية وحركة الأصناف في المستودعات لمنع التضارب في البيانات وتسريع استخراج التقارير المالية والمخزنية.',
      problemStatementEn:
        'Commercial operations require strict synchronization between financial ledger entries and warehouse stock movements to preserve transactional integrity and generate fast, structured reports.',
      architectureLayersAr: [
        'طبقة الواجهة الأمامية (React.js): واجهات إدخال القيود المحاسبية، متابعة أرصدة المخزون، وعرض التقارير المهيكلة.',
        'طبقة الخدمات وواجهات البرمجة (Node.js & Express.js): التحقق من صحة المعاملات المالية والمخزنية وضمان تكامل البيانات.',
        'طبقة قاعدة البيانات (MongoDB): هيكلة سجلات الأستاذ والمستودعات وتنفيذ Aggregation Pipelines لتحليل البيانات بكفاءة.',
      ],
      architectureLayersEn: [
        'Frontend Layer (React.js): Interactive views for commercial accounting ledger entry, warehouse stock tracking, and structured reporting.',
        'API & Service Layer (Node.js & Express.js): RESTful endpoints enforcing transactional data validation and ledger-inventory consistency.',
        'Database Layer (MongoDB): Document schemas for ledgers and inventory paired with optimized MongoDB aggregation pipelines.',
      ],
      keyEngineeringContributionsAr: [
        'تنظيم سير عمل دفاتر الأستاذ التجارية (Commercial Accounting Ledger Workflows).',
        'إدارة بيانات المخزون والمستودعات وربطها بالتقارير المهيكلة.',
        'ضمان سلامة البيانات التبادلية (Transactional Data Integrity) عبر عمليات الإدخال والتحديث.',
        'تحسين أداء استعلامات التجميع في MongoDB (Aggregation Query Optimization) لتسريع التقارير.',
      ],
      keyEngineeringContributionsEn: [
        'Implemented commercial accounting ledger workflows and structured financial reporting.',
        'Structured inventory and warehouse data models for accurate stock tracking.',
        'Enforced transactional data integrity across accounting and inventory operations.',
        'Optimized MongoDB aggregation queries for responsive reporting.',
      ],
      dataAndValidationNotesAr:
        'توثيق هندسي مبني على السيرة الذاتية الرسمية؛ لا يتضمن لقطات شاشة مصطنعة أو روابط تجريبية مختلقة.',
      dataAndValidationNotesEn:
        'Engineering case study grounded strictly in CV facts; contains no fabricated screenshots or invented demo URLs.',
    },
  },
  {
    id: 'ai-fire-automation-embedded',
    slug: 'ai-fire-automation-embedded-detection',
    displayOrder: 9,
    featured: true,
    status: 'published',
    nameAr: 'نظام الذكاء الاصطناعي لاكتشاف الحرائق والأتمتة المدمجة',
    nameEn: 'AI Fire Automation & Embedded Detection Solution',
    category: 'ai-iot',
    categoryLabelAr: 'الذكاء الاصطناعي والأنظمة المدمجة (AI & IoT)',
    categoryLabelEn: 'AI & IoT',
    descriptionAr:
      'حل هندسي يجمع بين الرؤية الحاسوبية في الوقت الفعلي والأنظمة المدمجة لاكتشاف الحرائق عبر نماذج تعلم عميق مدربة خصيصاً، مع القياس عن بُعد والتنبيه البيئي وتقليل الإنذارات الكاذبة.',
    descriptionEn:
      'An integrated computer-vision and embedded IoT solution combining custom-trained deep learning models with microcontroller telemetry and environmental alerts to detect fire in real time while reducing false positives.',
    engineeringContributionAr:
      'تطوير وتدريب نماذج الرؤية الحاسوبية باستخدام Python و TensorFlow و Keras وربطها بمتحكمات ESP32 و Arduino لإرسال البيانات والتنبيهات البيئية والتحقق من دقة النماذج.',
    engineeringContributionEn:
      'Trained custom computer-vision models using Python, TensorFlow, and Keras and integrated them with ESP32 and Arduino hardware for real-time detection, telemetry, environmental alerting, and false-positive reduction.',
    verifiedFactsAr: [
      'موثق بالكامل في السيرة الذاتية الرسمية للمهندس سعيد بندر.',
      'التقنيات المعتمدة في السيرة الذاتية: Python, TensorFlow, Keras, ESP32, Arduino.',
      'النطاق الهندسي يشمل: الرؤية الحاسوبية بالوقت الفعلي، تدريب نماذج مخصصة، النشر على الأنظمة المدمجة، القياس عن بُعد (Telemetry)، التنبيهات البيئية، والتحقق من النماذج لتقليل الإنذارات الكاذبة.',
    ],
    verifiedFactsEn: [
      'Documented directly in Saeed Ismail Mohammed Bandar’s official CV.',
      'CV-verified stack: Python, TensorFlow, Keras, ESP32, Arduino.',
      'CV-verified engineering scope: real-time computer vision, custom-trained models, embedded deployment, telemetry, environmental alerts, and model validation to reduce false positives.',
    ],
    unverifiedBoundariesAr:
      'مشروع أنظمة مدمجة ورؤية حاسوبية بدون رابط ويب عام؛ يُعرض كدراسة حالة هندسية موثقة دون اختلاق مقاييس دقة مئوية أو شهادات سلامة صناعية غير مذكورة.',
    unverifiedBoundariesEn:
      'Hardware/CV engineering project with no public web demo URL; presented as a documented engineering case study without fabricating numerical accuracy percentages or industrial certifications.',
    technologies: ['Python', 'TensorFlow', 'Keras', 'ESP32', 'Arduino'],
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
      statusSummaryAr: 'دراسة حالة هندسية موثقة في السيرة الذاتية — مشروع أنظمة مدمجة وذكاء اصطناعي',
      statusSummaryEn: 'CV-Documented Engineering Case Study — Embedded AI & IoT System',
      verificationNotesAr:
        'مبني بالكامل على بيانات السيرة الذاتية المعتمدة دون ادعاء روابط عرض خارجية.',
      verificationNotesEn:
        'Grounded exclusively in verified CV documentation with no fabricated external demo links.',
    },
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: 'مخطط دراسة حالة نظام الذكاء الاصطناعي لاكتشاف الحرائق والأتمتة المدمجة',
    thumbnailAltEn: 'AI Fire Automation & Embedded Detection Solution case study diagram',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#7C3AED',
      secondaryHex: '#2563EB',
      domainCode: 'AIIOT-09',
      diagramType: 'fire_cv_iot',
    },
    caseStudy: {
      problemStatementAr:
        'تتطلب أنظمة الإنذار المبكر عن الحرائق دمج الرؤية الحاسوبية بالوقت الفعلي مع الاستشعار المدمج لتسريع الاستجابة وتقليل الإنذارات الكاذبة الناتجة عن الإضاءة أو الظروف البيئية.',
      problemStatementEn:
        'Early fire detection systems require combining real-time computer vision with embedded hardware telemetry and rigorous model validation to trigger timely alerts while minimizing false positives.',
      architectureLayersAr: [
        'طبقة الرؤية الحاسوبية والتعلم العميق (Python, TensorFlow, Keras): تدريب نماذج مخصصة للتعرف البصري بالوقت الفعلي والتحقق من الأداء لتقليل الإيجابيات الكاذبة.',
        'طبقة التحكم والأنظمة المدمجة (ESP32 & Arduino): ربط المستشعرات، قراءة بيانات القياس عن بُعد (Telemetry)، وتنفيذ أوامر الأتمتة والتنبيه.',
        'طبقة التنبيه والمراقبة البيئية: إصدار إشعارات واستجابات فورية عند تحقق شروط الكشف.',
      ],
      architectureLayersEn: [
        'Computer Vision & Model Layer (Python, TensorFlow, Keras): Custom-trained deep learning models for real-time visual detection and validation workflows to reduce false positives.',
        'Embedded Hardware & Telemetry Layer (ESP32 & Arduino): Microcontroller integration handling sensor telemetry and hardware actuation.',
        'Environmental Alerting Pipeline: Real-time alert dispatch and automated environmental response triggers.',
      ],
      keyEngineeringContributionsAr: [
        'تطوير نماذج رؤية حاسوبية بالوقت الفعلي (Real-Time Computer Vision) مدربة خصيصاً.',
        'التحقق من النماذج وتقييمها للحد من الإنذارات الكاذبة (False Positives Reduction).',
        'التكامل مع المتحكمات الدقيقة ESP32 و Arduino للنشر المدمج.',
        'بناء مسارات القياس عن بُعد (Telemetry) والتنبيهات البيئية.',
      ],
      keyEngineeringContributionsEn: [
        'Developed real-time computer vision fire detection using custom-trained TensorFlow and Keras models.',
        'Executed model validation workflows specifically targeted at reducing false positives.',
        'Integrated embedded deployment and hardware control on ESP32 and Arduino microcontrollers.',
        'Engineered telemetry reporting and environmental alert triggers.',
      ],
      dataAndValidationNotesAr:
        'دراسة حالة هندسية مستندة إلى السيرة الذاتية؛ يُعرض مخطط معماري توضيحي للنظام المدمج بدلاً من صور واجهات مصطنعة.',
      dataAndValidationNotesEn:
        'CV-verified engineering case study; displays an illustrative system schematic rather than fabricated UI captures.',
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
];

// Recoverable immutable copy of the 10 canonical portfolio projects
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

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'web-design-dev',
    index: '01',
    titleAr: 'تصميم وتطوير المواقع',
    titleEn: 'Website Design and Development',
    descriptionAr:
      'بناء مواقع ويب عصرية ومتجاوبة بالكامل باللغتين العربية والإنجليزية، مع التركيز على وضوح الهوية وسرعة التصفح.',
    descriptionEn:
      'Building modern, responsive bilingual websites focused on structural clarity, accessibility, and clean code architecture.',
    scopePointsAr: [
      'تطوير تطبيقات الصفحة الواحدة (SPA) والمواقع التعريفية بـ React.js و Tailwind CSS',
      'دعم كامل لتخطيطات العربية (RTL) والإنجليزية (LTR)',
      'ربط الواجهات الأمامية مع خدمات RESTful APIs والأنظمة الخلفية',
    ],
    scopePointsEn: [
      'Single-page applications (SPA) and corporate websites with React.js & Tailwind CSS',
      'Complete Arabic RTL and English LTR localization architecture',
      'Frontend integration with RESTful APIs and backend services',
    ],
  },
  {
    id: 'ecommerce-dev',
    index: '02',
    titleAr: 'تطوير المتاجر الإلكترونية',
    titleEn: 'E-Commerce Website Development',
    descriptionAr:
      'تطوير واجهات المتاجر الرقمية وتجارب التسوق الإلكتروني المصممة لعرض المنتجات بوضوح على جميع الأجهزة.',
    descriptionEn:
      'Creating digital storefronts and e-commerce interfaces structured for clear product discovery across mobile and desktop.',
    scopePointsAr: [
      'تصميم واجهات عرض المنتجات والتصنيفات المتجاوبة مع الجوال أولاً',
      'تنظيم هيكل البيانات وتجربة المستخدم في المتاجر الرقمية',
      'تهيئة الواجهات للتكامل مع أنظمة إدارة المخزون والطلبات',
    ],
    scopePointsEn: [
      'Mobile-first product catalogs and category filtering interfaces',
      'Structured digital storefront user experience and layout engineering',
      'Storefront readiness for inventory and catalog backend services',
    ],
  },
  {
    id: 'ui-ux-design',
    index: '03',
    titleAr: 'تصميم واجهات وتجربة المستخدم',
    titleEn: 'UI/UX Design',
    descriptionAr:
      'تصميم واجهات رقمية تجمع بين الوضوح البصري، التباين المريح للقراءة، وسهولة الوصول للمستخدمين.',
    descriptionEn:
      'Designing structured user interfaces with clear typographic hierarchy, accessible contrast, and intuitive navigation flows.',
    scopePointsAr: [
      'بناء أنظمة تصميم متسقة تدعم الوضعين الداكن والفاتح',
      'تحسين مسارات التفاعل وسهولة الوصول عبر لوحة المفاتيح والشاشات المختلفة',
      'تصميم لوحات التحكم للأنظمة التعليمية والصحية والمحاسبية',
    ],
    scopePointsEn: [
      'Cohesive dark and light design systems with clear visual hierarchy',
      'Accessible keyboard navigation and responsive layout adaptation',
      'Dashboard UI structuring for educational, healthcare, and enterprise platforms',
    ],
  },
  {
    id: 'digital-prototyping',
    index: '04',
    titleAr: 'بناء النماذج الأولية للمنتجات الرقمية',
    titleEn: 'Digital Product Prototyping',
    descriptionAr:
      'تحويل أفكار المشاريع والأنظمة التقنية إلى نماذج أولية تفاعلية قابلة للاستعراض والتحقق قبل التوسع.',
    descriptionEn:
      'Translating product concepts into interactive web prototypes and functional MVP interfaces for early validation.',
    scopePointsAr: [
      'بناء نماذج أولية تفاعلية للمنصات الخدمية والتطبيقات الذكية',
      'ربط نماذج الذكاء الاصطناعي والرؤية الحاسوبية في بيئات العرض الأولية',
      'توثيق النطاق التقني وهيكلة قواعد البيانات للمشاريع الجديدة',
    ],
    scopePointsEn: [
      'Interactive web prototypes for SaaS, healthcare, and educational concepts',
      'Prototyping AI, LLM, and computer-vision workflows in web interfaces',
      'Database schema planning and endpoint architecture structuring',
    ],
  },
  {
    id: 'web-maintenance',
    index: '05',
    titleAr: 'تحسين المواقع وصيانتها',
    titleEn: 'Website Improvements and Maintenance',
    descriptionAr:
      'مراجعة الأكواد البرمجية، تحسين سرعة التحميل والتوافق مع الهواتف، وإصلاح المشكلات التقنية في المواقع القائمة.',
    descriptionEn:
      'Codebase auditing, responsive layout refinement, performance optimization, and ongoing technical maintenance.',
    scopePointsAr: [
      'مراجعة الكود البرمجي (Code Validation) وتحسين هيكلة المكونات',
      'إصلاح مشكلات التجاوب وتوافق RTL/LTR على الهواتف الذكية',
      'تحسين استعلامات قواعد البيانات وأداء الواجهات الأمامية والخلفية',
    ],
    scopePointsEn: [
      'Code validation, component refactoring, and layout stabilization',
      'Fixing RTL/LTR alignment and responsive behavior across mobile browsers',
      'Database query optimization and frontend rendering improvements',
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
      caseStudiesTitle: 'الأنظمة المحاسبية ودراسات الحالة الهندسية (من السيرة الذاتية)',
      caseStudiesSubtitle:
        'أنظمة هندسية موثقة في السيرة الذاتية تشمل نظام المحاسبة وإدارة المخزون (مع رابط مباشر) ونظام الذكاء الاصطناعي لاكتشاف الحرائق والأتمتة المدمجة.',
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
      caseStudiesTitle: 'Enterprise Accounting & Engineering Case Studies (CV)',
      caseStudiesSubtitle:
        'Full-stack enterprise accounting & inventory management (with live project link) and embedded AI/computer-vision systems documented in the owner’s CV.',
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
