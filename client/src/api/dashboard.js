import axiosInstance from "../lib/axiosInstance";


export const getDashboardSummary = async () => {
  const response = await axiosInstance.get("/dashboard/summary");

  return response;
};