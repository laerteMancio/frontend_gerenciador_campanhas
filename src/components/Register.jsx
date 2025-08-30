import React, { useState } from "react";

function Register({ usuario, onRegisterSuccess }) {
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
      const resp = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuario.token}`, // token do admin logado
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const contentType = resp.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await resp.json();
      } else {
        const text = await resp.text();
        console.error("Resposta não JSON:", text);
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
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Registrar Novo Usuário</h2>
      <form onSubmit={handleRegister}>
        <label>Nome *</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>Email *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha *</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

        <label>Confirme a Senha *</label>
        <input type="password" value={confSenha} onChange={(e) => setConfSenha(e.target.value)} required />

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p className="sucesso">{sucesso}</p>}

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
