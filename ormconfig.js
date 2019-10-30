module.exports = [
  {
    name: 'development',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'mike',
    password: '',
    database: 'development',
    entities: ['server/entities/**/*.ts'],
    migrations: ['server/migrations/*.ts'],
    cli: {
      entitiesDir: 'server/entities',
      migrationsDir: 'server/migrations',
    },
    logging: true,
    synchronize: true,
  },
];
