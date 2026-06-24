'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import {
  challengeSubmissionSchema,
  challengeSettingsSchema,
  type ChallengeSubmissionData,
  type ChallengeSettingsData,
} from '@/lib/schemas';
import { statusColor } from '@/lib/challenge-utils';
import { toast } from '@/lib/toast';

type Mode = 'barber' | 'shop';

interface Props {
  mode: Mode;
}

interface PhotoSlot {
  file: File | null;
  url: string | null;
  uploading: boolean;
}

const EMPTY_SLOTS: PhotoSlot[] = [
  { file: null, url: null, uploading: false },
  { file: null, url: null, uploading: false },
  { file: null, url: null, uploading: false },
  { file: null, url: null, uploading: false },
];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES_HARD = 5 * 1024 * 1024;
const MAX_PHOTO_BYTES_COMPRESSED = 1 * 1024 * 1024;
const MAX_VIDEO_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_DURATION_SEC = 30;
const MAX_DESCRIPTION_CHARS = 1000;

function extFromFile(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  if (file.type === 'image/jpeg') return 'jpg';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'video/mp4') return 'mp4';
  if (file.type === 'video/quicktime') return 'mov';
  return 'bin';
}

function checkVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const d = video.duration;
      URL.revokeObjectURL(url);
      resolve(d);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read video metadata.'));
    };
    video.src = url;
  });
}

async function uploadPhoto(file: File, uid: string): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Photos must be JPEG, PNG, or WebP.');
  }
  if (file.size > MAX_PHOTO_BYTES_HARD) {
    throw new Error('Photo is too large. Pick something under 5MB.');
  }
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    useWebWorker: false,
  });
  if (compressed.size > MAX_PHOTO_BYTES_COMPRESSED) {
    throw new Error('Compressed photo still exceeds 1MB. Try a different image.');
  }
  const filename = `${uuidv4()}.${extFromFile(file)}`;
  const path = `challenge-submissions/${uid}/photos/${filename}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, compressed, {
    cacheControl: 'public, max-age=31536000',
  });
  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      null,
      err => reject(err),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      },
    );
  });
}

async function uploadVideo(file: File, uid: string): Promise<string> {
  if (!file.type.startsWith('video/')) {
    throw new Error('Video file required.');
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error('Video must be 10MB or less.');
  }
  const duration = await checkVideoDuration(file);
  if (duration > MAX_VIDEO_DURATION_SEC) {
    throw new Error(`Video must be 30 seconds or less. (Yours: ${Math.round(duration)}s)`);
  }
  const filename = `${uuidv4()}.${extFromFile(file)}`;
  const path = `challenge-submissions/${uid}/video/${filename}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file, {
    cacheControl: 'public, max-age=31536000',
  });
  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      null,
      err => reject(err),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      },
    );
  });
}

async function deleteUploadedFile(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch {
    // best-effort cleanup
  }
}

function formatDate(ms?: number): string {
  if (!ms) return '';
  try {
    return new Date(ms).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function RejectionBanner({
  reason,
  onJumpToForm,
}: {
  reason?: string;
  onJumpToForm: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (reason?.length || 0) > 200;
  const visible = !isLong || expanded ? reason : `${reason!.slice(0, 200)}…`;
  return (
    <div className="mb-8 bg-[#3a1010] border-2 border-brand-red/50 rounded-[16px] p-6">
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">❌</div>
        <div className="flex-1 min-w-0">
          <div className="text-brand-red font-black text-base mb-2">
            Your previous submission was rejected
          </div>
          {reason && (
            <div className="text-[#f5b5b5] text-[13px] leading-relaxed mb-2 whitespace-pre-wrap">
              {visible}
              {isLong && (
                <button
                  type="button"
                  onClick={() => setExpanded(v => !v)}
                  className="ml-2 text-brand-red font-extrabold hover:underline"
                >
                  {expanded ? 'Show less' : 'Read full reason'}
                </button>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={onJumpToForm}
              className="bg-brand-red text-white text-[12px] font-black px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              Jump to form
            </button>
            <span className="text-[#f5b5b5] text-[11px] opacity-80">
              Edit your submission below and resubmit.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChallengeSubmissionTab({ mode }: Props) {
  const { user, appUser } = useAuth();
  const router = useRouter();

  const dualEligible = appUser?.role === 'barber' && appUser?.ownsShop === true;

  const [submitMode, setSubmitMode] = useState<Mode>(mode);
  const [settings, setSettings] = useState<ChallengeSettingsData | null>(null);
  const [existingSubmission, setExistingSubmission] =
    useState<(ChallengeSubmissionData & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  const [photos, setPhotos] = useState<PhotoSlot[]>(EMPTY_SLOTS);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const photoInputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Load settings once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'siteConfig', 'challenge'));
        if (cancelled) return;
        if (snap.exists()) {
          const parsed = challengeSettingsSchema.safeParse(snap.data());
          setSettings(parsed.success ? parsed.data : (snap.data() as ChallengeSettingsData));
        } else {
          setSettings(null);
        }
      } catch (e) {
        console.error('Failed to load challenge settings', e);
        if (!cancelled) setSettings(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load existing submission for current submitMode whenever it changes
  const loadExistingSubmission = useCallback(
    async (uid: string, m: Mode) => {
      try {
        const snap = await getDoc(doc(db, 'challengeSubmissions', `${uid}_${m}`));
        if (snap.exists()) {
          const data = snap.data() as ChallengeSubmissionData;
          setExistingSubmission({ id: snap.id, ...data });
          // Prefill form if rejected (so user can edit and resubmit)
          if (data.status === 'rejected') {
            const slots: PhotoSlot[] = [...EMPTY_SLOTS].map(() => ({
              file: null,
              url: null,
              uploading: false,
            }));
            (data.photos || []).slice(0, 4).forEach((u, i) => {
              slots[i] = { file: null, url: u, uploading: false };
            });
            setPhotos(slots);
            setVideoUrl(data.videoUrl || null);
            setDescription(data.description || '');
          }
        } else {
          setExistingSubmission(null);
          setPhotos(EMPTY_SLOTS.map(s => ({ ...s })));
          setVideoUrl(null);
          setVideoFile(null);
          setDescription('');
        }
      } catch (e) {
        console.error('Failed to load existing submission', e);
        setExistingSubmission(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadExistingSubmission(user.uid, submitMode);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, submitMode, loadExistingSubmission]);

  // Sync submitMode when route mode prop changes (only if not dual eligible)
  useEffect(() => {
    if (!dualEligible) setSubmitMode(mode);
  }, [mode, dualEligible]);

  const handlePhotoPick = async (slotIndex: number, file: File) => {
    if (!user) return;
    setErrorMsg(null);
    setPhotos(prev => {
      const next = [...prev];
      next[slotIndex] = { ...next[slotIndex], file, uploading: true };
      return next;
    });
    try {
      const url = await uploadPhoto(file, user.uid);
      setPhotos(prev => {
        const next = [...prev];
        next[slotIndex] = { file: null, url, uploading: false };
        return next;
      });
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || 'Failed to upload photo.');
      setPhotos(prev => {
        const next = [...prev];
        next[slotIndex] = { file: null, url: null, uploading: false };
        return next;
      });
    }
  };

  const handlePhotoRemove = async (slotIndex: number) => {
    const url = photos[slotIndex]?.url;
    setPhotos(prev => {
      const next = [...prev];
      next[slotIndex] = { file: null, url: null, uploading: false };
      return next;
    });
    if (url) await deleteUploadedFile(url);
  };

  const handleVideoPick = async (file: File) => {
    if (!user) return;
    setErrorMsg(null);
    setVideoFile(file);
    setVideoUploading(true);
    try {
      const url = await uploadVideo(file, user.uid);
      setVideoUrl(url);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || 'Failed to upload video.');
      setVideoFile(null);
    } finally {
      setVideoUploading(false);
    }
  };

  const handleVideoRemove = async () => {
    const url = videoUrl;
    setVideoUrl(null);
    setVideoFile(null);
    if (url) await deleteUploadedFile(url);
  };

  const handleSubmit = async () => {
    if (!user || !appUser) return;
    setErrorMsg(null);

    const uploadedPhotoUrls = photos.map(p => p.url).filter((u): u is string => !!u);
    if (uploadedPhotoUrls.length < 1) {
      setErrorMsg('Add at least one proposal photo.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must accept the Challenge terms to submit.');
      return;
    }

    setSubmitting(true);
    try {
      // Derive submitter fields
      let submitterName = '';
      let submitterCity = '';
      let submitterAvatarUrl = '';
      let barberCode: string | undefined;
      let shopId: string | undefined;

      if (submitMode === 'barber') {
        const profileSnap = await getDoc(doc(db, 'barberProfiles', user.uid));
        const profile = profileSnap.exists() ? (profileSnap.data() as any) : null;
        submitterName = `${appUser.firstName || ''} ${appUser.lastName || ''}`.trim();
        submitterCity = profile?.city || appUser.city || '';
        submitterAvatarUrl = profile?.profilePhotoUrl || appUser.photoUrl || '';
        barberCode = profile?.barberCode || appUser.barberCode;
      } else {
        const shopSnap = await getDoc(doc(db, 'barbershops', user.uid));
        const shop = shopSnap.exists() ? (shopSnap.data() as any) : null;
        submitterName = shop?.name || '';
        submitterCity = shop?.address?.city || '';
        submitterAvatarUrl = shop?.logoUrl || shop?.coverPhotoUrl || '';
        shopId = user.uid;
      }

      const now = Date.now();
      const docId = `${user.uid}_${submitMode}`;
      const docRef = doc(db, 'challengeSubmissions', docId);

      if (existingSubmission && existingSubmission.status === 'rejected') {
        const updateData: Partial<ChallengeSubmissionData> = {
          status: 'awaiting_payment',
          photos: uploadedPhotoUrls,
          videoUrl: videoUrl || undefined,
          description: description || undefined,
          submittedAt: now,
          termsAcceptedAt: now,
          resubmissionCount: (existingSubmission.resubmissionCount || 0) + 1,
          rejectionReason: undefined,
        };
        const parsed = challengeSubmissionSchema.partial().parse(updateData);
        await updateDoc(docRef, parsed);
      } else {
        const newData: ChallengeSubmissionData = {
          userId: user.uid,
          type: submitMode,
          submitterName,
          submitterCity,
          submitterAvatarUrl,
          barberCode,
          shopId,
          photos: uploadedPhotoUrls,
          videoUrl: videoUrl || undefined,
          description: description || undefined,
          status: 'awaiting_payment',
          voteCount: 0,
          submittedAt: now,
          termsAcceptedAt: now,
          resubmissionCount: 0,
        };
        const parsed = challengeSubmissionSchema.parse(newData);
        await setDoc(docRef, parsed);
      }

      router.push(`/dashboard/${submitMode}/challenge/payment`);
    } catch (e: any) {
      console.error('Submission failed', e);
      setErrorMsg(e?.message || 'Something went wrong submitting. Try again.');
      setSubmitting(false);
    }
  };

  // ---- Render guards ----

  if (loading) {
    return (
      <div className="p-6 md:p-10 animate-fadeUp">
        <div className="text-[#666] text-sm">Loading…</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 md:p-10 animate-fadeUp">
        <h1 className="text-2xl font-black mb-2">🏆 Challenge</h1>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-8 max-w-[640px]">
          <div className="text-[#888]">The Challenge is not configured yet. Check back soon.</div>
        </div>
      </div>
    );
  }

  const now = Date.now();
  const openAt = settings.submissionsOpenAt;
  const closeAt = settings.submissionsCloseAt;
  const votingOpenAt = settings.votingOpenAt;

  if (openAt && now < openAt) {
    return (
      <div className="p-6 md:p-10 animate-fadeUp">
        <h1 className="text-2xl font-black mb-2">🏆 Challenge</h1>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-8 max-w-[640px]">
          <div className="text-[#888]">
            The challenge opens on <span className="text-white font-bold">{formatDate(openAt)}</span>. Come back then!
          </div>
        </div>
      </div>
    );
  }

  if (closeAt && now >= closeAt) {
    return (
      <div className="p-6 md:p-10 animate-fadeUp">
        <h1 className="text-2xl font-black mb-2">🏆 Challenge</h1>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-8 max-w-[640px]">
          <div className="text-[#888]">
            Submissions are closed. Voting opens{' '}
            <span className="text-white font-bold">{formatDate(votingOpenAt)}</span>.
          </div>
        </div>
      </div>
    );
  }

  // Existing submission state (not rejected) → show status panel
  if (existingSubmission && existingSubmission.status !== 'rejected') {
    const s = statusColor(existingSubmission.status);
    const status = existingSubmission.status;

    const handleCopyShareLink = () => {
      const name = encodeURIComponent(existingSubmission.submitterName || '');
      const url = `https://titezme.com/challenge?ref=${name}`;
      try {
        navigator.clipboard.writeText(url);
        toast.success('Link copied — share it with your network!');
      } catch {
        toast.error('Could not copy link.');
      }
    };

    return (
      <div className="p-6 md:p-10 animate-fadeUp">
        <h1 className="text-2xl font-black mb-2">🏆 Challenge</h1>
        <p className="text-brand-text-secondary text-sm mb-6">Your submission is in.</p>

        {dualEligible && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setSubmitMode('barber')}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-colors ${
                submitMode === 'barber'
                  ? 'bg-brand-yellow text-[#0a0a0a]'
                  : 'bg-[#1a1a1a] text-[#888] hover:text-white'
              }`}
            >
              As barber
            </button>
            <button
              onClick={() => setSubmitMode('shop')}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-colors ${
                submitMode === 'shop'
                  ? 'bg-brand-yellow text-[#0a0a0a]'
                  : 'bg-[#1a1a1a] text-[#888] hover:text-white'
              }`}
            >
              As barbershop
            </button>
          </div>
        )}

        <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-8 max-w-[640px]">
          {status === 'awaiting_payment' && (
            <>
              <div className="text-4xl mb-3">💳</div>
              <div className={`inline-block px-3 py-1.5 rounded-full ${s.bg} ${s.text} text-[11px] font-extrabold uppercase mb-3`}>
                {s.label}
              </div>
              <h2 className="text-xl font-black mb-2">Almost there — complete your payment</h2>
              <p className="text-[#ccc] text-sm mb-6 leading-relaxed">
                Your proposal is uploaded but the entry fee hasn&apos;t been paid yet. Send the fee and confirm to enter the challenge.
              </p>
              <button
                onClick={() => router.push(`/dashboard/${submitMode}/challenge/payment`)}
                className="w-full sm:w-auto bg-brand-yellow text-[#0a0a0a] font-black text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Continue to payment
              </button>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="text-4xl mb-3">👀</div>
              <div className={`inline-block px-3 py-1.5 rounded-full ${s.bg} ${s.text} text-[11px] font-extrabold uppercase mb-3`}>
                {s.label}
              </div>
              <h2 className="text-xl font-black mb-2">Awaiting verification</h2>
              <p className="text-[#ccc] text-sm mb-4 leading-relaxed">
                We&apos;ve received your payment declaration. Admin is verifying the bank transfer. You&apos;ll get a notification when reviewed (usually within 24h).
              </p>
              {(existingSubmission.declaredAmount !== undefined || existingSubmission.declaredReference) && (
                <div className="text-[#666] text-[12px]">
                  You declared:{' '}
                  {existingSubmission.declaredAmount !== undefined && (
                    <span className="text-[#aaa]">€{existingSubmission.declaredAmount}</span>
                  )}
                  {existingSubmission.declaredReference && (
                    <> · ref: <span className="text-[#aaa] font-mono">{existingSubmission.declaredReference}</span></>
                  )}
                </div>
              )}
            </>
          )}

          {status === 'approved' && (
            <>
              <div className="text-4xl mb-3">🎉</div>
              <div className={`inline-block px-3 py-1.5 rounded-full ${s.bg} ${s.text} text-[11px] font-extrabold uppercase mb-3`}>
                {s.label}
              </div>
              <h2 className="text-xl font-black mb-2">You&apos;re in the Challenge!</h2>
              <p className="text-[#ccc] text-sm mb-2 leading-relaxed">
                Your submission is approved. It will go live when voting opens
                {votingOpenAt && (
                  <> on <span className="text-white font-bold">{formatDate(votingOpenAt)}</span></>
                )}
                .
              </p>
              {settings.votingCloseAt && (
                <p className="text-[#888] text-[12px] mb-6">
                  Voting closes on <span className="text-white font-bold">{formatDate(settings.votingCloseAt)}</span>.
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyShareLink}
                  className="bg-brand-yellow text-[#0a0a0a] font-black text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Copy your share link
                </button>
                <button
                  onClick={() => router.push(`/dashboard/${submitMode}`)}
                  className="bg-[#1a1a1a] text-white font-black text-sm px-5 py-2.5 rounded-xl hover:bg-[#222] transition-colors"
                >
                  Back to dashboard
                </button>
              </div>
            </>
          )}
        </div>

        {/* Your submission — always shown when one exists */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-8 max-w-[640px] mt-6">
          <div className="text-[#888] text-[11px] uppercase tracking-widest mb-4 font-extrabold">
            Your submission
          </div>

          {existingSubmission.photos && existingSubmission.photos.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {existingSubmission.photos.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="aspect-square relative rounded-[10px] overflow-hidden border border-[#2a2a2a] block hover:opacity-80 transition-opacity"
                >
                  <Image src={url} alt={`Submission ${i + 1}`} fill className="object-cover" referrerPolicy="no-referrer" />
                </a>
              ))}
            </div>
          )}

          {existingSubmission.videoUrl && (
            <video
              src={existingSubmission.videoUrl}
              controls
              preload="metadata"
              className="w-full max-w-[400px] rounded-[10px] bg-black mb-4"
            />
          )}

          {existingSubmission.description && (
            <div className="text-[#ddd] text-sm whitespace-pre-wrap leading-relaxed">
              {existingSubmission.description}
            </div>
          )}

          <div className="text-[#666] text-[11px] mt-4">
            Submitted on {formatDate(existingSubmission.submittedAt)}
            {existingSubmission.resubmissionCount && existingSubmission.resubmissionCount > 0
              ? ` · Resubmission #${existingSubmission.resubmissionCount}`
              : ''}
          </div>
        </div>
      </div>
    );
  }

  // ---- Form render ----

  const photoUrlsCount = photos.filter(p => p.url).length;
  const anyUploading = photos.some(p => p.uploading) || videoUploading;
  const canSubmit = photoUrlsCount >= 1 && termsAccepted && !submitting && !anyUploading;

  const referencePhotos = settings.referencePhotos || [];
  const referenceLabels = settings.referencePhotoLabels || ['back', 'left', 'right', 'front'];

  return (
    <div className="p-6 md:p-10 animate-fadeUp max-w-[840px]">
      <h1 className="text-2xl font-black mb-2">🏆 Challenge</h1>
      <p className="text-brand-text-secondary text-sm mb-8">
        Show your take on the reference cut. Submit your proposal and get votes.
      </p>

      {existingSubmission?.status === 'rejected' && (
        <RejectionBanner
          reason={existingSubmission.rejectionReason}
          onJumpToForm={() => {
            const slot = document.getElementById('challenge-photo-slot-0');
            if (slot) slot.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />
      )}

      {/* Section 2: Submit as (toggle) */}
      {dualEligible && (
        <section className="mb-10">
          <h2 className="text-lg font-black mb-3">Submit as</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSubmitMode('barber')}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-colors ${
                submitMode === 'barber'
                  ? 'bg-brand-yellow text-[#0a0a0a]'
                  : 'bg-[#1a1a1a] text-[#888] hover:text-white'
              }`}
            >
              As barber
            </button>
            <button
              type="button"
              onClick={() => setSubmitMode('shop')}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-colors ${
                submitMode === 'shop'
                  ? 'bg-brand-yellow text-[#0a0a0a]'
                  : 'bg-[#1a1a1a] text-[#888] hover:text-white'
              }`}
            >
              As barbershop
            </button>
          </div>
          <p className="text-[11px] text-[#555] mt-2">
            You can submit one entry per category.
          </p>
        </section>
      )}

      {/* Section 1: Reference photos */}
      <section className="mb-10">
        <h2 className="text-lg font-black mb-1">Download the reference photos</h2>
        <p className="text-xs text-[#888] mb-4">
          Use these four angles as your reference for the cut.
        </p>
        {referencePhotos.length === 0 ? (
          <div className="border border-dashed border-[#333] rounded-[16px] p-8 text-center bg-[#0a0a0a] text-[#666] text-sm">
            Reference photos coming soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {referencePhotos.map((url, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#2a2a2a] rounded-[16px] overflow-hidden flex flex-col"
              >
                <div className="aspect-square relative bg-[#0a0a0a]">
                  <Image src={url} alt={referenceLabels[i] || `ref-${i}`} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#888] font-bold uppercase">{referenceLabels[i] || `ref ${i + 1}`}</span>
                  <a
                    href={url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-yellow text-[11px] font-extrabold hover:underline"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Proposal photos */}
      <section className="mb-10">
        <h2 className="text-lg font-black mb-1">Your haircut proposal (1-4 photos)</h2>
        <p className="text-xs text-[#888] mb-4">JPEG, PNG, or WebP. Up to 5MB each — we compress to 1MB.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((slot, i) => (
            <div
              key={i}
              id={i === 0 ? 'challenge-photo-slot-0' : undefined}
              className="aspect-square bg-[#111] rounded-[16px] overflow-hidden border border-dashed border-[#333] relative"
            >
              <input
                ref={el => {
                  photoInputRefs.current[i] = el;
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (f) void handlePhotoPick(i, f);
                }}
              />
              {slot.uploading ? (
                <div className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-brand-yellow">
                  Uploading…
                </div>
              ) : slot.url ? (
                <>
                  <Image src={slot.url} alt={`Proposal ${i + 1}`} fill className="object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => void handlePhotoRemove(i)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-sm hover:bg-brand-red transition-colors"
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => photoInputRefs.current[i]?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center text-[#666] hover:text-brand-yellow text-[12px] font-bold transition-colors"
                >
                  <span className="text-2xl mb-1">+</span>
                  <span>Add photo</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Video */}
      <section className="mb-10">
        <h2 className="text-lg font-black mb-1">Optional: a short video of your work (max 30s)</h2>
        <p className="text-xs text-[#888] mb-4">MP4 or MOV. Max 10MB.</p>
        <input
          ref={el => {
            videoInputRef.current = el;
          }}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) void handleVideoPick(f);
          }}
        />
        <div className="bg-[#111] rounded-[16px] overflow-hidden border border-dashed border-[#333] relative aspect-video max-w-[420px]">
          {videoUploading ? (
            <div className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-brand-yellow">
              Uploading…
            </div>
          ) : videoUrl ? (
            <>
              <video src={videoUrl} className="w-full h-full object-cover" controls preload="metadata" />
              <button
                type="button"
                onClick={() => void handleVideoRemove()}
                className="absolute top-2 right-2 w-8 h-8 z-10 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-sm hover:bg-brand-red transition-colors"
                aria-label="Remove video"
              >
                ✕
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center text-[#666] hover:text-brand-yellow text-[12px] font-bold transition-colors"
            >
              <span className="text-2xl mb-1">+</span>
              <span>Add video</span>
            </button>
          )}
        </div>
      </section>

      {/* Section 5: Description */}
      <section className="mb-10">
        <h2 className="text-lg font-black mb-1">Notes (optional)</h2>
        <p className="text-xs text-[#888] mb-3">Tell us anything about the cut.</p>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_CHARS))}
          rows={5}
          maxLength={MAX_DESCRIPTION_CHARS}
          className="w-full bg-[#111] border border-[#2a2a2a] rounded-[16px] p-4 text-sm text-white placeholder-[#555] focus:border-brand-yellow focus:outline-none transition-colors resize-none"
          placeholder="Technique, products used, fade type, finishing details…"
        />
        <div className="text-right text-[11px] text-[#555] mt-1 font-bold">
          {description.length}/{MAX_DESCRIPTION_CHARS}
        </div>
      </section>

      {/* Section 6: Terms */}
      <section className="mb-10">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 accent-brand-yellow"
          />
          <span className="text-sm text-[#ccc]">
            I accept the{' '}
            <a href="/terms" target="_blank" rel="noreferrer" className="text-brand-yellow font-bold hover:underline">
              titeZMe Challenge terms
            </a>
            .
          </span>
        </label>
      </section>

      {/* Errors */}
      {errorMsg && (
        <div className="mb-6 bg-[#3a1010] border border-brand-red/40 rounded-[16px] p-4 text-brand-red text-sm font-bold">
          {errorMsg}
        </div>
      )}

      {/* Section 7: Submit */}
      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={!canSubmit}
        className={`w-full sm:w-auto px-8 py-3 rounded-xl font-black text-sm transition-colors ${
          canSubmit
            ? 'bg-brand-yellow text-[#0a0a0a] hover:opacity-90'
            : 'bg-[#1a1a1a] text-[#555] cursor-not-allowed'
        }`}
      >
        {submitting ? 'Submitting…' : 'Submit and continue to payment'}
      </button>
    </div>
  );
}
