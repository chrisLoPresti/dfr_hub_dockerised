const { default: axios } = require("axios");

export const apiOptions = {
  baseURL: "http://localhost:5000", //process.env.NEXT_PUBLIC_API_ENDPOINT;,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
  },
};

export const apiInstance = axios.create(apiOptions);

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // If the error is a 401 and we have a refresh token, refresh the JWT token
    if (error?.response?.status === 401) {
      axios
        .get(`${baseURL}/api/auth/refreshtoken`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // Re-run the original request that was intercepted
          apiInstance(originalRequest)
            .then((response) => {
              // return response.data;
            })
            .catch((error) => {
              if (typeof window !== "undefined") {
                console.log("womp womp: ", error);

                window.location.href = "/logout";
              }
            });
        })
        .catch((error) => {
          // If there is an error refreshing the token, log out the user\
          if (typeof window !== "undefined") {
            console.log("womp womp 2 ", error);

            window.location.href = "/logout";
          }
        });
    }

    // Return the original error if we can't handle it
    return Promise.reject(error);
  }
);
