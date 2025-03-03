import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with an error status code (4xx, 5xx)
      const status = error.response.status;
      const errorData = error.response.data;
      const errorMessage = errorData?.message || 'An error occurred';
      const errorStr = JSON.stringify(errorData || error.message || '');
      
      // Check for method not supported errors
      if (errorStr.includes('HttpRequestMethodNotSupportedException') || 
          (errorStr.includes('Request method') && errorStr.includes('is not supported')) ||
          status === 405) {
        console.error(`API Method Not Supported Error: ${errorMessage}`, {
          endpoint: error.config?.url,
          method: error.config?.method,
          supportedMethods: errorData?.supportedMethods || 'unknown'
        });
      } else if (status === 500) {
        console.error(`API Server Error (500): ${errorMessage}`, {
          endpoint: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          response: errorData
        });
      } else {
        console.error(`API Error (${status}): ${errorMessage}`, {
          endpoint: error.config?.url,
          method: error.config?.method
        });
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('API Network Error: No response received', {
        endpoint: error.config?.url,
        method: error.config?.method
      });
    } else {
      // Error in setting up the request
      console.error('API Request Error:', error.message);
    }
    
    // Ensure we're rejecting with an Error object
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default api;