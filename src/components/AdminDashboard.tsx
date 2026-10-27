import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Crop,
  Edit3,
  Eye,
  EyeOff,
  FilePlus2,
  FolderKanban,
  Image as ImageIcon,
  Loader2,
  Lock,
  LogOut,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  Language,
  PROJECT_CATEGORIES,
  PROJECTS_DATA,
  ProjectCategory,
  ProjectGalleryItem,
  ProjectItem,
  RECOVERABLE_INITIAL_PROJECTS_BACKUP,
} from '../data/portfolioData';
import {
  auth,
  isAuthorizedOwner,
  signInOwnerWithGoogle,
  signOutOwner,
} from '../lib/firebase';
import {
  deletePortfolioProject,
  deleteProjectGalleryMedia,
  fetchProjectGalleryItems,
  migrateBaselineProjectsToFirestore,
  processAndOptimizeImageFile,
  savePortfolioProject,
  subscribeAdminAllProjects,
  toggleProjectPublishStatus,
  updateProjectGalleryMediaAlt,
  uploadProjectGalleryMedia,
  uploadPreOptimizedGalleryMedia,
  validateImageMagicBytes,
  verifyServerSideUnauthorizedRejection,
} from '../lib/portfolioService';
import { optimizeImageWithBrowserCompression } from '../lib/imageOptimizer';
import {
  AppearancePreferences,
  GlobalPublishedAppearance,
} from '../lib/themeSystem';
import { ProjectVisualPreview } from './ProjectVisualPreview';
import { ThemeSettingsCenter } from './ThemeSettingsCenter';
import { ImageCropModal } from './ImageCropModal';

export interface QueueImageItem {
  id: string;
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize?: number;
  dataUrl?: string;
  mimeType?: 'image/webp' | 'image/jpeg';
  status: 'processing' | 'ready' | 'error';
  error?: string;
  altAr: string;
  altEn: string;
}

interface AdminDashboardProps {
  lang: Language;
  onPreviewProject: (project: ProjectItem) => void;
  onNavigateHome: () => void;
  personalPrefs: AppearancePreferences | null;
  globalPublished: GlobalPublishedAppearance;
  onApplyPersonalPrefs: (prefs: AppearancePreferences) => void;
  onResetPersonalToGlobal: () => void;
}

type EditableCategory = Exclude<ProjectCategory, 'all'>;

const EDITABLE_CATEGORIES: EditableCategory[] = [
  'e-commerce',
  'education-tech',
  'healthcare-tech',
  'web-development',
  'ai-iot',
  'enterprise-accounting',
];

function createEmptyProjectTemplate(nextOrder: number): ProjectItem {
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const id = `project-${randomSuffix}`;
  return {
    id,
    slug: id,
    displayOrder: nextOrder,
    featured: false,
    status: 'draft',
    nameAr: '',
    nameEn: '',
    category: 'web-development',
    categoryLabelAr: 'مشاريع الويب',
    categoryLabelEn: 'Web Development',
    descriptionAr: '',
    descriptionEn: '',
    engineeringContributionAr: '',
    engineeringContributionEn: '',
    verifiedFactsAr: [],
    verifiedFactsEn: [],
    unverifiedBoundariesAr: 'لا يتم ادعاء أي مقاييس تشغيلية غير موثقة.',
    unverifiedBoundariesEn: 'No unverified operational metrics are claimed.',
    technologies: ['React.js', 'TypeScript', 'Tailwind CSS'],
    technologiesSource: 'cv_stated',
    url: '',
    sourceUrl: '',
    isCaseStudyOnly: false,
    verification: {
      urlSupplied: true,
      suppliedUrl: '',
      urlOpened: 'not_yet_checked',
      interfaceObserved: 'not_yet_observed',
      workflowsTested: false,
      publiclyAccessible: 'pending_browser_verification',
      statusSummaryAr: 'تم تزويد رابط المشروع — لم يتم التحقق من الوظائف بعد.',
      statusSummaryEn: 'Project URL provided — functionality not yet verified.',
      verificationNotesAr: 'تمت الإضافة عبر لوحة إدارة المعرض.',
      verificationNotesEn: 'Added via Portfolio Admin Dashboard.',
    },
    genuineScreenshotPath: null,
    thumbnailUrl: '',
    thumbnailAltAr: '',
    thumbnailAltEn: '',
    galleryMediaIds: [],
    illustrativeTheme: {
      accentHex: '#2563EB',
      secondaryHex: '#4F46E5',
      domainCode: `WEB-${String(nextOrder).padStart(2, '0')}`,
      diagramType: 'corporate_web',
    },
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  onPreviewProject,
  onNavigateHome,
  personalPrefs,
  globalPublished,
  onApplyPersonalPrefs,
  onResetPersonalToGlobal,
}) => {
  const isAr = lang === 'ar';
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // Admin Console Active Section Tab ('projects' | 'appearance')
  const [activeTab, setActiveTab] = useState<'projects' | 'appearance'>(
    'projects'
  );

  // Live Firestore projects list for Admin
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECTS_DATA);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [migrationExecuted, setMigrationExecuted] = useState(false);
  const [syncingBaseline, setSyncingBaseline] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'published' | 'draft'
  >('all');

  // Notifications / feedback banners
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Security verification check state
  const [verifyingRules, setVerifyingRules] = useState(false);
  const [securityCheckResult, setSecurityCheckResult] = useState<{
    draftReadRejected: boolean;
    writeRejected: boolean;
    themeWriteRejected: boolean;
  } | null>(null);

  // Editor state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [techStackInput, setTechStackInput] = useState('');

  // Image upload & preview states inside editor
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [pendingThumbnailPreview, setPendingThumbnailPreview] = useState<
    string | null
  >(null);
  const [galleryItems, setGalleryItems] = useState<ProjectGalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [pendingGalleryFile, setPendingGalleryFile] = useState<{
    file: File;
    previewDataUrl: string;
    mimeType: 'image/png' | 'image/jpeg' | 'image/webp';
    altAr: string;
    altEn: string;
  } | null>(null);

  // Delete confirmation modal state
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(
    null
  );
  const [deletingProject, setDeletingProject] = useState(false);

  // Crop modal state for react-easy-crop & browser-image-compression
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropModalImageSrc, setCropModalImageSrc] = useState<string | null>(null);
  const [cropModalFileName, setCropModalFileName] = useState('');
  const [cropModalTarget, setCropModalTarget] = useState<
    'thumbnail' | 'gallery' | 'queue_item' | null
  >(null);
  const [cropQueueItemId, setCropQueueItemId] = useState<string | null>(null);

  // Multi-image upload queue state
  const [multiUploadQueue, setMultiUploadQueue] = useState<QueueImageItem[]>([]);
  const [uploadingQueue, setUploadingQueue] = useState(false);

  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // 1. Track Firebase Auth lifecycle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Firestore /projects ONLY after authReady && isAuthorizedOwner(authUser)
  useEffect(() => {
    if (!authReady || !authUser || !isAuthorizedOwner(authUser)) {
      return;
    }

    setLoadingProjects(true);
    const unsubscribe = subscribeAdminAllProjects(
      (firestoreProjects, isSeeded) => {
        setLoadingProjects(false);
        setProjects(firestoreProjects);

        if (!isSeeded && !migrationExecuted) {
          setMigrationExecuted(true);
          migrateBaselineProjectsToFirestore(authUser, false)
            .then((migratedCount) => {
              if (migratedCount > 0) {
                setStatusBanner({
                  type: 'success',
                  message: isAr
                    ? `تم ترحيل جميع المشاريع الأساسية (${migratedCount} مشاريع) إلى قاعدة بيانات Firestore بنجاح مع الحفاظ على النسخة الاحتياطية.`
                    : `Successfully migrated ${migratedCount} baseline projects into Firestore while preserving the recoverable backup.`,
                });
              }
            })
            .catch((err) => {
              setStatusBanner({
                type: 'error',
                message:
                  err instanceof Error ? err.message : 'Migration failed',
              });
            });
        }
      },
      (err) => {
        setLoadingProjects(false);
        setStatusBanner({
          type: 'error',
          message: err.message,
        });
      }
    );

    return () => unsubscribe();
  }, [authReady, authUser, migrationExecuted, isAr]);

  // Load gallery items when opening a project in the editor
  useEffect(() => {
    if (!editingProject || !editingProject.galleryMediaIds?.length) {
      setGalleryItems([]);
      return;
    }

    let cancelled = false;
    setLoadingGallery(true);
    fetchProjectGalleryItems(editingProject.galleryMediaIds, false)
      .then((items) => {
        if (!cancelled) {
          setGalleryItems(items);
          setLoadingGallery(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGalleryItems([]);
          setLoadingGallery(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [editingProject?.id]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInOwnerWithGoogle();
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : isAr
          ? 'تعذر تسجيل الدخول عبر Google.'
          : 'Failed to sign in with Google.'
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOutOwner();
    setEditingProject(null);
    setStatusBanner(null);
  };

  const handleRunSecurityVerification = async () => {
    setVerifyingRules(true);
    try {
      const res = await verifyServerSideUnauthorizedRejection();
      setSecurityCheckResult(res);
    } finally {
      setVerifyingRules(false);
    }
  };

  const handleSyncBaselineProjects = async () => {
    if (!authUser || !isAuthorizedOwner(authUser)) return;
    setSyncingBaseline(true);
    setStatusBanner(null);
    try {
      const migratedCount = await migrateBaselineProjectsToFirestore(
        authUser,
        false
      );
      setStatusBanner({
        type: 'success',
        message: isAr
          ? `اكتملت المزامنة الآمنة: تم التحقق من ${RECOVERABLE_INITIAL_PROJECTS_BACKUP.length} مشاريع أساسية (تمت استعادة ${migratedCount} مشاريع مفقودة دون الكتابة فوق التعديلات الحالية).`
          : `Safe sync complete: Verified ${RECOVERABLE_INITIAL_PROJECTS_BACKUP.length} baseline projects (${migratedCount} missing entries restored without overwriting existing edits).`,
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Sync failed',
      });
    } finally {
      setSyncingBaseline(false);
    }
  };

  const openEditorForProject = (project: ProjectItem, isNew = false) => {
    setEditingProject({ ...project });
    setIsCreatingNew(isNew);
    setTechStackInput((project.technologies || []).join(', '));
    setPendingThumbnailPreview(null);
    setPendingGalleryFile(null);
    setImageError(null);
    setUploadProgress(null);
  };

  const handleCreateNewProject = () => {
    const maxOrder = projects.reduce(
      (max, p) => Math.max(max, p.displayOrder || 0),
      0
    );
    const draftProject = createEmptyProjectTemplate(maxOrder + 1);
    openEditorForProject(draftProject, true);
  };

  // Handle Main Thumbnail Selection (opens ImageCropModal for manual cropping / fine-tuning)
  const handleSelectThumbnailFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setImageError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (src) {
        setCropModalImageSrc(src);
        setCropModalFileName(file.name);
        setCropModalTarget('thumbnail');
        setCropModalOpen(true);
      }
    };
    reader.onerror = () => setImageError('Failed to read image file.');
    reader.readAsDataURL(file);

    if (thumbnailFileInputRef.current) {
      thumbnailFileInputRef.current.value = '';
    }
  };

  const handleApplyPendingThumbnail = () => {
    if (!editingProject || !pendingThumbnailPreview) return;
    setEditingProject({
      ...editingProject,
      thumbnailUrl: pendingThumbnailPreview,
    });
    setPendingThumbnailPreview(null);
    setStatusBanner({
      type: 'info',
      message: isAr
        ? 'تم اعتماد المعاينة كصورة رئيسية. اضغط على "حفظ المشروع" لحفظها بشكل دائم في قاعدة البيانات.'
        : 'Preview applied as main thumbnail. Click "Save Project Changes" to persist in Firestore.',
    });
  };

  const handleRemoveMainThumbnail = () => {
    if (!editingProject) return;
    setPendingThumbnailPreview(null);
    setEditingProject({
      ...editingProject,
      thumbnailUrl: '',
    });
  };

  // Multi-image selection & queue processing
  const handleSelectGalleryFiles = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProject) return;

    setImageError(null);
    const selectedFiles = Array.from(files);

    const newQueueItems: QueueImageItem[] = selectedFiles.map((file, idx) => ({
      id: `queue_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      originalSize: file.size,
      status: 'processing',
      altAr: editingProject.nameAr || file.name.replace(/\.[^/.]+$/, ''),
      altEn: editingProject.nameEn || file.name.replace(/\.[^/.]+$/, ''),
    }));

    setMultiUploadQueue((prev) => [...prev, ...newQueueItems]);

    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = '';
    }

    for (const qItem of newQueueItems) {
      try {
        await validateImageMagicBytes(qItem.file);
        const res = await optimizeImageWithBrowserCompression(qItem.file, 1920);
        const base64Length = res.dataUrl.length - (res.dataUrl.indexOf(',') + 1);
        const approxBytes = Math.round((base64Length * 3) / 4);

        setMultiUploadQueue((prev) =>
          prev.map((item) =>
            item.id === qItem.id
              ? {
                  ...item,
                  status: 'ready',
                  dataUrl: res.dataUrl,
                  mimeType: res.mimeType,
                  compressedSize: approxBytes,
                }
              : item
          )
        );
      } catch (err: any) {
        setMultiUploadQueue((prev) =>
          prev.map((item) =>
            item.id === qItem.id
              ? {
                  ...item,
                  status: 'error',
                  error: err.message || 'Validation/compression failed',
                }
              : item
          )
        );
      }
    }
  };

  const handleOpenCropForQueueItem = (item: QueueImageItem) => {
    setCropModalImageSrc(item.dataUrl || item.previewUrl);
    setCropModalFileName(item.file.name);
    setCropModalTarget('queue_item');
    setCropQueueItemId(item.id);
    setCropModalOpen(true);
  };

  const handleRemoveQueueItem = (itemId: string) => {
    setMultiUploadQueue((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleUploadAllQueuedImages = async () => {
    if (!editingProject || !authUser) return;
    const readyItems = multiUploadQueue.filter(
      (item) => item.status === 'ready' && item.dataUrl
    );
    if (readyItems.length === 0) return;

    setUploadingQueue(true);
    setImageError(null);

    try {
      await persistEditingProjectToFirestore(editingProject);
      const uploadedMediaItems: ProjectGalleryItem[] = [];
      const newMediaIds: string[] = [...(editingProject.galleryMediaIds || [])];

      for (const item of readyItems) {
        const uploaded = await uploadPreOptimizedGalleryMedia(
          item.dataUrl!,
          item.mimeType || 'image/webp',
          item.file.name,
          editingProject.id,
          item.altAr,
          item.altEn,
          editingProject.status === 'draft' ? 'draft' : 'published',
          authUser
        );
        uploadedMediaItems.push(uploaded);
        newMediaIds.push(uploaded.id);
      }

      const deduplicatedIds = Array.from(new Set(newMediaIds)).slice(0, 25);
      const autoThumb =
        (!editingProject.thumbnailUrl || editingProject.thumbnailUrl.trim().length === 0) &&
        uploadedMediaItems.length > 0
          ? uploadedMediaItems[0].dataUrl
          : editingProject.thumbnailUrl;

      const updatedProject: ProjectItem = {
        ...editingProject,
        thumbnailUrl: autoThumb,
        galleryMediaIds: deduplicatedIds,
      };

      await persistEditingProjectToFirestore(updatedProject, autoThumb);
      setEditingProject(updatedProject);
      setGalleryItems((prev) => [...prev, ...uploadedMediaItems]);
      setMultiUploadQueue((prev) =>
        prev.filter((item) => !readyItems.some((r) => r.id === item.id))
      );
      setStatusBanner({
        type: 'success',
        message: isAr
          ? `تم رفع وحفظ ${uploadedMediaItems.length} صور بنجاح إلى معرض هذا المشروع.`
          : `Successfully uploaded and saved ${uploadedMediaItems.length} images to project gallery.`,
      });
    } catch (err: any) {
      setImageError(err.message || 'Failed to upload queued images');
    } finally {
      setUploadingQueue(false);
    }
  };

  const handleMoveGalleryItem = async (
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (!editingProject || !galleryItems.length) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryItems.length) return;

    const newItems = [...galleryItems];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const newMediaIds = newItems.map((item) => item.id);
    const updatedProject: ProjectItem = {
      ...editingProject,
      galleryMediaIds: newMediaIds,
    };
    setGalleryItems(newItems);
    setEditingProject(updatedProject);
    await persistEditingProjectToFirestore(updatedProject);
    setStatusBanner({
      type: 'success',
      message: isAr
        ? 'تم تحديث ترتيب صور المعرض بنجاح.'
        : 'Gallery image order updated successfully.',
    });
  };

  const handleSetAsMainThumbnail = async (item: ProjectGalleryItem) => {
    if (!editingProject) return;
    setPendingThumbnailPreview(item.dataUrl);
    const updatedProject: ProjectItem = {
      ...editingProject,
      thumbnailUrl: item.dataUrl,
    };
    setEditingProject(updatedProject);
    await persistEditingProjectToFirestore(updatedProject, item.dataUrl);
    setStatusBanner({
      type: 'success',
      message: isAr
        ? 'تم تعيين هذه الصورة كصورة رئيسية للمشروع بنجاح.'
        : 'Set as main project thumbnail successfully.',
    });
  };

  const handleCropComplete = async (
    resultDataUrl: string,
    mimeType: 'image/webp' | 'image/jpeg',
    fileName: string
  ) => {
    if (cropModalTarget === 'thumbnail') {
      setPendingThumbnailPreview(resultDataUrl);
      setStatusBanner({
        type: 'success',
        message: isAr
          ? 'تم قص وضغط الصورة الرئيسية بنجاح. اضغط على اعتماد المعاينة ثم حفظ المشروع.'
          : 'Main thumbnail cropped & compressed successfully. Click Confirm Preview then Save Project.',
      });
    } else if (cropModalTarget === 'queue_item' && cropQueueItemId) {
      const base64Length =
        resultDataUrl.length - (resultDataUrl.indexOf(',') + 1);
      const approxBytes = Math.round((base64Length * 3) / 4);

      setMultiUploadQueue((prev) =>
        prev.map((q) =>
          q.id === cropQueueItemId
            ? {
                ...q,
                status: 'ready',
                dataUrl: resultDataUrl,
                mimeType,
                compressedSize: approxBytes,
              }
            : q
        )
      );
      setCropQueueItemId(null);
      setStatusBanner({
        type: 'success',
        message: isAr
          ? 'تم تطبيق القص على الصورة في طابور الرفع.'
          : 'Crop applied to image in upload queue.',
      });
    } else if (cropModalTarget === 'gallery') {
      if (!authUser || !editingProject) return;
      setUploadProgress(15);
      fetch(resultDataUrl)
        .then((res) => res.blob())
        .then(async (blob) => {
          const file = new File([blob], fileName, { type: mimeType });
          try {
            await persistEditingProjectToFirestore(editingProject);
            setUploadProgress(50);
            const newItem = await uploadProjectGalleryMedia(
              file,
              editingProject.id,
              editingProject.nameAr || 'صورة معرض',
              editingProject.nameEn || 'Gallery image',
              editingProject.status === 'draft' ? 'draft' : 'published',
              authUser,
              (pct) => setUploadProgress(50 + Math.round(pct * 0.5))
            );
            const updatedIds = Array.from(
              new Set([...(editingProject.galleryMediaIds || []), newItem.id])
            ).slice(0, 25);
            const updatedProject: ProjectItem = {
              ...editingProject,
              galleryMediaIds: updatedIds,
            };
            await persistEditingProjectToFirestore(updatedProject);
            setGalleryItems((prev) => [...prev, newItem]);
            setEditingProject(updatedProject);
            setUploadProgress(null);
            setStatusBanner({
              type: 'success',
              message: isAr
                ? 'تم قص وضغط ورفع صورة المعرض الجديدة بنجاح إلى Firebase.'
                : 'New gallery image cropped, compressed, and uploaded successfully to Firebase.',
            });
          } catch (err) {
            setUploadProgress(null);
            setImageError(
              err instanceof Error
                ? err.message
                : 'Failed to upload gallery image'
            );
          }
        });
    }
    setCropModalOpen(false);
    setCropModalImageSrc(null);
    setCropModalTarget(null);
  };


  const persistEditingProjectToFirestore = async (
    projectState: ProjectItem,
    overrideThumbnail?: string | null
  ) => {
    if (!authUser) return;
    const parsedTech = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalThumb =
      overrideThumbnail !== undefined
        ? overrideThumbnail || ''
        : pendingThumbnailPreview !== null
        ? pendingThumbnailPreview
        : projectState.thumbnailUrl || '';

    await savePortfolioProject(
      projectState.id,
      {
        slug: projectState.slug || projectState.id,
        nameAr: projectState.nameAr || 'مشروع جديد',
        nameEn: projectState.nameEn || 'New Project',
        descriptionAr: projectState.descriptionAr || 'وصف المشروع',
        descriptionEn: projectState.descriptionEn || 'Project description',
        engineeringContributionAr:
          projectState.engineeringContributionAr || 'تطوير وهندسة المشروع',
        engineeringContributionEn:
          projectState.engineeringContributionEn ||
          'Project engineering and implementation',
        category: projectState.category,
        technologies: parsedTech.length > 0 ? parsedTech : ['React.js'],
        url: projectState.url || '',
        sourceUrl: projectState.sourceUrl || '',
        featured: Boolean(projectState.featured),
        displayOrder: Number(projectState.displayOrder) || 1,
        status: projectState.status === 'draft' ? 'draft' : 'published',
        isCaseStudyOnly:
          !projectState.url || projectState.url.trim().length === 0,
        thumbnailUrl: finalThumb,
        thumbnailAltAr:
          projectState.thumbnailAltAr || projectState.nameAr || '',
        thumbnailAltEn:
          projectState.thumbnailAltEn || projectState.nameEn || '',
        galleryMediaIds: projectState.galleryMediaIds || [],
      },
      authUser
    );
  };

  const handleConfirmGalleryUpload = async () => {
    if (!editingProject || !pendingGalleryFile || !authUser) return;
    setImageError(null);
    setUploadProgress(15);

    try {
      await persistEditingProjectToFirestore(editingProject);

      const newMedia = await uploadProjectGalleryMedia(
        pendingGalleryFile.file,
        editingProject.id,
        pendingGalleryFile.altAr,
        pendingGalleryFile.altEn,
        editingProject.status === 'draft' ? 'draft' : 'published',
        authUser,
        (pct) => setUploadProgress(pct)
      );

      const updatedMediaIds = Array.from(
        new Set([...(editingProject.galleryMediaIds || []), newMedia.id])
      ).slice(0, 25);

      const autoThumb =
        !editingProject.thumbnailUrl || editingProject.thumbnailUrl.trim().length === 0
          ? newMedia.dataUrl
          : editingProject.thumbnailUrl;

      const updatedProject: ProjectItem = {
        ...editingProject,
        thumbnailUrl: autoThumb,
        galleryMediaIds: updatedMediaIds,
      };

      await persistEditingProjectToFirestore(updatedProject, autoThumb);

      setEditingProject(updatedProject);
      setGalleryItems((prev) => [...prev, newMedia]);
      setPendingGalleryFile(null);
      setUploadProgress(null);
      setIsCreatingNew(false);
    } catch (err) {
      setUploadProgress(null);
      setImageError(
        err instanceof Error
          ? err.message
          : isAr
          ? 'فشل رفع صورة المعرض.'
          : 'Gallery upload failed.'
      );
    }
  };

  const handleDeleteGalleryImage = async (mediaId: string) => {
    if (!editingProject) return;
    try {
      await deleteProjectGalleryMedia(mediaId);
      const updatedIds = (editingProject.galleryMediaIds || []).filter(
        (id) => id !== mediaId
      );
      const updatedProject: ProjectItem = {
        ...editingProject,
        galleryMediaIds: updatedIds,
      };
      setGalleryItems((prev) => prev.filter((item) => item.id !== mediaId));
      setEditingProject(updatedProject);
      await persistEditingProjectToFirestore(updatedProject);
    } catch (err) {
      setImageError(
        err instanceof Error ? err.message : 'Failed to delete gallery image.'
      );
    }
  };

  const handleUpdateGalleryAlt = async (
    mediaId: string,
    altAr: string,
    altEn: string
  ) => {
    try {
      await updateProjectGalleryMediaAlt(mediaId, altAr, altEn);
      setGalleryItems((prev) =>
        prev.map((item) =>
          item.id === mediaId ? { ...item, altAr, altEn } : item
        )
      );
      setStatusBanner({
        type: 'success',
        message: isAr
          ? 'تم تحديث النص البديل للصورة.'
          : 'Updated image alt text.',
      });
    } catch (err) {
      setImageError(
        err instanceof Error ? err.message : 'Failed to update alt text'
      );
    }
  };

  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !authUser) return;

    setSavingProject(true);
    setStatusBanner(null);

    try {
      await persistEditingProjectToFirestore(editingProject);
      setStatusBanner({
        type: 'success',
        message: isAr
          ? `تم حفظ المشروع "${editingProject.nameAr}" بنجاح في قاعدة البيانات.`
          : `Successfully saved "${editingProject.nameEn}" to Firestore.`,
      });
      setEditingProject(null);
      setPendingThumbnailPreview(null);
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save project',
      });
    } finally {
      setSavingProject(false);
    }
  };

  const handleQuickToggleStatus = async (project: ProjectItem) => {
    if (!authUser) return;
    const nextStatus: 'published' | 'draft' =
      project.status === 'draft' ? 'published' : 'draft';
    try {
      await toggleProjectPublishStatus(project.id, nextStatus);
      setStatusBanner({
        type: 'success',
        message: isAr
          ? `تم تغيير حالة "${project.nameAr}" إلى ${
              nextStatus === 'published'
                ? 'منشور (عام)'
                : 'مسودة (مخفي عن الزوار)'
            }.`
          : `Changed "${project.nameEn}" status to ${nextStatus.toUpperCase()}.`,
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Status update failed',
      });
    }
  };

  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setDeletingProject(true);
    try {
      await deletePortfolioProject(
        projectToDelete.id,
        projectToDelete.galleryMediaIds || []
      );
      setStatusBanner({
        type: 'success',
        message: isAr
          ? `تم حذف المشروع "${projectToDelete.nameAr}" نهائياً.`
          : `Deleted project "${projectToDelete.nameEn}".`,
      });
      setProjectToDelete(null);
      if (editingProject?.id === projectToDelete.id) {
        setEditingProject(null);
      }
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Delete failed',
      });
    } finally {
      setDeletingProject(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const currentStatus = p.status || 'published';
      if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAr = p.nameAr.toLowerCase().includes(q);
        const matchEn = p.nameEn.toLowerCase().includes(q);
        const matchTech = (p.technologies || []).some((t: string) =>
          t.toLowerCase().includes(q)
        );
        if (!matchAr && !matchEn && !matchTech) return false;
      }
      return true;
    });
  }, [projects, statusFilter, categoryFilter, searchQuery]);

  // ---------------------------------------------------------------------------
  // STATE 1: Loading Auth State
  // ---------------------------------------------------------------------------
  if (!authReady) {
    return (
      <section className="min-h-[75vh] theme-bg-primary flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 theme-accent-text animate-spin" />
          <p className="text-sm theme-text-secondary">
            {isAr
              ? 'جاري التحقق من جلسة المصادقة الآمنة...'
              : 'Verifying secure authentication session...'}
          </p>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // STATE 2: Unauthenticated OR Signed In With Non-Owner Account
  // ---------------------------------------------------------------------------
  if (!authUser || !isAuthorizedOwner(authUser)) {
    return (
      <section className="min-h-[80vh] theme-bg-primary py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full theme-bg-surface border theme-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md theme-card-elevated theme-accent-text text-xs font-mono-tabular">
              <Lock className="w-3.5 h-3.5" />
              <span>PRIVATE ADMIN CONSOLE</span>
            </span>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs theme-text-muted hover:theme-text-primary transition-colors cursor-pointer"
            >
              {isAr ? 'العودة للموقع العام' : 'Back to Public Portfolio'}
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold theme-text-primary">
              {isAr ? 'لوحة إدارة معرض الأعمال' : 'Portfolio Admin Dashboard'}
            </h1>
            <p className="text-sm theme-text-secondary leading-relaxed">
              {isAr
                ? 'هذه المنطقة مخصصة لمالك المنصة فقط ومحمية عبر مصادقة Firebase Google وقواعد أمان Firestore من جهة الخادم.'
                : 'This workspace is restricted to the portfolio owner and enforced server-side via Firebase Google Authentication and Firestore Security Rules.'}
            </p>
          </div>

          {authUser && !isAuthorizedOwner(authUser) && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  {isAr
                    ? 'تم رفض الوصول — الحساب غير مصرح له'
                    : 'Access Denied — Unauthorized Account'}
                </span>
              </div>
              <p>
                {isAr
                  ? `الحساب الحالي (${authUser.email}) ليس ضمن قائمة المالك المصرح له بإدارة المشاريع.`
                  : `Signed-in account (${authUser.email}) is not authorized to manage portfolio projects.`}
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/70 hover:bg-red-800 text-white font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {!authUser && (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl theme-btn-primary disabled:opacity-60 text-sm font-bold cursor-pointer"
            >
              {signingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>
                {isAr
                  ? 'تسجيل الدخول بحساب المالك عبر Google'
                  : 'Sign In as Owner with Google'}
              </span>
            </button>
          )}

          {/* Server-Side Security Verification Tester */}
          <div className="pt-4 border-t theme-border space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold theme-text-muted">
                {isAr
                  ? 'فحص قواعد الحماية من جهة الخادم (Firestore Rules)'
                  : 'Server-Side Firestore Security Rules Verification'}
              </span>
              <button
                type="button"
                onClick={handleRunSecurityVerification}
                disabled={verifyingRules}
                className="px-3 py-1.5 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer"
              >
                {verifyingRules
                  ? isAr
                    ? 'جاري الفحص...'
                    : 'Testing...'
                  : isAr
                  ? 'اختبار رفض الوصول غير المصرح'
                  : 'Test Unauthorized Rejection'}
              </button>
            </div>

            {securityCheckResult && (
              <div className="p-3.5 rounded-xl theme-card-elevated text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isAr
                      ? 'حظر قراءة المسودات لغير المصرح لهم: نشط'
                      : `Draft Read Blocked Server-Side: ${
                          securityCheckResult.draftReadRejected
                            ? 'PASSED'
                            : 'FAILED'
                        }`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isAr
                      ? 'حظر تعديل المشاريع لغير المصرح لهم: نشط'
                      : `Unauthorized Project Write Blocked: ${
                          securityCheckResult.writeRejected
                            ? 'PASSED'
                            : 'FAILED'
                        }`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isAr
                      ? 'حظر تعديل الثيم العام للمنصة لغير المالك: نشط'
                      : `Unauthorized Global Theme Write Blocked: ${
                          securityCheckResult.themeWriteRejected
                            ? 'PASSED'
                            : 'FAILED'
                        }`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // STATE 3: Authenticated Portfolio Owner Dashboard
  // ---------------------------------------------------------------------------
  const publishedCount = projects.filter(
    (p) => (p.status || 'published') === 'published'
  ).length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  return (
    <div className="min-h-screen theme-bg-primary pb-20">
      {/* Admin Header */}
      <div className="theme-bg-surface border-b theme-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono-tabular theme-accent-text mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isAr
                    ? 'لوحة تحكم المالك المعتمدة'
                    : 'OWNER ADMINISTRATION CONSOLE'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold theme-text-primary">
                {isAr
                  ? 'إدارة المشاريع والمظهر العام'
                  : 'Portfolio, Media & Appearance Center'}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCreateNewProject}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl theme-btn-primary text-xs sm:text-sm font-bold cursor-pointer"
              >
                <FilePlus2 className="w-4 h-4" />
                <span>{isAr ? 'إضافة مشروع جديد' : 'Add New Project'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncBaselineProjects}
                disabled={syncingBaseline}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    syncingBaseline ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  {isAr
                    ? `مزامنة المشاريع الأساسية (${RECOVERABLE_INITIAL_PROJECTS_BACKUP.length})`
                    : `Sync Baseline (${RECOVERABLE_INITIAL_PROJECTS_BACKUP.length})`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isAr ? 'خروج' : 'Sign Out'}</span>
              </button>
            </div>
          </div>

          {/* Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl theme-card-elevated flex items-center justify-between">
              <span className="text-xs theme-text-muted">
                {isAr ? 'إجمالي المشاريع' : 'Total Projects'}
              </span>
              <span className="text-lg font-extrabold font-mono-tabular theme-text-primary">
                {projects.length}
              </span>
            </div>
            <div className="p-3.5 rounded-xl theme-card-elevated flex items-center justify-between">
              <span className="text-xs theme-text-muted">
                {isAr ? 'منشور للجمهور' : 'Published (Public)'}
              </span>
              <span className="text-lg font-extrabold font-mono-tabular text-emerald-400">
                {publishedCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl theme-card-elevated flex items-center justify-between">
              <span className="text-xs theme-text-muted">
                {isAr ? 'مسودات (مخفية)' : 'Drafts (Private)'}
              </span>
              <span className="text-lg font-extrabold font-mono-tabular text-amber-400">
                {draftCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl theme-card-elevated flex items-center justify-between">
              <span className="text-xs theme-text-muted">
                {isAr ? 'الثيم العام المنشور' : 'Published Global Theme'}
              </span>
              <span className="text-xs font-mono-tabular theme-accent-text truncate max-w-[160px]">
                {globalPublished.themeId}
              </span>
            </div>
          </div>

          {/* Navigation Tabs: Projects & Media vs Appearance & Themes */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'projects'
                  ? 'theme-btn-primary'
                  : 'theme-btn-secondary'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>
                {isAr
                  ? 'إدارة المشاريع والصور'
                  : 'Projects & Media Management'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'appearance'
                  ? 'theme-btn-primary'
                  : 'theme-btn-secondary'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>
                {isAr
                  ? 'المظهر والثيمات (Appearance & Themes)'
                  : 'Appearance & Themes'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {statusBanner && (
          <div className="p-4 rounded-xl theme-card-elevated flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              {statusBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 theme-accent-text shrink-0" />
              )}
              <span className="theme-text-primary">{statusBanner.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="theme-text-muted hover:theme-text-primary cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'appearance' ? (
          <ThemeSettingsCenter
            lang={lang}
            personalPrefs={personalPrefs}
            globalPublished={globalPublished}
            onApplyPersonalPrefs={onApplyPersonalPrefs}
            onResetPersonalToGlobal={onResetPersonalToGlobal}
            authUser={authUser}
            isOwnerAdmin={true}
          />
        ) : (
          <>
            {/* Filter & Search Bar */}
            <div className="theme-bg-surface border theme-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 theme-text-muted absolute top-1/2 -translate-y-1/2 start-3.5" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ابحث باسم المشروع أو التقنية...'
                      : 'Search project name or technology...'
                  }
                  className="w-full ps-10 pe-4 py-2 rounded-xl theme-input text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as 'all' | 'published' | 'draft'
                    )
                  }
                  aria-label={isAr ? 'تصفية حسب الحالة' : 'Filter by status'}
                  className="px-3.5 py-2 rounded-xl theme-input text-xs font-semibold"
                >
                  <option value="all">
                    {isAr
                      ? 'جميع الحالات (منشور + مسودة)'
                      : 'All Statuses'}
                  </option>
                  <option value="published">
                    {isAr ? 'منشور فقط (Published)' : 'Published Only'}
                  </option>
                  <option value="draft">
                    {isAr ? 'مسودة فقط (Draft)' : 'Draft Only'}
                  </option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as ProjectCategory)
                  }
                  aria-label={
                    isAr ? 'تصفية حسب التصنيف' : 'Filter by category'
                  }
                  className="px-3.5 py-2 rounded-xl theme-input text-xs font-semibold"
                >
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isAr ? cat.labelAr : cat.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Projects Inventory Grid */}
            {loadingProjects ? (
              <div className="theme-bg-surface border theme-border rounded-2xl p-12 text-center space-y-3">
                <Loader2 className="w-7 h-7 theme-accent-text animate-spin mx-auto" />
                <p className="text-sm theme-text-secondary">
                  {isAr
                    ? 'جاري تحميل المشاريع من Firestore...'
                    : 'Loading projects from Firestore...'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 theme-grid-gap">
                {filteredProjects.map((project) => {
                  const isDraft = project.status === 'draft';
                  return (
                    <div
                      key={project.id}
                      className={`theme-bg-surface rounded-2xl border transition-all overflow-hidden flex flex-col ${
                        isDraft
                          ? 'border-amber-400/70'
                          : 'theme-border'
                      }`}
                    >
                      {/* Visual Preview Header */}
                      <div className="relative">
                        <ProjectVisualPreview
                          project={project}
                          lang={lang}
                          heightClass="h-48"
                        />
                        <div className="absolute top-3 end-3 flex items-center gap-1.5 z-10">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm ${
                              isDraft
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {isDraft
                              ? isAr
                                ? 'مسودة (مخفي)'
                                : 'DRAFT'
                              : isAr
                              ? 'منشور'
                              : 'PUBLISHED'}
                          </span>
                          {project.featured && (
                            <span className="px-2 py-1 rounded-md theme-btn-primary text-[11px] font-bold inline-flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              <span>#{project.displayOrder}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs theme-text-muted font-mono-tabular">
                            <span>ID: {project.id}</span>
                            <span>
                              {isAr ? 'الترتيب:' : 'Order:'} #
                              {project.displayOrder}
                            </span>
                          </div>
                          <h2 className="text-base font-bold theme-text-primary line-clamp-1">
                            {isAr ? project.nameAr : project.nameEn}
                          </h2>
                          <p className="text-xs theme-text-secondary line-clamp-2 leading-relaxed">
                            {isAr
                              ? project.descriptionAr
                              : project.descriptionEn}
                          </p>
                        </div>

                        {/* Action Controls */}
                        <div className="pt-3 border-t theme-border flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                openEditorForProject(project, false)
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg theme-btn-primary text-xs font-semibold cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>
                                {isAr ? 'تعديل والصور' : 'Edit & Media'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onPreviewProject(project)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer"
                              title={isAr ? 'معاينة العرض' : 'Preview Modal'}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isAr ? 'معاينة' : 'Preview'}</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleQuickToggleStatus(project)}
                              className="p-1.5 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer"
                              title={
                                isDraft
                                  ? isAr
                                    ? 'نشر للجمهور'
                                    : 'Publish Project'
                                  : isAr
                                  ? 'تحويل إلى مسودة'
                                  : 'Unpublish to Draft'
                              }
                            >
                              {isDraft ? (
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => setProjectToDelete(project)}
                              className="p-1.5 rounded-lg theme-btn-secondary text-red-400 hover:text-red-300 cursor-pointer"
                              title={isAr ? 'حذف المشروع' : 'Delete Project'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ===================================================================== */}
      {/* FULL PROJECT & MEDIA EDITOR MODAL                                     */}
      {/* ===================================================================== */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="theme-bg-surface border theme-border rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 theme-bg-elevated px-6 py-4 flex items-center justify-between border-b theme-border">
              <div>
                <span className="text-[11px] font-mono-tabular theme-accent-text block">
                  {isCreatingNew
                    ? 'CREATE NEW PORTFOLIO PROJECT'
                    : `EDIT PROJECT (${editingProject.id})`}
                </span>
                <h2 className="text-lg font-bold theme-text-primary">
                  {isCreatingNew
                    ? isAr
                      ? 'إضافة مشروع جديد'
                      : 'Create New Portfolio Project'
                    : (isAr
                        ? editingProject.nameAr
                        : editingProject.nameEn) || editingProject.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-lg theme-btn-secondary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectForm} className="p-6 space-y-8">
              {/* Section 1: Publication Status, Order, Category & ID */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 theme-card-elevated p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr ? 'معرّف المشروع (Slug ID)' : 'Project ID (Slug)'}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isCreatingNew}
                    value={editingProject.id}
                    onChange={(e) => {
                      const clean = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-_]/g, '-');
                      setEditingProject({
                        ...editingProject,
                        id: clean,
                        slug: clean,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg theme-input text-xs font-mono-tabular disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr ? 'حالة النشر' : 'Publication Status'}
                  </label>
                  <select
                    value={editingProject.status || 'published'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.value as 'published' | 'draft',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg theme-input text-xs font-semibold"
                  >
                    <option value="published">
                      {isAr ? 'منشور (يظهر للجمهور)' : 'Published (Public)'}
                    </option>
                    <option value="draft">
                      {isAr ? 'مسودة (مخفي عن الجمهور)' : 'Draft (Hidden)'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as EditableCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg theme-input text-xs font-semibold"
                  >
                    {EDITABLE_CATEGORIES.map((catId) => {
                      const catObj = PROJECT_CATEGORIES.find(
                        (c) => c.id === catId
                      );
                      return (
                        <option key={catId} value={catId}>
                          {catObj
                            ? isAr
                              ? catObj.labelAr
                              : catObj.labelEn
                            : catId}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold theme-text-primary mb-1">
                      {isAr ? 'ترتيب العرض' : 'Display Order'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      required
                      value={editingProject.displayOrder}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          displayOrder: Number(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg theme-input text-xs font-mono-tabular"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg theme-input text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          featured: e.target.checked,
                        })
                      }
                    />
                    <span>{isAr ? 'مميز' : 'Featured'}</span>
                  </label>
                </div>
              </div>

              {/* Section 2: Bilingual Project Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr
                      ? 'اسم المشروع (بالعربية) *'
                      : 'Project Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={editingProject.nameAr}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        nameAr: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl theme-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr
                      ? 'اسم المشروع (بالإنجليزية) *'
                      : 'Project Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={editingProject.nameEn}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        nameEn: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl theme-input text-sm"
                  />
                </div>
              </div>

              {/* Section 3: Bilingual Descriptions & Engineering Contributions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr
                      ? 'وصف المشروع (بالعربية) *'
                      : 'Project Description (Arabic) *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    dir="rtl"
                    value={editingProject.descriptionAr}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        descriptionAr: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl theme-input text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr
                      ? 'وصف المشروع (بالإنجليزية) *'
                      : 'Project Description (English) *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    dir="ltr"
                    value={editingProject.descriptionEn}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        descriptionEn: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl theme-input text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr
                      ? 'المساهمة الهندسية ودور التنفيذ (بالعربية) *'
                      : 'Engineering Contribution (Arabic) *'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    dir="rtl"
                    value={editingProject.engineeringContributionAr}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        engineeringContributionAr: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl theme-input text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr
                      ? 'المساهمة الهندسية ودور التنفيذ (بالإنجليزية) *'
                      : 'Engineering Contribution (English) *'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    dir="ltr"
                    value={editingProject.engineeringContributionEn}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        engineeringContributionEn: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl theme-input text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 4: URLs & Technology Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr
                      ? 'رابط المشروع المباشر (اتركه فارغاً إن كان دراسة حالة فقط)'
                      : 'Main Live Project URL (leave empty if case study only)'}
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="https://..."
                    value={editingProject.url || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        url: e.target.value.trim() || null,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl theme-input text-xs font-mono-tabular"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr
                      ? 'رابط المستودع البرمجي GitHub / Source (اختياري)'
                      : 'GitHub / Source Repository URL (optional)'}
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="https://github.com/..."
                    value={editingProject.sourceUrl || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        sourceUrl: e.target.value.trim(),
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl theme-input text-xs font-mono-tabular"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold theme-text-primary mb-1">
                    {isAr
                      ? 'التقنيات المستخدمة (مفصولة بفاصلة ,)'
                      : 'Technology Stack (comma-separated)'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="React.js, TypeScript, Node.js, Tailwind CSS"
                    className="w-full px-3.5 py-2 rounded-xl theme-input text-xs font-mono-tabular"
                  />
                </div>
              </div>

              {/* ================================================================= */}
              {/* Section 5: Dedicated Image & Gallery Management                   */}
              {/* ================================================================= */}
              <div className="p-5 rounded-2xl theme-card-elevated space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b theme-border pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 theme-accent-text" />
                    <h3 className="text-sm font-extrabold theme-text-primary">
                      {isAr
                        ? 'إدارة صورة البطاقة الرئيسية ومعرض صور المشروع'
                        : 'Project Thumbnail & Gallery Media Management'}
                    </h3>
                  </div>
                  <span className="text-[11px] theme-text-muted">
                    {isAr
                      ? 'الصيغ المدعومة: PNG, JPEG, WebP (بحد أقصى 5 ميجابايت مع ضغط وتحسين تلقائي)'
                      : 'Supported: PNG, JPEG, WebP (Max 5 MB, auto-optimized)'}
                  </span>
                </div>

                {uploadProgress !== null && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold theme-accent-text">
                      <span>
                        {isAr
                          ? 'جاري فحص وضغط ومعالجة الصورة...'
                          : 'Validating & optimizing image...'}
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full theme-bg-primary overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent-primary)] transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {imageError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{imageError}</span>
                  </div>
                )}

                {/* 5A. Main Card Thumbnail Manager */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  <div className="space-y-2">
                    <span className="block text-xs font-bold theme-text-primary">
                      {isAr
                        ? 'المعاينة الحالية لبطاقة المشروع العامة'
                        : 'Current Public Project Card Preview'}
                    </span>
                    <div className="rounded-xl overflow-hidden border theme-border">
                      <ProjectVisualPreview
                        project={{
                          ...editingProject,
                          thumbnailUrl:
                            pendingThumbnailPreview !== null
                              ? pendingThumbnailPreview
                              : editingProject.thumbnailUrl,
                        }}
                        lang={lang}
                        heightClass="h-52"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold theme-text-primary">
                        {isAr
                          ? 'رفع أو استبدال الصورة الرئيسية (Thumbnail)'
                          : 'Upload or Replace Main Thumbnail'}
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={thumbnailFileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleSelectThumbnailFile}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => thumbnailFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl theme-btn-primary text-xs font-semibold cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {editingProject.thumbnailUrl
                              ? isAr
                                ? 'استبدال الصورة الرئيسية'
                                : 'Replace Main Image'
                              : isAr
                              ? 'رفع صورة رئيسية حقيقية'
                              : 'Upload Main Screenshot'}
                          </span>
                        </button>

                        {(editingProject.thumbnailUrl ||
                          pendingThumbnailPreview) && (
                          <button
                            type="button"
                            onClick={handleRemoveMainThumbnail}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl theme-btn-secondary text-xs font-semibold text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>
                              {isAr
                                ? 'إزالة الصورة المرفوعة'
                                : 'Remove Custom Thumbnail'}
                            </span>
                          </button>
                        )}
                      </div>

                      {pendingThumbnailPreview && (
                        <div className="p-3 rounded-xl theme-bg-surface border theme-border space-y-2">
                          <p className="text-xs font-semibold theme-accent-text">
                            {isAr
                              ? 'تم تجهيز معاينة الصورة الجديدة. هل ترغب في اعتمادها؟'
                              : 'New thumbnail preview ready. Apply before saving?'}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleApplyPendingThumbnail}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                            >
                              {isAr ? 'اعتماد الصورة' : 'Confirm Thumbnail'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingThumbnailPreview(null)}
                              className="px-3 py-1.5 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer"
                            >
                              {isAr ? 'إلغاء المعاينة' : 'Discard Preview'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Alt Text Fields for Main Thumbnail */}
                    <div className="space-y-3 pt-2 border-t theme-border">
                      <div>
                        <label className="block text-xs font-bold theme-text-primary mb-1">
                          {isAr
                            ? 'النص البديل للصورة الرئيسية (Alt Text بالعربية)'
                            : 'Main Image Alt Text (Arabic)'}
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          placeholder={editingProject.nameAr}
                          value={editingProject.thumbnailAltAr || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              thumbnailAltAr: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg theme-input text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold theme-text-primary mb-1">
                          {isAr
                            ? 'النص البديل للصورة الرئيسية (Alt Text بالإنجليزية)'
                            : 'Main Image Alt Text (English)'}
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder={editingProject.nameEn}
                          value={editingProject.thumbnailAltEn || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              thumbnailAltEn: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg theme-input text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5B. Multiple Gallery Images Manager */}
                <div className="pt-4 border-t theme-border space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-extrabold theme-text-primary">
                        {isAr
                          ? `معرض صور المشروع الإضافية (${galleryItems.length})`
                          : `Project Gallery Screenshots (${galleryItems.length})`}
                      </h4>
                      <p className="text-[11px] theme-text-muted">
                        {isAr
                          ? 'تظهر هذه الصور في نافذة تفاصيل المشروع مع دعم التبديل والنص البديل (Alt Text).'
                          : 'Displayed inside the Project Detail Modal with interactive switcher and bilingual alt text.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        ref={galleryFileInputRef}
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleSelectGalleryFiles}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl theme-btn-primary text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>
                          {isAr
                            ? 'إضافة صور متعددة للمعرض'
                            : 'Add Multiple Gallery Photos'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Multi-Image Upload Queue & Pre-upload Optimizer */}
                  {multiUploadQueue.length > 0 && (
                    <div className="p-4 rounded-2xl theme-bg-elevated border theme-border space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b theme-border pb-3">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 theme-accent-text" />
                          <span className="text-xs font-bold theme-text-primary">
                            {isAr
                              ? `طابور الصور المختارة قبل الرفع (${multiUploadQueue.length})`
                              : `Selected Images Queue (${multiUploadQueue.length})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setMultiUploadQueue([])}
                            className="px-2.5 py-1 rounded-lg theme-btn-secondary text-[11px] cursor-pointer"
                          >
                            {isAr ? 'تفريغ الطابور' : 'Clear Queue'}
                          </button>
                          <button
                            type="button"
                            disabled={
                              uploadingQueue ||
                              !multiUploadQueue.some((q) => q.status === 'ready')
                            }
                            onClick={handleUploadAllQueuedImages}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                          >
                            {uploadingQueue ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {isAr
                                ? 'رفع وحفظ جميع الصور الجاهزة للمعرض'
                                : 'Upload All Ready Images to Gallery'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pe-1">
                        {multiUploadQueue.map((item) => {
                          const origKb = Math.round(item.originalSize / 1024);
                          const compKb = item.compressedSize
                            ? Math.round(item.compressedSize / 1024)
                            : null;
                          return (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl theme-bg-surface border theme-border space-y-2.5"
                            >
                              <div className="flex gap-3 items-start">
                                <img
                                  src={item.dataUrl || item.previewUrl}
                                  alt="Queue preview"
                                  className="w-20 aspect-[16/10] object-cover rounded-lg border theme-border shrink-0"
                                />
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-bold theme-text-primary truncate">
                                      {item.file.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveQueueItem(item.id)}
                                      className="p-1 rounded text-red-400 hover:bg-red-950/40 cursor-pointer"
                                      title={isAr ? 'إزالة من الطابور' : 'Remove from queue'}
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-2 text-[10px] font-mono-tabular">
                                    <span className="theme-text-muted">
                                      {origKb} KB
                                    </span>
                                    {compKb && (
                                      <>
                                        <span className="theme-accent-text">→</span>
                                        <span className="text-emerald-400 font-bold">
                                          {compKb} KB ({item.mimeType?.replace('image/', '')})
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  <div className="pt-0.5">
                                    {item.status === 'processing' && (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span>{isAr ? 'جاري فحص وضغط الصورة...' : 'Compressing...'}</span>
                                      </span>
                                    )}
                                    {item.status === 'ready' && (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>{isAr ? 'جاهزة للرفع' : 'Ready to upload'}</span>
                                      </span>
                                    )}
                                    {item.status === 'error' && (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-medium">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span className="truncate">{item.error}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-1 border-t theme-border">
                                <input
                                  type="text"
                                  dir="rtl"
                                  placeholder="نص بديل (عربي)"
                                  value={item.altAr}
                                  onChange={(e) =>
                                    setMultiUploadQueue((prev) =>
                                      prev.map((q) =>
                                        q.id === item.id ? { ...q, altAr: e.target.value } : q
                                      )
                                    )
                                  }
                                  className="w-full px-2 py-1 rounded theme-input text-[11px]"
                                />
                                <input
                                  type="text"
                                  dir="ltr"
                                  placeholder="Alt Text (EN)"
                                  value={item.altEn}
                                  onChange={(e) =>
                                    setMultiUploadQueue((prev) =>
                                      prev.map((q) =>
                                        q.id === item.id ? { ...q, altEn: e.target.value } : q
                                      )
                                    )
                                  }
                                  className="w-full px-2 py-1 rounded theme-input text-[11px]"
                                />
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenCropForQueueItem(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg theme-btn-secondary text-[10px] font-semibold cursor-pointer"
                                >
                                  <Crop className="w-3 h-3" />
                                  <span>{isAr ? 'قص وتعديل' : 'Crop & Tune'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Existing Gallery Images List with Reordering & Main Selector */}
                  {loadingGallery ? (
                    <div className="text-xs theme-text-muted flex items-center gap-2 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {isAr
                          ? 'جاري تحميل معرض الصور...'
                          : 'Loading gallery images...'}
                      </span>
                    </div>
                  ) : galleryItems.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] theme-text-muted px-1">
                        <span>
                          {isAr
                            ? 'يمكنك إعادة ترتيب الصور أو تعيين أي صورة كصورة رئيسية للمشروع:'
                            : 'Reorder screenshots or designate any as the main project thumbnail:'}
                        </span>
                        <span className="font-mono-tabular">
                          {galleryItems.length} / 10
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {galleryItems.map((item, idx) => {
                          const isCurrentMain =
                            editingProject.thumbnailUrl === item.dataUrl;

                          return (
                            <div
                              key={item.id}
                              className={`p-3 rounded-xl theme-bg-surface border transition-all space-y-2.5 ${
                                isCurrentMain
                                  ? 'border-blue-500 shadow-sm'
                                  : 'theme-border'
                              }`}
                            >
                              <div className="flex gap-3 items-start">
                                <div className="relative shrink-0">
                                  <img
                                    src={item.dataUrl}
                                    alt={isAr ? item.altAr : item.altEn}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-24 aspect-[16/10] object-cover rounded-lg border theme-border"
                                  />
                                  <span className="absolute top-1 start-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono-tabular text-white">
                                    #{idx + 1}
                                  </span>
                                </div>

                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-mono-tabular theme-text-muted truncate">
                                      {item.fileName}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {/* Move Up Button */}
                                      <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => handleMoveGalleryItem(idx, 'up')}
                                        className="p-1 rounded theme-btn-secondary disabled:opacity-30 cursor-pointer"
                                        title={isAr ? 'تقديم الترتيب' : 'Move up'}
                                      >
                                        <ArrowUp className="w-3 h-3" />
                                      </button>
                                      {/* Move Down Button */}
                                      <button
                                        type="button"
                                        disabled={idx === galleryItems.length - 1}
                                        onClick={() => handleMoveGalleryItem(idx, 'down')}
                                        className="p-1 rounded theme-btn-secondary disabled:opacity-30 cursor-pointer"
                                        title={isAr ? 'تأخير الترتيب' : 'Move down'}
                                      >
                                        <ArrowDown className="w-3 h-3" />
                                      </button>
                                      {/* Delete Button */}
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteGalleryImage(item.id)}
                                        className="p-1 rounded text-red-400 hover:bg-red-950/40 cursor-pointer"
                                        title={isAr ? 'حذف الصورة' : 'Delete image'}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <input
                                    type="text"
                                    dir="rtl"
                                    defaultValue={item.altAr}
                                    onBlur={(e) =>
                                      handleUpdateGalleryAlt(
                                        item.id,
                                        e.target.value,
                                        item.altEn
                                      )
                                    }
                                    className="w-full px-2 py-1 rounded theme-input text-[11px]"
                                    placeholder="Alt AR"
                                  />
                                  <input
                                    type="text"
                                    dir="ltr"
                                    defaultValue={item.altEn}
                                    onBlur={(e) =>
                                      handleUpdateGalleryAlt(
                                        item.id,
                                        item.altAr,
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 rounded theme-input text-[11px]"
                                    placeholder="Alt EN"
                                  />
                                </div>
                              </div>

                              {/* Card Action Row: Set as Main Thumbnail */}
                              <div className="flex items-center justify-between pt-1 border-t theme-border text-xs">
                                {isCurrentMain ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{isAr ? 'الصورة الرئيسية الحالية' : 'Current Main Thumbnail'}</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsMainThumbnail(item)}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium theme-text-secondary hover:theme-accent-text cursor-pointer"
                                  >
                                    <Star className="w-3 h-3" />
                                    <span>{isAr ? 'تعيين كصورة رئيسية' : 'Set as Main Thumbnail'}</span>
                                  </button>
                                )}
                                <span className="text-[10px] font-mono-tabular theme-text-muted">
                                  {item.mimeType.replace('image/', '')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs theme-text-muted italic">
                      {isAr
                        ? 'لا توجد صور إضافية في معرض هذا المشروع حالياً. يمكنك استخدام زر "إضافة صور متعددة" أعلاه لرفع لقطات شاشة متعددة.'
                        : 'No additional gallery screenshots uploaded for this project yet. Use the "Add Multiple Gallery Photos" button above.'}
                    </p>
                  )}
                </div>
              </div>


              {/* Sticky Form Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t theme-border">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl theme-btn-primary disabled:opacity-60 text-xs sm:text-sm font-bold cursor-pointer"
                >
                  {savingProject ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>
                    {isAr
                      ? 'حفظ المشروع والتعديلات'
                      : 'Save Project Changes'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DELETE CONFIRMATION DIALOG                                            */}
      {/* ===================================================================== */}
      {projectToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80"
          role="dialog"
          aria-modal="true"
        >
          <div className="theme-bg-surface border theme-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold theme-text-primary">
                {isAr ? 'تأكيد حذف المشروع' : 'Confirm Project Deletion'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm theme-text-secondary leading-relaxed">
              {isAr
                ? `هل أنت متأكد من رغبتك في حذف المشروع "${projectToDelete.nameAr}"؟ يمكنك دائماً استعادة المشاريع الـ ${PROJECTS_DATA.length} الأساسية عبر زر "مزامنة المشاريع الأساسية".`
                : `Are you sure you want to delete "${projectToDelete.nameEn}"? You can always restore the original ${PROJECTS_DATA.length} baseline projects via the "Sync Baseline" button.`}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProject}
                disabled={deletingProject}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white cursor-pointer"
              >
                {deletingProject && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>{isAr ? 'تأكيد الحذف' : 'Delete Project'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropping & Fine-Tuning Modal */}
      {cropModalOpen && cropModalImageSrc && (
        <ImageCropModal
          imageSrc={cropModalImageSrc}
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setCropModalImageSrc(null);
            setCropModalTarget(null);
          }}
          onCropped={handleCropComplete}
          lang={lang}
          fileName={cropModalFileName}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
