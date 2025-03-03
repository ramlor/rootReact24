import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';

const AdminBannedList = ({ bannedAdmins, setBannedAdmins, setUsers }) => {
    const [loading, setLoading] = useState(false);

    // Función para desbanear un administrador, usando el Id del baneo
    const unbanAdmin = async (id) => {
        try {
            setLoading(true);

            console.log("Desbaneando banId:", id); // Verifica que se está enviando correctamente

            const response = await fetch(`http://localhost:5156/UserBan/unlock/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Error al desbanear el usuario');

            // Encuentra el administrador baneado usando el Id del baneo
            const unbannedAdmin = bannedAdmins.find(user => user.id === id);

            // Elimina del estado de baneados y lo agrega a los administradores
            setBannedAdmins(prevBanned => prevBanned.filter(user => user.id !== id));
            setUsers(prevUsers => [...prevUsers, unbannedAdmin]);

        } catch (error) {
            console.error('Error al desbanear:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-banned-list-container">
            <h2>Administradores Baneados</h2>

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
                                <th>Fecha Nacimiento</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bannedAdmins.length > 0 ? (
                                bannedAdmins.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.mail}</td>
                                        <td>{user.birthdate}</td>
                                        <td>
                                            {/* Desbaneamos usando el Id del baneo */}
                                            <button onClick={() => unbanAdmin(user.id)} className="btn-unban">
                                                Desbanear
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No hay administradores baneados.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default AdminBannedList;
