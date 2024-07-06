import "./write.css";
//import Editor from "./Editor";

import React, { modules, formats, useState, useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getCookie, setCookie } from '../../MangeCookies';
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import ImageResize from 'quill-image-resize';
import axios from 'axios';
Quill.register('modules/ImageResize', ImageResize);



const Webboardwrite = ()=>{

    // 외부로 꺼내 전역변수처럼 사용을 하자.
    const [content,setContent] =  useState('');// 변경감지를 위한 변수 선언
    const [title,setTitle] = useState('');
    const [category,setCategory] = useState('');
    console.log('category: '+category);

    const navigate = useNavigate();
    // ReactQuill: 여기서 복잡하더라도 추가를 해야 버튼을 원하는 위치에 붙일수 있음. 아니면 할 방법이x( title, content 어떻게 반환??? )
    const Editor = ()=> {

        //const [content,setContent] =  useState('');// 변경감지를 위한 변수 선언
        //const [title,setTitle] = useState('');
        
      
        const quillRef = useRef(null);
      
        console.log('title: '+title);
        console.log('content: '+content);
      
        const toolOptions = [
          [{ 'header': [1, 2, false] }],
          [{ 'color': [] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ];
      
        modules = {
          toolbar: {
            container : toolOptions
          },
      
          ImageResize: {
            parchment: Quill.import('parchment')
          }
        };
      
        formats = [
          'header','color',
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet', 'indent',
          'link', 'image'
        ];
        /* 어떤 변수에 변경감지가 되야! 함수가 실행이 된다.*/
      
        
      
      
      
        useEffect(()=>{
                  // 이미지를 처리하기 위한 함수
              // base64 인코딩 방식은 너무 길기 때문에 부적합

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
              
      
              // 1. toolbar에 등록 -> 2.toorbar에서 image 클릭시 하위 코드 활성화
              const handleImage = () => {
                console.log("activated");
                const input = document.createElement('input'); // input 요소를 생성
                input.setAttribute('type', 'file'); // 어트리뷰터 설정 1
                input.setAttribute('accept', 'image/*'); // 어트리뷰터 설정 2
                input.click(); // 파일 선택 대화 상자를 열기 위해 <input> 요소를 클릭


                // 대화 상자에서 이미지 선택이 완료되면 실행되는 함수
                input.onchange = async () => {
                    // input.files과 Quill 편집기(quillRef.current)가 존재하는지 확인
                    // 하나라도 존재하지 않으면 함수 종료
                    if (!input.files || !quillRef.current) return;
      
                    // 선택된 파일을 변수에 file 변수에 넣어줌
                    const file = input.files[0];
              
                    const storage = getStorage();
      
                    console.log(file);
                    // Upload file and metadata to the object 'images/mountains.jpg'
                    const storageRef = ref(storage, file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    const range = quillRef.current.getEditor().getSelection(true);
      
                    // Listen for state changes, errors, and completion of the upload.
                    uploadTask.on('state_changed',
                      (snapshot) => {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                          case 'paused':
                            console.log('Upload is paused');
                            break;
                          case 'running':
                            console.log('Upload is running');
                            break;
                        }
                      }, 
                      (error) => {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                          case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            console.log(error.code)
                            break;
                          case 'storage/canceled':
                            // User canceled the upload
                            console.log(error.code)
                            break;
      
                          // ...
      
                          case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            console.log(error.code)
                            break;
                        }
                      }, 
                      () => {
                        // Upload completed successfully, now we can get the download URL
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                          console.log('File available at', downloadURL);
                          quillRef.current.getEditor().insertEmbed(range.index, 'image', downloadURL);
                        });
                      }
                      // 사용자가 만약 하나의 이미지를 여러번 올릴 경우 -> 이미지는 1개 거기에 대한 참조는 여러개
                      // 만약 사용자가 해당 이미지를 지웠다. 그래서 firebase에서도 삭제했다.
                      // 그렇게 하면, 해당 이미지를 참조하는 나머지 이미지에 문제가 발생한다.
                      // 그 하나의 이미지만 삭제를 했는데, 나머지 동일 이미지들은 참조를 잃는다. 그래서 불러오기 불가능
                      // 용량에 손해가 있더라도, 그냥 냅두자.
                    );
                      // <- quillDummy
                };
            };
            
            // 툴바에 handleImage 함수 등록
            if (quillRef.current) {
                const toolbar = quillRef.current.getEditor().getModule('toolbar');
                toolbar.addHandler('image', handleImage);
                //console.log("on");
            }
      },[]);
      
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
    const Send = ()=>{
        //console.log("send");
        //console.log(content);
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
      
      }

    const tmpSave = ()=>{
       //console.log("send");
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

    };

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



                    <div id="innerbox">
                        <div><h2>나의 게시글 작성하기</h2></div>
                        {Editor()}
                        
                    </div>

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
                        </div>
                    </div>
                    



                </div>
            </div>
        </div>
    );

    return page;

}

export default Webboardwrite;

                        {/*
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
                        */}