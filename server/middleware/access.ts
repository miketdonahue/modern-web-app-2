import { shield, deny } from 'graphql-shield';
import assign from 'assign-deep';
import config from '@config';
import { InternalError } from '@server/modules/errors';
import { fileLoader } from '@utils/file-loaders/node';

const permissionsArray = fileLoader('permissions');

/**
 * Create access permissions
 *
 * @remarks
 * This function uses GraphQL Shield to perform access checks restricting GraphQL model data access
 *
 * @param permissions - An object of permissions
 * @param options - A hash of Shield options
 * @returns A Shield function generator to be used as middleware
 */
export default shield(assign(...permissionsArray), {
  debug: config.server.graphql.debug,
  fallbackRule: deny,
  fallbackError: new InternalError('UNAUTHORIZED'),
});
