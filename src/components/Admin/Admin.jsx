import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im'; 
import { Link } from 'react-router-dom';
import './Admin.css'; 


const Admin = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const find = (evt) => {
        const { value } = evt.target;
        setQuery(value);
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    return (
        <div className="admin-container">
            {/* Contenedor para alinear el botón "Nuevo" a la derecha */}
            <div className="btn-new-container">
                <Link to="/admin" className="btn-new">Nuevo</Link>
            </div>

            <input type="text" value={query} onChange={find} placeholder="Buscar usuario" />

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
                                <th>Username</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <Link to="" className='btn-edit'>Editar</Link>
                                    <Link to="" className='btn-delete'>Eliminar</Link>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td></td>
                                <td></td>
                                <td>@</td>
                                <td>
                                    <Link to="" className='btn-edit'>Editar</Link>
                                    <Link to="" className='btn-delete'>Eliminar</Link>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td></td>
                                <td></td>
                                <td>@</td>
                                <td>
                                    <Link to="" className='btn-edit'>Editar</Link>
                                    <Link to="" className='btn-delete'>Eliminar</Link>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            )}

            <div className="nav-buttons">
                <a className='btn-new' onClick={prevPage}>Anterior</a>
                <p>{page}</p>
                <a className='btn-new' onClick={nextPage}>Siguiente</a>
            </div>
        </div>
    );
};

export default Admin;
