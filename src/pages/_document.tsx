import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  public static async getInitialProps(context): Promise<any> {
    const initialProps = await Document.getInitialProps(context);

    return { ...initialProps };
  }

  public render(): any {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />

          {/*
            The below empty script with an empty space is a hack to fix FOUC with Ant Design due to Chromium bug
            https://lab.laukstein.com/bug/input
          */}
          <script> </script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
