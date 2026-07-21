import { useEffect, useState } from "react";



const useDebounce = (value, delay = 500)=>{
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(()=>{
     const timeOut = setTimeout(() => {
       setDebouncedValue(value);
     }, delay);

     return () => clearTimeout(timeOut);
  }, [value])

  return debouncedValue;
}


export default useDebounce;