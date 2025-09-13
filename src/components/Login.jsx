import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const resp = await fetch(`https://gerador-presell-backend.vercel.app/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
        credentials: "include",
      });


      const data = await resp.json();


      if (resp.ok) {
        // Salvar token e role no localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);

        // Salvar projetos no localStorage ou passar para o pai
        if (data.projects) {
          localStorage.setItem("projects", JSON.stringify(data.projects));
        }

        // Notificar componente pai
        onLoginSuccess(data);

        // Redirecionar para dashboard
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
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && <p className="erro">{erro}</p>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
