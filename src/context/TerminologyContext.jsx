import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext.jsx';

const TerminologyContext = createContext(null);

const financial = {
  debtor: 'Loan',
  debtors: 'Loans',
  receivable: 'Loan Product',
  receivables: 'Loan Portfolio',
  receivableTypes: 'Loan Product Categories',
  borrowing: 'Borrowing',
  borrowings: 'Borrowings',
  borrowingProduct: 'Borrowing Product',
  borrowingProducts: 'Borrowing Product Types'
};

const nonFinancial = {
  debtor: 'Debtor',
  debtors: 'Debtors',
  receivable: 'Receivable',
  receivables: 'Receivables',
  receivableTypes: 'Receivables Types',
  borrowing: 'Creditor/Payable',
  borrowings: 'Creditors/Payables',
  borrowingProduct: 'Creditor/Payable Type',
  borrowingProducts: 'Creditor/Payable Types'
};

export function TerminologyProvider({ children }) {
  const { organisation } = useAuth();
  const terms = useMemo(
    () => organisation?.organisationType === 'non_financial_services' ? nonFinancial : financial,
    [organisation]
  );
  return <TerminologyContext.Provider value={terms}>{children}</TerminologyContext.Provider>;
}

export function useTerms() {
  return useContext(TerminologyContext);
}
