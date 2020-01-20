import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialConstraints1572411741660 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    await queryRunner.query(
      `
      -- actor
      ALTER TABLE actor ADD CONSTRAINT actor_role_id_fkey FOREIGN KEY (role_id) REFERENCES role (uuid);

      -- actor_account
      ALTER TABLE actor_account ADD CONSTRAINT actor_account_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES actor (uuid);

      -- security_question_answer
      ALTER TABLE security_question_answer ADD CONSTRAINT security_question_answer_actor_account_id_fkey FOREIGN KEY (actor_account_id) REFERENCES actor_account (uuid);
      ALTER TABLE security_question_answer ADD CONSTRAINT security_question_answer_security_question_id_fkey FOREIGN KEY (security_question_id) REFERENCES security_question (uuid);
      ALTER TABLE security_question_answer ADD CONSTRAINT sqa_actor_account_id_sq_id_unique UNIQUE (actor_account_id, security_question_id);

      -- oauth
      ALTER TABLE oauth ADD CONSTRAINT oauth_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES actor (uuid);
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

      -- security_question_answer
      ALTER TABLE security_question_answer DROP CONSTRAINT security_question_answer_actor_account_id_fkey;
      ALTER TABLE security_question_answer DROP CONSTRAINT security_question_answer_security_question_id_fkey;

      -- oauth
      ALTER TABLE oauth DROP CONSTRAINT oauth_actor_id_fkey;
      `
    );
  };
}
