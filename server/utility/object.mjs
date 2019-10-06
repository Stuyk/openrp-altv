export function objectToNull(obj) {
    if (obj.constructor === Object && Object.entries(obj).length <= 0) {
        return null;
    } else {
        if (obj.name === '') {
            console.log('cleansed object');
            return null;
        }
    }
    return obj;
}
