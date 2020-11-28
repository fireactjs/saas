import React from "react";

const UserAvatar = ({name, photoUrl, className, size}) => {
    const uiAvartarUrl = "https://ui-avatars.com/api/?name="+encodeURI(name)+"&background=007bff&size=64&color=f8f9fc";
    return(
        
        (!photoUrl)?(
            <div className="c-avatar">
                <img src={uiAvartarUrl} className={className} width={size} height={size} alt={name} />
            </div>
        ):(
            <div className="c-avatar">
                <img src={photoUrl} className={className} width={size} height={size} alt={name} />
            </div>
        )
        
    )
}

export default UserAvatar;