import { useRef, useEffect } from 'react'

export default function ScrollToBottom ({initialRender, updateInititalRenderFalse, updateScrollSignalFalse}) {
    const elementRef = useRef();
    useEffect(() => {
        if (initialRender) {
            elementRef.current.scrollIntoView()
            updateInititalRenderFalse()
        } else {
            elementRef.current.scrollIntoView({ behavior: "smooth" })
        }
        
        setTimeout(updateScrollSignalFalse, 1000)
    }, []);
    return <div ref={elementRef} className="scroll-into-view"/>;
};