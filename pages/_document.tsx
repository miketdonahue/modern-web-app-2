import Document, { Html, Head, Main, NextScript } from 'next/document';

class NextDocument extends Document {
  public static async getInitialProps(ctx): Promise<any> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  public render(): any {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/x-icon" href="#" />
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default NextDocument;
