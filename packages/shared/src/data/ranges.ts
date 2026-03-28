// Mountain range metadata for Colorado's 14ers
// This provides rich descriptions and context for each range

export interface RangeInfo {
  name: string;
  slug: string;
  description: string;
  location: string;
  character: string; // What makes this range unique
  bestSeason: string;
  nearestTowns: string[];
  heroImage?: string;
}

export const rangeData: Record<string, RangeInfo> = {
  'Sawatch Range': {
    name: 'Sawatch Range',
    slug: 'sawatch-range',
    description: 'The Sawatch Range contains more 14ers than any other range in Colorado, including the state\'s highest peak, Mt. Elbert. Known for its relatively gentle terrain and accessible summits, the Sawatch is often recommended for first-time 14er climbers.',
    location: 'Central Colorado, between Leadville and Salida',
    character: 'Gentle giants - high peaks with non-technical standard routes',
    bestSeason: 'June through September',
    nearestTowns: ['Leadville', 'Buena Vista', 'Salida']
  },
  'Elk Mountains': {
    name: 'Elk Mountains',
    slug: 'elk-mountains',
    description: 'The Elk Mountains are famous for their dramatic, jagged peaks and the iconic Maroon Bells. This range offers some of the most photographed scenery in Colorado, but also some of the most challenging and dangerous 14er routes.',
    location: 'West-central Colorado near Aspen',
    character: 'Rugged beauty - steep, loose rock and serious exposure',
    bestSeason: 'July through early September',
    nearestTowns: ['Aspen', 'Crested Butte', 'Carbondale']
  },
  'San Juan Mountains': {
    name: 'San Juan Mountains',
    slug: 'san-juan-mountains',
    description: 'The San Juans are Colorado\'s largest and most rugged mountain range, spanning over 10,000 square miles. Known for remote wilderness, mining history, and spectacular alpine scenery, this range offers everything from easy walkups to technical climbing.',
    location: 'Southwestern Colorado',
    character: 'Wild and remote - vast wilderness with rich mining heritage',
    bestSeason: 'July through September',
    nearestTowns: ['Silverton', 'Ouray', 'Lake City', 'Telluride']
  },
  'Sangre de Cristo Range': {
    name: 'Sangre de Cristo Range',
    slug: 'sangre-de-cristo-range',
    description: 'The "Blood of Christ" mountains form a dramatic wall rising from the San Luis Valley. These peaks are known for their steep, rugged terrain and the iconic Crestones - some of Colorado\'s most technical 14ers.',
    location: 'South-central Colorado, east of the San Luis Valley',
    character: 'Steep and technical - dramatic relief and challenging routes',
    bestSeason: 'June through September',
    nearestTowns: ['Westcliffe', 'Crestone', 'Alamosa']
  },
  'Front Range': {
    name: 'Front Range',
    slug: 'front-range',
    description: 'The Front Range forms the eastern edge of the Rocky Mountains, visible from Denver and the populated Front Range corridor. These accessible peaks include Longs Peak in Rocky Mountain National Park and Pikes Peak, "America\'s Mountain."',
    location: 'North-central Colorado, west of Denver',
    character: 'Accessible icons - famous peaks close to population centers',
    bestSeason: 'June through September',
    nearestTowns: ['Estes Park', 'Boulder', 'Colorado Springs']
  },
  'Mosquito Range': {
    name: 'Mosquito Range',
    slug: 'mosquito-range',
    description: 'Despite its unassuming name, the Mosquito Range contains several prominent 14ers with generally moderate routes. Located between South Park and the Arkansas River Valley, these peaks offer great views and less crowded trails.',
    location: 'Central Colorado, east of Leadville',
    character: 'Moderate and scenic - accessible peaks with mining history',
    bestSeason: 'June through September',
    nearestTowns: ['Fairplay', 'Alma', 'Leadville']
  },
  'Tenmile Range': {
    name: 'Tenmile Range',
    slug: 'tenmile-range',
    description: 'A compact range near the ski resort town of Breckenridge, the Tenmile Range offers a single 14er - Quandary Peak - which is one of the most popular and accessible 14ers in Colorado.',
    location: 'Central Colorado, near Breckenridge',
    character: 'Accessible favorite - popular peak near ski country',
    bestSeason: 'June through October',
    nearestTowns: ['Breckenridge', 'Frisco', 'Dillon']
  }
};

export function getRangeInfo(rangeName: string): RangeInfo | null {
  return rangeData[rangeName] || null;
}

export function getAllRanges(): RangeInfo[] {
  return Object.values(rangeData);
}
