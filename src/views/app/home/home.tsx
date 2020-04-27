import { NextPageContext } from 'next';
import Link from 'next/link';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import Policy from 'src/components/policy';
import { withApollo } from '@apollo-setup/with-apollo';
import { checkAccess } from '@modules/permissions/check-access';
import * as mutations from './graphql/mutations.gql';

type Props = {
  id: string;
  title: string;
};

const PostLink = (props: Props) => {
  const { id, title } = props;

  return (
    <Link href="/app/post/[id]" as={`/app/post/${id}`}>
      <a>{title}</a>
    </Link>
  );
};

const Home = () => {
  const router = useRouter();
  const client = useApolloClient();
  const cookies = new Cookies();
  const token = cookies.get('token-payload');

  const [logoutActor] = useMutation(mutations.logoutActor, {
    onCompleted: () => {
      client.resetStore();
      return router.push('/app/login');
    },
  });

  const handleLogout = () => {
    logoutActor({
      variables: {
        input: { token },
      },
    });
  };

  return (
    <div>
      <h2>Pages</h2>
      <Policy can="post:read:any">
        <div>Policy</div>
      </Policy>
      <ul>
        <li>
          <Link href="/app/about">
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
      <button onClick={handleLogout} type="button">
        Logout
      </button>
    </div>
  );
};

Home.getInitialProps = async (context: NextPageContext) => {
  await checkAccess(context);
  return {};
};

export default withApollo()(Home);
