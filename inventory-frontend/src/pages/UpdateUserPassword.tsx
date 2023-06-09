import { FC, useContext, useEffect, useState } from 'react';
import AuthComponent from '../components/AuthComponent';
import { ActionTypes, DataProps } from '../utils/types';
import { useAuth } from '../utils/hooks';
import { useNavigate } from 'react-router-dom';
import { axiosRequest } from '../utils/functions';
import { store } from '../utils/store';
import { UpdatePasswordUrl } from '../utils/network';
import { notification } from 'antd';

const UpdateUserPassword: FC = () => {
  // Declare states for loading state and update password user ID
  const [loading, setLoading] = useState(false);
  const {
    state: { updatePasswordUserId },
    dispatch,
  } = useContext(store);

  const navigate = useNavigate();

  // Redirect to the main page if there is no user ID to update the password for
  useEffect(() => {
    if (!updatePasswordUserId) {
      navigate('/');
    }
  }, []);

  // Check for user authentication and redirect to the main page on success
  useAuth({
    successCallBack: () => {
      navigate('/');
    },
  });

  // Handle form submission for updating the user password
  const onSubmit = async (values: DataProps) => {
    // Show an error notification if the entered passwords do not match
    if (values['password'] !== values['cpassword']) {
      notification.error({
        message: 'Invalid Data',
        description: 'Your passwords do not match',
      });
      return;
    }

    setLoading(true);

    // Send a request to update the user password
    const response = await axiosRequest({
      method: 'post',
      url: UpdatePasswordUrl,
      payload: { ...values, user_id: updatePasswordUserId },
    });

    // On successful response, clear the stored user ID and show a success notification
    if (response) {
      dispatch({
        type: ActionTypes.UPDATE_PASSWORD_USER_ID,
        payload: null,
      });
      notification.success({
        message: 'Operation Successful',
        description: 'Your password was created successfully',
      });
      navigate('/login');
    }

    setLoading(false);
  };

  // Render the AuthComponent with necessary props for updating the user password
  return (
    <AuthComponent
      // Set the title text for the component
      titleText="Create Password!"
      // Set the button text for the component
      bottonText="Update"
      // Set the link text for the component
      linkText="Go Back"
      // Set the link path for the component
      linkPath="/check-user"
      // Indicate that this is an update password page
      isUpdatePassword={true}
      // Set the loading state for the component
      loading={loading}
      // Set the submit handler function for the component
      onSubmit={onSubmit}
    />
  );
};

export default UpdateUserPassword;
