import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD') || '',
    });
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async setValue(key: string, value: object): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value));
  }

  async getValue<T>(key: string): Promise<T> {
    const value = await this.redisClient.get(key);
    return JSON.parse(value);
  }

  async deleteKey(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async lpush(key: string, value: string): Promise<void> {
    await this.redisClient.lpush(key, value);
  }

  async lrange(key: string, start: number, end: number): Promise<string[]> {
    return this.redisClient.lrange(key, start, end);
  }

  async llen(key: string): Promise<number> {
    return this.redisClient.llen(key);
  }

  async lrem(key: string, count: number, value: string): Promise<void> {
    await this.redisClient.lrem(key, count, value);
  }

  async flushAll(): Promise<void> {
    await this.redisClient.flushall();
  }
}
