import { DataSource } from 'typeorm';
import { User } from '../entity/user';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'tejas',
  password: 'tejas',
  database: 'node_demo',
  synchronize: true,
  logging: false,
  entities: [User],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
