import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDb1594268178814 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE role(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          name character varying NOT NULL,
          permissions character varying [],
          prohibited_routes jsonb,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE actor(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          role_id uuid NOT NULL,
          first_name character varying,
          last_name character varying,
          email character varying UNIQUE NOT NULL,
          password character varying,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE actor_account(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          actor_id uuid NOT NULL,
          confirmed boolean NOT NULL DEFAULT false,
          confirmed_code character varying,
          confirmed_expires timestamp with time zone,
          locked boolean NOT NULL DEFAULT false,
          locked_code character varying,
          locked_expires timestamp with time zone,
          reset_password_code character varying,
          reset_password_expires timestamp with time zone,
          login_attempts int NOT NULL DEFAULT 0,
          refresh_token character varying,
          last_visit timestamp with time zone,
          ip character varying,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE customer(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          actor_id uuid NOT NULL,
          vendor_id character varying,
          phone_country_code character varying,
          phone character varying,
          country character varying,
          address_line1 character varying,
          address_line2 character varying,
          city character varying,
          state character varying,
          postal_code character varying,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE permission(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          name character varying NOT NULL UNIQUE,
          key character varying NOT NULL UNIQUE,
          roles character varying [],
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE oauth(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          actor_id uuid NOT NULL,
          provider character varying NOT NULL,
          refresh_token character varying,
          expires_at timestamp with time zone,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE blacklisted_token(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          vendor_id character varying NOT NULL,
          name character varying NOT NULL,
          image_url character varying NOT NULL,
          description text NOT NULL,
          short_description character varying NOT NULL,
          statement_descriptor character varying NOT NULL,
          price integer NOT NULL DEFAULT 0,
          active boolean NOT NULL DEFAULT true,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE cart(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          actor_id uuid NOT NULL,
          status character varying NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE cart_item(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          cart_id uuid NOT NULL,
          product_id uuid NOT NULL,
          quantity integer NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE purchase(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          customer_id uuid NOT NULL,
          order_number character varying NOT NULL,
          tax integer NOT NULL DEFAULT 0,
          subtotal integer NOT NULL,
          total integer NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          updated_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::timestamptz,
          deleted boolean NOT NULL DEFAULT false
        );

        CREATE TABLE purchase_item(
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          purchase_id uuid NOT NULL,
          product_id uuid NOT NULL,
          quantity integer NOT NULL,
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
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS cart_item;
        DROP TABLE IF EXISTS purchase;
        DROP TABLE IF EXISTS purchase_item;
      `
    );
  }
}
