const { createConnection } = require('typeorm');
import config from './ormconfig';

export default async () => {
  const conn = await createConnection(config);
  await conn.runMigrations({ transaction: 'each' });
  await conn.close();
};
