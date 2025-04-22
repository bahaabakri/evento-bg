import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UploadImage } from "./upload-image.entity";
import { UploadIntent } from "./upload-intent.entity";
import { Repository } from "typeorm";
import { deleteFileAsync } from "src/util";

@Injectable()
export class UploadImageService {
    constructor(
        @InjectRepository(UploadImage) private _uploadImageRepo:Repository<UploadImage>,
        @InjectRepository(UploadIntent) private _uploadIntentRepo: Repository<UploadIntent>,
    ) {}
    /**
     * Create intent
     */
    async createIntent() {
        const intent = this._uploadIntentRepo.create({
            createdAt: new Date()
        });
        await this._uploadIntentRepo.save(intent);
        return intent;
    }
    
    /**
     * Get image by image id
     * 
     */

    async getImageById(id:number):Promise<UploadImage> {
        if(!id) {
            throw new NotFoundException('Image Not Found')
        }
        const image = await this._uploadImageRepo.findOneBy({id})
        if (!image) {
            throw new NotFoundException('Image Not Found');
        }
        return image;
    
    }
    /**
     * Upload Image
     * @param uploadImage 
     */
    async uploadImage(key:string, imagePath:string, imageName:string) {
        const intent = await this._uploadIntentRepo.findOneBy({key})
        if (!intent || Date.now() > new Date(intent.createdAt).getTime() + 10 * 60 * 1000) {
            throw  new UnauthorizedException('Upload Intent Expired or Invalid');
        }
        const uploadImage = this._uploadImageRepo.create({
            imagePath,
            name:imageName,
            uploadIntent: intent
        });
        await this._uploadImageRepo.save(uploadImage);
        return uploadImage;
    }

    /**
     * Remove Image
     */
    async removeImage(id:string) {
        const deletedImage = await this.getImageById(+id)

        // remove image from db
        const removeImageFromDb = this._uploadImageRepo.remove(deletedImage)

        // remove image from file system
        const deleteImageFromFile = deleteFileAsync(deletedImage.name, 'uploads')

        const deleteImagePromise = await Promise.all([removeImageFromDb, deleteImageFromFile])

        if (!deleteImagePromise) {
            throw new BadRequestException('Something went wrong while deleting image')
        }
        return {
            image: deleteImagePromise[0],
            message: 'Removing Image Successfully'
        }
    }
}