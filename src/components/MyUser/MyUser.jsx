import React, { useState, useEffect, useCallback } from 'react';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';


const MyUser = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [bannedNonAdmins, setBannedNonAdmins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [banDetails, setBanDetails] = useState({ userId: null, reason: "", endDate: "" });

    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`http://localhost:5156/User?query=${encodedQuery}&page=${page}&pageSize=10&isAdmin=false`);
            if (!response.ok) throw new Error('Error fetching admin users');
            const data = await response.json();
            setUsers(data.data || data);
        } catch (error) {
            console.error('Error fetching admin users:', error);
        } finally {
            setLoading(false);
        }
    }, [query, page]);

    const fetchBannedNonAdmins = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5156/UserBan?page=1&pageSize=10');
            if (!response.ok) throw new Error('Error fetching banned users');

            const data = await response.json();

            const usersWithDetails = await Promise.all(
                data.data.map(async (ban) => {
                    try {
                        const userResponse = await fetch(`http://localhost:5156/User/${ban.userId}`);
                        if (!userResponse.ok) throw new Error(`Error fetching user ${ban.userId}`);

                        const userData = await userResponse.json();

                        if (!userData.isAdmin) {
                            return { ...ban, ...userData };
                        } else {
                            return null;
                        }
                    } catch (err) {
                        console.error(`No se pudo obtener detalles del usuario ${ban.userId}:`, err);
                        return null;
                    }
                })
            );

            const nonAdminBannedUsers = usersWithDetails.filter(user => user !== null);
            setBannedNonAdmins(nonAdminBannedUsers);
        } catch (error) {
            console.error('Error fetching banned users:', error);
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    useEffect(() => {
        fetchBannedNonAdmins();
    }, [fetchBannedNonAdmins]);

    const handleSearchChange = (evt) => {
        setQuery(evt.target.value);
    };

    const handleSearchClick = () => {
        setPage(1);
        fetchAdmins();
    };

    const prevPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const nextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handleBanClick = (userId) => {
        setBanDetails({ userId, reason: "", endDate: "" });
        setShowModal(true);
    };

    const banUser = async () => {
        const { userId, reason, endDate } = banDetails;
        
        if (!reason || !endDate) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const requestBody = {
            StartDateTime: new Date().toISOString(),
            EndDateTime: new Date(endDate).toISOString(),
            Reason: reason
        };

        try {
            const response = await fetch(`http://localhost:5156/UserBan/ban/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al banear el usuario: ${errorText}`);
            }

            console.log(`Usuario ${userId} baneado con éxito`);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            setShowModal(false);
        } catch (error) {
            console.error("Error al banear:", error);
        }
    };


    return (
        <div className="admin-list-container">
            <div className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Buscar Usuarios"
                    className="search-input"
                />
                <button onClick={handleSearchClick} className="btn-search">Buscar</button>
            </div>

            {loading ? (
                <div className="spinner"><ImSpinner3 /></div>
            ) : (
                <div className="table-container">
                    <Table striped bordered hover responsive className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Fecha Nacimiento</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.mail}</td>
                                        <td>{user.birthdate}</td>
                                        <td>
                                            <button onClick={() => handleBanClick(user.id)} className="btn-ban">Banear</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No hay usuarios.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}

            <div className="nav-buttons">
                <button className="btn-new" onClick={prevPage} disabled={page === 1}>Anterior</button>
                <p>{page}</p>
                <button className="btn-new" onClick={nextPage}>Siguiente</button>
            </div>

            {/* Modal para banear usuario */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Banear Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Razón del Baneo</Form.Label>
                            <Form.Control
                                type="text"
                                value={banDetails.reason}
                                onChange={(e) => setBanDetails({ ...banDetails, reason: e.target.value })}
                                placeholder="Ingresa la razón"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Fecha de Fin del Baneo</Form.Label>
                            <Form.Control
                                type="date"
                                value={banDetails.endDate}
                                onChange={(e) => setBanDetails({ ...banDetails, endDate: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={banUser}>
                        Confirmar Baneo
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyUser;
