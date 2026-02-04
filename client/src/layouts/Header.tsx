import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { FaSignOutAlt, FaPlus } from "react-icons/fa";
import Banner from "../assets/banner.jpg";

interface JwtPayload {
  email?: string;
  id?: string;
  name?: string;
}

const Header: React.FC = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  // Si pas de token (utilisateur non connecté), on n'affiche pas le header
  if (!token) return null;

  let userName;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    userName = decoded.name;
  } catch {
    // en cas d'erreur de décodage, on garde la valeur par défaut
  }

  const handleLogout = () => {
    setToken(null);
    navigate("/", { replace: true });
  };

  return (
    <header className="h-80 relative">
      <img src={Banner} alt="Banner" className="w-full h-full object-cover" />
      <h1 className="absolute bottom-4 left-24 font-indie-flower text-pink-100 text-4xl md:text-5xl lg:text-6xl font-bold shadow-lg px-4 py-2 bg-black bg-opacity-50 rounded-md ">
        Les recettes familiales
      </h1>

      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="auth-badge">
          <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
          Connecté en tant que {userName}{" "}
        </div>
        <button
          onClick={handleLogout}
          className="bg-pink-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-pink-700 transition cursor-pointer"
        >
          <FaSignOutAlt />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
