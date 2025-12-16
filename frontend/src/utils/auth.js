export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('accountNumber');
  localStorage.removeItem('customerName');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const setUserInfo = (data) => {
  localStorage.setItem('accountNumber', data.accountNumber);
  localStorage.setItem('customerName', data.name);
};

export const getUserInfo = () => {
  return {
    accountNumber: localStorage.getItem('accountNumber'),
    customerName: localStorage.getItem('customerName')
  };
};