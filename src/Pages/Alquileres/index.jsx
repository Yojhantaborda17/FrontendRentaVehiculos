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

    const [showRentModal, setShowRentModal] = useState(false);
    const [showEditRentModal, setShowEditRentModal] = useState(false);

    const [formRent, setFormRent] = useState({
        cliente_id: "",
        vehiculo_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        dias_alquiler: 0,
        precio_total: 0,
        estado_id: 0,
        fecha_devolucion_real: "",
        observaciones: ""
    });

    const [formEditRent, setFormEditRent] = useState({
        cliente_id: "",
        vehiculo_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        dias_alquiler: 0,
        precio_total: 0,
        estado_id: 0,
        fecha_devolucion_real: "",
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

    useEffect(() => {
        loadRents();

        if (selectedRent) {
            setFormEditRent({
                id: selectedRent.id,
                cliente_id: selectedRent.cliente_id,
                vehiculo_id: selectedRent.vehiculo_id,
                fecha_inicio: selectedRent.fecha_inicio,
                fecha_fin: selectedRent.fecha_fin,
                dias_alquiler: selectedRent.dias_alquiler,
                precio_total: selectedRent.precio_total,
                estado_id: selectedRent.estado_id,
                fecha_devolucion_real: selectedRent.fecha_devolucion_real,
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

    const handleEditRent = async () => {
        try {
            await axios.put(`http://localhost:8000/alquileres/${selectedRent.id}`, formEditRent, { withCredentials: true });

            setShowEditRentModal(false);
            loadRents();
            swal.fire({
                icon: 'success',
                title: 'Alquiler editado con éxito'
            })

        } catch (err) {
            setShowEditRentModal(false);
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
                title: '¿Eliminar alquiler?',
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
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
                text: err.response ? err.response.data.message : 'Error inesperado!'
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
            accessorKey: 'estado_id',
            header: 'Estado ID',
        },
        {
            accessorKey: 'fecha_devolucion_real',
            header: 'Devolución Real',
        },
        {
            accessorKey: 'observaciones',
            header: 'Observaciones',
        },
        {
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="d-flex gap-2 justify-content-center">
                    <button className="btn-action btn-edit" title="Editar" onClick={() => {
                        setSelectedRent(row.original);
                        setShowEditRentModal(true);
                    }}>
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar" onClick={() => handleDeleteRent(row.original)}>
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
                                                className="form-control-dark"
                                                onChange={(e) => setFormRent({ ...formRent, fecha_inicio: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Fecha Fin *</Form.Label>
                                            <Form.Control
                                                type="date"
                                                className="form-control-dark"
                                                onChange={(e) => setFormRent({ ...formRent, fecha_fin: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Dias alquiler *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                className="form-control-dark"
                                                onChange={(e) => setFormRent({ ...formRent, dias_alquiler: Number(e.target.value) })}
                                            />

                                            <Form.Label className="form-label-dark">Precio Total *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                className="form-control-dark"
                                                onChange={(e) => setFormRent({ ...formRent, precio_total: Number(e.target.value) })}
                                            />

                                            <Form.Label className="form-label-dark">Estado *</Form.Label>
                                            <Form.Select
                                                className="form-control-dark"
                                                onChange={(e) =>
                                                    setFormRent({ ...formRent, estado_id: Number(e.target.value) })
                                                }
                                            >
                                                <option value="">Seleccione un estado</option>
                                                <option value={1}>ACTIVO</option>
                                                <option value={2}>COMPLETADO</option>
                                                <option value={3}>CANCELADO</option>
                                            </Form.Select>
                                            <Form.Label className="form-label-dark">Fecha devolución real</Form.Label>
                                            <Form.Control
                                                type="date"
                                                className="form-control-dark"
                                                onChange={(e) => setFormRent({ ...formRent, fecha_devolucion_real: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Observaciones</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                onChange={(e) => setFormRent({ ...formRent, observaciones: e.target.value })}
                                            />

                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowRentModal(false)}>Cancelar</Button>
                                        <Button variant="primary" onClick={handleSaveRent}>Guardar</Button>
                                    </Modal.Footer>
                                </Modal>

                                {/* modal editar */}
                                <Modal show={showEditRentModal} size='md' centered onHide={() => setShowEditRentModal(false)} className="modal-dark">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Editar Alquiler</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Group>
                                            <Form.Label className="form-label-dark">Fecha Inicio *</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formEditRent.fecha_inicio}
                                                onChange={(e) => setFormEditRent({ ...formEditRent, fecha_inicio: e.target.value })}
                                                className="form-control-dark"
                                            />

                                            <Form.Label className="form-label-dark">Fecha Fin *</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formEditRent.fecha_fin}
                                                onChange={(e) => setFormEditRent({ ...formEditRent, fecha_fin: e.target.value })}
                                                className="form-control-dark"
                                            />

                                            <Form.Label className="form-label-dark">Dias alquiler *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formEditRent.dias_alquiler}
                                                onChange={(e) => setFormEditRent({ ...formEditRent, dias_alquiler: Number(e.target.value) })}
                                                className="form-control-dark"
                                            />

                                            <Form.Label className="form-label-dark">Precio Total *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formEditRent.precio_total}
                                                onChange={(e) => setFormEditRent({ ...formEditRent, precio_total: Number(e.target.value) })}
                                                className="form-control-dark"
                                            />

                                            <Form.Label className="form-label-dark">Estado *</Form.Label>
                                            <Form.Select
                                                className="form-control-dark"
                                                onChange={(e) =>
                                                    setFormRent({ ...formRent, estado_id: Number(e.target.value) })
                                                }
                                            >
                                                <option value="">Seleccione un estado</option>
                                                <option value={1}>ACTIVO</option>
                                                <option value={2}>COMPLETADO</option>
                                                <option value={3}>CANCELADO</option>
                                            </Form.Select>
                                            <Form.Label className="form-label-dark">Fecha devolución real</Form.Label>
                                            <Form.Control
                                                type="date"
                                                className="form-control-dark"
                                                onChange={(e) => setFormRent({ ...formRent, fecha_devolucion_real: e.target.value })}
                                            />

                                            <Form.Label className="form-label-dark">Observaciones</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="form-control-dark"
                                                onChange={(e) => setFormRent({ ...formRent, observaciones: e.target.value })}
                                            />


                                            <Form.Label className="form-label-dark">Fecha devolución real</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formEditRent.fecha_devolucion_real}
                                                onChange={(e) => setFormEditRent({ ...formEditRent, fecha_devolucion_real: e.target.value })}
                                                className="form-control-dark"
                                            />

                                            <Form.Label className="form-label-dark">Observaciones</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formEditRent.observaciones}
                                                onChange={(e) => setFormEditRent({ ...formEditRent, observaciones: e.target.value })}
                                                className="form-control-dark"
                                            />

                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowEditRentModal(false)}>Cancelar</Button>
                                        <Button variant="primary" onClick={handleEditRent}>Guardar Cambios</Button>
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
