import { User } from '../users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

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

    @Column({ type: 'float', nullable: true, default: null })
    lng:number;

    @Column({ type: 'float', nullable: true, default: null })
    lat: number;

    @Column()
    isActive: boolean;

    @Column({default: false})
    isApproved: boolean;
    @Column({
        type: 'text',
        nullable: true,
        transformer: {
          to: (value: string[]) => JSON.stringify(value),
          from: (value: string) => JSON.parse(value),
        },
    })
    imagesUrls: string[];

    @ManyToOne(() => User, (user) => user.events, {onDelete: 'CASCADE'})
    user:User;
}