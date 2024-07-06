import React, { useEffect, useState } from 'react';
import {getCookie} from "../MangeCookies";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Login = ()=>{

  // 변수 설정 login
  const [login,setLogin]=useState('');// 초기값

  const navigate = useNavigate();

  // 변경감지
  // 로그인을 한 경우 -> login=cookie
  useEffect(()=>{
    setLogin(getCookie('IdTokenCookie'));
  },[login])

  const kakao=()=>{
      console.log("Do Kakao Login");
      // KaKao API로 요청보내기
      const url = 'https://kauth.kakao.com/oauth/authorize?client_id=fcc716b8e5ae872c9c4ca01b821f3dea&redirect_uri=http://localhost:8000/auth/kakao&response_type=code&prompt=login';
      window.open(url);

  }
  const google=()=>{
    
      console.log("Do Google Login");
      // Google API로 요청보내기
      const url = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=477737423484-bdni5k16hncmbpcccl3ff9bqgq50c2fm.apps.googleusercontent.com&redirect_uri=http://localhost:8000/auth/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=offline&prompt=consent';
      window.open(url);
  
  }

  // 로그인 페이지.
  const loginPage=(
    <div>
              <meta charSet="utf-8"/>
              <meta name="viewport" content="width=device-width,initial-scale=1" />
        
              <div>
                  <div id="container">
                      
                      <div id="sky"></div>
                      
                      <div id="loginForm">
                          <div id="snowhub"></div>
                          <div id="label">
                              <h2>로그인</h2>
                          </div>
                          <button onClick={()=>{}} id='naver' className='loginbtn'></button>
                          <button onClick={()=>{google()}} id='google' className='loginbtn'></button>
                          <button onClick={()=>{kakao()}} id='kakao' className='loginbtn'></button>
                          <button onClick={()=>{}} id='apple' className='loginbtn'></button>
                          
                      </div>
                  </div>

              </div>
            </div>
  );

  return login ? navigate('/') : loginPage;   // 쿠키가 있으면 -> '/'이동, 아니면 loginPage 재렌더링

}

export default Login;