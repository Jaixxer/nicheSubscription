import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { RedisModule } from '../../redis/redis.module';
import { ApiService } from './api.service';

@Module({
  imports:[RedisModule],
  controllers: [ApiController],
  providers: [ApiService]
})
export class ApiModule {}
