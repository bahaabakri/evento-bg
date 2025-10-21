// permission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../roles/role.entity';
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string; // e.g. 'create_user', 'delete_event', 'approve_admin'

  @Column()
  name: string;

  @Column()
  module: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
