import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
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
      setToken(response.data.token);
      navigate("/home", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <section className="login-page relative">
      <div className="login-card">
        <header className="mb-8 space-y-2 text-center">
          <h1 className="login-title">Connectez-vous à votre compte</h1>
          <p className="login-subtitle">
            Accédez à vos recettes de famille en toute sécurité.
          </p>
        </header>

        {error && <p className="login-error">{error}</p>}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div className="login-field">
              <CiUser className="text-2xl text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Votre adresse e-mail"
              />
            </div>

            {/* Mot de passe */}
            <div className="login-field">
              <CiLock className="text-2xl text-slate-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // ← type dynamique
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xl text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-2">
            Se connecter
          </button>
        </form>

        <p className="login-footer">
          Pas encore inscrit ?{" "}
          <Link to="/register" className="underline hover:text-blue-300">
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
