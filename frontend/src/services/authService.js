import axios from "axios";

const API_URL = "https://3e63-2401-4900-881a-1d05-f005-506d-ef1a-a90a.ngrok-free.app/api/v1"
// process.env.REACT_APP_API_URL ;

/**
 * ✅ Fetch Firebase Token Securely
 */
const getToken = async () => {
    const user = localStorage.getItem("user") ?  JSON.parse(localStorage.getItem("user")) : null;  // Access the current user directly
    
    if (user) {
        const token =  user.idToken; // ✅ Force refresh token to avoid expiration issues true
        return token;
    } else {
        throw new Error("User not authenticated.");
    }
};


/**
 * ✅ Login API Call
 * @param {string} email
 * @param {string} password
 * @returns {Promise} Authenticated user data or error
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};

/**
 * ✅ Signup API Call
 * @param {string} email
 * @param {string} password
 * @returns {Promise} New user data or error
 */
export const signup = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed.");
  }
};

/**
 * ✅ Logout API Call
 * @returns {Promise} Success message or error
 */
export const logout = async () => {
  try {
    const token = await getToken();

    const response = await axios.post(
      `${API_URL}/auth/logout`,

      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Logout failed.");
  }
};
