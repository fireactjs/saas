import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({links}) => {
    return (
        <div>
            <nav className="" aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {links !== null && links.map((link, key) => {
                            return (
                                <li className={link.active?"active breadcrumb-item":"breadcrumb-item"}>
                                    {link.to !== null && 
                                        <Link href={link.to}>{link.text}</Link>
                                    }
                                    {link.to === null && 
                                        <>{link.text}</>
                                    }
                                </li>
                            )
                        })
                    }
                </ol>
            </nav>
        </div>
    )
}

export default Breadcrumb;