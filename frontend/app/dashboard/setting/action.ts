import axios from 'axios';
import api from '@/app/auth/utils';
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
  username?: string[];
}

interface TwoFAResponse {
  message: string;
  status: string;
}


// Change password function
export async function changePassword(data: PasswordChangeFormData) {
  try {
    const response = await api.put<ApiResponse>('/auth/user/change-password/', data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        error: error.response.data as ApiError,
      };
    }
    return {
      success: false,
      error: { current_password: ['An unexpected error occurred'] },
    };
  }
}

// Enable 2FA function
const handleTwoFactorEnable = async (otpCode: string) => {
  try {
    const response = await api.post<TwoFAResponse>('/auth/2fa/enable/', {
      otp_code: otpCode,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        error: error.response.data as TwoFAError,
      };
    }
    return {
      success: false,
      error: { otp_code: ['An unexpected error occurred'] },
    };
  }
};

const handleTwoFactorDisable = async (otpCode: string) => {
  try {
    const response = await api.post<TwoFAResponse>('/auth/2fa/disable/', {
      otp_code: otpCode,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        error: error.response.data as TwoFAError,
      };
    }
    return {
      success: false,
      error: { otp_code: ['An unexpected error occurred'] },
    };
  }
};

// Update username function
const handelUpdateUsername = async (username: string, password: string) => {
    const response = await api.put('/users/me/update/username/', {
      username: username,
      password: password,
    });
    if (response.data.status === 'success') {
      return {
        success: true,
        data: response.data,
      };
    }
    return {
      success: false,
      error: response.data,
};
};

// Export all functions
export const handelTwoFactor = () => {
  return {
    handleTwoFactorEnable,
    handleTwoFactorDisable,
    changePassword,
    handelUpdateUsername,
  };
};