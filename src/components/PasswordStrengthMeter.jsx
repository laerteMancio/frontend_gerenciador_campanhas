// src/components/PasswordStrengthMeter.js

import React from 'react';
import './PasswordStrengthMeter.css';

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;

    // Critérios de pontuação
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++; // Letras maiúsculas
    if (/[0-9]/.test(pass)) score++; // Números
    if (/[^A-Za-z0-9]/.test(pass)) score++; // Símbolos

    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Muito Fraca', 'Fraca', 'Razoável', 'Forte', 'Muito Forte'];

  return (
    <div className="password-strength-meter">
      <progress
        className={`password-strength-progress strength-${strength}`}
        value={strength}
        max="4"
      />
      <label className="password-strength-label">
        {password && `Força: ${strengthLabels[strength - 1] || 'Muito Fraca'}`}
      </label>
    </div>
  );
};

export default PasswordStrengthMeter;
