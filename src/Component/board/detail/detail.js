import "../../pageheader/header.css"
import "./detail.css"

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCookie } from "../../MangeCookies";
import Header_comp from "../../pageheader/hearder";

const Boarddetail= ()=>{

    // board와 관련된 variable
    const boardId = useParams();

    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    const [date,setDate] = useState('');
    const [category,setCategory] = useState('');
    const [writer,setWriter] = useState('');
    const [count,setCount] = useState(0);
    
    // reply와 관련된 variable
    const [option,setOption] = useState('recent'); // 최신순으로? 등록순으로?
    const [reply,setReply] = useState('');
    const [replylist,setReplylist] = useState('');

    // 댓글 등록후, 재랜더링을 위한 변수
    const [refix,setRefix] = useState(0);

    // 재랜더링이 될때마다, 백엔드에서 count가 계속 올라감 이를 방지하기 위한 변수
    // 최초 전송시에만 1 그 이후는 0
    const [number,setNumber] = useState(1);

    // 답글 등록
    const [comment,setComment] = useState('');
    const [arr,setArr] = useState([]);

    const [cmt,setCmt] = useState([]);


    useEffect(()=>{
        console.log("useEffect");
        console.log(number);


        // 게시글 여닫이를 위한 설정.
        const test = new Array(replylist.length).fill(false);
        setArr(test);

        //
        const init = new Array(replylist.length).fill(false);
        setCmt(init);


        
        


        // Default: 최신순을 가져오자.
        axios.get('http://localhost:8000/board/detail?id='+boardId.id+'&number='+number,
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
            setTitle(Response.data.boardDTO.title);
            setContent(Response.data.boardDTO.content);
            setDate(Response.data.boardDTO.createDate);
            setCategory(Response.data.boardDTO.category);
            setWriter(Response.data.boardDTO.writer);
            setCount(200);

            const tmpArray = Response.data.replyDTO;
            setReplylist(tmpArray);
            setRefix(1);// 변경감지를 위한 트리거.
            setNumber(0);
            
        }                
        )
        .catch( // 실패, 즉 에러가 발생했을떄 발생.
            (error) => {
                console.log(error)
            }
        )
    }
    ,[refix])

    // option에 맞게 Reply를 가져오기 위한 설정
    const getReply = (option)=>{
        setOption(option);
    }

    const recentBtn = <button onClick={()=>{getReply('recent')}}>최신순</button>
    

    const enrollBtn = <button onClick={()=>{getReply('enroll')}}>등록순</button>

    const sendReply = ()=>{
        
        setRefix(0);

        const formdata = new FormData();
        formdata.append('boardId',boardId.id+'');
        formdata.append('reply',reply);

        axios.post('http://localhost:8000/board/reply',formdata,
                {
                    //params: {name: name},
                    headers: {Authorization: 'Bearer '+getCookie('IdTokenCookie'),
                    "Access-Control-Allow-Origin": 'http://localhost:3000',
                    'Access-Control-Allow-Credentials':"true",
                    'Content-Type': 'application/json'
                }
            }
        ).then( // 성공했을떄, 반환이 되는 값
        (Response) => {
            console.log(Response.data);
        }                
        )
        .catch( // 실패, 즉 에러가 발생했을떄 발생.
            (error) => {
                console.log(error)
            }
        )

    }

    // 답글을 등록하기 위한 컴포넌트.
    const sendComment = (replyId)=>{

        

        const formdata = new FormData();
        formdata.append('comment',comment);
      
        axios.post('http://localhost:8000/board/comment?id='+replyId,formdata,
                {
                    //params: {name: name},
                    headers: {Authorization: 'Bearer '+getCookie('IdTokenCookie'),
                    "Access-Control-Allow-Origin": 'http://localhost:3000',
                    'Access-Control-Allow-Credentials':"true",
                    'Content-Type': 'application/json'
                }
            }
        ).then( // 성공했을떄, 반환이 되는 값
        (Response) => {
            console.log(Response.data);
        }                
        )
        .catch( // 실패, 즉 에러가 발생했을떄 발생.
            (error) => {
                console.log(error)
            }
        )
        

    }


    // 버튼을 클릭하면 실행.
    const convert = async (index,replyId)=>{

        // 답글을 달기 위한 목적. 각 답글 컴포넌트에 대해서 값을 할당한다.
        // 복사 -> 변경 -> setArr
        let copy=[...arr];

        if(arr[index]===false){
            // arr[index]=='true'
            copy[index]=true;
        }
        else{
            copy[index]=false;
        }
        
        setArr(copy);

        try{
            const response = await axios.get('http://localhost:8000/board/reply/comment?id='+replyId,
                    {
                        //params: {name: name},
                        headers: {Authorization: 'Bearer '+getCookie('IdTokenCookie'),
                        "Access-Control-Allow-Origin": 'http://localhost:3000',
                        'Access-Control-Allow-Credentials':"true",
                        'Content-Type': 'application/json'
                    }
                }
            );
            let copycmt=[...cmt];

            copycmt[index]=response.data;

            setCmt(copycmt);
            /*

            if(cmt[0]===false){
                console.log('not yet');
            }
            else{
                console.log(cmt[0][0].comment);
            }
            */
            
            } 
            catch(error){
            console.error(error);
            }

        // 그리고 해당 reply에 대한 comment를 뿌리자.
        /*
       axios.get('http://localhost:8000/board/reply/comment?id='+replyId,
                {
                    //params: {name: name},
                    headers: {Authorization: 'Bearer '+getCookie('IdTokenCookie'),
                    "Access-Control-Allow-Origin": 'http://localhost:3000',
                    'Access-Control-Allow-Credentials':"true",
                    'Content-Type': 'application/json'
                }
            }
        ).then( // 성공했을떄, 반환이 되는 값
        (Response) => {
            // 각 comments List를 저장하기
            let copycmt=[...cmt];

            copycmt[index]=Response.data;

            setCmt(copycmt);
            //console.log(cmt[0][0].comment)

            }                
        )
        .catch( // 실패, 즉 에러가 발생했을떄 발생.
            (error) => {
                console.log(error)
            }
        )
        */

    }

    // 저장 따로 답글 뿌리는거 따로
    const particle = (index)=>{

        console.log(cmt);
        const result = [];

        try{
            
            for(let i = 0; i < cmt[index].length; i++){
                result.push(<div key={i}>{cmt[index][i].comment}</div>);
            }  
            
        }
        catch(e){
        }

        return result;

        

    }


    // Replylist Component
    const Replylist = ()=>{
        const result = [];

        for(let i = 0; i < replylist.length; i++) {

            // particle에서 랜더링시 겪은 문제 <- 항상 처음에 데이터를 뿌릴때 undefined라는 문제가 발생을 한다
            // 그러면 예외처리로 해결을 하자. undefine오류가 발생하면 무시하고 아무것도 안보여준다.
            // 그러면 

            result.push(
                
                        <div key={i}>
                            <div className="reply-element">
                                <div className="e">{replylist[i].name}</div>
                                <div className="e">{replylist[i].createDate}</div>
                                <div className="e">{replylist[i].content}</div>
                                <div className="e">{replylist[i].id}</div>
                                <div>{particle(i)}</div> 

                            
                                <button onClick={()=>{convert(i,replylist[i].id)}}>{arr[i]===false?'답글달기':'숨기기'}</button>
                                { arr[i]===true &&   <div>
                                    <textarea className="comment" onChange={(e)=>{setComment(e.target.value)}} placeholder="답글쓰세요"></textarea>
                                    <button onClick={()=>{sendComment(replylist[i].id)}}>답글등록</button>
                                </div>}



    
        
                                    


                            </div>
                        </div>);
            }
            return result;
        }



    const page = 
    (
        <div>
            {Header_comp()}

            <div id="detail-body">
                <h2>{"<"} Community | 모든 게시글 </h2>

                <div id="detail-container">

                   <div id="detail-title">
                        <div id="title-element1"><h2>{title}</h2></div>
                        <div id="title-element2">{category}</div>
                   </div>

                   <div id="detail-content">
                        <p id="content" dangerouslySetInnerHTML={{__html: content}}></p>          
                   </div>

                   <div id="detail-bottom">
                    <div id="detail-bottom-element1">
                        {writer} | {date}
                    </div>
                    <div id="detail-bottom-element2">
                        {count}
                    </div>
                   </div>
        
                   <div id="blue-bar">
                    <div id="blue-bar-e1">댓글 3</div>
                    <div id="blue-bar-e2" className="btn">{recentBtn}</div>
                    <div id="blue-bar-e3" className="btn">|</div>
                    <div id="blue-bar-e4" className="btn">{enrollBtn}</div>
                   </div>

                   <div id="reply">
                    
                    {Replylist()}
                    <textarea placeholder="댓글을 작성해보세요" onChange={(e)=>{setReply(e.target.value)}}></textarea>
                    <button onClick={()=>{sendReply()}}>댓글 등록</button>
                    
                   </div>
                

                </div>

            </div>

        </div>
    );

    return page;
}

export default Boarddetail;

// dangerouslySetInnerHTML -> InnerHtml XSS공격에 취약. 추후 대체제 찾을 것!
// textarea를 잡아줄 div태그가 필요하다. div 안하면 크기 조정을 할 수 없다.