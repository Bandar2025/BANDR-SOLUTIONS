import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export interface CommunityPost {
  id: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  imageUrl?: string | null;
  category: 'announcement' | 'tech_tip' | 'case_study' | 'update';
  publishedAt: any;
  authorName: string;
}

const COLLECTION_NAME = 'community_posts';

export function subscribeCommunityPosts(
  callback: (posts: CommunityPost[]) => void
): () => void {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('publishedAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const posts: CommunityPost[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        posts.push({
          id: docSnap.id,
          titleEn: data.titleEn || '',
          titleAr: data.titleAr || '',
          contentEn: data.contentEn || '',
          contentAr: data.contentAr || '',
          imageUrl: data.imageUrl || null,
          category: data.category || 'update',
          publishedAt: data.publishedAt || new Date().toISOString(),
          authorName: data.authorName || 'Bandr Solutions',
        });
      });
      callback(posts);
    },
    (error) => {
      console.warn('Community posts snapshot fallback:', error);
      callback([]);
    }
  );
}

export async function saveCommunityPost(post: Partial<CommunityPost>): Promise<string> {
  const id = post.id || `post-${Math.random().toString(36).substring(2, 9)}`;
  const docRef = doc(db, COLLECTION_NAME, id);
  const payload = {
    titleEn: post.titleEn || '',
    titleAr: post.titleAr || '',
    contentEn: post.contentEn || '',
    contentAr: post.contentAr || '',
    imageUrl: post.imageUrl || null,
    category: post.category || 'update',
    publishedAt: serverTimestamp(),
    authorName: 'Bandr Solutions',
  };
  await setDoc(docRef, payload, { merge: true });
  return id;
}

export async function deleteCommunityPost(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
