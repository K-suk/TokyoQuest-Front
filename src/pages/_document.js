import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                {/* Required meta tags */}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                {/* Google Fonts */}
                <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet" />

                {/* Custom CSS Files */}
                <link rel="stylesheet" href="/css/bootstrap.min.css" />
                <link rel="stylesheet" href="/css/owl.carousel.min.css" />
                <link rel="stylesheet" href="/fonts/icomoon/style.css" />
                <link rel="stylesheet" href="/css/style.css" />
            </Head>
            <body>
                <Main />
                <NextScript />
                {/* Bootstrap JS and dependencies */}
                <script src="/js/jquery-3.3.1.min.js"></script>
                <script src="/js/popper.min.js"></script>
                <script src="/js/bootstrap.min.js"></script>
                <script src="/js/jquery.sticky.js"></script>
                <script src="/js/main.js"></script>
            </body>
        </Html>
    )
}