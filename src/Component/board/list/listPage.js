import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';

import { getCookie } from "../../MangeCookies"
import  Header_comp  from "../../pageheader/hearder"
import "../../pageheader/header.css"
import "./list.css"
// 실행순서: 빈배열 렌더링 -> useEffect ->list에 변경감지 -> list와 관련된 부분 재랜더링
const BoardList = ()=>{
    const [list,setList] = useState('');
    const [page,setPage] = useState(0); // 첫페이지는 항상 0
    const [total,setTotal] = useState('');
    const [category,setCategory] = useState('all');

    const pagination = ()=>{
        const prefix = parseInt(page/5)*5;
        console.log("pre: "+prefix);
        const buttonList = [];
        let i=0
        while(i<5){
            if(i+prefix>=total){
                break;
            }

            buttonList.push(<button className="page_btn" key={i+prefix} onClick={(e)=>{setPage(e.target.value)}} value={i+prefix}>{i+prefix}</button>);
            i++;
        }

        const gotoNext = (
            prefix+5>total ? null : <button className="page_btn" onClick={()=>{setPage(prefix+5)}}>{">"}</button>
        )

        const gotoPre = (
            prefix-5>=0 ? <button className="page_btn" onClick={()=>{setPage(prefix-5)}}>{"<"}</button> : null
            
        )
        
        /*
            {weekArr.map((week, index) => (
            <span key={index}>
            {week}
            </span>
        ))}
        */
        // 이전 페이지네이션으로 이동
        // 다음 페이지네이션으로 이동()
        const component = (

            <div id="pagination">
                <div id="pagination_bar">
                    <div>{gotoPre}</div>
                    <div></div>
                    {buttonList.map((number,index) => (
                        <div key={index}>
                            {number}
                        </div>
                    ))
                    }
                    <div></div>
                    <div>{gotoNext}</div>
                </div>
            </div>

        );
        return component;
        
    }

    const lists = () => {
        const result = [];
        for (let i = 0; i < list.length; i++) {
          result.push(
                      <div key={i} className="content">
                            <Link to={`/board/detail/${list[i].id}`}><div className="c">{list[i].category}</div></Link>
                            <Link to={`/board/detail/${list[i].id}`}><div className="c_title">{list[i].title}</div></Link>
                            <Link to={`/board/detail/${list[i].id}`}><div className="c">{list[i].writer}</div></Link>
                            <Link to={`/board/detail/${list[i].id}`}><div className="c">{list[i].createDate}</div></Link>
                            <Link to={`/board/detail/${list[i].id}`}><div className="c">{list[i].count}</div></Link>
                      </div>);
        }
        return result;
      };

    // deps에 특정값을 넣게 되면 컴포넌트가 mount 될 때 -> 지정한 값이 업데이트될 때 useEffect를 실행합니다.
    useEffect(()=>{
        console.log(category);
        axios.get('http://localhost:8000/board/list?page='+page+'&category='+category,
        {
                //params: {name: name},
                headers: {Authorization: 'Bearer '+getCookie('IdTokenCookie'),
                "Access-Control-Allow-Origin": 'http://localhost:3000',
                'Access-Control-Allow-Credentials':"true",
                'Content-Type': 'application/json'
            }
        }
        )
        .then(
            
            // 성공했을떄, 반환이 되는 값
            (Response) => {
            //console.log(Response.data);
            const tmpArray = Response.data;
            const getTotalPage = tmpArray.pop();
            setTotal(getTotalPage.id);  
            setList(tmpArray);
            console.log(tmpArray);
        }                
        ).catch(
            // 실패, 즉 에러가 발생했을떄 발생.
            (error) => {}
            )
    },[page,category])


    const body=(
        <div id="community_body">
            <h2>Community</h2>
            <div id="select">
                <button className="select_component" value={"all"} onClick={(e)=>{setCategory(e.target.value); setPage(0)}}>[모든 게시글]</button>
                <button className="select_component" value={"Season"} onClick={(e)=>{setCategory(e.target.value); setPage(0)}}>[시즌방]</button>
                <button className="select_component" value={"smallTalk"} onClick={(e)=>{setCategory(e.target.value); setPage(0)}}>[스몰토크]</button>
                <button className="select_component" value={"Share"} onClick={(e)=>{setCategory(e.target.value); setPage(0)}}>[정보공유]</button>
                <button className="select_component" value={"Review"} onClick={(e)=>{setCategory(e.target.value); setPage(0)}}>[사용후기]</button>
            </div>

            <div id="boardlist">
                <h2 id="boardlist_1">모든 게시글</h2>

                <div id="boardlist_2">
                    <div id="first" className="element1">제목</div>
                    <div className="element1">작성자</div>
                    <div className="element1">작성일</div>
                    <div className="element1">조회수</div>
                </div>

                <div className="content_conatiner">
                    {lists()}
                </div>    

            </div>
            
            {pagination()}

        </div>
    );

    return (
        
            <div>
                {Header_comp()}
                {body}
            </div>
        
    );
}


export default BoardList;