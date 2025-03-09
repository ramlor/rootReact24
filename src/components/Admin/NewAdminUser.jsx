import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Global.css';

//
const NewAdminUser = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { name, lastName, mail, birthdate, password, isAdmin: true };

        try {
            const response = await fetch('http://localhost:5156/User', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            alert('Usuario creado correctamente.');
            navigate('/admin/ABM');

        } catch (error) {
            console.error('Error creando usuario:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
            <input value={birthdate} onChange={e => setBirthdate(e.target.value)} placeholder="Birthdate" type="date" required />
            <input value={mail} onChange={e => setMail(e.target.value)} placeholder="Email" required />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
            <button type="submit" className="submit-button">Crear</button>
            <button type="button" onClick={() => navigate('/admin/ABM')}className="back-button"> Volver </button>
        </form>
    );
};

export default NewAdminUser;



