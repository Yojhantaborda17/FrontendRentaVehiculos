import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Card.css';

const Card = ({ emoji, title, children, onActualizar, openByDefault = false }) => {
    const [showCard, setShowCard] = useState(openByDefault);

    const handleClick = () => setShowCard(!showCard);

    const handleActualizar = () => {
        if (typeof onActualizar === 'function') {
            onActualizar(); // invoca el método pasado desde el padre
        } else {
            alert('Actualizando...');
            setShowCard(!showCard);
        }
    };

    return (
        <div className="card-container text-center mt-0">
            <button
                onClick={handleClick}
                className={`btn btn-outline-info text-white fw-bold px-4 py-2 shadow-sm ${showCard ? 'is-open' : 'is-closed'}`}
            >
                {showCard ? 'Cerrar' : 'Editar'}
            </button>

            {showCard && (
                <div className="custom-card text-white mt-4 mx-auto shadow-lg border-0 card-width">
                    <div className="card-body">
                        <h3 className="card-title mb-2 text-white">{emoji} {title}</h3>

                        <div className="card-text opacity-100 mb-3 text-white">
                            {children}
                        </div>

                        <div className="d-flex flex-column gap-2">
                            <button
                                onClick={handleActualizar}
                                className="btn btn-outline-info text-white fw-bold"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Card;
