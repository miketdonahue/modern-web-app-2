/* eslint-disable no-await-in-loop */
import { prisma } from '@server/prisma/generated/prisma-client';

const roles = [{ name: 'USER' }];

/**
 * Seed roles
 */
export default async () => {
  for (const role of roles) {
    // @ts-ignore
    await prisma.createRole(role);
  }
};
