import { checkAccess } from '@client/modules';
import { withApollo } from '@apollo-setup/with-apollo';

const About = () => {
  return <div>About page</div>;
};

About.getInitialProps = async context => {
  await checkAccess(context);
  return {};
};

export default withApollo()(About);
