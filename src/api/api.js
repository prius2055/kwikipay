const isDev = process.env.NODE_ENV === "development";
const hostname = window.location.hostname;
const backendPort = isDev ? ":5000" : "";

export const BASE_URL = isDev
  ? `http://${hostname}${backendPort}/api/v1`
  : "https://api.subadex.com/api/v1"; // ✅ subdomain points to Render

export const getHeaders = (includeAuth = true) => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(includeAuth && token && { Authorization: `Bearer ${token}` }),
  };
};
