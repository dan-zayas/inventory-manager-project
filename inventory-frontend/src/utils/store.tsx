import { createContext, FC, useReducer } from "react"
import { ActionProps, ActionTypes, StoreProps, StoreProviderProps } from "./types"

// Initial state of the store
const initialState: StoreProps = {
    user: null,
    updatePasswordUserId: null
}

// Reducer function to update the store state based on actions
const appReducer = (
    state: StoreProps,
    action: ActionProps): StoreProps => {

    // Update user information in the store
    if (action.type === ActionTypes.UPDATE_USER_INFO) {
        return {
            ...state,
            user: action.payload
        }
    }

    // Update the user ID for password update in the store
    if (action.type === ActionTypes.UPDATE_PASSWORD_USER_ID) {
        return {
            ...state,
            updatePasswordUserId: action.payload
        }
    }

    // Return the current state if no matching action is found
    return state
}

// Create a context for the store
export const store = createContext<StoreProviderProps>({state:initialState, dispatch:() => null})

// Define the props for the StoreProvider component
interface Props {
    children: React.ReactNode;
}

// StoreProvider component provides the store context to its children components
const StoreProvider: FC<Props> = ({ children }) => {

    // Use reducer to manage the store state and dispatch actions
    const [state, dispatch] = useReducer(appReducer, initialState)

    // Extract the Provider component from the store context
    const {Provider} = store

    // Render the Provider component and provide the store context value
    return <Provider value={{state, dispatch}}>{children}</Provider>

}

export default StoreProvider
