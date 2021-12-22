import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import "firebase/compat/auth";
import "firebase/compat/functions";
import firebaseJson from '../../inc/firebase.json';

const FirebaseAuth = firebase.initializeApp(firebaseJson.config);
const Firestore = FirebaseAuth.firestore();
const CloudFunctions = FirebaseAuth.functions();

export {FirebaseAuth, Firestore, CloudFunctions}