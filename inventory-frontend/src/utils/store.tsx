import { createContext, FC, useReducer } from "react";
import {
  ActionProps,
  ActionTypes,
  StoreProps,
  StoreProviderProps,
} from "./types";

// Define the initial state of the store
const initialState: StoreProps = {
  user: null,
  updatePasswordUserId: null,
};

// Reducer function to handle state updates
const appReducer = (
  state: StoreProps,
  action: ActionProps
): StoreProps => {
  if (action.type === ActionTypes.UPDATE_USER_INFO) {
    return {
      ...state,
      user: action.payload,
    };
  }

  if (action.type === ActionTypes.UPDATE_PASSWORD_USER_ID) {
    return {
      ...state,
      updatePasswordUserId: action.payload,
    };
  }

  return state;
};

// Create the global store context
export const store = createContext<StoreProviderProps>({
  state: initialState,
  dispatch: () => null,
});

// StoreProvider component that wraps around the entire app
const StoreProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const { Provider } = store;

  // Provide the state and dispatch to all child components
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export default StoreProvider;
