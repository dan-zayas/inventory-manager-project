import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

// This component defines the routing configuration for the application
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Route for the login page */}
        <Route path="/check-user" element={<CheckUser />} /> {/* Route for the user verification page */}
        <Route path="/create-password" element={<UpdateUserPassword />} /> {/* Route for the password creation page */}
        <Route path="/" element={<AuthRoute><Home /></AuthRoute>} /> {/* Route for the home page with authentication */}
        <Route path="users" element={<AuthRoute><User /></AuthRoute>} /> {/* Route for the user page with authentication */}
        <Route path="groups" element={<AuthRoute><Groups /></AuthRoute>} /> {/* Route for the groups page with authentication */}
        <Route path="inventories" element={<AuthRoute><Inventories /></AuthRoute>} /> {/* Route for the inventories page with authentication */}
        <Route path="client" element={<AuthRoute><Client /></AuthRoute>} /> {/* Route for the client page with authentication */}
        <Route path="user-activities" element={<AuthRoute><UserActivities /></AuthRoute>} /> {/* Route for the user activities page with authentication */}
        <Route path="invoice-section" element={<AuthRoute><InvoiceCreation /></AuthRoute>} /> {/* Route for the invoice creation page with authentication */}
        <Route path="invoices" element={<AuthRoute><Invoice /></AuthRoute>} /> {/* Route for the invoices page with authentication */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
