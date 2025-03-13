import { Table } from 'react-bootstrap';

const UserBannedList = ({ bannedUsers, unbanUser }) => {
    
    const [bans, setBans] = useState([]);
    const [loading, setLoading] = useState(true);
    
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

    async function unbanUser(banId) {
        console.log("Intentando desbanear usuario con ID:", banId);

        try {
            const response = await fetch(`http://localhost:5156/UserBan/unlock/${banId}`, {
                method: 'PUT',
                headers: {
                    'Accept': '*/*',
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al desbanear el usuario: ${errorText}`);
            }

            console.log(`Usuario ${banId} desbaneado con éxito`);

            // Buscamos el usuario correcto usando userId
            const bannedUser = bannedNonAdmins.find(ban => ban.userId === banId);

            if (bannedUser) {
                // Eliminamos de la lista de baneados
                setBannedNonAdmins(prevBanned => prevBanned.filter(ban => ban.userId !== banId));

                // Agregamos a la lista de usuarios activos
                setUsers(prevUsers => [...prevUsers, bannedUser]);
            } else {
                console.warn("El usuario desbaneado no se encontró en la lista de baneados.");
            }
        } catch (error) {
            console.error("Error al desbanear:", error);
        }
    }

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
                    {bans.length > 0 ? (
                        bans.map((ban) => (
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


