const { default: axios } = require("axios");

export const apiOptions = {
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
  },
};

export const apiInstance = axios.create(apiOptions);

const refreshToken = async () => {
  try {
    const response = await axios.get(
      `${apiOptions.baseURL}/api/auth/refreshtoken`,
      { withCredentials: true }
    );
    return response.data; // Assuming the new token or session info is returned
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response && response.status === 401) {
      // Check if we already tried to refresh the token
      if (config._retry) {
        console.error("Token refresh already retried");
        window.location.href = "/logout";
        return Promise.reject(error);
      }
      config._retry = true;

      try {
        // Attempt to refresh the token
        await refreshToken();
        // Retry the original request
        return apiInstance(config);
      } catch (refreshError) {
        // Handle the case where token refresh fails
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    // Return the original error if we can't handle it
    return Promise.reject(error);
  }
);
