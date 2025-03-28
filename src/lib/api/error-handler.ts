import { AxiosError } from 'axios';


/**
 * Handles API errors by displaying appropriate toast notifications
 * @param error - The error object from the API call
 * @param customMessage - Optional custom message to display instead of the default
 */
export function handleApiError(error: unknown, customMessage?: string): void {
  console.log('handleApiError called with:', { error, customMessage });
  
  // Determine the appropriate error message
  let displayMessage = customMessage;
  // let title = "Error";
  
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || 'An error occurred';
    
    // Set the title based on the error type
    // title = status ? `Error ${status}` : "API Error";
    
    if (!displayMessage) {
      // Check for specific error types in the error message
      const errorStr = JSON.stringify(errorData || error.message || '');
      
      if (errorStr.includes('HttpRequestMethodNotSupportedException') || 
          (errorStr.includes('Request method') && errorStr.includes('is not supported'))) {
        displayMessage = `API Method Not Supported: The requested operation is not supported by this endpoint`;
      } else if (status === 500) {
        displayMessage = `Server Error: ${errorMessage}`;
      } else if (status === 401) {
        displayMessage = 'Authentication Error: Please log in again';
      } else if (status === 403) {
        displayMessage = 'Permission Denied: You do not have access to this resource';
      } else if (status === 404) {
        displayMessage = 'Resource Not Found';
      } else if (status === 405) {
        displayMessage = 'Method Not Allowed: The requested operation is not supported';
      } else if (status === 400) {
        // Format validation errors in a more readable way
        if (typeof errorData?.errors === 'object' && errorData?.errors !== null) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
          
          if (validationErrors) {
            displayMessage = `Validation Error:\n${validationErrors}`;
          } else {
            displayMessage = `Bad Request: ${errorMessage}`;
          }
        } else {
          displayMessage = `Bad Request: ${errorMessage}`;
        }
      } else if (!error.response) {
        displayMessage = 'Network Error: Unable to connect to the server. Please check if the backend is running.';
      } else {
        displayMessage = `Error: ${errorMessage}`;
      }
    }
    
    
    // Log detailed error information to console for debugging
    console.error('API Error Details:', {
      status,
      message: errorMessage,
      endpoint: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      response: errorData,
      isNetworkError: !error.response
    });
    
    // Special handling for network errors
    if (!error.response) {
      console.error('Network Error: This might indicate that the backend server is not running or not accessible.');
    }
  } else if (error instanceof Error) {
    
    console.error('Non-API Error:', error);

  } else {
    // Handle unknown errors
    
    console.error('Unknown Error:', error);
  }
}
