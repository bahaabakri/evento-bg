import { Otp } from "../otp/otp.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./roles.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    email: string;

  
    @Column({ default: false })
    isVerified: boolean;

    @Column({default: Role.USER })
    role: Role;
  
    @OneToMany(() => Otp, (otp) => otp.user, { cascade: true })
    otps: Otp[];
}