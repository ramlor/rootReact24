import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';
import '../../styles/Global.css';

const AdminBannedList = () => {
    const [bans, setBans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para obtener los baneos y completar con nombre y apellido
    const fetchBans = async () => {
        try {
            const response = await fetch('http://localhost:5156/UserBan?page=1&pageSize=10');
            const data = await response.json();

            if (data.data) {
                const bansWithUserData = await Promise.all(
                    data.data.map(async (ban) => {
                        const userResponse = await fetch(`http://localhost:5156/User/${ban.userId}`);
                        const userData = await userResponse.json();

                        return {
                            ...ban,
                            name: userData.name,
                            lastName: userData.lastName,
                        };
                    })
                );

                setBans(bansWithUserData);
            }
        } catch (error) {
            console.error('Error al cargar los baneos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBans();
    }, []);

    const unbanAdmin = (banId) => {
        fetch(`http://localhost:5156/UserBan/unlock/${banId}`, {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setBans(prevBans => prevBans.filter(ban => ban.id !== banId));
            } else {
                console.error("Error al desbanear:", data.message);
            }
        })
        .catch(error => {
            console.error("Error al desbanear:", error);
        });
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Lista de Baneados</h1>

            {loading ? (
                <div className="text-center">
                    <ImSpinner3 size={40} className="text-primary spin-animation" />
                    <p>Cargando usuarios baneados...</p>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID de Baneo</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Razón</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bans.length > 0 ? (
                            bans.map((ban) => (
                                <tr key={ban.id}>
                                    <td>{ban.id}</td>
                                    <td>{ban.name || 'Desconocido'}</td>
                                    <td>{ban.lastName || 'Desconocido'}</td>
                                    <td>{ban.reason}</td>
                                    <td>
                                        <Button onClick={() => unbanAdmin(ban.id)}>
                                            Desbanear
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No hay usuarios baneados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default AdminBannedList;
