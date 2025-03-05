import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import '../../styles/Global.css';

const AdminForm = () => {
    const { id } = useParams(); // Para obtener el ID del usuario si estamos editando
    const history = useHistory();
    const [user, setUser ] = useState({
        name: '',
        lastName: '',
        mail: '',
        birthdate: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            // Si hay un ID, significa que estamos editando un usuario
            const fetchUser  = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:5156/User/${id}`);
                    if (!response.ok) throw new Error('Error fetching user data');
                    const data = await response.json();
                    setUser (data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser ();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser ((prevUser ) => ({ ...prevUser , [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = id ? 'PUT' : 'POST'; // PUT para editar, POST para agregar
            const response = await fetch(`http://localhost:5156/User${id ? `/${id}` : ''}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) throw new Error('Error saving user data');
            history.push('/admin'); // Redirigir a la lista de administradores
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-container">
            <h2>{id ? 'Editar Administrador' : 'Agregar Administrador'}</h2>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formLastName">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="mail"
                            value={user.mail}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBirthdate">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                            type="date"
                            name="birthdate"
                            value={user.birthdate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {id ? 'Guardar Cambios' : 'Agregar Administrador'}
                    </Button>
                </Form>
            )}
        </div>
    );
};

export default AdminForm;