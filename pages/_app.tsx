import App from 'next/app';
import { ApolloProvider } from 'react-apollo';
import withApolloClient from '@client/apollo/with-apollo';
import { checkAccess } from '@client/modules';
import '@styles/core/index.css';

class NextApp extends App {
  public static async getInitialProps({ Component, ctx }): Promise<any> {
    let pageProps = {};

    await checkAccess(ctx);

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  public render(): any {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }

  private props: any;
}

export default withApolloClient(NextApp);
