import React from 'react'
import { Nav } from 'react-bootstrap';

import { useNavigate, useParams } from 'react-router-dom'

const MyUser = () => {
    const navigate = useNavigate ();

    const callback = () => {
        navigate ('/error');
    }

    return (
        <div>
            Hola soy Usuario
           
        </div>
    )
}

export default MyUser;
