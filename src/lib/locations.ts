import { collection, getDocs, query, orderBy, where, limit } from "firebase/firestore";
import { db } from "./firebase";

export interface LocationData {
  id?: string;
  city: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  localAddress?: string;
  hasSpecificService?: boolean;
  specificServiceName?: string;
  serviceDisplayMode?: "specific_only" | "all_default" | "both";
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Fetch all active locations from Firestore
 */
export async function getAllLocations(): Promise<LocationData[]> {
  try {
    const q = query(collection(db, "locations"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LocationData[];
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return [];
  }
}

/**
 * Fetch a single location by its slug
 */
export async function getLocationBySlug(slug: string): Promise<LocationData | null> {
  try {
    const q = query(collection(db, "locations"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as LocationData;
  } catch (error) {
    console.error("Failed to fetch location by slug:", error);
    return null;
  }
}
