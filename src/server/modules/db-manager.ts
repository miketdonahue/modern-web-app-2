import { getConnection } from 'typeorm';

const getManager = () => {
  const isDev = process.env.NODE_ENV !== 'production';
  const dbConnectionName = isDev ? 'development' : 'production';

  const db = getConnection(dbConnectionName);

  return db.manager;
};

export { getManager };
