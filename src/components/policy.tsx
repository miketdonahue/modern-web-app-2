import { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';
import { withApollo } from '@apollo-setup/with-apollo';

const GET_TOKEN = gql`
  query {
    payload: validateAccess @client {
      token
    }
  }
`;

const Policy = ({ can, children }: any) => {
  const [canAccess, setCanAccess] = useState(false);

  useQuery(GET_TOKEN, {
    onCompleted: response => {
      const { token } = response && response.payload;
      const decoded: any = jwt.decode(token);
      const { permissions } = decoded.role;

      setCanAccess(permissions.includes(can));
    },
  });

  return canAccess && children;
};

export default withApollo()(Policy);
