'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { userUpdateSchema } from "@/lib/schemas";

export interface AppUser {
  uid: string;
  email: string;
  role: 'client' | 'barber';
  firstName: string;
  lastName: string;
  isOnboarded: boolean;
  favoriteBarbers?: string[];
  ownsShop?: boolean;
  shopId?: string | null;
  barberCode?: string;
  photoUrl?: string;
  profilePhotoUrl?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  videos?: string[];
  photos?: string[];
  isLive?: boolean;
  phone?: string;
  phoneCountryCode?: string;
  city?: string;
  country?: string;
  bio?: string;
  languages?: string[];
  isSolo?: boolean;
  rating?: number;
  reviewCount?: number;
  totalCuts?: number;
  [key: string]: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAppUser(docSnap.data() as AppUser);
        }
      } catch (error) {
        console.error("Error refreshing user", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          let docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            console.warn('User document not found, retrying in 1s...');
            await new Promise(r => setTimeout(r, 1000));
            docSnap = await getDoc(docRef);
          }
          
          if (docSnap.exists()) {
            let userData = docSnap.data() as AppUser;
            
            // Heal Check
            if (userData.role === 'barber' && !userData.isOnboarded) {
              const profileRef = doc(db, 'barberProfiles', firebaseUser.uid);
              const profileSnap = await getDoc(profileRef);
              if (profileSnap.exists()) {
                console.log("Healing Incomplete State: Barber profile exists. Setting isOnboarded to true.");
                try {
                  const { updateDoc } = await import('firebase/firestore');
                  await updateDoc(docRef, userUpdateSchema.parse({ isOnboarded: true }));
                  userData.isOnboarded = true;
                } catch (e) {
                  console.error("Failed to heal profile", e);
                }
              }
            }
            
            setAppUser(userData);
          } else {
            console.warn('User document not found in Firestore after retry');
            // Default appUser based on what we have
            setAppUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'client', // Default fallback
              firstName: '',
              lastName: '',
              isOnboarded: false,
              ownsShop: false
            });
          }
        } catch (error) {
          console.error("Error fetching user role", error);
        }
      } else {
        setAppUser(null);
      }
      
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
