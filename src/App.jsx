// import { useState } from 'react'
import Aurora from './Backgrounds/Aurora/Aurora'
import Sidebar from './Components/Sidebar'


function App() {
  // const menuItems = [
  //   { label: 'Clientes', ariaLabel: 'Go to home page', link: '/' },
  //   { label: 'Vehiculos', ariaLabel: 'Learn about us', link: '/vehiculos' },
  //   { label: 'Alquileres', ariaLabel: 'View our services', link: '/alquileres' },
  // ];

  return (
    <>
      
      <Aurora colorStops={['#0A0A14', '#3A29FF', '#2614f1']} blend={0.15} amplitude={0.5} speed={1.2} />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        zIndex: 10,
        pointerEvents: 'auto'
      }}>
      </div>
        <div className='d-flex vh-100 justify-content-center align-items-center flex-column text-white'>
          <h1>
            Bienvenido al panel de gestión de RVA
          </h1>
          <p>
            Autores: <b>Edidson Girón Franco</b> y <b>Yojhan Andrés Taborda</b>
          </p>
        </div>
      
      
    </>
  )
}

export default App