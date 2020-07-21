/* eslint-disable no-await-in-loop */
import { MigrationInterface, getManager } from 'typeorm';
import { Chance } from 'chance';
import { Product } from '@server/entities/product';

const chance = new Chance();
const numberOfProducts = 10;

export class Product1595200923270 implements MigrationInterface {
  public up = async (): Promise<any> => {
    const db = getManager('seed');

    for (let i = 0; i < numberOfProducts; i++) {
      const name = chance.company();
      const shortDescription = chance.paragraph({ sentences: 1 });
      const description = chance.paragraph({ sentences: 5 });

      const index = i + 1;

      await db.insert(Product, [
        {
          name,
          short_description: shortDescription,
          description,
          thumbnail: `https://rickandmortyapi.com/api/character/avatar/${index}.jpeg`,
          image: `https://rickandmortyapi.com/api/character/avatar/${index}.jpeg`,
          price: 19.99,
        },
      ]);
    }
  };

  public down = async (): Promise<any> => {};
}
