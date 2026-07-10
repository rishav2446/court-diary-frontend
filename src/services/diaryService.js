import BASE_URL, { getAuthHeaders, parseApiResponse } from "./api";

const statusFromBackend = {
  UPCOMING: "Upcoming",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  ADJOURNED: "Adjourned",
  CANCELLED: "Cancelled",
};

const statusToBackend = {
  Upcoming: "UPCOMING",
  "In Progress": "IN_PROGRESS",
  Done: "DONE",
  Adjourned: "ADJOURNED",
  Cancelled: "CANCELLED",
};

export const normalizeHearing = (item = {}) => ({
  id: item.id,
  caseId: item.caseId,
  caseTitle: item.caseTitle || "Untitled Case",
  time: item.hearingTime || item.time || "10:00 AM",
  court: item.courtName || item.court || "",
  purpose: item.purpose || item.hearingNotes || "",
  notes: item.hearingNotes || "",
  status: statusFromBackend[item.status] || item.status || "Upcoming",
  date: item.hearingDate || item.date,
});

const toHearingRequest = (hearingData = {}) => ({
  caseId: hearingData.caseId,
  hearingDate: hearingData.date || hearingData.hearingDate,
  hearingTime: hearingData.time || hearingData.hearingTime || "",
  courtName: hearingData.court || hearingData.courtName || "",
  purpose: hearingData.purpose || "",
  hearingNotes: hearingData.notes || hearingData.hearingNotes || "",
  status: statusToBackend[hearingData.status] || hearingData.status || "UPCOMING",
});

export const getHearings = async (token) => {
  const res = await fetch(`${BASE_URL}/hearings`, {
    headers: getAuthHeaders(token),
  });
  const data = await parseApiResponse(res);
  return Array.isArray(data) ? data.map(normalizeHearing) : [];
};

export const scheduleHearing = async (hearingData, token) => {
  const res = await fetch(`${BASE_URL}/hearings`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(toHearingRequest(hearingData)),
  });
  return normalizeHearing(await parseApiResponse(res));
};

export const updateHearingStatus = async (id, status, token) => {
  const res = await fetch(`${BASE_URL}/hearings/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status: statusToBackend[status] || status }),
  });
  return normalizeHearing(await parseApiResponse(res));
};
