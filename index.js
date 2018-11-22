var http = require('http');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');

var WebSocket = require('ws');

var server = http.createServer(app);
global.wss = new WebSocket.Server({server: server});

var mongodb = require('mongodb');
var client = mongodb.MongoClient;
// var url = "mongodb://p1:p1123@qshfu.com/p1";
var url = "mongodb://47.106.163.160:27017";

global.AuthKey = '2018';

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({dest: 'wwwroot/tmp/'}).array('image'));

global.ObjectId = mongodb.ObjectId;

client.connect(url, function (err, client) {

    if (err) throw err;

    console.log("数据库已创建!");

    global.db = client.db("p1");

    process.on("exit", function (code) {

        client.close();
    });
});

var auth = require("./auth");
var api = require("./api");
var chat = require("./chat");

app.get('/admin', auth.admin);

app.get("/login", auth.login1);

app.get("/code", auth.code);

app.post("/login", auth.login2);

app.get("/logout", auth.logout);

app.get("/getBanner", api.getBanner);

app.post("/sortBanner", api.sortBanner);

app.post("/addHomeBanner", api.addHomeBanner);

app.post("/editHomeBanner", api.editHomeBanner);

app.post("/delHomeBanner", api.delHomeBanner);

app.post("/addAnnouncement", api.addAnnouncement);

app.get("/getAnnouncement", api.getAnnouncement);

app.post("/insert", api.insert);

app.post("/select", api.select);

app.post("/update1", api.update1);

app.post("/update", api.update);

app.post("/delete", api.delete);

app.post("/addImages", api.addImages);

app.get("/getImages", api.getImages);

app.post("/delImages", api.delImages);

app.post("/addFile", api.addFile);

app.get("/getFiles", api.getFiles);

app.post("/delFile", api.delFile);

app.get("/getDepartment", api.getDepartment);

app.post("/query", api.query);

app.post("/login2", api.login);

app.post("/logon", api.logon);

app.get("/logout2", api.logout);

app.get("/signin", chat.signin);

app.post("/signin", chat.signin2);

app.get("/forget", chat.forget);

app.post("/sendSMS", chat.sendSMS);//工作人员找回密码

app.post("/forget", chat.forget2);//工作人员找回密码

app.post("/forget2", chat.forget3);//用户找回密码

app.get("/chat", chat.chat);

app.get("/test", chat.test);

app.use(require('connect-history-api-fallback')());

app.use(express.static('wwwroot'));

server.listen(8088);