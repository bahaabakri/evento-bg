import { Body, Controller, Delete, Param, Post, UploadedFile, UploadedFiles } from "@nestjs/common";
import { UploadImageService } from "./upload-image.service";
import { UploadIntent } from "./upload-intent.entity";
import FileUpload from "../decorators/file-upload.decorator";
import { UploadImage } from "./upload-image.entity";

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
    @Post("/image")
    @FileUpload()
    async uploadImage(
        @Body('key') key: string,
        @UploadedFiles() files: {images?: Express.Multer.File[]}):Promise<UploadImage[]> {
            const uploadedImages:UploadImage[] = []
            files.images?.forEach(async (image) => {
                const imagePath = '/uploads/' + image.filename;
                uploadedImages.push(await this._uploadImageService.uploadImage(key, imagePath, image.filename))
            })
            return uploadedImages

    }

    /**
     * Delete image
     */
    @Delete("/image/:id")
    async deleteImage(@Param('id') id:string):Promise<{message:string, image:UploadImage}> {
        return this._uploadImageService.removeImage(id)
    }
}