import React, { useState } from 'react';
import { getClients } from '../utils/functions';
import ContentLayout from '../components/ContentLayout';
import AddClientForm from '../components/AddClientForm';
import { useGetClients } from '../utils/hooks';

const Client = () => {
  const [modalState, setModalState] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [clients, setClients] = useState([]);

  // Define columns for the clients table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created By',
      dataIndex: 'created_by_email',
      key: 'created_by_email',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
    },
  ];

  // Fetch clients data using the custom hook
  useGetClients(setClients, setFetching);

  // Function to handle user creation success and update the clients list
  const onCreateUser = () => {
    setModalState(false);
    setFetching(true);
    getClients(setClients, setFetching);
  };

  // Render the ContentLayout component with the clients data and columns
  return (
    <ContentLayout
      pageTitle="Client"
      setModalState={setModalState}
      dataSource={clients}
      columns={columns}
      fetching={fetching}
    >
      <AddClientForm
        onSuccessCallBack={onCreateUser}
        isVisible={modalState}
        onClose={() => setModalState(false)}
      />
    </ContentLayout>
  );
};

export default Client;
