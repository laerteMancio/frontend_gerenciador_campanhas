import React, { useState } from "react";
import "./Register.css"; // Vamos criar um CSS dedicado

function Register({ usuario, onRegisterSuccess }) {
  // --- NENHUMA MUDANÇA NA LÓGICA ---
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confSenha) {
      setErro("As senhas não conferem");
      return;
    }
    if (!usuario || !usuario.token) {
      setErro("Token de administrador não encontrado. Faça login novamente.");
      return;
    }
    try {
      const resp = await fetch("https://gerador-presell.vercel.app/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuario.token}`,
        },
        body: JSON.stringify({ nome, email, senha } ),
      });
      const contentType = resp.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await resp.json();
      } else {
        const text = await resp.text();
        setErro("Erro do servidor: " + text);
        return;
      }
      if (resp.ok) {
        setSucesso("Usuário registrado com sucesso!");
        setNome("");
        setEmail("");
        setSenha("");
        setConfSenha("");
        if (onRegisterSuccess) onRegisterSuccess();
      } else {
        setErro(data.message || "Erro ao registrar usuário");
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor");
    }
  };

  // --- MUDANÇAS APENAS NA ESTRUTURA JSX ---
  return (
    // Esta página deve ser renderizada dentro do AuthLayout para centralização
    <div className="register-container">
      <h2>Registrar Novo Usuário</h2>
      <p className="register-subtitle">Crie uma conta para um novo membro da equipe.</p>
      
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label htmlFor="nome">Nome Completo</label>
          <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="confSenha">Confirme a Senha</label>
          <input id="confSenha" type="password" value={confSenha} onChange={(e) => setConfSenha(e.target.value)} required />
        </div>

        {/* Mensagens de feedback */}
        {erro && <p className="feedback-message error">{erro}</p>}
        {sucesso && <p className="feedback-message success">{sucesso}</p>}

        <button type="submit" className="submit-btn">Registrar Usuário</button>
      </form>
    </div>
  );
}

export default Register;
