import React, { useState } from "react";
import { Form, Input, Button, notification, Modal } from "antd";
import { axiosRequest } from "../utils/functions";
import { ClientUrl } from "../utils/network";

const AddClientForm = ({
  isVisible = false,
  onSuccessCallBack,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true);

    const response = await axiosRequest({
      method: "post",
      url: ClientUrl,
      hasAuth: true,
      payload: values,
    });

    setLoading(false);

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
    <Modal
      title="Add Client"
      open={isVisible}
      onCancel={onClose}
      footer={null}
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
          <Button htmlType="submit" type="primary" block loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClientForm;
