import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActorAccount1572404848135 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE actor_account(
        id serial PRIMARY KEY,
        uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
        actor_id uuid NOT NULL,
        confirmed boolean NOT NULL DEFAULT false,
        confirmed_code varchar,
        confirmed_expires timestamp with time zone,
        locked boolean NOT NULL DEFAULT false,
        locked_code varchar,
        locked_expires timestamp with time zone,
        reset_password_code varchar,
        reset_password_expires timestamp with time zone,
        security_questions text [],
        login_attempts int NOT NULL DEFAULT 0,
        security_question_attempts int NOT NULL DEFAULT 0,
        refresh_token varchar,
        last_visit timestamp with time zone,
        ip varchar,
        created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
        updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
        deleted_at timestamp with time zone,
        deleted boolean NOT NULL DEFAULT false
      );
      `
    );
  };

  public down = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      DROP TABLE IF EXISTS actor_account;
      `
    );
  };
}
