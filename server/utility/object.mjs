export function objectToNull(obj) {
    if (obj.constructor === Object && Object.entries.length <= 0) {
        return null;
    }
    return obj;
}
