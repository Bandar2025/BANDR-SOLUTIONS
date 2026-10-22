# Security Specification — Bandr Solutions Portfolio & Admin Dashboard

## 1. Data Invariants

1. **Default-Deny Catch-All**: Every path not explicitly matched under `/databases/{database}/documents` is unconditionally denied (`allow read, write: if false;`).
2. **Strict Owner-Only Administration (`isAdmin()`)**:
   - Write access (`create`, `update`, `delete`) across `/projects/{projectId}`, `/project_media/{mediaId}`, `/site_settings/{settingId}`, and `/admins/{adminId}` is strictly limited to an authenticated user whose email is verified (`request.auth.token.email_verified == true`) AND whose email matches the bootstrapped owner account (`bandr246899@gmail.com` or `bandi246589@gmail.com`) or whose UID exists in `/admins/$(request.auth.uid)`.
3. **Draft Isolation (Zero Draft Leakage)**:
   - Unauthenticated visitors and non-admin authenticated users can ONLY read (`get`, `list`) documents in `/projects/{projectId}` and `/project_media/{mediaId}` where `resource.data.status == 'published'`.
   - Any document with `status == 'draft'` is strictly unreadable by the public (`allow get, list` requires `resource.data.status == 'published' || isAdmin()`).
4. **Relational Integrity for Media (`project_media`)**:
   - A `/project_media/{mediaId}` document cannot be created unless the referenced parent `/projects/$(incoming().projectId)` document exists (`exists(/databases/$(database)/documents/projects/$(incoming().projectId))`).
5. **Global Appearance Settings Hardening (`/site_settings/appearance`)**:
   - Only `settingId == 'appearance'` is permitted.
   - Public visitors may `get` `/site_settings/appearance` (no `list` scraping allowed, and no owner email or PII is stored in the document).
   - Only `isAdmin()` may `create` or `update` `/site_settings/appearance`, and `themeId` must strictly belong to the static allowlist `['midnight-pro', 'obsidian', 'arctic-light', 'ocean-breeze', 'emerald-tech', 'royal-violet']`.
6. **Anti-Update-Gap & Temporal Integrity**:
   - Every `create` and `update` must pass `isValidPortfolioProject(incoming())`, `isValidProjectMedia(incoming())`, or `isValidSiteAppearance(incoming())`.
   - `createdAt` must equal `request.time` on `create` and remain immutable (`incoming().createdAt == existing().createdAt`) on `update`.
   - `updatedAt` must equal `request.time` on both `create` and `update`.
   - `ownerUid` must equal `request.auth.uid` on `create` and remain immutable on `update`.

---

## 2. The "Dirty Dozen" Adversarial Payloads (Plus Global Theme Guards)

1. **Payload 1 — Unauthenticated Project Creation**: `auth = null`, attempting `create` on `/projects/novaro`. -> **MUST DENY**.
2. **Payload 2 — Unverified Email Spoofing Attack**: `auth = { uid: 'attacker1', token: { email: 'bandr246899@gmail.com', email_verified: false } }`, attempting `update` on `/projects/novaro`. -> **MUST DENY**.
3. **Payload 3 — Non-Owner Authenticated Write**: `auth = { uid: 'user2', token: { email: 'random@gmail.com', email_verified: true } }`, attempting `create` on `/projects/hacked`. -> **MUST DENY**.
4. **Payload 4 — Public Draft Scraping (`get` / `list`)**: `auth = null`, attempting `get` or `list` on `/projects/secret-draft` where `status == 'draft'`. -> **MUST DENY**.
5. **Payload 5 — Shadow / Ghost Field Injection**: Owner sends valid project fields plus `isSuperVerified: true` not in `hasOnly(...)`. -> **MUST DENY**.
6. **Payload 6 — ID Poisoning Attack**: Owner attempts to create `/projects/invalid id with spaces and $pecial!` failing `isValidId()`. -> **MUST DENY**.
7. **Payload 7 — Owner Identity Spoofing**: Owner attempts to create a project with `ownerUid: 'someone_else_uid'`. -> **MUST DENY**.
8. **Payload 8 — Immortal Field Mutation (`createdAt` / `ownerUid`)**: Owner attempts to update `createdAt` or `ownerUid` on an existing project. -> **MUST DENY**.
9. **Payload 9 — Client Timestamp Forgery**: Owner attempts to create or update a project with a past/future `updatedAt` timestamp (`updatedAt != request.time`). -> **MUST DENY**.
10. **Payload 10 — Unbounded Array / Resource Exhaustion**: Owner attempts to set `technologies` array with 50 items (`> 25`) or `galleryMediaIds` with 20 items (`> 10`). -> **MUST DENY**.
11. **Payload 11 — Orphaned Media Upload**: Owner attempts to create `/project_media/img_1` referencing a non-existent `projectId: 'non_existent_project'`. -> **MUST DENY**.
12. **Payload 12 — Invalid MIME Type Upload**: Owner attempts to create `/project_media/img_2` with `mimeType: 'application/x-msdownload'` or `text/html`. -> **MUST DENY**.
13. **Payload 13 — Anonymous Global Theme Mutation**: `auth = null`, attempting `update` on `/site_settings/appearance`. -> **MUST DENY**.
14. **Payload 14 — Authenticated Non-Owner Global Theme Mutation**: `auth = { uid: 'intruder_1', email: 'intruder@example.com', email_verified: true }`, attempting `update` on `/site_settings/appearance`. -> **MUST DENY**.
15. **Payload 15 — CSS Injection / Non-Allowlisted Theme ID**: Owner attempts to write `themeId: 'url(javascript:alert(1))'` to `/site_settings/appearance`. -> **MUST DENY**.
