import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/MainPage/View/MainPage'
import BlogPage from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/BlogPage/View/BlogPage'; // Importa el componente Blog
import LoginPage from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/LoginPage/View/LoginPage'; // Asegúrate de crear este componente
import RegisterPage from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/RegisterPage/View/RegisterPage';
import MainPage2 from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/Login-MainPage/View/MainPage2'
import RecipePage from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/RecipePage/View/RecipePage';

const Rutas: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/inicio" element={<MainPage2 />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/Recetas" element={<RecipePage/>}/>  
      </Routes>
    </Router>
  );
};

export default Rutas;