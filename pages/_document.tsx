import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  public static async getInitialProps(ctx): Promise<any> {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  public render(): any {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
