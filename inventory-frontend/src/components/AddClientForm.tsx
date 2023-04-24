import { Form, Input, Button, notification } from "antd";
import Modal from "antd/lib/modal/Modal";
import { FC, useState } from "react";
import { axiosRequest } from "../utils/functions";
import { DataProps, FormModalProps } from "../utils/types";
import { ClientUrl } from "../utils/network";

const AddClientForm: FC<FormModalProps> = ({
  isVisible = false,
  onSuccessCallBack,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const onSubmit = async (values: DataProps) => {
    setLoading(true);

    // API call to create a new shop
    const response = await axiosRequest({
      method: "post",
      url: ClientUrl,
      hasAuth: true,
      payload: values,
    });

    setLoading(false);

    // Notify user on successful shop creation
    if (response) {
      notification.success({
        message: "Operation Success",
        description: "Client added successfully",
      });
      onSuccessCallBack();
      form.resetFields();
    }
  };

  return (
    // Render the modal for adding a new shop
    <Modal
      title="Add Client"
      visible={isVisible}
      onCancel={onClose}
      footer={false}
    >
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter a client name!",
            },
          ]}
        >
          <Input placeholder="Name" type="text" />
        </Form.Item>
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

export default AddClientForm;