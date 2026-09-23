// src/axiosConfig.js
import axios from "axios";

// Automatically attach cookies (like admin-token) with each request
axios.defaults.withCredentials = true;

export default axios;
