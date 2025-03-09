import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const EditAdminUser = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Obtenemos el ID del usuario desde la URL

    // useEffect para cargar los datos del usuario cuando se monta el componente
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5156/User/${id}`); // Aquí obtenemos los datos
                if (response.ok) {
                    const data = await response.json();
                    setName(data.name);
                    setLastName(data.lastName);
                    setMail(data.mail);
                    setBirthdate(data.birthdate ? data.birthdate.split('T')[0] : ''); // Formateamos la fecha a 'YYYY-MM-DD'
                } else {
                    alert('Error al cargar los datos del usuario.');
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
        };

        fetchUserData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Si la contraseña está vacía, no la enviamos
        const userData = { 
            id, 
            name, 
            lastName, 
            mail, 
            birthdate, 
            password: password || undefined, // Si no hay contraseña, no la enviamos
            isAdmin: true 
        };

        try {
            const response = await fetch(`http://localhost:5156/User/${id}`, {
                method: 'PUT', // Cambiamos el método a PUT
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            alert('Usuario editado correctamente.');
            navigate('/admin/ABM'); // Redirige a la lista de administradores después de guardar
        } catch (error) {
            console.error('Error editando usuario:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}className="admin-form">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
            <input value={mail} onChange={e => setMail(e.target.value)} placeholder="Email" required />
            <input 
                value={birthdate} 
                onChange={e => setBirthdate(e.target.value)} 
                type="date" 
                required 
            />
            <input 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Password" 
                type="password" 
            />
            <button type="submit" className="submit-button">Guardar</button>
            <button type="button" onClick={() => navigate('/admin/ABM')}className="back-button">Volver</button>
        </form>
    );
};

export default EditAdminUser;
