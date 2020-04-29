import * as firebase from "firebase/app";
import 'firebase/firestore';
import "firebase/auth";
import {config} from './firebase-config';

const FirebaseAuth = firebase.initializeApp(config);
const Firestore = FirebaseAuth.firestore();

export {FirebaseAuth, Firestore}