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
    async createIntent(): Promise<UploadIntent> {
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
     * Upload Images
     */
    async uploadImages(key:string, imagesFiles: Express.Multer.File[]): Promise<UploadImage[]> {
        const intent = await this._uploadIntentRepo.findOneBy({key})
        if (!intent || Date.now() > new Date(intent.createdAt).getTime() + 10 * 60 * 1000) {
            throw  new UnauthorizedException('Upload Intent Expired or Invalid');
        }
        const uploadedImages: Omit<UploadImage, 'id'>[] = []
        imagesFiles?.forEach((image) => {
            const imagePath = '/uploads/' + image.filename;
            uploadedImages.push({
                imagePath,
                name: image.filename,
                uploadIntent: intent
            })
        })
        const imagesInstances = this._uploadImageRepo.create(uploadedImages)
        return this._uploadImageRepo.save(imagesInstances)
    }

    /**
     * Remove Image
     */
    async removeImage(id:string): Promise<{message:string, image:UploadImage}> {
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