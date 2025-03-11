import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './home.css';
import { Modal, Button } from 'react-bootstrap';

export const Home = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        } else {
            setShowModal(true);
        }
    }, []);

    const handleClose = () => setShowModal(false);

    const handleLogout = () => {
        // Eliminar entradas específicas del localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');

        // Limpiar todo el localStorage (opcional)
        // localStorage.clear();

        // Actualizar el estado del componente
        setIsLoggedIn(false);
        setIsAdmin(false);

        // Mostrar nuevamente el modal de inicio de sesión
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5156/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mail: email,
                    password: password
                }),
            });
    
            const data = await response.json();
            
            if (response.ok) {
                if (data.isAdmin) {
                    // Si es administrador, permitir el login
                    setIsLoggedIn(true);
                    setIsAdmin(true);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('userId', data.id);
    
                    handleClose(); // Cerrar el modal de inicio de sesión
                } else {
                    // Si no es administrador, mostrar mensaje de error y resetear campos
                    setError('No tienes permisos de administrador para iniciar sesión.');
                    setEmail(''); // Limpiar el campo de email
                    setPassword(''); // Limpiar el campo de contraseña
                    setShowModal(true); // Mantener o volver a mostrar el modal
                }
            } else {
                // Error en la respuesta del servidor
                setError(data.message || 'Error en el inicio de sesión');
                setEmail(''); // Limpiar campos en caso de error
                setPassword('');
                setShowModal(true); // Mostrar el modal nuevamente
            }
        } catch (err) {
            // Error en la conexión al servidor o de red
            setError('Error de red o servidor');
            setEmail(''); // Limpiar campos en caso de error
            setPassword('');
            setShowModal(true); // Mostrar el modal nuevamente
        }
    };

    return (
        <div className="home-container">
            {/* Capa de superposición para deshabilitar la interacción con la página */}
            {showModal && <div className="overlay"></div>}

            {!isLoggedIn && (
                <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>Iniciar Sesión</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success">Ingresar</button>
                        </form>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </Modal.Body>
                </Modal>
            )}

            <div className="logo-container">
                <img src="./logosinFondo.png" alt="Logo" className="logo img-fluid" />
            </div>

            <div className="login-container">
                {isLoggedIn ? (
                    <div>
                        <h2>Bienvenido!</h2>
                        {isAdmin && <p>Tienes permisos de administrador.</p>}
                        <Button variant="danger" onClick={handleLogout}>Cerrar sesión</Button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};




