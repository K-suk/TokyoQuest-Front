// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'src/styles/globals.css';
import '/public/css/styles.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '/components/Layout';
import { getProfile, getReports, generateReport } from '/services/api';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const loadScripts = async () => {
            await import('jquery');
            await import('bootstrap/dist/js/bootstrap.bundle.min.js');
            await import('/public/js/scripts.js');
        };
        loadScripts();
    }, [router]);

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