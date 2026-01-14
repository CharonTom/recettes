import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { FaUtensils, FaSignOutAlt } from "react-icons/fa";

interface JwtPayload {
  email?: string;
  id?: string;
}

const Header: React.FC = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  // Si pas de token (utilisateur non connecté), on n'affiche pas le header
  if (!token) return null;

  let userEmail = "Utilisateur";
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    userEmail = decoded.email || "Utilisateur";
  } catch {
    // en cas d'erreur de décodage, on garde la valeur par défaut
  }

  const handleLogout = () => {
    setToken(null);
    navigate("/", { replace: true });
  };

  return (
    <header className="home-header">
      <div className="container mx-auto px-4 py-4 flex-between">
        <div className="flex items-center gap-3">
          <div className="home-logo">
            <FaUtensils className="text-2xl text-blue-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-50">
            Recettes de Famille
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400 hidden sm:inline">
            {userEmail}
          </span>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
