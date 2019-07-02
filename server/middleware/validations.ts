import path from 'path';
import { shield } from 'graphql-shield';
import assign from 'assign-deep';
import config from '@config';
import fileLoader from '@utils/node-file-loader';

const validationsArray = fileLoader(
  path.join(process.cwd(), config.server.dirs.validations)
);

/**
 * Create input validations
 *
 * @remarks
 * This function uses GraphQL Shield to create input validations for GraphQL requests
 *
 * @param validations - An object of validations
 * @returns A Shield function generator to be used as middleware
 */
export default shield(assign(...validationsArray));
