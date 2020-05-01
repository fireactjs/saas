import React from "react";
import Breadcrumb from '../../../components/Breadcrumb';

const Home = () => {
    const breadcrumbLinks = [
        {
            to: "/",
            text: "Home",
            active: false
        },
        {
            to: null,
            text: "Dashboard",
            active: true
        }
    ];

    return (
        <>
            <Breadcrumb links={breadcrumbLinks} />
            <div className="container-fluid">
                <div className="animated fadeIn">
                    Home
                </div>
            </div>
        </>

    )
}

export default Home;