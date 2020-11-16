import Link from 'next/link';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import { config } from '@config';
import { changeCartStatus } from '@modules/data-sources/carts';
import { request } from '@modules/request';
import { Show } from '@components/show';
import { CART_STATUS } from '@typings/entities/cart';

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
  const cookies = new Cookies();
  const token = cookies.get(config.server.auth.jwt.tokenNames.payload);

  const [logOut] = useMutation(
    (variables: any) => request.post('/api/v1/auth/logout', variables),
    {
      onSuccess: () => {
        router.push('/app/login');
      },
    }
  );

  const handleLogout = () => {
    const applyCartStatusChange = async () => {
      await changeCartStatus({ status: CART_STATUS.ABANDONED });
    };

    applyCartStatusChange();

    logOut({
      token,
    });
  };

  return (
    <div>
      <h2>Pages</h2>
      <Link href="/app/courses">
        <a>Courses</a>
      </Link>
      <Show can="post:read:any">
        <div>Show</div>
      </Show>
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

export { Home };
