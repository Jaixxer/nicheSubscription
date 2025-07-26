import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "apps/api-gateway/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor( config: ConfigService,private client: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:config.get('JWT_ACCESS_SECRET') as string
    });
  }

  async validate(payload: any) {
    // Here you can add additional validation logic if needed
   const user  = await this.client.user.findUnique({
    where:{
        id: payload.sub
    },
    select:{
        id:true,
        firstName:true,
        email:true,
        phone:true,
        
        userRoles:{
          select:{
            role:{
              select:{
                role:true
              }
            }
          }
        }
    }
   })
   
    if (!user) {
      throw new Error('BITCH');
    }
  const roles = user.userRoles.map(userRole => userRole.role.role);
  console.log(roles)
  return{
      id:user.id,
      firstName:user.firstName,
      email:user.email,
      phone:user.phone,
      roles
    }
  }
}