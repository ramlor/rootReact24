import React, { useState, useEffect, useCallback } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';

import AdminBannedList from '../Admin/AdminBannedList'; 

const MyUser = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [bannedNonAdmins, setBannedNonAdmins] = useState([]); // Actualización aquí

    // Obtener lista de administradores
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

    // Obtener lista de usuarios baneados que NO son administradores
    const fetchBannedNonAdmins = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5156/UserBan?page=1&pageSize=10');
            if (!response.ok) throw new Error('Error fetching banned users');

            const data = await response.json();

            // Obtener detalles de cada usuario baneado
            const usersWithDetails = await Promise.all(
                data.data.map(async (ban) => {
                    try {
                        const userResponse = await fetch(`http://localhost:5156/User/${ban.userId}`);
                        if (!userResponse.ok) throw new Error(`Error fetching user ${ban.userId}`);

                        const userData = await userResponse.json();

                        // Filtrar los usuarios que NO son administradores
                        if (!userData.isAdmin) {
                            return { ...ban, ...userData };
                        } else {
                            return null; // Excluir administradores
                        }
                    } catch (err) {
                        console.error(`No se pudo obtener detalles del usuario ${ban.userId}:`, err);
                        return null; // Manejar errores de usuario individual devolviendo null
                    }
                })
            );

            // Filtrar los resultados nulos (que representan a los administradores)
            const nonAdminBannedUsers = usersWithDetails.filter(user => user !== null);
            setBannedNonAdmins(nonAdminBannedUsers); // Actualización aquí
        } catch (error) {
            console.error('Error fetching banned users:', error);
        }
    }, []);

    // Efectos secundarios para llamar a las funciones
    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    useEffect(() => {
        fetchBannedNonAdmins(); // Actualización aquí
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
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            if (bannedUser) {
                setBannedNonAdmins(prevBanned => [...prevBanned, { ...bannedUser, userId }]); // Actualización aquí
            }

        } catch (error) {
            console.error("Error al banear:", error);
        }
    };

    // Desbanear administrador y actualizar las listas
    const unbanAdmin = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5156/UserBan/unban/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al desbanear el usuario: ${errorText}`);
            }

            console.log(`Usuario ${userId} desbaneado con éxito`);

            setBannedNonAdmins(prevBanned => prevBanned.filter(ban => ban.userId !== userId)); // Actualización aquí
        } catch (error) {
            console.error("Error al desbanear:", error);
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
                                            <button onClick={() => banAdmin(user.id)} className="btn-ban">Banear</button>
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

            {/* Mostrar lista de usuarios baneados no administradores */}
            <AdminBannedList bannedAdmins={bannedNonAdmins} unbanAdmin={unbanAdmin} />
        </div>
    );
};

export default MyUser;
