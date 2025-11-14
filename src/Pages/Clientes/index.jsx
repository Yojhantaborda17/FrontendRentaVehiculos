import { Container, Row, Col, Card, Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender
} from '@tanstack/react-table';
import axios from 'axios';
import './productos.css';

export default function Clientes() {
    const [productosData, setProductosData] = useState([]);
    const [variantesData, setVariantesData] = useState([]);
    const [tallasData, setTallasData] = useState([]);
    const [coloresData, setColoresData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [activeTab, setActiveTab] = useState('productos');

    // Modales
    const [showProductoModal, setShowProductoModal] = useState(false);
    const [showTallaModal, setShowTallaModal] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [showVariantesModal, setShowVariantesModal] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [editandoProducto, setEditandoProducto] = useState(false);

    // Form States
    const [formProducto, setFormProducto] = useState({
        titulo: '',
        descripcion: '',
        precio_base: ''
    });

    const [formTalla, setFormTalla] = useState({
        nombre: ''
    });

    const [formColor, setFormColor] = useState({
        nombre: '',
        hex: '#000000'
    });

    const [variantes, setVariantes] = useState([]);

    // Cargar datos
    useEffect(() => {
        cargarProductos();
        cargarVariantes();
        cargarTallas();
        cargarColores();
    }, []);

    const cargarProductos = () => {
        axios.get('http://localhost:3000/api/products', { withCredentials: true })
            .then(response => setProductosData(response.data))
            .catch(err => console.error(err));
    };

    const cargarVariantes = () => {
        axios.get('http://localhost:3000/api/products/variants', { withCredentials: true })
            .then(response => setVariantesData(response.data))
            .catch(err => console.error(err));
    };

    const cargarTallas = () => {
        axios.get('http://localhost:3000/api/products/tallas', { withCredentials: true })
            .then(response => setTallasData(response.data))
            .catch(err => console.error(err));
    };

    const cargarColores = () => {
        axios.get('http://localhost:3000/api/products/colores', { withCredentials: true })
            .then(response => setColoresData(response.data))
            .catch(err => console.error(err));
    };

    const getVariantesByProducto = (productoId) => {
        return variantesData.filter(v => v.producto_id === productoId);
    };

    // Stats Cards
    const statsCards = [
        {
            title: 'Total Productos',
            value: productosData.length,
            icon: 'bi-box-seam',
            color: '#6366f1',
        },
        {
            title: 'Tallas Disponibles',
            value: tallasData.length,
            icon: 'bi-rulers',
            color: '#10b981',
        },
        {
            title: 'Colores Disponibles',
            value: coloresData.length,
            icon: 'bi-palette-fill',
            color: '#f59e0b',
        },
        {
            title: 'Variantes Totales',
            value: variantesData.length,
            icon: 'bi-grid-3x3-gap-fill',
            color: '#ec4899',
        },
    ];

    // Columnas para Productos
    const columnasProductos = [
        {
            id: 'select',
            header: () => <input type="checkbox" className="form-check-input-dark" />,
            cell: () => <input type="checkbox" className="form-check-input-dark" />,
            enableSorting: false,
        },
        {
            accessorKey: 'titulo',
            header: 'Producto',
            cell: ({ row }) => {
                const producto = row.original;
                return (
                    <div className="d-flex align-items-center">
                        <div className="producto-image-thumb">
                            <i className="bi bi-box-seam"></i>
                        </div>
                        <div>
                            <div className="producto-name">{producto.titulo}</div>
                            <div className="producto-id">ID: {producto.id}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'descripcion',
            header: 'Descripción',
            cell: ({ getValue }) => {
                const desc = getValue() || 'Sin descripción';
                return (
                    <div className="producto-descripcion">
                        {desc.length > 50 ? desc.substring(0, 50) + '...' : desc}
                    </div>
                );
            },
        },
        {
            accessorKey: 'precio_base',
            header: 'Precio Base',
            cell: ({ getValue }) => (
                <span className="precio-badge">
                    ${Number(getValue()).toFixed(2)}
                </span>
            ),
        },
        {
            id: 'variantes',
            header: 'Variantes',
            cell: ({ row }) => {
                const variantesCount = getVariantesByProducto(row.original.id).length;
                return (
                    <span className="variantes-count">
                        <i className="bi bi-grid-3x3 me-1"></i>
                        {variantesCount} variantes
                    </span>
                );
            },
        },
        {
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="d-flex gap-2 justify-content-center">
                    <button
                        className="btn-action btn-view"
                        title="Ver Variantes"
                        onClick={() => {
                            setSelectedProducto(row.original);
                            setShowVariantesModal(true);
                        }}
                    >
                        <i className="bi bi-eye"></i>
                    </button>
                    <button
                        className="btn-action btn-edit"
                        title="Editar Producto"
                        onClick={() => handleEditarProducto(row.original)}
                    >
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar">
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    // Columnas para Tallas
    const columnasTallas = [
        {
            id: 'select',
            header: () => <input type="checkbox" className="form-check-input-dark" />,
            cell: () => <input type="checkbox" className="form-check-input-dark" />,
            enableSorting: false,
        },
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ getValue }) => <span className="text-muted-light">#{getValue()}</span>,
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            cell: ({ getValue }) => (
                <span className="talla-badge">
                    <i className="bi bi-rulers me-2"></i>
                    {getValue()}
                </span>
            ),
        },
        {
            id: 'acciones',
            header: 'Acciones',
            cell: () => (
                <div className="d-flex gap-2 justify-content-center">
                    <button className="btn-action btn-edit" title="Editar">
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar">
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    // Columnas para Colores
    const columnasColores = [
        {
            id: 'select',
            header: () => <input type="checkbox" className="form-check-input-dark" />,
            cell: () => <input type="checkbox" className="form-check-input-dark" />,
            enableSorting: false,
        },
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ getValue }) => <span className="text-muted-light">#{getValue()}</span>,
        },
        {
            accessorKey: 'nombre',
            header: 'Color',
            cell: ({ row }) => {
                const color = row.original;
                return (
                    <div className="d-flex align-items-center gap-2">
                        <div
                            className="color-preview"
                            style={{ backgroundColor: color.hex || '#ccc' }}
                        ></div>
                        <span>{color.nombre}</span>
                    </div>
                );
            },
        },
        {
            id: 'acciones',
            header: 'Acciones',
            cell: () => (
                <div className="d-flex gap-2 justify-content-center">
                    <button className="btn-action btn-edit" title="Editar">
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar">
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    const getTableConfig = () => {
        switch (activeTab) {
            case 'productos':
                return { data: productosData, columns: columnasProductos };
            case 'tallas':
                return { data: tallasData, columns: columnasTallas };
            case 'colores':
                return { data: coloresData, columns: columnasColores };
            default:
                return { data: [], columns: [] };
        }
    };

    const { data: currentData, columns: currentColumns } = getTableConfig();

    const table = useReactTable({
        data: currentData,
        columns: currentColumns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    const getActiveButtonText = () => {
        switch (activeTab) {
            case 'productos': return 'Nuevo Producto';
            case 'tallas': return 'Nueva Talla';
            case 'colores': return 'Nuevo Color';
            default: return 'Nuevo';
        }
    };

    const handleNewClick = () => {
        switch (activeTab) {
            case 'productos':
                setFormProducto({ titulo: '', descripcion: '', precio_base: '' });
                setVariantes([]);
                setEditandoProducto(false);
                setShowProductoModal(true);
                break;
            case 'tallas':
                setFormTalla({ nombre: '' });
                setShowTallaModal(true);
                break;
            case 'colores':
                setFormColor({ nombre: '', hex: '#000000' });
                setShowColorModal(true);
                break;
        }
    };

    const agregarVariante = () => {
        setVariantes([...variantes, {
            talla_id: '',
            color_id: '',
            stock: 0,
            precio: formProducto.precio_base || 0
        }]);
    };

    const eliminarVariante = (index) => {
        setVariantes(variantes.filter((_, i) => i !== index));
    };

    const actualizarVariante = (index, field, value) => {
        const nuevasVariantes = [...variantes];
        nuevasVariantes[index][field] = value;
        setVariantes(nuevasVariantes);
    };

    const handleGuardarProducto = async () => {
        try {
            if (editandoProducto) {
                // Actualizar producto existente
                await axios.put(
                    `http://localhost:3000/api/products/${selectedProducto.id}`,
                    formProducto,
                    { withCredentials: true }
                );

                // Eliminar variantes antiguas
                const variantesActuales = getVariantesByProducto(selectedProducto.id);
                await Promise.all(
                    variantesActuales.map(v =>
                        axios.delete(`http://localhost:3000/api/products/variants/${v.id}`, { withCredentials: true })
                    )
                );

                // Crear nuevas variantes
                const variantesConProductoId = variantes.map(v => ({
                    ...v,
                    producto_id: selectedProducto.id
                }));

                await Promise.all(
                    variantesConProductoId.map(variante =>
                        axios.post('http://localhost:3000/api/products/variants', variante, { withCredentials: true })
                    )
                );
            } else {
                // Crear nuevo producto
                const responseProducto = await axios.post(
                    'http://localhost:3000/api/products',
                    formProducto,
                    { withCredentials: true }
                );

                const productoId = responseProducto.data.id;

                // Guardar variantes
                const variantesConProductoId = variantes.map(v => ({
                    ...v,
                    producto_id: productoId
                }));

                await Promise.all(
                    variantesConProductoId.map(variante =>
                        axios.post('http://localhost:3000/api/products/variants', variante, { withCredentials: true })
                    )
                );
            }

            cargarProductos();
            cargarVariantes();
            setShowProductoModal(false);
            setFormProducto({ titulo: '', descripcion: '', precio_base: '' });
            setVariantes([]);
            setEditandoProducto(false);

        } catch (err) {
            console.error(err);
        }
    };

    const handleEditarProducto = (producto) => {
        setSelectedProducto(producto);
        setFormProducto({
            titulo: producto.titulo,
            descripcion: producto.descripcion,
            precio_base: producto.precio_base
        });
        const variantesProducto = getVariantesByProducto(producto.id);
        setVariantes(variantesProducto);
        setEditandoProducto(true);
        setShowProductoModal(true);
    };

    const handleEliminarVariante = async (varianteId) => {
        try {
            await axios.delete(`http://localhost:3000/api/products/variants/${varianteId}`, { withCredentials: true });
            cargarVariantes();
        } catch (err) {
            console.error(err);
        }
    };

    const handleGuardarTalla = async () => {
        try {
            await axios.post('http://localhost:3000/api/products/tallas', formTalla, { withCredentials: true });
            cargarTallas();
            setShowTallaModal(false);
            setFormTalla({ nombre: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleGuardarColor = async () => {
        try {
            await axios.post('http://localhost:3000/api/products/colores', formColor, { withCredentials: true });
            cargarColores();
            setShowColorModal(false);
            setFormColor({ nombre: '', hex: '#000000' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="productos-dark">
            {/* Header */}
            <div className="productos-header">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="text-white mb-1 fw-semibold">Gestión de Productos</h5>
                            <p className="text-muted-light mb-0 small">Administra productos, tallas y colores</p>
                        </Col>
                        <Col xs="auto">
                            <button
                                className="btn btn-primary-gradient btn-sm"
                                onClick={handleNewClick}
                            >
                                <i className="bi bi-plus-lg me-2"></i>{getActiveButtonText()}
                            </button>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container fluid className="py-4">
                {/* Stats Cards */}
                <Row className="g-3 mb-4">
                    {statsCards.map((stat, idx) => (
                        <Col key={idx} xs={12} sm={6} lg={3}>
                            <Card className="stat-card-productos">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <div className="stat-title">{stat.title}</div>
                                            <div className="stat-value-large">{stat.value}</div>
                                        </div>
                                        <div className="stat-icon-large" style={{ background: `${stat.color}20`, color: stat.color }}>
                                            <i className={stat.icon}></i>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Tabs Navigation */}
                <Row className="mb-4">
                    <Col>
                        <div className="tabs-container">
                            <button
                                className={`tab-btn ${activeTab === 'productos' ? 'active' : ''}`}
                                onClick={() => setActiveTab('productos')}
                            >
                                <i className="bi bi-box-seam me-2"></i>
                                Productos
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'tallas' ? 'active' : ''}`}
                                onClick={() => setActiveTab('tallas')}
                            >
                                <i className="bi bi-rulers me-2"></i>
                                Tallas
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'colores' ? 'active' : ''}`}
                                onClick={() => setActiveTab('colores')}
                            >
                                <i className="bi bi-palette-fill me-2"></i>
                                Colores
                            </button>
                        </div>
                    </Col>
                </Row>

                {/* Table */}
                <Row>
                    <Col>
                        <Card className="table-card-dark">
                            <Card.Body>
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                                    <div>
                                        <h6 className="table-title mb-1">
                                            {activeTab === 'productos' && 'Lista de Productos'}
                                            {activeTab === 'tallas' && 'Lista de Tallas'}
                                            {activeTab === 'colores' && 'Lista de Colores'}
                                        </h6>
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
                                        {globalFilter && (
                                            <button
                                                onClick={() => setGlobalFilter('')}
                                                className="search-clear"
                                            >
                                                <i className="bi bi-x-circle-fill"></i>
                                            </button>
                                        )}
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
                                            {table.getRowModel().rows.length > 0 ? (
                                                table.getRowModel().rows.map((row) => (
                                                    <tr key={row.id}>
                                                        {row.getVisibleCells().map(cell => (
                                                            <td key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={currentColumns.length} className="text-center py-5">
                                                        <i className="bi bi-inbox display-4 d-block mb-3 text-muted-light"></i>
                                                        <p className="text-muted-light">No hay registros disponibles</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {table.getRowModel().rows.length > 0 && (
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
                                                {[...Array(Math.min(table.getPageCount(), 5))].map((_, idx) => {
                                                    const pageIndex = idx + Math.max(0, table.getState().pagination.pageIndex - 2);
                                                    if (pageIndex >= table.getPageCount()) return null;
                                                    return (
                                                        <li key={pageIndex} className={`page-item ${table.getState().pagination.pageIndex === pageIndex ? 'active' : ''}`}>
                                                            <button
                                                                className="page-link"
                                                                onClick={() => table.setPageIndex(pageIndex)}
                                                            >
                                                                {pageIndex + 1}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
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
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal Ver Variantes */}
            <Modal show={showVariantesModal} onHide={() => setShowVariantesModal(false)} centered className="modal-dark">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-grid-3x3-gap me-2"></i>
                        Variantes de {selectedProducto?.titulo}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="variantes-grid">
                        {getVariantesByProducto(selectedProducto?.id).map((variante, idx) => {
                            const talla = tallasData.find(t => t.id === variante.talla_id);
                            const color = coloresData.find(c => c.id === variante.color_id);
                            return (
                                <div key={idx} className="variante-card">
                                    <button
                                        className="btn-delete-variante"
                                        onClick={() => handleEliminarVariante(variante.id)}
                                        title="Eliminar variante"
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                    <div className="variante-info">
                                        <span className="variante-talla">
                                            <i className="bi bi-rulers me-1"></i>
                                            {talla?.nombre || 'N/A'}
                                        </span>
                                        <span className="variante-color">
                                            <div className="color-dot" style={{ backgroundColor: color?.hex || '#ccc' }}></div>
                                            {color?.nombre || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="variante-stock">
                                        <span className={`stock-badge ${variante.stock > 10 ? 'stock-high' : variante.stock > 0 ? 'stock-low' : 'stock-zero'}`}>
                                            Stock: {variante.stock}
                                        </span>
                                    </div>
                                    <div className="variante-precio">
                                        ${Number(variante.precio).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal Producto (Nuevo/Editar) */}
            <Modal show={showProductoModal} onHide={() => setShowProductoModal(false)} centered className="modal-dark">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className={`bi ${editandoProducto ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                        {editandoProducto ? 'Editar Producto' : 'Nuevo Producto'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-4">
                        <Col md={12}>
                            <div className="section-title mb-3">
                                <i className="bi bi-info-circle me-2"></i>
                                Información del Producto
                            </div>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="form-label-dark">Título *</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-dark"
                                    placeholder="Nombre del producto"
                                    value={formProducto.titulo}
                                    onChange={(e) => setFormProducto({ ...formProducto, titulo: e.target.value })}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="form-label-dark">Precio Base *</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    className="form-control-dark"
                                    placeholder="0.00"
                                    value={formProducto.precio_base}
                                    onChange={(e) => setFormProducto({ ...formProducto, precio_base: e.target.value })}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="form-label-dark">Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    className="form-control-dark"
                                    placeholder="Descripción del producto"
                                    value={formProducto.descripcion}
                                    onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="section-title">
                                    <i className="bi bi-grid-3x3-gap me-2"></i>
                                    Variantes del Producto
                                </div>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={agregarVariante}
                                    className="btn-add-variant"
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Agregar Variante
                                </Button>
                            </div>

                            {variantes.length === 0 ? (
                                <div className="empty-variants">
                                    <i className="bi bi-inbox display-4 mb-3"></i>
                                    <p>No hay variantes agregadas</p>
                                    <small>Las variantes combinan talla, color, stock y precio</small>
                                </div>
                            ) : (
                                <div className="variantes-form-list">
                                    {variantes.map((variante, index) => (
                                        <div key={index} className="variante-form-item">
                                            <div className="variante-form-header">
                                                <span className="variante-number">Variante #{index + 1}</span>
                                                <button
                                                    className="btn-remove-variant"
                                                    onClick={() => eliminarVariante(index)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>

                                            <Row className="g-3">
                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label className="form-label-dark-sm">Talla *</Form.Label>
                                                        <Form.Select
                                                            className="form-control-dark"
                                                            value={variante.talla_id}
                                                            onChange={(e) => actualizarVariante(index, 'talla_id', e.target.value)}
                                                        >
                                                            <option value="">Seleccionar</option>
                                                            {tallasData.map(talla => (
                                                                <option key={talla.id} value={talla.id}>{talla.nombre}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label className="form-label-dark-sm">Color *</Form.Label>
                                                        <Form.Select
                                                            className="form-control-dark"
                                                            value={variante.color_id}
                                                            onChange={(e) => actualizarVariante(index, 'color_id', e.target.value)}
                                                        >
                                                            <option value="">Seleccionar</option>
                                                            {coloresData.map(color => (
                                                                <option key={color.id} value={color.id}>
                                                                    {color.nombre}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label className="form-label-dark-sm">Stock *</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            className="form-control-dark"
                                                            value={variante.stock}
                                                            onChange={(e) => actualizarVariante(index, 'stock', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label className="form-label-dark-sm">Precio *</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            step="0.01"
                                                            className="form-control-dark"
                                                            value={variante.precio}
                                                            onChange={(e) => actualizarVariante(index, 'precio', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="modal-footer-dark">
                    <Button variant="secondary" onClick={() => setShowProductoModal(false)} className="btn-cancel-dark">
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleGuardarProducto} className="btn-save-dark">
                        <i className="bi bi-check-lg me-2"></i>
                        {editandoProducto ? 'Actualizar Producto' : 'Guardar Producto'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Nueva Talla */}
            <Modal show={showTallaModal} onHide={() => setShowTallaModal(false)} centered className="modal-dark">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-rulers me-2"></i>
                        Nueva Talla
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label className="form-label-dark">Nombre de la Talla *</Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control-dark"
                            placeholder="Ej: S, M, L, XL, 38, 40..."
                            value={formTalla.nombre}
                            onChange={(e) => setFormTalla({ nombre: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="modal-footer-dark">
                    <Button variant="secondary" onClick={() => setShowTallaModal(false)} className="btn-cancel-dark">
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleGuardarTalla} className="btn-save-dark">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar Talla
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Nuevo Color */}
            <Modal show={showColorModal} onHide={() => setShowColorModal(false)} centered className="modal-dark">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-palette-fill me-2"></i>
                        Nuevo Color
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="form-label-dark">Nombre del Color *</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-dark"
                                    placeholder="Ej: Rojo, Azul, Negro..."
                                    value={formColor.nombre}
                                    onChange={(e) => setFormColor({ ...formColor, nombre: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="form-label-dark">Código de Color (Hex) *</Form.Label>
                                <div className="d-flex gap-2 align-items-center">
                                    <Form.Control
                                        type="color"
                                        className="form-control-dark color-picker"
                                        value={formColor.hex}
                                        onChange={(e) => setFormColor({ ...formColor, hex: e.target.value })}
                                        style={{ width: '60px', height: '45px', padding: '4px' }}
                                    />
                                    <Form.Control
                                        type="text"
                                        className="form-control-dark"
                                        placeholder="#000000"
                                        value={formColor.hex}
                                        onChange={(e) => setFormColor({ ...formColor, hex: e.target.value })}
                                    />
                                </div>
                                <small className="text-muted-light mt-1 d-block">
                                    Selecciona un color o ingresa el código hexadecimal
                                </small>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <div className="color-preview-large" style={{ backgroundColor: formColor.hex }}>
                                <span className="color-preview-text">Vista Previa</span>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="modal-footer-dark">
                    <Button variant="secondary" onClick={() => setShowColorModal(false)} className="btn-cancel-dark">
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleGuardarColor} className="btn-save-dark">
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar Color
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}