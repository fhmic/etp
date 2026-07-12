import { Link } from 'react-router-dom';

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-screen">
      <section className="auth-panel">
        <div className="brand auth-brand">
          <div className="brand-mark">ETPA</div>
          <div>
            <strong>ELITES</strong>
            <span>Treasury & Portfolio Analytics</span>
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
          <strong>Financial Health</strong>
          <em>Net liquidity position</em>
        </div>
        <div className="ticker-row">
          <span>Loan Records</span>
          <span>ECL Computation</span>
          <span>Financial Metrics</span>
        </div>
      </section>
    </div>
  );
}
