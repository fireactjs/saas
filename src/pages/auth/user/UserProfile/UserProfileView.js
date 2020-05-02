import React from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserAvatar from '../../../../components/UserAvatar';

const UserProfileView = () => {
    return (
        <AuthContext.Consumer>
            {(context) => (   
                <div className="card">
                    <div className="card-header">
                        Manage Your Profile
                    </div>
                    <div className="card-body">
                        <div className="list-group">
                            <a href="/" className="list-group-item group-item-action disabled">
                                <div className="row">
                                    <div className="col-sm-12 col-md-3 text-left">
                                        <strong>AVATAR</strong>
                                    </div>
                                    <div className="col-sm-9 col-md-6 text-left">
                                        Update via social login
                                    </div>
                                    <div className="col-sm-3 col-md-3 text-right">
                                        <UserAvatar name={context.authUser.user.displayName} photoUrl={context.authUser.user.photoURL} className="img-avatar rounded-circle" size="64" />
                                    </div>
                                </div>
                            </a>
                            <Link to="/user/profile/update-name" className="list-group-item list-group-item-action">
                                <div className="row">
                                   <div className="col-sm-12 col-md-3 text-left">
                                        <strong>NAME</strong>
                                    </div>
                                    <div className="col-sm-9 col-md-6 text-left">
                                        {context.authUser.user.displayName}
                                    </div>
                                    <div className="col-sm-3 col-md-3 text-right">
                                        <i className="fa fa-angle-right" />
                                    </div>
                                </div>
                            </Link>
                            <Link to="/user/profile/update-email" className="list-group-item list-group-item-action">
                                <div className="row">
                                   <div className="col-sm-12 col-md-3 text-left">
                                        <strong>EMAIL</strong>
                                    </div>
                                    <div className="col-sm-9 col-md-6 text-left">
                                        {context.authUser.user.email}
                                    </div>
                                    <div className="col-sm-3 col-md-3 text-right">
                                        <i className="fa fa-angle-right" />
                                    </div>
                                </div>
                            </Link>
                            <Link to="/user/profile/verify-email" className={"list-group-item list-group-item-action"+(context.authUser.user.emailVerified?" disabled":"")}>
                                <div className="row">
                                   <div className="col-sm-12 col-md-3 text-left">
                                        <strong>EMAIL VERIFIED</strong>
                                    </div>
                                    <div className="col-sm-9 col-md-6 text-left">
                                        {(context.authUser.user.emailVerified?" Verified":"Unverified email")}
                                    </div>
                                    <div className="col-sm-3 col-md-3 text-right">
                                        <i className="fa fa-angle-right" />
                                    </div>
                                </div>
                            </Link>
                            <Link to="/user/profile/update-phone" className="list-group-item list-group-item-action">
                                <div className="row">
                                   <div className="col-sm-12 col-md-3 text-left">
                                        <strong>PHONE</strong>
                                    </div>
                                    <div className="col-sm-9 col-md-6 text-left">
                                        {context.authUser.user.phoneNumber}
                                    </div>
                                    <div className="col-sm-3 col-md-3 text-right">
                                        <i className="fa fa-angle-right" />
                                    </div>
                                </div>
                            </Link>
                            <Link to="/user/profile/update-password" className="list-group-item list-group-item-action">
                                <div className="row">
                                   <div className="col-sm-12 col-md-3 text-left">
                                        <strong>PASSWORD</strong>
                                    </div>
                                    <div className="col-sm-9 col-md-6 text-left">
                                        ••••••••
                                    </div>
                                    <div className="col-sm-3 col-md-3 text-right">
                                        <i className="fa fa-angle-right" />
                                    </div>
                                </div>
                            </Link>
                            <Link to="/user/profile/delete" className="list-group-item list-group-item-action">
                                <div className="row">
                                   <div className="col-9 text-danger text-left">
                                        <strong>DELETE ACCOUNT</strong>
                                    </div>
                                    <div className="col-3 text-right">
                                        <i className="fa fa-angle-right" />
                                    </div>
                                </div>
                            </Link>

                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Consumer>
    )
}

export default UserProfileView;