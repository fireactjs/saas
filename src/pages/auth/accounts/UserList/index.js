import React, { useContext, useEffect, useState, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import Loader from "../../../../components/Loader";
import UserAvatar from '../../../../components/UserAvatar';
import Alert from "../../../../components/Alert";
import { Link } from "react-router-dom";

const UserList = () => {
    const title = 'Users';

    const { userData } = useContext(AuthContext);
    const mountedRef = useRef(true);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setBreadcrumb(
            [
                {
                    to: "/",
                    text: "Home",
                    active: false
                },
                {
                    to: "/account/"+userData.currentAccount.id+"/",
                    text: userData.currentAccount.name,
                    active: false
                },      
                {
                    to: null,
                    text: title,
                    active: true
                }
            ]);
        setError(null);
        const getAccountUsers = CloudFunctions.httpsCallable('getAccountUsers');
        getAccountUsers({
            accountId: userData.currentAccount.id
        }).then(res => {
            if (!mountedRef.current) return null
            res.data.forEach(record => {
                record.lastLoginTime = new Date(record.lastLoginTime);
            });
            setUsers(res.data);
        }).catch(err => {
            if (!mountedRef.current) return null
            setError(err.message);
        });
    },[userData, setBreadcrumb]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <>
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="text-right mb-3">
                        <Link to={"/account/"+userData.currentAccount.id+"/users/add"} className="btn btn-primary"><i className="fa fa-plus"></i> Add User</Link>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            {title}
                        </div>
                        <div className="card-body">
                            {error !== null && 
                                <Alert type="danger" message={error} dismissible={true} onDismiss={() => setError(null)}></Alert>
                            }
                            {users === null ? (
                                <Loader text="Loading users" />
                            ):(
                                <table className="table table-responsive-sm table-hover table-outline mb-0">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Role</th>
                                            <th>Last Login</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((user, i) => 
                                        <tr key={i}>
                                            <th>
                                                <div className="row col">
                                                    <UserAvatar className="c-avatar-img" name={user.displayName} photoUrl={user.photoUrl} ></UserAvatar>
                                                    <div className="pt-2 ml-1">
                                                        <strong>{user.displayName}</strong>
                                                    </div>
                                                </div>
                                            </th>
                                            <td>{user.id===userData.currentAccount.owner?"Owner":(user.role.charAt(0).toUpperCase()+user.role.slice(1))}</td>
                                            <td>{user.lastLoginTime.toLocaleTimeString()} {user.lastLoginTime.toLocaleDateString()}</td>
                                            <td className="text-right">
                                                {user.id!==userData.currentAccount.owner && 
                                                    <Link className="btn btn-primary" to={"/account/"+userData.currentAccount.id+"/users/change/"+user.id}>Change Role</Link>
                                                }
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default UserList;