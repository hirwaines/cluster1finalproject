/** Case study context: NCST (National Council for Science and Technology), Rwanda */

export const NCST = {
  fullName: 'National Council for Science and Technology',
  shortName: 'NCST',
  country: 'Rwanda',
  city: 'Kigali',
} as const;

export const SYSTEM_ADMIN = {
  email: 'ineshirwa8@gmail.com',
  name: 'System Administrator',
} as const;

export const PARTNER_INSTITUTIONS = [
  'University of Rwanda',
  'Adventist University of Central Africa',
  'African Leadership University',
  'University of Global Health Equity',
  'Institute of Applied Sciences (INES)',
  'Kigali Independent University (ULK)',
] as const;

export const RESEARCH_AREAS = [
  'Agriculture',
  'Health Sciences',
  'ICT & Engineering',
  'Education',
  'Economics & Finance',
  'Law & Governance',
  'Environment & Natural Resources',
  'Social Policy',
] as const;

export const PLATFORM_STATS = [
  { value: '30+', label: 'Verified researchers', accent: 'brand' as const },
  { value: '86+', label: 'Publications indexed', accent: 'rw' as const },
  { value: '20+', label: 'Funding opportunities', accent: 'brand' as const },
  { value: '8', label: 'Research focus areas', accent: 'rw' as const },
];

export const HERO_BULLETS = [
  'Verified researcher profiles aligned with NCST national research priorities',
  'Publication indexing across Rwandan universities and research institutes',
  'Collaboration matching, funding discovery, and institutional analytics',
] as const;
