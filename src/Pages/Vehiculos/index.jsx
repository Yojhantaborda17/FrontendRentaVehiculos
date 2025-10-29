import React, { useRef } from 'react';
import Aurora from '../../Backgrounds/Aurora/Aurora';
import StaggeredMenu from '../../Components/StaggeredMenu/StaggeredMenu';
import Card from '../../Components/Card/Card';
import VehiculoForm from '../../Pages/Vehiculos/VehiculoForm';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../index.css';

export default function Vehiculos() {
    const menuItems = [
        { label: 'Clientes', ariaLabel: 'Go to home page', link: '/' },
        { label: 'Vehiculos', ariaLabel: 'Learn about us', link: '/vehiculos' },
        { label: 'Alquileres', ariaLabel: 'View our services', link: '/alquileres' },
    ];

    const vehiculoFormRef = useRef(null);

    const handleCardActualizar = () => {
        if (vehiculoFormRef.current && typeof vehiculoFormRef.current.submitForm === 'function') {
            vehiculoFormRef.current.submitForm();
        } else {
            console.warn('Formulario no disponible para submit');
        }
    };

    return (
        <div className="w-100 vh-100 position-relative overflow-hidden">
            <div className="aurora-bg">
                <Aurora colorStops={['#0A0A14', '#3A29FF', '#3A29FF']} blend={0.2} amplitude={0.5} speed={0.6} />
            </div>

            <div className="overlay-content d-flex flex-column align-items-center p-4" style={{ zIndex: 20 }}>
                <Card emoji="🚗" title="Vehículos" onActualizar={handleCardActualizar} openByDefault={true}>
                    <VehiculoForm ref={vehiculoFormRef} />
                </Card>
            </div>

            <StaggeredMenu
                position="right"
                items={menuItems}
                displayItemNumbering={true}
                menuButtonColor="#fff"
                openMenuButtonColor="#fff"
                changeMenuColorOnOpen={true}
                colors={['#B19EEF', '#5227FF']}
                accentColor="#ff6b6b"
            />
        </div>
    );
}
