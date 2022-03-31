import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";
import {combineReducers, createStore} from "redux";
import {firebaseReducer,   ReactReduxFirebaseProvider,} from "react-redux-firebase";
import {createFirestoreInstance, firestoreReducer} from "redux-firestore";
import {Provider} from "react-redux";
import 'firebase/firestore'

require('dotenv').config()


/*const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};*/

const firebaseConfig = {
  apiKey: "AIzaSyC611rYFM-MLtlmbSQSb-4x2kqj8uyz6Xg",
  authDomain: "projet-iot-coding.firebaseapp.com",
  projectId: "projet-iot-coding",
  storageBucket: "projet-iot-coding.appspot.com",
  messagingSenderId: "562871965807",
  appId: "1:562871965807:web:6e8eef2ba7aa8ce29fd59a"
};

const rrfConfig = {
  userProfile: 'questions',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer
})

const initialState = {}
const store = createStore(rootReducer, initialState)
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}

ReactDOM.render(
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <App/>
      </ReactReduxFirebaseProvider>
    </Provider>,
  document.getElementById('root')
);



export default db;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
