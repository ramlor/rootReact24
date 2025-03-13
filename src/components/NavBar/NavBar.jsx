import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
//npm install framer-motion

const NavBar = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
              
                <motion.div
                    initial={{ opacity: 0, y: -10 }}  
                    animate={{ opacity: 1, y: 0 }}     
                    transition={{ duration: 2 }}       
                >
                    <Navbar.Brand href="/">
                        ROOTNETWORK
                    </Navbar.Brand>
                </motion.div>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                       
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="dropdown-admin" className="text-dark">
                                ADMIN
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/admin/abm">AMB</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/admin/banned">BANNED</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        
                        <Nav.Link as={Link} to="/User">USERS</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;




