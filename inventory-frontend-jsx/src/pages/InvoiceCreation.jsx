import React, { useState, useRef } from 'react';
import ContentLayout from '../components/ContentLayout';
import { useGetInventories, useGetClients } from '../utils/hooks';
import { Button, Input, Table, notification } from 'antd';
import { formatInventoryPhoto } from './Inventories';
import SelectClient from '../components/SelectClient';
import { axiosRequest, getTotal } from '../utils/functions';
import { InvoiceUrl } from '../utils/network';
import { useReactToPrint } from 'react-to-print';
import PrintOut from '../components/PrintOut';


// Function to format the inventory data for rendering in the table with the "Add" button and quantity input field
const formatInventoryAction = (
    inventories,
    onAddItem,
    onChangeQty
  ) => {
    return inventories.map(item => (
      {
        ...item,
        key: item.id,
        action: (
          <div>
            {/* Input field to enter the quantity */}
            <Input
              type="number"
              min={1}
              max={item.remaining}
              defaultValue={1}
              onChange={e =>
                onChangeQty(parseInt(e.target.value), item.id)
              }
            />
            {/* Button to add the inventory item */}
            <Button onClick={() => onAddItem(item)}>Add</Button>
          </div>
        ),
      }
    ));
  };
  
  // Function to format the invoice data for rendering in the table with the "Remove" button and quantity input field
  const formatInvoiceDataAction = (
    invoiceData,
    onRemoveItem,
    onChangeQty
  ) => {
    return invoiceData.map(item => (
      {
        ...item,
        key: item.id,
        total: item.price * item.qty,
        action: (
          <div>
            {/* Input field to enter the quantity */}
            <Input
              type="number"
              min={1}
              max={item.qty}
              defaultValue={1}
              onChange={e =>
                onChangeQty(parseInt(e.target.value), item.id)
              }
            />
            {/* Button to remove the inventory item */}
            <Button onClick={() => onRemoveItem(item.id)}>Remove</Button>
          </div>
        ),
      }
    ));
  };
  


const InvoiceCreation = () => {
  // Initialize states
  const [fetching, setFetching] = useState(true);
  const [inventories, setInventories] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [invoiceItemQty, setInvoiceItemQty] = useState({});
  const [invoiceItemDataQty, setInvoiceItemDataQty] = useState({});
  const [clients, setClients] = useState([]);
  const [selectClientVisible, setSelectClientVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canPrintOut, setCanPrintOut] = useState(false);

  const printOutRef = useRef();

  // Fetch the list of clients
  useGetClients(setClients, () => null);

  // Define columns for the inventory table
  const inventory_columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Photo',
      dataIndex: 'photoInfo',
      key: 'photoInfo',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Remaining',
      dataIndex: 'remaining',
      key: 'remaining',
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  // Define columns for the invoice table
  const invoice_columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  // Fetch the list of inventories
  useGetInventories(setInventories, setFetching);

  // Function to add an item to the invoice data
  const addItemtoInvoiceData = (inventoryData) => {
    // Get the quantity of the item
    const qty = invoiceItemQty[inventoryData.id] || 1;
    let _invoiceData = [];
    let qtyFlag = false;

    // Check if the item is already in the invoice data
    const item = invoiceData.filter(item => item.id === inventoryData.id);
    if (item.length > 0) {
        // Update the quantity of the existing item in the invoice data
        _invoiceData = invoiceData.map(item => {
        if (item.id === inventoryData.id) {
            const _qty = item.qty + qty;
            if (_qty > inventoryData.remaining) {
                qtyFlag = true;
            }
            return {
                ...item,
                qty: _qty
            };
        }
        return item;
        });
    } else {
        // Create a new item in the invoice data
        const _tempInvoiceData = {
        id: inventoryData.id,
        item: inventoryData.name,
        qty,
        price: inventoryData.price,
        total: inventoryData.price * qty,
        };
        if (qty > inventoryData.remaining) {
        qtyFlag = true;
        }
        _invoiceData = [...invoiceData, _tempInvoiceData];
    }

    // Show an error notification if there is not enough item remaining
    if (qtyFlag) {
        notification.error({
        message: "Not enough item remaining"
        });
        return;
    }

    // Update the invoice data state
    setInvoiceData(_invoiceData);
    };

    // Function to remove an item from the invoice data
    const removeItemFromInvoiceData = (inventoryId) => {
    // Get the quantity of the item
    const qty = invoiceItemDataQty[inventoryId] || 1;
    let _invoiceData = [];

    // Check if the item quantity equals or exceeds the requested quantity
    const item = invoiceData.filter(item => item.id === inventoryId)[0];
    if (qty >= item.qty) {
        // Remove the item from the invoice data if the quantity is sufficient
        _invoiceData = invoiceData.filter(item => item.id !== inventoryId);
    } else {
        // Update the quantity of the item in the invoice data
        _invoiceData = invoiceData.map(item => {
        if (item.id === inventoryId) {
            return {
            ...item,
            qty: item.qty - qty
            };
        }
        return item;
        });
    }
    // Update the invoice data state
    setInvoiceData(_invoiceData);
    };

    // Function to change the quantity of an inventory item
    const changeInventoryQty = (value, inventory_id) => {
    // Update the quantity state for the inventory item
    setInvoiceItemQty({
        ...invoiceItemQty,
        [inventory_id]: value
    });
    };

    // Function to change the quantity of an inventory item for removal
    const changeInventoryRemoveQty = (value, inventory_id) => {
    // Update the quantity state for the inventory item for removal
    setInvoiceItemDataQty({
        ...invoiceItemQty,
        [inventory_id]: value
    });
    };

    // Function to clear the invoice data
    const clearInvoiceData = () => {
    // Reset the invoice data and invoice item quantities
    setInvoiceData([]);
    setInvoiceItemDataQty({});
    };

    // Function to submit the invoice
    const submitInvoice = async (data) => {
    // Hide the client selection modal
    setSelectClientVisible(false);

    // Prepare the data to be sent in the request
    const dataToSend = {
        shop_id: data,
        invoice_item_data: invoiceData.map(item => ({
        item_id: item.id,
        quantity: item.qty
        }))
    };

    // Set the loading state to true during the API request
    setLoading(true);

    // Send a POST request to create the invoice
    const response = await axiosRequest({
        method: "post",
        url: InvoiceUrl,
        hasAuth: true,
        payload: dataToSend
    });

    // Set the loading state to false after the API request is completed
    setLoading(false);

    // If the request is successful, show a success notification
    if (response) {
        notification.success({
          message: "Operation Success",
          description: "Invoice created successfully"
        });
      }
  
      // Set the canPrintOut state to true to enable printing
      setCanPrintOut(true);
  
      // Print the invoice
      handlePrint();
  
      // Set the canPrintOut state back to false
      setCanPrintOut(false);
  
      // Clear the invoice data and invoice item quantities
      clearInvoiceData();
    };
  
    // Function to get the shop ID
    const getShopID = () => {
      // Check if there are any invoice items
      if (invoiceData.length < 1) {
        // Show an error notification if there are no invoice items
        notification.error({
          message: "You need to have an invoice item first"
        });
        return;
      }
      // Show the client selection modal
      setSelectClientVisible(true);
    };
  
    // Function to get the current year
    const getTime = () => {
      const date = new Date();
      return date.getFullYear();
    };
  
    return (
      // The main container for the invoice creation page
      <div className="invoice-creation">
        {/* Card for displaying inventory management */}
        <div className="card">
          {/* Card header */}
          <div className="cardHeader">
            {/* Heading */}
            <h1 className="headContent">Inventory Management</h1>
            <div className="rightContent">
              {/* Search input */}
              <div className="searchInput">
                <input type="text" />
              </div>
            </div>
          </div>
          <br />
          {/* Table to display inventories */}
          <Table
            dataSource={formatInventoryAction(formatInventoryPhoto(inventories), addItemtoInvoiceData, changeInventoryQty)}
            columns={inventory_columns}
            loading={fetching}
          />
        </div>
  
        {/* Card for displaying invoice data */}
        <div>
          <div className="card">
            {/* Table to display invoice data */}
            <Table
              dataSource={formatInvoiceDataAction(
                invoiceData,
                removeItemFromInvoiceData,
                changeInventoryRemoveQty
              )}
              columns={invoice_columns}
              pagination={false}
            />
            {/* Container for additional invoice information */}
            <div className='contentContainer'>
              <div className="contentHolder">
                <div className="info">Date</div>
                <div className="content">{getTime()}</div>
              </div>
              <div className="contentHolder">
                <div className="info">Total</div>
                <div className="content">{getTotal(invoiceData)}</div>
              </div>
            </div>
          </div>
          <br />
  
          {/* Buttons for saving and printing, and clearing the invoice */}
          <div>
            <Button type='primary' onClick={getShopID} loading={loading}>Save & Print</Button> &nbsp;&nbsp;
            <Button danger onClick={clearInvoiceData}>Clear</Button>
          </div>
        </div>
  
        {/* Modal for selecting a client */}
        <SelectClient
          isVisible={selectClientVisible}
          onSuccessCallBack={submitInvoice}
          onClose={() => setSelectClientVisible(false)}
          clients={clients}
        />
  
        {/* Component for printing the invoice */}
        <div ref={printOutRef}>
          {/* Only render the printout component if canPrintOut is true */}
          {canPrintOut && <PrintOut data={invoiceData} />}
        </div>
      </div>
    );
  };
  
  export default InvoiceCreation;
  
