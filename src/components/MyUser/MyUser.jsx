import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './MyUser.css';

const MyUser = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate(); 

    const find = (evt) => {
        const { value } = evt.target;
        setQuery(value);
    };

    const banUser = (userId) => {
        console.log(`Usuario baneado con ID: ${userId}`);
    };

    return (
        <div className="my-user-container">
            <div className="center-content">
                <h1>Listado de usuarios</h1>
                <input  type="text" value={query} onChange={find} className="search-input" placeholder="Buscar usuario" />
                <Link to="/usuario" className="btn-search">Buscar</Link>
            </div>

            <div className="table-container">
                <Table striped bordered hover className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>
                                <button onClick={() => banUser(1)} className='btn-ban'>Baneo</button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            <td>
                                <button onClick={() => banUser(2)} className='btn-ban'>Baneo</button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Larry</td>
                            <td>The Bird</td>
                            <td>@twitter</td>
                            <td>
                                <button onClick={() => banUser(3)} className='btn-ban'>Baneo</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <p>{query}</p>
        </div>
    );
};

export default MyUser;
