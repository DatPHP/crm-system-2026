import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

@Injectable()
export class CacheService {
  private redis: Redis | null = null;
  private readonly logger = new Logger(CacheService.name);

  // TTL mặc định (giây)
  static readonly TTL = {
    DASHBOARD: 60 * 5, // 5 phút
    CATEGORIES: 60 * 30, // 30 phút
    PRODUCTS: 60 * 5, // 5 phút
    ORDERS: 60 * 2, // 2 phút
    CUSTOMERS: 60 * 5, // 5 phút
  };

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('UPSTASH_REDIS_REST_URL');
    const token = this.config.get<string>('UPSTASH_REDIS_REST_TOKEN');

    if (!url || !token) {
      this.logger.warn('⚠️ Redis not configured — caching disabled');
      return;
    }

    this.redis = new Redis({ url, token });
    this.logger.log('✅ Redis cache ready (Upstash)');
  }

  // ─── GET ──────────────────────────────────────────────
  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;

    try {
      const data = await this.redis.get<T>(key);
      if (data) {
        this.logger.debug(`🎯 Cache HIT: ${key}`);
      }
      return data;
    } catch (error) {
      this.logger.error(`Cache GET error for ${key}:`, error);
      return null;
    }
  }

  // ─── SET ──────────────────────────────────────────────
  async set(key: string, value: any, ttl: number): Promise<void> {
    if (!this.redis) return;

    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      this.logger.debug(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Cache SET error for ${key}:`, error);
    }
  }

  // ─── DELETE ───────────────────────────────────────────
  async del(key: string): Promise<void> {
    if (!this.redis) return;

    try {
      await this.redis.del(key);
      this.logger.debug(`🗑️ Cache DEL: ${key}`);
    } catch (error) {
      this.logger.error(`Cache DEL error for ${key}:`, error);
    }
  }

  // ─── DELETE BY PATTERN ────────────────────────────────
  async delPattern(pattern: string): Promise<void> {
    if (!this.redis) return;

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await Promise.all(keys.map((k) => this.redis!.del(k)));
        this.logger.debug(
          `🗑️ Cache DEL pattern: ${pattern} (${keys.length} keys)`,
        );
      }
    } catch (error) {
      this.logger.error(`Cache DEL pattern error for ${pattern}:`, error);
    }
  }

  // ─── GET OR SET (helper) ──────────────────────────────
  async getOrSet<T>(
    key: string,
    ttl: number,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    // 1. Thử lấy từ cache
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    // 2. Cache miss → lấy từ DB
    const data = await fetcher();

    // 3. Lưu vào cache
    await this.set(key, data, ttl);

    this.logger.debug(`📦 Cache MISS → DB: ${key}`);
    return data;
  }
}
