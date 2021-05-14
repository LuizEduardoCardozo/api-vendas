import { createConnection } from 'typeorm';
import Product from '../../modules/products/typeorm/entities/product';

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  entities: [Product],
  database: 'database',
  migrations: ['src/shared/typeorm/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/shared/typeorm/migrations',
  },
});
