// // Use environment variable with fallback
// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/accounts";

// export async function getAccounts() {
//   const response = await fetch(BASE_URL);
//   if (!response.ok) throw new Error('Failed to fetch accounts');
//   return response.json();
// }

// export async function getAccount(accountNumber) {
//   const response = await fetch(`${BASE_URL}/${accountNumber}`);
//   if (!response.ok) throw new Error('Account not found');
//   return response.json();
// }

// export async function createAccount(name, balance, type = 'SAVINGS', password = '1234') {
//   const params = new URLSearchParams({
//     name,
//     balance,
//     type,
//     password
//   });
//   const response = await fetch(`${BASE_URL}?${params}`, {
//     method: "POST"
//   });
//   if (!response.ok) throw new Error('Failed to create account');
//   return response.json();
// }

// export async function depositAmount(accountId, amount) {
//   const response = await fetch(
//     `${BASE_URL}/${accountId}/deposit?amount=${amount}`,
//     { method: "POST" }
//   );
//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error(error || 'Deposit failed');
//   }
//   return response.json();
// }

// export async function withdrawAmount(accountId, amount) {
//   const response = await fetch(
//     `${BASE_URL}/${accountId}/withdraw?amount=${amount}`,
//     { method: "POST" }
//   );
//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error(error || 'Withdrawal failed');
//   }
//   return response.json();
// }

// export async function transferAmount(fromAccount, toAccount, amount) {
//   const response = await fetch(
//     `${BASE_URL}/${fromAccount}/transfer?toAccount=${toAccount}&amount=${amount}`,
//     { method: "POST" }
//   );
//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error(error || 'Transfer failed');
//   }
//   return response.json();
// }

// export async function getTransactions(accountNumber) {
//   const response = await fetch(`${BASE_URL}/${accountNumber}/transactions`);
//   if (!response.ok) throw new Error('Failed to fetch transactions');
//   return response.json();
// }




// const BASE_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:8080/api/v2accounts";

// async function handleResponse(response) {
//   let data;
//   try {
//     data = await response.json();
//   } catch {
//     throw new Error("Server returned invalid JSON");
//   }

//   if (!response.ok) {
//     throw new Error(data.error || "Request failed");
//   }

//   return data;
// }

// export async function getAccounts() {
//   return handleResponse(await fetch(BASE_URL));
// }

// export async function getAccount(accountNumber) {
//   return handleResponse(await fetch(`${BASE_URL}/${accountNumber}`));
// }

// export async function createAccount(
//   name,
//   balance,
//   type = "SAVINGS",
//   password = "1234"
// ) {
//   const params = new URLSearchParams({
//     name,
//     balance,
//     type,
//     password
//   });

//   return handleResponse(
//     await fetch(`${BASE_URL}?${params}`, {
//       method: "POST"
//     })
//   );
// }

// export async function depositAmount(accountId, amount) {
//   return handleResponse(
//     await fetch(`${BASE_URL}/${accountId}/deposit?amount=${amount}`, {
//       method: "POST"
//     })
//   );
// }

// export async function withdrawAmount(accountId, amount) {
//   return handleResponse(
//     await fetch(`${BASE_URL}/${accountId}/withdraw?amount=${amount}`, {
//       method: "POST"
//     })
//   );
// }

// export async function transferAmount(fromAccount, toAccount, amount) {
//   return handleResponse(
//     await fetch(
//       `${BASE_URL}/${fromAccount}/transfer?toAccount=${toAccount}&amount=${amount}`,
//       { method: "POST" }
//     )
//   );
// }

// export async function getTransactions(accountNumber) {
//   return handleResponse(
//     await fetch(`${BASE_URL}/${accountNumber}/transactions`)
//   );
// }




import { getAuthToken } from '../utils/auth';

// ⭐ FIXED: Changed to /api/v2/accounts
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v2/accounts";
const CREATE_ACCOUNT_URL = "http://localhost:8080/api/accounts"; // Signup uses different endpoint

async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server returned invalid JSON");
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

// ⭐ FIXED: Added function to get headers with auth token
function getHeaders() {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

export async function getAccounts() {
  return handleResponse(
    await fetch(BASE_URL, {
      headers: getHeaders()
    })
  );
}

export async function getAccount(accountNumber) {
  return handleResponse(
    await fetch(`${BASE_URL}/${accountNumber}`, {
      headers: getHeaders()
    })
  );
}

// ⭐ FIXED: Create account uses different URL and format
export async function createAccount(name, balance, type = "SAVINGS", password = "1234") {
  return handleResponse(
    await fetch(CREATE_ACCOUNT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerName: name,
        balance: parseFloat(balance),
        type,
        password
      })
    })
  );
}

export async function depositAmount(accountId, amount) {
  const url = `${BASE_URL}/${accountId}/deposit?amount=${amount}`;
  console.log('Deposit called with:', { accountId, amount, url });
  return handleResponse(
    await fetch(url, {
      method: "POST",
      headers: getHeaders()
    })
  );
}

// Legacy function name for backward compatibility
export const deposit = depositAmount;

export async function withdrawAmount(accountId, amount) {
  const url = `${BASE_URL}/${accountId}/withdraw?amount=${amount}`;
  console.log('Withdraw called with:', { accountId, amount, url });
  return handleResponse(
    await fetch(url, {
      method: "POST",
      headers: getHeaders()
    })
  );
}

export async function transferAmount(fromAccount, toAccount, amount, otp) {
  return handleResponse(
    await fetch(`${BASE_URL}/${fromAccount}/transfer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        toAccount,
        amount: parseFloat(amount),
        otp
      })
    })
  );
}

export async function getTransactions(accountNumber) {
  return handleResponse(
    await fetch(`${BASE_URL}/${accountNumber}/transactions`, {
      headers: getHeaders()
    })
  );
}

export async function getAnalytics(accountNumber) {
  return handleResponse(
    await fetch(`${BASE_URL}/${accountNumber}/analytics`, {
      headers: getHeaders()
    })
  );
}

export async function getStatement(accountNumber) {
  const token = getAuthToken();
  const headers = {};
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/${accountNumber}/statement/pdf`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statement");
  }

  return response.blob();
}

export async function searchAccounts(name) {
  return handleResponse(
    await fetch(`${BASE_URL}/search?name=${encodeURIComponent(name)}`, {
      headers: getHeaders()
    })
  );
}