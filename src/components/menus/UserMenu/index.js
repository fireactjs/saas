import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../../FirebaseAuth';
import { userSignOut } from '../../../libs/user';
import UserAvatar from '../../UserAvatar';

const UserMenu = () => {
    return (
        <>
        <AuthContext.Consumer>
            {(context) => (
                <li className="c-header-nav-item dropdown" id="user-menu">
                    <Link to="/" data-target="#root" className="c-header-nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <UserAvatar name={context.authUser.user.displayName} photoUrl={context.authUser.user.photoURL} className="c-avatar-img" />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right" style={{minWidth: '182px'}}>
                        <Link className="dropdown-item" to="/user/profile">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Profile
                        </Link>
                        <Link className="dropdown-item" to="/user/log">
                            <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                            Activity Logs
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link to="/" data-target="#root" className="dropdown-item" onClick={(e) => {
                            e.preventDefault();
                            userSignOut();
                        }}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Sign Out
                        </Link>
                    </div>
                </li>
            )}
        </AuthContext.Consumer>
        </>
    )
}

export default UserMenu;