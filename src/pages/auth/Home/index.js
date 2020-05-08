import React from "react";
import Breadcrumb from '../../../components/Breadcrumb';
import { Link } from 'react-router-dom';

const Home = () => {
    const title = 'Dashboard';

    const breadcrumbLinks = [
        {
            to: "/",
            text: "Home",
            active: false
        },
        {
            to: null,
            text: title,
            active: true
        }
    ];

    return (
        <>
            <Breadcrumb links={breadcrumbLinks} />
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="card">
                        <div className="card-header">
                            {title}
                        </div>
                        <div className="card-body">
                            <ul>
                                <li>Modify <code>/src/pages/auth/Home/index.js</code> to change this page.</li>
                                <li><Link to="/user/profile">User Profile Features</Link></li>
                                <li><Link to="/user/log">Your Activity Logs</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Home;