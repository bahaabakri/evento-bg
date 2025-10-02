import { ImageObject } from "src/types/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('heros')
export class Hero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'text', // or 'json' / 'jsonb' if using Postgres
    nullable: true,
    transformer: {
      to: (value: ImageObject[]) => JSON.stringify(value), // saving to db
      from: (value: string) => JSON.parse(value), // reading from db
    },
  })
  images: ImageObject[];
}