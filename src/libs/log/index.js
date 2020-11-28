import { FirebaseAuth } from "../../components/FirebaseAuth/firebase";

export const log = (action, callback) => {
    const Firestore = FirebaseAuth.firestore();
    const currentUser = FirebaseAuth.auth().currentUser;

    const dt = new Date();
    const data ={
        'action': action,
        'time': dt
    }
    const userDocRef = Firestore.collection('users').doc(currentUser.uid);
    userDocRef.collection('activities').doc(''+dt.getTime()).set(data).then(() => {
        if(callback){
            callback(true);
        }
    }).catch(err => {
        if(callback){
            callback(false);
        }
    });
}
export const SIGN_IN = 'signed in';
export const UPDATE_PASSWORD = 'changed password';
export const UPDATE_USERNAME = 'changed user name';
export const UPDATE_PHONE = 'changed phone number';
export const UPDATE_EMAIL = 'changed email address';
export const SIGN_OUT = 'signed out';