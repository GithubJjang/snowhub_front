import React, { useEffect, useState } from 'react';
import {getCookie} from "../MangeCookies";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import LoginButton from "./LoginButton";
import { styled } from 'styled-components';

import snowhub from './images/snowhub.png';


// SnowHub 글자이미지
const SnowHub = styled.div`
  background-image: url(${props => props.image});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 230px;
  height: 56px;    
`
;


const LoginPage = ()=>{

  // 변수 설정 login
  const [login,setLogin]=useState();// 초기값

  const navigate = useNavigate();

  // 변경감지
  // 로그인을 한 경우 -> login=cookie

  // 첫 useEffect() -> login = ''  -> setLogin() - > 재렌더링. 그래서 값을 비워두자.
  useEffect(()=>{
    setLogin(getCookie('IdTokenCookie'));
  },[login])

  // 로그인 페이지.
  const loginPage=(
    <div>
              <meta charSet="utf-8"/>
              <meta name="viewport" content="width=device-width,initial-scale=1" />
        

                  <div id="container">

                      <div id="sky"></div>  
                    
                      <div id="loginForm">
                          
                          <SnowHub image={snowhub}/>
                            <h2 style={{marginTop: 50}}>로그인</h2>
                          <LoginButton supplier={'naver'}/>
                          <LoginButton supplier={'google'}/>
                          <LoginButton supplier={'kakao'}/>
                          <LoginButton supplier={'apple'}/>

                          
                      </div>
                  </div>


            </div>
  );

  return login ? navigate('/') : loginPage;   // 쿠키가 있으면 -> '/'이동, 아니면 loginPage 재렌더링

}

export default LoginPage;

/*


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
  <button onClick={()=>{google()}} id='google' className='loginbtn'></button>
  <button onClick={()=>{kakao()}} id='kakao' className='loginbtn'></button>


  <div id="snowhub"></div>
*/


// tag안에 style을 집어넣은 이유 -> 단순해서
// 중복되는 컴포넌트는 따로 파일 생성.
// 나머지는 그냥 해당 파일 내에서 생성. 1회성 이미므로 굳이 따로 파일로 추출할 필요가 있나
// loginForm, sky, container = > @mediaquery에 의해서 동적으로 이미지가 변할 것이다. 그래서 style.css로 둔다.