# Implementation Plan - Multiple Project Galleries, Full Editing & Automatic Gemini AI Image Framing

## User Requirements
1. **Multiple Project Photos & Gallery Carousel**: Enable adding and managing multiple gallery images per project, displayed via an image carousel slider with interactive thumbnails in project details.
2. **Full Project Details Editing**: Comprehensive editing interface in the admin dashboard for all project fields (bilingual titles, descriptions, engineering contributions, category, technologies, URLs, featured status, case study status).
3. **Automatic Gemini AI Image Framing & Enhancement**: Automatic AI-powered smart aspect ratio framing and professional color/composition enhancement on uploaded project images.

## Proposed Changes

### 1. Backend & AI Enhancement (`server.ts`)
- Enhance `/api/gemini/edit-image` or add automatic cropping/framing instruction when uploading images so Gemini AI formats the image into a clean 16:9 professional product mockup presentation.

### 2. Gallery Management & Compression (`src/lib/imageOptimizer.ts` & `src/lib/portfolioService.ts`)
- Support uploading multiple media records linked to a project in Firestore (`project_media`).
- Automatic client-side compression + server-side Gemini AI smart cropping.

### 3. Admin Dashboard (`src/components/AdminDashboard.tsx`)
- Add robust multi-image uploader with progress and AI smart framing toggle.
- Expand project edit modal to cover all project attributes.

### 4. Project Detail Modal (`src/components/ProjectDetailModal.tsx`)
- Implement a sleek image carousel slider with thumbnail strip for multi-image project galleries.
