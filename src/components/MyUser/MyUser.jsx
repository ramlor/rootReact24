import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './MyUser.css';

const MyUser = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {

        try {
            setLoading(true);
            let response = await fetch(`http://localhost:5156/User?query=${query}&page=${page}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            let json = await response.json();
            setUsers(json);  // Asegúrate de que el backend devuelve una lista
        } catch (e) {
            console.error("Error:", e);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchUsers();
    }, [page, query]);

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
                <h1>List of banned users</h1>
                <input  type="text" value={query} onChange={find} className="search-input" placeholder="Enter id user or name user" />
                <Link to="/usuario" className="btn-search">Search</Link>
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
                            users.map ((user) => {
                                return (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.mail}</td>
                                    <td>
                                        <Link to='/user/{users.id}' className='btn-ban'>Baneo</Link>
                                        <button onClick={() => banUser(1)} className='btn-ban'>Baneo</button>
                                        <button onClick={() => banUser(1)} className='btn-ban'>Desbanear</button>
                                        
                                    </td>
                                </tr>        

                                );
                            })
                        }
                        
                        
                       
                    </tbody>
                </Table>
            </div>

            <p>{query}</p>
        </div>
    );
};

export default MyUser;
