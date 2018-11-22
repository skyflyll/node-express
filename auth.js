var helper = require('./helper');
var BMP24 = require('gd-bmp').BMP24;

function rand(min, max) {
    return Math.random() * (max - min + 1) + min | 0; //特殊的技巧，|0可以强制转换为整数
}

function makeCapcha() {

    var img = new BMP24(100, 40);
    img.fillRect(0, 0, img.w, img.h, 0xffffff);
    img.drawCircle(rand(0, 100), rand(0, 40), rand(10, 40), rand(0, 0xffffff));
    //边框
    // img.drawRect(0, 0, img.w - 1, img.h - 1, rand(0, 0xffffff));
    img.fillRect(rand(0, 100), rand(0, 40), rand(10, 35), rand(10, 35), rand(0, 0xffffff));
    img.drawLine(rand(0, 100), rand(0, 40), rand(0, 100), rand(0, 40), rand(0, 0xffffff));
    //return img;

    //画曲线
    var w = img.w / 2;
    var h = img.h;
    var color = rand(0, 0xffffff);
    var y1 = rand(-5, 5); //Y轴位置调整
    var w2 = rand(10, 15); //数值越小频率越高
    var h3 = rand(4, 6); //数值越小幅度越大
    var bl = rand(1, 5);
    for (var i = -w; i < w; i += 0.1) {
        var y = Math.floor(h / h3 * Math.sin(i / w2) + h / 2 + y1);
        var x = Math.floor(i + w);
        for (var j = 0; j < bl; j++) {
            img.drawPoint(x, y + j, color);
        }
    }

    var p = "ABCDEFGHKMNPQRSTUVWXYZ3456789";
    var str = '';
    for (var i = 0; i < 5; i++) {
        str += p.charAt(Math.random() * p.length | 0);
    }
    img.value = str;
    var fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32];
    var x = 15, y = 8;
    for (var i = 0; i < str.length; i++) {
        var f = fonts[Math.random() * fonts.length | 0];
        y = 8 + rand(-10, 10);
        img.drawChar(str[i], x, y, f, rand(0, 0xffffff));
        x += f.w + rand(2, 8);
    }
    return img;
}

module.exports = {

    admin: function (req, res) {

        var auth = helper.Auth.getAuth(req);

        if (auth.Role === "admin" && auth.User && helper.checkAuth(auth.User + auth.Role, auth.Auth))

            res.sendFile(__dirname + "/admin/index.html");

        else

            res.redirect("/login");
    },

    login1: function (req, res) {

        var auth = helper.Auth.getAuth(req);

        if (auth.User && auth.Role === "admin" && helper.checkAuth(auth.User + auth.Role, auth.Auth))

            res.redirect("/admin");

        else

            res.sendFile(__dirname + "/admin/login.html");
    },

    login2: function (req, res) {

        if (req.body.code.toLowerCase() === helper.decode(helper.Cookie.get(req).code)) {

            var cursor = global.db.collection("admin").find({uid: req.body.uid, pwd: req.body.pwd});

            cursor.count(function (mongoError, count) {

                if (count) {

                    helper.Auth.setAuth(req.body.uid, "admin", res, req.body.rm === "on" ? 365 : 1);

                    res.redirect("/admin");

                } else

                    res.redirect("/login?msg=账号和密码不匹配");
            });

        } else

            res.redirect("/login?msg=验证码不正确");
    },

    logout: function (req, res) {

        helper.Auth.clearAuth(res);

        if (req.query.url)

            res.redirect(req.query.url);

        else

            res.redirect("/login");
    },

    code: function (req, res) {

        var img = makeCapcha();

        helper.Cookie.set(res, {
            key: "code",
            value: helper.code(img.value.toLowerCase()),
            expires: 10 * 60,
            httponly: true
        });

        res.send(img.getFileData());
    }
};