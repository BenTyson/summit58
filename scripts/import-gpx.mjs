/**
 * GPX Import Script
 *
 * Imports GPX files from data/gpx/ into the database
 *
 * Usage:
 *   node scripts/import-gpx.mjs data/gpx/quandary-peak-east-ridge.gpx
 *   node scripts/import-gpx.mjs data/gpx/  (imports all GPX files in directory)
 *
 * File naming convention:
 *   {peak-slug}-{route-name-slugified}.gpx
 *   e.g., quandary-peak-east-ridge.gpx
 */

import { createClient } from '@supabase/supabase-js';
import { gpx } from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

// Load environment variables
const envFile = readFileSync('.env', 'utf-8');
const getEnv = (key) => {
  const line = envFile.split('\n').find(l => l.startsWith(`${key}=`));
  return line ? line.split('=').slice(1).join('=') : null;
};

const SUPABASE_URL = 'https://seywnbufuewbiwoouwkk.supabase.co';
const SUPABASE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Parse GPX content to TrailGeometry
 */
function parseGPX(gpxContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxContent, 'application/xml');
  const geoJson = gpx(doc);

  // Find LineString or MultiLineString
  let coords = null;

  const lineFeature = geoJson.features.find(f => f.geometry.type === 'LineString');
  if (lineFeature) {
    coords = lineFeature.geometry.coordinates;
  } else {
    const multiLine = geoJson.features.find(f => f.geometry.type === 'MultiLineString');
    if (multiLine) {
      coords = multiLine.geometry.coordinates.flat();
    }
  }

  if (!coords || coords.length < 2) {
    return null;
  }

  // Ensure elevation exists and convert to feet
  const coordsWithElevation = coords.map(c => [
    c[0],  // lon
    c[1],  // lat
    Math.round((c[2] ?? 0) * 3.28084)  // elevation in feet (convert from meters)
  ]);

  const stats = calculateElevationStats(coordsWithElevation);
  const distance = calculateTotalDistance(coordsWithElevation);

  return {
    type: 'LineString',
    coordinates: coordsWithElevation,
    properties: {
      ...stats,
      totalDistanceMiles: distance
    }
  };
}

/**
 * Calculate elevation statistics
 */
function calculateElevationStats(coords) {
  let elevationGain = 0;
  let elevationLoss = 0;
  let minElevation = coords[0][2];
  let maxElevation = coords[0][2];

  const SMOOTHING_THRESHOLD = 10; // feet
  let lastSignificantElevation = coords[0][2];

  for (let i = 1; i < coords.length; i++) {
    const elevation = coords[i][2];

    if (elevation < minElevation) minElevation = elevation;
    if (elevation > maxElevation) maxElevation = elevation;

    const diff = elevation - lastSignificantElevation;
    if (Math.abs(diff) >= SMOOTHING_THRESHOLD) {
      if (diff > 0) elevationGain += diff;
      else elevationLoss += Math.abs(diff);
      lastSignificantElevation = elevation;
    }
  }

  return {
    elevationGain: Math.round(elevationGain),
    elevationLoss: Math.round(elevationLoss),
    minElevation: Math.round(minElevation),
    maxElevation: Math.round(maxElevation)
  };
}

/**
 * Calculate total distance in miles
 */
function calculateTotalDistance(coords) {
  let totalMeters = 0;
  const R = 6371000;

  for (let i = 1; i < coords.length; i++) {
    const [lon1, lat1] = coords[i - 1];
    const [lon2, lat2] = coords[i];

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    totalMeters += R * c;
  }

  return Math.round((totalMeters / 1609.344) * 10) / 10;
}

/**
 * Haversine distance between two points (miles)
 */
function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c) / 1609.344;
}

/**
 * Parse filename to extract peak slug and route name
 * e.g., "quandary-peak-east-ridge.gpx" -> { peakSlug: "quandary-peak", routeName: "East Ridge" }
 */
function parseFilename(filename) {
  const name = basename(filename, '.gpx');

  // Common peak slug patterns
  const peakPatterns = [
    /^(mt-[a-z-]+)/,
    /^(mount-[a-z-]+)/,
    /^([a-z]+-peak)/,
    /^(longs-peak)/,
    /^(pikes-peak)/,
    /^(grays-peak)/,
    /^(torreys-peak)/,
    /^(capitol-peak)/,
    /^(pyramid-peak)/,
  ];

  let peakSlug = null;
  let routePart = name;

  for (const pattern of peakPatterns) {
    const match = name.match(pattern);
    if (match) {
      peakSlug = match[1];
      routePart = name.slice(peakSlug.length + 1); // +1 for the hyphen
      break;
    }
  }

  // If no pattern matched, try splitting on common mountain words
  if (!peakSlug) {
    const parts = name.split('-');
    // Find where peak/mountain name ends
    for (let i = 1; i < parts.length; i++) {
      if (['ridge', 'slopes', 'route', 'trail', 'face', 'couloir', 'gully', 'basin'].includes(parts[i])) {
        peakSlug = parts.slice(0, i).join('-');
        routePart = parts.slice(i).join('-');
        break;
      }
    }
  }

  // Convert route part to title case
  const routeName = routePart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return { peakSlug, routeName };
}

/**
 * Find matching route in database
 */
async function findRoute(peakSlug, routeName) {
  // First find the peak
  const { data: peak, error: peakError } = await supabase
    .from('peaks')
    .select('id, name, latitude, longitude')
    .eq('slug', peakSlug)
    .single();

  if (peakError || !peak) {
    // Try fuzzy match
    const { data: peaks } = await supabase
      .from('peaks')
      .select('id, name, slug, latitude, longitude')
      .ilike('slug', `%${peakSlug}%`);

    if (peaks?.length === 1) {
      const p = peaks[0];
      console.log(`  📍 Fuzzy matched peak: ${p.name} (${p.slug})`);

      const { data: routes } = await supabase
        .from('routes')
        .select('*')
        .eq('peak_id', p.id);

      const route = routes?.find(r =>
        r.name.toLowerCase().includes(routeName.toLowerCase().split(' ')[0])
      );

      return route ? { route, peak: p } : null;
    }
    return null;
  }

  // Find the route
  const { data: routes } = await supabase
    .from('routes')
    .select('*')
    .eq('peak_id', peak.id);

  // Try exact match first
  let route = routes?.find(r => r.name.toLowerCase() === routeName.toLowerCase());

  // Try partial match
  if (!route) {
    route = routes?.find(r =>
      r.name.toLowerCase().includes(routeName.toLowerCase().split(' ')[0]) ||
      routeName.toLowerCase().includes(r.name.toLowerCase().split(' ')[0])
    );
  }

  return route ? { route, peak } : null;
}

/**
 * Validate GPX quality
 */
function validateGPX(geometry, route, peak) {
  const issues = [];
  const warnings = [];

  const pointCount = geometry.coordinates.length;
  const gpxDistance = geometry.properties.totalDistanceMiles;
  const expectedDistance = route.distance_miles;

  // Check point count
  if (pointCount < 50) {
    issues.push(`Only ${pointCount} points (need 50+)`);
  } else if (pointCount < 100) {
    warnings.push(`${pointCount} points (100+ recommended)`);
  }

  // Check distance
  if (expectedDistance) {
    const distanceRatio = gpxDistance / expectedDistance;
    if (distanceRatio < 0.5 || distanceRatio > 2.0) {
      issues.push(`Distance ${gpxDistance}mi vs expected ${expectedDistance}mi`);
    } else if (distanceRatio < 0.75 || distanceRatio > 1.25) {
      warnings.push(`Distance ${gpxDistance}mi vs expected ${expectedDistance}mi`);
    }
  }

  // Check start point (should be near trailhead)
  if (route.trailhead_latitude && route.trailhead_longitude) {
    const startCoord = geometry.coordinates[0];
    const startDist = distanceMiles(
      startCoord[1], startCoord[0],
      route.trailhead_latitude, route.trailhead_longitude
    );
    if (startDist > 0.5) {
      issues.push(`Starts ${startDist.toFixed(2)}mi from trailhead`);
    } else if (startDist > 0.2) {
      warnings.push(`Starts ${startDist.toFixed(2)}mi from trailhead`);
    }
  }

  // Check end point (should be near summit)
  const endCoord = geometry.coordinates[geometry.coordinates.length - 1];
  const endDist = distanceMiles(
    endCoord[1], endCoord[0],
    peak.latitude, peak.longitude
  );
  if (endDist > 0.5) {
    issues.push(`Ends ${endDist.toFixed(2)}mi from summit`);
  } else if (endDist > 0.2) {
    warnings.push(`Ends ${endDist.toFixed(2)}mi from summit`);
  }

  return { issues, warnings, pointCount, gpxDistance };
}

/**
 * Import a single GPX file
 */
async function importGPXFile(filepath) {
  console.log(`\n📂 Processing: ${basename(filepath)}`);

  // Read and parse GPX
  let gpxContent;
  try {
    gpxContent = readFileSync(filepath, 'utf-8');
  } catch (err) {
    console.error(`  ❌ Failed to read file: ${err.message}`);
    return false;
  }

  const geometry = parseGPX(gpxContent);
  if (!geometry) {
    console.error('  ❌ Failed to parse GPX - no valid track found');
    return false;
  }

  console.log(`  📊 Parsed: ${geometry.coordinates.length} points, ${geometry.properties.totalDistanceMiles}mi`);

  // Parse filename to find route
  const { peakSlug, routeName } = parseFilename(filepath);
  console.log(`  🔍 Looking for: ${peakSlug} / ${routeName}`);

  const match = await findRoute(peakSlug, routeName);
  if (!match) {
    console.error(`  ❌ No matching route found for "${peakSlug}" / "${routeName}"`);
    return false;
  }

  const { route, peak } = match;
  console.log(`  ✅ Matched: ${peak.name} - ${route.name}`);

  // Validate
  const validation = validateGPX(geometry, route, peak);

  if (validation.issues.length > 0) {
    console.error(`  ❌ Validation failed:`);
    validation.issues.forEach(i => console.error(`     - ${i}`));
    return false;
  }

  if (validation.warnings.length > 0) {
    console.warn(`  ⚠️  Warnings:`);
    validation.warnings.forEach(w => console.warn(`     - ${w}`));
  }

  // Update database
  const { error } = await supabase
    .from('routes')
    .update({ trail_geometry: geometry })
    .eq('id', route.id);

  if (error) {
    console.error(`  ❌ Database update failed: ${error.message}`);
    return false;
  }

  console.log(`  ✅ Imported successfully!`);
  console.log(`     Points: ${validation.pointCount}`);
  console.log(`     Distance: ${validation.gpxDistance}mi`);
  console.log(`     Elevation: +${geometry.properties.elevationGain}' / -${geometry.properties.elevationLoss}'`);

  return true;
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node scripts/import-gpx.mjs <gpx-file>');
    console.log('  node scripts/import-gpx.mjs <directory>');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/import-gpx.mjs data/gpx/quandary-peak-east-ridge.gpx');
    console.log('  node scripts/import-gpx.mjs data/gpx/');
    process.exit(1);
  }

  const path = args[0];
  const stats = statSync(path);

  let files = [];
  if (stats.isDirectory()) {
    files = readdirSync(path)
      .filter(f => f.endsWith('.gpx'))
      .map(f => join(path, f));
    console.log(`📁 Found ${files.length} GPX files in ${path}`);
  } else {
    files = [path];
  }

  if (files.length === 0) {
    console.log('No GPX files found');
    process.exit(1);
  }

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const result = await importGPXFile(file);
    if (result) success++;
    else failed++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Results: ${success} imported, ${failed} failed`);
}

main().catch(console.error);
