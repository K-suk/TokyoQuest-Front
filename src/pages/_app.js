// // pages/_app.js
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '/components/Layout';
// import '../styles/globals.css';

// // カスタムCSSのインポート
// import '/public/css/styles.css';

// function MyApp({ Component, pageProps }) {
//     const router = useRouter();

//     useEffect(() => {
//         const loadScripts = async () => {
//             await import('jquery');
//             await import('bootstrap/dist/js/bootstrap.bundle.min.js');
//             await import('/public/js/scripts.js');
//         };
//         loadScripts();
//     }, []);

//     // ナビバーを表示しないルートを正規表現で指定
//     const noNavbarRoutes = [
//         /^\/login$/,
//         /^\/password-reset-request$/,
//         /^\/reset-password($|\?.*)/ // パスワードリセットURLのチェック
//     ];

//     const showNavbar = !noNavbarRoutes.some(route => route.test(router.asPath));

//     return (
//         <>
//             {showNavbar && <Layout />}
//             <Component {...pageProps} />
//         </>
//     );
// }

// export default MyApp;

// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '/components/Layout';
import '../styles/globals.css';
import { getProfile } from '/services/api';

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

        const checkUserStatus = async () => {
            try {
                const profile = await getProfile();
                if (profile.done && router.pathname !== '/report') {
                    router.push('/report');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        checkUserStatus();
    }, [router]);

    // ナビバーを表示しないルートを正規表現で指定
    const noNavbarRoutes = [
        /^\/login$/,
        /^\/password-reset-request$/,
        /^\/reset-password($|\?.*)/,
        /^\/report$/
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