// import "./styles.css";
import axios from "axios";
import React, { useEffect } from 'react';
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie, removeCookie } from "../../MangeCookies";

const BoardWrite = ()=>{
    const [title,setTitle] =  useState('');// 변경감지를 위한 변수 선언
    const [content,setContent] =  useState('');// 변경감지를 위한 변수 선언
    const [image,setImage] = useState('')

    const [login,setLogin] = useState('');

    const navigate = useNavigate();
    const textRef = useRef();

    const onSubmit = (e)=>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('title',title);
        formData.append('content',content);
        formData.append('image',image);

        axios.post('http://localhost:8000/board/write',formData,
        {
            //params: {name: name},
            headers: {Authorization: 'Bearer '+getCookie('IdTokenCookie'),
            "Access-Control-Allow-Origin": 'http://localhost:3000',
            'Access-Control-Allow-Credentials':"true",
            'Content-Type': 'application/json'
        }
        
        })
        .then(
            // 성공했을떄, 반환이 되는 값
            (Response) => {
            console.log(Response);
            alert(Response.data);
            
        }                
        )
        .catch(
            // 실패, 즉 에러가 발생했을떄 발생.
            (error) => {
                // 1. 인증되지 않은 토큰으로 접근을 한 경우, loginPage로 보내버리기
                if(error.response.data.error==='Failed to parse Firebase ID token. Make sure you passed a string that represents a complete and valid JWT. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.'){
                    
                    navigate('/login');
                }
                // 2. FirebaseToken이 맞으나, 만료가 된 경우, accessToken과 refreshToken 두개를 동시에 다시 한번 더 보내자.
                else if(error.response.data.error==='Firebase ID token has expired. Get a fresh ID token and try again. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.'){
                    console.log("do again");
                    axios.post('http://localhost:8000/board/write',formData,
                    {
                        //params: {name: name},
                        headers: {Authorization: 'Bearer '+getCookie('IdTokenCookie'),
                                  RefreshToken: 'Bearer '+getCookie('refreshTokenCookie'),
                        "Access-Control-Allow-Origin": 'http://localhost:3000',
                        'Access-Control-Allow-Credentials':"true",
                        'Content-Type': 'application/json'
                    }
                    
                    }
                    )
                    .then(
                        // 성공했을떄, 반환이 되는 값
                        (Response) => {
                        //console.log(Response);

                        //removeCookie('IdTokenCookie');
                        //removeCookie('refreshTokenCookie');
                        console.log('accessToken: '+Response.headers.accesstoken);
                        console.log('refreshToken: '+Response.headers.refreshtoken);

                        setCookie('IdTokenCookie',Response.headers.accesstoken);
                        setCookie('refreshTokenCookie',Response.headers.refreshtoken);
                        
                    }                
                    )
                }
                //console.log(error.headers);
                

            }
        );
    }

    const handleContent = (e,textRef)=>{
        setContent(e.target.value);
        console.log(content);
        textRef.current.style.height = `auto`;
        textRef.current.style.height = `${textRef.current.scrollHeight}px`;

    }

    const handleImage = (e)=>{
        const file = e.target.files[0];

        const reader = new FileReader();
        
        reader.readAsDataURL(file);// Base64Encoding -> 이미지를 문자열로 변환, binary -> ASCII 중  신뢰가능한 문자열만 사용

        // 파일 읽기를 성공적으로 완료했을 때 실행할 동작
        reader.onload = () => {
            setImage(reader.result);
           };
        

    }
    // 변경감지
    // 로그인을 한 경우 -> login=cookie
    useEffect(()=>{
        // idToken이 없다 -> login페이지로 이동.
        if(!getCookie('IdTokenCookie')){
            console.log(getCookie('IdTokenCookie'));
            //navigate('/login');
        }
    },[])


    

    return (
        <div id="body">

            <div id="header">
                <div id="x-bold"></div>
                <h2>내 게시글 올리기</h2>
            </div>
      
            <div id="photolayer">
                <div id="selectphoto" className="photo"></div>
                <div id="takephoto" className="photo"></div>
            </div>

            <div className="textlayer">
            <h3>카테고리</h3>

                <div className="category">
                    <div id="season" className="category_element"></div>
                    <div id="smalltalk" className="category_element"></div>
                    <div id="share" className="category_element"></div>
                    <div id="useafter" className="category_element"></div>
                </div>

                <form>

                    <label>
                        <h3>글 제목</h3>
                        <input type="text" name="title" onChange={(e)=>setTitle(e.target.value)} placeholder="최대 40자" />
                    </label>

                    <label>
                        
                        <h3>글 본문</h3>
                        <textarea ref={textRef} rows={1} name="content" onChange={(e)=>handleContent(e,textRef)} placeholder="최대 1000자" />
                    </label>
                    <br></br>
                    <br></br>
                    <div>
                        {image ? <img src={image}></img> : null}
                    </div>

                    <input type="file" onChange={(e)=>{handleImage(e)}}/>
                    
                </form>

            </div>
            
            <div id="btn">
                    <button className="btnSubmit" onClick={onSubmit}>작성 완료</button>
            </div>
             
        </div>      
    );

}
/*
    <form onSubmit={(e)=>onSubmit(e)}>
    <input type="submit" value="Submit" />
 */

/*
class BoardWrite extends React.Component{

    constructor(props){
        super(props);
        this.state={
          title:'',
          content:''
        };
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);


    }
    handleSubmit(event){
        console.log("ok!!!!");
        event.preventDefault();
        
        axios.get('http://localhost:8000/board/write',
        {
         'Access-Control-Allow-Origin': 'http://localhost:3000',
         'Access-Control-Allow-Credentials':"true",
         'content-type': 'application/json',
   
        })
       .then(function (response) {
             
            console.log('ok');
             
       })
       .catch(function (error) {
         // 에러 핸들링
         console.log(error);
       })
       ;
         

    }

    handleChange(event){
        this.setState(
            {
                [event.target.name] : event.target.value
            }
        );

    }

    render(){
        return(
            <div>

                <div id="header">
                    <div id="x-bold"></div>
                    <h2>내 게시글 올리기</h2>
                </div>

                <h2>내 게시글 올리기</h2>
                    
                <div>
                    <h3>사진 넣는 곳</h3>
                </div>

                <h3>카테고리</h3>
                <div>
                    [시즌방] [스몰토크] [정보 공유] [사용후기]
                </div>

                <form onSubmit={this.handleSubmit}>

                    <label>
                        <h3>글 제목</h3>
                        <input type="text" value={this.state.title}  name="title" onChange={this.handleChange} />
                    </label>

                    <label>
                        
                        <h3>글 본문</h3>
                        <textarea value={this.state.content}  name="content" onChange={this.handleChange} />
                    </label>

                    <input type="submit" value="Submit" />
                </form>



                
            </div>
            
                 
        );

    } 

    


}
*/

export default BoardWrite;