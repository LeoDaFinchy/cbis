export function isSubSetOf<T>(subject: Array<T>, object: Array<T>){
    for(const item of subject){
        if(!object.includes(item)){
            return false;
        }
    }
    return true;
}

export function isSuperSetOf<T>(subject: Array<T>, object: Array<T>){
    return isSubSetOf(object, subject);
}
