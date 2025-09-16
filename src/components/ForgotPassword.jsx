import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para feedback de carregamento

  // Substitua pela URL base da sua API
  const BASE_URL = "https://gerador-presell.vercel.app";

  const handleSubmit = async (e ) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, { // Endpoint de exemplo
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Usa a mensagem do servidor ou uma mensagem padrão
        throw new Error(data.message || 'Falha ao processar a solicitação.');
      }

      setMessage('Se um e-mail cadastrado for encontrado, um link de recuperação será enviado.');
      setEmail(''); // Limpa o campo após o envio
    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-container">
        <h2>Recuperar Senha</h2>
        <p className="instructions">
          Digite seu e-mail e enviaremos um link para você redefinir sua senha.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
              disabled={isLoading} // Desabilita o campo durante o envio
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>
        <div className="back-to-login">
          <Link to="/login">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
