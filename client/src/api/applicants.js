import axiosInstance from "../lib/axiosInstance";

export const getApplicants = async (params) => {
  const response = await axiosInstance.get("/applicants", { params });

  return response;
};

export const applicantsDetail = async (id) => {
  const response = await axiosInstance.get(`/applicants/${id}`);

  return response;
};

export const updateApplicantStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/applicants/${id}/status`, {
    status,
  });

  return response;
};

export const updateApplicantNote = async (id, notes) => {
  const response = await axiosInstance.patch(`/applicants/${id}/notes`, {
    notes,
  });

  return response;
};