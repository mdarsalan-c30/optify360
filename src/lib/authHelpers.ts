import { db, firebaseConfig } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp, deleteApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export type UserRole = 'admin' | 'client';

export interface UserRecord {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  clientId?: string | null;
  createdAt?: any;
}

/**
 * Fetch the full user record from Firestore.
 */
export async function getUserRecord(uid: string): Promise<UserRecord | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as UserRecord;
  } catch {
    return null;
  }
}

/**
 * Get just the role for a UID.
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
  const record = await getUserRecord(uid);
  return record?.role ?? null;
}

/**
 * Create or update a user record in Firestore.
 */
export async function upsertUserRecord(
  uid: string,
  email: string,
  role: UserRole,
  name?: string,
  clientId?: string | null
) {
  await setDoc(
    doc(db, 'users', uid),
    {
      uid,
      email,
      role,
      name: name || '',
      clientId: clientId ?? null,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Creates a new Firebase Auth user (client) WITHOUT signing out the current admin.
 * Uses a temporary secondary Firebase app instance.
 */
export async function createClientAuthAccount(
  email: string,
  password: string
): Promise<string> {
  const appName = `secondary_${Date.now()}`;
  const secondaryApp = initializeApp(firebaseConfig, appName);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    return cred.user.uid;
  } finally {
    await deleteApp(secondaryApp);
  }
}
