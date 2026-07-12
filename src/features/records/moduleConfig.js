export const moduleConfig = {
  loans: {
    endpoint: '/loans',
    title: 'Loan Portfolio',
    collection: 'loans',
    fields: [
      ['customerName', 'Customer Name'],
      ['loanId', 'Loan ID'],
      ['productType', 'Product Type'],
      ['principalAmount', 'Principal Amount', 'number'],
      ['outstandingBalance', 'Outstanding Balance', 'number'],
      ['interestRate', 'Interest Rate', 'number'],
      ['startDate', 'Start Date', 'date'],
      ['maturityDate', 'Maturity Date', 'date'],
      ['daysPastDue', 'Days Past Due', 'number'],
      ['sector', 'Sector'],
      ['riskRating', 'Risk Rating'],
      ['status', 'Status']
    ],
    columns: ['customerName', 'loanId', 'productType', 'outstandingBalance', 'daysPastDue', 'riskRating', 'status']
  },
  borrowings: {
    endpoint: '/borrowings',
    title: 'Borrowings',
    collection: 'borrowings',
    fields: [
      ['lender', 'Lender'],
      ['productType', 'Product Type'],
      ['principal', 'Principal', 'number'],
      ['outstanding', 'Outstanding', 'number'],
      ['interestRate', 'Interest Rate', 'number'],
      ['tenor', 'Tenor', 'number'],
      ['maturityDate', 'Maturity Date', 'date'],
      ['repaymentFrequency', 'Repayment Frequency']
    ],
    columns: ['lender', 'productType', 'principal', 'outstanding', 'interestRate', 'maturityDate']
  },
  investments: {
    endpoint: '/investments',
    title: 'Investment Portfolio',
    collection: 'investments',
    fields: [
      ['companyName', 'Company Name'],
      ['investmentType', 'Investment Type'],
      ['principal', 'Principal', 'number'],
      ['dateInvested', 'Date Invested', 'date'],
      ['numberOfDays', 'Number of Days', 'number'],
      ['interestRate', 'Interest Rate', 'number'],
      ['maturityDate', 'Maturity Date', 'date'],
      ['status', 'Status']
    ],
    columns: ['companyName', 'investmentType', 'principal', 'interestRate', 'maturityDate', 'status']
  },
  cashAccounts: {
    endpoint: '/cash-accounts',
    title: 'Cash Position',
    collection: 'cashAccounts',
    fields: [
      ['bankName', 'Bank Name'],
      ['accountNumber', 'Account Number'],
      ['currency', 'Currency'],
      ['availableBalance', 'Available Balance', 'number'],
      ['restrictedBalance', 'Restricted Balance', 'number'],
      ['lastUpdated', 'Last Updated', 'date']
    ],
    columns: ['bankName', 'accountNumber', 'currency', 'availableBalance', 'restrictedBalance', 'lastUpdated']
  }
};
