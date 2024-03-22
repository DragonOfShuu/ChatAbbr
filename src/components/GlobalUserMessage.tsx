import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react"


type Props = {
    children: ReactNode
}

export type GlobalMessageType = {
    text: string,
    id: string,
    type: 'error'|'success'|'warning'|'neutral'
}

export type MessageDispatchActions =
    | { type: "NewMessage", message: Omit<GlobalMessageType[], 'id'> | Omit<GlobalMessageType, 'id'> }

type GlobalMessageContextType = {globalMessages: GlobalMessageType[], globalMessageDispatch: Dispatch<MessageDispatchActions>}

const GlobalMessageContext = 
    createContext<GlobalMessageContextType|null>(null)

const GlobalMessageProvider = (props: Props) => {
    const [globalMessages, globalMessageDispatch] = useReducer(reducerFunc, [])

    return (
        <GlobalMessageContext.Provider value={{globalMessages: globalMessages, globalMessageDispatch: globalMessageDispatch}}>
            {props.children}
            <GlobalMessageSlot />
        </GlobalMessageContext.Provider>
    )
}

export const useGlobalMessageContext = () => {
    return useContext(GlobalMessageContext) as GlobalMessageContextType
}

const reducerFunc = (state: GlobalMessageType[], action: MessageDispatchActions) => {
    const newState: GlobalMessageType[] = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case ('NewMessage'):
            
            break;
    
        default:
            break;
    }
    return state;
}

const GlobalMessageSlot = (props: {}) => {
    const {globalMessages} = useGlobalMessageContext()

    return (
        <div className="absolute top-2 right-2 flex-col z-50 gap-5">
            {
                globalMessages.map((gm, index)=> {
                    return <GlobalMessage {...gm} key={gm.id} />
                })
            }
        </div>
    )
}

const GlobalMessage = (props: GlobalMessageType & {className?: string}) => {
    return (
        <div className={`${props.className??''} rounded-lg border-l-2`}>

        </div>
    )
}

export default GlobalMessageProvider
