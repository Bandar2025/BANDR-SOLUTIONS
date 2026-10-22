/**
 * Firestore Security Rules Test Specification (Dirty Dozen + Theme Settings Suite)
 * Verifies that all adversarial payloads in security_spec.md are rejected with PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  auth: {
    uid: string;
    email: string;
    email_verified: boolean;
  } | null;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_SECURITY_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Project Creation',
    auth: null,
    operation: 'create',
    path: '/projects/novaro',
    payload: { slug: 'novaro', status: 'published' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Email Spoofing Attack on Owner Account',
    auth: { uid: 'spoof_uid', email: 'bandr246899@gmail.com', email_verified: false },
    operation: 'update',
    path: '/projects/novaro',
    payload: { nameEn: 'Spoofed' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Non-Owner Authenticated Project Creation',
    auth: { uid: 'intruder_1', email: 'intruder@example.com', email_verified: true },
    operation: 'create',
    path: '/projects/intruder-proj',
    payload: { slug: 'intruder-proj', status: 'published' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Public Visitor Reading Draft Project',
    auth: null,
    operation: 'get',
    path: '/projects/unpublished-draft',
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Shadow / Ghost Field Injection on Project Create',
    auth: { uid: 'owner_1', email: 'bandr246899@gmail.com', email_verified: true },
    operation: 'create',
    path: '/projects/novaro',
    payload: { slug: 'novaro', ghostAdminFlag: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'ID Poisoning with Invalid Characters',
    auth: { uid: 'owner_1', email: 'bandr246899@gmail.com', email_verified: true },
    operation: 'create',
    path: '/projects/invalid$id!spaces',
    payload: { slug: 'novaro' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Owner Identity Spoofing (ownerUid != request.auth.uid)',
    auth: { uid: 'owner_1', email: 'bandr246899@gmail.com', email_verified: true },
    operation: 'create',
    path: '/projects/novaro',
    payload: { slug: 'novaro', ownerUid: 'different_uid' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Immortal Field Mutation (Attempting to alter createdAt)',
    auth: { uid: 'owner_1', email: 'bandr246899@gmail.com', email_verified: true },
    operation: 'update',
    path: '/projects/novaro',
    payload: { createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Client Timestamp Forgery (updatedAt != request.time)',
    auth: { uid: 'owner_1', email: 'bandr246899@gmail.com', email_verified: true },
    operation: 'update',
    path: '/projects/novaro',
    payload: { updatedAt: '2099-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Unbounded Array Exhaustion (technologies > 25 items)',
    auth: { uid: 'owner_1', email: 'bandr246899@gmail.com', email_verified: true },
    operation: 'create',
    path: '/projects/novaro',
    payload: { technologies: new Array(30).fill('React') },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Orphaned Media Upload (Non-existent parent projectId)',
    auth: { uid: 'owner_1', email: 'bandr246899@gmail.com', email_verified: true },
    operation: 'create',
    path: '/project_media/media_1',
    payload: { projectId: 'missing_project', mimeType: 'image/png' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Invalid MIME Type Upload in project_media',
    auth: { uid: 'owner_1', email: 'bandr246899@gmail.com', email_verified: true },
    operation: 'create',
    path: '/project_media/media_2',
    payload: { projectId: 'novaro', mimeType: 'text/html' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 13,
    name: 'Anonymous Global Theme Modification Rejected',
    auth: null,
    operation: 'update',
    path: '/site_settings/appearance',
    payload: { themeId: 'arctic-light', density: 'comfortable', reducedMotion: false },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 14,
    name: 'Authenticated Non-Owner Global Theme Modification Rejected',
    auth: { uid: 'intruder_1', email: 'intruder@example.com', email_verified: true },
    operation: 'update',
    path: '/site_settings/appearance',
    payload: { themeId: 'obsidian', density: 'compact', reducedMotion: false },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 15,
    name: 'Arbitrary CSS / Unlisted Theme ID Injection Rejected',
    auth: { uid: 'owner_1', email: 'bandr246899@gmail.com', email_verified: true },
    operation: 'create',
    path: '/site_settings/appearance',
    payload: { themeId: 'malicious-css-injection', density: 'comfortable', reducedMotion: false },
    expectedResult: 'PERMISSION_DENIED',
  },
];
