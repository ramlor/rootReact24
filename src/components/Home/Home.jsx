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
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setIsAdmin(false);
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
                setIsLoggedIn(true);
                setIsAdmin(data.isAdmin);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('isAdmin', data.isAdmin);
                localStorage.setItem('userId', data.id);

                handleClose();
            } else {
                setError(data.message || 'Error en el inicio de sesión');
            }
        } catch (err) {
            setError('Error de red o servidor');
        }
    };

    return (
        <div className="home-container">
            {!isLoggedIn && (
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
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
                <img src="./logosinFondo.png" alt="Logo" className="logo" />
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


