import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Logout = ()=>{
  /*
    const cookies = Cookies.get();
    const navigate = useNavigate();
    
    for (let cookie in cookies) {
      Cookies.remove(cookie)
    };

    useEffect(()=>{
        navigate('/login');
      },[]);
      */
      const navigate = useNavigate();
      useEffect(()=>{
        
        axios.get('http://localhost:8000/logout',
              {

        }
        )
        .then(
            
          // 성공했을떄, 반환이 되는 값
          (Response) => {
          console.log(Response.data);
      }                
      ).catch(
          // 실패, 즉 에러가 발생했을떄 발생.
          (error) => {
            console.log(error.data)
          }
        )

      },[]);

    

}
export default Logout;