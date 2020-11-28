
import React, {useState} from "react";

const Pagination = ({activePage, totalRows, pageSize, changeHandler}) =>{
    let totalPages = Math.ceil(totalRows / pageSize);
    let startIndex = (activePage - 1) * pageSize + 1;
    let endIndex = (activePage * pageSize > totalRows)?totalRows:(activePage * pageSize);
    let pageRange = [];
    let showFirstPage = false;
    let showPreviousDot = false;
    let showLastPage = false;
    let showNextDot = false;
    for(var i=activePage-2; i<=activePage+2; i++){
        if(i>=1 && i<=totalPages){
            pageRange.push(i);
        }
    }
    if(pageRange.length>0){
        if(pageRange[0] > 1){
            showFirstPage = true;
        }
        if(pageRange[0] > 2){
            showPreviousDot = true;
        }
        if(pageRange[pageRange.length-1]<totalPages){
            showLastPage = true;
        }
        if(pageRange[pageRange.length-1]<totalPages-1){
            showNextDot = true;
        }
    }

    const [currentPage, setCurrentPage] = useState(activePage);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);

    return (
        
        <div className="row dataTables_wrapper dt-bootstrap4">
            <div className="col-sm-12 col-md-4">
                <div className="dataTables_info small" role="status" aria-live="polite">
                    Showing {startIndex} to {endIndex} of {totalRows} items
                </div>
            </div>
            <div className="col-sm-12 col-md-8">
                <div className="form-row float-right">
                    <div className="dataTables_paginate paging_simple_numbers col-auto">
                        <ul className="pagination small">
                            <li key="previous" className={(activePage>1)?"paginate_button page-item previous":"paginate_button page-item previous disabled"}>
                                <button className="page-link" onClick={(e)=>{changeHandler(activePage-1, pageSize)}}>&lt;</button>
                            </li>
                            {showFirstPage && 
                                <li key="page1" className={(activePage===1)?"paginate_button page-item active":"paginate_button page-item"}>
                                    <button className="page-link" onClick={(e)=>{changeHandler(1, pageSize)}}>{1}</button>
                                </li>
                            }
                            {showPreviousDot && 
                                <li key="previousDot" className="paginate_button page-item disabled">
                                    <button className="page-link">...</button>
                                </li>
                            }
                            {pageRange.map((pageNumber, key) => (
                                <li key={pageNumber} className={(pageNumber===activePage)?"paginate_button page-item active":"paginate_button page-item"}>
                                {pageNumber === activePage && 
                                    <button disabled className="page-link">{pageNumber}</button>
                                }
                                {pageNumber !== activePage && 
                                    <button className="page-link" onClick={(e)=>{changeHandler(pageNumber, pageSize)}}>{pageNumber}</button>
                                }
                                </li>
                            ))}
                            {showNextDot && 
                                <li key="nextDot" className="paginate_button page-item disabled">
                                    <button className="page-link">...</button>
                                </li>
                            }
                            {showLastPage && 
                                <li key="pageLast" className={(activePage===totalPages)?"paginate_button page-item active":"paginate_button page-item"}>
                                    <button className="page-link" onClick={(e)=>{changeHandler(totalPages, pageSize)}}>{totalPages}</button>
                                </li>
                            }
                            <li key="next" className={(activePage<totalPages)?"paginate_button page-item next":"paginate_button page-item next disabled"}>
                                <button className="page-link" onClick={(e)=>{changeHandler(activePage+1, pageSize)}}>&gt;</button>
                            </li>
                        </ul>
                    </div>
                    <div className="col-auto">
                        <select className="form-control form-control-sm mt-1" value={currentPageSize} onChange={(e) => {
                            setCurrentPageSize(e.target.value);
                            if(pageSize !== e.target.value){
                                changeHandler(1, e.target.value);
                            }
                        }}>
                            <option value={5}>5 / Page</option>
                            <option value={10}>10 / Page</option>
                            <option value={20}>20 / Page</option>
                            <option value={50}>50 / Page</option>
                            <option value={100}>100 / Page</option>
                        </select>
                    </div>
                    <div className="col-auto small">
                        <span className="form-control-plaintext mt-1">Go to</span>
                    </div>
                    <div className="col-auto">
                        <input type="number" className="form-control form-control-sm mt-1" value={currentPage} onChange={(e) => {
                                setCurrentPage(e.target.value);
                            }} onBlur={(e) => {
                                if(!isNaN(currentPage) && Number(currentPage) >=1 && Number(currentPage)<=totalPages && currentPage !== activePage){
                                    changeHandler(currentPage, pageSize);
                                }
                            }} min={1} max={totalPages} />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Pagination