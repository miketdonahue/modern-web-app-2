import { MigrationInterface, getManager } from 'typeorm';
import { SecurityQuestion } from '@server/entities/security-question';

export class SecurityQuestion1572503486351 implements MigrationInterface {
  public up = async (): Promise<any> => {
    const db = getManager('seed');

    await db.insert(SecurityQuestion, [
      {
        short_name: 'occupationGrewUp',
        question:
          'When you were young, what did you want to be when you grew up?',
      },
      {
        short_name: 'childhoodHero',
        question: 'Who was your childhood hero?',
      },
      {
        short_name: 'townBorn',
        question: 'What is the name of the town where you were born?',
      },
      {
        short_name: 'elementarySchool',
        question: 'What elementary school did you attend?',
      },
      {
        short_name: 'firstCar',
        question: 'What was the make and model of your first car?',
      },
      {
        short_name: 'firstPetName',
        question: 'What is the name of your first pet?',
      },
      {
        short_name: 'mothersMaidenName',
        question: "What is your mother's maiden name?",
      },
      {
        short_name: 'streetName',
        question: 'What street did you live on in third grade?',
      },
      {
        short_name: 'stuffedAnimalName',
        question: 'What was the name of your first stuffed animal?',
      },
      {
        short_name: 'firstJobLocation',
        question: 'In what city or town was your first job?',
      },
      {
        short_name: 'motherFatherMetLocation',
        question: 'In what city or town did your mother and father meet?',
      },
      {
        short_name: 'oldestCousinName',
        question: "What is your oldest cousin's first and last name?",
      },
      {
        short_name: 'meetSpouseLocation',
        question: 'In what city did you meet your spouse/significant other?',
      },
      {
        short_name: 'firstKissName',
        question:
          'What is the first name of the boy or girl that you first kissed?',
      },
      {
        short_name: 'nearestSiblingLive',
        question: 'In what city does your nearest sibling live? ',
      },
    ]);
  };

  public down = async (): Promise<any> => {};
}
