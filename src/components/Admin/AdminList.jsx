import React, { useState, useEffect, useCallback } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';
import { Link } from 'react-router-dom';

import BannedAdminList from './AdminBannedList'; // Importamos el componente para la lista de baneados



const AdminList = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [bannedAdmins, setBannedAdmins] = useState([]); // Estado para los baneados

    // Definir fetchBannedAdmins antes de que se use en useEffect
    const fetchBannedAdmins = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5156/UserBan?page=1&pageSize=10');
            if (!response.ok) throw new Error('Error fetching banned admins');
            
            const data = await response.json();
            //console.log("Usuarios baneados desde el backend:", data);
    
            // Obtener detalles de cada usuario baneado
            const usersWithDetails = await Promise.all(
                data.data.map(async (ban) => {
                    const userResponse = await fetch(`http://localhost:5156/User/${ban.userId}`);
                    if (!userResponse.ok) return { ...ban, name: "Desconocido", lastName: "", mail: "", birthdate: "" };
                    
                    const userData = await userResponse.json();
                    return { ...ban, ...userData };
                })
            );
    
            setBannedAdmins(usersWithDetails);
        } catch (error) {
            console.error('Error fetching banned admins:', error);
        }
    }, []);

    // Usamos useCallback para memorizar la función
    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`http://localhost:5156/User?query=${encodedQuery}&page=1&pageSize=10&isAdmin=true`);
            if (!response.ok) throw new Error('Error fetching data');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching admin users:', error);
        } finally {
            setLoading(false);
        }
    }, [query, page]);

    // Llama a fetchAdmins y fetchBannedAdmins cada vez que cambian 'query' o 'page'
    useEffect(() => {
        fetchAdmins();
        fetchBannedAdmins();
    }, [fetchAdmins, fetchBannedAdmins]);

    
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

    // Función para banear un administrador
    const banAdmin = async (userId) => {
        const requestBody = {
            StartDateTime: new Date().toISOString(), // Fecha actual en formato ISO
            EndDateTime: null, // Ajusta según sea necesario
            Reason: "Violación de términos" // Ajusta el motivo según corresponda
        };
    
        console.log("Datos enviados al backend:", requestBody); // Debug
    
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
        } catch (error) {
            console.error("Error al banear:", error);
        }
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
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>FechaNacimiento</th>
                                <th>Accion</th>
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
                                        <button onClick={() => banAdmin(user.id)} className="btn-ban">Banear</button> {/* Botón para banear */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <div className="nav-buttons">
                <button className="btn-new" onClick={prevPage}>Anterior</button>
                <p>{page}</p>
                <button className="btn-new" onClick={nextPage}>Siguiente</button>
            </div>

            <BannedAdminList bannedAdmins={bannedAdmins} setBannedAdmins={setBannedAdmins} setUsers={setUsers} />
           
        </div>
    );
};

export default AdminList;
