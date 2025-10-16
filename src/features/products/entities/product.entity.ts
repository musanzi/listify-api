import { AbstractEntity } from 'src/core/database/abstract.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { User } from 'src/features/users/entities/user.entity';
import { Gallery } from 'src/features/galleries/entities/gallery.entity';

@Entity()
export class Product extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn()
  user: User;

  @OneToMany(() => Gallery, (gallery) => gallery.products)
  galleries: Gallery[];
}
