import axiosClient from './axiosClient';
import { handleApiError } from './error-handler';
import {
  CreateUserRequestDTO,
  DisableEnableRequestDTO,
  DangerousActionOtpVerificationDTO,
  UpdateUserRequestDTO,
  ResetPasswordRequestDTO,
  GenericResponseDTO,
} from './types';

export const userService = {
  /**
   * Create a new user
   * @param userData - The data for the new user
   * @returns Promise with the response from the server
   */
  createUser: async (userData: CreateUserRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/api/v1/users', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to create user');
    }
  },

  /**
   * Disable a user
   * @param requestData - The data to disable the user
   * @returns Promise with the response from the server
   */
  disableUser: async (requestData: DisableEnableRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.patch('/api/v1/users/disable', requestData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to disable user');
    }
  },

  /**
   * Enable a user
   * @param requestData - The data to enable the user
   * @returns Promise with the response from the server
   */
  enableUser: async (requestData: DisableEnableRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.patch('/api/v1/users/enable', requestData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to enable user');
    }
  },

  /**
   * Verify OTP for a dangerous action
   * @param otpData - The OTP verification data
   * @returns Promise with the response from the server
   */
  verifyOtp: async (otpData: DangerousActionOtpVerificationDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/api/v1/users/verify-otp', otpData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to verify OTP');
    }
  },

  /**
   * Update an existing user
   * @param userData - The updated user data
   * @returns Promise with the response from the server
   */
  updateUser: async (userData: UpdateUserRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.put('/api/v1/users', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to update user');
    }
  },

  /**
   * Reset a user's password
   * @param resetData - The password reset data
   * @returns Promise with the response from the server
   */
  resetPassword: async (resetData: ResetPasswordRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/api/v1/users/reset-password', resetData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to reset password');
    }
  },
};

export default userService;