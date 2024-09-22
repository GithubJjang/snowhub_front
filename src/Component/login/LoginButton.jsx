import { styled } from "styled-components";

import googleImg from "./images/google_login.png";
import kakaoImg from "./images/kakao_login.png";
import naverImg from "./images/naver_login.png";
import appleImg from "./images/apple_login.png";

const loginUrl = {
    google:'https://accounts.google.com/o/oauth2/v2/auth?client_id=477737423484-bdni5k16hncmbpcccl3ff9bqgq50c2fm.apps.googleusercontent.com&redirect_uri=http://localhost:8000/auth/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=offline&prompt=consent',
    kakao:'https://kauth.kakao.com/oauth/authorize?client_id=fcc716b8e5ae872c9c4ca01b821f3dea&redirect_uri=http://localhost:8000/auth/kakao&response_type=code&prompt=login',
    naver:'null',
    apple:'null'
}

const imageUrl = {
    google:googleImg,
    kakao:kakaoImg,
    naver:naverImg,
    apple:appleImg
}

const Button = styled.button`
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 260px;
    height: 40px;  
    margin-bottom: 10px;
    background-image: url(${props => props.image});
    border: none;
    cursor: pointer;
    
`

function LoginButton(props){


    const image = imageUrl[props.supplier];

    const loginHandler = (supplier)=>{ // supplier = oauth 제공업체
        const url = loginUrl[supplier];
        window.open(url);
    }

    return(
        <Button onClick={()=>{loginHandler(props.supplier)}} image={image} ></Button>
        
    )
}

export default LoginButton;

// 굳이 복잡하게 전부다 style.css에 몰아넣을 필요가 있을까? 차라리 스타일 컴포넌트를 쓰자.
// <button onClick={()=>{loginHandler(props.supplier)}} id={props.supplier} className='loginbtn'></button>