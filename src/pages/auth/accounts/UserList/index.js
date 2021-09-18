import React, { useContext, useEffect, useState, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import Loader from "../../../../components/Loader";
import DataTable from "../../../../components/DataTable";
import { useHistory } from "react-router-dom";
import { Button, Paper, Box, Alert, Avatar } from "@mui/material";

const UserList = () => {
    const title = 'Users';
    const history = useHistory();  

    const { userData } = useContext(AuthContext);
    const mountedRef = useRef(true);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const [users, setUsers] = useState(null);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

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
            let totalCounter = 0;
            res.data.forEach(record => {
                record.nameCol = <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}><Avatar alt={record.displayName} src={record.photoUrl} /><strong style={{marginLeft: '15px'}}>{record.displayName}</strong></div>
                record.roleCol = record.id===userData.currentAccount.owner?"Owner":(record.role.charAt(0).toUpperCase()+record.role.slice(1));
                record.lastLoginTimeCol = (new Date(record.lastLoginTime)).toLocaleString();
                if(record.roleCol !== 'Owner'){
                    record.actionCol = <Button size="small" variant="contained" onClick={() => history.push("/account/"+userData.currentAccount.id+"/users/change/"+record.id)}>Change Role</Button>
                }
                totalCounter++;
            });
            setTotal(totalCounter);
            setData(res.data);
        }).catch(err => {
            if (!mountedRef.current) return null
            setError(err.message);
        });
    },[userData, setBreadcrumb, history]);

    useEffect(() => {
        const startIndex = page * pageSize;
        let records = [];
        for(let i=startIndex; i<data.length; i++){
            if(i>=startIndex+pageSize){
                break;
            }
            records.push(data[i]);
        }
        setUsers(records);
        window.scrollTo(0, 0);
    },[page, pageSize, data])

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <>
            <div style={{marginTop: '20px', marginBottom: '20px', textAlign: 'right'}}>
                <Button onClick={() => history.push("/account/"+userData.currentAccount.id+"/users/add")} color="primary" variant="contained"><i className="fa fa-plus"></i> Add User</Button>
            </div>
            <Paper width={1}>
                <Box p={2}>
                    {error !== null && 
                        <Alert severity="error">{error}</Alert>
                    }
                    {users === null ? (
                        <Loader text="Loading users" />
                    ):(
                        <DataTable columns={[
                            {name: "Name", field: "nameCol", style: {width: '40%'}},
                            {name: "Role", field: "roleCol", style: {width: '20%'}},
                            {name: "Last Login", field: "lastLoginTimeCol", style: {width: '30%'}},
                            {name: "Action", field: "actionCol", style: {width: '10%'}}
                        ]}
                        rows={users}
                        totalRows={total}
                        pageSize={pageSize}
                        page={page}
                        handlePageChane={(e, p) => {
                            setPage(p);
                        }}
                        handlePageSizeChange={(e) => {
                            setPage(0);
                            setPageSize(e.target.value);
                        }}
                        ></DataTable>
                    )}
                </Box>
            </Paper>
        </>

    )
}

export default UserList;