import { NextPageContext } from 'next';
import { checkAccess } from '@modules/permissions/check-access';
import { withApollo } from '@apollo-setup/with-apollo';

const About = () => {
  return <div>About page</div>;
};

About.getInitialProps = async (context: NextPageContext) => {
  await checkAccess(context);
  return {};
};

export default withApollo()(About);
