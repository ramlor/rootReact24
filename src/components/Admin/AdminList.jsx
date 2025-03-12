import React, { useState, useEffect, useCallback } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';
import { Link } from 'react-router-dom';
import BannedAdminList from './AdminBannedList';

const AdminList = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [BannedAdmins, setBannedAdmins] = useState([]);

    // Obtener lista de administradores
    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`http://localhost:5156/User?query=${encodedQuery}&page=${page}&pageSize=5&isAdmin=true`);
            if (!response.ok) throw new Error('Error fetching admin users');
            const data = await response.json();
            setUsers(data.data || data);
            const filteredUsers = data.data.filter(user => !BannedAdmins.some(banned => banned.userId === user.id));
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching admin users:', error);
        } finally {
            setLoading(false);
        }
    }, [query, page, BannedAdmins]);

    // Obtener lista de administradores baneados
    const fetchBannedAdmins = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5156/UserBan?page=1&pageSize=5');
            if (!response.ok) throw new Error('Error fetching banned admins');

            const data = await response.json();

            // Obtener detalles de cada usuario baneado
            const usersWithDetails = await Promise.all(
                data.data.map(async (ban) => {
                    try {
                        const userResponse = await fetch(`http://localhost:5156/User/${ban.userId}`);
                        if (!userResponse.ok) throw new Error(`Error fetching user ${ban.userId}`);

                        const userData = await userResponse.json();
                        return { ...ban, ...userData }; 
                    } catch (err) {
                        console.error(`No se pudo obtener detalles del usuario ${ban.userId}:`, err);
                        return { ...ban, name: "Desconocido", lastName: "", mail: "" };
                    }
                })
            );

            setBannedAdmins(usersWithDetails);
        } catch (error) {
            console.error('Error fetching banned admins:', error);
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    useEffect(() => {
        fetchBannedAdmins();
    }, [fetchBannedAdmins]);

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

    // Banear administrador y actualizar las listas
    const banAdmin = async (userId) => {
        const requestBody = {
            StartDateTime: new Date().toISOString(),
            EndDateTime: null,
            Reason: "Violación de términos"
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

            
            const bannedUser = users.find(user => user.id === userId);

            // Actualizar listas inmediatamente sin recargar
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

            if (bannedUser) {
                setBannedAdmins(prevBanned => [...prevBanned, { ...bannedUser, userId }]);
                
            }

            await fetchAdmins();
            await fetchBannedAdmins();

        } catch (error) {
            console.error("Error al banear:", error);
        }
    };

    return (
        <div className="admin-list-container">
            <div className="btn-new-container">
                <Link to="/admin/new" className="btn-new">Nuevo</Link>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Buscar administrador"
                    className="search-input"
                />
                <button onClick={handleSearchClick} className="btn-search">Buscar</button>
            </div>

            {loading ? (
                <div className="spinner"><ImSpinner3 /></div>
            ) : (
                <div className="table-container">
                    <Table striped bordered hover className="table">
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
                                            <Link to={`/admin/edit/${user.id}`} className="btn-edit">Editar</Link>
                                            <button onClick={() => banAdmin(user.id)} className="btn-ban">Banear</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No hay administradores.</td>
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

            
        </div>
    );
};

export default AdminList;
