const BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (typeof window !== "undefined" && window.location.hostname 
    ? `http://${window.location.hostname}:8082/api` 
    : "http://localhost:8082/api");

export const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const parseApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "string"
        ? body
        : body?.message || body?.error || "Request failed";
    throw new Error(message);
  }

  return body;
};

export default BASE_URL;
