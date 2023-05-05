import React, { useState, useEffect } from 'react';
import { axiosRequest } from '../utils/functions';
import { ActivitiesUrl } from '../utils/network';
import ContentLayout from '../components/ContentLayout';

const UserActivities = () => {
  const [fetching, setFetching] = useState(true);
  const [userActivities, setUserActivities] = useState([]);

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

  const getActivities = async () => {
    const response = await axiosRequest({
      url: ActivitiesUrl,
      hasAuth: true,
      showError: false
    });

    if (response) {
      const data = response.data.results;
      setUserActivities(data);
      setFetching(false);
    }
  }

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <ContentLayout
      pageTitle="User Activity"
      dataSource={userActivities}
      columns={columns}
      fetching={fetching}
      disableAddButton
    />
  );
}

export default UserActivities;
