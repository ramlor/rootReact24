import './App.css';
import NavBar from './components/NavBar/NavBar';
import { Home } from './components/Home/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MyUser  from './components/MyUser/MyUser'; 
import NotFound from './components/NotFound/NotFound';
import Error from './components/Error/Error500';
import AdminEdit from './components/Admin/AdminEdit'; 
import AdminList from './components/Admin/AdminList'; 
import AdminBannedList from './components/Admin/AdminBannedList';
import NewAdminUser from './components/Admin/NewAdminUser';
import './components/Home/home.css';
import './App.css';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/User" element={<MyUser/>}/>
          <Route exact path="/User/:userName" element={<MyUser/>}/>
          <Route exact path="/error" element={<Error/>} />
          <Route exact path="/admin/new" element={<NewAdminUser/>}/>
          <Route exact path="/admin/edit/:id" element={<AdminEdit/>}/>
      
          <Route exact path="/admin/ABM" element={<AdminList/>} />
          <Route exact path="/admin/banned" element={<AdminBannedList/>}/>

          <Route exact path="/page-not-found" element={<NotFound/>}/>
          <Route exact path="/*" element={<Navigate to="/page-not-found"/>}/>

        </Routes>
        
      </BrowserRouter>
    </>
  );
}

export default App;





