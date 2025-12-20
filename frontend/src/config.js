const API_URL =
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "production"
        ? "https://your-backend-url.onrender.com" // Change this after deploying backend
        : "http://localhost:5001");

export default API_URL;
