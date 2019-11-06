module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['server/entities/**/*.ts'],
    migrations: ['server/migrations/*.ts'],
    cli: {
      entitiesDir: 'server/entities',
      migrationsDir: 'server/migrations',
    },
    logging: true,
  },
  {
    name: 'seed',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['server/entities/**/*.ts'],
    migrations: ['server/seeds/*.ts'],
    cli: {
      migrationsDir: 'server/seeds',
    },
    logging: true,
  },
];
