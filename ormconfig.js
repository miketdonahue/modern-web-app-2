module.exports = [
  {
    name: 'production',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['.build/src/server/entities/**/*.js'],
    migrations: ['.build/src/server/migrations/*.js'],
    logging: false,
  },
  {
    name: 'development',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/server/entities/**/*.ts'],
    migrations: ['src/server/migrations/*.ts'],
    cli: {
      entitiesDir: 'src/server/entities',
      migrationsDir: 'src/server/migrations',
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
    entities: ['src/server/entities/**/*.ts'],
    migrations: ['src/server/seeders/*.ts'],
    cli: {
      migrationsDir: 'src/server/seeders',
    },
    logging: true,
  },
];
