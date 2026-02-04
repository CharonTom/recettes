// src/routes/index.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { PrivateRoute } from "./PrivateRoute";
import Home from "../pages/Home";
import Login from "../auth/Login";
import CreateRecipe from "../pages/CreateRecipe";
import Details from "../pages/Details";
import UpdateRecipe from "../pages/UpdateRecipe";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      {/* publiques */}
      <Route index element={<Login />} />
      {/* <Route path="register" element={<Register />} /> */}

      {/* protégées  */}
      <Route element={<PrivateRoute />}>
        <Route path="home" element={<Home />} />
        <Route path="recipes/new" element={<CreateRecipe />} />
        <Route path="recipes/update/:id" element={<UpdateRecipe />} />
        <Route path="recipes/detail/:id" element={<Details />} />
      </Route>

      {/* catch-all */}
      <Route path="*" element={<div>404 - Page non trouvée</div>} />
    </Route>
  </Routes>
);

export default AppRoutes;
