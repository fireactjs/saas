import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../../FirebaseAuth';
import { FirebaseAuth } from '../../FirebaseAuth/firebase';
import UserAvatar from '../../UserAvatar';

const UserMenu = () => {
    return (
        <>
        <AuthContext.Consumer>
            {(context) => (
                <li className="nav-item dropdown">
                    <button className="btn btn-link nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <UserAvatar name={context.authUser.user.displayName} photoUrl={context.authUser.user.photoURL} className="img-avatar" />
                    </button>
                    <div className="dropdown-menu dropdown-menu-right" role="menu" aria-hidden="true">
                        <Link type="button" className="dropdown-item" to="/user/profile">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Profile
                        </Link>
                        <Link type="button" className="dropdown-item" to="/user/log">
                            <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                            Activity Log
                        </Link>
                        <button type="button" className="dropdown-item" href="/" data-toggle="modal" data-target="#logoutModal" onClick={(e) => {
                            e.preventDefault();
                            FirebaseAuth.auth().signOut().then(function(){
                                
                            }, function(error){
            
                            })
                        }}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Sign Out
                        </button>
                    </div>
                </li>
            )}
        </AuthContext.Consumer>
        </>
    )
}

export default UserMenu;