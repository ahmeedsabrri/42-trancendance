
import cookies from "js-cookie";
import axios from 'axios';


// Base API setup for making HTTP requests
const api = axios.create({
  baseURL:process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});
export default api;

const getToken = (type  = "jwt_token") => {
  return cookies.get(type);
};


const register = (first_name: string, last_name: string, email: string, username: string, password: string) => {
  const res = api.post("/auth/register/", {
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
  const res = api.post("/auth/login/", {
    username: username,
    password: password,
  }, {
    withCredentials: true,
  });   
  return res;
};

const loginWithOtp = async (username: string, password: string, otpCode: string) => {
  const res = api.post("/auth/login/", {
    username: username,
    password: password,
    otp_code: otpCode,
  }, {
    withCredentials: true,
  });   
  return res;
};

const logout = () => {
  const res = api.get("/auth/logout/", { withCredentials: true });

  return res;
};

const changePassword = (current_password: string, new_password: string, confirm_password:string) => {
  const res = api.put("/users/me/change-password/", {
    current_password: current_password,
    new_password: new_password,
    confirm_password: confirm_password,
  }, { withCredentials: true });
  return res;
}
const Oauth42 = (code: string) => {
  const res = api.post("/auth/42/callback/", { code: code });
  return res;
};

const check_auth = async () => {
  const res =  await api.get('/auth/test/');
  return res;
}
  export const AuthActions = () => {
    return {
      login,
      loginWithOtp,
      register,
      getToken,
      logout,
      Oauth42,
      changePassword,
      check_auth,
    };
  };