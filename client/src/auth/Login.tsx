import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CiUser } from "react-icons/ci";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CiLock } from "react-icons/ci";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); //  état pour le mot de passe
  const [error, setError] = useState<string | null>(null);

  const { setToken } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ token: string }>(
        `${BASE_URL}/api/auth/login`,
        { email, password }
      );
      const rawToken = response.data.token;
      // Décodage et affichage du contenu du token dans la console
      try {
        const decoded = jwtDecode(rawToken);
        console.log("JWT décodé :", decoded);
      } catch (decodeError) {
        console.warn("Impossible de décoder le token JWT :", decodeError);
      }

      setToken(rawToken);
      navigate("/home", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <section className="auth-kitchen-bg">
      <div className="auth-card">
        <div className="auth-card-inner">
          <header className="text-center">
            <h1 className="auth-title font-indie-flower">
              Les recettes familiales
            </h1>
            <p className="auth-subtitle">
              Connectez vous et accédez à vos recettes.
            </p>
          </header>

          {error && <p className="auth-error mt-6">{error}</p>}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div className="auth-field">
                <CiUser className="text-2xl text-slate-300" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="Votre adresse e-mail"
                />
              </div>

              {/* Mot de passe */}
              <div className="auth-field">
                <CiLock className="text-2xl text-slate-300" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // ← type dynamique
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-xl text-slate-300 hover:text-white transition-colors"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-400 px-5 py-3 font-semibold rounded-xl text-white cursor-pointer hover:bg-pink-500 transition"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
