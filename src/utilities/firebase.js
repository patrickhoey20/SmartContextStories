// Import the functions you need from the SDKs you need
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, onValue, ref, update, set, push, remove } from "firebase/database";// TODO: Add SDKs for Firebase products that you want to use
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
const analytics = getAnalytics(app);

export const database = getDatabase();

export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => (
    onValue(ref(database, path), (snapshot) => {
     setData( snapshot.val() );
    }, (error) => {
      setError(error);
    })
  ), [ path ]);

  return [ data, error ];
};

export const writeToDb = (path, data) => {
  set(ref(database, path), data);
}