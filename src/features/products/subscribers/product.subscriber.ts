import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import slugify from 'slugify';
import { Product } from '../entities/product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  listenTo() {
    return Product;
  }

  beforeInsert(event: InsertEvent<Product>): void {
    const { name } = event.entity;
    event.entity.slug = slugify(name, { lower: true });
  }

  beforeUpdate(event: UpdateEvent<Product>): void {
    const entity = event.entity;
    if (!entity || !entity.name) return;
    entity.slug = slugify(entity.name as string, { lower: true });
  }
}
