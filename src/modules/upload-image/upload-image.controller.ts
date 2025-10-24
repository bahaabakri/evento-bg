import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadIntent } from './upload-intent.entity';
import { UploadImage } from './upload-image.entity';
import FilesUpload from '../../decorators/file-upload.decorator';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import UploadImagesDto from './dto/request/uplaod-images.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('admin/upload-image')
export class UploadImageController {
  constructor(private _uploadImageService: UploadImageService) {}

  /**
   * Create upload intent
   */
  @Permissions('create_intent')
  @Post('/intent')
  @ApiOperation({
    summary: 'Create Intent for upload images',
    description:
      'This API must be called within 10 minutes before uploading the images; otherwise, the token will expire.',
  })
  async createUploadIntent(): Promise<UploadIntent> {
    return this._uploadImageService.createIntent();
  }

  /**
   * Create upload images
   */
  @Permissions('upload_images')
  @Post('/images')
  @FilesUpload()
  @ApiOperation({
    summary: 'Upload Images',
    description: 'This API globally for uploading images to the server',
  })
  @ApiConsumes('multipart/form-data') // ⚡ Important for file uploads
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'xxxx',
          description: 'The key returned from create intent API',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary', // ⚡ important for files
          },
          description: 'Images to upload',
        },
      },
      required: ['key', 'images'],
    },
  })
  async uploadImage(
    @Body() { key }: UploadImagesDto,
    @UploadedFiles() files: { images: Express.Multer.File[] },
  ): Promise<UploadImage[]> {
    return this._uploadImageService.uploadImages(key, files.images);
  }

  /**
   * Delete image
   */
  @Permissions('delete_images')
  @Delete('/image/:id')
  @ApiOperation({
    summary: 'Delete Image',
    description: 'This API globally for removing image from the server',
  })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Image ID' })
  async deleteImage(
    @Param('id') id: string,
  ): Promise<{ message: string; image: UploadImage }> {
    return this._uploadImageService.removeImage(id);
  }
}
