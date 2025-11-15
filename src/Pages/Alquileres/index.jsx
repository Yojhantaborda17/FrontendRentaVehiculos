import { useState } from 'react';
import { Container, Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css';
import './alquileres.css'
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

export default function Alquileres() {
    const [rentData, setRentData] = useState([]);

    const [vehicles, setVehicles] = useState([]);
    const [clients, setClients] = useState([]);

    const [showRentModal, setShowRentModal] = useState(false);
    const [showReturnRentModal, setShowReturnRentModal] = useState(false);

    const [formRent, setFormRent] = useState({
        cliente_id: "",
        vehiculo_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        observaciones: ""
    });

    const [formReturnRent, setFormReturnRent] = useState({
        fecha_devolucion: "",
        observaciones: ""
    });

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [selectedRent, setSelectedRent] = useState(null);

    const loadRents = async () => {
        const result = await axios.get('http://localhost:8000/alquileres', { withCredentials: true })

        if (result.status === 200) {
            setRentData(result.data);
        }
    }

    const fetchVehicles = async () => {
        try {
            const response = await axios.get('http://localhost:8000/vehiculos', { withCredentials: true }); 
            setVehicles(response.data);
        } catch (error) {
            console.error('Error al cargar vehículos:', error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/clientes', { withCredentials: true }); 
            setClients(response.data);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    };
    useEffect(() => {
        fetchVehicles();
        fetchClients();
        loadRents();

        console.log(selectedRent);

        if (selectedRent) {
            setFormReturnRent({
                id: selectedRent.id,
                fecha_devolucion: selectedRent.fecha_devolucion_real,
                observaciones: selectedRent.observaciones
            });
        }
    }, [selectedRent]);


    const handleSaveRent = async () => {
        try {
            await axios.post('http://localhost:8000/alquileres', formRent, { withCredentials: true });

            setShowRentModal(false);
            loadRents();
            swal.fire({
                icon: 'success',
                title: 'Alquiler guardado con éxito'
            })

        } catch (err) {
            setShowRentModal(false);
            swal.fire({
                icon: 'error',
                title: 'Error al guardar el alquiler',
                text: err.response ? err.response.data.message : 'Error inesperado!'
            });
        }
    }

    const handleReturnRent = async () => {
        try {
            await axios.put(`http://localhost:8000/alquileres/${selectedRent.id}/devolver`, formReturnRent, { withCredentials: true });

            setShowReturnRentModal(false);
            loadRents();
            swal.fire({
                icon: 'success',
                title: 'Alquiler editado con éxito'
            })

        } catch (err) {
            setShowReturnRentModal(false);
            swal.fire({
                icon: 'error',
                title: 'Error al editar el alquiler',
                text: err.response ? err.response.data.message : 'Error inesperado!'
            });
        }
    }

    const handleDeleteRent = async (rent) => {
        try {
            const result = await swal.fire({
                title: '¿Cancelar alquiler?',
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, cancelar',
            })

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:8000/alquileres/${rent.id}`, { withCredentials: true });
                loadRents();

                swal.fire({
                    icon: 'success',
                    title: 'Alquiler eliminado con éxito'
                })
            }

        } catch (err) {
            swal.fire({
                icon: 'error',
                title: 'Error al eliminar el alquiler',
                text: err.response ? err.response.data.detail : 'Error inesperado!'
            })
        }
    }


    const columns = [
        {
            accessorKey: 'fecha_inicio',
            header: 'Fecha Inicio',
        },
        {
            accessorKey: 'fecha_fin',
            header: 'Fecha Fin',
        },
        {
            accessorKey: 'dias_alquiler',
            header: 'Días',
        },
        {
            accessorKey: 'precio_total',
            header: 'Precio Total',
        },
        {
            accessorKey: 'estado_nombre',
            header: 'Estado',
        },
        {
            accessorKey: 'fecha_devolucion_real',
            header: 'Devolución Real',
        },
        {
            accessorKey: 'observaciones',
            header: 'Observaciones',
            cell: ({ getValue }) => {
                const value = getValue();
                return (
                    <div className="producto-descripcion">
                        {value.length > 50 ? value.substring(0, 30) + '...' : value}
                    </div>
                )
            }
        },
        {
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="d-flex gap-2 justify-content-center">
                    <button className="btn-action btn-edit" title="Devolver vehículo" onClick={() => {
                        setSelectedRent(row.original);
                        setShowReturnRentModal(true);
                    }}>
                        <i className="bi bi-arrow-left-right"></i>
                    </button>
                    <button className="btn-action btn-delete" title="Cancelar alquiler" onClick={() => handleDeleteRent(row.original)}>
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: rentData,
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
                            <h5 className="text-white mb-1 fw-semibold">Gestión de Alquileres</h5>
                            <p className="text-muted-light mb-0 small">Administra los alquileres registrados</p>
                        </Col>
                        <Col xs="auto">

                            <button className="btn btn-primary-gradient btn-sm"
                                onClick={() => setShowRentModal(true)}>
                                <i className="bi bi-plus-lg me-2"></i>Nuevo alquiler
                            </button>

                        </Col>
                    </Row>
                </Container>
            </div>

            {/* tabla */}
            <Container fluid className="py-4">
                <Row>
                    <Col>
                        <Card className="table-card-dark">
                            <Card.Body>

                                {/* buscador */}
                                <div className="d-flex justify-content-between mb-4">
                                    <div>
                                        <h6 className="table-title mb-1">Lista de alquileres</h6>
                                        <p className="table-subtitle mb-0">Información detallada</p>
                                    </div>

                                    <div className="search-box-dark">
                                        <i className="bi bi-search"></i>
                                        <input
                                            type="text"
                                            placeholder="Buscar..."
                                            value={globalFilter ?? ''}
                                            onChange={(e) => setGlobalFilter(e.target.value)}
                                            className="search-input-dark"
                                        />
                                    </div>
                                </div>

                                {/* tabla */}
                                <div className="table-responsive">
                                    <table className="table-dark-custom">
                                        <thead>
                                            <tr>
                                                {table.getHeaderGroups()[0].headers.map(header => (
                                                    <th key={header.id}>
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
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

                                {/* modal crear */}
                                <Modal show={showRentModal} size='md' centered onHide={() => setShowRentModal(false)} className="modal-dark">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Nuevo Alquiler</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Group>
                                            <Form.Label className="form-label-dark">Fecha Inicio *</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formRent.fecha_inicio}
                                                onChange={(e) => setFormRent({ ...formRent, fecha_inicio: e.target.value })}
                                                className="form-control-dark"
                                            />

                                            <Form.Label className="form-label-dark">Fecha Fin *</Form.Label>
                                            <Form.Control
                                                required
                                                type="date"
                                                value={formRent.fecha_fin}
                                                onChange={(e) => setFormRent({ ...formRent, fecha_fin: e.target.value })}
                                                className="form-control-dark"
                                            />

                                            <Form.Label className="form-label-dark">Vehículo *</Form.Label>
                                            <Form.Select
                                                className="form-control-dark"
                                                value={formRent.vehiculo_id || ''}
                                                onChange={(e) =>
                                                    setFormRent({ ...formRent, vehiculo_id: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">Seleccione un vehículo</option>
                                                {vehicles.map((vehicle) => (
                                                    <option key={vehicle.id} value={vehicle.id}>
                                                        {vehicle.marca} {vehicle.modelo} - {vehicle.placa} (${vehicle.precio_por_dia}/día)
                                                    </option>
                                                ))}
                                            </Form.Select>

                                            <Form.Label className="form-label-dark">Cliente *</Form.Label>
                                            <Form.Select
                                                className="form-control-dark"
                                                value={formRent.cliente_id || ''}
                                                onChange={(e) =>
                                                    setFormRent({ ...formRent, cliente_id: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">Seleccione un cliente</option>
                                                {clients.map((client) => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.nombre} {client.apellido} - {client.documento}
                                                    </option>
                                                ))}
                                            </Form.Select>

                                            <Form.Label className="form-label-dark">Observaciones</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                value={formRent.observaciones}
                                                onChange={(e) => setFormRent({ ...formRent, observaciones: e.target.value })}
                                                className="form-control-dark"
                                            />

                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowRentModal(false)}>Cancelar</Button>
                                        <Button variant="primary" onClick={handleSaveRent}>Guardar</Button>
                                    </Modal.Footer>
                                </Modal>

                                {/* modal devolver */}
                                <Modal show={showReturnRentModal} size='md' centered onHide={() => setShowReturnRentModal(false)} className="modal-dark">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Devolver vehículo</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Group>
                                            <Form.Label className="form-label-dark">Fecha devuelta *</Form.Label>
                                            <Form.Control
                                                type="date"
                                                onChange={(e) => setFormReturnRent({ ...formReturnRent, fecha_devolucion: e.target.value })}
                                                className="form-control-dark"
                                            />

                                            <Form.Label className="form-label-dark">Observaciones</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formReturnRent.observaciones}
                                                onChange={(e) => setFormReturnRent({ ...formReturnRent, observaciones: e.target.value })}
                                                className="form-control-dark"
                                            />

                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowReturnRentModal(false)}>Cancelar</Button>
                                        <Button variant="primary" onClick={handleReturnRent}>Guardar Cambios</Button>
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
