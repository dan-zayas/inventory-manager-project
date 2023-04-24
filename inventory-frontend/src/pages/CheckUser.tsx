import { FC, useContext, useState } from "react";
import AuthComponent from "../components/AuthComponent";
import { LoginUrl } from "../utils/network";
import { ActionTypes, DataProps } from "../utils/types";
import { useAuth } from "../utils/hooks";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../utils/functions";
import { store } from "../utils/store";

interface CheckUserProps {
  user_id: number;
}

const CheckUser: FC = () => {
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
  const onSubmit = async (values: DataProps) => {
    setLoading(true);
    const response = await axiosRequest<CheckUserProps>({
      method: "post",
      url: LoginUrl,
      payload: { ...values, is_new_user: true },
    });
    if (response) {
      dispatch({
        type: ActionTypes.UPDATE_PASSWORD_USER_ID,
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
      bottonText="Submit"
      linkText="Go Back"
      isPassword={false}
      linkPath="/login"
      loading={loading}
      onSubmit={onSubmit}
    />
  );
};

export default CheckUser;
