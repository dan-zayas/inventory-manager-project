import React, { useState } from "react";
import { Form, Input, Select, Button, notification, Modal } from "antd";
import { axiosRequest } from "../utils/functions";
import { GroupUrl } from "../utils/network";

const { Option } = Select;

const AddGroupForm = ({ isVisible = false, onSuccessCallBack, onClose, groups }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true);

    const response = await axiosRequest({
      method: "post",
      url: GroupUrl,
      hasAuth: true,
      payload: values,
    });
    setLoading(false);

    if (response) {
      notification.success({
        message: "Operation Success",
        description: "Group created successfully",
      });
      onSuccessCallBack();
      form.resetFields();
    }
  };

  return (
    <Modal
      title="Add Group"
      open={isVisible}
      onCancel={onClose}
      footer={false}
      maskClosable={false}
    >
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input group name!" },
          ]}
        >
          <Input placeholder="Group name" />
        </Form.Item>
        <Form.Item label="Belongs To" name="belongs_to_id">
          <Select defaultValue="">
            <Option value="">Select a group</Option>
            {groups.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.name}
              </Option>
            ))}
          </Select>
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

export default AddGroupForm;
