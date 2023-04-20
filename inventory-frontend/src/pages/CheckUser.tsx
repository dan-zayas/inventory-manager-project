import {FC} from "react"
import AuthComponent from "../components/AuthComponent"

const CheckUser:FC = () => {
    return <AuthComponent 
        titleText = "Verify Yourself"
        buttonText= "Submit"
        linkText="Go Back"
        isPassword={false}
        linkPath = "/login"
    />
}

export default CheckUser