import { useEffect } from "react"


/**
 * !!!PLEASE!!! WRAP YOUR FUNCTION IN A CALLBACK TO AVOID RERENDERS
 * Your function runs when the window closes. Return a non-empty string
 * if you would like the user to be stopped from exiting the tab quite
 * yet.
 * @param onUnload Function to run when the user attempts to exit. Return a string as a message to the user.
 * @returns null
 */
const useUnload = (onUnload: ()=>string|undefined) => {
    useEffect(()=> {
        const _onUnload = (e: BeforeUnloadEvent) => {
            const message = onUnload();
            if (!message) return
            (e || window.event).returnValue = message;
            return message; 
        }

        window.addEventListener('beforeunload', _onUnload)
        return ()=> window.removeEventListener('beforeunload', _onUnload)
    }, [onUnload])

    return null;
}

export default useUnload;