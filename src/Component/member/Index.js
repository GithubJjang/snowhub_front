import { getCookie,setCookie } from "../MangeCookies";

function Index(){

    const IdTokenCookie = getCookie('IdTokenCookie');
    const refreshTokenCookie = getCookie('refreshTokenCookie');

    console.log('IdToken: '+IdTokenCookie);

    

    return(
        <div>
            <h1> Index Page </h1>
            IdToken : {IdTokenCookie}<br/>
            <br></br>
            RefershToken : {refreshTokenCookie}<br/>
        </div>
    );
}

export default Index;