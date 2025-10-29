import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const VehiculoForm = forwardRef((props, ref) => {
    const formRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = formRef.current;

        form.classList.remove('was-validated');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        alert('Formulario actualizado ');
    };

    useImperativeHandle(ref, () => ({
        submitForm: () => {

            if (formRef.current) {
                if (typeof formRef.current.requestSubmit === 'function') {
                    formRef.current.requestSubmit();
                } else {
                    formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
            }
        },
    }));

    return (
        <div className="vehiculo-form p-3 rounded-3">
            <form
                ref={formRef}
                className="row g-3 needs-validation"
                noValidate
                onSubmit={handleSubmit}
            >
                <div className="col-md-6">
                    <label htmlFor="validationCustom01" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="validationCustom01"
                        required
                    />
                    <div className="invalid-feedback">Este campo es requerido.</div>
                </div>

                <div className="col-md-6">
                    <label htmlFor="validationCustomUsername" className="form-label">Username</label>
                    <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">@</span>
                        <input
                            type="text"
                            className="form-control"
                            id="validationCustomUsername"
                            aria-describedby="inputGroupPrepend"
                            defaultValue=""
                            required
                        />
                        <div className="invalid-feedback">Por favor ingresa un username válido.</div>
                    </div>
                </div>

                <div className="col-12 d-none">
                    <button className="btn btn-outline-info text-white fw-bold" type="submit">Enviar</button>
                </div>
            </form>
        </div>
    );
});

export default VehiculoForm;
