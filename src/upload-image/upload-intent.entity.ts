import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UploadImage } from "./upload-image.entity";

@Entity()
export class UploadIntent {
  @PrimaryGeneratedColumn('uuid')
  key: string;

  @Column()
  createdAt: Date;

  @OneToMany(() => UploadImage, (uploadImage) => uploadImage.uploadIntent, {cascade: true})
  images: UploadImage[];
 
}