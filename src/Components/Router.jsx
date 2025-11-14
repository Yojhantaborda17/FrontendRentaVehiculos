import { BrowserRouter, Routes, Route } from "react-router-dom";

//  <- Pages ->
import App from '../App'
import Alquileres from '../Pages/Alquileres';
import Clientes from '../Pages/Clientes';
import Vehiculos from '../Pages/Vehiculos';
import Login from '../Pages/Login';

// components
import ProtectedRoute from './ProtectedRoute';
import Sidebar from "./Sidebar";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Sidebar />}>
                        <Route index element={<App/>}/>
                        <Route path="alquileres" element={<Alquileres />} />
                        <Route path="clientes" element={<Clientes />} />
                        <Route path="vehiculos" element={<Vehiculos />} />
                    </Route>
                </Route>

                <Route path="*" element={<div className="p-5 text-center"><h1>Error 404</h1></div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;