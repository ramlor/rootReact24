import React, { useState, useEffect, useCallback } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';
import { Link } from 'react-router-dom';
import './Global.css'; // Importando el archivo renombrado

const AdminList = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    // Usamos useCallback para memorizar la función
    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`http://localhost:5156/User?query=${encodedQuery}&page=${page}&pageSize=10&isAdmin=true`);
            if (!response.ok) throw new Error('Error fetching data');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching admin users:', error);
        } finally {
            setLoading(false);
        }
    }, [query, page]);

    // Llama a fetchAdmins cada vez que cambian 'query' o 'page'
    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]); // Ahora está incluida 'fetchAdmins' en las dependencias

    /*const addAdmin = (newAdmin) => {
        setUsers((prevUsers) => [...prevUsers, newAdmin]);
    };*/
    
    const handleSearchChange = (evt) => {
        setQuery(evt.target.value);
    };

    const handleSearchClick = () => {
        setPage(1);
        fetchAdmins();
    };

    const prevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const nextPage = () => {
        setPage(page + 1);
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
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>FechaNacimiento</th>
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
                                    <td>{user.birthdate}</td>
                                    <td>
                                        <Link to={`/admin/edit/${user.id}`} className="btn-edit">Editar</Link>
                                        
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

export default AdminList;

