import axios from "axios";

// 1. Axios Instance క్రియేట్ చేయడం
const API = axios.create({
  // మీ కంప్యూటర్ IP అడ్రస్ మరియు బ్యాకెండ్ పోర్ట్ (5000)
  baseURL: "http://localhost:5000/api",
  
  // కుకీలు మరియు సెషన్స్ పంపడానికి ఇది చాలా ముఖ్యం
  withCredentials: true,
  
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor (ప్రతీ రిక్వెస్ట్ కి టోకెన్ యాడ్ చేస్తుంది)
API.interceptors.request.use(
  (config) => {
    // LocalStorage నుండి టోకెన్ తీసుకోవడం
    const token = localStorage.getItem("token");

    // ఒకవేళ టోకెన్ ఉంటే, హెడర్స్ లో Authorization కింద పంపడం
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (ఎర్రర్స్ ని హ్యాండిల్ చేయడానికి - Optional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // ఒకవేళ టోకెన్ ఎక్స్‌పైర్ అయ్యి 401 వస్తే ఇక్కడ హ్యాండిల్ చేయవచ్చు
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Logging out...");
      // ఇక్కడ కావాలంటే లాగౌట్ లాజిక్ రాసుకోవచ్చు
    }
    return Promise.reject(error);
  }
);

export default API;