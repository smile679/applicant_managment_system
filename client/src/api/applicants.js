import axiosInstance from "../lib/axiosInstance";

export const getApplicants = async(params) => {
    const response = await axiosInstance.get("/applicants", { params })

    return response;
};
