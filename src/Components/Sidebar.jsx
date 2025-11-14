import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Aquí puedes agregar la lógica de logout
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    {
      path: '/dashboard/vehiculos',
      icon: 'bi-car-front-fill',
      label: 'Vehiculos',
    },
    {
      path: '/dashboard/clientes',
      icon: 'bi-people',
      label: 'Clientes',
    },
    {
      path: '/dashboard/alquileres',
      icon: 'bi-box-seam',
      label: 'Alquileres',
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button
          className="btn btn-link text-dark mobile-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list fs-3"></i>
        </button>
        <div className="d-flex align-items-center">
          <div
            className="bg-primary rounded-3 d-flex align-items-center justify-content-center me-2"
            style={{ width: '36px', height: '36px' }}
          >
            <i className="bi bi-lightning-charge-fill text-white fs-5"></i>
          </div>
          <h5 className="mb-0 fw-bold">RVA</h5>
        </div>
      </div>

      {/* Overlay para cerrar sidebar en mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="d-flex align-items-center">
            <div
              className="bg-primary rounded-3 d-flex align-items-center justify-content-center me-3"
              style={{ width: '48px', height: '48px' }}
            >
              <i className="bi bi-lightning-charge-fill text-white fs-4"></i>
            </div>
            <div>
              <h4 className="text-white fw-bold mb-0">RVA</h4>
            </div>
          </div>

          <button
            className="btn btn-link text-white d-lg-none p-0"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <i className="bi bi-x-lg fs-4"></i>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="mb-2">
            <small className="nav-section-title">
              MENÚ PRINCIPAL
            </small>
          </div>
          <ul className="list-unstyled">
            {menuItems.map((item) => (
              <li key={item.path} className="mb-2">
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <i className={`bi ${item.icon} fs-5 me-3`}></i>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          <div className="d-flex align-items-center mb-3 px-2">
            <div
              className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-person-fill text-white"></i>
            </div>
            <div className="flex-grow-1 min-w-0">
              <div className="text-white fw-semibold small text-truncate">Usuario Admin</div>
              <small className="text-white-50 text-truncate d-block" style={{ fontSize: '0.75rem' }}>
                admin@xutnn.com
              </small>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
