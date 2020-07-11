import Link from 'next/link';

interface Props {
  post: {
    title: string;
  };
}

const Post = ({ post }: Props) => {
  return (
    <div>
      <h2>Pages</h2>
      <ul>
        <li>
          <Link href="/app">
            <a>Home</a>
          </Link>
        </li>
      </ul>
      <h2>{post.title}</h2>
      <p>This is the blog post content.</p>
    </div>
  );
};

Post.getInitialProps = async () => {
  // From database
  const posts = [
    { id: 'web-app-security', title: 'Web application security' },
    { id: 'nodejs-web-server', title: 'Create a Node.js web server' },
    { id: 'css-in-js', title: 'Using CSS in JS' },
  ];

  const post = posts.find((p) => p.id === 'css-in-js');

  return { post };
};

export default Post;
