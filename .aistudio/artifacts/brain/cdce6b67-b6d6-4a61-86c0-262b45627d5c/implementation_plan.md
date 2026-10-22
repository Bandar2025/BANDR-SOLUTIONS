# Bandr Solutions Portfolio — Advanced AI Image Editing, Executive Presentation & Community Updates

Upgrade the Bandr Solutions portfolio website with server-side AI image editing via `@google/genai`, client-side image compression, executive-focused project takeaway metrics, enhanced professional bio, and a fully managed Community Updates / Forum feed.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **AI Image Editing**: Server-side endpoint using `gemini-3.1-flash-lite-image` to enhance or transform uploaded project images based on admin text prompts.
> - **Image Compression**: Client-side canvas compression ensures uploaded images load instantly and never impact performance.
> - **Executive Takeaways**: Project cards display clean business impact metrics and executive value summaries for corporate clients and recruiters.
> - **Community Updates Feed**: Firestore-backed forum and update publishing tool managed directly from the Admin Dashboard.

- **Confirmed Decision 1**: Text prompt box to enhance or transform uploaded project images via Gemini AI.
- **Confirmed Decision 2**: Dedicated updates feed page and home section managed from the Admin Dashboard.
- **Confirmed Decision 3**: Clear executive takeaway badges and impact metrics on project cards.

---

## 1. Overview & Core Concept

- **What It Does**: Empowers the portfolio owner to optimize, compress, and AI-edit project images, presents professional projects with executive impact metrics, showcases a detailed verified bio, and provides a dynamic Community Updates forum feed.
- **Target Audience**: Enterprise clients, recruiters, tech companies, and general visitors.
- **Key Value**: Exceptional visual presentation, lightning-fast performance, and transparent communication of technical achievements.

---

## 2. User Experience & Visual Design

- **Executive Project Highlights**: Each project card features key business impact metrics (e.g. `+140% Scalability`, `Enterprise-Grade SLA`) and a concise 1-line executive takeaway.
- **Admin AI Image Studio**: Integrated into the project editor modal, allowing admins to upload images, compress them automatically, and apply AI edits with a text prompt.
- **Community Updates / Forum**: A dedicated page and section where published announcements, engineering tips, and updates are displayed with rich formatting and image support.

---

## 3. Technical Architecture & Data Strategy

- **Server-Side AI Editing (`/api/gemini/edit-image`)**:
  - Express backend endpoint receiving base64 image data and a text prompt.
  - Calls `@google/genai` (`gemini-3.1-flash-lite-image`) and returns the edited base64 image.
- **Firestore Collections**:
  - `/projects/{projectId}`: Existing projects with enhanced fields for executive metrics and galleries.
  - `/community_posts/{postId}`: New collection for community updates and forum posts.
- **Security**: Firestore rules ensure only the authorized owner (`bandr246899@gmail.com`) can create/edit community posts and projects.
