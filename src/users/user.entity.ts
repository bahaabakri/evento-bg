import { Otp } from "../otp/otp.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./roles.enum";
import { EventEntity } from "../events/event.entity";

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

    @OneToMany(() => EventEntity, (eventEntity) => eventEntity.user, {cascade:true})
    events:EventEntity[];
}