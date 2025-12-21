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


// 

import { setAuthToken, setUserInfo } from '../utils/auth';

const AUTH_URL = "http://localhost:8080/api/auth/login";

export const login = async (accountNumber, password) => {
  try {
    // Debug: Log what we're sending
    console.log('Sending login request:', { accountNumber, password });
    
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ accountNumber, password })
    });
    
    // Debug: Log response status
    console.log('Response status:', response.status);

    // Debug: Log response status
    console.log('Response status:', response.status);

    // Parse JSON first (works for both success and error responses)
    let data;
    try {
      const responseText = await response.text();
      console.log('Response body:', responseText);
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      throw new Error("Server returned invalid response");
    }

    // Then check if request was successful
    if (!response.ok) {
      // Backend returned an error (401, 500, etc.)
      throw new Error(data.message || data.error || "Invalid credentials");
    }

    // Success! Save token and user info
    setAuthToken(data.token);
    setUserInfo({
      accountNumber: data.accountNumber,
      name: data.customerName,
      accountType: data.accountType
    });

    return data;

  } catch (error) {
    // Handle network errors or JSON parsing errors
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Cannot connect to server. Please check if backend is running on port 8080.");
    }
    throw error;
  }
};