import React from 'react';
import { Link } from "react-router-dom";

const PageNotFound = ({ children }) => (
    <div className="text-center">
        <i className="fa fa-5x fa-fire text-warning"></i>
        <h1>Page not found</h1>
        <p>Oops, the page you requested is not found.</p>
        <Link to="/">Home</Link>
    </div>
);

export default PageNotFound;