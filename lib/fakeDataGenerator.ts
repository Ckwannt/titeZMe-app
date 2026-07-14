// ─── Name pools ──────────────────────────────────────────────────────────────

const firstNames = [
  'Carlos','Miguel','Alejandro','David','Pablo','Sergio','Javier','Antonio',
  'Fernando','Roberto','Diego','Raúl','Adrián','Iván','Óscar','Rubén','Álvaro',
  'Youssef','Karim','Mehdi','Amine','Ibrahim','Bilal','Omar','Tariq',
  'Juan','Luis','Andrés','Santiago','Mateo','Nicolás','Sebastián','Felipe',
  'Moussa','Ibrahima','Cheikh','Mamadou',
];

const spanishSurnames = [
  'García','Martínez','López','Sánchez','Rodríguez','Fernández','González',
  'Pérez','Torres','Ramírez','Flores','Rivera','Morales','Jiménez','Ruiz',
  'Díaz','Hernández','Álvarez','Romero','Alonso','Navarro','Gutiérrez',
  'Serrano','Molina','Blanco','Castro','Ortiz','Delgado','Vega','Reyes',
];

const arabicFirstNames = ['Youssef','Karim','Mehdi','Amine','Ibrahim','Bilal','Omar','Tariq'];
const arabicSurnames   = ['El Amrani','Benali','Ouali','Haddad','El Fassi','Bensalem','Chakir'];
const africanFirstNames = ['Moussa','Ibrahima','Cheikh','Mamadou'];
const africanSurnames   = ['Diallo','Traoré','Konaté','Mbaye','Coulibaly','Sylla'];

// ─── Cities (weighted) ───────────────────────────────────────────────────────

const cityPool = [
  { city: 'Madrid',    country: 'ES', lat: 40.4168, lng: -3.7038, weight: 35 },
  { city: 'Barcelona', country: 'ES', lat: 41.3851, lng:  2.1734, weight: 30 },
  { city: 'Valencia',  country: 'ES', lat: 39.4699, lng: -0.3763, weight: 12 },
  { city: 'Málaga',    country: 'ES', lat: 36.7213, lng: -4.4214, weight:  8 },
  { city: 'Sevilla',   country: 'ES', lat: 37.3891, lng: -5.9845, weight:  6 },
  { city: 'Bilbao',    country: 'ES', lat: 43.2630, lng: -2.9350, weight:  3 },
  { city: 'Zaragoza',  country: 'ES', lat: 41.6488, lng: -0.8891, weight:  2 },
  { city: 'Alicante',  country: 'ES', lat: 38.3452, lng: -0.4810, weight:  2 },
  { city: 'Granada',   country: 'ES', lat: 37.1773, lng: -3.5986, weight:  1 },
  { city: 'Murcia',    country: 'ES', lat: 37.9922, lng: -1.1307, weight:  1 },
];

// ─── Other pools ─────────────────────────────────────────────────────────────

const servicePool = [
  { name: 'Corte de pelo',    minPrice: 10, maxPrice: 18, duration: 30 },
  { name: 'Corte + Barba',    minPrice: 18, maxPrice: 28, duration: 45 },
  { name: 'Arreglo de barba', minPrice:  8, maxPrice: 15, duration: 20 },
  { name: 'Afeitado clásico', minPrice: 12, maxPrice: 20, duration: 30 },
  { name: 'Degradado / Fade', minPrice: 12, maxPrice: 18, duration: 35 },
  { name: 'Corte infantil',   minPrice:  8, maxPrice: 12, duration: 25 },
];

const bioPool = [
  'Especialista en degradados y cortes modernos. Más de 8 años de experiencia.',
  'Barbero profesional con pasión por los cortes clásicos y modernos.',
  'Experto en barba y cabello. Formado en las mejores barberías de España.',
  'Cortes de precisión y estilos únicos. Tu imagen, mi arte.',
  'Especializado en fades y diseños. Cada corte es una obra de arte.',
  'Barbero con más de 10 años de experiencia. Especialista en barba clásica.',
  'Fusiono técnicas tradicionales con tendencias actuales para un resultado único.',
  'Apasionado del estilo masculino. Degradados, barba y mucho más.',
];

const reviewerNames = [
  'Youssef M.','Carlos R.','Pablo G.','Ahmed K.','Luis T.',
  'Miguel A.','David S.','Omar B.','Andrés F.','Sergio L.',
  'Javier P.','Rubén D.','Ibrahim H.','Mateo C.','Álvaro N.',
];

const reviewComments = [
  'El mejor barbero del barrio, siempre puntual y profesional.',
  'Corte perfecto, muy contento con el resultado.',
  'Gran profesional, se nota la experiencia.',
  'Muy buen trato y resultado excelente. Repetiré sin duda.',
  'El fade quedó increíble, totalmente recomendado.',
  'Rápido, limpio y muy buen precio. 10/10.',
  'Llevo meses viniendo y siempre quedo satisfecho.',
  'Sabe exactamente lo que quieres sin explicarlo mucho.',
  'El mejor corte que me han hecho en mucho tiempo.',
  'Muy profesional y atento. El local muy limpio también.',
];

const shopNamePool = [
  'Barbería El Clásico',"The Gentlemen's Cut",'Barbería Moderna',
  'Kings & Cuts','La Navaja de Oro','Barber Club','El Rincón del Barbero',
  'Premium Barber Studio','Barbería Urbana','The Barber Society',
  'Estilo Barbería','Cortes & Estilo','Barbería Élite','Sharp Cuts',
  'Barbería Central','The Classic Barber','Navaja & Tijera',
  'Barbería Clásica','Urban Barber','Barbería Vintage',
];

const specialtyPool = ['Fade','Barba','Clásico','Degradado','Diseño','Afeitado'];

const streetNames = [
  'Calle Mayor','Calle Gran Vía','Calle Alcalá','Calle Princesa',
  'Calle Serrano','Calle Velázquez','Calle Goya','Calle Fuencarral',
  'Avenida Diagonal','Carrer de Balmes','Carrer Aragó','Passeig de Gràcia',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function pickWeightedCity() {
  const total = cityPool.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of cityPool) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return cityPool[0];
}

function generateName(): { firstName: string; lastName: string } {
  const firstName = pick(firstNames);
  if (arabicFirstNames.includes(firstName))  return { firstName, lastName: pick(arabicSurnames) };
  if (africanFirstNames.includes(firstName)) return { firstName, lastName: pick(africanSurnames) };
  const s1 = pick(spanishSurnames);
  let s2 = pick(spanishSurnames);
  while (s2 === s1) s2 = pick(spanishSurnames);
  return { firstName, lastName: `${s1} ${s2}` };
}

function generatePhoto(): string {
  const isMen = Math.random() < 0.7;
  const idx = randInt(1, 99);
  return isMen
    ? `https://randomuser.me/api/portraits/men/${idx}.jpg`
    : `https://randomuser.me/api/portraits/women/${idx}.jpg`;
}

function generateWeeklyHours(): { days: string[]; opensAt: string; closesAt: string } {
  const r = Math.random();
  if (r < 0.60) return { days: ['Mon','Tue','Wed','Thu','Fri','Sat'], opensAt: '09:00', closesAt: '19:00' };
  if (r < 0.85) return { days: ['Tue','Wed','Thu','Fri','Sat','Sun'], opensAt: '10:00', closesAt: '20:00' };
  return            { days: ['Mon','Tue','Wed','Thu','Fri'],         opensAt: '09:00', closesAt: '18:00' };
}

function generateServices(): FakeService[] {
  const count = randInt(3, 5);
  const pool = [...servicePool];
  const out: FakeService[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const spec = pool.splice(idx, 1)[0];
    out.push({ name: spec.name, price: randInt(spec.minPrice, spec.maxPrice), duration: spec.duration });
  }
  return out;
}

function generateReviews(): FakeReview[] {
  const count = randInt(3, 8);
  const out: FakeReview[] = [];
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  for (let i = 0; i < count; i++) {
    out.push({
      rating: Math.random() < 0.5 ? 4 : 5,
      comment: pick(reviewComments),
      clientName: pick(reviewerNames),
      createdAt: now - randInt(0, 180) * DAY,
    });
  }
  return out;
}

function generateLanguages(): string[] {
  const langs = ['es'];
  if (Math.random() < 0.5) langs.push(Math.random() < 0.5 ? 'en' : 'ar');
  return langs;
}

function generateSpecialties(): string[] {
  const count = randInt(2, 3);
  const pool = [...specialtyPool];
  const out: string[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function generateRating(): number {
  return Math.round((4.2 + Math.random() * 0.8) * 10) / 10;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FakeService {
  name: string;
  price: number;
  duration: number;
}

export interface FakeReview {
  rating: number;
  comment: string;
  clientName: string;
  createdAt: number;
}

export interface FakeBarber {
  userId: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  role: 'professional';
  isFake: true;
  city: string;
  country: 'ES';
  createdAt: number;

  bio: string;
  isLive: true;
  isSolo: true;
  approvalStatus: 'approved';
  isVisible: true;
  rating: number;
  reviewCount: number;
  totalCuts: number;
  experienceStartYear: number;
  languages: string[];
  specialties: string[];
  currency: 'EUR';
  lastActive: number;
  profilePhotoUrl: string;
  location: { lat: number; lng: number };

  services: FakeService[];
  weeklyHours: { days: string[]; opensAt: string; closesAt: string };
  reviews: FakeReview[];
}

export interface FakeShop {
  shopId: string;
  name: string;
  description: string;
  status: 'active';
  isFake: true;
  isVisible: true;
  city: string;
  country: 'ES';
  address: { street: string; city: string; country: 'ES' };
  logoUrl: string;
  coverPhotoUrl: string;
  rating: number;
  reviewCount: number;
  chairsCount: number;
  establishedYear: number;
  isFeatured: false;
  barbers: string[];
  createdAt: number;
  location: { lat: number; lng: number };
}

// ─── Generators ──────────────────────────────────────────────────────────────

export function generateFakeBarbers(count: number): FakeBarber[] {
  const out: FakeBarber[] = [];
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const THIRTY_DAYS = 30 * DAY;
  for (let i = 0; i < count; i++) {
    const { firstName, lastName } = generateName();
    const cityEntry = pickWeightedCity();
    const photo = generatePhoto();
    const reviews = generateReviews();
    out.push({
      userId: uid(),
      firstName,
      lastName,
      photoUrl: photo,
      role: 'professional',
      isFake: true,
      city: cityEntry.city,
      country: 'ES',
      createdAt: now - randInt(0, 365) * DAY,

      bio: pick(bioPool),
      isLive: true,
      isSolo: true,
      approvalStatus: 'approved',
      isVisible: true,
      rating: generateRating(),
      reviewCount: reviews.length,
      totalCuts: randInt(80, 600),
      experienceStartYear: randInt(2010, 2022),
      languages: generateLanguages(),
      specialties: generateSpecialties(),
      currency: 'EUR',
      lastActive: now - Math.floor(Math.random() * THIRTY_DAYS),
      profilePhotoUrl: photo,
      location: { lat: cityEntry.lat, lng: cityEntry.lng },

      services: generateServices(),
      weeklyHours: generateWeeklyHours(),
      reviews,
    });
  }
  return out;
}

export function generateFakeShops(count: number): FakeShop[] {
  const out: FakeShop[] = [];
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  for (let i = 0; i < count; i++) {
    const cityEntry = pickWeightedCity();
    const baseName = shopNamePool[i % shopNamePool.length];
    const logo = generatePhoto();
    out.push({
      shopId: uid(),
      name: `${baseName} ${cityEntry.city}`,
      description: pick(bioPool),
      status: 'active',
      isFake: true,
      isVisible: true,
      city: cityEntry.city,
      country: 'ES',
      address: {
        street: `${pick(streetNames)}, ${randInt(1, 200)}`,
        city: cityEntry.city,
        country: 'ES',
      },
      logoUrl: logo,
      coverPhotoUrl: generatePhoto(),
      rating: generateRating(),
      reviewCount: randInt(5, 40),
      chairsCount: randInt(2, 8),
      establishedYear: randInt(2010, 2022),
      isFeatured: false,
      barbers: [],
      createdAt: now - randInt(0, 365) * DAY,
      location: { lat: cityEntry.lat, lng: cityEntry.lng },
    });
  }
  return out;
}
