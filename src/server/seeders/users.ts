/* eslint-disable no-await-in-loop */
import argon2 from 'argon2';
import { Chance } from 'chance';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import { prisma } from '@server/prisma/generated/prisma-client';
import generateCode from '@server/modules/code';
import config from '@config';

const chance = new Chance();
const numberOfUsers = 5;

/**
 * Seed users
 */
export default async () => {
  const password = await argon2.hash('Prisma123', {
    timeCost: 2000,
    memoryCost: 500,
  });

  for (let i = 0; i < numberOfUsers; i++) {
    const email = chance.email();
    const role = await prisma.role({ name: 'USER' });
    const refreshToken = jwt.sign(
      { hash: uuid() },
      config.server.auth.jwt.secret,
      {
        expiresIn: config.server.auth.jwt.refreshExpiresIn,
      }
    );

    await prisma.createUser({
      role: { connect: { id: role && role.id } },
      firstName: chance.first(),
      lastName: chance.last(),
      email,
      password,
      phoneCountryCode: '1',
      phone: chance.phone({ formatted: false, country: 'us' }),
      country: 'United States',
      address1: chance.address(),
      city: chance.city(),
      state: chance.state(),
      postalCode: chance.zip(),
      userAccount: {
        create: {
          confirmedCode: config.server.auth.confirmable ? generateCode() : null,
          refreshToken,
        },
      },
    });
  }
};
