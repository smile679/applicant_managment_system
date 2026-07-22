import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { applicantsDetail } from "../../api/applicants";

const ApplicantDetail = () => {
  const { id } = useParams();


  useEffect(()=>{
    const getApplicantDetail = async() => {
      try {
        const response = await applicantsDetail(id);
        console.log(response);

      } catch (error) {
        console.error(error);
      }
    }

    getApplicantDetail();
  },[id])

  return (
    <div>ApplicantDetail</div>
  )
}

export default ApplicantDetail