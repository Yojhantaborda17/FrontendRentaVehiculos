import { useEffect } from 'react'
import styles from './login.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await axios.post('http://localhost:8000/auth/login', {
      username: e.target.emailForm.value,
      password: e.target.passwordForm.value
    }, { withCredentials: true});

    if (response.status === 200) {
      navigate('/dashboard')
    }
    console.log(response);
  }

  useEffect(() => {
    axios.get("http://localhost:8000/auth/me", { withCredentials: true })
      .then(() => navigate("/dashboard"))
      .catch(() => {});
  }, [navigate]);

  return (
    <>
      <div className={styles['login-card-container']}>
        <div className={styles['login-card']}>
          <div className={styles['login-card-header']}>
            <h1>Login</h1>
            <div>Por favor inicie sesión para continuar.</div>
          </div>
          <form onSubmit={handleSubmit} className={styles['login-card-form']}>
            <div className={styles['form-item']}>
              <span className={`material-symbols-rounded ${styles['form-item-icon']}`}>mail</span>
              <input
                type="text"
                placeholder="Nombre de usuario"
                id="emailForm"
                autoFocus
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

            <button type="submit">Iniciar sesión</button>
          </form>
        </div>
      </div>
    </>
  )
}


