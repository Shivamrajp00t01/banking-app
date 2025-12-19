// import { setAuthToken, setUserInfo } from '../utils/auth';

// const AUTH_URL = "http://localhost:8080/api/auth/login";

// export const login = async (accountNumber, password) => {
//   const response = await fetch(AUTH_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       accountNumber,
//       password
//     })
//   });

//   if (!response.ok) {
//     throw new Error("Invalid account number or password");
//   }

//   const data = await response.json();

//   // ✅ REAL JWT TOKEN from backend
//   setAuthToken(data.token);

//   setUserInfo({
//     accountNumber: data.accountNumber,
//     name: data.customerName,
//     accountType: data.accountType
//   });

//   return data;
// };


import { setAuthToken, setUserInfo } from '../utils/auth';

const AUTH_URL = "http://localhost:8080/api/auth/login";

export const login = async (accountNumber, password) => {
  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accountNumber, password })
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server returned invalid response");
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || "Login failed");
  }

  // ✅ Safe usage (only after success)
  setAuthToken(data.token);

  setUserInfo({
    accountNumber: data.accountNumber,
    name: data.customerName,
    accountType: data.accountType
  });

  return data;
};

