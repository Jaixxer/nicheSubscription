import { Module, Inject } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ClientsModule ,Transport} from '@nestjs/microservices';
import {REDIS_CLIENT} from "./redis.constants"
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
@Module({
  providers: [RedisService,{
    provide:"REDIS_CLIENT",
    useFactory:(configService: ConfigService)=>{
      const host ="localhost"
      const port = 6379
      const client = new Redis({
        host,port
      })
      client.on('connect',()=>console.log("Connection Established"))
      client.on('error',()=>console.log("Fix the issue in redis client"))
      return client
    },
    inject:[ConfigService],
  }],
  imports:[ ClientsModule.register([
      {
        name: "BILLING_SERVICE", transport: Transport.REDIS,
        options: {
          port: 6379,
          host: "localhost",
        }
      }
    ])],
    exports:[REDIS_CLIENT,RedisService,ClientsModule]
})
export class RedisModule {}
