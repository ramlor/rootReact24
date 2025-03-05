import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';
<<<<<<< HEAD
import '../../styles/Global.css';
=======
>>>>>>> b7a754c1d37919254ea0be37137b68c5d839ce43

const AdminBannedList = ({ bannedAdmins, setBannedAdmins, setUsers }) => {
    const [loading, setLoading] = useState(false);

<<<<<<< HEAD
    const unbanAdmin = async (id) => {
        try {
            setLoading(true);

            const bannedUser = bannedAdmins.find(user => user.id === id);
=======
    // Función para desbanear un administrador, usando el Id del baneo
    const unbanAdmin = async (banId) => {
        try {
            setLoading(true);

            console.log("Lista de baneados antes de desbanear:", bannedAdmins);

            const bannedUser = bannedAdmins.find(user => user.id === banId);
>>>>>>> b7a754c1d37919254ea0be37137b68c5d839ce43
            if (!bannedUser) {
                console.error("Error: No se encontró el usuario baneado con ese ID.");
                return;
            }

<<<<<<< HEAD
            await fetch(`http://localhost:5156/UserBan/unlock/${id}`, {
=======
            console.log("Desbaneando banId:", banId);

            const response = await fetch(`http://localhost:5156/UserBan/unlock/${banId}`, {
>>>>>>> b7a754c1d37919254ea0be37137b68c5d839ce43
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

<<<<<<< HEAD
            setBannedAdmins(prevBanned => prevBanned.filter(user => user.id !== bannedUser.id));
            setUsers(prevUsers => [...prevUsers, { ...bannedUser }]);
=======
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al desbanear el usuario: ${errorText}`);
            }

            setBannedAdmins(prevBanned => prevBanned.filter(user => user.id !== banId));
            setUsers(prevUsers => [...prevUsers, bannedUser]);

            console.log(`Usuario con ID ${banId} desbaneado con éxito`);
>>>>>>> b7a754c1d37919254ea0be37137b68c5d839ce43

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
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bannedAdmins.length > 0 ? (
                                bannedAdmins.map((user, index) => (
                                    <tr key={`${user.id}-${index}`}>
                                        <td>{index + 1}</td>
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
