
import cookies from "js-cookie";
import axios from 'axios';


// Base API setup for making HTTP requests
const api = axios.create({
  baseURL: 'https://localhost/api',
  withCredentials: true,
});

// src/app/auth/utils.ts
// interface UserInfo {
//   id: number;
//   username: string;
//   email?: string;
//   first_name?: string;
//   last_name?: string;
//   avatar?: string;
//   twofa_enabled?: boolean;
//   otp_uri: string;
//   level: number;
// }

const getToken = (type  = "jwt_token") => {
  return cookies.get(type);
};


const register = (first_name: string, last_name: string, email: string, username: string, password: string) => {
  const res = axios.post("https://localhost/api/auth/register/", {
    first_name: first_name,
    last_name: last_name,
    email: email,
    username: username,
    password: password,
  }, {
    withCredentials: true,
  });
  return res;
  };
  
const login = async (username: string, password: string) => {
  const res = axios.post("https://localhost/api/auth/login/", {
    username: username,
    password: password,
  }, {
    withCredentials: true,
  });   
  return res;
};

const loginWithOtp = async (username: string, password: string, otpCode: string) => {
  const res = axios.post("https://localhost/api/auth/login/", {
    username: username,
    password: password,
    otp_code: otpCode,
  }, {
    withCredentials: true,
  });   
  return res;
};

const logout = () => {
  const res = axios.get("https://localhost/api/auth/logout/", { withCredentials: true });

  console.log(res);
  return res;
};

// Export all the functions
// 42 Oauth 2.0

const Oauth42 = (code: string) => {
  const res = api.post("/auth/42/callback/ ", { code: code });
  console.log(res);
  return res;
};

  export const AuthActions = () => {
    return {
      login,
      loginWithOtp,
      register,
      getToken,
      logout,
      Oauth42,
    };
  };