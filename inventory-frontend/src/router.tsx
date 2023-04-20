import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {FC} from "react"
import Login from "./pages/Login"
import CheckUser from './pages/CheckUser'

const Router:FC = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/login" exact Component={Login} />
            <Route path="/check-user" exact Component={CheckUser} />
        </Routes>
    </BrowserRouter>
}

export default Router