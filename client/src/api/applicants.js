import axiosInstance from "../lib/axiosInstance";

export const getApplicants = async(params) => {
    const response = await axiosInstance.get("/applicants", { params })

    return response;
};


 export const applicantsDetail = async(id) => {
    
   const response = await axiosInstance.get(`/applicants/${id}`);

   return response;
 }
  

 export const applicantUpdate = async (id, status, notes) => {
    let response;

    if(status){
     response = await axiosInstance.patch(`/applicants/${id}/status`, {
         status,
       });
    } else if(note){
        response = await axiosInstance.patch(`/applicants/${id}/status`, {
          notes,
        });
    }

   return response;
 };