// Achievement definitions for Cairn58
// These are static definitions - actual earned achievements are stored in user_achievements table

export type AchievementCategory = 'milestone' | 'range' | 'class' | 'community' | 'seasonal';

export interface AchievementDef {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string;
  tier?: number; // For sorting within category
}

// All achievement definitions
export const ACHIEVEMENTS: AchievementDef[] = [
  // ===== MILESTONE ACHIEVEMENTS (6) =====
  {
    id: 'first_summit',
    category: 'milestone',
    title: 'First Summit',
    description: 'Log your first 14er summit',
    icon: 'mountain',
    tier: 1
  },
  {
    id: 'summit_10',
    category: 'milestone',
    title: 'Getting Started',
    description: 'Summit 10 unique peaks',
    icon: 'star',
    tier: 2
  },
  {
    id: 'summit_25',
    category: 'milestone',
    title: 'Dedicated',
    description: 'Summit 25 unique peaks',
    icon: 'star-double',
    tier: 3
  },
  {
    id: 'summit_29',
    category: 'milestone',
    title: 'Halfway There',
    description: 'Summit 29 unique peaks (50%)',
    icon: 'target',
    tier: 4
  },
  {
    id: 'summit_50',
    category: 'milestone',
    title: 'Almost There',
    description: 'Summit 50 unique peaks',
    icon: 'flame',
    tier: 5
  },
  {
    id: 'summit_58',
    category: 'milestone',
    title: 'Peak Bagger',
    description: 'Summit all 58 Colorado 14ers',
    icon: 'crown',
    tier: 6
  },

  // ===== RANGE COMPLETION ACHIEVEMENTS (7) =====
  {
    id: 'range_sawatch',
    category: 'range',
    title: 'Sawatch Complete',
    description: 'Summit all Sawatch Range peaks',
    icon: 'mountain-range'
  },
  {
    id: 'range_elk',
    category: 'range',
    title: 'Elk Mountains Complete',
    description: 'Summit all Elk Mountains peaks',
    icon: 'mountain-range'
  },
  {
    id: 'range_san_juan',
    category: 'range',
    title: 'San Juan Complete',
    description: 'Summit all San Juan Mountains peaks',
    icon: 'mountain-range'
  },
  {
    id: 'range_sangre',
    category: 'range',
    title: 'Sangre de Cristo Complete',
    description: 'Summit all Sangre de Cristo Range peaks',
    icon: 'mountain-range'
  },
  {
    id: 'range_front',
    category: 'range',
    title: 'Front Range Complete',
    description: 'Summit all Front Range peaks',
    icon: 'mountain-range'
  },
  {
    id: 'range_mosquito',
    category: 'range',
    title: 'Mosquito Range Complete',
    description: 'Summit all Mosquito Range peaks',
    icon: 'mountain-range'
  },
  {
    id: 'range_tenmile',
    category: 'range',
    title: 'Tenmile Complete',
    description: 'Summit all Tenmile Range peaks',
    icon: 'mountain-range'
  },

  // ===== CLASS MASTERY ACHIEVEMENTS (4) =====
  {
    id: 'class_1_master',
    category: 'class',
    title: 'Class 1 Master',
    description: 'Summit all Class 1 peaks',
    icon: 'shield-1'
  },
  {
    id: 'class_2_master',
    category: 'class',
    title: 'Class 2 Master',
    description: 'Summit all Class 2 peaks',
    icon: 'shield-2'
  },
  {
    id: 'class_3_master',
    category: 'class',
    title: 'Class 3 Master',
    description: 'Summit all Class 3 peaks',
    icon: 'shield-3'
  },
  {
    id: 'class_4_master',
    category: 'class',
    title: 'Class 4 Master',
    description: 'Summit all Class 4 peaks',
    icon: 'shield-4'
  },

  // ===== COMMUNITY ACHIEVEMENTS (4) =====
  {
    id: 'first_review',
    category: 'community',
    title: 'Voice Heard',
    description: 'Write your first peak review',
    icon: 'pencil'
  },
  {
    id: 'first_trail_report',
    category: 'community',
    title: 'Trail Scout',
    description: 'Submit your first trail report',
    icon: 'trail'
  },
  {
    id: 'reviews_5',
    category: 'community',
    title: 'Critic',
    description: 'Write 5 peak reviews',
    icon: 'document'
  },
  {
    id: 'trail_reports_5',
    category: 'community',
    title: 'Trail Master',
    description: 'Submit 5 trail reports',
    icon: 'compass'
  },

  // ===== SEASONAL ACHIEVEMENTS (2) =====
  {
    id: 'winter_summit',
    category: 'seasonal',
    title: 'Winter Warrior',
    description: 'Summit a peak in winter (Dec-Feb)',
    icon: 'snowflake'
  },
  {
    id: 'summer_summit',
    category: 'seasonal',
    title: 'Summer Hiker',
    description: 'Summit a peak in summer (Jun-Aug)',
    icon: 'sun'
  }
];

// Map for quick lookup by ID
export const ACHIEVEMENT_MAP = new Map<string, AchievementDef>(
  ACHIEVEMENTS.map((a) => [a.id, a])
);

// Helper to get achievements by category
export function getAchievementsByCategory(category: AchievementCategory): AchievementDef[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

// Range name to achievement ID mapping
export const RANGE_ACHIEVEMENT_MAP: Record<string, string> = {
  'Sawatch Range': 'range_sawatch',
  'Elk Mountains': 'range_elk',
  'San Juan Mountains': 'range_san_juan',
  'Sangre de Cristo Range': 'range_sangre',
  'Front Range': 'range_front',
  'Mosquito Range': 'range_mosquito',
  'Tenmile Range': 'range_tenmile'
};

// Milestone thresholds
export const MILESTONE_THRESHOLDS = [
  { id: 'first_summit', count: 1 },
  { id: 'summit_10', count: 10 },
  { id: 'summit_25', count: 25 },
  { id: 'summit_29', count: 29 },
  { id: 'summit_50', count: 50 },
  { id: 'summit_58', count: 58 }
];
