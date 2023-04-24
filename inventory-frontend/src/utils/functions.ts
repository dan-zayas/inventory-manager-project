import { notification } from "antd"
import Axios, {AxiosResponse} from "axios"
import { tokenName } from "./data"
import { GroupUrl, InventoryUrl, InvoiceUrl, MeUrl, ClientUrl } from "./network"
import { AuthTokenType, CustomAxiosError, DataProps, GroupProps, InventoryProps, InvoiceCreationProps, invoiceType, ClientProps, UserType } from "./types"

// Get the authorization token from local storage
export const getAuthToken = ():AuthTokenType | null => {
    const accessToken = localStorage.getItem(tokenName)
    if (!accessToken){
        return null
    }

    return {Authorization: `Bearer ${accessToken}`}
}

// Remove the authorization token from local storage and redirect to the login page
export const logout = () => {
    localStorage.removeItem(tokenName)
    window.location.href = "/login"
}

// Get the current user's details from the server
export const authHandler = async ():Promise<UserType | null> => {
    const response = await axiosRequest<UserType>(
        {url: MeUrl, hasAuth: true, showError:false})

    if(response){
        return response.data
    }

    return null
}

// Send an Axios request with optional authorization and error handling
interface AxiosRequestProps {
    method?: 'get' | 'post' | 'patch' | 'delete',
    url: string,
    payload?: DataProps | FormData
    hasAuth?: boolean
    showError?: boolean
    errorObject?: {
        message: string,
        description?: string
    }
}
export const axiosRequest = async <T>({
    method = 'get',
    url,
    payload,
    hasAuth = false,
    errorObject,
    showError = true
}:AxiosRequestProps):Promise<AxiosResponse<T> | null> => {

    const headers = hasAuth ? getAuthToken() : {}

    const response = await Axios({
        method,
        url,
        data: payload,
        headers: {...headers}
    }).catch(
        (e:CustomAxiosError) => {
            if(!showError)return
            notification.error({
                message: errorObject ? 
                    errorObject.message : "Operation Error",
                description: errorObject?.description ? 
                    errorObject.description : e.response?.data.error
            })
        }
    ) as AxiosResponse<T>

    if(response){
        return response
    }

    return null
}

// Get all the groups from the server
export const getGroups = async (
    setGroup: (data: GroupProps[]) => void, 
    setFetching: (val:boolean) => void
) => {
    const response = await axiosRequest<{results:GroupProps[]}>({
      url: GroupUrl,
      hasAuth: true,
      showError: false
    })

    if(response){
      const data = response.data.results.map((item: any) => ({
        ...item, belongsTo: item.belongs_to ? 
        item.belongs_to.name : "Not defined"
      }))
      setGroup(data)
      setFetching(false)
    }
  }

// Get all the inventories from the server
  export const getInventories = async (
    setGroup: (data: InventoryProps[]) => void, 
    setFetching: (val:boolean) => void
) => {
    const response = await axiosRequest<{results:InventoryProps[]}>({
      url: InventoryUrl,
      hasAuth: true,
      showError: false
    })

    if(response){
        const data = response.data.results.map((item: any) => ({
            ...item, groupInfo: item.group.name, 
            photoInfo: item.photo
        }))
      setGroup(data)
      setFetching(false)
    }
  }

  export const getClients = async (
    setClient: (data: ClientProps[]) => void, 
    setFetching: (val:boolean) => void
) => {
    const response = await axiosRequest<{results:ClientProps[]}>({
      url: ClientUrl,
      hasAuth: true,
      showError: false
    })

    if(response){
        const data = response.data.results.map(
            (item: any) => 
            ({...item, created_by_email: (item.created_by.email as string)}))
        setClient(data)
      setFetching(false)
    }
  }

  export const getTotal = (invoiceData: InvoiceCreationProps[]) => {
    return invoiceData.reduce((sum:number, item:InvoiceCreationProps) => {
      sum += item.price * item.qty
      return sum
    }, 0)
  }

  export const getInvoice = async (
    setInvoice: (data: invoiceType[]) => void, 
    setFetching: (val:boolean) => void
) => {
    const response = await axiosRequest<{results:DataProps[]}>({
      url: InvoiceUrl,
      hasAuth: true,
      showError: false
    })

    if(response){
      const data: invoiceType[] = response.data.results.map((item: any) => ({
        ...item,
        created_by_email: item.created_by.email,
        client_name: item.client.name,
        invoice_items: item.invoice_items.map((i: any) => ({
          id: i.id,
          price: i.amount,
          qty: i.quantity,
          item: i.item_name,
          total: i.amount * i.quantity
        }))
      }))

      setInvoice(data)
      setFetching(false)
    }
  }