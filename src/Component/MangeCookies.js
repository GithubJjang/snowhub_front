import { Cookies } from "react-cookie"

const cookies = new Cookies();

function setCookie(name,value){
    return cookies.set(name,value,{path : '/'});
}

function getCookie(name){
    return cookies.get(name);
}

function removeCookie(name){
    cookies.remove(name,{path : '/'});
    console.log('successfully delete '+name);
}

export {setCookie,getCookie,removeCookie};