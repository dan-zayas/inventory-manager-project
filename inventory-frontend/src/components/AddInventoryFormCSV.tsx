import {Form, Button, notification} from "antd"
import Modal from "antd/lib/modal/Modal"
import {FC, useState, ChangeEvent} from "react"
import { axiosRequest } from "../utils/functions"
import { DataProps, FormModalProps } from "../utils/types"
import { InventoryCSVUrl } from "../utils/network"

// Define the AddInventoryFormCSV functional component with its props
const AddInventoryFormCSV:FC<FormModalProps> =  ({
    isVisible = false,
    onSuccessCallBack,
    onClose,
}) => {

    // Initialize form and state variables
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [csvFile, setCSVFile] = useState<File | null>(null)

    // Function to handle form submission
    const onSubmit = async (values: DataProps) => {
        setLoading(true)

        if(!csvFile) return

        // Create FormData object and append the CSV file to it
        const formItem = new FormData()
        formItem.append("data", csvFile)

        // Make an API request to upload the CSV file and add inventory items
        const response = await axiosRequest({
            method:"post",
            url: InventoryCSVUrl,
            hasAuth: true,
            payload: formItem
        })
        setLoading(false)

        // Show a success notification and reset the form if the API request is successful
        if(response){
            notification.success({
                message:"Operation Success",
                description: "Inventory Items added successfully"
            })
            onSuccessCallBack()
            form.resetFields()
        }
    }

    // Function to handle file input change event
    const handleFileChange = async (e:ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setCSVFile(e.target.files[0])
        }
    }

    // Render the modal form
    return (
        <Modal 
            title="Add Inventory Items (CSV)" 
            open={isVisible} 
            onCancel={onClose}
            footer={false}
            maskClosable={false}
            >
            <Form layout="vertical" onFinish={onSubmit} form={form}>
                <Form.Item
                    label="Select File (CSV)"
                    rules={[{ 
                        required: true, 
                        message: 'Please select a file!' }]}
                >
                    <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange} />
                </Form.Item>

                <a href="/inventory_sample.csv" download>Click here to download sample file</a>
                <div className="helperNote">
                    NB. Do not inlude the header labels, they are just for reference.
                </div>
                <br />

                <Form.Item>
                    <Button htmlType="submit" type="primary" block loading={loading}>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddInventoryFormCSV
