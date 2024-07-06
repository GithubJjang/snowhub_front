/*
class Loginproto extends React.Component{
    constructor(props){
        super(props);
        this.state={
          isLoggedIn : getCookie('IdTokenCookie')
        };

        this.Kakao=this.Kakao.bind(this);
        this.Google=this.Google.bind(this);
        this.Logouthandler=this.Logouthandler.bind(this);
    }


    Kakao(){
        console.log("Do Kakao Login");
        // KaKao API로 요청보내기
        const url = 'https://kauth.kakao.com/oauth/authorize?client_id=fcc716b8e5ae872c9c4ca01b821f3dea&redirect_uri=http://localhost:8000/auth/kakao&response_type=code&prompt=login';
        window.open(url);
    }

    Google(){
        console.log("Do Google Login");
        // Google API로 요청보내기
        const url = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=477737423484-bdni5k16hncmbpcccl3ff9bqgq50c2fm.apps.googleusercontent.com&redirect_uri=http://localhost:8000/auth/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=offline&prompt=consent';
        window.open(url);
    }
    Naver(){

    }
    Apple(){

    }

    OauthLoginControl(){
      return(
        <div>
          <button><div  className="e2314_8"></div></button>
          <button onClick={this.Google}><div  className="e2314_9"></div></button>
          <button onClick={this.Kakao}><div  className="e2314_10"></div></button>
        </div>
      );
    }

    Logouthandler(){
      // 모든 쿠키 삭제.
      // logout하면 -> isLoggedIn은 true로 바뀜 -> 변경감지를 통해서, Oauth는 사라짐.
      console.log("logout exectue");
      removeCookies();
      // 쿠키 삭제.  
      console.log("remove");
      this.setState(
          {
              isLoggedIn : getCookie('IdTokenCookie')
          }
      );
    }

    LoginPage(){
      // <div className="loginbtn" style={{backgroundImage: 'url(/login/kakao_login.png)'}}></div>
      return(
            <div>
              <meta charSet="utf-8"/>
              <meta name="viewport" content="width=device-width,initial-scale=1" />
        
              <div>
                  <div id="container">
                      
                      <div id="sky"></div>
                      
                      <div id="loginForm">
                          <div id="snowhub"></div>
                          <div id="label">
                              <h2>로그인</h2>
                          </div>
                          
                          <button onClick={this.Kakao} id='kakao' className='loginbtn'></button>
                          <button onClick={this.Naver} id='naver' className='loginbtn'></button>
                          <button onClick={this.Apple} id='apple' className='loginbtn'></button>
                          <button onClick={this.Google} id='google' className='loginbtn'></button>
                          
                      </div>
                  </div>

              </div>
            </div>
      )
    }

    // cookie가 있는 경우는 해당 login페이지 접근을 해도, index로 강제 redirect를 시킨다.
    render(){
      return(
        //this.state.isLoggedIn ? <Navigate to= '/'/> : this.LoginPage()
        this.LoginPage() 
      );
      
    }

}
*/