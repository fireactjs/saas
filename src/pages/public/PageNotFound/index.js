import React from 'react';
import { Link } from "react-router-dom";
import Logo from '../../../components/Logo';

const PageNotFound = () => (
    <div className="text-center">
        <Logo size="80px" />
        <h1>Page not found</h1>
        <p>Oops, the page you requested is not found.</p>
        <Link to="/">Home</Link>
    </div>
);

export default PageNotFound;