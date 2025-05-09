import { Otp } from "src/otp/otp.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    email: string;

  
    @Column({ default: false })
    isVerified: boolean;
  
    @OneToMany(() => Otp, (otp) => otp.user, { cascade: true })
    otps: Otp[];
}