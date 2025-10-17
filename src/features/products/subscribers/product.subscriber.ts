import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import slugify from 'slugify';
import { Product } from '../entities/product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  listenTo() {
    return Product;
  }

  beforeInsert(event: InsertEvent<Product>): void {
    const entity = event.entity;
    if (!entity) return;
    const { name } = entity;
    if (!name) return;
    entity.slug = slugify(name, { lower: true });
  }

  beforeUpdate(event: UpdateEvent<Product>): void {
    const entity = event.entity;
    if (!entity) return;
    const { name } = entity;
    if (!name) return;
    entity.slug = slugify(name as string, { lower: true });
  }
}
