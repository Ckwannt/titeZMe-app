// Profession Registry — v1 (Madrid launch, all professions enabled).
//
// Three small ID-based static registries. Display labels are NOT stored here —
// they live in lib/i18n/translations.ts under the `category`, `businessType`,
// and `profession` (+ `profession.specialties`) namespaces, keyed by the exact
// ids below. This keeps the app's EN/FR/ES support intact: an id like
// 'skin_fade' resolves via t('profession.specialties.skin_fade').
//
// Emoji (not lucide icons) per the architecture doc: lucide-react isn't
// installed and CLAUDE.md rules out icon libraries — plain emoji matches the
// vibe/clientele chip pattern the onboarding page already uses.
//
// Source of truth: titeZMe-profession-taxonomy.md (categories/colors/tiers/
// business types/emoji) + titeZMe-translations-en-es.md (ids + EN/ES labels).
// Scope: the 27 professions fully specified in the EN/ES doc. The 18 "expansion
// draft" professions are intentionally omitted until their ids/specialty
// ids/Spanish are defined.

export interface Category {
  id: string;
  color: string;
  emoji: string;
}

export interface BusinessType {
  id: string;
  emoji: string;
}

export interface Profession {
  id: string;
  categoryId: string;
  tier: 'artist' | 'specialist';
  defaultBusinessTypeId: string;
  emoji: string;
  enabled: boolean;
  specialties: string[]; // specialty IDs — labels via translations.ts
}

export const categories: Category[] = [
  { id: 'hair', color: '#8B5E3C', emoji: '💇' },
  { id: 'nails', color: '#E85D9E', emoji: '💅' },
  { id: 'skin', color: '#F4A261', emoji: '🧴' },
  { id: 'makeup', color: '#C77DFF', emoji: '💄' },
  { id: 'tattoo', color: '#2B2D42', emoji: '🎨' },
  { id: 'brows_lashes', color: '#6A4C93', emoji: '👁️' },
  { id: 'waxing', color: '#F9C74F', emoji: '🪒' },
  { id: 'massage', color: '#43AA8B', emoji: '💆' },
  { id: 'fitness', color: '#F94144', emoji: '💪' },
  { id: 'mental_health', color: '#577590', emoji: '🧠' },
  { id: 'dental', color: '#2D9CDB', emoji: '🦷' },
  { id: 'medical_aesthetics', color: '#F3722C', emoji: '💉' },
  { id: 'alt_medicine', color: '#90BE6D', emoji: '🌿' },
  { id: 'podiatry', color: '#4D908E', emoji: '🦶' },
  { id: 'bridal_events', color: '#B76E79', emoji: '🎉' },
];

// Business type emoji reuses the parent profession's emoji (taxonomy doc).
export const businessTypes: BusinessType[] = [
  { id: 'barbershop', emoji: '💈' },
  { id: 'hair_salon', emoji: '💇' },
  { id: 'trichology_clinic', emoji: '🔬' },
  { id: 'nail_salon', emoji: '💅' },
  { id: 'skin_clinic', emoji: '🧖' },
  { id: 'dermatology_clinic', emoji: '🩺' },
  { id: 'makeup_studio', emoji: '💄' },
  { id: 'tattoo_studio', emoji: '🖋️' },
  { id: 'piercing_studio', emoji: '💎' },
  { id: 'lash_studio', emoji: '👁️' },
  { id: 'brow_studio', emoji: '✏️' },
  { id: 'waxing_studio', emoji: '🪒' },
  { id: 'electrolysis_clinic', emoji: '⚡' },
  { id: 'massage_studio', emoji: '💆' },
  { id: 'physio_clinic', emoji: '🩹' },
  { id: 'gym', emoji: '🏋️' },
  { id: 'yoga_studio', emoji: '🧘' },
  { id: 'pilates_studio', emoji: '🤸' },
  { id: 'mental_health_clinic', emoji: '🧠' },
  { id: 'counseling_practice', emoji: '💬' },
  { id: 'dental_clinic', emoji: '🦷' },
  { id: 'medical_aesthetics_clinic', emoji: '💉' },
  { id: 'acupuncture_clinic', emoji: '📍' },
  { id: 'chiropractic_clinic', emoji: '🦴' },
  { id: 'podiatry_clinic', emoji: '🦶' },
  { id: 'bridal_events_studio', emoji: '🎉' },
];

export const professions: Profession[] = [
  {
    id: 'barber',
    categoryId: 'hair',
    tier: 'artist',
    defaultBusinessTypeId: 'barbershop',
    emoji: '💈',
    enabled: true,
    specialties: [
      'skin_fade', 'low_fade', 'mid_fade', 'high_fade', 'taper', 'classic_cut',
      'textured_crop', 'buzz_cut', 'line_up', 'beard_trim', 'hot_towel_shave',
      'locs', 'curly_afro', 'kids_cut', 'design_cut', 'colour_bleach',
      'hair_beard_combo',
    ],
  },
  {
    id: 'hairdresser',
    categoryId: 'hair',
    tier: 'artist',
    defaultBusinessTypeId: 'hair_salon',
    emoji: '💇',
    enabled: true,
    specialties: [
      'balayage', 'highlights', 'blowout', 'updo', 'extensions', 'perm',
      'keratin', 'layered_cut', 'bridal_styling', 'kids_cut',
    ],
  },
  {
    id: 'colorist',
    categoryId: 'hair',
    tier: 'artist',
    defaultBusinessTypeId: 'hair_salon',
    emoji: '🎨',
    enabled: true,
    specialties: [
      'balayage', 'ombre', 'highlights', 'root_touchup', 'color_correction',
      'fantasy_colors', 'grey_coverage', 'toning',
    ],
  },
  {
    id: 'trichologist',
    categoryId: 'hair',
    tier: 'specialist',
    defaultBusinessTypeId: 'trichology_clinic',
    emoji: '🔬',
    enabled: true,
    specialties: [
      'hair_loss_diagnosis', 'scalp_treatment', 'alopecia_consult',
      'dandruff_treatment', 'hair_density_analysis',
    ],
  },
  {
    id: 'nail_artist',
    categoryId: 'nails',
    tier: 'artist',
    defaultBusinessTypeId: 'nail_salon',
    emoji: '💅',
    enabled: true,
    specialties: [
      'acrylic', 'gel', 'dip_powder', 'nail_art', 'french_manicure', 'gel_x',
      'pedicure', 'nail_repair', 'nail_art_3d', 'chrome_nails',
    ],
  },
  {
    id: 'esthetician',
    categoryId: 'skin',
    tier: 'artist',
    defaultBusinessTypeId: 'skin_clinic',
    emoji: '🧖',
    enabled: true,
    specialties: [
      'classic_facial', 'chemical_peel', 'microdermabrasion', 'acne_treatment',
      'anti_aging_facial', 'hydrafacial', 'led_therapy', 'extractions',
    ],
  },
  {
    id: 'dermatologist',
    categoryId: 'skin',
    tier: 'specialist',
    defaultBusinessTypeId: 'dermatology_clinic',
    emoji: '🩺',
    enabled: true,
    specialties: [
      'acne_treatment', 'skin_cancer_screening', 'mole_check',
      'psoriasis_treatment', 'eczema_treatment', 'cosmetic_dermatology',
    ],
  },
  {
    id: 'makeup_artist',
    categoryId: 'makeup',
    tier: 'artist',
    defaultBusinessTypeId: 'makeup_studio',
    emoji: '💄',
    enabled: true,
    specialties: [
      'bridal_makeup', 'editorial_makeup', 'special_occasion', 'airbrush',
      'natural_look', 'glam_makeup', 'sfx_makeup',
    ],
  },
  {
    id: 'tattoo_artist',
    categoryId: 'tattoo',
    tier: 'artist',
    defaultBusinessTypeId: 'tattoo_studio',
    emoji: '🖋️',
    enabled: true,
    specialties: [
      'blackwork', 'realism', 'traditional', 'fine_line', 'watercolor',
      'cover_up', 'anime_manga', 'lettering', 'tribal', 'geometric',
    ],
  },
  {
    id: 'piercer',
    categoryId: 'tattoo',
    tier: 'artist',
    defaultBusinessTypeId: 'piercing_studio',
    emoji: '💎',
    enabled: true,
    specialties: [
      'ear_piercing', 'nose_piercing', 'belly_piercing', 'cartilage_piercing',
      'dermal_piercing',
    ],
  },
  {
    id: 'lash_tech',
    categoryId: 'brows_lashes',
    tier: 'artist',
    defaultBusinessTypeId: 'lash_studio',
    emoji: '👁️',
    enabled: true,
    specialties: [
      'classic_lashes', 'volume_lashes', 'hybrid_lashes', 'lash_lift',
      'lash_tint',
    ],
  },
  {
    id: 'brow_specialist',
    categoryId: 'brows_lashes',
    tier: 'artist',
    defaultBusinessTypeId: 'brow_studio',
    emoji: '✏️',
    enabled: true,
    specialties: [
      'microblading', 'brow_lamination', 'brow_threading', 'brow_tinting',
      'ombre_brows',
    ],
  },
  {
    id: 'waxing_specialist',
    categoryId: 'waxing',
    tier: 'artist',
    defaultBusinessTypeId: 'waxing_studio',
    emoji: '🪒',
    enabled: true,
    specialties: [
      'full_body_wax', 'brazilian_wax', 'facial_waxing', 'eyebrow_waxing',
      'leg_waxing',
    ],
  },
  {
    id: 'electrologist',
    categoryId: 'waxing',
    tier: 'specialist',
    defaultBusinessTypeId: 'electrolysis_clinic',
    emoji: '⚡',
    enabled: true,
    specialties: ['permanent_hair_removal', 'electrolysis_consult'],
  },
  {
    id: 'massage_therapist',
    categoryId: 'massage',
    tier: 'artist',
    defaultBusinessTypeId: 'massage_studio',
    emoji: '💆',
    enabled: true,
    specialties: [
      'swedish_massage', 'deep_tissue', 'sports_massage', 'hot_stone',
      'prenatal_massage', 'reflexology', 'thai_massage',
    ],
  },
  {
    id: 'physiotherapist',
    categoryId: 'massage',
    tier: 'specialist',
    defaultBusinessTypeId: 'physio_clinic',
    emoji: '🩹',
    enabled: true,
    specialties: [
      'sports_injury_rehab', 'post_surgery_rehab', 'manual_therapy',
      'chronic_pain', 'postural_correction',
    ],
  },
  {
    id: 'personal_trainer',
    categoryId: 'fitness',
    tier: 'artist',
    defaultBusinessTypeId: 'gym',
    emoji: '🏋️',
    enabled: true,
    specialties: [
      'weight_loss', 'strength_training', 'hiit', 'bodybuilding_prep',
      'functional_training', 'nutrition_coaching',
    ],
  },
  {
    id: 'yoga_instructor',
    categoryId: 'fitness',
    tier: 'artist',
    defaultBusinessTypeId: 'yoga_studio',
    emoji: '🧘',
    enabled: true,
    specialties: [
      'vinyasa', 'hatha', 'prenatal_yoga', 'restorative_yoga', 'power_yoga',
    ],
  },
  {
    id: 'pilates_instructor',
    categoryId: 'fitness',
    tier: 'artist',
    defaultBusinessTypeId: 'pilates_studio',
    emoji: '🤸',
    enabled: true,
    specialties: [
      'mat_pilates', 'reformer_pilates', 'prenatal_pilates', 'rehab_pilates',
    ],
  },
  {
    id: 'psychologist',
    categoryId: 'mental_health',
    tier: 'specialist',
    defaultBusinessTypeId: 'mental_health_clinic',
    emoji: '🧠',
    enabled: true,
    specialties: [
      'anxiety_treatment', 'depression_treatment', 'couples_therapy', 'cbt',
      'trauma_therapy', 'child_psychology',
    ],
  },
  {
    id: 'counselor',
    categoryId: 'mental_health',
    tier: 'specialist',
    defaultBusinessTypeId: 'counseling_practice',
    emoji: '💬',
    enabled: true,
    specialties: [
      'grief_counseling', 'family_therapy', 'addiction_counseling',
      'life_coaching',
    ],
  },
  {
    id: 'dentist',
    categoryId: 'dental',
    tier: 'specialist',
    defaultBusinessTypeId: 'dental_clinic',
    emoji: '🦷',
    enabled: true,
    specialties: [
      'cleaning', 'whitening', 'implants', 'root_canal', 'orthodontics',
      'cosmetic_dentistry', 'emergency_dental',
    ],
  },
  {
    id: 'dental_hygienist',
    categoryId: 'dental',
    tier: 'specialist',
    defaultBusinessTypeId: 'dental_clinic',
    emoji: '🦷',
    enabled: true,
    specialties: [
      'cleaning', 'fluoride_treatment', 'sealants', 'oral_health_education',
    ],
  },
  {
    id: 'cosmetic_injector',
    categoryId: 'medical_aesthetics',
    tier: 'specialist',
    defaultBusinessTypeId: 'medical_aesthetics_clinic',
    emoji: '💉',
    enabled: true,
    specialties: ['botox', 'dermal_fillers', 'lip_fillers', 'skin_boosters'],
  },
  {
    id: 'acupuncturist',
    categoryId: 'alt_medicine',
    tier: 'specialist',
    defaultBusinessTypeId: 'acupuncture_clinic',
    emoji: '📍',
    enabled: true,
    specialties: [
      'pain_management', 'stress_relief', 'fertility_support', 'cupping_therapy',
    ],
  },
  {
    id: 'chiropractor',
    categoryId: 'alt_medicine',
    tier: 'specialist',
    defaultBusinessTypeId: 'chiropractic_clinic',
    emoji: '🦴',
    enabled: true,
    specialties: [
      'spinal_adjustment', 'sports_injury', 'postural_correction',
      'sciatica_treatment',
    ],
  },
  {
    id: 'podiatrist',
    categoryId: 'podiatry',
    tier: 'specialist',
    defaultBusinessTypeId: 'podiatry_clinic',
    emoji: '🦶',
    enabled: true,
    specialties: [
      'nail_care', 'diabetic_foot_care', 'ingrown_toenail', 'orthotics_fitting',
    ],
  },
  // --- Expansion 18 (added after the original 27) ---
  {
    id: 'extensions_specialist',
    categoryId: 'hair',
    tier: 'artist',
    defaultBusinessTypeId: 'hair_salon',
    emoji: '💇',
    enabled: true,
    specialties: [
      'tape_in_extensions', 'sew_in_extensions', 'micro_link_extensions',
      'extension_removal',
    ],
  },
  {
    id: 'wig_specialist',
    categoryId: 'hair',
    tier: 'artist',
    defaultBusinessTypeId: 'hair_salon',
    emoji: '👱',
    enabled: true,
    specialties: [
      'wig_fitting', 'wig_styling', 'custom_wig_coloring',
      'lace_front_application',
    ],
  },
  {
    id: 'medical_esthetician',
    categoryId: 'skin',
    tier: 'specialist',
    defaultBusinessTypeId: 'skin_clinic',
    emoji: '🧖',
    enabled: true,
    specialties: [
      'medical_peels', 'post_procedure_care', 'scar_treatment',
      'pigmentation_treatment',
    ],
  },
  {
    id: 'laser_hair_removal_tech',
    categoryId: 'skin',
    tier: 'specialist',
    defaultBusinessTypeId: 'skin_clinic',
    emoji: '⚡',
    enabled: true,
    specialties: ['laser_face', 'laser_body', 'patch_test_consult'],
  },
  {
    id: 'henna_artist',
    categoryId: 'bridal_events',
    tier: 'artist',
    defaultBusinessTypeId: 'bridal_events_studio',
    emoji: '🎨',
    enabled: true,
    specialties: ['bridal_henna', 'party_henna', 'custom_henna'],
  },
  {
    id: 'spray_tan_specialist',
    categoryId: 'bridal_events',
    tier: 'artist',
    defaultBusinessTypeId: 'bridal_events_studio',
    emoji: '☀️',
    enabled: true,
    specialties: ['full_body_spray_tan', 'custom_airbrush_tan', 'gradual_tan'],
  },
  {
    id: 'reflexologist',
    categoryId: 'massage',
    tier: 'artist',
    defaultBusinessTypeId: 'massage_studio',
    emoji: '🦶',
    enabled: true,
    specialties: ['foot_reflexology', 'hand_reflexology', 'ear_reflexology'],
  },
  {
    id: 'reiki_practitioner',
    categoryId: 'massage',
    tier: 'artist',
    defaultBusinessTypeId: 'massage_studio',
    emoji: '✋',
    enabled: true,
    specialties: ['reiki_session', 'chakra_balancing', 'energy_cleansing'],
  },
  {
    id: 'osteopath',
    categoryId: 'massage',
    tier: 'specialist',
    defaultBusinessTypeId: 'physio_clinic',
    emoji: '🦴',
    enabled: true,
    specialties: ['joint_manipulation', 'cranial_osteopathy', 'sports_osteopathy'],
  },
  {
    id: 'nutritionist',
    categoryId: 'fitness',
    tier: 'specialist',
    defaultBusinessTypeId: 'mental_health_clinic',
    emoji: '🥗',
    enabled: true,
    specialties: [
      'weight_management', 'sports_nutrition', 'meal_planning',
      'medical_nutrition_therapy',
    ],
  },
  {
    id: 'boxing_mma_coach',
    categoryId: 'fitness',
    tier: 'artist',
    defaultBusinessTypeId: 'gym',
    emoji: '🥊',
    enabled: true,
    specialties: ['boxing_technique', 'mma_conditioning', 'kickboxing'],
  },
  {
    id: 'speech_therapist',
    categoryId: 'mental_health',
    tier: 'specialist',
    defaultBusinessTypeId: 'mental_health_clinic',
    emoji: '🗣️',
    enabled: true,
    specialties: ['speech_delay_therapy', 'stuttering_treatment', 'voice_therapy'],
  },
  {
    id: 'occupational_therapist',
    categoryId: 'mental_health',
    tier: 'specialist',
    defaultBusinessTypeId: 'mental_health_clinic',
    emoji: '🧩',
    enabled: true,
    specialties: ['sensory_integration', 'fine_motor_skills', 'post_injury_rehab'],
  },
  {
    id: 'life_coach',
    categoryId: 'mental_health',
    tier: 'artist',
    defaultBusinessTypeId: 'counseling_practice',
    emoji: '🎯',
    enabled: true,
    specialties: ['career_coaching', 'personal_development', 'goal_setting'],
  },
  {
    id: 'orthodontist',
    categoryId: 'dental',
    tier: 'specialist',
    defaultBusinessTypeId: 'dental_clinic',
    emoji: '🦷',
    enabled: true,
    specialties: ['braces', 'invisalign', 'retainers', 'bite_correction'],
  },
  {
    id: 'oral_surgeon',
    categoryId: 'dental',
    tier: 'specialist',
    defaultBusinessTypeId: 'dental_clinic',
    emoji: '🦷',
    enabled: true,
    specialties: [
      'wisdom_tooth_extraction', 'dental_implant_surgery', 'jaw_surgery',
    ],
  },
  {
    id: 'naturopath',
    categoryId: 'alt_medicine',
    tier: 'specialist',
    defaultBusinessTypeId: 'acupuncture_clinic',
    emoji: '🌿',
    enabled: true,
    specialties: ['herbal_medicine', 'naturopathic_consult', 'detox_programs'],
  },
  {
    id: 'homeopath',
    categoryId: 'alt_medicine',
    tier: 'specialist',
    defaultBusinessTypeId: 'acupuncture_clinic',
    emoji: '🌿',
    enabled: true,
    specialties: ['homeopathic_consult', 'remedy_prescription'],
  },
];

// Lookup helpers — keep callsites out of array .find() boilerplate.
export const getProfession = (id: string): Profession | undefined =>
  professions.find((p) => p.id === id);

export const getCategory = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);

export const getBusinessType = (id: string): BusinessType | undefined =>
  businessTypes.find((b) => b.id === id);
