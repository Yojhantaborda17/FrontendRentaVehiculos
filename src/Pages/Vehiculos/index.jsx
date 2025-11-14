import { useState } from 'react';
import { Container, Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css';
import './vehiculos.css'
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

    // modals
    const [showCarsModal, setShowCarsModal] = useState(false);
    const [showEditCarsModal, setShowEditCarsModal] = useState(false);

    // forms
    const [formCars, setFormCars] = useState({
        tipo: '',
        marca: '',
        modelo: '',
        placa: '',
        precio_por_dia: '',
        caracteristicas: ''
    });

    const [formEditCars, setFormEditCars] = useState({
        marca: '',
        modelo: '',
        precio_por_dia: '',
        caracteristicas: ''
    });

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [selectedCar, setSelectedCar] = useState(null);

    const loadCars = async () => {
        const result = await axios.get('http://localhost:8000/vehiculos', { withCredentials: true })
        if (result.status === 200) {
            setCarsData(result.data);
        }
    }

    useEffect(() => {
        loadCars();

        if (selectedCar) {
            setFormEditCars({
                id: selectedCar.id,
                marca: selectedCar.marca,
                modelo: selectedCar.modelo,
                precio_por_dia: selectedCar.precio_por_dia,
                caracteristicas: selectedCar.caracteristicas
            });
        }
    }, [selectedCar])


    const handleSaveCar = async () => {
        try {
            await axios.post('http://localhost:8000/vehiculos', formCars, { withCredentials: true });

            setShowCarsModal(false);
            loadCars();
            swal.fire({
                icon: 'success',
                title: 'Vehículo guardado con éxito'
            })

        } catch (err) {
            setShowCarsModal(false);
            swal.fire({
                icon: 'error',
                title: 'Error al guardar el vehículo',
                text: err.response ? err.response.data.message : 'Error inesperado!'
            });
        }
    }

    const handleEditCar = async () => {
        try {
            await axios.put(`http://localhost:8000/vehiculos/${selectedCar.id}`, formEditCars, { withCredentials: true });

            setShowEditCarsModal(false);
            loadCars();
            swal.fire({
                icon: 'success',
                title: 'Vehículo editado con éxito'
            })

        } catch (err) {
            setShowEditCarsModal(false);

            swal.fire({
                icon: 'error',
                title: 'Error al editar el vehículo',
                background: '#1e1e2f',
                text: err.response ? err.response.data.message : 'Error inesperado!'
            });
        }
    }

    const handleDeleteCar = async (car) => {
        try {
            const result = await swal.fire({
                title: '¿Estás seguro de eliminar el vehículo?',
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
            })

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:8000/vehiculos/${car.id}`, { withCredentials: true });
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
            accessorKey: 'tipo',
            header: 'Tipo',
            cell: ({ row, table }) => {
                const car = row.original;
                const index = table.getSortedRowModel().rows.findIndex(r => r.tipo === row.ripo);
                return (
                    <div className="d-flex align-items-center">
                        <div
                            className="user-avatar-table"
                            style={{ background: getAvatarColor(index) }}
                        >
                            {car.tipo}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'marca',
            header: 'Marca',
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
            accessorKey: 'modelo',
            header: 'Modelo',
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
            accessorKey: 'placa',
            header: 'placa',
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
            accessorKey: 'precio_por_dia',
            header: 'Precio por día',
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

            {/* Header */}
            <div className="usuarios-header">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="text-white mb-1 fw-semibold">Gestión de Vehículos</h5>
                            <p className="text-muted-light mb-0 small">Administra los Vehículos del sistema</p>
                        </Col>
                        <Col xs="auto">
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary-gradient btn-sm" onClick={() => setShowCarsModal(true)}>
                                    <i className="bi bi-plus-lg me-2"></i>Nuevo vehículo
                                </button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container fluid className="py-4">

                {/* Users Table */}
                <Row>
                    <Col>
                        <Card className="table-card-dark">
                            <Card.Body>
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                                    <div>
                                        <h6 className="table-title mb-1">Lista de Vehículos</h6>
                                        <p className="table-subtitle mb-0">Información detallada de todos los Vehículos</p>
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

                                {/* Pagination */}
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

                                {/* Modal nuevo vehiculo */}
                                <Modal show={showCarsModal} size='sm' onHide={() => setShowCarsModal(false)} centered scrollable className="modal-dark">
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            <i className="bi bi-person-add me-2"></i>
                                            Nuevo vehículo
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Group>
                                            <Form.Label className="form-label-dark">Tipo de vehículo *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                placeholder="Ej: pepito123"
                                                value={formCars.tipo}
                                                onChange={(e) => setFormCars({ ...formCars, tipo: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Marca del vehículo *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                placeholder="Ej: pepito123"
                                                onChange={(e) => setFormCars({ ...formCars, marca: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Modelo del vehículo *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                placeholder="Ej: pepito123"
                                                onChange={(e) => setFormCars({ ...formCars, modelo: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Placa del vehículo *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                placeholder="Ej: pepito123"
                                                onChange={(e) => setFormCars({ ...formCars, placa: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Precio por día *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                placeholder="Ej: pepito123"
                                                onChange={(e) => setFormCars({ ...formCars, precio_por_dia: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Características *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                placeholder="Ej: pepito123"
                                                onChange={(e) => setFormCars({ ...formCars, caracteristicas: e.target.value })}
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

                                {/* Modal editar Vehículo  */}
                                <Modal show={showEditCarsModal} scrollable onHide={() => setShowEditCarsModal(false)} centered className="modal-dark">
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            <i className="bi bi-person-gear me-2"></i>
                                            Editar vehículo
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Group>
                                            <Form.Label className="form-label-dark">Marca del Vehículo *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                placeholder="Ej: Honda"
                                                value={formEditCars?.marca}
                                                onChange={(e) => setFormEditCars({ ...formEditCars, marca: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Modelo del Vehículo *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                placeholder="Ej: 2022"
                                                value={formEditCars?.modelo}
                                                onChange={(e) => {
                                                    setFormEditCars({ ...formEditCars, modelo: e.target.value })
                                                }}
                                            />

                                            <Form.Label className="form-label-dark">Precio (por día) del Vehículo *</Form.Label>
                                            <Form.Control
                                                type="money"
                                                value={formEditCars?.precio_por_dia}
                                                className="form-control-dark"
                                                placeholder="Ej: 18000"
                                                onChange={(e) => setFormEditCars({ ...formEditCars, precio_por_dia: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Descripción del Vehículo *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formEditCars?.caracteristicas}
                                                className="form-control-dark"
                                                placeholder="Ej: Color rojo, 4 puertas, aire acondicionado"
                                                onChange={(e) => setFormEditCars({ ...formEditCars, caracteristicas: e.target.value })}
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