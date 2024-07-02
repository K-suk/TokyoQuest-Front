// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '/components/Layout';
import '../styles/globals.css';

// カスタムCSSのインポート
import '/public/css/styles.css';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const loadScripts = async () => {
            await import('jquery');
            await import('bootstrap/dist/js/bootstrap.bundle.min.js');
            await import('/public/js/scripts.js');
        };
        loadScripts();
    }, []);

    // ナビバーを表示しないルートを正規表現で指定
    const noNavbarRoutes = [
        /^\/login$/,
        /^\/password-reset-request$/,
        /^\/reset-password($|\?.*)/ // パスワードリセットURLのチェック
    ];

    const showNavbar = !noNavbarRoutes.some(route => route.test(router.asPath));

    return (
        <>
            {showNavbar && <Layout />}
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;