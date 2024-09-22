import { styled } from "styled-components"


import seasonImg from "./image/category/web/season.png";
import smalltalkImg from "./image/category/web/smalltalk.png";
import shareImg from "./image/category/web/share.png";
import reviewImg from "./image/category/web/userafter.png";

import tmpSaveImg from "./image/save/tmpSave.png";
import saveImg from "./image/save/Save.png";

const imageList = {
    season:seasonImg,
    smalltalk:smalltalkImg,
    share:shareImg,
    review:reviewImg,
    tmpSave:tmpSaveImg,
    save:saveImg
};


const Btn = styled.button`
    background-size: 100%;
    width: ${props => props.category == "season" ? '86px' : '100px'};
    height: 33px;
    border:0; 
    background-image: url(${props => props.image});
`

// props = type  + func(함수)
function CategoryButton(props){


    const category = props.type; // type을 할경우 Button Tag의 type 속성으로 인식을 함.



    return(
        <Btn image={imageList[category]} onClick={props.func} category={category}/>
    )
}

export default CategoryButton;