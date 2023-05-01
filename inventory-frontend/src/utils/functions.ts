import { notification } from "antd";
import Axios, { AxiosResponse } from "axios";
import { tokenName } from "./data";
import {
  GroupUrl,
  InventoryUrl,
  InvoiceUrl,
  MeUrl,
  ClientUrl,
} from "./network";
import {
  AuthTokenType,
  CustomAxiosError,
  DataProps,
  GroupProps,
  InventoryProps,
  InvoiceCreationProps,
  invoiceType,
  ClientProps,
  UserType,
} from "./types";

// Function to retrieve the authorization token from local storage
export const getAuthToken = (): AuthTokenType | null => {
  // Get the access token from local storage
  const accessToken = localStorage.getItem(tokenName);
  if (!accessToken) {
    // If there is no access token, return null
    return null;
  }

  // Return the authorization token with the access token
  return { Authorization: `Bearer ${accessToken}` };
};


// Function to log the user out by removing the token from local storage and redirecting to the login page
export const logout = () => {
  // Remove the token from local storage
  localStorage.removeItem(tokenName);
  // Redirect the user to the login page
  window.location.href = "/login";
};

// Function to authenticate the user by sending a request to the /me/ endpoint and returning the user object if the request is successful
export const authHandler = async (): Promise<UserType | null> => {
  // Send a request to the /me/ endpoint to retrieve user information
  const response = await axiosRequest<UserType>({
    url: MeUrl,
    hasAuth: true,
    showError: false,
  });

  // If the response is successful and contains data, return the user object
  if (response) {
    return response.data;
  }

  // If the response is not successful or does not contain data, return null
  return null;
};

// Interface for the props of an axios request
interface AxiosRequestProps {
  method?: "get" | "post" | "patch" | "delete";
  url: string;
  payload?: DataProps | FormData;
  hasAuth?: boolean;
  showError?: boolean;
  errorObject?: {
    message: string;
    description?: string;
  };
}


// Function to send an axios request with options for method, URL, payload, authorization, and error handling
export const axiosRequest = async <T>({
  method = "get",
  url,
  payload,
  hasAuth = false,
  errorObject,
  showError = true,
}: AxiosRequestProps): Promise<AxiosResponse<T> | null> => {
  // Set the authorization header based on the hasAuth boolean
  const headers = hasAuth ? getAuthToken() : {};

  // Send the request with the specified options and handle errors
  const response = await Axios({
    method,
    url,
    data: payload,
    headers: { ...headers },
  }).catch((e: CustomAxiosError) => {
    // If showError is false, return without showing an error notification
    if (!showError) return;
    // Show an error notification with the specified message and description
    notification.error({
      message: errorObject
        ? errorObject.message
        : "Operation Error",
      description: errorObject?.description
        ? errorObject.description
        : e.response?.data.error,
    });
  }) as AxiosResponse<T>;

  // If the response is successful, return the response
  if (response) {
    return response;
  }

  // If the response is not successful, return null
  return null;
};

// Function to get the groups and format the data for display
export const getGroups = async (
  setGroup: (data: GroupProps[]) => void,
  setFetching: (val: boolean) => void
) => {
  // Send a request to retrieve the groups data
  const response = await axiosRequest<{ results: GroupProps[] }>({
    url: GroupUrl,
    hasAuth: true,
    showError: false,
  });

  // If the response is successful, format the data and set it to the state
  if (response) {
    const data = response.data.results.map((item) => ({
      ...item,
      belongsTo: item.belongs_to
        ? item.belongs_to.name
        : "Not defined",
    }));
    setGroup(data);
    setFetching(false);
  }
};


 // This function retrieves inventories from the server.
// It accepts two parameters, setGroup and setFetching, which are callbacks that are used to update state when the data is retrieved.
export const getInventories = async (
  setGroup: (data: InventoryProps[]) => void, 
  setFetching: (val:boolean) => void
) => {
  // Send a request to the server to retrieve the inventories.
  const response = await axiosRequest<{results:InventoryProps[]}>({
    url: InventoryUrl,
    hasAuth: true,
    showError: false
  })

  // If the server returns data, update state with the retrieved data.
  if(response){
    // Transform the data to add groupInfo and photoInfo properties.
    const data = response.data.results.map(item => ({
      ...item, groupInfo: item.group.name, 
      photoInfo: item.photo
    }))
    setGroup(data)
    setFetching(false)
  }
}

// This function retrieves clients from the server.
// It accepts two parameters, setClient and setFetching, which are callbacks that are used to update state when the data is retrieved.
export const getClients = async (
  setClient: (data: ClientProps[]) => void, 
  setFetching: (val:boolean) => void
) => {
  // Send a request to the server to retrieve the clients.
  const response = await axiosRequest<{results:ClientProps[]}>({
    url: ClientUrl,
    hasAuth: true,
    showError: false
  })

  // If the server returns data, update state with the retrieved data.
  if(response){
    // Transform the data to add created_by_email property.
    const data = response.data.results.map(
      (item) => 
      ({...item, created_by_email: (item.created_by.email as string)}))
    setClient(data)
    setFetching(false)
  }
}

// This function calculates the total value of an invoice.
// It accepts an array of invoice items and returns the total value of the invoice.
export const getTotal = (invoiceData: InvoiceCreationProps[]) => {
  return invoiceData.reduce((sum:number, item:InvoiceCreationProps) => {
    sum += item.price * item.qty
    return sum
  }, 0)
}

// This function retrieves invoices from the server.
// It accepts two parameters, setInvoice and setFetching, which are callbacks that are used to update state when the data is retrieved.
export const getInvoice = async (
  setInvoice: (data: invoiceType[]) => void, 
  setFetching: (val:boolean) => void
) => {
  // Send a request to the server to retrieve the invoices.
  const response = await axiosRequest<{results:DataProps[]}>({
    url: InvoiceUrl,
    hasAuth: true,
    showError: false
  })

  // If the server returns data, update state with the retrieved data.
  if(response){
    // Transform the data to add created_by_email, shop_name, and invoice_items properties.
    const data: invoiceType[] = response.data.results.map((item: any) => ({
      ...item,
      created_by_email: item.created_by.email,
      shop_name: item.shop.name,
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
