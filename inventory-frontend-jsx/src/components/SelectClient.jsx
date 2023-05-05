import { Form, Select, Button } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useState } from "react";

const { Option } = Select;

const SelectClient = ({
  isVisible = false,
  onSuccessCallBack,
  onClose,
  clients,
}) => {
  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    form.resetFields();
    onSuccessCallBack(values.client_id);
  };

  return (
    <Modal
      title="Select Sale Client"
      open={isVisible}
      onCancel={onClose}
      footer={false}
      maskClosable={false}
    >
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        <Form.Item label="Client" name="client_id">
          <Select defaultValue="">
            <Option value="">Select a client</Option>
            {clients.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SelectClient;
