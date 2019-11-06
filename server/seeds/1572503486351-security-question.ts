import { MigrationInterface, QueryRunner, getManager } from 'typeorm';
import { SecurityQuestion } from '@server/entities/security-question';

export class SecurityQuestion1572503486351 implements MigrationInterface {
  public up = async (queryRunner: QueryRunner): Promise<any> => {
    const db = getManager('seed');

    await db.insert(SecurityQuestion, [
      {
        shortName: 'occupationGrewUp',
        question:
          'When you were young, what did you want to be when you grew up?',
      },
      {
        shortName: 'childhoodHero',
        question: 'Who was your childhood hero?',
      },
      {
        shortName: 'townBorn',
        question: 'What is the name of the town where you were born?',
      },
      {
        shortName: 'elementarySchool',
        question: 'What elementary school did you attend?',
      },
      {
        shortName: 'firstCar',
        question: 'What was the make and model of your first car?',
      },
      {
        shortName: 'firstPetName',
        question: 'What is the name of your first pet?',
      },
      {
        shortName: 'mothersMaidenName',
        question: "What is your mother's maiden name?",
      },
      {
        shortName: 'streetName',
        question: 'What street did you live on in third grade?',
      },
      {
        shortName: 'stuffedAnimalName',
        question: 'What was the name of your first stuffed animal?',
      },
      {
        shortName: 'firstJobLocation',
        question: 'In what city or town was your first job?',
      },
      {
        shortName: 'motherFatherMetLocation',
        question: 'In what city or town did your mother and father meet?',
      },
      {
        shortName: 'oldestCousinName',
        question: "What is your oldest cousin's first and last name?",
      },
      {
        shortName: 'meetSpouseLocation',
        question: 'In what city did you meet your spouse/significant other?',
      },
      {
        shortName: 'firstKissName',
        question:
          'What is the first name of the boy or girl that you first kissed?',
      },
      {
        shortName: 'nearestSiblingLive',
        question: 'In what city does your nearest sibling live? ',
      },
    ]);
  };

  public down = async (queryRunner: QueryRunner): Promise<any> => {};
}
