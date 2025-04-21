import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadIntent } from "./upload-intent.entity";

@Entity()
export class UploadImage {
    @Column()
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    imagePath: string;

    @ManyToOne(() => UploadIntent, (uploadIntent) => uploadIntent.images)
    uploadIntent: UploadIntent;
}