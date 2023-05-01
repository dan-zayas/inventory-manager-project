import { FC, useState } from 'react';
import { axiosRequest } from '../utils/functions';
import { ActivitiesUrl } from '../utils/network';
import { useEffect } from 'react';
import ContentLayout from '../components/ContentLayout';
import { DataProps } from '../utils/types';

// Define the shape of a user activity
interface UserActivitiesProps {
  created_at: string;
  name: string;
  created_by: DataProps;
  created_by_email?: string;
  id: number;
}

const UserActivities: FC = () => {

  // Initialize states
  const [fetching, setFetching] = useState(true);
  const [userActivities, setUserActivities] = useState<UserActivitiesProps[]>([]);

  // Define columns to be rendered in the table
  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Performed By',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ];

  // Function to fetch user activities from the backend API
  const getActivities = async () => {
    const response = await axiosRequest<{ results: UserActivitiesProps[] }>({
      url: ActivitiesUrl,
      hasAuth: true,
      showError: false
    });

    // If the response is successful, update the userActivities state with the retrieved data
    if (response) {
      const data = response.data.results;
      setUserActivities(data);
      setFetching(false);
    }
  }

  // Fetch user activities on component mount
  useEffect(() => {
    getActivities();
  }, []);

  // Render the component
  return (
    <ContentLayout
      // Set the page title
      pageTitle="User Activity"
      // Set the data source for the table
      dataSource={(userActivities as unknown) as DataProps[]}
      // Set the columns to be rendered in the table
      columns={columns}
      // Set the fetching state of the component
      fetching={fetching}
      // Disable the "Add" button in the layout
      disableAddButton
    />
  );
}

export default UserActivities;
