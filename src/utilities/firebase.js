// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8EGyQAXd_xbr0lmCYM7Zs-2m0itPajys",
  authDomain: "smart-context-stories.firebaseapp.com",
  databaseURL: "https://smart-context-stories-default-rtdb.firebaseio.com",
  projectId: "smart-context-stories",
  storageBucket: "smart-context-stories.appspot.com",
  messagingSenderId: "544403798979",
  appId: "1:544403798979:web:54f7dde57e2f1e9d915b76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);