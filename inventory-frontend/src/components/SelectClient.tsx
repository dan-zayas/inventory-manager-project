import { Form, Select, Button } from "antd";
import Modal from "antd/lib/modal/Modal";
import { FC } from "react";
import { DataProps, FormModalProps, ClientProps } from "../utils/types";

const { Option } = Select;

// Create a new interface that extends FormModalProps and includes a clients array
interface SelectClientProps extends FormModalProps {
  clients: ClientProps[];
}

const SelectClient: FC<SelectClientProps> = ({
  isVisible = false,
  onSuccessCallBack,
  onClose,
  clients,
}) => {
  // Initialize the form
  const [form] = Form.useForm();

  // Function to handle form submission
  const onSubmit = async (values: DataProps) => {
    // Reset form fields
    form.resetFields();
    // Invoke the onSuccessCallBack with the selected client ID
    onSuccessCallBack(values.client_id as number);
  };

  // Render the modal with a form to select a client
  return (
    <Modal
      title="Select Sale Client"
      visible={isVisible}
      onCancel={onClose}
      footer={false}
      maskClosable={false}
    >
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        <Form.Item label="Client" name="client_id">
          <Select defaultValue="">
            <Option value="">Select a client</Option>
            {
              // Map over the shops array and render a select option for each shop
              clients.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.name}
                </Option>
              ))
            }
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
