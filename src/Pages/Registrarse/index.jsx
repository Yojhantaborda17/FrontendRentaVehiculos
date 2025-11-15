import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import styles from '../Login/Login.module.css'
import Aurora from '../../Backgrounds/Aurora/Aurora'

export default function Register() {

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (e.target.passwordForm.value !== e.target.confirmPasswordForm.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden'
            })
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/auth/register', {
                username: e.target.usernameForm.value,
                email: e.target.emailForm.value,
                password: e.target.passwordForm.value,
                rol_id: 1
            });

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'Tu cuenta ha sido creada correctamente'
                }).then(() => {
                    navigate('/dashboard')
                })
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error al registrarse',
                text: err.response?.data?.detail || 'Error inesperado.'
            })
        }
    }

    const handleLogin = () => {
        navigate('/')
    }

    useEffect(() => {
        axios.get("http://localhost:8000/auth/me", { withCredentials: true })
            .then(() => navigate("/dashboard"))
            .catch(() => { });
    }, [navigate]);

    return (
        <>
            <Aurora colorStops={['#0A0A14', '#3A29FF', '#2614f1']} blend={0.1} amplitude={0.5} speed={1.2} />

            <div className={styles['login-card-container']}>
                <div className={styles['login-card']}>
                    <div className={styles['login-card-header']}>
                        <h1>Registrarse</h1>
                        <div>Crea tu cuenta para comenzar.</div>
                    </div>
                    <form onSubmit={handleSubmit} className={styles['login-card-form']}>
                        <div className={styles['form-item']}>
                            <span className={`material-symbols-rounded ${styles['form-item-icon']}`}>person</span>
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                id="usernameForm"
                                autoFocus
                                required
                            />
                        </div>
                        <div className={styles['form-item']}>
                            <span className={`material-symbols-rounded ${styles['form-item-icon']}`}>mail</span>
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                id="emailForm"
                                required
                            />
                        </div>
                        <div className={styles['form-item']}>
                            <span className={`material-symbols-rounded ${styles['form-item-icon']}`}>lock</span>
                            <input
                                type="password"
                                placeholder="Contraseña"
                                id="passwordForm"
                                required
                            />
                        </div>
                        <div className={styles['form-item']}>
                            <span className={`material-symbols-rounded ${styles['form-item-icon']}`}>lock</span>
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                id="confirmPasswordForm"
                                required
                            />
                        </div>

                        <button type="submit">Crear cuenta</button>
                    </form>

                    {/* Sección para ir al login */}
                    <div className={styles['login-card-footer']}>
                        <p>¿Ya tienes una cuenta?
                            <span
                                onClick={handleLogin}
                                className={styles['register-link']}
                            >
                                Inicia sesión aquí
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}