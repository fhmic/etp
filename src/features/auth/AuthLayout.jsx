import { Link } from 'react-router-dom';

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-screen">
      <section className="auth-panel">
        <div className="brand auth-brand">
          <div className="brand-mark">ETPD</div>
          <div>
            <strong>ELITES</strong>
            <span>Treasury & Portfolio</span>
          </div>
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
        <div className="auth-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Create account</Link>
        </div>
      </section>
      <section className="auth-visual">
        <div className="terminal-panel">
          <span>LIQUIDITY MONITOR</span>
          <strong>₦24.8B</strong>
          <em>Net liquidity position +8.4%</em>
        </div>
        <div className="ticker-row">
          <span>Loan Book ₦81.2B</span>
          <span>ECL ₦1.7B</span>
          <span>WACD 19.25%</span>
        </div>
      </section>
    </div>
  );
}
