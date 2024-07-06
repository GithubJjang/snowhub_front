import axios from "axios";
import { getCookie } from "../../MangeCookies";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect } from 'react';

function Gototest(){
    const navigate = useNavigate();


    console.log("Go to test1");
    //const navigate = useNavigate();
    axios.get("http://localhost:8000/demo/verify",
    {
        //params: {name: name},
        headers: {Authorization: 'Bearer '+getCookie('IdTokenCookie'),
        "Access-Control-Allow-Origin": 'http://localhost:3000',
        'Access-Control-Allow-Credentials':"true"
    }
    
    })
    .then(
        (Response) => {
        console.log(Response.data)},

        // 등록된 사용자의 정보를 날릴필요 x
        // 익명함수가 사용되서 중첩함수인데 가능????
        useEffect(()=>{
            navigate('/test1');
        })
        
            
    )

    .catch(
        (Error) => {
            // 401 -> 로그인 페이지로 리다이렉트.
            // 누군지 몰라서, 그냥 store값 다 날리자.
            // 원래 요청 페이지 렌더링하고, 401 alert 하나???
            alert('401 UnAuthorized');
            //window.location.href='http://localhost:3000/login';
            
            navigate('/login');

        }
    );
}
export default Gototest;