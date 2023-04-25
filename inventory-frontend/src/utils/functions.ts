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

// function to get the authorization token from local storage
export const getAuthToken = (): AuthTokenType | null => {
  const accessToken = localStorage.getItem(tokenName);
  if (!accessToken) {
    return null;
  }

  return { Authorization: `Bearer ${accessToken}` };
};

// function to log the user out by removing the token from local storage and redirecting to the login page
export const logout = () => {
  localStorage.removeItem(tokenName);
  window.location.href = "/login";
};

// function to authenticate the user by sending a request to the /me/ endpoint and returning the user object if the request is successful
export const authHandler = async (): Promise<UserType | null> => {

  const response = await axiosRequest<UserType>({
    url: MeUrl,
    hasAuth: true,
    showError: false,
  });

  if (response) {
    return response.data;
  }

  return null;
};

// interface for the props of an axios request
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

// function to send an axios request with options for method, url, payload, authorization, and error handling
export const axiosRequest = async <T>({
  method = "get",
  url,
  payload,
  hasAuth = false,
  errorObject,
  showError = true,
}: AxiosRequestProps): Promise<AxiosResponse<T> | null> => {
  // set authorization header based on hasAuth boolean
  const headers = hasAuth ? getAuthToken() : {};

  // send the request with specified options and handle errors
  const response = await Axios({
    method,
    url,
    data: payload,
    headers: { ...headers },
  }).catch((e: CustomAxiosError) => {
    if (!showError) return;
    notification.error({
      message: errorObject
        ? errorObject.message
        : "Operation Error",
      description: errorObject?.description
        ? errorObject.description
        : e.response?.data.error,
    });
  }) as AxiosResponse<T>;

  if (response) {
    return response;
  }

  return null;
};

// function to get the groups and format the data for display
export const getGroups = async (
  setGroup: (data: GroupProps[]) => void,
  setFetching: (val: boolean) => void
) => {
  const response = await axiosRequest<{ results: GroupProps[] }>({
    url: GroupUrl,
    hasAuth: true,
    showError: false,
  });

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
