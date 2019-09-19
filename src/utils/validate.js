/**
 * 
 * @param {string} value
 * @returns {Boolean}
 */
export function validUsername(value) {
    return value.length > 3 && value.length < 10;
}
/**
 * 
 * @param {string} value
 * @returns {Boolean}
 */
export function validPassword(value) {
    return value && value.length > 3 && value.length < 10;
}
/**
 * 
 * @param {string} value 
 */
export function validInput(value) {
    return value && value.length < 20;
}
validInput.max = 20;
/**
 * 
 * @param {string} value 
 */
export function validTextarea(value) {
    return value && value.length < 500;
}
validTextarea.max = 500;
/**
 * 
 * @param {string} email 
 */
export function validEmail(email) {
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email);
}
/**
 * 
 * @param {Array} arg 
 */
export function isArray(arg) {
    if (typeof Array.isArray === 'undefined') {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    return Array.isArray(arg);
}
/**
 * 
 * @param {string} ip 
 */
export function validIP(ip) {
    const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
    return reg.test(ip);
}


