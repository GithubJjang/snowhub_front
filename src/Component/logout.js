import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Logout = ()=>{
    const cookies = Cookies.get();
    const navigate = useNavigate();
    
    for (let cookie in cookies) {
      Cookies.remove(cookie)
    };

    useEffect(()=>{
        navigate('/login');
      },[]);
    

}
export default Logout;