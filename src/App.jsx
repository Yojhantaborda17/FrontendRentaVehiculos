import { useState } from 'react'
import './App.css'
import Aurora from './Backgrounds/Aurora/Aurora'
import PillNav from './Components/PillNav/PillNav'
import StaggeredMenu from './Components/StaggeredMenu/StaggeredMenu'



function App() {
  const menuItems = [
    { label: 'Clientes', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Vehiculos', ariaLabel: 'Learn about us', link: '/vehiculos' },
    { label: 'Alquileres', ariaLabel: 'View our services', link: '/alquileres' },
  ];

  return (
    <>
      <Aurora colorStops={['#0A0A14', '#3A29FF', '#3A29FF']} blend={0.2} amplitude={0.5} speed={0.6} />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        zIndex: 10,
        pointerEvents: 'auto'
      }}>
        <StaggeredMenu
          position="right"
          items={menuItems}
          displayItemNumbering={true}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          colors={['#B19EEF', '#5227FF']}
          accentColor="#ff6b6b"
          onMenuOpen={() => console.log('Menu opened')}
          onMenuClose={() => console.log('Menu closed')}
        />
      </div>
<PillNav
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/vehiculos' },
    { label: 'Contact', href: '/alquileres' }
  ]}
  activeHref="/"
  className="custom-nav"
  ease="power2.easeOut"
  baseColor="#000000ff"
  pillColor="#0641ccff"
  hoveredPillTextColor="#ffffff"
  pillTextColor="#000000"
/>
    </>
  )
}

export default App