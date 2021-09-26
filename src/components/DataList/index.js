import React, { useState, useContext, useEffect} from 'react';
import { BreadcrumbContext } from '../Breadcrumb';
import { AuthContext } from "../FirebaseAuth";
import { Paper, Box } from '@mui/material';
import DataTable from '../DataTable';
import Loader from '../Loader';

const DataList = ({title, handleFetch, schema}) => {
    const { userData } = useContext(AuthContext);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(-1);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

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
                to: null,
                text: title,
                active: false
            }
        ]);
    },[setBreadcrumb, title, userData]);
    
    useEffect(() => {
        setIsLoading(true);
        handleFetch(page, pageSize).then(
            res => {
                setRows(res.data);
                setTotal(res.total);
                setIsLoading(false);
            }
        )
    },[handleFetch, page, pageSize]);

    return (
        <>
            {isLoading?(
                <Paper>
                    <Box p={3}>
                        <Loader text="Loading..." />
                    </Box>
                </Paper>
            ):(
                <Paper>
                    <Box>
                        <DataTable
                            columns={schema}
                            rows = {rows}
                            totalRows = {total}
                            pageSize = {pageSize}
                            page={page}
                            handlePageChane = {(e, p) => {
                                setPage(p);
                            }}
                            handlePageSizeChange = {(e) => {
                                setPage(0);
                                setPageSize(e.target.value);
                            }}
                        />
                    </Box>
                </Paper>
            )}
        </>
    )
}

export default DataList;