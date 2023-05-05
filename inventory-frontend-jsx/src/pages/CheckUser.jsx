import React, { useContext, useState } from "react";
import AuthComponent from "../components/AuthComponent";
import { LoginUrl } from "../utils/network";
import { useAuth } from "../utils/hooks";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../utils/functions";
import { store } from "../utils/store";

const CheckUser = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(store);
  const navigate = useNavigate();

  // Check if the user is authenticated and redirect to the home page if they are
  useAuth({
    successCallBack: () => {
      navigate("/");
    },
  });

  // Function to handle form submission
  const onSubmit = async (values) => {
    setLoading(true);
    const response = await axiosRequest({
      method: "post",
      url: LoginUrl,
      payload: { ...values, is_new_user: true },
    });
    if (response) {
      dispatch({
        type: "[action] update password user id",
        payload: response.data.user_id,
      });
      navigate("/create-password");
    }
    setLoading(false);
  };

  // Render the AuthComponent with the appropriate props
  return (
    <AuthComponent
      titleText="Verify Yourself!"
      buttonText="Submit"
      linkText="Go Back"
      isPassword={false}
      linkPath="/login"
      loading={loading}
      onSubmit={onSubmit}
    />
  );
};

export default CheckUser;
