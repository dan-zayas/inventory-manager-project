import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FC } from 'react';
import Login from './pages/Login';
import CheckUser from './pages/CheckUser';
import Home from './pages/Home';
import AuthRoute from './components/AuthRoute';
import User from './pages/User';
import Groups from './pages/Groups';
import Inventories from './pages/Inventories';
import UpdateUserPassword from './pages/UpdateUserPassword';
import Client from './pages/Client';
import UserActivities from './pages/UserActivities';
import InvoiceCreation from './pages/InvoiceCreation';
import Invoice from './pages/Invoice';

const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/check-user" element={<CheckUser />} />
        <Route path="/create-password" element={<UpdateUserPassword />} />
        <Route path="/" element={<AuthRoute><Home /></AuthRoute>} />
        <Route path="users" element={<AuthRoute><User /></AuthRoute>} />
        <Route path="groups" element={<AuthRoute><Groups /></AuthRoute>} />
        <Route path="inventories" element={<AuthRoute><Inventories /></AuthRoute>} />
        <Route path="client" element={<AuthRoute><Client /></AuthRoute>} />
        <Route path="user-activities" element={<AuthRoute><UserActivities /></AuthRoute>} />
        <Route path="invoice-section" element={<AuthRoute><InvoiceCreation /></AuthRoute>} />
        <Route path="invoices" element={<AuthRoute><Invoice /></AuthRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
