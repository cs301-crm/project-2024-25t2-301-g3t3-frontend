import axios from "axios";

// Create an Axios instance with default configuration
const axiosClient = axios.create({
  baseURL: "https://api.itsag3t3.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor for debugging
axiosClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    // If response is 401, try to refresh acces token.
    if (
      error.response?.status === 401 &&
      !request.url.includes("/auth/login") &&
      !request.url.includes("/auth/refresh") &&
      !request.url.includes("/auth/verify-otp") &&
      !request.url.includes("/users/reset-password") &&
      !request._retry
    ) {
      request._retry = true;
      try {
        await axiosClient.post("/auth/refresh");
        return axiosClient(request);
      } catch {
        //Redirects user back to the previous page after re-login
        sessionStorage.setItem("redirectAfterLogin", window.location.href);
        console.error("Unable to refresh access token, re-login required");
        //Remove user state
        localStorage.removeItem("user");
        localStorage.removeItem("userEmail");
        window.location.href = "/login";
      }
    } else if (error.response) {
      // Catch other errors
      const status = error.response.status;
      const errorData = error.response.data;
      const errorMessage = errorData?.message || "An error occurred";
      const errorStr = JSON.stringify(errorData || error.message || "");

      // Check for method not supported errors
      if (
        errorStr.includes("HttpRequestMethodNotSupportedException") ||
        (errorStr.includes("Request method") &&
          errorStr.includes("is not supported")) ||
        status === 405
      ) {
        console.error(`API Method Not Supported Error: ${errorMessage}`, {
          endpoint: error.config?.url,
          method: error.config?.method,
          supportedMethods: errorData?.supportedMethods || "unknown",
        });
      } else if (status === 500) {
        console.error(`API Server Error (500): ${errorMessage}`, {
          endpoint: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          response: errorData,
        });
      } else {
        console.error(`API Error (${status}): ${errorMessage}`, {
          endpoint: error.config?.url,
          method: error.config?.method,
        });
      }
    } else {
      console.error("Network error");
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
