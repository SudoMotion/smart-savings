const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'resources/js/Layouts/Frontend/FrontendLayout.jsx');
let content = fs.readFileSync(file, 'utf8');

const useEffectImport = "import { useEffect } from 'react';\n";
if (!content.includes('useEffect')) {
    content = useEffectImport + content;
}

const tawkScript = `
    useEffect(() => {
        if (!window.Tawk_API) {
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_LoadStart = new Date();
            const s1 = document.createElement("script");
            const s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/6ac0ed545437be34c4581ef8/1k40pu4uj';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            if (s0 && s0.parentNode) {
                s0.parentNode.insertBefore(s1, s0);
            } else {
                document.head.appendChild(s1);
            }
        }
    }, []);
`;

const insertPoint = content.indexOf('const cats = categories || pageCategories || [];');
if (insertPoint !== -1) {
    const afterInsert = content.substring(insertPoint + 'const cats = categories || pageCategories || [];'.length);
    const beforeInsert = content.substring(0, insertPoint + 'const cats = categories || pageCategories || [];'.length);
    content = beforeInsert + '\n' + tawkScript + afterInsert;
}

fs.writeFileSync(file, content);
