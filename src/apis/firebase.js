// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTLAv6wGA--ago8nUor445hdho3eIvqnA",
  authDomain: "authfirewithspringboot.firebaseapp.com",
  projectId: "authfirewithspringboot",
  storageBucket: "authfirewithspringboot.appspot.com",
  messagingSenderId: "477737423484",
  appId: "1:477737423484:web:d5afec2df2a5c2e3bbaff9",
  measurementId: "G-5FXBC2P096"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
//const analytics = getAnalytics(app);
export {app,storage};