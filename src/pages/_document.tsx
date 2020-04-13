import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

class MyDocument extends Document {
  public static async getInitialProps(context: DocumentContext): Promise<any> {
    const initialProps = await Document.getInitialProps(context);

    return { ...initialProps };
  }

  public render(): any {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="/fonts/heebo/stage-1/heebo-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/heebo/stage-1/heebo-bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/heebo/stage-1/heebo-extra-bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />

          <style jsx>{`
            @font-face {
              font-family: Heebo;
              src: url(/fonts/heebo/stage-1/heebo-extra-bold.woff2)
                  format('woff2'),
                url(/fonts/heebo/stage-1/heebo-extra-bold.woff) format('woff');
              font-weight: 800;
              font-display: swap;
            }
            @font-face {
              font-family: Heebo;
              src: url(/fonts/heebo/stage-1/heebo-bold.woff2) format('woff2'),
                url(/fonts/heebo/stage-1/heebo-bold.woff) format('woff');
              font-weight: 700;
              font-display: swap;
            }
            @font-face {
              font-family: Heebo;
              src: url(/fonts/heebo/stage-1/heebo-regular.woff2) format('woff2'),
                url(/fonts/heebo/stage-1/heebo-regular.woff) format('woff');
              font-weight: 400;
              font-display: swap;
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />

          <script>
            {`
              if( "fonts" in document ) {
                var extraBold = new FontFace("Heebo", "url(/fonts/heebo/stage-2/heebo-extra-bold.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-extra-bold.woff) format('woff')", { weight: "800" });
                var bold = new FontFace("Heebo", "url(/fonts/heebo/stage-2/heebo-bold.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-bold.woff) format('woff')", { weight: "700" });
                var regular = new FontFace("Heebo", "url(/fonts/heebo/stage-2/heebo-regular.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-regular.woff2) format('woff'), { weight: "400" }");

                Promise.all([ extraBold.load(), bold.load(), regular.load() ]).then(function(fonts) {
                  fonts.forEach(function(font) {
                    document.fonts.add(font);
                  });
                });
              }
            `}
          </script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
