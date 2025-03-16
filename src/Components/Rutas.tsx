import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/MainPage/View/MainPage'
import BlogPage from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/BlogPage/View/BlogPage'; // Importa el componente Blog
import LoginPage from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/LoginPage/View/LoginPage'; // Asegúrate de crear este componente
import RegisterPage from '/Users/Jose-PC/Downloads/Proyecto React/proyecto-final/src/Pages/RegisterPage/View/RegisterPage';

const Rutas: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default Rutas;