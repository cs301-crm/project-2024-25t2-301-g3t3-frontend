import { AxiosError } from 'axios';
import axiosClient from './axiosClient';
import { handleApiError } from './error-handler';
import {
  CreateUserRequestDTO,
  DisableEnableRequestDTO,
  DangerousActionOtpVerificationDTO,
  UpdateUserRequestDTO,
  ResetPasswordRequestDTO,
  GenericResponseDTO,
  LoginRequestDTO,
  OtpVerificationDTO,
  ResendOtpRequestDTO,
  OtpSuccessResponse,
  User,
  AdminLogsResponse,
  AgentListResponse
} from './types';

export const userService = {
  // --- USER CONTROLLER ---
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await axiosClient.get('/users'); // Replace with your backend endpoint
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch users');
    }
  },

  createUser: async (userData: CreateUserRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/users', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to create user');
    }
  },

  disableUser: async (data: DisableEnableRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.patch('/users/disable', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to disable user');
    }
  },

  enableUser: async (data: DisableEnableRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.patch('/users/enable', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to enable user');
    }
  },

  verifyUserOtp: async (data: DangerousActionOtpVerificationDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/users/verify-otp', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('OTP verification failed');
    }
  },

  updateUser: async (data: UpdateUserRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.put('/users', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to update user');
    }
  },

  resetPassword: async (data: ResetPasswordRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/users/reset-password', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to reset password');
    }
  },

  // --- AUTH CONTROLLER ---
  login: async (data: LoginRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/auth/login', data);
      return response.data;
    } catch (error) {
      let errorMessage = 'Internal server error';
  
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
  
      throw new Error(errorMessage);
    }
  },

  verifyAuthOtp: async (data: OtpVerificationDTO): Promise<OtpSuccessResponse> => {
    try {
      const response = await axiosClient.post('/auth/verify-otp', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Auth OTP verification failed');
    }
  },

  resendAuthOtp: async (data: ResendOtpRequestDTO): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/auth/resend-otp', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to resend OTP');
    }
  },

  logout: async (): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Logout failed');
    }
  },

  refresh: async (): Promise<GenericResponseDTO> => {
    try {
      const response = await axiosClient.post('/auth/refresh');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Token refresh failed');
    }
  },

  getAdminLogs: async (
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<AdminLogsResponse> => {
    try {
      const params = new URLSearchParams();

  
      if (searchQuery.trim() !== "") {
        params.append('searchQuery', searchQuery);
      }
  
      params.append('page', page.toString());
      params.append('limit', limit.toString());
  
      const response = await axiosClient.get(`/user-logs?${params.toString()}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch logs');
    }
  },

  getAgentList: async (): Promise<AgentListResponse> => {
    try {
      const response = await axiosClient.get('/users/agents');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch agents');
    }
  },
};
