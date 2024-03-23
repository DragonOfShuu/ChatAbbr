import { generateUUID } from "@/database/utilities"
import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react"
import SvgButton from "./SvgButton"
import plusIcon from '@/icons/plusIcon.svg'


type Props = {
    children: ReactNode
}

export type GlobalMessageType = {
    text: string,
    id: string,
    type: 'error'|'success'|'warning'|'neutral'
    autoDisappear?: boolean,
}

export type MessageDispatchActions =
    | { type: "NewMessage", messages: Omit<GlobalMessageType[], 'id'> | Omit<GlobalMessageType, 'id'> }
    | { type: "RemoveId", ids: string|string[] }

export type GlobalMessageManager = {
    messages: GlobalMessageType[]
    messageHistory: GlobalMessageType[]

}

type GlobalMessageContextType = {globalMessages: GlobalMessageManager, globalMessageDispatch: Dispatch<MessageDispatchActions>}

const GlobalMessageContext = 
    createContext<GlobalMessageContextType|null>(null)

const GlobalMessageProvider = (props: Props) => {
    const [globalMessages, globalMessageDispatch] = useReducer(reducerFunc, {messages: [], messageHistory: []})

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

const reducerFunc = (state: GlobalMessageManager, action: MessageDispatchActions): GlobalMessageManager => {
    const newState = {...state}
    switch (action.type) {
        case ('NewMessage'):
            const newMessagesNoID = (Array.isArray(action.messages)?action.messages:[action.messages])
            const newMessages: GlobalMessageType[] = newMessagesNoID.map((x: any, index)=> {
                x.id = `${index}${generateUUID()}${index}`;
                return x;
            })
            newState['messages'] = [...newState.messages, ...newMessages]
            newState['messageHistory'] = [...newState.messageHistory, ...newMessages]
            return newState;
        
        case "RemoveId":
            const removeables = Array.isArray(action.ids)?action.ids:[action.ids]
            const messageList = newState.messages.filter((gmt)=> !removeables.includes(gmt.id))
            newState['messages'] = messageList;
            return newState;
    }
}

const GlobalMessageSlot = (props: {}) => {
    const {globalMessages} = useGlobalMessageContext()

    return (
        <div className="absolute top-2 right-2 flex-col-reverse z-50 gap-5 max-h-[40vh] bg-transparent pointer-events-none no-scrollbar">
            {
                globalMessages.messages.map((gm)=> {
                    return <GlobalMessage {...gm} key={gm.id} className={`pointer-events-auto`} />
                })
            }
        </div>
    )
}

const GlobalMessage = (props: GlobalMessageType & {className?: string}) => {
    const {globalMessageDispatch} = useGlobalMessageContext();

    const determineMessageColor = () => {
        switch (props.type) {
            case ('error'):
                return 'border-l-red-700'
            case ('neutral'):
                return 'border-l-gray-600'
            case ('success'):
                return 'border-l-green-600'
            case ('warning'):
                return 'border-l-yellow-500';
        }
    }

    const borderColor = determineMessageColor();

    return (
        <div className={`${props.className??''} rounded-lg w-72 h-32 overflow-hidden bg-white`}>
            <div className={`w-full h-full flex flex-col items-stretch border-l-2 ${borderColor} p-2`}>
                <div className={`w-full h-1/6 flex flex-row-reverse`}>
                    <SvgButton 
                        image={plusIcon} 
                        onClick={()=>globalMessageDispatch({type: "RemoveId", ids: props.id})} 
                        svgClassName="rotate-45 h-full w-auto" 
                        className="h-full w-auto" />
                </div>
                <div className={`w-full h-5/6 text-lg`}>
                    {props.text}
                </div>
            </div>
        </div>
    )
}

export default GlobalMessageProvider
