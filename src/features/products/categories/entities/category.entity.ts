import { Column, Entity, ManyToMany } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { AbstractEntity } from 'src/core/database/abstract.entity';

@Entity()
export class Category extends AbstractEntity {
  @Column()
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
