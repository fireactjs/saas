import React, { useEffect, useState } from "react";
import { FirebaseAuth } from "./firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState({
      'user': null,
      'checked': false
    });

    const [userData, setUserData] = useState({

    })
  
    useEffect(() => {
      FirebaseAuth.auth().onAuthStateChanged(function(user){
        if(user !== null){
          user.getIdToken().then(token => {
            setAuthUser({
              'user': user,
              'checked': true
            });
          });
        }else{
          setAuthUser({
            'user': null,
            'checked': true
          });
        }
      });
    }, []);
  
    return (
      <AuthContext.Provider
        value={{
          authUser, userData, setUserData
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };