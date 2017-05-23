/**
 * Created by a123 on 17/2/13.
 */

/*url*/
// YNZapi = 'http://nz.lekongyun.com/Shop/api';
//YNZ = 'http://nz.lekongyun.com';
const YNZapi = 'http://ynz.lekongyun.com/api';
const YNZ = 'http://ynz.lekongyun.com/';
/*cookies*/
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

module.exports = {
    getCookie,
    YNZapi,
    YNZ,
};
