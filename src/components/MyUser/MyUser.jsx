import React, { useState, useEffect, useCallback } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';

import './MyUser.css';

const MyUser = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    // Usamos useCallback para memorizar la función
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`http://localhost:5156/User?query=${encodedQuery}&page=${page}&pageSize=10&isAdmin=false`);
            if (!response.ok) throw new Error('Error fetching data');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching non-admin users:', error);
        } finally {
            setLoading(false);
        }
    }, [query, page]);

    // Llama a fetchUsers cada vez que cambian 'query' o 'page'
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // Ahora está incluida 'fetchUsers' en las dependencias

    /*const addAdmin = (newAdmin) => {
        setUsers((prevUsers) => [...prevUsers, newAdmin]);
    };*/

    const handleSearchChange = (evt) => {
        setQuery(evt.target.value);
    };

    const handleSearchClick = () => {
        setPage(1);
        fetchUsers();
    };

    const prevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    // Funciones para banear y desbanear
    const handleBanUser = (userId) => {
        console.log(`Baneando al usuario con ID: ${userId}`);
        // Aquí debes agregar la lógica para banear al usuario, por ejemplo, una llamada a una API
        // Luego actualizas el estado de 'users' si es necesario
    };

    const handleUnbanUser = (userId) => {
        console.log(`Desbaneando al usuario con ID: ${userId}`);
        // Aquí debes agregar la lógica para desbanear al usuario, por ejemplo, una llamada a una API
        // Luego actualizas el estado de 'users' si es necesario
    };

    return (
        <div className="user-list-container">
            <div className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Buscar usuario"
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
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.mail}</td>
                                    
                                    <td>
                                        <button onClick={() => handleBanUser(user.id)} className="btn-ban">Ban</button>
                                        <button onClick={() => handleUnbanUser(user.id)} className="btn-unban">Unban</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <div className="nav-buttons">
                <button className="btn-new" onClick={prevPage}>Prev</button>
                <p>{page}</p>
                <button className="btn-new" onClick={nextPage}>Next</button>
            </div>
        </div>
    );
};

export default MyUser;
