import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppProviders } from './app/AppProviders.jsx';
import { DashboardLayout } from './app/DashboardLayout.jsx';
import { ProtectedRoute } from './app/ProtectedRoute.jsx';
import { LoginPage } from './features/auth/LoginPage.jsx';
import { SignupPage } from './features/auth/SignupPage.jsx';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage.jsx';
import { ExecutiveDashboardPage } from './features/dashboard/ExecutiveDashboardPage.jsx';
import { DataModulePage } from './features/records/DataModulePage.jsx';
import { EclEnginePage } from './features/ecl/EclEnginePage.jsx';
import { LiquidityPage } from './features/liquidity/LiquidityPage.jsx';
import { UploadCentrePage } from './features/uploads/UploadCentrePage.jsx';
import { ReportingCentrePage } from './features/reports/ReportingCentrePage.jsx';
import { NotificationsPage } from './features/notifications/NotificationsPage.jsx';
import { OrganisationPage } from './features/organisation/OrganisationPage.jsx';
import { DebtorsPage } from './features/receivables/DebtorsPage.jsx';
import { ReceivablesEclPage } from './features/receivables/ReceivablesEclPage.jsx';
import { EquityPage } from './features/treasury/EquityPage.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<ExecutiveDashboardPage />} />
              <Route path="/portfolio" element={<DataModulePage module="loans" />} />
              <Route path="/debtors" element={<DebtorsPage />} />
              <Route path="/receivables-ecl" element={<ReceivablesEclPage />} />
              <Route path="/ecl" element={<EclEnginePage />} />
              <Route path="/borrowings" element={<DataModulePage module="borrowings" />} />
              <Route path="/investments" element={<DataModulePage module="investments" />} />
              <Route path="/cash" element={<DataModulePage module="cashAccounts" />} />
              <Route path="/equity" element={<EquityPage />} />
              <Route path="/liquidity" element={<LiquidityPage />} />
              <Route path="/uploads" element={<UploadCentrePage />} />
              <Route path="/reports" element={<ReportingCentrePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/organisation" element={<OrganisationPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProviders>
  </React.StrictMode>
);
