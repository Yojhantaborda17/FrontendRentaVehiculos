import { useState } from 'react';
import { Container, Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css';
import './clientes.css'
import axios from 'axios';

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender
} from '@tanstack/react-table';
import { useEffect } from 'react';


export default function Vehiculos() {
    const [carsData, setCarsData] = useState([]);

    const [showCarsModal, setShowCarsModal] = useState(false);
    const [showEditCarsModal, setShowEditCarsModal] = useState(false);

    const [formCars, setFormCars] = useState({
        nombre: '',
        email: '',
        telefono: '',
        cedula: '',
        direccion: ''
    });

    const [formEditCars, setFormEditCars] = useState({
        nombre: '',
        email: '',
        telefono: '',
        cedula: '',
        direccion: ''
    });

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [selectedCar, setSelectedCar] = useState(null);

    const loadCars = async () => {
        const result = await axios.get('http://localhost:8000/clientes', { withCredentials: true })
        if (result.status === 200) {
            setCarsData(result.data);
        }
    }

    useEffect(() => {
        loadCars();

        if (selectedCar) {
            setFormEditCars({
                id: selectedCar.id,
                nombre: selectedCar.nombre,
                email: selectedCar.email,
                telefono: selectedCar.telefono,
                cedula: selectedCar.cedula,
                direccion: selectedCar.direccion
            });
        }
    }, [selectedCar])


    const handleSaveCar = async () => {
        try {
            await axios.post('http://localhost:8000/clientes', formCars, { withCredentials: true });

            setShowCarsModal(false);
            loadCars();
            swal.fire({
                icon: 'success',
                title: 'Cliente guardado con éxito'
            })

        } catch (err) {
            setShowCarsModal(false);
            swal.fire({
                icon: 'error',
                title: 'Error al guardar el cliente',
                text: err.response ? err.response.data.message : 'Error inesperado!'
            });
        }
    }

    const handleEditCar = async () => {
        try {
            await axios.put(`http://localhost:8000/clientes/${selectedCar.cedula}`, formEditCars, { withCredentials: true });

            setShowEditCarsModal(false);
            loadCars();
            swal.fire({
                icon: 'success',
                title: 'Cliente editado con éxito'
            })

        } catch (err) {
            setShowEditCarsModal(false);

            swal.fire({
                icon: 'error',
                title: 'Error al editar el cliente',
                background: '#1e1e2f',
                text: err.response ? err.response.data.message : 'Error inesperado!'
            });
        }
    }

    const handleDeleteCar = async (car) => {
        try {
            const result = await swal.fire({
                title: '¿Estás seguro de eliminar el cliente?',
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
            })

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:8000/clientes/${car.cedula}`, { withCredentials: true });
                loadCars();

                swal.fire({
                    icon: 'success',
                    title: 'Vehículo eliminado con éxito'
                })
            }

        } catch (err) {
            swal.fire({
                icon: 'error',
                title: 'Error al eliminar el vehículo',
                text: err.response ? err.response.data.message : 'Error inesperado!'
            })
        }
    }

    const getRoleColor = (rol) => {
        switch (rol) {
            case 'Admin': return '#ef4444';
            case 'Supervisor': return '#f59e0b';
            case 'Vendedor': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const getAvatarColor = (index) => {
        const colors = [
            'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        ];
        return colors[index % colors.length];
    };

    const columns = [
        {
            id: 'select',
            header: () => (
                <input type="checkbox" className="form-check-input-dark" />
            ),
            cell: () => (
                <input type="checkbox" className="form-check-input-dark" />
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            cell: ({ getValue }) => {
                return (
                    <span className="status-badge">
                        <i className="bi me-1"></i>
                        {getValue()}
                    </span>
                );
            },
        },
        {
            accessorKey: 'Rol',
            header: 'Rol',
            cell: ({ getValue }) => {
                const rol = getValue() || 'Admin';
                return (
                    <span
                        className="role-badge"
                        style={{
                            background: `${getRoleColor(rol)}20`,
                            color: getRoleColor(rol),
                            border: `1px solid ${getRoleColor(rol)}40`
                        }}
                    >
                        <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                        {rol}
                    </span>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'email',
            cell: ({ getValue }) => {
                return (
                    <span className={`status-badge `}>
                        <i className={`bi me-1`}></i>
                        {getValue()}
                    </span>
                );
            },
        },
        {
            accessorKey: 'telefono',
            header: 'Teléfono',
            cell: ({ getValue }) => {
                return (
                    <span className={`status-badge `}>
                        <i className={`bi me-1`}></i>
                        {getValue()}
                    </span>
                );
            },
        },
        {
            accessorKey: 'cedula',
            header: 'Cédula',
            cell: ({ getValue }) => {
                return (
                    <span className={`status-badge `}>
                        <i className={`bi me-1`}></i>
                        {getValue()}
                    </span>
                );
            },
        },
        {
            accessorKey: 'direccion',
            header: 'Dirección',
            cell: ({ getValue }) => {
                return (
                    <span className={`status-badge `}>
                        <i className={`bi me-1`}></i>
                        {getValue()}
                    </span>
                );
            },
        },
        {
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="d-flex gap-2 justify-content-center">
                    <button className="btn-action btn-edit" title="Editar" onClick={() => {
                        setSelectedCar(row.original);
                        setShowEditCarsModal(true);
                    }
                    }>
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar" onClick={() => handleDeleteCar(row.original)}>
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: carsData,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="usuarios-dark">

            <div className="usuarios-header">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="text-white mb-1 fw-semibold">Gestión de Clientes</h5>
                            <p className="text-muted-light mb-0 small">Administra los clientes del sistema</p>
                        </Col>
                        <Col xs="auto">
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary-gradient btn-sm" onClick={() => setShowCarsModal(true)}>
                                    <i className="bi bi-plus-lg me-2"></i>Nuevo cliente
                                </button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container fluid className="py-4">

                <Row>
                    <Col>
                        <Card className="table-card-dark">
                            <Card.Body>
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                                    <div>
                                        <h6 className="table-title mb-1">Lista de clientes</h6>
                                        <p className="table-subtitle mb-0">Información detallada de todos los clientes</p>
                                    </div>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <div className="search-box-dark">
                                            <i className="bi bi-search"></i>
                                            <input
                                                type="text"
                                                placeholder="Buscar usuarios..."
                                                value={globalFilter ?? ''}
                                                onChange={(e) => setGlobalFilter(e.target.value)}
                                                className="search-input-dark"
                                            />
                                            {globalFilter && (
                                                <button
                                                    onClick={() => setGlobalFilter('')}
                                                    className="search-clear"
                                                    title="Limpiar búsqueda"
                                                >
                                                    <i className="bi bi-x-circle-fill"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table-dark-custom">
                                        <thead>
                                            <tr>
                                                {table.getHeaderGroups()[0].headers.map(header => (
                                                    <th
                                                        key={header.id}
                                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                                        style={{
                                                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                                            width: header.id === 'select' ? '50px' : header.id === 'acciones' ? '150px' : 'auto',
                                                            textAlign: header.id === 'acciones' ? 'center' : 'left'
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            {header.column.getCanSort() && (
                                                                <span>
                                                                    {{
                                                                        asc: <i className="bi bi-arrow-up"></i>,
                                                                        desc: <i className="bi bi-arrow-down"></i>,
                                                                    }[header.column.getIsSorted()] ?? <i className="bi bi-arrow-down-up" style={{ opacity: 0.3 }}></i>}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.getRowModel().rows.map((row) => (
                                                <tr key={row.id}>
                                                    {row.getVisibleCells().map(cell => (
                                                        <td key={cell.id}>
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
                                    <small className="pagination-info">
                                        Mostrando{' '}
                                        <span className="text-highlight">
                                            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                                        </span>
                                        {' '}-{' '}
                                        <span className="text-highlight">
                                            {Math.min(
                                                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                                table.getFilteredRowModel().rows.length
                                            )}
                                        </span>
                                        {' '}de{' '}
                                        <span className="text-highlight">{table.getFilteredRowModel().rows.length}</span>
                                        {' '}usuarios
                                    </small>
                                    <nav>
                                        <ul className="pagination-dark">
                                            <li className={`page-item ${!table.getCanPreviousPage() ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => table.previousPage()}
                                                    disabled={!table.getCanPreviousPage()}
                                                >
                                                    <i className="bi bi-chevron-left"></i>
                                                </button>
                                            </li>
                                            {[...Array(table.getPageCount())].map((_, idx) => (
                                                <li key={idx} className={`page-item ${table.getState().pagination.pageIndex === idx ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => table.setPageIndex(idx)}
                                                    >
                                                        {idx + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${!table.getCanNextPage() ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => table.nextPage()}
                                                    disabled={!table.getCanNextPage()}
                                                >
                                                    <i className="bi bi-chevron-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>

                                <Modal show={showCarsModal} size='sm' onHide={() => setShowCarsModal(false)} centered scrollable className="modal-dark">
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            <i className="bi bi-person-add me-2"></i>
                                            Nuevo vehículo
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Group>
                                            <Form.Label className="form-label-dark">Nombre *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                value={formCars.nombre}
                                                onChange={(e) => setFormCars({ ...formCars, nombre: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Email *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                onChange={(e) => setFormCars({ ...formCars, email: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Teléfono *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                onChange={(e) => setFormCars({ ...formCars, telefono: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Cédula *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                onChange={(e) => setFormCars({ ...formCars, cedula: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Dirección *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                onChange={(e) => setFormCars({ ...formCars, direccion: e.target.value })}
                                            />

                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer className="modal-footer-dark">
                                        <Button variant="secondary" onClick={() => setShowCarsModal(false)} className="btn-cancel-dark">
                                            Cancelar
                                        </Button>
                                        <Button variant="primary" onClick={handleSaveCar} className="btn-save-dark">
                                            <i className="bi bi-check-lg me-2"></i>
                                            Guardar Usuario
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                <Modal show={showEditCarsModal} scrollable onHide={() => setShowEditCarsModal(false)} centered className="modal-dark">
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            <i className="bi bi-person-gear me-2"></i>
                                            Editar vehículo
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Group>
                                            <Form.Label className="form-label-dark">Nombre *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                value={formEditCars?.nombre}
                                                onChange={(e) => setFormEditCars({ ...formEditCars, nombre: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Email *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                value={formEditCars?.email}
                                                onChange={(e) => setFormEditCars({ ...formEditCars, email: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Teléfono *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formEditCars?.telefono}
                                                className="form-control-dark"
                                                onChange={(e) => setFormEditCars({ ...formEditCars, telefono: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Cédula *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formEditCars?.cedula}
                                                className="form-control-dark"
                                                onChange={(e) => setFormEditCars({ ...formEditCars, cedula: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Dirección *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formEditCars?.direccion}
                                                className="form-control-dark"
                                                onChange={(e) => setFormEditCars({ ...formEditCars, direccion: e.target.value })}
                                            />

                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer className="modal-footer-dark">
                                        <Button variant="secondary" onClick={() => setShowEditCarsModal(false)} className="btn-cancel-dark">
                                            Cancelar
                                        </Button>
                                        <Button variant="primary" onClick={handleEditCar} className="btn-save-dark">
                                            <i className="bi bi-check-lg me-2"></i>
                                            Editar vehículo
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
