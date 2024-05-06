import { useEffect, useState } from "react"

export const UseOrigin = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=> {
        setIsMounted(true);
    },[])

    const origin = typeof Window !== "undefined" && window.location.origin ? window.location.origin : ""

    if (!isMounted) {
        return ""
    }

    return origin;
}