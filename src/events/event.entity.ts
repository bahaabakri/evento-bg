import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('events')
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    date: string;

    @Column()
    location: string;

    @Column()
    isActive: boolean;

    @Column({
        type: 'text',
        nullable: true,
        transformer: {
          to: (value: string[]) => JSON.stringify(value),
          from: (value: string) => JSON.parse(value),
        },
    })
    images: string[];
}