import { setAuthToken, setUserInfo } from '../utils/auth';

const BASE_URL = "http://localhost:8080/api/accounts";

export const login = async (accountNumber, password) => {
  // For demo: just check if account exists
  const response = await fetch(`${BASE_URL}/${accountNumber}`);
  if (!response.ok) {
    throw new Error('Invalid account number or password');
  }
  
  const account = await response.json();
  
  // Store auth info
  setAuthToken('demo-token-' + accountNumber);
  setUserInfo({
    accountNumber: account.accountNumber,
    name: account.customer ? account.customer.name : account.name
  });
  
  return account;
};

// export const logout = () => {
//   removeAuthToken();
// };