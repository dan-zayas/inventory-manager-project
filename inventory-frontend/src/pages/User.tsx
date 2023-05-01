import { FC, useState, useEffect } from 'react';
import AddUserForm from '../components/AddUserForm';
import ContentLayout from '../components/ContentLayout';
import { axiosRequest } from '../utils/functions';
import { UsersUrl } from '../utils/network';
import { DataProps } from '../utils/types';

// Define the shape of a user
interface UserProps {
  created_at: string;
  email: string;
  fullname: string;
  is_active: string;
  last_login: string;
  role: string;
  key?: number;
  id: number;
}

const User: FC = () => {
  // Declare states for the modal visibility, data fetching state, and users list
  const [modalState, setModalState] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [users, setUsers] = useState<UserProps[]>([]);

  // Define columns for the table
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

  // Fetch users data from the server using axiosRequest
  const getUsers = async () => {
    const response = await axiosRequest<{ results: UserProps[] }>({
      url: UsersUrl,
      hasAuth: true,
      showError: false,
    });

    // If the response is successful, update the users state with the retrieved data
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

  // Use the useEffect hook to run getUsers once when the component mounts
  useEffect(() => {
    getUsers();
  }, []);

  // Handle the create user event by hiding the modal, setting the fetching state to true, and getting the updated user list
  const onCreateUser = () => {
    setModalState(false);
    setFetching(true);
    getUsers();
  };

  // Render the user list page with the ContentLayout and AddUserForm components
  return (
    <ContentLayout
      // Set the page title
      pageTitle="User"
      // Set the modal visibility state
      setModalState={setModalState}
      // Set the data source for the table
      dataSource={(users as unknown) as DataProps[]}
      // Set the columns to be rendered in the table
      columns={columns}
      // Set the fetching state of the component
      fetching={fetching}
    >
      <AddUserForm
        // Set the callback function to handle successful user creation
        onSuccessCallBack={onCreateUser}
        // Set the visibility state of the create user modal
        isVisible={modalState}
        // Set the function to close the modal
        onClose={() => setModalState(false)}
      />
    </ContentLayout>
  );
};

export default User;