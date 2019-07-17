import { Component } from 'react';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import { withApollo, compose } from 'react-apollo';
import Cookies from 'universal-cookie';
import Policy from '@client/components/policy';
import * as mutations from './graphql/mutations.graphql';

const PostLink = (props): any => {
  const { id, title } = props;

  return (
    <Link as={`/posts/${id}`} href={`/post?id=${id}`}>
      <a>{title}</a>
    </Link>
  );
};

class Index extends Component {
  private logout = () => {
    const { client } = this.props;
    const cookies = new Cookies();
    const token = cookies.get('token');

    client
      .mutate({
        mutation: mutations.logoutUser,
        variables: {
          input: { token },
        },
      })
      .then(() => {
        cookies.remove('token', { path: '/' });
        cookies.remove('ds_token', { path: '/' });

        return Router.push('/login');
      });
  };

  public render(): any {
    return (
      <div>
        <h2>Pages</h2>
        <Policy can="post:read:any">
          <div>Policy</div>
        </Policy>
        <ul>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
        </ul>
        <h2>Posts</h2>
        <ul>
          <li>
            <PostLink id="web-app-security" title="Web application security" />
          </li>
          <li>
            <PostLink
              id="nodejs-web-server"
              title="Create a Node.js web server"
            />
          </li>
          <li>
            <PostLink id="css-in-js" title="Using CSS in JS" />
          </li>
        </ul>
        <button onClick={this.logout} type="button">
          Logout
        </button>
      </div>
    );
  }
}

export default compose(
  withApollo,
  withRouter
)(Index);
