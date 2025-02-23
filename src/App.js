import './App.css';
import NavBar from './components/NavBar/NavBar';
import { Home } from './components/Home/Home';


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MyUser from './components/MyUser/MyUser';
import NotFound from './components/NotFound/NotFound';
import Error from './components/Error/Error500';
import Admin from './components/Admin/Admin';
import NewAdminUser from './components/Admin/NewAdminUser';
import React from 'react';
import './components/Home/home.css'


function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/User" element={<MyUser/>} />
          <Route exact path="/User/:userName" element={<MyUser/>} />
          <Route exact path="/error" element={<Error/>} />
          <Route exact path="/admin" element={<Admin/>} />
          <Route exact path="/admin/new" element={<NewAdminUser/>} />
          <Route exact path="/page-not-faound" element={<NotFound/>} />
          <Route  path="/*" element={<Navigate to = "/page-not-faound"/>} />
        </Routes>
        
      </BrowserRouter>
    </>
  );
}

export default App;

