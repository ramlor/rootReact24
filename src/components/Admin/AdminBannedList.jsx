import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { ImSpinner3 } from 'react-icons/im';
import { Link } from 'react-router-dom';
import '../../styles/Global.css';

const AdminBannedList = () => {
    const [bans, setBans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para obtener la lista de baneos
    const fetchBans = () => {
        fetch('http://localhost:5156/UserBan?page=1&pageSize=10')
            .then(response => response.json())
            .then(data => {
                setBans(data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar los baneos:", error);
                setLoading(false);
            });
    };

    // Obtener la lista de baneos al montar el componente
    useEffect(() => {
        fetchBans();
    }, []);

    // Función para desbloquear el baneo y actualizar la lista
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
                // Eliminamos el baneo de la lista sin recargar la página
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
                            <th>ID de Usuario</th>
                            <th>Razón</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bans.length > 0 ? (
                            bans.map((ban) => (
                                <tr key={ban.id}>
                                    <td>{ban.id}</td>
                                    <td>
                                        {ban.userId}
                                    </td>
                                    <td>{ban.reason}</td>
                                    <td>
                                        <Button 
                                            onClick={() => unbanAdmin(ban.id)}
                                        >
                                            Desbanear
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">
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
