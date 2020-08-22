import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialConstraints1594269292840 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      -- actor
      ALTER TABLE actor ADD CONSTRAINT actor_role_id_fkey FOREIGN KEY (role_id) REFERENCES role (id);

      -- actor_account
      ALTER TABLE actor_account ADD CONSTRAINT actor_account_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES actor (id);

      -- oauth
      ALTER TABLE oauth ADD CONSTRAINT oauth_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES actor (id);

      -- customer
      ALTER TABLE customer ADD CONSTRAINT customer_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES actor (id);

      -- cart
      ALTER TABLE cart ADD CONSTRAINT cart_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES actor (id);

      -- cart_item
      ALTER TABLE cart_item
        ADD CONSTRAINT cart_item_unique UNIQUE (cart_id, product_id),
        ADD CONSTRAINT cart_item_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES cart (id),
        ADD CONSTRAINT cart_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES product (id);

      -- purchase
      ALTER TABLE purchase ADD CONSTRAINT purchase_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customer (id);

      -- purchase_item
      ALTER TABLE purchase_item
        ADD CONSTRAINT purchase_item_unique UNIQUE (purchase_id, product_id),
        ADD CONSTRAINT purchase_item_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES purchase (id),
        ADD CONSTRAINT purchase_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES product (id);
      `
    );
  };

  public down = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      -- actor

      ALTER TABLE actor DROP CONSTRAINT actor_role_id_fkey;

      -- actor_account
      ALTER TABLE actor_account DROP CONSTRAINT actor_account_actor_id_fkey;

      -- oauth
      ALTER TABLE oauth DROP CONSTRAINT oauth_actor_id_fkey;

      -- customer
      ALTER TABLE customer DROP CONSTRAINT customer_actor_id_fkey;

      -- cart
      ALTER TABLE cart DROP CONSTRAINT cart_actor_id_fkey;

      -- cart_item
      ALTER TABLE cart_item
        DROP CONSTRAINT cart_item_unique,
        DROP CONSTRAINT cart_item_cart_id_fkey,
        DROP CONSTRAINT cart_item_product_id_fkey;

      -- purchase
      ALTER TABLE purchase DROP CONSTRAINT purchase_customer_id_fkey;

      -- purchase_item
      ALTER TABLE purchase_item
        DROP CONSTRAINT purchase_item_unique,
        DROP CONSTRAINT purchase_item_purchase_id_fkey,
        DROP CONSTRAINT purchase_item_product_id_fkey;
      `
    );
  };
}
