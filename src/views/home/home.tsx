import Link from 'next/link';
// import Router, { withRouter } from 'next/router';
// import Cookies from 'universal-cookie';
import Policy from 'src/components/policy';
import { withApollo } from '@apollo-setup/with-apollo';
import { checkAccess } from '@modules/permissions/check-access';
// import * as mutations from './graphql/mutations.gql';

const PostLink = (props: any) => {
  const { id, title } = props;

  return (
    <Link href="/post/[id]" as={`/post/${id}`}>
      <a>{title}</a>
    </Link>
  );
};

const Home = props => {
  // const handleLogout = () => {
  //   const { client } = this.props;
  //   const cookies = new Cookies();
  //   const token = cookies.get('token');

  //   client
  //     .mutate({
  //       mutation: mutations.logoutActor,
  //       variables: {
  //         input: { token },
  //       },
  //     })
  //     .then(() => {
  //       cookies.remove('token', { path: '/' });
  //       return Router.push('/login');
  //     });
  // };

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
      {/* <button onClick={handleLogout} type="button">
        Logout
      </button> */}
    </div>
  );
};

Home.getInitialProps = async context => {
  await checkAccess(context);
  return {};
};

export default withApollo()(Home);
