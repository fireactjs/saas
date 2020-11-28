import React from "react";
import { Link } from "react-router-dom";

const SidebarLink = (props) => {

    return (
        <Link {...props} onClick={() => {
            if(document.body.classList.contains("sidebar-show")){
                document.body.classList.remove("sidebar-show");
            }else{
                document.body.classList.add("sidebar-show");
            }
        }} >
            {props.children}
        </Link>
    )
}
export default SidebarLink;