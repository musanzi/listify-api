import { AbstractEntity } from 'src/core/database/abstract.entity';
import { Product } from 'src/features/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToMany } from 'typeorm';

@Entity()
export class Gallery extends AbstractEntity {
  @Column()
  name: string;

  @ManyToMany(() => Product)
  @JoinColumn()
  products: Product[];
}
