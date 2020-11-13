import resolveConfig from 'tailwindcss/resolveConfig';
// @ts-ignore
import tailwindConfig from '../../tailwind.config';

export const useTailwind = () => resolveConfig(tailwindConfig);
