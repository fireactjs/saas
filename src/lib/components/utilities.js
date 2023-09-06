export const checkPermission = (subscription, uid, permissions) => {
    let allow = false;
    for(let i=0; i<permissions.length; i++){
        if((subscription.permissions && subscription.permissions[permissions[i]]) || subscription.owner === uid){
            if(subscription.permissions[permissions[i]].indexOf(uid) >= 0){
                allow = true;
            }
        }
    }
    return allow;
}