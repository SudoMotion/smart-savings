import { Head, usePage } from '@inertiajs/react';

export default function SiteFavicon() {
    const { site } = usePage().props;

    return (
        <Head>
            <link rel="icon" href={site?.favicon_url || '/images/favicon.png'} />
        </Head>
    );
}
