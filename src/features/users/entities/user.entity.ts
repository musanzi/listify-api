import { AbstractEntity } from 'src/core/database/abstract.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from '../roles/entities/role.entity';

@Entity()
export class User extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];
}
