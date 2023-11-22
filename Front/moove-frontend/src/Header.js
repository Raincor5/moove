import React from 'react';
import './Header.scss'; // Assuming you have a Header.scss for styling
import logoImage from './logo.png'; // Update with the correct path

function Header() {
  return (
    <header className="header">
      <div className="header-section help-button">
        <button>Help</button>
      </div>
      <div className="header-section logo">
        <a href=""><img src={logoImage} alt="Moo.ve" /></a>
      </div>
      <div className="header-section auth-buttons">
        <button className="login-button">Login</button>
        <button className="signup-button">Sign Up</button>
      </div>
    </header>
  );
}

export default Header;
