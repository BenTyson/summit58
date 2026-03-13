export const PHOTO_CATEGORIES = [
  'Summit', 'Trailhead', 'Trail', 'Hazards', 'Vistas',
  'Wildlife', 'Parking & Road Access', 'Wildflowers',
  'Winter Conditions', 'Camping'
] as const;

export type PhotoCategory = typeof PHOTO_CATEGORIES[number];
