import { Table } from 'react-bootstrap';

const UserBannedList = ({ bannedUsers, unbanUser }) => {
    
    return (
        <div className="banned-users-container">
            <h3>Usuarios Baneados </h3>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Motivo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {bannedUsers.length > 0 ? (
                        bannedUsers.map((ban) => (
                            <tr key={ban.id}>
                                <td>{ban.id}</td>
                                <td>{ban.name || 'Desconocido'}</td>
                                <td>{ban.lastName || 'Desconocido'}</td>
                                <td>{ban.reason}</td>
                                <td>
                                    <button onClick={() => unbanUser(ban.id)} className="btn-unban">Desbanear</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay usuarios baneados.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default UserBannedList;
