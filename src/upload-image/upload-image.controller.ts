import { Body, Controller, Post, UploadedFile } from "@nestjs/common";
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
     * Create upload image
     */
    @Post("/image")
    @FileUpload()
    async uploadImage(
        @Body('key') key: string,
        @UploadedFile() image: Express.Multer.File,):Promise<UploadImage> {
        const imagePath = '/uploads/' + image.filename;
        return this._uploadImageService.uploadImage(key, imagePath);
    }
}