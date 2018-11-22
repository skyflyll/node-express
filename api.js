var helper = require('./helper');

var fs = require("fs");

var allow = [
    "announcement", //公告
    "homeBanner", //首页轮播
    "leadership", // 领导班子
    "special", //单独页面 title：1、院长致词，2、发展历程，3、就诊须知，4、住院须知，5、挂号须知，6、取药须知，
    // 7、联系我们，8、出院须知，9、院长邮箱，10、医院简介，11、门诊安排
    "department", //科室
    "person", //人员
];

// 获取公告：method: GET,
// 地址：/getAnnouncement
// 参数：
// limit: 20
// skip: 0
// query: {"type":"1"}//1、公告；2、医院动态；3、人才招聘；4、医疗设备；5、新项目、技术；6、政策法规；
// 7、党建园地；8、医院荣誉；9、职工之家；10、患者心声；11、健康讲座
// projection: {"projection":{}}

// 获取通讯录：method: POST
// 地址：/query
// 参数：
// limit: 20
// skip: 0
// query: {"type":"1"}//1、专家；2、医生；3、护士
// projection: {"projection":{}}
// collection: "person"

// 注册：method: POST
// 地址：/logon
// 参数：usn(显示名), uid(登陆名), pwd(密码)

// 注册：method: POST
// 地址：/login2
// 参数：uid(登陆名), pwd(密码)

// 注册：method: GET
// 地址：/logout2

// 获取验证码：method: POST
// 地址：/sendSMS
// 参数：logon(1、注册，其他情况为找回密码), phone(手机号码)

module.exports = {

    getBanner: function (req, res) {

        var cursor = db.collection("homeBanner").find();

        cursor.toArray(function (mongoError, objects) {

            res.send(objects);
        });
    },

    sortBanner: function (req, res) {

        if (gateway(req))

            return;

        var auth = helper.Auth.getAuth(req);

        if (auth.User && auth.Role === "admin") {

            var collection = db.collection("homeBanner");

            req.body.data.split(",").forEach(function (id, i) {

                collection.updateOne({_id: ObjectId(id)}, {$set: {sort: i}}, function (err, result) {

                });
            });

            res.send({rc: 0});
        }
    },

    addHomeBanner: function (req, res) {

        if (gateway(req))

            return;

        var file = req.files[0];

        var path = file.path + "." + file.mimetype.split("/")[1];

        fs.renameSync(file.path, path);

        var collection = db.collection("homeBanner");

        collection.insertOne({src: path, href: req.body.href}, function () {

            res.send({rc: 0});
        });
    },

    editHomeBanner: function (req, res) {

        if (gateway(req))

            return;

        var collection = db.collection("homeBanner");

        if (req.files.length) {

            var file = req.files[0];

            var path = file.path + "." + file.mimetype.split("/")[1];

            fs.renameSync(file.path, path);

            collection.updateOne({_id: ObjectId(req.body.id)}, {
                $set: {
                    src: path,
                    href: req.body.href
                }
            }, function (err, result) {

                req.body.src = unescape(req.body.src);

                if (fs.existsSync(req.body.src))

                    fs.unlinkSync(req.body.src);

                res.send({rc: 0});
            });

        } else

            collection.updateOne({_id: ObjectId(req.body.id)}, {$set: {href: req.body.href}}, function (err, result) {

                res.send({rc: 0});
            });
    },

    delHomeBanner: function (req, res) {

        if (gateway(req))

            return;

        var collection = db.collection("homeBanner");

        collection.removeOne({_id: ObjectId(req.body.id)}, function () {

            if (fs.existsSync(req.body.path))

                fs.unlinkSync(req.body.path);

            res.send({rc: 0});
        });
    },

    addAnnouncement: function (req, res) {

        if (gateway(req))

            return;

        var collection = db.collection("announcement");

        req.body.time = Date.now();

        collection.insertOne(req.body, function () {

            res.send({rc: 0});
        });
    },

    getAnnouncement: function (req, res) {

        var query = req.query.query ? JSON.parse(req.query.query) : {};
        var projection = req.query.projection ? JSON.parse(req.query.projection) : {};

        var result = db.collection("announcement").find(query, projection).sort({time: -1});

        result.count().then(function (value) {

            result.limit(parseInt(req.query.limit || 20)).skip(parseInt(req.query.skip || 0))
                .toArray(function (mongoError, objects) {

                    res.send({rc: 0, data: objects, count: value});
                });

        }).catch(function (reason) {

            res.send({rc: 1, rm: reason});
        });
    },

    getDepartment: function (req, res) {

        db.collection("department").find({}, {projection: {name: 1, class: 1}}).toArray(function (error, objects) {

            if (error)

                res.send({rc: 1, data: error});

            else {

                var tmp = {}, result = [];

                objects.forEach(function (data) {

                    if (tmp.hasOwnProperty(data.class))

                        tmp[data.class].push({_id: data._id, name: data.name});

                    else

                        tmp[data.class] = [{_id: data._id, name: data.name}];
                });

                for (var attr in tmp)

                    if (tmp.hasOwnProperty(attr))

                        result.push({name: attr, importDetails: tmp[attr]});

                res.send({rc: 0, data: result});
            }
        });
    },

    addImages: function (req, res) {

        if (gateway(req))

            return;

        var file = req.files[0];

        var path = file.path + "." + file.mimetype.split("/")[1];

        fs.renameSync(file.path, path);

        var collection = db.collection("images");

        collection.insertOne({src: path, title: req.body.title, time: Date.now()}, function () {

            res.send({rc: 0, src: path});
        });
    },

    getImages: function (req, res) {

        var query = req.query.query ? JSON.parse(req.query.query) : {};
        var projection = req.query.projection ? JSON.parse(req.query.projection) : {};

        var result = db.collection("images").find(query, projection).sort({time: -1});

        result.count().then(function (value) {

            result.limit(parseInt(req.query.limit || 20)).skip(parseInt(req.query.skip || 0))
                .toArray(function (mongoError, objects) {

                    res.send({rc: 0, data: objects, count: value});
                });

        }).catch(function (reason) {

            res.send({rc: 1, rm: reason});
        });
    },

    delImages: function (req, res) {

        if (gateway(req))

            return;

        var collection = db.collection("images");

        collection.removeOne({_id: ObjectId(req.body.id)}, function () {

            if (fs.existsSync(req.body.path))

                fs.unlinkSync(req.body.path);

            res.send({rc: 0});
        });
    },

    addFile: function (req, res) {

        if (gateway(req))

            return;

        var file = req.files[0];

        var path = file.path + file.originalname.substr(file.originalname.lastIndexOf("."));

        fs.renameSync(file.path, path);

        var collection = db.collection("files");

        collection.insertOne({src: path, title: req.body.title, time: Date.now()}, function () {

            res.send({rc: 0, src: path});
        });
    },

    getFiles: function (req, res) {

        var query = req.query.query ? JSON.parse(req.query.query) : {};
        var projection = req.query.projection ? JSON.parse(req.query.projection) : {};

        var result = db.collection("files").find(query, projection).sort({time: -1});

        result.count().then(function (value) {

            result.limit(parseInt(req.query.limit || 20)).skip(parseInt(req.query.skip || 0))
                .toArray(function (mongoError, objects) {

                    res.send({rc: 0, data: objects, count: value});
                });

        }).catch(function (reason) {

            res.send({rc: 1, rm: reason});
        });
    },

    delFile: function (req, res) {

        if (gateway(req))

            return;

        var collection = db.collection("files");

        collection.removeOne({_id: ObjectId(req.body.id)}, function () {

            if (fs.existsSync(req.body.path))

                fs.unlinkSync(req.body.path);

            res.send({rc: 0});
        });
    },

    query: function (req, res) {

        if (allow.includes(req.body.collection) || !gateway(req)) {

            var query = req.body.query ? JSON.parse(req.body.query) : {};
            var projection = req.body.projection ? JSON.parse(req.body.projection) : {};
            var sort = req.body.sort ? JSON.parse(req.body.sort) : {time: -1};

            if (req.body._id)

                query._id = ObjectId(req.body._id);

            var result = db.collection(req.body.collection).find(query, projection).sort(sort);

            result.count().then(function (value) {

                result.limit(parseInt(req.body.limit || 20)).skip(parseInt(req.body.skip || 0))
                    .toArray(function (mongoError, objects) {

                        res.send({rc: 0, data: objects, count: value});
                    });

            }).catch(function (reason) {

                res.send({rc: 1, rm: reason});
            });

        } else

            res.send({rc: 1, rm: "没有权限访问该数据集"});
    },

    insert: function (req, res) {

        if (gateway(req))

            return;

        var src;

        if (req.files.length) {

            var file = req.files[0];

            src = file.path + "." + file.mimetype.split("/")[1];

            fs.renameSync(file.path, src);
        }

        if (src)

            req.body.src = src;

        if (!req.body.time)

            req.body.time = Date.now();

        var c = req.body.collection;

        delete req.body.collection;

        var collection = db.collection(c);

        switch (c) {

            case "person":

                collection.findOne({tel: req.body.tel}, {projection: {tel: 1}}).then(function (value) {

                    if (value)

                        res.send({rc: 1, rm: "该手机号码的人员已存在"});

                    else

                        collection.insertOne(req.body, function () {

                            res.send({rc: 0});
                        });
                });

                break;

            default:

                collection.insertOne(req.body, function () {

                    res.send({rc: 0});
                });

                break;
        }
    },

    select: function (req, res) {

        if (gateway(req))

            return;

        var query = JSON.parse(req.body.query);
        var projection = req.body.projection ? JSON.parse(req.body.projection) : {};

        if (query.hasOwnProperty("_id"))

            query._id = ObjectId(query._id);

        var collection = db.collection(req.body.collection);

        collection.findOne(query, projection).then(function (value) {

            res.send({rc: 0, data: value});
        });
    },

    update1: function (req, res) {

        if (gateway(req))

            return;

        var query = JSON.parse(req.body.query);

        if (query.hasOwnProperty("_id"))

            query._id = ObjectId(query._id);

        var collection = db.collection(req.body.collection);

        if (req.files && req.files.length) {

        } else

            collection.updateOne(query, {$set: JSON.parse(req.body.data)}, function (err, result) {

                res.send({rc: 0});
            });
    },

    update: function (req, res) {

        if (gateway(req))

            return;

        var query = JSON.parse(req.body.query);

        if (query.hasOwnProperty("_id"))

            query._id = ObjectId(query._id);

        var data = JSON.parse(req.body.data);

        var collection = db.collection(req.body.collection);

        if (req.files.length) {

            if (fs.existsSync(data.src))

                fs.unlinkSync(data.src);

            var file = req.files[0];

            data.src = file.path + "." + file.mimetype.split("/")[1];

            fs.renameSync(file.path, data.src);
        }

        collection.updateOne(query, {$set: data}, function (err, result) {

            res.send({rc: 0});
        });
    },

    delete: function (req, res) {

        if (gateway(req))

            return;

        var query = JSON.parse(req.body.query);

        if (query.hasOwnProperty("_id"))

            query._id = ObjectId(query._id);

        if (query.src === "undefined")

            delete query.src;

        if (query.src && fs.existsSync(query.src))

            fs.unlinkSync(query.src);

        var collection = db.collection(req.body.collection);

        collection.removeOne(query, function () {

            res.send({rc: 0});
        });
    },

    login: function (req, res) {

        var collection = db.collection("user");

        if (req.body.code.toLowerCase() === helper.decode(helper.Cookie.get(req).code)) {

            collection.findOne({uid: req.body.uid, pwd: req.body.pwd}).then(function (value) {

                if (value) {

                    // helper.Auth.setAuth(req.body.uid, "user", res);
                    // helper.Cookie.set(res, [{key: "Usn", value: "test", httponly: true}, {key: "usn", value: "test"}]);

                    helper.Cookie.set(res, [
                        {key: "User", value: req.body.uid, httponly: true},
                        {key: "user", value: req.body.uid},
                        {key: "uid", value: req.body.uid},
                        {key: "Role", value: "user", httponly: true},
                        {key: "Name", value: value.usn, httponly: true},
                        {key: "Auth", value: helper.getAuth(req.body.uid + "user"), httponly: true},
                        {key: "name", value: value.usn},
                        {key: "usn", value: value.usn}
                    ]);

                    res.send({rc: 0, rm: "登录成功"});

                } else

                    res.send({rc: 1, rm: "账号和密码不匹配"});
            });

        } else

            res.send({rc: 2, rm: "验证码不正确"});
    },

    logon: function (req, res) {

        if (!req.body.time)

            req.body.time = Date.now();

        var collection = db.collection("user");

        collection.findOne({uid: req.body.uid}).then(function (value) {

            if (value)

                res.send({rc: 1, rm: "该手机号已被注册"});

            else

                collection.insertOne({usn: req.body.usn, uid: req.body.uid, pwd: req.body.pwd}, function () {

                    res.send({rc: 0, rm: "注册成功"});
                });
        });
    },

    logout: function (req, res) {

        helper.Auth.clearAuth(res);
        helper.Cookie.del(res, "usn");

        res.send({rc: 0, rm: "退出成功"});
    }
};

function gateway(req, role) {

    role = role || "admin";

    var auth = helper.Auth.getAuth(req);

    return !(auth.User && auth.Role === role && helper.checkAuth(auth.User + auth.Role, auth.Auth));
}