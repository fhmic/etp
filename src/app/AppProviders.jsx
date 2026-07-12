import { AuthProvider } from '../context/AuthContext.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import { TerminologyProvider } from '../context/TerminologyContext.jsx';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TerminologyProvider>{children}</TerminologyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
