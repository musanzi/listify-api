import { Column, Entity, ManyToMany } from 'typeorm';
import { User } from '../../entities/user.entity';
import { AbstractEntity } from 'src/core/database/abstract.entity';

@Entity()
export class Role extends AbstractEntity {
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
