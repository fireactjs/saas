import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../../FirebaseAuth';
import { FirebaseAuth } from '../../FirebaseAuth/firebase';


const UserMenu = () => {
    return (
        <AuthContext.Consumer>
            {(context) => (
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="/" name="user" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">{context.authUser.user.displayName}</span>
                    
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                        <Link className="dropdown-item" to="/user/profile">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Profile
                        </Link>
                        <Link className="dropdown-item" to="/user/log">
                            <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                            Activity Log
                        </Link>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="/" data-toggle="modal" data-target="#logoutModal" onClick={(e) => {
                            e.preventDefault();
                            FirebaseAuth.auth().signOut().then(function(){
                                
                            }, function(error){
            
                            })
                        }}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Sign Out
                        </a>
                    </div>
                </li>
            )}
        </AuthContext.Consumer>
    )
}

export default UserMenu;