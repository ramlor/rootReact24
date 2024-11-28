//alta para nuevo usuarios admin

import React, { useState } from 'react'
import { Spinner, Table } from 'react-bootstrap';

import { Link } from 'react-router-dom';
 

const Admin = () => {
    const [query, setQuery] = useState ("");
    const [page, setPage] = useState (1);
    const [loading, setLoading] = useState (false);

    const find = (etv) => {
        const {value} = etv.target;
        setQuery (value);
    }
    const prevPage = () => {    // validar que no sea menor a cero
        setPage (page - 1);

    }
    const nextPage = () => {
        setPage (page + 1);

    }
    return (
        <>
            <Link to = "/admin" className="btn btn-primary">Nuevo</Link>
            <input type=" type" value={query} onChange={find} />

            {
                loading ?
                    <div className="spinner" ><Spinner/> </div>:
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>
                                    <Link to= ""className='btn btn-primary'>Editar</Link>
                                    <Link to= ""className='btn btn-primary'>Eliminar</Link>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                                <td>
                                    <Link to= ""className='btn btn-primary'>Editar</Link>
                                    <Link to= ""className='btn btn-primary'>Eliminar</Link>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td colSpan={2}>Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                  </Table>
            }

            <a className='btn btn-primary' onClick={prevPage}>Anterior</a>
            <p>{page}</p>
            <a className='btn btn-primary' onClick={nextPage}>Siguiente</a>

            
        </>
    )
}

export default Admin
