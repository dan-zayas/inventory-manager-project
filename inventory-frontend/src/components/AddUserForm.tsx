import { Form, Input, Select, Button, notification } from "antd";
import Modal from "antd/lib/modal/Modal";
import { FC, useState } from "react";
import { axiosRequest } from "../utils/functions";
import { DataProps, FormModalProps } from "../utils/types";
import { CreateUserUrl } from "../utils/network";

const { Option } = Select;

const AddUserForm: FC<FormModalProps> = ({
  isVisible = false,
  onSuccessCallBack,
  onClose,
}) => {
  // Initialize form and state
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const onSubmit = async (values: DataProps) => {
    setLoading(true);

    const response = await axiosRequest({
      method: "post",
      url: CreateUserUrl,
      hasAuth: true,
      payload: values,
    });
    setLoading(false);

    if (response) {
      notification.success({
        message: "Operation Success",
        description: "User created successfully",
      });
      onSuccessCallBack();
      form.resetFields();
    }
  };

  // Return the modal with the form for adding a new user
  return (
    <Modal
      title="Add User"
      open={isVisible}
      onCancel={onClose}
      footer={false}
    >
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        {/* Email input field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
          ]}
        >
          <Input placeholder="Email" type="email" />
        </Form.Item>

        {/* Name input field */}
        <Form.Item
          label="Name"
          name="fullname"
          rules={[
            { required: true, message: "Please input your name!" },
          ]}
        >
          <Input placeholder="Name" type="text" />
        </Form.Item>

        {/* Role select field */}
        <Form.Item
          label="Role"
          name="role"
          rules={[
            { required: true, message: "Please select a role!" },
          ]}
        >
          <Select placeholder="Role">
            <Option value="admin">Admin</Option>
            <Option value="creator">Creator</Option>
            <Option value="sale">Sale</Option>
          </Select>
        </Form.Item>

        {/* Submit button */}
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            block
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserForm;
