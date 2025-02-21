import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3, ImSearch } from 'react-icons/im';
import { Link } from 'react-router-dom';
import './Admin.css';


const Admin = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5156/User?query=${query}&page=${page}&pageSize=10&isAdmin=true`);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching admin users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [query, page]);

    const find = (evt) => {
        setQuery(evt.target.value);
        setPage(1);
    };

    const prevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    const deleteUser = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas bloquear este usuario?')) return;
    
        try {
            const response = await fetch(`http://localhost:5156/User/${id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }
    
            alert('Usuario bloqueado correctamente.');
    
            // Actualizar la lista de usuarios (en lugar de eliminarlo completamente, solo lo bloqueamos)
            setUsers(users.map(user => 
                user.id === id ? { ...user, isAdmin: true, userStatus: 'bloqueado' } : user
            ));
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };
    

    return (
        <div className="admin-container">
            <div className="btn-new-container">
                <Link to="/admin/new" className="btn-new">New</Link>
            </div>

            <div className="search-container">
                <ImSearch className="search-icon" />
                <input
                    type="text"
                    value={query}
                    onChange={find}
                    placeholder="Search user"
                    className="search-input"
                />
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
                                        <Link to={`/edit/${user.id}`} className='btn-edit'>Edit</Link>
                                        <button
                                            className='btn-delete'
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <div className="nav-buttons">
                <button className='btn-new' onClick={prevPage}>Prev</button>
                <p>{page}</p>
                <button className='btn-new' onClick={nextPage}>Next</button>
            </div>
        </div>
    );
};

export default Admin;
