import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './MyUser.css';
import { wait } from '@testing-library/user-event/dist/utils';

const MyUser = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
    const [users, setUsers] = useState ([]);
    
    const fetchUsers = async () => {
        try{
            setLoading(true);
            let response = await fetch ('http://localhost:5156/User?query=${query}&page={page}&pageSize=10');
            let json = await response.json();
            
            setUsers(json.users);
        }catch (e){
            console.error("Error :", e);
        }finally {
            setLoading (false);
        }
    };

useEffect (() => {    
    fetchUsers();
},[page, query]);

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
                            <th>id</th>
                            <th>Startdate</th>
                            <th>EndDate</th>
                            <th>UserName</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map ((users) => {
                                return (
                                <tr>
                                    <td>{users.id}</td>
                                    <td>{users.Name}</td>
                                    <td>{users.LastName}</td>
                                    <td>{users.Mail}</td>
                                    <td>
                                        <Link to='/user/{users.id}' className='btn-ban'>Baneo</Link>
                                        <button onClick={() => banUser(1)} className='btn-ban'>Baneo</button>
                                        <button onClick={() => banUser(1)} className='btn-ban'>Desbanear</button>
                                    </td>
                                </tr>        

                                );
                            })
                        }
                        
                        <tr>
                            <td>2</td>
                            <td></td>
                            <td></td>
                            <td>@</td>
                            <td>
                                <button onClick={() => banUser(2)} className='btn-ban'>Baneo</button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td></td>
                            <td></td>
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
