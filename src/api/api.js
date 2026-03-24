// const isDev = process.env.NODE_ENV === "development";
// const hostname = window.location.hostname;
// const backendPort = isDev ? ":5000" : "";

// export const BASE_URL = isDev
//   ? `http://${hostname}${backendPort}/api/v1`
//   : "https://api.subadex.com/api/v1"; // ✅ subdomain points to Render

// export const getHeaders = (includeAuth = true) => {
//   const token = localStorage.getItem("token");

//   return {
//     "Content-Type": "application/json",
//     ...(includeAuth && token && { Authorization: `Bearer ${token}` }),
//   };
// };

const isDev = process.env.NODE_ENV === "development";
const hostname = window.location.hostname;
const backendPort = isDev ? ":5000" : "";

/* ════════════════════════════════════════════════════════
   PRODUCTION API SUBDOMAIN MAP
   Each marketer's frontend points to their own api subdomain.
   Add a new entry for every new affiliate marketer.
════════════════════════════════════════════════════════ */
const PROD_API_MAP = {
  "subadex.com": "https://api.subadex.com/api/v1",
  "www.subadex.com": "https://api.subadex.com/api/v1",
  "kwikipay.com": "https://api.kwikipay.com/api/v1",
  "www.kwikipay.com": "https://api.kwikipay.com/api/v1",
};

const getProdApiUrl = () => {
  const mapped = PROD_API_MAP[hostname];

  if (mapped) return mapped;

  // ❌ Remove the automatic fallback — it causes unknown domains
  // to silently route to a registered marketer's API

  // ✅ Instead return a clearly invalid URL so the error is obvious
  console.warn("⚠️ No API mapping found for hostname:", hostname);
  return `https://api.${hostname.replace(/^www\./, "")}/api/v1`;
};

export const BASE_URL = isDev
  ? `http://${hostname}${backendPort}/api/v1` // dev: uses window.location.hostname
  : getProdApiUrl(); // prod: maps domain → api subdomain

export const getHeaders = (includeAuth = true) => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(includeAuth && token && { Authorization: `Bearer ${token}` }),
  };
};
