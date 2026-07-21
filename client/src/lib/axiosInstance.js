import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_INFNOVA_URL,
});

axiosInstance.interceptors.request.use((config) => {
 const token = sessionStorage.getItem("token"); 

  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      
    window.location.href = "/auth/login?expired=true"
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;