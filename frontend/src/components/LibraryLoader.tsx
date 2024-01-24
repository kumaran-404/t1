import { useEffect } from "react"

function LibraryLoader() {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.lordicon.com/lordicon.js';
        script.async = true;
        document.body.appendChild(script);
    }, [])

    return (
        <></>
    )
}

export default LibraryLoader