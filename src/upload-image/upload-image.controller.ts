import { Body, Controller, Delete, Param, Post, UploadedFile, UploadedFiles } from "@nestjs/common";
import { UploadImageService } from "./upload-image.service";
import { UploadIntent } from "./upload-intent.entity";
import { UploadImage } from "./upload-image.entity";
import FilesUpload from "../decorators/file-upload.decorator";

@Controller("upload-image")
export class UploadImageController {
    constructor(private _uploadImageService:UploadImageService) {}

    /**
     * Create upload intent
     */
    @Post("/intent")
    async createUploadIntent():Promise<UploadIntent> {
        return this._uploadImageService.createIntent();
    }

    /**
     * Create upload images
     */
    @Post("/images")
    @FilesUpload()
    async uploadImage(
        @Body('key') key: string,
        @UploadedFiles() files: {images: Express.Multer.File[]}):Promise<UploadImage[]> {
            return this._uploadImageService.uploadImages(key, files.images)
    }

    /**
     * Delete image
     */
    @Delete("/image/:id")
    async deleteImage(@Param('id') id:string):Promise<{message:string, image:UploadImage}> {
        return this._uploadImageService.removeImage(id)
    }
}