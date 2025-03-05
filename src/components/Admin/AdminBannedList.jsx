import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';
import '../../styles/Global.css';

const AdminBannedList = ({ bannedAdmins, setBannedAdmins, setUsers }) => {
    const [loading, setLoading] = useState(false);

    const unbanAdmin = async (id) => {
        try {
            setLoading(true);

            const bannedUser = bannedAdmins.find(user => user.id === id);
            if (!bannedUser) {
                console.error("Error: No se encontró el usuario baneado con ese ID.");
                return;
            }

            await fetch(`http://localhost:5156/UserBan/unlock/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            setBannedAdmins(prevBanned => prevBanned.filter(user => user.id !== bannedUser.id));
            setUsers(prevUsers => [...prevUsers, { ...bannedUser }]);

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
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Motivo</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bannedAdmins.length > 0 ? (
                                bannedAdmins.map((user, index) => (
                                    <tr key={`${user.id}-${index}`}>
                                        <td>{user.name}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.mail}</td>
                                        <td>{user.reason}</td>
                                        <td>
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
