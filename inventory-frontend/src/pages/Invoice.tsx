import { FC, useEffect, useRef, useState } from 'react';
import ContentLayout from '../components/ContentLayout';
import { DataProps, InvoiceCreationProps, invoiceType } from '../utils/types';
import { useReactToPrint } from 'react-to-print';

import { useGetInvoice } from '../utils/hooks';
import { Button } from 'antd';
import PrintOut from '../components/PrintOut';

const Invoice: FC = () => {
  // Initialize state variables and printOutRef
  const [fetching, setFetching] = useState(true);
  const [invoices, setInvoices] = useState<invoiceType[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceCreationProps[]>([]);
  const [canPrintOut, setCanPrintOut] = useState(false);

  const printOutRef = useRef<any>();

  // Define the column structure for the ContentLayout component
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Created By',
      dataIndex: 'created_by_email',
      key: 'created_by_email',
    },
    {
      title: 'Shop',
      dataIndex: 'shop_name',
      key: 'shop_name',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  // Fetch invoice data
  useGetInvoice(setInvoices, setFetching);

  // Set up print functionality
  const handlePrint = useReactToPrint({
    content: () => printOutRef.current,
  });

  // Set invoice data for printing and enable printing
  const printData = (i: InvoiceCreationProps[]) => {
    setInvoiceData(i);
    setCanPrintOut(true);
  };

  // Trigger print when canPrintOut is true
  useEffect(() => {
    if (canPrintOut) {
      handlePrint();
      setCanPrintOut(false);
    }
  }, [canPrintOut]);

  // Add print action to each invoice item
  const pushActionToList = () => {
    return invoices.map(item => ({
      ...item,
      action: <Button onClick={() => printData(item.invoice_items)}>Print</Button>,
    }));
  };

  return (
    <>
      <ContentLayout
        pageTitle="Invoice"
        dataSource={(pushActionToList() as unknown) as DataProps[]}
        columns={columns}
        fetching={fetching}
        disableAddButton
      />
      <div ref={printOutRef}>
        {canPrintOut && <PrintOut data={invoiceData} />}
      </div>
    </>
  );
};

export default Invoice;
