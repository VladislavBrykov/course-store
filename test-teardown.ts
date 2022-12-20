import type { Connection } from 'typeorm';
const {
  createConnection: _createConnection,
  getRepository,
} = require('typeorm');
import * as ormconfig from '@ormconfig';

const newConnection = () => _createConnection(ormconfig.default);
const truncateAll = (conn: Connection) =>
  conn.entityMetadatas
    .map(({ name, tableName }) => ({ name, tableName }))
    .reduce(
      (promise, { name, tableName }) =>
        promise.then(() =>
          getRepository(name).query(`truncate table ${tableName} cascade`),
        ),
      Promise.resolve(),
    );
const dropDb = async (conn: Connection) => {
  await conn.dropDatabase();
};

export default async () => {
  const conn = await newConnection();
  await truncateAll(conn);
  await dropDb(conn);
  await conn.close();
};
