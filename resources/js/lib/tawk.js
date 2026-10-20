const TAWK_EMBED_SRC =
    'https://embed.tawk.to/6ac0ed545437be34c4581ef8/1k40pu4uj';

/**
 * Load Tawk.to once with offsets so the bubble sits above the viewport edge / bottom nav.
 */
export function loadTawkTo() {
    if (document.querySelector(`script[src="${TAWK_EMBED_SRC}"]`)) {
        return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.customStyle = {
        visibility: {
            desktop: {
                position: 'br',
                xOffset: 20,
                yOffset: 48,
            },
            mobile: {
                position: 'br',
                xOffset: 16,
                yOffset: 96,
            },
        },
    };
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    const firstScript = document.getElementsByTagName('script')[0];
    script.async = true;
    script.src = TAWK_EMBED_SRC;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
    } else {
        document.head.appendChild(script);
    }
}
