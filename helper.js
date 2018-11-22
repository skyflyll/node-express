module.exports = {

    Auth: {
        clearAuth: clearAuth,
        setAuth: setAuth,
        getAuth: getAuth
    },

    Cookie: {
        set: setCookie,
        get: getCookie,
        del: delCookie
    },

    getAuth: _getAuth,

    checkAuth: _checkAuth,

    code: code,
    decode: decode,

    OneDayToSecond: OneDayToSecond
};

var OneDayToSecond = 86400;
var S62Map = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

var md5 = require('md5');

function _getAuth (str) {

    str += AuthKey;

    str = md5(str);

    var result = '';

    for (var i = 0; i < str.length; i += 3)

        result += str[i];

    return result;
}

function _checkAuth (str, auth) {


    str += AuthKey;

    str = md5(str);

    var result = '';

    for (var i = 0; i < str.length; i += 3)

        result += str[i];

    return result === auth;
}

function decode(value) {

    value = parseInt(value);

    var str = "";

    while (value > 0) {

        str = S62Map[value % 62] + str;
        value = parseInt(value / 62);
    }

    return str;
}

function code(str) {

    str += "";

    var num = 0;

    for (var i = 0; i < str.length; i++) {

        num = num * 62 + S62Map.indexOf(str[i]);
    }

    return String(num);
}

function clearAuth(response) {

    response.header("Set-Cookie", [

        "User=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax",
        "Auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax",
        "user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax",
        "Role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax"
    ]);
}

function delCookie(response, cookies) {

    if (typeof cookies === "string")

        response.header("Set-Cookie", cookies + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax");

    else {

        cookies = cookies.map(function (cookie) {

            return cookie + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax";
        });

        response.header("Set-Cookie", cookies);
    }
}

function setAuth(user, role, response, time) {

    if (time === undefined)

        time = 365;

    var date = new Date();

    date.setTime(date.getTime() + time * 24 * 3600 * 1000);

    date = date.toGMTString();

    var cookies = [];

    cookies.push("User=" + user + "; expires=" + date + "; path=/; samesite=lax; httponly");
    cookies.push("user=" + user + "; expires=" + date + "; path=/; samesite=lax");
    cookies.push("Role=" + role + "; expires=" + date + "; path=/; samesite=lax; httponly");
    cookies.push("Auth=" + _getAuth(user + role) + "; expires=" + date + "; path=/; samesite=lax; httponly");

    response.header("Set-Cookie", cookies);
}

function setCookie(response, cookies) {
    
    if (cookies instanceof Object) {
        
        if (!(cookies instanceof Array)) {

            cookies = [cookies];
        }

        cookies = cookies.map(function (cookie) {

            var date = new Date();

            if (cookie.hasOwnProperty("expires")) {

                date.setTime(date.getTime() + cookie.expires * 1000);

            } else {

                date.setTime(date.getTime() + OneDayToSecond * 7000);
            }

            cookie.expires = date.toGMTString();

            return cookie.key + "=" + encodeURI(cookie.value) + "; expires=" + cookie.expires + "; path=/; samesite=lax" + (cookie.httponly ? "; httponly" : "");
        });

        response.header("Set-Cookie", cookies);
    }
}

function getAuth(request) {

    var auth = {};

    if (request.headers.cookie)

        request.headers.cookie.split("; ").forEach(function (cookie) {

            var arr = cookie.split("=");

            auth[arr[0]] = arr[1];
        });

    return auth;
}

function getCookie(request) {

    var Cookie = {};

    if (request.headers.cookie)

        request.headers.cookie.split("; ").forEach(function (cookie) {

            var arr = cookie.split("=");

            Cookie[arr[0]] = arr[1];
        });

    return Cookie;
}