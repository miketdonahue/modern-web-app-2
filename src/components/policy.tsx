import { Component } from 'react';
import { withApollo } from 'react-apollo';
import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';

const GET_TOKEN = gql`
  query {
    payload: validateAccess @client {
      token
    }
  }
`;

class Policy extends Component {
  public state = {
    canAccess: false,
  };

  public async componentDidMount(): any {
    const { can, client } = this.props;

    const {
      data: { payload },
    } = await client.query({
      query: GET_TOKEN,
    });

    const { token } = payload;
    const decoded = jwt.decode(token);
    const { permissions } = decoded.role;

    this.setState({ canAccess: permissions.includes(can) });
  }

  public render(): any {
    const { children } = this.props;
    const { canAccess } = this.state;

    return canAccess && children;
  }
}

export default withApollo(Policy);
