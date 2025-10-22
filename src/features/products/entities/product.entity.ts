import { AbstractEntity } from 'src/core/database/abstract.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Gallery } from 'src/features/galleries/entities/gallery.entity';

@Entity()
export class Product extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  cover_image: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column()
  price: number;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Gallery, (gallery) => gallery.products)
  galleries: Gallery[];
}
