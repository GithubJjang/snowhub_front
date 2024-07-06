
const Header_comp = ()=>{

    const element = (
        <div id="header">
            <div id ="header_body">
                <div id="logo">Snow Hub</div>
                <button id="slope" className="header_component">스키장별 슬로프</button>
                <button id="community" className="header_component">커뮤니티</button>
                <button id="signup" className="header_component">회원가입</button>
            </div>
        </div>
    )
    return element;
}
export default Header_comp;