import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import Loader from "../../../../components/Loader";
import UserAvatar from '../../../../components/UserAvatar';
import Alert from "../../../../components/Alert";
import {Form, Field} from "../../../../components/Form";

const UserRole = () => {
    const title = 'Change User Role';

    const { userData } = useContext(AuthContext);
    const { userId } = useParams();
    const mountedRef = useRef(true);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [inSubmit, setInSubmit] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        setBreadcrumb([
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
                to: "/account/"+userData.currentAccount.id+"/users",
                text: 'Manage Users',
                active: false
            },    
            {
                to: null,
                text: title,
                active: true
            }
        ]);
        setError(null);
        const getAccountUser = CloudFunctions.httpsCallable('getAccountUser');
        getAccountUser({
            accountId: userData.currentAccount.id,
            userId: userId
        }).then(res => {
            if (!mountedRef.current) return null
            res.data.lastLoginTime = new Date(res.data.lastLoginTime);
            setUser(res.data);
        }).catch(err => {
            if (!mountedRef.current) return null
            setError(err.message);
        });
        return () => { 
            mountedRef.current = false
        }
    },[userData, userId, setBreadcrumb])

    return (
        <>
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="card">
                        <div className="card-header">
                            {title}
                        </div>
                        <div className="card-body">
                            {success && 
                                <Alert type="success" message="User role is successfully updated." dismissible={true} onDismiss={() => setSuccess(false)}></Alert>
                            }
                            {error !== null && 
                                <Alert type="danger" message={error} dismissible={true} onDismiss={() => setError(null)}></Alert>
                            }
                            {user === null ? (
                                <Loader text="Loading user details" />
                            ):(
                                <Form handleSubmit={e => {
                                    e.preventDefault();
                                    setError(null);
                                    setSuccess(false);
                                    setInSubmit(true);
                                    const updateAccountUserRole = CloudFunctions.httpsCallable('updateAccountUserRole');
                                    updateAccountUserRole({
                                        accountId: userData.currentAccount.id,
                                        userId: userId,
                                        role: selectedRole
                                    }).then(res => {
                                        setInSubmit(false);
                                        setSuccess(true);
                                    }).catch(err => {
                                        setInSubmit(false);
                                        setError(err.message);
                                    });
                                }}
                                disabled={selectedRole===null || inSubmit}
                                submitBtnStyle={(selectedRole!=='remove')?"primary":"danger"}
                                inSubmit={inSubmit}
                                enableDefaultButtons={true}
                                backToUrl={"/account/"+userData.currentAccount.id+"/users"}
                                >
                                    <Field label="User Name">
                                        <div className="row col">
                                            <UserAvatar name={user.displayName} photoUrl={user.photoUrl} className="c-avatar-img mr-2"></UserAvatar>
                                            <div className="pt-2 ml-1">{user.displayName}</div>
                                        </div>
                                    </Field>
                                    <Field label="Last Login Time">
                                        <div className="my-1">{user.lastLoginTime.toLocaleString()}</div>
                                    </Field>
                                    <Field label="Role">
                                        <select className="form-control col-md-6 col-sm-8" defaultValue={user.role} onChange={e => {
                                            setSelectedRole(e.target.value);
                                        }}>
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                            <option value="remove">-- Remove Access --</option>
                                        </select>
                                    </Field>
                                </Form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default UserRole;