// src/service/contactService.js
// Central helper for sending contact / lead details to the backend.
// Backend is responsible for writing to Google Sheets and sending emails.

import api from "./api";

export const sendContactLead = async (payload) => {
  const pageUrl =
    typeof window !== "undefined" && window.location?.href
      ? window.location.href
      : "";

  const body = {
    ...payload,
    pageUrl,
  };

  const { data } = await api.post("/api/sheet", body);
  return data;
};


