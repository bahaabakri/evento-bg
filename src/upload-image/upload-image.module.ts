import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadImage } from "./upload-image.entity";
import { UploadIntent } from "./upload-intent.entity";
import { UploadImageService } from "./upload-image.service";
import { UploadImageController } from "./upload-image.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UploadImage, UploadIntent])],
    controllers: [UploadImageController],
    providers: [UploadImageService]
})
export class UploadImageModule {}