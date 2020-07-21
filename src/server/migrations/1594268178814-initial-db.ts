import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDb1594268178814 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TYPE role_enum AS ENUM (
          'admin',
          'actor'
        );

        CREATE TYPE provider_enum AS ENUM (
          'google'
        );

        CREATE TABLE role(
          id serial PRIMARY KEY,
          uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
          name role_enum NOT NULL,
          permissions character varying [],
          prohibited_routes jsonb,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE actor(
          id serial PRIMARY KEY,
          uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
          role_id uuid NOT NULL,
          customer_id uuid,
          first_name character varying,
          last_name character varying,
          email character varying UNIQUE NOT NULL,
          password character varying,
          phone_country_code character varying,
          phone character varying,
          country character varying,
          address1 character varying,
          address2 character varying,
          city character varying,
          state character varying,
          postal_code character varying,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE actor_account(
          id serial PRIMARY KEY,
          uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
          actor_id uuid NOT NULL,
          confirmed boolean NOT NULL DEFAULT false,
          confirmed_code character varying,
          confirmed_expires timestamp with time zone,
          locked boolean NOT NULL DEFAULT false,
          locked_code character varying,
          locked_expires timestamp with time zone,
          reset_password_code character varying,
          reset_password_expires timestamp with time zone,
          security_questions text [],
          login_attempts int NOT NULL DEFAULT 0,
          security_question_attempts int NOT NULL DEFAULT 0,
          refresh_token character varying,
          last_visit timestamp with time zone,
          ip character varying,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE customer(
          id serial PRIMARY KEY,
          uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
          actor_id uuid NOT NULL,
          stripe_id character varying NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE permission(
          id serial PRIMARY KEY,
          uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
          name character varying NOT NULL UNIQUE,
          key character varying NOT NULL UNIQUE,
          roles character varying [],
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE oauth(
          id serial PRIMARY KEY,
          uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
          actor_id uuid NOT NULL,
          provider provider_enum NOT NULL,
          refresh_token character varying,
          expires_at timestamp with time zone,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE blacklisted_token(
          id serial PRIMARY KEY,
          uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
          token character varying NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE feature_flag(
          id serial PRIMARY KEY,
          name character varying NOT NULL,
          flag boolean NOT NULL DEFAULT false,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE product(
          id serial PRIMARY KEY,
          uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
          name character varying NOT NULL,
          short_description character varying NOT NULL,
          description text NOT NULL,
          thumbnail character varying NOT NULL,
          image character varying NOT NULL,
          price double precision NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `
        DROP TABLE IF EXISTS role;
        DROP TABLE IF EXISTS actor;
        DROP TABLE IF EXISTS actor_account;
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS permission;
        DROP TABLE IF EXISTS oauth;
        DROP TABLE IF EXISTS blacklisted_token;
        DROP TABLE IF EXISTS product;
      `
    );
  }
}
