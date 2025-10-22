import { Category } from 'src/features/products/categories/entities/category.entity';
import { Product } from 'src/features/products/entities/product.entity';
import { User } from 'src/features/users/entities/user.entity';
import { Role } from 'src/features/users/roles/entities/role.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Seeder } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import slugify from 'slugify';

export default class DbSeeder implements Seeder {
  async run(dataSource: DataSource) {
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    const roleRepository = dataSource.getRepository(Role);
    const userRepository = dataSource.getRepository(User);
    const categoryRepository = dataSource.getRepository(Category);
    const productRepository = dataSource.getRepository(Product);

    // 1. Create Roles
    const seed = async () => {
      await roleRepository.save(['admin', 'manager'].map((r) => roleRepository.create({ name: r })));
      // 2. Create Admin User
      await userRepository.save({
        name: 'Admin User',
        email: 'admin@admin.com',
        password: await bcrypt.hash('admin1234', 10),
        roles: await roleRepository.find({ where: { name: 'admin' } })
      });
      // 3. Create Categories
      const categoryNames = ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports', 'Toys'];
      const categories = await categoryRepository.save(
        categoryNames.map((name) => categoryRepository.create({ name }))
      );
      // 4. Create Products
      const createProducts = async (count: number): Promise<Product[]> => {
        const products = Array.from({ length: count }).map((_, i) => {
          const name = `${faker.commerce.productName()} ${i + 1}`;
          return productRepository.create({
            name,
            slug: slugify(name, { lower: true }),
            description: faker.commerce.productDescription(),
            price: Number(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
            categories: faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: 2 }))
          });
        });
        return productRepository.save(products);
      };
      await createProducts(200);
    };
    await seed();
  }
}
