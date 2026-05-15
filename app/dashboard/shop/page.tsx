'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { getLocalDateString, getTimezoneFromLocation } from "@/lib/schedule-utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShopData {
  name?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  contactPhone?: string;
  coverPhotoUrl?: string;
  currency?: string;
  city?: string;
  country?: string;
}

interface BarberProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  rating?: number;
  reviewCount?: number;
  shopId?: string;
}

interface Booking {
  id: string;
  barberId?: string;
  shopId?: string;
  status?: string;
  date?: string;
  price?: number;
  totalDuration?: number;
  startTime?: string;
}

interface Invite {
  id: string;
  shopId?: string;
  status?: string;
  barberName?: string;
  barberEmail?: string;
}

interface BarberSchedule {
  availableSlots?: Record<string, string[]>;
}

interface BarberStats {
  cuts: number;
  hours: number;
  earned: number;
  cutsThisWeek: number;
  workingToday: boolean;
  cutsToday: number;
  nextAppointment?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrencySymbol(currency?: string): string {
  const map: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    MAD: "DH",
    DZD: "DA",
    TND: "DT",
    AED: "AED",
    SAR: "SAR",
  };
  return map[currency ?? "EUR"] ?? currency ?? "€";
}

function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getPrevYearMonth(): string {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const mon = new Date(now);
  mon.setDate(now.getDate() + diffToMon);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { start: fmt(mon), end: fmt(sun) };
}

function barberInitials(b: BarberProfile): string {
  return (b.firstName?.[0] ?? "?").toUpperCase();
}

function barberFullName(b: BarberProfile): string {
  return `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim() || "Unknown";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopOverviewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [shop, setShop] = useState<ShopData | null>(null);
  const [barbers, setBarbers] = useState<BarberProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [schedules, setSchedules] = useState<Record<string, BarberSchedule>>({});
  const [services, setServices] = useState<unknown[]>([]);
  const [expandedBarber, setExpandedBarber] = useState<string | null>(null);

  // Redirect if not authed
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  // ── Fetch shop (one-time) ──
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "barbershops", user.uid)).then((snap) => {
      if (snap.exists()) setShop(snap.data() as ShopData);
    });
  }, [user]);

  // ── Live: barbers ──
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "barberProfiles"), where("shopId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setBarbers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BarberProfile)));
    });
    return unsub;
  }, [user]);

  // ── Live: bookings ──
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "bookings"), where("shopId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking)));
    });
    return unsub;
  }, [user]);

  // ── Live: pending invites ──
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "invites"),
      where("shopId", "==", user.uid),
      where("status", "==", "pending")
    );
    const unsub = onSnapshot(q, (snap) => {
      setInvites(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invite)));
    });
    return unsub;
  }, [user]);

  // ── Fetch schedules + services after barbers load ──
  useEffect(() => {
    if (!user || barbers.length === 0) return;

    // Schedules
    const fetchSchedules = async () => {
      const result: Record<string, BarberSchedule> = {};
      await Promise.all(
        barbers.map(async (b) => {
          const snap = await getDoc(doc(db, "schedules", `${b.id}_shard_0`));
          if (snap.exists()) result[b.id] = snap.data() as BarberSchedule;
        })
      );
      setSchedules(result);
    };
    fetchSchedules();

    // Services (shop-level)
    const fetchServices = async () => {
      const q = query(
        collection(db, "services"),
        where("providerId", "==", user.uid),
        where("providerType", "==", "shop")
      );
      const snap = await getDocs(q);
      setServices(snap.docs.map((d) => d.data()));
    };
    fetchServices();
  }, [user, barbers]);

  // ─── Derived data ────────────────────────────────────────────────────────────

  const currencySymbol = getCurrencySymbol(shop?.currency);
  const ym = getCurrentYearMonth();
  const prevYm = getPrevYearMonth();
  const week = getWeekRange();

  const completedBookings = bookings.filter((b) => b.status === "completed");

  const thisMonthCompleted = completedBookings.filter((b) => b.date?.startsWith(ym));
  const prevMonthCompleted = completedBookings.filter((b) => b.date?.startsWith(prevYm));

  const monthRevenue = thisMonthCompleted.reduce((s, b) => s + (b.price ?? 0), 0);
  const prevMonthRevenue = prevMonthCompleted.reduce((s, b) => s + (b.price ?? 0), 0);
  const revDeltaPct =
    prevMonthRevenue > 0
      ? Math.round(((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
      : null;

  const monthCuts = thisMonthCompleted.length;
  const monthMinutes = thisMonthCompleted.reduce((s, b) => s + (b.totalDuration ?? 0), 0);
  const monthHours = (monthMinutes / 60).toFixed(1);

  const barbersWithRatings = barbers.filter((b) => (b.reviewCount ?? 0) > 0 && (b.rating ?? 0) > 0);
  const avgRating =
    barbersWithRatings.length > 0
      ? (barbersWithRatings.reduce((s, b) => s + (b.rating ?? 0), 0) / barbersWithRatings.length).toFixed(1)
      : null;
  const totalReviews = barbers.reduce((s, b) => s + (b.reviewCount ?? 0), 0);

  // Today's date (timezone-aware)
  const timezone = getTimezoneFromLocation(shop?.city, shop?.address?.country ?? shop?.country);
  const todayDate = getLocalDateString(timezone);

  // Per-barber stats
  const barberStatsMap: Record<string, BarberStats> = {};
  for (const b of barbers) {
    const barberBookings = completedBookings.filter((bk) => bk.barberId === b.id);
    const thisMonth = barberBookings.filter((bk) => bk.date?.startsWith(ym));
    const thisWeek = barberBookings.filter(
      (bk) => bk.date && bk.date >= week.start && bk.date <= week.end
    );

    const sched = schedules[b.id];
    const workingToday = (sched?.availableSlots?.[todayDate]?.length ?? 0) > 0;

    const allTodayBookings = bookings.filter(
      (bk) => bk.barberId === b.id && bk.date === todayDate && bk.status !== "cancelled"
    );
    const cutsToday = allTodayBookings.filter((bk) => bk.status === "completed").length;

    // Find next appointment: future booking today (by startTime)
    const now = new Date();
    const nowHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const upcoming = allTodayBookings
      .filter((bk) => bk.startTime && bk.startTime > nowHHMM && bk.status !== "completed")
      .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));

    barberStatsMap[b.id] = {
      cuts: thisMonth.length,
      hours: parseFloat((thisMonth.reduce((s, bk) => s + (bk.totalDuration ?? 0), 0) / 60).toFixed(1)),
      earned: thisMonth.reduce((s, bk) => s + (bk.price ?? 0), 0),
      cutsThisWeek: thisWeek.length,
      workingToday,
      cutsToday,
      nextAppointment: upcoming[0]?.startTime,
    };
  }

  // ─── Completion bar ───────────────────────────────────────────────────────────

  const hasScheduleSlots = Object.values(schedules).some(
    (s) => s.availableSlots && Object.keys(s.availableSlots).length > 0
  );
  const hasEverCompleted = completedBookings.length > 0;

  const completionItems: { label: string; done: boolean; pct: number; href: string }[] = [
    {
      label: "Add a cover photo",
      done: !!shop?.coverPhotoUrl,
      pct: 10,
      href: "/dashboard/shop/settings",
    },
    {
      label: "Write a description (20+ chars)",
      done: (shop?.description?.length ?? 0) > 20,
      pct: 10,
      href: "/dashboard/shop/settings",
    },
    {
      label: "Set full address",
      done: !!(shop?.address?.street && shop?.address?.city && shop?.address?.postalCode),
      pct: 15,
      href: "/dashboard/shop/settings",
    },
    {
      label: "Add at least one service",
      done: services.length > 0,
      pct: 15,
      href: "/dashboard/shop/services",
    },
    {
      label: "Set availability",
      done: hasScheduleSlots,
      pct: 15,
      href: "/dashboard/shop/availability",
    },
    {
      label: "Add contact phone",
      done: !!shop?.contactPhone,
      pct: 10,
      href: "/dashboard/shop/settings",
    },
    {
      label: "Invite a barber",
      done: barbers.length > 0,
      pct: 10,
      href: "/dashboard/shop/team",
    },
    {
      label: "Complete your first booking",
      done: hasEverCompleted,
      pct: 15,
      href: "/dashboard/shop/bookings",
    },
  ];
  const completionPct = completionItems.filter((c) => c.done).reduce((s, c) => s + c.pct, 0);
  const missingItems = completionItems.filter((c) => !c.done).slice(0, 3);

  // ─── Loading state ────────────────────────────────────────────────────────────

  if (loading || (!shop && user)) {
    return (
      <div className="p-6 md:p-8 md:px-10">
        <div className="h-8 w-48 bg-[#1a1a1a] rounded-xl mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 h-[96px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 md:px-10">

      {/* Header */}
      <div className="animate-fadeUp flex flex-col md:flex-row justify-between items-start mb-7 gap-4">
        <div>
          <h1 className="text-2xl font-black">Overview 🏪</h1>
          <p className="text-[#888] text-sm mt-1">
            {getMonthLabel()} · {barbers.length} barber{barbers.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="animate-fadeUp grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {/* Revenue */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex flex-col gap-1.5">
          <div className="text-[28px] font-black leading-none text-[#F5C518]">
            {currencySymbol}{monthRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#888] font-bold">Monthly Revenue</div>
          <div className="text-[11px] font-extrabold text-[#444] mt-1">
            {revDeltaPct !== null
              ? `${revDeltaPct >= 0 ? "+" : ""}${revDeltaPct}% vs last month`
              : "No data last month"}
          </div>
        </div>

        {/* Cuts */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex flex-col gap-1.5">
          <div className="text-[28px] font-black leading-none text-[#E8491D]">{monthCuts}</div>
          <div className="text-xs text-[#888] font-bold">Total Cuts</div>
          <div className="text-[11px] font-extrabold text-[#444] mt-1">This month</div>
        </div>

        {/* Hours */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex flex-col gap-1.5">
          <div className="text-[28px] font-black leading-none text-[#60a5fa]">{monthHours}h</div>
          <div className="text-xs text-[#888] font-bold">Total Hours</div>
          <div className="text-[11px] font-extrabold text-[#444] mt-1">Across all barbers</div>
        </div>

        {/* Rating */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex flex-col gap-1.5">
          <div className="text-[28px] font-black leading-none text-[#22C55E]">
            {avgRating ?? "New ✨"}
          </div>
          <div className="text-xs text-[#888] font-bold">Shop Rating</div>
          <div className="text-[11px] font-extrabold text-[#444] mt-1">
            {totalReviews > 0 ? `★ ${totalReviews} review${totalReviews !== 1 ? "s" : ""}` : "No reviews yet"}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-fadeUp flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => router.push("/dashboard/shop/team")}
          className="border border-[#2a2a2a] text-[#888] hover:border-[#F5C518] hover:text-[#F5C518] rounded-full text-[13px] font-extrabold px-5 py-2.5 transition-colors"
        >
          + Invite Barber
        </button>
        <a
          href={`/shop/${user?.uid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#2a2a2a] text-[#888] hover:border-[#F5C518] hover:text-[#F5C518] rounded-full text-[13px] font-extrabold px-5 py-2.5 transition-colors inline-flex items-center"
        >
          👁 View Profile
        </a>
        <button
          onClick={() => router.push("/dashboard/shop/availability")}
          className="border border-[#2a2a2a] text-[#888] hover:border-[#F5C518] hover:text-[#F5C518] rounded-full text-[13px] font-extrabold px-5 py-2.5 transition-colors"
        >
          ⏰ Set Hours
        </button>
      </div>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="animate-fadeUp flex flex-col gap-3 mb-6">
          {invites.map((inv) => (
            <div
              key={inv.id}
              className="bg-[#1a1500] border border-[#F5C518]/30 rounded-[14px] p-3.5 px-4 flex items-center gap-3.5"
            >
              <span className="text-xl">📨</span>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-sm">
                  Invite pending: {inv.barberName ?? inv.barberEmail ?? "A barber"}
                </div>
                <div className="text-xs text-[#888] mt-0.5">Waiting for response</div>
              </div>
              <span className="text-[#F5C518] text-[11px] font-extrabold shrink-0">PENDING</span>
            </div>
          ))}
        </div>
      )}

      {/* Today's Team Status */}
      <div className="animate-fadeUp mb-6">
        <div className="font-extrabold text-base mb-3">Working today</div>
        {barbers.length === 0 ? (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 text-[#555] text-sm">
            No barbers in your shop yet.{" "}
            <Link href="/dashboard/shop/team" className="text-[#F5C518] hover:underline">
              Invite one
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {barbers.map((b) => {
              const stats = barberStatsMap[b.id];
              return (
                <div
                  key={b.id}
                  className="bg-[#111] border border-[#1e1e1e] rounded-[14px] p-4 px-4.5 flex items-center gap-3.5"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-base font-black text-white shrink-0">
                    {barberInitials(b)}
                  </div>
                  {/* Name + status */}
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-[14px] truncate">{barberFullName(b)}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[10px] font-extrabold ${stats?.workingToday ? "text-[#22C55E]" : "text-[#555]"}`}
                      >
                        ● {stats?.workingToday ? "Working now" : "Off today"}
                      </span>
                      {stats?.cutsToday !== undefined && (
                        <span className="text-[10px] text-[#555]">· {stats.cutsToday} cuts today</span>
                      )}
                    </div>
                  </div>
                  {/* Next appt */}
                  {stats?.nextAppointment && (
                    <div className="text-[11px] text-[#888] font-bold shrink-0">
                      Next: {stats.nextAppointment}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shop Completion Bar */}
      <div className="animate-fadeUp bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[13px] font-extrabold text-[#888]">Shop completion</span>
          <span className="text-[13px] font-black text-[#F5C518]">{completionPct}%</span>
        </div>
        <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[#F5C518] rounded-full transition-all"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        {missingItems.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {missingItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-[12px]">
                <span className="text-[#E8491D]">✗</span>
                <span className="text-[#888] flex-1">{item.label}</span>
                <Link
                  href={item.href}
                  className="text-[#F5C518] font-extrabold hover:underline shrink-0"
                >
                  → Fix
                </Link>
              </div>
            ))}
          </div>
        )}
        {missingItems.length === 0 && (
          <div className="text-[12px] text-[#22C55E] font-extrabold">✓ Shop fully set up!</div>
        )}
      </div>

      {/* Barber Roster */}
      <div className="animate-fadeUp">
        <div className="font-extrabold text-base mb-4">Your Barbers — {getMonthLabel()}</div>
        {barbers.length === 0 ? (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 text-[#555] text-sm">
            No barbers yet.{" "}
            <Link href="/dashboard/shop/team" className="text-[#F5C518] hover:underline">
              Invite your first barber
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {barbers.map((b) => {
              const stats = barberStatsMap[b.id];
              const isExpanded = expandedBarber === b.id;
              const avgPrice =
                stats && stats.cuts > 0 ? Math.round(stats.earned / stats.cuts) : 0;

              return (
                <div
                  key={b.id}
                  className={`bg-[#111] border rounded-[14px] transition-all ${
                    isExpanded ? "border-[#F5C518]" : "border-[#1e1e1e] hover:border-[#2a2a2a]"
                  }`}
                >
                  {/* Row */}
                  <div
                    className="p-4 px-5 cursor-pointer"
                    onClick={() => setExpandedBarber(isExpanded ? null : b.id)}
                  >
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-base font-black text-white shrink-0">
                        {barberInitials(b)}
                      </div>
                      {/* Name + rating */}
                      <div className="flex-1 min-w-[120px]">
                        <div className="font-extrabold text-[15px]">{barberFullName(b)}</div>
                        <div className="text-xs text-[#888] leading-none mt-0.5">
                          {(b.rating ?? 0) > 0 ? `★ ${b.rating}` : "No rating yet"}
                        </div>
                      </div>
                      {/* Stats */}
                      <div className="flex gap-4 sm:gap-6 order-last sm:order-none w-full sm:w-auto mt-3 sm:mt-0 justify-around sm:justify-end">
                        <div className="text-center min-w-[60px]">
                          <div className="font-black text-base text-white">{stats?.cuts ?? 0}</div>
                          <div className="text-[10px] text-[#888] font-bold tracking-wide">cuts</div>
                        </div>
                        <div className="text-center min-w-[60px]">
                          <div className="font-black text-base text-white">{stats?.hours ?? 0}h</div>
                          <div className="text-[10px] text-[#888] font-bold tracking-wide">hours</div>
                        </div>
                        <div className="text-center min-w-[60px]">
                          <div className="font-black text-base text-[#F5C518]">
                            {currencySymbol}{(stats?.earned ?? 0).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-[#888] font-bold tracking-wide">earned</div>
                        </div>
                      </div>
                      <span className="text-[#555] text-lg hidden sm:block w-4 text-center shrink-0">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-[#1e1e1e]">
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-[10px] p-3 px-3.5">
                          <div className="font-black text-lg">
                            {currencySymbol}{avgPrice}
                          </div>
                          <div className="text-[11px] text-[#888] mt-0.5">Avg cut price</div>
                        </div>
                        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-[10px] p-3 px-3.5">
                          <div className="font-black text-lg">{stats?.cutsThisWeek ?? 0}</div>
                          <div className="text-[11px] text-[#888] mt-0.5">Bookings this week</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3.5">
                        <Link
                          href={`/barber/${b.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-transparent text-white border border-[#2a2a2a] px-4 py-2 rounded-full font-extrabold text-xs hover:border-[#555] transition-colors"
                        >
                          View profile →
                        </Link>
                        <button className="bg-[#1a0808] border border-[#3b1a1a] text-[#ef4444] rounded-full px-4 py-2 font-extrabold text-xs hover:bg-[#ef4444]/20 transition-colors">
                          Remove from shop
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
