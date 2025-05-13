import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Hero {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({default:false})
    isActive: boolean;

    @Column({
        type: 'text',
        nullable: true,
        transformer: {
          to: (value: string[]) => JSON.stringify(value),
          from: (value: string) => JSON.parse(value),
        },
    })
    imagesUrls: string[];
}