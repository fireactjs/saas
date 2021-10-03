import React, { useState, useEffect} from 'react';
import { Paper, Box } from '@mui/material';
import DataTable from '../DataTable';
import Loader from '../Loader';

const DataList = ({handleFetch, schema}) => {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(-1);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    
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
                    <Box p={2}>
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