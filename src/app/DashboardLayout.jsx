import { Outlet, NavLink } from 'react-router-dom';
import {
  Banknote,
  Bell,
  Building2,
  CloudUpload,
  FileBarChart,
  Gauge,
  Landmark,
  LineChart,
  LogOut,
  Moon,
  PiggyBank,
  ShieldAlert,
  Sun,
  Users,
  PieChart,
  WalletCards
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTerms } from '../context/TerminologyContext.jsx';

export function DashboardLayout() {
  const { user, organisation, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const terms = useTerms();
  const nav = [
    { to: '/', label: 'Dashboard', icon: Gauge },
    { to: '/portfolio', label: terms.receivables, icon: WalletCards },
    { to: '/debtors', label: terms.debtors, icon: Users },
    { to: '/receivables-ecl', label: `${terms.debtors} IFRS 9 ECL`, icon: ShieldAlert },
    { to: '/ecl', label: 'Loan Book IFRS 9 ECL', icon: ShieldAlert },
    { to: '/borrowings', label: terms.borrowings, icon: Landmark },
    { to: '/investments', label: 'Investments', icon: LineChart },
    { to: '/cash', label: 'Cash Position', icon: Banknote },
    { to: '/equity', label: 'Equity & Reserves', icon: PieChart },
    { to: '/liquidity', label: 'Liquidity', icon: PiggyBank },
    { to: '/uploads', label: 'Upload Centre', icon: CloudUpload },
    { to: '/reports', label: 'Reports', icon: FileBarChart },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/organisation', label: 'Organisation', icon: Building2 }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">ETPA</div>
          <div>
            <strong>ELITES</strong>
            <span>Treasury & Portfolio Analytics</span>
          </div>
        </div>
        <nav>
          {nav.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav-item">
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <p>{organisation?.name || 'Organisation'}</p>
            <h1>ELITES Treasury & Portfolio Analytics</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="user-pill">
              <span>{user?.name}</span>
              <small>{user?.role?.replaceAll('_', ' ')}</small>
            </div>
            <button className="icon-button" onClick={logout} aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
