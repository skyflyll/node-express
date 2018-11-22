var helper = require('./helper');

var SMSClient = require('@alicloud/sms-sdk');

var md5 = require('md5');

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
var accessKeyId = 'LTAIvC1SEYSLKOTq';
var secretAccessKey = 'dLZyEbluLWbEU3FKI0sw6c6U1mwo8S';
//初始化sms_client
var smsClient = new SMSClient({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});

var smsList = {
    找回密码: 'SMS_140555082',
    用户注册: 'SMS_140535061'
};

var _phone = /^1[3456789]\d{9}$/;

function checkCode(req, phone, code) {

    return helper.Cookie.get(req).Code === md5(phone + global.AuthKey + code);
}

module.exports = {

    signin: function (req, res) {

        var auth = helper.Auth.getAuth(req);

        if (auth.User && auth.Role === "doctor" && helper.checkAuth(auth.User + auth.Role, auth.Auth))

            res.redirect("/chat");

        else

            res.sendFile(__dirname + "/admin/login.html");
    },

    signin2: function (req, res) {

        if (req.body.code.toLowerCase() === helper.decode(helper.Cookie.get(req).code)) {

            global.db.collection("person").findOne({
                tel: req.body.uid,
                pwd: req.body.pwd
            }, {projection: {tel: 1, name: 1, department: 1, duty: 1}}).then(function (value) {

                if (value) {

                    // helper.Auth.setAuth(req.body.uid, "doctor", res, req.body.rm === "on" ? 365 : 1);

                    helper.Cookie.set(res, [
                        {key: "User", value: req.body.uid, httponly: true},
                        {key: "user", value: req.body.uid},
                        {key: "Role", value: "doctor", httponly: true},
                        {key: "Name", value: value.name, httponly: true},
                        {key: "name", value: value.name},
                        {key: "Department", value: value.department, httponly: true},
                        {key: "Auth", value: helper.getAuth(req.body.uid + 'doctor'), httponly: true},
                        {key: "Duty", value: value.duty, httponly: true}
                    ]);

                    res.redirect("/chat");

                } else

                    res.redirect("/signin?msg=账号和密码不匹配");
            });

        } else

            res.redirect("/signin?msg=验证码不正确");
    },

    chat: function (req, res) {

        var auth = helper.Auth.getAuth(req);

        if (auth.Role === "doctor" && auth.User && helper.checkAuth(auth.User + auth.Role, auth.Auth))

            res.sendFile(__dirname + "/admin/chat.html");

        else

            res.redirect("/signin");
    },

    forget: function (req, res) {

        res.sendFile(__dirname + "/admin/forget.html");
    },

    sendSMS: function (req, res) {

        if (_phone.test(req.body.phone)) {

            var collection, obj;

            if (req.body.role) {

                collection = global.db.collection(req.body.role);
                obj = {tel: req.body.phone};

            } else {

                collection = global.db.collection('user');
                obj = {uid: req.body.phone};
            }

            if (req.body.logon === '1') {

                var code = String(Date.now());

                code = code.substr(code.length - 6);

                var param = {
                    PhoneNumbers: req.body.phone,
                    SignName: '玉屏侗族自治县人民医院',
                    TemplateCode: smsList['用户注册'],
                    TemplateParam: '{"code":"' + code + '"}'
                };

                //发送短信
                smsClient.sendSMS(param).then(function (r) {

                    if (r.Code === 'OK') {

                        code = md5(req.body.phone + global.AuthKey + code);

                        helper.Cookie.set(res, {key: 'Code', value: code, expires: 600, httponly: true});

                        res.send({rc: 0, rm: '已发送', log: r});

                    } else {

                        res.send({rc: 3, rm: '发送失败', log: r});
                    }

                }, function (err) {

                    res.send({rc: 4, rm: '发送失败', log: err});
                });

            } else {

                collection.findOne(obj).then(function (value) {

                    if (value) {

                        var code = String(Date.now());

                        code = code.substr(code.length - 6);

                        var param = {
                            PhoneNumbers: req.body.phone,
                            SignName: '玉屏侗族自治县人民医院',
                            TemplateCode: smsList['找回密码'],
                            TemplateParam: '{"code":"' + code + '"}'
                        };

                        //发送短信
                        smsClient.sendSMS(param).then(function (r) {

                            if (r.Code === 'OK') {

                                code = md5(req.body.phone + global.AuthKey + code);

                                helper.Cookie.set(res, {key: 'Code', value: code, expires: 600, httponly: true});

                                res.send({rc: 0, rm: '已发送', log: r});

                            } else {

                                res.send({rc: 3, rm: '发送失败', log: r});
                            }

                        }, function (err) {

                            res.send({rc: 4, rm: '发送失败', log: err});
                        });

                    } else

                        res.send({rc: 1, rm: '用户不存在'});
                });
            }

        } else

            res.send({rc: 2, rm: '用户不存在'});
    },

    forget2: function (req, res) {

        if (checkCode(req, req.body.uid, req.body.code)) {

            var collection = global.db.collection("person");

            collection.findOne({tel: req.body.uid}).then(function (value) {

                if (value)

                    collection.updateOne({_id: ObjectId(value._id)}, {$set: {pwd: req.body.pwd}}, function (err, result) {

                        res.redirect("/signin");
                    });

                else

                    res.redirect("/forget?msg=账号不存在");
            });

        } else

            res.redirect("/forget?msg=验证码不存在或已过期");
    },

    forget3: function (req, res) {

        if (checkCode(req, req.body.uid, req.body.code)) {

            var collection = global.db.collection("user");

            collection.findOne({uid: req.body.uid}).then(function (value) {

                if (value)

                    collection.updateOne({_id: ObjectId(value._id)}, {$set: {pwd: req.body.pwd}}, function (err, result) {

                        res.send({rc: 0, rm: '修改成功'});
                    });

                else

                    res.send({rc: 2, rm: '用户不存在'});
            });

        } else

            res.send({rc: 1, rm: '验证码不存在或过期'});
    },

    test: function (req, res) {

        // helper.Auth.setAuth("test", "user", res, req.body.rm === "on" ? 365 : 1);

        helper.Cookie.set(res, [
            {key: "User", value: "test", httponly: true},
            {key: "user", value: "test"},
            {key: "Role", value: "user", httponly: true},
            {key: "Name", value: "测试", httponly: true},
            {key: "name", value: "测试"}
        ]);

        res.sendFile(__dirname + "/admin/test.html");
    }
};

var wsPool = {};

global.wss.on("connection", function (ws, req) {

    var cookies = helper.Cookie.get(req);

    if (cookies.User && (cookies.Role === "doctor" || cookies.Role === "user") && helper.checkAuth(cookies.User + cookies.Role, cookies.Auth)) {

        var id = cookies.Role + "&" + cookies.User;

        if (wsPool.hasOwnProperty(id))

            wsPool[id].ws.close(4002, "聊天界面已在其他窗口打开。");

        wsPool[id] = {ws: ws, role: cookies.Role, name: cookies.Name, department: cookies.Department, duty: cookies.Duty};

        ws.on('message', function (message) {

            try {

                center(JSON.parse(message));

            } catch (e) {

                console.error(e);
            }
        });

        ws.on('close', function (code) {

            if (code === 1001) {

                delete wsPool[id];

                if (cookies.Role === "doctor" || cookies.Role === "user")

                    broadcast({type: 2001, id: cookies.User}, cookies.Role === "doctor" ? "user" : "doctor");
            }
        });

        ws.send(JSON.stringify({type: 1000, msg: "连接成功", id: cookies.User, name: cookies.Name}));

        if (cookies.Role === "doctor")

            broadcast({type: 2000, list: [{id: cookies.User, name: cookies.Name, department: cookies.Department, duty: cookies.Duty}]}, "user");

        else if (cookies.Role === "user") {

            var list = [];

            for (var attr in wsPool)

                if (wsPool.hasOwnProperty(attr) && wsPool[attr].ws.readyState === 1 && wsPool[attr].role === "doctor")

                    list.push({id: attr.replace("doctor&", ""), name: wsPool[attr].name, department: wsPool[attr].department, duty: wsPool[attr].duty});

            ws.send(JSON.stringify({type: 2000, list: list}));
        }

    } else

        ws.close(4001, "你未登录请前去登录后再使用。");
});

function center(obj) {

    var id;

    switch (obj.type) {

        case 1001:

            id = "doctor&" + obj.to;

            if (wsPool.hasOwnProperty("doctor&" + obj.to))

                wsPool[id].ws.send(JSON.stringify({type: 3001, msg: obj.msg, from: obj.from, name: obj.name}));

            break;

        case 3001:

            id = "user&" + obj.to;

            if (wsPool.hasOwnProperty("user&" + obj.to))

                wsPool[id].ws.send(JSON.stringify({type: 1001, msg: obj.msg, from: obj.from, name: obj.name}));

            break;
    }
}

function broadcast(obj, role) {

    for (var attr in wsPool)

        if (wsPool.hasOwnProperty(attr) && wsPool[attr].ws.readyState === 1 && wsPool[attr].role === role)

            wsPool[attr].ws.send(JSON.stringify(obj));
}

// setInterval(function () {
//
//     for (var attr in wsPool)
//
//         if (wsPool.hasOwnProperty(attr) && wsPool[attr].ws.readyState === 1)
//
//             wsPool[attr].ws.send(JSON.stringify({type: 1001, msg: "test"}));
//
// }, 1000);