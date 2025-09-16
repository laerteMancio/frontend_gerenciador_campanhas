import React, { useEffect } from 'react'; // Importe o useEffect
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

function AuthLayout() {
 

  return (
    <div className="auth-layout-wrapper">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
