import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './NavBar.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

const NavBar = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">ROOTNETWORK</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                       
                        <Nav.Link as={Link} to="/admin">ADMIN</Nav.Link>
                  
                        <Nav.Link as={Link} to="/User">USUARIOS</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
