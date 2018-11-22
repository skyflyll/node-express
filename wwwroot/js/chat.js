document.addEventListener("DOMContentLoaded", function () {

    if (typeof imgNode !== "undefined")

        imgNode.onchange = function () {

            compressImg(this.files[0], function (url) {

                requestAnimationFrame(function () {

                    imgNode.type = "text";

                    requestAnimationFrame(function () {

                        imgNode.type = "file";
                    });
                });

                if (navigator.userAgent.match(/MSIE/i) || navigator.userAgent.match(/Windows NT.*Trident\//)) {

                    var imageStr = '<img src="' + url + '"/>';

                    restoreSelection.apply(this, [imageStr, 'html']);

                } else {

                    document.execCommand('insertimage', false, url);
                }
            });
        };

    resize();
});

function restoreSelection(text, mode) {
    //Function to restore the text selection range from the editor
    var node;
    typeof text !== 'undefined' ? text : false;
    typeof mode !== 'undefined' ? mode : "";
    var range = $(this).data('currentRange');
    if (range) {
        if (window.getSelection) {
            if (text) {
                range.deleteContents();
                if (mode == "html") {
                    var el = document.createElement("div");
                    el.innerHTML = text;
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);
                }
                else
                    range.insertNode(document.createTextNode(text));

            }
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        else if (document.selection && range.select) {
            range.select();
            if (text) {
                if (mode == "html")
                    range.pasteHTML(text);
                else
                    range.text = text;
            }
        }
    }
}

function compressImg(imgBlob, fn, width, height, suffix) {

    var reader = new FileReader();

    reader.onload = function () {

        var img = new Image();

        width = width || 600;
        height = height || 600;

        img.src = this.result;

        img.onload = function () {

            if (this.width > this.height) {

                if (this.width > width) {

                    this.height *= width / this.width;
                    this.width = width;
                }

            } else {

                if (this.height > height) {

                    this.width *= height / this.height;
                    this.height = height;
                }
            }

            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            var context = canvas.getContext("2d");
            context.drawImage(this, 0, 0, this.width, this.height);
            var type = imgBlob.type;

            switch ((suffix + "").toLowerCase()) {

                case ".jpg":
                    type = "image/jpeg";
                    break;
                case ".png":
                    type = "image/png";
                    break;
                case ".bmp":
                    type = "image/bmp";
                    break;
            }

            fn(canvas.toDataURL(type));
        };
    };

    reader.readAsDataURL(imgBlob);
}

function resize() {

    // document.getElementById("chatListNode").style.maxHeight = innerHeight * 0.6 + "px";
}

window.onresize = resize;

function initWS() {

    var audio = new Audio();

    audio.src = "/audio/ring.mp3";

    var ws = new WebSocket("ws://localhost:8088");

    var _id, _name;

    ws.onopen = function () {

        ws.onclose = function (ev1) {

            switch (ev1.code) {

                case 4000:

                    console.warn(ev1.reason);

                    break;

                case 4001:

                    alert(ev1.reason);

                    location.href = "/signin";

                    break;

                case 4002:

                    alert(ev1.reason);

                    break;

                default:

                    console.log("3秒后重新连接服务器");

                    setTimeout(function () {

                        initWS();

                    }, 3000);

                    break;
            }
        };

        ws.onmessage = function (ev1) {

            try {

                center(JSON.parse(ev1.data));

            } catch (e) {

                console.error(e);
            }
        };
    };

    ws.onerror = function (ev) {

        console.log("3秒后重新连接服务器");

        setTimeout(function () {

            initWS();

        }, 3000);
    };

    function center(obj) {

        switch (obj.type) {

            case 1000://连接成功

                console.log(obj.msg);

                _id = obj.id;
                _name = obj.name;

                break;

            case 1001://收到消息

                audio.play();

                console.log(obj);

                break;

            case 2000://医生加入聊天室

                addDoctor(obj.list);

                break;

            case 2001://医生离开聊天室

                delMember(obj.id);

                break;

            case 3001://收到消息

                audio.play();

                userMsg(obj);

                break;

            default:

                console.warn(obj);

                break;
        }
    }

    function addDoctor(list) {

        list.forEach(function (obj) {

            var id = "id_" + obj.id;

            if (!document.getElementById(id)) {

                var li = document.createElement("li");

                li.id = id;
                li.innerText = id;
                li.onclick = initBox;

                listNode.appendChild(li);
            }
        });
    }

    function delMember(id) {

        id = "id_" + id;

        var li = document.getElementById(id);

        if (li)

            li.parentElement.removeChild(li);
    }

    function initBox() {

        var id0 = this.id;
        var id = id0.replace("id_", "");

        sendNode.onclick = function () {

            if (document.getElementById(id0)) {

                var msg = msgNode.innerHTML.trim();

                if (msg.length) {

                    ws.send(JSON.stringify({type: 1001, from: _id, name: _name, to: id, msg: msg}));

                    msgNode.innerHTML = "";
                }

            } else {

                alert("用户不在线");

                sendNode.onclick = null;

                msgNode.innerHTML = "";
            }
        };
    }

    function userMsg(obj) {

        var id = "id_" + obj.from;

        var tmp = document.getElementById(id);

        if (tmp) {

            if (sendNode.dataset.target !== id) {

                tmp = tmp.firstElementChild.firstElementChild;

                tmp.innerText = parseInt(tmp.innerText || "0") + 1;
            }

        } else {

            var div = document.createElement("div");

            div.id = id;
            div.innerHTML = '<button class="btn btn-default" type="button">' + decodeURI(obj.name) + '(' + obj.from + ') <span class="badge">1</span></button>';
            div.onclick = initBox2;

            chatListNode.appendChild(div);
        }

        addHistory(obj.from, '<span>' + obj.msg + '</span>');
    }

    function addHistory(id, msg, current) {

        var div = document.getElementById("id_" + id);

        if (div.buffer === undefined)

            div.buffer = localStorage[_id + "_" + id] || "";

        if (sendNode.dataset.target === "id_" + id) {

            var scroll = msgBoxNode.scrollHeight - msgBoxNode.scrollTop - msgBoxNode.offsetHeight;

            if (current)

                msgBoxNode.innerHTML += msg;

            else

                msgBoxNode.innerHTML = div.buffer + msg;

            if (scroll <= 0)

                msgBoxNode.scrollTop = msgBoxNode.scrollHeight;
        }

        div.buffer += msg;

        id = _id + "_" + id;

        var index = msg.indexOf("<img");

        while (index >= 0) {

            msg = msg.substr(0, index) + '[图片]' + msg.substr((msg.indexOf(">", index) + 1) || msg.length);

            index = msg.indexOf("<img");
        }

        localStorage[id] = (localStorage[id] || "") + msg;
    }

    function initBox2() {

        var id0 = this.id;
        var id = id0.replace("id_", "");

        this.firstElementChild.firstElementChild.innerText = "";

        sendNode.dataset.target = id0;

        addHistory(id, '');

        sendNode.onclick = function () {

            if (document.getElementById(id0)) {

                var msg = msgNode.innerHTML.trim();

                if (msg.length) {

                    ws.send(JSON.stringify({type: 3001, from: _id, name: _name, to: id, msg: msg}));

                    msgNode.innerHTML = "";

                    addHistory(id, '<div>' + msg + '</div>', true);
                }

            } else {

                alert("用户不在线");

                sendNode.onclick = null;

                msgNode.innerHTML = "";
            }
        };
    }
}

console.log('service');

initWS();