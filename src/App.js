import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import Index from './Component/member/Index';
import Login from './Component/login/loginPage';
import PageNotFound from './Component/error/notFound';
import Logout from './Component/logout';
import BoardWrite from './Component/board/write/writePage';
import Test from './Component/board/write/upload';

import Gototest from './Component/member/dummy/axios1';


import BoardList from './Component/board/list/listPage';
import Quill from './Component/board/write/testQuill';
import Webboardwrite from './Component/board/write/writePage2';
import Boarddetail from './Component/board/detail/detail';

function App() {
  // <Route path='/login' element={<LoginControl></LoginControl>} ></Route>
  return(
    // Route에서 등록되지 않음 모든 것은 전부다 '*'으로 이동을 한다.
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Index></Index>}></Route>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/logout' element={<Logout></Logout>}></Route>
            <Route path='/board/write' element={<Webboardwrite></Webboardwrite>}></Route>
            <Route path='/board/list' element={<BoardList></BoardList>}></Route>
            <Route path='/board/detail/:id' element={<Boarddetail></Boarddetail>}></Route>
            
            <Route path='/token' element={<Gototest></Gototest>}></Route>
            <Route path='/quill' element={<Quill></Quill>}></Route>
            <Route path='test' element={<Test></Test>}></Route>
            <Route path='/board/test' element={<BoardWrite></BoardWrite>}></Route>

            <Route path='*' element={<PageNotFound></PageNotFound>}></Route> 
        </Routes>
    </BrowserRouter>
);


  /*
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
  */
}

export default App;
