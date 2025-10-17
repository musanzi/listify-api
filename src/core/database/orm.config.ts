import { DataSource } from 'typeorm';
import * as process from 'node:process';
import type { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { config } from 'dotenv';

config({
  path: '.env',
});

export const typeOrmOptions: DataSourceOptions & { seeds: string[] } = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  migrations: ['src/core/database/migrations/**'],
  entities: ['dist/**/*.entity.js'],
  seeds: ['dist/src/core/database/seeds/**.js'],
};
export const dataSource = new DataSource(typeOrmOptions);

dataSource.initialize();
