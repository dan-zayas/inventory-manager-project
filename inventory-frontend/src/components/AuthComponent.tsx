import { FC } from "react";
import { Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { DataProps } from "../utils/types";

interface AuthComponentProps {
  titleText?: string;
  isPassword?: boolean;
  bottonText?: string;
  linkText?: string;
  linkPath?: string;
  onSubmit: (values: DataProps) => void;
  loading?: boolean;
  isUpdatePassword?: boolean;
}

const AuthComponent: FC<AuthComponentProps> = ({
  titleText = "Sign In",
  isPassword = true,
  bottonText = "Login",
  linkText = "New User?",
  linkPath = "/check-user",
  onSubmit,
  loading = false,
  isUpdatePassword = false,
}) => {
  // Return a custom authentication form based on the given props
  return (
    <div className="login">
      <div className="inner">
        {/* Render header with titleText and Inventory */}
        <div className="header">
          <h3>{titleText}</h3>
          <h2>Inventory</h2>
        </div>

        {/* Render form with onFinish callback */}
        <Form layout="vertical" onFinish={onSubmit}>
          {/* Render email input field if isUpdatePassword is false */}
          {!isUpdatePassword && (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
              ]}
            >
              <Input placeholder="Email" type="email" />
            </Form.Item>
          )}

          {/* Render password input field if isPassword is true */}
          {isPassword && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input placeholder="Password" type="password" />
            </Form.Item>
          )}

          {/* Render confirm password input field if isUpdatePassword is true */}
          {isUpdatePassword && (
            <Form.Item
              label="Confirm Password"
              name="cpassword"
              rules={[
                {
                  required: true,
                  message: "Please input your password confirmation!",
                },
              ]}
            >
              <Input placeholder="Confirm Password" type="password" />
            </Form.Item>
          )}

          {/* Render submit button */}
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              block
              loading={loading}
            >
              {bottonText}
            </Button>
          </Form.Item>
        </Form>

        {/* Render link with linkText and linkPath */}
        <Link to={linkPath}>{linkText}</Link>
      </div>
    </div>
  );
};

export default AuthComponent;
