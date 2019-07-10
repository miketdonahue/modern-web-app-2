/* eslint-disable no-await-in-loop */
import { prisma } from '@server/prisma/generated/prisma-client';

const roles = [
  { name: 'ADMIN' },
  {
    name: 'USER',
    prohibitedRoutes: { paths: ['/about'] },
    permissions: {
      connect: [{ key: 'post:write:any' }, { key: 'post:read:any' }],
    },
  },
];

/**
 * Seed roles
 */
export default async () => {
  for (const role of roles) {
    // @ts-ignore
    await prisma.createRole(role);
  }
};
