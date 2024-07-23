import { useEffect } from 'react';

function useDynamicCss(url: string) {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = url;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.onload = () => console.log(`${url} has been loaded.`);
        link.onerror = (err) => console.error(`Failed to load ${url}:`, err);
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
            console.log(`${url} has been removed.`);
        };
    }, [url]);
}

export default useDynamicCss;
