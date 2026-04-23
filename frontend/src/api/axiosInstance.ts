import axios from "axios";

// 1. Base URL సెట్ చేయడం
const API = axios.create({
  baseURL: "http://localhost:5000/api", // మీ బ్యాకెండ్ URL ఇక్కడ ఇవ్వండి
  withCredentials: true, // Cookies పంపడానికి ఇది అవసరం
});

// 2. Request Interceptor: ప్రతి రిక్వెస్ట్‌కు టోకెన్‌ను ఆటోమేటిక్‌గా యాడ్ చేస్తుంది
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // మీ టోకెన్ ఎక్కడ సేవ్ చేశారో అక్కడ నుండి తీసుకోండి
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: 401 (Unauthorized) ఎర్రర్ వస్తే లాగౌట్ చేయడం కోసం
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // టోకెన్ ఎక్స్‌పైర్ అయితే యూజర్‌ను లాగిన్ పేజీకి పంపవచ్చు
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;