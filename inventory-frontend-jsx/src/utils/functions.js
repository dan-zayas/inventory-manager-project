import { notification } from "antd";
import Axios from "axios";
import { tokenName } from "./data";
import { GroupUrl, InventoryUrl, InvoiceUrl, MeUrl, ClientUrl } from "./network";

// Function to retrieve the authorization token from local storage
export const getAuthToken = () => {
  const accessToken = localStorage.getItem(tokenName);
  if (!accessToken) {
    return null;
  }
  return { Authorization: `Bearer ${accessToken}` };
};

// Function to log the user out
export const logout = () => {
  localStorage.removeItem(tokenName);
  window.location.href = "/login";
};

// Function to authenticate the user
export const authHandler = async () => {
  const response = await axiosRequest({
    url: MeUrl,
    hasAuth: true,
    showError: false,
  });
  if (response) {
    return response.data;
  }
  return null;
};

// Function to send an axios request
export const axiosRequest = async ({
  method = "get",
  url,
  payload,
  hasAuth = false,
  errorObject,
  showError = true,
}) => {
  const headers = hasAuth ? getAuthToken() : {};
  const response = await Axios({
    method,
    url,
    data: payload,
    headers: { ...headers },
  }).catch((e) => {
    if (!showError) return;
    notification.error({
      message: errorObject ? errorObject.message : "Operation Error",
      description: errorObject?.description
        ? errorObject.description
        : e.response?.data.error,
    });
  });
  if (response) {
    return response;
  }
  return null;
};

// Function to get the groups
export const getGroups = async (setGroup, setFetching) => {
  const response = await axiosRequest({
    url: GroupUrl,
    hasAuth: true,
    showError: false,
  });
  if (response) {
    const data = response.data.results.map((item) => ({
      ...item,
      belongsTo: item.belongs_to ? item.belongs_to.name : "Not defined",
    }));
    setGroup(data);
    setFetching(false);
  }
};

// Function to get inventories
export const getInventories = async (setGroup, setFetching) => {
  const response = await axiosRequest({
    url: InventoryUrl,
    hasAuth: true,
    showError: false,
  });
  if (response) {
    const data = response.data.results.map((item) => ({
      ...item,
      groupInfo: item.group.name,
      photoInfo: item.photo,
    }));
    setGroup(data);
    setFetching(false);
  }
};

// Function to get clients
export const getClients = async (setClient, setFetching) => {
  const response = await axiosRequest({
    url: ClientUrl,
    hasAuth: true,
    showError: false,
  });
  if (response) {
    const data = response.data.results.map((item) => ({
      ...item,
      created_by_email: item.created_by.email,
    }));
    setClient(data);
    setFetching(false);
  }
};

// Function to calculate the total value of an invoice
export const getTotal = (invoiceData) => {
  return invoiceData.reduce((sum, item) => {
    sum += item.price * item.qty;
    return sum;
  }, 0);
};

// Function to get invoices
export const getInvoice = async (setInvoice, setFetching) => {
    const response = await axiosRequest({
      url: InvoiceUrl,
      hasAuth: true,
      showError: false,
    });
    if (response) {
      const data = response.data.results.map((item) => ({
        ...item,
        created_by_email: item.created_by.email,
        shop_name: item.shop.name,
        invoice_items: item.invoice_items.map((i) => ({
          id: i.id,
          price: i.amount,
          qty: i.quantity,
          item: i.item_name,
          total: i.amount * i.quantity,
        })),
      }));
      setInvoice(data);
      setFetching(false);
    }
  };
  