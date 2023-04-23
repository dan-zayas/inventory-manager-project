import { FC, useContext, useEffect, useState } from 'react'
import AuthComponent from '../components/AuthComponent'
import { ActionTypes, DataProps } from '../utils/types'
import { useAuth } from '../utils/hooks'
import { useNavigate } from 'react-router-dom'
import { axiosRequest } from '../utils/functions'
import { store } from '../utils/store'
import { UpdatePasswordUrl } from '../utils/network'
import { notification } from 'antd'

const UpdateUserPassword: FC = () => {

    const [loading, setLoading] = useState(false)
    const {state:{updatePasswordUserId}, dispatch} = useContext(store)

    const navigate = useNavigate()

    useEffect(() => {
        if(!updatePasswordUserId){
            navigate("/")
        }
    }, [])

    useAuth({
        successCallBack: () => {
            navigate("/")
        }
    })

    const onSubmit = async (values: DataProps) => {
       if(values["password"] !== values["cpassword"]){
        notification.error({
            message:"Invalid Data",
            description: "Your passwords do not match"
        })
        return
       }
       setLoading(true)
       const response = await axiosRequest({
           method: 'post',
           url: UpdatePasswordUrl,
           payload: {...values, user_id: updatePasswordUserId}
       })
       if(response){
           dispatch({
               type:ActionTypes.UPDATE_PASSWORD_USER_ID, 
               payload: null
            })
            notification.success({
                message:"Operation Successfull",
                description: "Your password was created successfully"
            })
            navigate("/login")
       }
       setLoading(false)
    }

    return <AuthComponent
        titleText="Create Password!"
        bottonText="Update"
        linkText="Go Back"
        linkPath="/check-user"
        isUpdatePassword={true}
        loading={loading}
        onSubmit={onSubmit}
    />
}

export default UpdateUserPassword