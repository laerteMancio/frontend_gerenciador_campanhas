import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Importando o novo componente de força da senha
import PasswordStrengthMeter from './PasswordStrengthMeter';

// Funções de validação
const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// A validação de força da senha agora é mais visual, mas mantemos a lógica base
const isPasswordStrong = (password) => password.length >= 8;

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Estados para validação em tempo real
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const BASE_URL = "https://gerador-presell.vercel.app";

  // Handlers com validação
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !isEmailValid(newEmail)) {
      setEmailError("Formato de e-mail inválido.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setSenha(newPassword);
    // A validação visual é feita pelo PasswordStrengthMeter, mas mantemos o erro de bloqueio
    if (newPassword && !isPasswordStrong(newPassword)) {
      setPasswordError("A senha deve ter no mínimo 8 caracteres.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    if (emailError || passwordError) {
      setErro("Por favor, corrija os erros no formulário.");
      return;
    }

    try {
      const resp = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
        credentials: "include",
      });
      const data = await resp.json();

      if (resp.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);
        if (data.projects) {
          localStorage.setItem("projects", JSON.stringify(data.projects));
        }

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberMe");
        }
        
        onLoginSuccess(data);
        navigate("/dashboard");
      } else {
        setErro(data.message || "Credenciais inválidas");
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor");
      console.error(err);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image-side">
        <div className="branding-text">
          <h1>Sua Marca</h1>
          <p>Bem-vindo de volta!</p>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="seuemail@exemplo.com"
                className={emailError ? 'input-error' : ''}
                required
              />
              {emailError && <p className="validation-error">{emailError}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="senha">Senha</label>
              <div className="password-wrapper">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={handlePasswordChange}
                  placeholder="Mínimo 8 caracteres"
                  className={passwordError ? 'input-error' : ''}
                  required
                />
                <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {/* Medidor de força da senha integrado */}
              <PasswordStrengthMeter password={senha} />
              {passwordError && !senha && <p className="validation-error">{passwordError}</p>}
            </div>
            
            <div className="options-group">
              <label className="remember-me">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Lembrar-me
              </label>
              <Link to="/forgot-password" className="forgot-password">Esqueceu a senha?</Link>
            </div>

            {erro && <p className="erro">{erro}</p>}
            <button type="submit" disabled={!!emailError || !!passwordError}>Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
