import React, { useState, useEffect } from 'react';
import AddUserForm from '../components/AddUserForm';
import ContentLayout from '../components/ContentLayout';
import { axiosRequest } from '../utils/functions';
import { UsersUrl } from '../utils/network';

const User = () => {
  const [modalState, setModalState] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [users, setUsers] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Is Active',
      dataIndex: 'is_active',
      key: 'is_active',
    },
    {
      title: 'Last Login',
      dataIndex: 'last_login',
      key: 'last_login',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ];

  const getUsers = async () => {
    const response = await axiosRequest({
      url: UsersUrl,
      hasAuth: true,
      showError: false,
    });

    if (response) {
      const data = response.data.results.map((item) => ({
        ...item,
        key: item.id,
        is_active: item.is_active.toString(),
      }));
      setUsers(data);
      setFetching(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onCreateUser = () => {
    setModalState(false);
    setFetching(true);
    getUsers();
  };

  return (
    <ContentLayout
      pageTitle="User"
      setModalState={setModalState}
      dataSource={users}
      columns={columns}
      fetching={fetching}
    >
      <AddUserForm
        onSuccessCallBack={onCreateUser}
        isVisible={modalState}
        onClose={() => setModalState(false)}
      />
    </ContentLayout>
  );
};

export default User;
