// Import the functions you need from the SDKs you need
import { initializeApp, getApps ,getApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9pbOu74H3jC6kDjtb2JiY6pSwqJcFrEU",
  authDomain: "instagram-clone-8b07f.firebaseapp.com",
  projectId: "instagram-clone-8b07f",
  storageBucket: "instagram-clone-8b07f.appspot.com",
  messagingSenderId: "546203975555",
  appId: "1:546203975555:web:ed252bd1b8d679a91580b6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp;
const db = getFirestore();
const storage = getStorage();

export {app , db , storage};