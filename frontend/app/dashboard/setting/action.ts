import axios from 'axios';

export interface TwoFAError {
  otp_code?: string[];
  error?: string[];
}

interface PasswordChangeFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface ApiResponse {
  message: string;
  status: string;
}

interface ApiError {
  current_password?: string[];
  new_password?: string[];
  confirm_password?: string[];
}

// actions.ts
export async function changePassword(data: PasswordChangeFormData) {
  try {
    const response = await axios.put<ApiResponse>(
      'http://localhost:8000/api/auth/user/change-password/',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        error: error.response.data as ApiError
      };
    }
    
    return {
      success: false,
      error: { current_password: ['An unexpected error occurred'] }
    };
  }
}

const handleTwoFactorEnable = async (Otpcode:String) => {
  // Call API to enable 2FA
  
  try {
    const response = await axios.post<TwoFAResponse>(
      'http://localhost:8000/api/auth/2fa/enable/',
      {
        otp_code: Otpcode
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensures cookies are sent with the request
      }
    );
    alert(response.data.message);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle specific error cases
      const errorData = error.response.data as TwoFAError;
      
      if (error.response) {
        return {
          success: false,
          error: error.response.data.otp_code
        };
      }
  }
}
}
const handleTwoFactorDisable = async (Otpcode:string) => {
  // Call API to disable 2FA
  try {
    const response = await axios.post<TwoFAResponse>(
      'http://localhost:8000/api/auth/2fa/disable/',
      {
        otp_code: Otpcode
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    alert(response.data.message);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle specific error cases
      const errorData = error.response.data as TwoFAError;
      
      if (error.response.status === 400) {
        return {
          success: false,
          error: error.response.data.otp_code
        };
      }
  }
}
}
export const handelTwoFactor = () => {
  return {
    handleTwoFactorEnable,
    handleTwoFactorDisable,
    changePassword,
  };
}

// const UpdateUser = async (first_name: string, last_name: string, username: string, password: string) => {
//   try {
//     const updateData = {
//       ...(first_name && { First_name: first_name }),
//       ...(last_name && { Last_name: last_name }),
//       ...(username && { Username: username }),
//       ...(password && { Password: password }),
//     };
//     console.log(updateData);

//     const res = await fetch("http://localhost:8000/api/auth/user/me/update/",{body: JSON.stringify(updateData) , method: 'PUT', headers: {  'Content-Type': 'application/json',}});

//     return res; // Return the response data
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     throw error; // Re-throw the error for further handling
//   }
// };

// export const settingAction = () => {
//     return {
//         UpdateUser,
//       };
// };




