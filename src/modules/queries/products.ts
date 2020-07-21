import { useQuery } from 'react-query';
import * as dataSources from '@modules/data-sources/products';

const getProducts = () => {
  const variables = useQuery('/api/v1/products', dataSources.getProducts);
  return { ...variables };
};

export { getProducts };
