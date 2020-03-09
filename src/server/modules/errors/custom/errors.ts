/* eslint-disable max-classes-per-file */
/* eslint-disable prefer-object-spread */
import { ApolloError } from 'apollo-server-express';
import errors from './constants';

interface InternalMeta {
  args?: object;
  code?: string;
}

interface ExternalMeta {
  source: string;
}

/**
 * Error class for application sourced errors
 *
 * @param type - A internal error constant
 * @param meta - Additional useful error metadata
 * @returns ApolloError
 */
export class InternalError extends ApolloError {
  public constructor(type: string, meta?: InternalMeta) {
    const { message, code } = (errors as any)[type];
    const additionalProperties = Object.assign({}, (errors as any)[type].meta, {
      source: 'InternalError',
      ...meta,
    });

    super(message, code, additionalProperties);
  }
}

/**
 * Error class for third-party sourced errors
 *
 * @param error - The third-party Error object
 * @param meta - Additional useful error metadata
 * @returns ApolloError
 */
export class ExternalError extends ApolloError {
  public constructor(error: any, meta: ExternalMeta) {
    const { message, ...restOfProperties } = error;
    const additionalProperties = Object.assign(
      {},
      { ...meta, ...restOfProperties }
    );

    super(message, undefined, additionalProperties);
  }
}
