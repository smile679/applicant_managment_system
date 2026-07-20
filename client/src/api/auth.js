import axios from "axios"


export const loginUser = async({ email, password}) => {
  
    const response = await axios.post(
      `${import.meta.env.VITE_INFNOVA_URL}/auth/login`,
      {
        email,
        password,
      },
    );

    return response;
}


export const logoutUser = async (token) => {
  
     const response = await axios.post(
       `${import.meta.env.VITE_INFNOVA_URL}/auth/logout`,{},
       { headers : { Authorization : `Bearer ${token}`}}
     );

     return response;
};