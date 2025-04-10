import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "../Pages/MainPage/MainPage";
import LoginPage from "../Pages/LoginPage/LoginPage"; // Asegúrate de crear este componente
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import BlogPageLG from "../Pages/Login-BlogPage/BlogPage2";
import RecipePageLG from "../Pages/Login-RecipePage/RecipePage2";
import UserPage from "../Pages/UserPage/UserPage";
import CreateRecipe from "../Pages/CreateRecipe/CreateRecipe";
import NotFound from "../Pages/NotFound/NotFound.tsx";
import ConfigurationPage from "../Pages/ConfigurationPage/ConfigurationPage.tsx"

const Rutas: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Registro" element={<RegisterPage />} />
        <Route path="/Recetaslg" element={<RecipePageLG />} />
        <Route path="/Bloglg" element={<BlogPageLG />} />
        <Route path="/User" element={<UserPage />} />
        <Route path="/CreateRecipe" element={<CreateRecipe />} />
        <Route path="/Configuration" element={<ConfigurationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default Rutas;
