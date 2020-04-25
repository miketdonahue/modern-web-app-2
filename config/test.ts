import merge from 'deepmerge';
import defaultConfig from './default';

export default merge(
  defaultConfig,
  {},
  { arrayMerge: (destinationArray, sourceArray, options) => sourceArray }
);
