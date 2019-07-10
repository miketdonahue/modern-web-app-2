/* eslint-disable no-await-in-loop */
import { prisma } from '@server/prisma/generated/prisma-client';

const permissions = [
  { name: 'Create Post', key: 'post:write:any' },
  { name: 'Read Post', key: 'post:read:any' },
];

/**
 * Seed permissions
 */
export default async () => {
  for (const permission of permissions) {
    // @ts-ignore
    await prisma.createPermission(permission);
  }
};
