import merge from 'deepmerge';
import { fileLoader } from '@utils/file-loaders/node';

/**
 * Merge all resolver objects server-side
 *
 * @returns A merged object of all resolvers
 */
export const mergeResolvers = (): any => {
  const resolvers = fileLoader('resolvers');

  return resolvers.length === 1 ? resolvers[0] : merge.all(resolvers);
};
