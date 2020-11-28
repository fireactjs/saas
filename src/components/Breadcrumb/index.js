import React from "react";
import { Link } from "react-router-dom";

export const BreadcrumbContext = React.createContext();

export const Breadcrumb = ({links}) => {
    return (
        <div className="c-subheader justify-content-between px-3">
            <ol className="breadcrumb border-0 m-0 px-0 px-md-3">
                {links !== null && links.map((link, key) => {
                        return (
                            <li key={key} className={link.active?"active breadcrumb-item":"breadcrumb-item"}>
                                {link.to !== null && 
                                    <Link to={link.to}>{link.text}</Link>
                                }
                                {link.to === null && 
                                    <>{link.text}</>
                                }
                            </li>
                        )
                    })
                }
            </ol>
        </div>
    )
}

export default Breadcrumb;