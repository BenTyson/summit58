import * as SQLite from 'expo-sqlite';
import type { CacheEntry } from './types';

const DB_NAME = 'saltgoat-offline.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await runMigrations(db);
  return db;
}

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS api_cache (
      cache_key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      cached_at INTEGER NOT NULL,
      ttl_ms INTEGER NOT NULL,
      tier INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS sync_outbox (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      priority INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      retry_count INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      local_id TEXT
    );

    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

// --- Cache operations ---

export async function getCacheEntry(key: string): Promise<CacheEntry | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<CacheEntry>(
    'SELECT * FROM api_cache WHERE cache_key = ?',
    key
  );
  return row ?? null;
}

export async function setCacheEntry(
  key: string,
  data: string,
  ttlMs: number,
  tier: number
): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO api_cache (cache_key, data, cached_at, ttl_ms, tier)
     VALUES (?, ?, ?, ?, ?)`,
    key,
    data,
    Date.now(),
    ttlMs,
    tier
  );
}

export function isCacheExpired(entry: CacheEntry): boolean {
  if (entry.ttl_ms === 0) return false;
  return Date.now() - entry.cached_at > entry.ttl_ms;
}

export async function deleteCacheEntry(key: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM api_cache WHERE cache_key = ?', key);
}

export async function clearCacheTier(tier: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM api_cache WHERE tier = ?', tier);
}

export async function clearAllCache(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM api_cache');
}

// --- Cache size ---

export interface CacheSizeByTier {
  tier: number;
  count: number;
  bytes: number;
}

export async function getCacheSizeByTier(): Promise<CacheSizeByTier[]> {
  const database = await getDatabase();
  return database.getAllAsync<CacheSizeByTier>(
    'SELECT tier, COUNT(*) as count, SUM(LENGTH(data)) as bytes FROM api_cache GROUP BY tier ORDER BY tier'
  );
}

// --- Key-value store ---

export async function getKV(key: string): Promise<string | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM kv_store WHERE key = ?',
    key
  );
  return row?.value ?? null;
}

export async function setKV(key: string, value: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)',
    key,
    value
  );
}
