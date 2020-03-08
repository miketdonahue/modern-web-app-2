import { checkAccess } from '@client/modules';

const About = () => {
  return <div>About page</div>;
};

About.getInitialProps = async context => {
  await checkAccess(context);
  return {};
};

export default About;
