import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import { Redis } from 'ioredis';


@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) { }

    async get(key: string): Promise<string | null> {
        return this.redisClient.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.redisClient.setex(key, ttl, value);
        } else {
            await this.redisClient.set(key, value);
        }
    }

    async del(key: string): Promise<number> {
        return this.redisClient.del(key);
    }

    async exists(key: string): Promise<number> {
        return this.redisClient.exists(key);
    }

    async expire(key: string, seconds: number): Promise<number> {
        return this.redisClient.expire(key, seconds);
    }

    async ttl(key: string): Promise<number> {
        return this.redisClient.ttl(key);
    }

    async keys(pattern: string): Promise<string[]> {
        return this.redisClient.keys(pattern);
    }

    async hget(key: string, field: string): Promise<string | null> {
        return this.redisClient.hget(key, field);
    }

    async hset(key: string, field: string, value: string): Promise<number> {
        return this.redisClient.hset(key, field, value);
    }

    async hdel(key: string, field: string): Promise<number> {
        return this.redisClient.hdel(key, field);
    }

    async hgetall(key: string): Promise<Record<string, string>> {
        return this.redisClient.hgetall(key);
    }

    async lpush(key: string, ...values: string[]): Promise<number> {
        return this.redisClient.lpush(key, ...values);
    }

    async rpush(key: string, ...values: string[]): Promise<number> {
        return this.redisClient.rpush(key, ...values);
    }

    async lpop(key: string): Promise<string | null> {
        return this.redisClient.lpop(key);
    }

    async rpop(key: string): Promise<string | null> {
        return this.redisClient.rpop(key);
    }

    async llen(key: string): Promise<number> {
        return this.redisClient.llen(key);
    }

    async sadd(key: string, ...members: string[]): Promise<number> {
        return this.redisClient.sadd(key, ...members);
    }

    async srem(key: string, ...members: string[]): Promise<number> {
        return this.redisClient.srem(key, ...members);
    }

    async smembers(key: string): Promise<string[]> {
        return this.redisClient.smembers(key);
    }

    async sismember(key: string, member: string): Promise<number> {
        return this.redisClient.sismember(key, member);
    }

    async flushall(): Promise<string> {
        return this.redisClient.flushall();
    }
}

