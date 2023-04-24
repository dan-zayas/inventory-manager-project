import { ChangeEvent, FC, useState, useRef } from 'react';
import {
  DataProps,
  InventoryProps,
  InvoiceCreationProps,
  ClientProps,
} from '../utils/types';
import { useGetInventories, useGetClients } from '../utils/hooks';
import { Button, Input, Table, notification } from 'antd';
import SelectClient from '../components/SelectClient';
import { axiosRequest, getTotal } from '../utils/functions';
import { InvoiceUrl } from '../utils/network';
import { useReactToPrint } from 'react-to-print';
import PrintOut from '../components/PrintOut';

// Format inventory actions and add to inventories
const formatInventoryAction = (
  inventories: DataProps[],
  onAddItem: (inventoryData: InventoryProps) => void,
  onChangeQty: (value: number, inventory_id: number) => void
) => {
  return inventories.map(item => ({
    ...item,
    key: item.id,
    action: (
      <div>
        <Input
          type="number"
          min={1}
          max={item.remaining as number}
          defaultValue={1}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChangeQty(parseInt(e.target.value), item.id as number)
          }
        />
        <Button onClick={() => onAddItem((item as unknown) as InventoryProps)}>
          Add
        </Button>
      </div>
    ),
  }));
};

// Format invoice data actions and add to invoice data
const formatInvoiceDataAction = (
  invoiceData: InvoiceCreationProps[],
  onRemoveItem: (inventoryId: number) => void,
  onChangeQty: (value: number, inventory_id: number) => void
) => {
  return invoiceData.map(item => ({
    ...item,
    key: item.id,
    total: item.price * item.qty,
    action: (
      <div>
        <Input
          type="number"
          min={1}
          max={item.qty}
          defaultValue={1}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChangeQty(parseInt(e.target.value), item.id)
          }
        />
        <Button onClick={() => onRemoveItem(item.id)}>Remove</Button>
      </div>
    ),
  }));
};

const InvoiceCreation: FC = () => {
  const [fetching, setFetching] = useState(true);
  const [inventories, setInventories] = useState<InventoryProps[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceCreationProps[]>([]);
  const [invoiceItemQty, setInvoiceItemQty] = useState({});
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [selectClientVisible, setSelectClientVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canPrintOut, setCanPrintOut] = useState(false);

  const printOutRef = useRef<any>();

  useGetClients(setClients, () => null);

  const inventory_columns = [
    /* ... */
  ];

  const invoice_columns = [
    /* ... */
  ];

  useGetInventories(setInventories, setFetching);

  // Add or update an item in the invoice data
  const addItemtoInvoiceData = (inventoryData: InventoryProps) => {
    /* ... */
  };

  // Remove an item from the invoice data
  const removeItemFromInvoiceData = (inventoryId: number) => {
    /* ... */
  };

  // Update the quantity of an item in the inventory
  const changeInventoryQty = (value: number, inventory_id: number) => {
    setInvoiceItemQty({
      ...invoiceItemQty,
      [inventory_id]: value,
    });
  };

  // Update the quantity of an item in the invoice data
  const changeInventoryRemoveQty = (value: number, inventory_id: number) => {
    setInvoiceItemQty({
      ...invoiceItemQty,
      [inventory_id]: value,
    });
  };

  const handlePrint = useReactToPrint({
    content: () => printOutRef.current,
  });

  const clearInvoiceData = () => {
    setInvoiceData([]);
  };

  const submitInvoice = async (data?: number) => {
    /* ... */
  };

  const getClientID = () => {
    /* ... */
  };

  const getTime = () => {
    /* ... */
  };

  return (
    <div className="invoice-creation">
      {/* ... */}
    </div>
  );
};

export default InvoiceCreation;