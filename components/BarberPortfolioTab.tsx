'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { barberUpdateSchema } from "@/lib/schemas";

interface BarberPortfolioTabProps {
  profile: any;
  mutateProfile: () => void;
}

export function BarberPortfolioTab({ profile, mutateProfile }: BarberPortfolioTabProps) {
  const { user } = useAuth();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const photos = profile?.photos || [];
  const videos = profile?.videos || [];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Only jpg, png, and webp images are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Photo file size must be less than 10MB.');
      return;
    }
    if (photos.length >= 20) {
      setErrorMsg('Maximum 20 photos allowed.');
      return;
    }

    setPhotoLoading(true);
    setErrorMsg('');

    const storageRef = ref(storage, `portfolios/${user.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      null, 
      (error) => {
        setPhotoLoading(false);
        setErrorMsg('Upload failed. Please try again.');
        console.error(error);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newPhotos = [...photos, downloadURL];
          await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({ photos: newPhotos }));
          mutateProfile();
        } catch (err) {
          console.error(err);
        }
        setPhotoLoading(false);
      }
    );
    e.target.value = ""; // Reset input
  };

  const handlePhotoDelete = async (photoUrl: string) => {
    if (!user) return;
    
    // Optimistic UI update can be complex with strings if duplicates exist, but we assume exact string match
    const newPhotos = photos.filter((url: string) => url !== photoUrl);
    
    try {
      // Create a reference from the URL and delete it
      const fileRef = ref(storage, photoUrl);
      await deleteObject(fileRef).catch(console.error); // We don't await/fail if the file is already deleted or not found
      
      await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({ photos: newPhotos }));
      mutateProfile();
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to delete photo.');
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (!['video/mp4', 'video/quicktime', 'video/webm'].includes(file.type)) {
      setErrorMsg('Only mp4, mov, and webm videos are allowed.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('Video file size must be less than 50MB.');
      return;
    }
    if (videos.length >= 5) {
      setErrorMsg('Maximum 5 videos allowed.');
      return;
    }

    setVideoLoading(true);
    setErrorMsg('');

    const storageRef = ref(storage, `portfolios/${user.uid}/videos/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      null, 
      (error) => {
        setVideoLoading(false);
        setErrorMsg('Upload failed. Please try again.');
        console.error(error);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newVideos = [...videos, downloadURL];
          await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({ videos: newVideos }));
          mutateProfile();
        } catch (err) {
          console.error(err);
        }
        setVideoLoading(false);
      }
    );
    e.target.value = ""; // Reset input
  };

  const handleVideoDelete = async (videoUrl: string) => {
    if (!user) return;
    
    const newVideos = videos.filter((url: string) => url !== videoUrl);
    
    try {
      const fileRef = ref(storage, videoUrl);
      await deleteObject(fileRef).catch(console.error);
      
      await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({ videos: newVideos }));
      mutateProfile();
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to delete video.');
    }
  };

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-black mb-2">Portfolio 📸</h1>
      <p className="text-brand-text-secondary text-sm mb-8">Showcase your best haircuts to attract more clients.</p>

      {errorMsg && (
        <div className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-xl px-4 py-3 text-sm font-bold mb-6">
          {errorMsg}
        </div>
      )}

      {/* SECTION A: PHOTOS */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-black">Photos</h2>
            <p className="text-xs text-[#888]">Max 20 photos. Up to 10MB each.</p>
          </div>
          <label className={`bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-[#2a2a2a] transition-colors ${photoLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            {photoLoading ? 'Uploading...' : '+ Add Photo'}
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp" 
              onChange={handlePhotoUpload} 
              className="hidden" 
              disabled={photoLoading}
            />
          </label>
        </div>

        {photos.length === 0 ? (
          <div className="border border-dashed border-[#333] rounded-3xl p-8 text-center text-[#888] bg-[#0a0a0a]">
            No photos yet. Add some to show off your skills!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((url: string, i: number) => (
              <div key={i} className="aspect-square bg-[#141414] rounded-2xl overflow-hidden relative group border border-[#2a2a2a]">
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Portfolio ${i}`} className="w-full h-full object-cover" />
                </>
                <button 
                  onClick={() => handlePhotoDelete(url)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all hover:bg-brand-red hover:text-white pointer-events-auto"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION B: VIDEOS */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-black">Videos</h2>
            <p className="text-xs text-[#888]">Max 5 videos. Up to 50MB each.</p>
          </div>
          <label className={`bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-[#2a2a2a] transition-colors ${videoLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            {videoLoading ? 'Uploading...' : '+ Add Video'}
            <input 
              type="file" 
              accept="video/mp4,video/quicktime,video/webm" 
              onChange={handleVideoUpload} 
              className="hidden"
              disabled={videoLoading}
            />
          </label>
        </div>

        {videos.length === 0 ? (
          <div className="border border-dashed border-[#333] rounded-3xl p-8 text-center text-[#888] bg-[#0a0a0a]">
            No videos yet. Action shots are great for engagement!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((url: string, i: number) => (
              <div key={i} className="aspect-[4/5] bg-[#141414] rounded-2xl overflow-hidden relative group border border-[#2a2a2a]">
                <video src={url} className="w-full h-full object-cover" controls preload="metadata" />
                <button 
                  onClick={() => handleVideoDelete(url)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex z-10 items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all hover:bg-brand-red hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
