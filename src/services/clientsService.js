import BASE_URL, { getAuthHeaders, parseApiResponse } from "./api";

export const normalizeClient = (item = {}) => ({
  id: item.id,
  name: item.name || "",
  email: item.email || "",
  phone: item.phone || "",
  address: item.address || "",
  caseCount: item.caseCount || 0,
  status: item.status || "Active",
});

const toClientRequest = (clientData = {}) => ({
  name: clientData.name,
  email: clientData.email || "",
  phone: clientData.phone || "",
  address: clientData.address || "",
  status: clientData.status || "Active",
});

export const getClients = async (token) => {
  const res = await fetch(`${BASE_URL}/clients`, {
    headers: getAuthHeaders(token),
  });
  const data = await parseApiResponse(res);
  return Array.isArray(data) ? data.map(normalizeClient) : [];
};

export const createClient = async (clientData, token) => {
  const res = await fetch(`${BASE_URL}/clients`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(toClientRequest(clientData)),
  });
  return normalizeClient(await parseApiResponse(res));
};

export const deleteClient = async (id, token) => {
  const res = await fetch(`${BASE_URL}/clients/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  await parseApiResponse(res);
  return true;
};
