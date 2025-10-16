import { AbstractEntity } from 'src/core/database/abstract.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { Product } from 'src/features/products/entities/product.entity';

@Entity()
export class User extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
