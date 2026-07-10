import BASE_URL, { getAuthHeaders, parseApiResponse } from "./api";

const statusFromBackend = {
  OPEN: "Active",
  IN_PROGRESS: "Adjourned",
  PENDING: "Pending",
  CLOSED: "Disposed",
};

const statusToBackend = {
  Active: "OPEN",
  Adjourned: "IN_PROGRESS",
  Pending: "PENDING",
  Disposed: "CLOSED",
};

const priorityFromBackend = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const normalizeCase = (item = {}) => ({
  id: item.id,
  title: item.title || "",
  caseNumber: item.caseNumber || "",
  court: item.courtName || "",
  judge: item.lawyerName || "",
  client: item.clientName || "",
  clientEmail: item.clientEmail || "",
  clientPhone: item.clientPhone || "",
  opponent: item.opponent || "",
  caseType: item.caseType || "",
  status: statusFromBackend[item.status] || item.status || "Active",
  priority: priorityFromBackend[item.priority] || item.priority || "Medium",
  nextHearing: item.nextHearingDate || null,
  filingDate: item.filingDate || "",
  description: item.description || "",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const toCaseRequest = (caseData = {}) => ({
  title: caseData.title,
  description: caseData.description || "",
  clientName: caseData.client || caseData.clientName,
  clientEmail: caseData.clientEmail || "",
  clientPhone: caseData.clientPhone || "",
  lawyerName: caseData.judge || caseData.lawyerName || "",
  caseType: caseData.caseType || "",
  courtName: caseData.court || caseData.courtName || "",
  caseNumber: caseData.caseNumber || "",
  filingDate: caseData.filingDate || null,
  nextHearingDate: caseData.nextHearing || caseData.nextHearingDate || null,
  status: statusToBackend[caseData.status] || caseData.status || "OPEN",
  priority: caseData.priority || "MEDIUM",
});

export const getCases = async (token) => {
  const res = await fetch(`${BASE_URL}/cases`, {
    headers: getAuthHeaders(token),
  });
  const data = await parseApiResponse(res);
  return Array.isArray(data) ? data.map(normalizeCase) : [];
};

export const getCase = async (id, token) => {
  const res = await fetch(`${BASE_URL}/cases/${id}`, {
    headers: getAuthHeaders(token),
  });
  return normalizeCase(await parseApiResponse(res));
};

export const createCase = async (caseData, token) => {
  const res = await fetch(`${BASE_URL}/cases`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(toCaseRequest(caseData)),
  });
  return normalizeCase(await parseApiResponse(res));
};

export const updateCase = async (id, caseData, token) => {
  const res = await fetch(`${BASE_URL}/cases/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(toCaseRequest(caseData)),
  });
  return normalizeCase(await parseApiResponse(res));
};

export const deleteCase = async (id, token) => {
  const res = await fetch(`${BASE_URL}/cases/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  await parseApiResponse(res);
  return true;
};
