import "./write.css";
//import Editor from "./Editor";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getCookie, setCookie } from '../../MangeCookies';
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import ImageResize from 'quill-image-resize';
import axios from 'axios';
import CategoryButton from "./CategoryButton"
import SaveButton from "./SaveButton";
import ImageHandler  from "./ImageHandler";

import {FooterContainer,FooterCategory,FooterSaveBtn} from "./Footer"; // Footer Deco Components

Quill.register('modules/ImageResize', ImageResize);



const toolOptions = [
  [{ 'header': [1, 2, false] }],
  [{ 'color': [] }],
  ['bold', 'italic', 'underline','strike', 'blockquote'],
  [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
  ['link', 'image'],
  ['clean']
];

// Quill을 위한 설정정보
const modules = {
  toolbar: {
    container : toolOptions
  },

  ImageResize: {
    parchment: Quill.import('parchment')
  }
};

const formats = [
  'header','color',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];
/* 어떤 변수에 변경감지가 되야! 함수가 실행이 된다.*/

const Webboardwrite = ()=>{

    // 외부로 꺼내 전역변수처럼 사용을 하자.

    // 리액트에서는 input과 같이 uncontrolled 하는 것은 항시 초기화를 하려고 한다.
    const [content,setContent] =  useState('');// 변경감지를 위한 변수 선언
    const [title,setTitle] = useState('');
    const [category,setCategory] = useState('');

    const quillRef = useRef(null); // 현재값을 초기화. useRef가 변한다고 재렌더링 안함 <- 렌더를 안할 요소에 대해서 사용하자.

    const navigate = useNavigate();
    // ReactQuill: 여기서 복잡하더라도 추가를 해야 버튼을 원하는 위치에 붙일수 있음. 아니면 할 방법이x( title, content 어떻게 반환??? )



            useEffect(()=>{ // 첫 마운트시에만 활성이 된다. 왜냐하면 이 기능은 항상 유지됨.
              if (quillRef.current) {
                console.log("add ImgHandler");
                const toolbar = quillRef.current.getEditor().getModule('toolbar');
                toolbar.addHandler('image', ()=>{ImageHandler(quillRef)}); // 익명함수 안쓰면 Click이 아닌 항상 activate로 간주를 한다.
            }
            },[])


            // useEffect 설정 수정할 필요가 있다. 일정시간이 지나면 지가 알아서 save를 한다.
            useEffect(()=>{
              // 이미지를 처리하기 위한 함수
              // base64 인코딩 방식은 너무 길기 때문에 부적합 -> Firebase Storage를 쓰자.


              axios.get('http://localhost:8000/board/tmp',
                      {
                        //params: {name: name},
                        headers: {Authorization: 'Bearer '+getCookie('IdTokenCookie'),
                        "Access-Control-Allow-Origin": 'http://localhost:3000',
                        'Access-Control-Allow-Credentials':"true",
                        'Content-Type': 'application/json'
                    }
                }
              )
              .then( // 성공했을떄, 반환이 되는 값
                  (Response) => {
                  console.log(Response.data);

                  setTitle(Response.data.title);
                  setContent(Response.data.content);
                  setCategory(Response.data.category);
                  
              }                
              )
              .catch( // 실패, 즉 에러가 발생했을떄 발생.
                  (error) => {
                      console.log(error)
                  }
              )
            },[]);
            
            
    const Editor = ()=> {

        console.log('title: '+title);
        console.log('content: '+content);
       
          return (
            <div id="boardwrite">
      
                <div id="title">
                    <input type="text" name="title" onChange={(e)=>{setTitle(e.target.value)}} value={title} placeholder="제목을 입력하세요"/>
                </div>
      
                <div id="content">
                   
                    <ReactQuill 
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                placeholder="남기고 싶은 기록을 자유롭게 적어주세요."
                                value={content}
                                onChange={(e)=>{setContent(e)}}
                                ref={quillRef}
                                >
                    </ReactQuill>
                  
                    
                </div>
      
            </div>
            
            
             
          );
            // 익명함수를 변수선언한 후, 괄호를 붙이면 바로 실행이 된다.
      
      }
    // 전송 컴포넌트
    const sendCallback = useCallback((title,content,category)=>{
        console.log("send");

        const formData = new FormData();
        formData.append('title',title);
        formData.append('content',content);
        formData.append('category',category);
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
      
      },[])
    const tmpSaveCallback = useCallback((title,content,category)=>{ // 그거 컴포넌트 destroy써봐야겠다.
        console.log("tmp");


        //console.log(content);
        const formData = new FormData();
        formData.append('title',title);
        formData.append('content',content);
        formData.append('category',category);
        axios.post('http://localhost:8000/board/tmp',formData,
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
            console.log(content);
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
    ,[]);

    // 결과물 페이지 반환
    const page = 
    (
        <div>
            <div id="header">
                <div id ="header_body">
                    <div id="logo">Snow Hub</div>
                    <button id="slope" className="header_component">스키장별 슬로프</button>
                    <button id="community" className="header_component">커뮤니티</button>
                    <button id="signup" className="header_component">회원가입</button>
                </div>
            </div>

            <div id="community_body">
                <h2>{"<"} Community | 게시글 작성하기 </h2>
                <div id="bigbox">



                    <div style={{
                      marginLeft : "5%",
                      marginRight : "5%"
                    }}>
                        <h2>나의 게시글 작성하기</h2>
                        {Editor()}
                        
                    </div>

                    <FooterContainer>
                        <FooterCategory>
                            <CategoryButton type={"season"} func={()=>{setCategory('Season')}}/>
                            <CategoryButton type={"smalltalk"} func={()=>{setCategory('smallTalk')}}/>
                            <CategoryButton type={"share"} func={()=>{setCategory('Share')}}/>
                            <CategoryButton type={"review"} func={()=>{setCategory('Review')}}/>
                        </FooterCategory>
                        <FooterSaveBtn>
                            <SaveButton type="tmpSave" func={()=>{tmpSaveCallback(title,content,category)}}/>
                            <SaveButton type="save" func={()=>{sendCallback(title,content,category)}}/>
                        </FooterSaveBtn>
                    </FooterContainer>
                    



                </div>
            </div>
        </div>
    );

    return page;

}

export default Webboardwrite;

                        /*
                        <div id="whitebox1">
                            <div id="photolayer">
                                <div id="selectphoto" className="photo"></div>
                                <div id="takephoto" className="photo"></div>
                            </div>
                        </div>

                        <div id="boardwrite">
                            
                            <div id="title">
                                <input type="text" name="title" placeholder="제목을 입력하세요"/>
                            </div>
                            
                            <div id="content">
                                {Editor()}
                            </div>
                        </div>
                        */




                        // Footer에서의 category 선택 및 저장 버튼
                        /*
                                            <div id="footer">
                        <div id="footer_1">
                            <button id="season" className="footer_element" onClick={()=>{setCategory('Season')}}></button>
                            <button id="smalltalk" className="footer_element" onClick={()=>{setCategory('smallTalk')}}></button>
                            <button id="share" className="footer_element" onClick={()=>{setCategory('Share')}}></button>
                            <button id="useafter" className="footer_element" onClick={()=>{setCategory('Review')}}></button>
                        </div>
                        <div id="footer_2">
                            <div></div>
                            <button id="tmpSave" className="footer_element" onClick={tmpSave}></button>
                            <button id="Save" className="footer_element" onClick={Send}></button>
                            <Button type={"season"} func={()=>{setCategory('Season')}}></Button>
                            
                        </div>
                    </div>


                            <button id="tmpSave" className="footer_element" onClick={tmpSave}></button>
                            <button id="Save" className="footer_element" onClick={Send}></button>

                            ()=>{} <- 앞쪽 파라미터는 해당 컴포넌트의 event
                        */

                        