import React from 'react';
import Link from 'next/link';
import { getProducts } from '@modules/queries/products';
import { Product as ProductModel } from '@server/entities/product';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { Error } from '@modules/api-response';
import { ServerErrors } from '@components/server-error';
import {
  Button,
  Checkbox,
  Input,
  Tooltip,
  Alert,
  Badge,
  ShoppingCart,
} from '@components/app';
import appLogo from '@public/images/logo-sm.svg';
import { Google, AlertError } from '@components/icons';
import { Data } from '@modules/api-response/typings';
import styles from './products.module.scss';

type Product = Data & {
  attributes: ProductModel;
};

const Products = () => {
  const { data: response, error, isLoading } = getProducts();
  const products = response?.data;

  return (
    <div className="my-4 mx-8">
      <div className="flex justify-end mb-4">
        <ShoppingCart count={5} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {!isLoading &&
          products.map((product: Product) => {
            return (
              <div key={product.id}>
                <img
                  src={product.attributes?.image}
                  alt={product.attributes?.name}
                  width="100%"
                />
                <div>{product.attributes?.name}</div>
                <div>
                  {product.attributes?.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
                <Button>Buy Now</Button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export { Products };
