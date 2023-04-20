import {FC} from 'react'
import { Form, Input, Button, ConfigProvider, theme } from "antd"
import { Link } from "react-router-dom"

interface AuthComponentProps {
    titleText?: string,
    isPassword?: boolean,
    buttonText?: string,
    linkText?: string
    linkPath?: string
}

const AuthComponent:FC<AuthComponentProps> = ({
    titleText = "Sign In",
    isPassword = true,
    buttonText = "Log In",
    linkText = "New User?",
    linkPath = "/check-user"
}) => {
    return <div className="login">
        <div className="inner">
            <div className="header">
                <h3>{titleText}</h3>
                <img src="../../box.svg" width="30px" />
                <h2>Inventory</h2>
            </div>
            <ConfigProvider
                theme={{
                algorithm: theme.darkAlgorithm,
                }}
            >
            <Form layout="vertical">
                <Form.Item label="Email">
                    <Input placeholder="email" type="email" />
                </Form.Item>
                {isPassword && <Form.Item label="Password">
                    <Input placeholder="password" type="password" />
                </Form.Item>}
                <Form.Item>
                    <Button type="primary" block>{buttonText}</Button>
                </Form.Item>
            </Form>
            <Link to={linkPath}>{linkText}</Link>
            </ConfigProvider>
        </div>
    </div>
}

export default AuthComponent