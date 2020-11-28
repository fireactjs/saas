import { FirebaseAuth } from "../../components/FirebaseAuth/firebase";
import { log, SIGN_IN, SIGN_OUT, UPDATE_USERNAME } from '../log';

export const userSignIn = (callback) => {
    var dt = new Date();
    const Firestore = FirebaseAuth.firestore();
    const currentUser = FirebaseAuth.auth().currentUser;
    
    const userDocRef = Firestore.collection('users').doc(currentUser.uid);
    userDocRef.get().then(doc => {
        if(doc.exists){
            // update user document
            userDocRef.set({
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                lastLoginTime: dt
            },{merge: true}).then(() => {
                
                callback(true);
            }).catch(err => {
                console.log(err);
                callback(false);
            });
        }else{
            // create user document
            userDocRef.set({
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                creationTime: dt,
                lastLoginTime: dt
            }).then(() => {
                callback(true);
            }).catch(err => {
                console.log(err);
                callback(false);
            });
        }
    });
    log(SIGN_IN);
}

export const userSignOut = () => {
    log(SIGN_OUT, (result) => {
        // wait for log is successfully written before signing out
        if(result){
            FirebaseAuth.auth().signOut();
        }
    });   
}

export const userUpdateName = () => {
    const Firestore = FirebaseAuth.firestore();
    const currentUser = FirebaseAuth.auth().currentUser;

    const userDocRef = Firestore.collection('users').doc(currentUser.uid);
    userDocRef.set({
        displayName: currentUser.displayName
    },{merge: true});
    log(UPDATE_USERNAME);
}