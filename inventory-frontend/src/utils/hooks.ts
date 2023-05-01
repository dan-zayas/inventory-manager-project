import { useContext, useEffect } from "react"
import { authHandler, getGroups, getInventories, getInvoice, getClients } from "./functions"
import { store } from "./store"
import { ActionTypes, AuthProps, GroupProps, InventoryProps, invoiceType, ClientProps, UserType } from "./types"

// Custom hook for handling user authentication
export const useAuth = async (
    {
        errorCallBack, 
        successCallBack
    }:AuthProps) => {

    // Access the global state and dispatch function from the store
    const {dispatch} = useContext(store)

    useEffect(() => {
        const checkUser = async () => {
            // Check if the user is authenticated
            const user:UserType | null = await authHandler()
            if(!user){
                // Call the error callback if user authentication fails
                if(errorCallBack){
                    errorCallBack()
                }
                return
            }
            // Update the user state and call the success callback
            if(successCallBack){
                dispatch({type: ActionTypes.UPDATE_USER_INFO, payload: user})
                successCallBack()
            }
        }
        // Run the checkUser function when the component mounts
        checkUser()
    }, [])
}

// Custom hook for fetching groups data
export const useGetGroups = (
    setGroup: (data: GroupProps[]) => void, 
    setFetching: (val:boolean) => void) => {
    
      useEffect(() => {
        // Fetch the groups data and update the state
        getGroups(setGroup, setFetching)
      }, [])
}

// Custom hook for fetching inventories data
export const useGetInventories = (
    setInventory: (data: InventoryProps[]) => void, 
    setFetching: (val:boolean) => void) => {
    
      useEffect(() => {
        // Fetch the inventories data and update the state
        getInventories(setInventory, setFetching)
      }, [])
}

// Custom hook for fetching clients data
export const useGetClients = (
    setClients: (data: ClientProps[]) => void, 
    setFetching: (val:boolean) => void) => {
    
      useEffect(() => {
        // Fetch the clients data and update the state
        getClients(setClients, setFetching)
      }, [])
}

// Custom hook for fetching invoice data
export const useGetInvoice = (
  setInvoice: (data: invoiceType[]) => void, 
  setFetching: (val:boolean) => void) => {
  
    useEffect(() => {
      // Fetch the invoice data and update the state
      getInvoice(setInvoice, setFetching)
    }, [])
    
  }
