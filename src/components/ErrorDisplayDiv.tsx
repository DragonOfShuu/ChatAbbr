import { generateUUID } from '@/database/utilities'
import { Dispatch, ReactNode, createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'

type ErrorDataType = {
    message: string,
    type: 'critical'|'warning'|'neutral',
    id: string,
    destructionTime?: number
}

type ErrorDisplayManagerType = {
    errors: ErrorDataType[]
}

type ErrorDisplayAction = 
    | { type: 'newError', error: Omit<ErrorDataType, 'id'> & {id?: string} }
    | { type: 'deleteError', errorId: string }

type ErrorDisplayContextType = {
    errorDisplayManager: ErrorDisplayManagerType, 
    errorDisplayDispatch: Dispatch<ErrorDisplayAction>
}

const ErrorDisplayContext = 
    createContext<ErrorDisplayContextType|null>(null);

type Props = {
    children: ReactNode
    className?: string
    errorAbove?: true
}

const determineMessageClass = (messageType: ErrorDataType["type"]): string => {
    switch (messageType) {
        case 'critical':
            return 'border-2 border-red-600 bg-red-600 bg-opacity-30'
        case 'neutral':
            return 'border-2 border-gray-500 bg-gray-500 bg-opacity-30'
        case 'warning':
            return 'border-2 border-yellow-500 bg-yellow-500 bg-opacity-30'
    }
}

const ErrorDisplayDiv = (props: Props) => {
    const [errorDisplayManager, errorDisplayDispatch] = useReducer(ErrorDisplayReducer, {errors: []})

    return (
        <ErrorDisplayContext.Provider value={{errorDisplayManager: errorDisplayManager, errorDisplayDispatch: errorDisplayDispatch}}>
            <div className={`flex ${props.errorAbove?'flex-col':'flex-col-reverse'} ${props.className??''}`}>
                <div className={`flex flex-col gap-2`}>
                    {
                        errorDisplayManager.errors.map((error)=> (
                            <ErrorDisplay error={error} />
                        ))
                    }
                </div>
                <div className={`h-full`}>
                    {props.children}
                </div>
            </div>
        </ErrorDisplayContext.Provider>
    )
}

const ErrorDisplay = ({error, ...props}: {error: ErrorDataType}) => {
    const [errorTimeout, setErrorTimeout] = useState<number|undefined>(undefined);
    const timeoutRan = useRef<boolean>(false);

    const {errorDisplayDispatch} = useErrorDisplay()

    const clearErrorTimeout = () => {
        if (timeoutRan.current||errorTimeout===undefined) return

        clearTimeout(errorTimeout)
    }

    const deleteError = ()=> {
        clearErrorTimeout();
        errorDisplayDispatch({ type: 'deleteError', errorId: error.id })
    }

    useEffect(()=> {
        if (error.destructionTime===0) return
        setErrorTimeout(
            setTimeout(()=> {
                timeoutRan.current = true;
                deleteError();
            }, error.destructionTime??5000)
        )
        
        // Cleanup function
        return () => {
            clearErrorTimeout();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={`w-full rounded-lg p-3 text-lg ${determineMessageClass(error.type)}`} key={error.id}>
            {error.message}
        </div> 
    )
}

export const useErrorDisplay = () => {
    return useContext(ErrorDisplayContext) as ErrorDisplayContextType;
}

const ErrorDisplayReducer = (state: ErrorDisplayManagerType, action: ErrorDisplayAction) => {
    let newState = {...state};
    switch (action.type) {
        case 'newError':
            const newError: ErrorDataType = {id: generateUUID(), ...action.error}
            newState['errors'] = [...newState.errors, newError]
            return newState
        case 'deleteError':
            newState['errors'] = newState.errors.filter((error)=> error.id!==action.errorId);
            return newState;
    }
    // return state;
}

export default ErrorDisplayDiv;