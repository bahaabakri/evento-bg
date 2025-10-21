import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hero } from './hero.entity';
import { UploadImageService } from '@/modules/upload-image/upload-image.service';
import { UploadIntent } from '@/modules/upload-image/upload-intent.entity';
import { UploadImage } from '@/modules/upload-image/upload-image.entity';
import { HeroAdminController } from './hero-admin.controller';
import { HeroUserController } from './hero-user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports:[
        TypeOrmModule.forFeature([Hero, UploadImage, UploadIntent]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'), // Get secret from env
            signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d' }, // Get expiry from env
            }),
        }),
    ],
    controllers: [HeroAdminController, HeroUserController],
    providers:[HeroService, UploadImageService]
})
export class HeroModule {}
