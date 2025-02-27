import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MyUser.css';

const MyUser = () => {
    const [query, setQuery] = useState("");  // Búsqueda por nombre o ID
    const [page, setPage] = useState(1); 
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);  // Total de páginas

    // Definir fetchUsers usando useCallback para evitar re-renderizados innecesarios
    const fetchUsers = useCallback(async () => {
        try {
            // Filtramos para obtener solo usuarios que no son administradores (isAdmin=false)
            let response = await fetch(`http://localhost:5156/User?query=${query}&page=${page}&isAdmin=false`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            let json = await response.json();
            setUsers(json.users);  // Ajusta esto según el formato de respuesta de tu backend
            setTotalPages(json.totalPages);  // Obtén el total de páginas desde el backend
        } catch (e) {
            console.error("Error:", e);
        }
    }, [page, query]);  // useCallback memoriza esta función

    // useEffect que depende de 'page', 'query', y 'fetchUsers'
    useEffect(() => {
        fetchUsers();
    }, [page, query, fetchUsers]);  // Llama a fetchUsers cuando cambien page o query

    const find = (evt) => {
        const { value } = evt.target;
        setQuery(value);  // Actualiza el query para la búsqueda
    };

    const banUser = (userId) => {
        console.log(`Usuario baneado con ID: ${userId}`);
        // Aquí puedes agregar la lógica para banear usuarios
    };

    const unbanUser = (userId) => {
        console.log(`Usuario desbaneado con ID: ${userId}`);
        // Aquí puedes agregar la lógica para desbanear usuarios
    };

    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="my-user-container">
            <div className="center-content">
                <h1>Lista de usuarios registrados</h1>
                <input type="text" value={query} onChange={find} className="search-input" placeholder="Ingrese ID o nombre de usuario" />
                <Link to="/usuario" className="btn-search">Search</Link>
            </div>

            <div className="table-container">
                <Table striped bordered hover className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Banned</th> {/* Nueva columna para indicar si el usuario está baneado */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.mail}</td>
                                        <td>{user.isBanned ? 'Yes' : 'No'}</td> {/* Mostrar si el usuario está baneado */}
                                        <td>
                                            <Link to={`/user/${user.id}`} className='btn-ban'>View Profile</Link>
                                            {
                                                user.isBanned ? (
                                                    <button onClick={() => unbanUser(user.id)} className='btn-ban'>Unban</button>
                                                ) : (
                                                    <button onClick={() => banUser(user.id)} className='btn-ban'>Ban</button>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No users found</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </div>

            {/* Controles de paginación */}
            <div className="pagination-controls">
                <button className='btn-new' onClick={goToPreviousPage} disabled={page === 1}>Prev</button>
                <p>{page}</p>
                <button className='btn-new' onClick={goToNextPage} disabled={page === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default MyUser;



