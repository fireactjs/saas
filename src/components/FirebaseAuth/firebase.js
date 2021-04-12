import firebase from "firebase/app";
import 'firebase/firestore';
import "firebase/auth";
import "firebase/functions";
import {config} from './firebase-config';

const FirebaseAuth = firebase.initializeApp(config);
const Firestore = FirebaseAuth.firestore();
const CloudFunctions = FirebaseAuth.functions();

export {FirebaseAuth, Firestore, CloudFunctions}