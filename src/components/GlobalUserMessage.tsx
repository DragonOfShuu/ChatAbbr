import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react"


type Props = {
    children: ReactNode
}

export type GlobalMessage = {
    text: string,
    type: 'error'|'success'|'warning'|'neutral'
}

export type MessageDispatchActions =
    | { type: "NewMessage", message: GlobalMessage }

type GlobalMessageContextType = {globalMessages: GlobalMessage[], globalMessageDispatch: Dispatch<MessageDispatchActions>}

const GlobalMessageContext = 
    createContext<GlobalMessageContextType|null>(null)

const GlobalMessageComp = (props: Props) => {
    const [globalMessages, globalMessageDispatch] = useReducer(reducerFunc, [])

    return (
        <GlobalMessageContext.Provider value={{globalMessages: globalMessages, globalMessageDispatch: globalMessageDispatch}}>
            {props.children}
        </GlobalMessageContext.Provider>
    )
}

export const useGlobalMessageContext = () => {
    return useContext(GlobalMessageContext) as GlobalMessageContextType
}

const reducerFunc = (state: GlobalMessage[], action: MessageDispatchActions) => {
    return state
}

export default GlobalMessageComp
