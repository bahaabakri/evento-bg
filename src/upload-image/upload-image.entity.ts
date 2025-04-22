import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadIntent } from "./upload-intent.entity";

@Entity()
export class UploadImage {
    @Column()
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    imagePath: string;

    @Column({
        default: null
    })
    name: string;
    
    @ManyToOne(() => UploadIntent, (uploadIntent) => uploadIntent.images)
    uploadIntent: UploadIntent;
}