import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

require('dotenv').config();

const getStrOrFail = (envName: string): string => {
  const val = process.env[envName];
  if (!val) {
    throw new Error(`Env variable with name ${envName} does not exists`);
  }
  return val;
};

export default {
  type: 'postgres',
  host: getStrOrFail('POSTGRES_HOST'),
  port: Number(getStrOrFail('POSTGRES_PORT')),
  username: getStrOrFail('POSTGRES_USER'),
  password: getStrOrFail('POSTGRES_PASSWORD'),
  database: getStrOrFail('POSTGRES_DB'),
  synchronize: false,
  logging: false,
  entities: ['./src/**/*.entity.ts'],
  migrations: ['./src/db/migrations/**/*.ts'],
  subscribers: ['./src/db/subscribers/**/*.ts'],
} as ConnectionOptions;
