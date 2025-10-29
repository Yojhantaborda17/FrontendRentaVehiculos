import { BrowserRouter, Routes, Route } from "react-router-dom";

//  <- Pages ->
import App from '../App'
import Alquileres from '../Pages/Alquileres';
import Clientes from '../Pages/Clientes';
import Vehiculos from '../Pages/Vehiculos';


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/alquileres" element={<Alquileres />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/vehiculos" element={<Vehiculos />} />

                {/* <Route path="*" element={'Error404'} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export default Router;