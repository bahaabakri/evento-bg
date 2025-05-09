import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity() 
export class Otp {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    code:string;

    @CreateDateColumn()
    createdAt:Date;

    @Column()
    expiredAt:Date;

    @ManyToOne(() => User, (user) => user.otps, {onDelete: 'CASCADE'})
    user: User

}