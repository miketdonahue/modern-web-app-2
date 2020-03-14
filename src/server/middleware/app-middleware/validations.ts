import { shield } from 'graphql-shield';
import assign from 'assign-deep';
import { fileLoader } from '@utils/file-loaders/node';

const validationsArray = fileLoader('validations');

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
