import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActorAccount1572404848135 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE actor_account(
        id serial PRIMARY KEY,
        uuid uuid DEFAULT uuid_generate_v4(),
        actor_id int NOT NULL,
        confirmed boolean NOT NULL DEFAULT false,
        confirmed_code int,
        locked boolean NOT NULL DEFAULT false,
        locked_code int,
        locked_expires timestamptz,
        reset_password_code int,
        reset_password_expires timestamptz,
        security_questions text [],
        login_attempts int NOT NULL DEFAULT 0,
        security_question_attempts int NOT NULL DEFAULT 0,
        refresh_token varchar,
        last_visit timestamptz,
        ip varchar,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL,
        deleted_at timestamptz
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
