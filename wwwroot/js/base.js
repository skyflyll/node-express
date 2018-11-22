function getCookie(key) {

    if (document.cookie.length > 0) {

        var start = document.cookie.indexOf(key + "=");

        if (start !== -1) {

            start = start + key.length + 1;
            var end = document.cookie.indexOf(";", start);
            if (end === -1) end = document.cookie.length;
            return unescape(document.cookie.substring(start, end))
        }
    }

    return ""
}

function navAction() {

    var key = this.getAttribute("href").substr(1);

    if (pageAction.hasOwnProperty(key))

        pageAction[key](document.getElementById(key));
}

document.addEventListener("DOMContentLoaded", function () {

    NavNode.querySelectorAll("li > a").forEach(function (a) {

        if (a.href) {

            a.onclick = navAction;
        }
    });

    pageAction.announcement({projection: {content: 0}, tip: true});

    $(document).on("click", "table.home-banner .operation > span", function () {

        if (homeOperation.hasOwnProperty(this.dataset.action)) {

            homeOperation[this.dataset.action](this.parentNode.dataset, this);
        }
    });

    $(document).on("click", "table.announcement .operation > span", function () {

        if (announcementOperation.hasOwnProperty(this.dataset.action)) {

            announcementOperation[this.dataset.action](this.parentNode.dataset, this);
        }
    });

    $(document).on("click", "#announcementPagination > li > a", function () {

        if (this.dataset.page) {

            announcementOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "table.images .operation > span", function () {

        if (imageOperation.hasOwnProperty(this.dataset.action)) {

            imageOperation[this.dataset.action](this.parentNode.dataset, this);
        }
    });

    $(document).on("click", "#imagesNodePagination > li > a", function () {

        if (this.dataset.page) {

            imgNodeOptions2.page = parseInt(this.dataset.page);

            getImages2();
        }
    });

    $(document).on("click", "#imagesPagination > li > a", function () {

        if (this.dataset.page) {

            imgNodeOptions.page = parseInt(this.dataset.page);

            getImages();
        }
    });

    UserNameNode.innerHTML = getCookie("user");

    filterAnnouncementBtn.onclick = function () {

        announcementOptions.title = filterAnnouncementTitle.value.trim();
        announcementOptions.writer = filterAnnouncementWriter.value.trim();
        announcementOptions.source = filterAnnouncementSource.value.trim();
        announcementOptions.page = 0;

        getAnnouncement({projection: {content: 0}});
    };

    imgNodeBtn.onclick = function () {

        imgNodeOptions.title = imgNodeTitle.value.trim();
        imgNodeOptions.page = 0;

        getImages();
    };

    imagesNodeSearchBtn.onclick = function () {

        imgNodeOptions2.title = imagesNodeTitle.value.trim();
        imgNodeOptions2.page = 0;

        getImages2();
    };

    $("#addAnnouncementContent").Editor();

    $("#editAnnouncementContent").Editor();
});

var pageAction = {

    homeBanner: getHomeBanner,
    announcement: function () {

        announcementCurrent = {option: announcementOptions, paginationNode: announcementPagination, name: "#announcement"};

        getAnnouncement({projection: {content: 0}});
    },
    imgNode: getImages
};

var homeOperation = {

    up: function (data, node) {

        node = node.parentNode.parentNode;

        if (node.previousSibling) {

            node.parentNode.insertBefore(node, node.previousSibling);

            this.update(node.parentNode);
        }
    },

    down: function (data, node) {

        node = node.parentNode.parentNode;

        if (node.nextElementSibling) {

            if (node.nextElementSibling.nextElementSibling)

                node.parentNode.insertBefore(node, node.nextElementSibling.nextElementSibling);

            else

                node.parentNode.appendChild(node);

            this.update(node.parentNode);
        }
    },

    edit: function (data) {

        editHomeBannerUrl.value = data.href;
        editHomeBannerPic0.src = data.src.substr(data.src.indexOf("\\"));
        editHomeBannerBtn.setAttribute("onclick", "editHomeBanner('" + data.id + "', '" + escape(data.src) + "')");

        requestAnimationFrame(function () {

            editHomeBannerPic.type = "";

            requestAnimationFrame(function () {

                editHomeBannerPic.type = "file";
            });
        });
    },

    del: function (data) {

        if (confirm("该操作不能撤销你确认删除？")) {

            $.post("/delHomeBanner", {id: data.id, path: data.src}, function (res) {

                if (res.rc === 0) {

                    showTip("删除成功");

                    getHomeBanner(true);

                } else

                    showTip("删除失败", "label-warning");
            });
        }
    },

    update: function (node) {

        var list = [];

        Array.prototype.forEach.call(node.children, function (tr, i) {

            tr.firstElementChild.innerHTML = i + 1;

            list.push(tr.lastElementChild.dataset.id);
        });

        if (list.length)

            $.post("/sortBanner", {data: list.join(",")}, function (res) {

                if (res.rc === 0)

                    showTip("保存成功");

                else

                    showTip("保存失败", "label-warning");
            });
    }
};

var imageOperation = {

    del: function (data) {

        if (confirm("该操作不能撤销你确认删除？")) {

            $.post("/delImages", {id: data.id, path: data.src}, function (res) {

                if (res.rc === 0) {

                    showTip("删除成功");

                    getImages(true);

                } else

                    showTip("删除失败", "label-warning");
            });
        }
    }
};

function getHomeBanner(noTip) {

    $.get("/getBanner", function (res) {

        var list = [];

        res.forEach(function (data) {

            var value = new String(data.sort);

            value.html = '<tr><th scope="row">{.sort}</th><td><img src="' + data.src.substr(data.src.indexOf("\\")) + '"/></td>' +
                '<td><a href="' + data.href + '" target="_blank">' + data.href + '</a></td>' +
                '<td class="operation" data-id="' + data._id + '" data-src="' + data.src + '" data-href="' + data.href + '">' +
                '<span class="glyphicon1 glyphicon glyphicon-circle-arrow-up color-info" data-action="up"></span>' +
                '<span class="glyphicon1 glyphicon glyphicon-circle-arrow-down color-warning" data-action="down"></span>' +
                '<span class="glyphicon1 glyphicon glyphicon-remove-sign color-danger" data-action="del"></span>' +
                '<span class="glyphicon1 glyphicon glyphicon glyphicon-info-sign color-primary" data-action="edit"' +
                'data-toggle="modal" data-target="#editHomeBanner"></span>' +
                '</td></tr>';

            list.push(value);
        });

        var html = "";

        list.sort().forEach(function (value, i) {

            html += value.html.replace("{.sort}", i + 1);
        });

        document.querySelector("#homeBanner tbody").innerHTML = html;

        if (noTip !== true)

            showTip("获取轮播数据成功");
    });
}

function editHomeBanner(id, src) {

    var url = editHomeBannerUrl.value.trim();
    var pic = editHomeBannerPic.files[0];

    post("/editHomeBanner", {id: id, href: url, image: pic, src: src}, function (res) {

        if (res.rc === 0) {

            showTip("修改成功");

            getHomeBanner(true);

        } else

            showTip("修改失败", "label-warning");
    });
}

function addHomeBanner() {

    var url = homeBannerUrl.value.trim();
    var pic = homeBannerPic.files[0];

    if (pic) {

        post("/addHomeBanner", {href: url, image: pic}, function (res) {

            if (res.rc === 0) {

                showTip("添加成功");

                getHomeBanner(true);

            } else

                showTip("添加失败", "label-warning");
        });

        $('#addHomeBanner').modal('hide');

    } else

        showTip("请选择图片", "label-warning");
}

var announcementCurrent = {};

var announcementOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 1};

var announcementOperation = {

    up: function (data, node) {

        node = node.parentNode;

        this.update({_id: node.dataset.id}, {time: Date.now()});
    },

    edit: function (data) {

        editAnnouncementTitle.value = data.title;
        editAnnouncementWriter.value = data.writer;
        editAnnouncementSource.value = data.source;

        $.post("/select", {
            collection: "announcement",
            query: JSON.stringify({_id: data.id}),
            projection: JSON.stringify({projection: {content: 1}})
        }, function (res) {

            if (res.rc === 0) {

                showTip("获取数据成功");

                document.querySelector("#editAnnouncementContent + div [contenteditable=true]").innerHTML = res.data.content;

                editAnnouncementBtn.setAttribute("onclick", "editAnnouncement('" + data.id + "')");

            } else

                showTip("获取数据失败", "label-warning");
        });
    },

    del: function (data) {

        if (confirm("该操作不能撤销你确认删除？")) {

            var query = {_id: data.id};

            $.post("/delete", {
                    collection: "announcement",
                    query: JSON.stringify(query)
                },
                function (res) {

                    if (res.rc === 0) {

                        showTip("删除成功");

                        getAnnouncement({projection: {content: 0}, tip: false});

                    } else

                        showTip("删除失败", "label-warning");
                });
        }
    },

    update: function (query, data) {

        $.post("/update1", {
                collection: "announcement",
                query: JSON.stringify(query),
                data: JSON.stringify(data)
            },
            function (res) {

                if (res.rc === 0) {

                    showTip("保存成功");

                    getAnnouncement({projection: {content: 0}, tip: false});

                } else

                    showTip("保存失败", "label-warning");
            });
    }
};

function addAnnouncementSetting(type) {

    document.getElementById("addAnnouncement").dataset.type = type;
}

function addAnnouncement() {

    var type = document.getElementById("addAnnouncement").dataset.type;

    var title = addAnnouncementTitle.value.trim(),
        writer = addAnnouncementWriter.value.trim(),
        source = addAnnouncementSource.value.trim(),
        node = document.querySelector("#addAnnouncementContent + div [contenteditable=true]");

    var content = node.innerHTML;

    if (title.length < 2)

        showTip("标题小于2个字符", "label-warning");

    else if (writer.length < 2)

        showTip("作者小于2个字符", "label-warning");

    else if (content.length === 0)

        showTip("内容不能为空", "label-warning");

    else {

        addAnnouncementTitle.value = "";
        node.innerHTML = "";

        $('#addAnnouncement').modal('hide');

        $.post("/addAnnouncement",
            {
                title: title,
                writer: writer,
                source: source,
                content: content,
                type: type
            },
            function (res) {

                if (res.rc === 0) {

                    showTip("添加成功");

                    getAnnouncement({projection: {content: 0}, tip: false});

                } else

                    showTip("添加失败", "label-warning");
            });
    }
}

function getAnnouncement(options) {

    options = options || {};

    var option = announcementCurrent.option,
        paginationNode = announcementCurrent.paginationNode,
        name = announcementCurrent.name;

    var query = {};

    if (option.title.length > 0)

        query.title = {$regex: option.title};

    if (option.writer.length > 0)

        query.writer = {$regex: option.writer};

    if (option.source.length > 0)

        query.source = {$regex: option.source};

    options.query = options.query || query;
    options.query.type = String(option.type);
    options.projection = options.projection || {};

    $.get("/getAnnouncement", {
        limit: option.limit,
        skip: option.page * option.limit,
        query: JSON.stringify(options.query),
        projection: JSON.stringify({projection: options.projection})
    }, function (res) {

        if (res.rc === 0) {

            var html = "";

            var count = parseInt(res.count / option.limit);
            var page = option.page;

            if (res.count % option.limit > 0)

                count++;

            var pagination = page === 0 ?
                '<li class="disabled"><a href="#"><span aria-hidden="true">«</span></a></li>' +
                '<li class="disabled"><a href="#"><span aria-hidden="true">‹</span></a></li>' :
                '<li><a href="#" data-page="0"><span aria-hidden="true">«</span></a></li>' +
                '<li><a href="#" data-page="' + (page - 1) + '"><span aria-hidden="true">‹</span></a></li>';

            var start = 0, end = count;

            if (end > 4) {

                if (page < 2) {

                    end = 5;

                } else if (page > end - 3) {

                    start = end - 5;

                } else {

                    start = page - 2;
                    end = page + 3;
                }
            }

            for (var i = start; i < end; i++) {

                pagination += page === i ?
                    '<li class="active"><a href="#">' + (i + 1) + '</a></li>' : '<li><a href="#" data-page="' + i + '">' + (i + 1) + '</a></li>';
            }

            pagination += page === count - 1 ?
                '<li class="disabled"><a href="#"><span aria-hidden="true">›</span></a></li>' +
                '<li class="disabled"><a href="#"><span aria-hidden="true">»</span></a></li>' :
                '<li><a href="#" data-page="' + (page + 1) + '"><span aria-hidden="true">›</span></a></li>' +
                '<li><a href="#" data-page="' + (count - 1) + '"><span aria-hidden="true">»</span></a></li>';

            if (paginationNode)

                paginationNode.innerHTML = pagination;

            else

                announcementPagination.innerHTML = pagination;

            res.data.forEach(function (data, i) {

                html += '<tr><th scope="row">' + (i + 1) + '</th><td>' + data.title + '</td>' +
                    '<td>' + data.writer + '</td><td>' + data.source + '</td><td>' + new Date(data.time).format("yyyy-MM-dd hh:mm:ss") + '</td>' +
                    '<td class="operation" data-id="' + data._id + '" data-title="' + data.title + '" data-writer="' + data.writer + '" data-source="' + data.source + '">' +
                    '<span class="glyphicon1 glyphicon glyphicon-circle-arrow-up color-info" data-action="up"></span>' +
                    '<span class="glyphicon1 glyphicon glyphicon-remove-sign color-danger" data-action="del"></span>' +
                    '<span class="glyphicon1 glyphicon glyphicon glyphicon-info-sign color-primary" data-action="edit"' +
                    'data-toggle="modal" data-target="#editAnnouncement"></span>' +
                    '</td></tr>';
            });

            document.querySelector((name || "#announcement") + " tbody").innerHTML = html;

            if (options.tip !== false)

                showTip("获取公告成功");

        } else

            showTip("获取公告失败", "label-warning");
    });
}

function editAnnouncement(id) {

    var title = editAnnouncementTitle.value.trim(),
        writer = editAnnouncementWriter.value.trim(),
        source = editAnnouncementSource.value.trim(),
        node = document.querySelector("#editAnnouncementContent + div [contenteditable=true]");

    var content = node.innerHTML;

    if (title.length < 2)

        showTip("标题小于2个字符", "label-warning");

    else if (writer.length < 2)

        showTip("作者小于2个字符", "label-warning");

    else if (content.length === 0)

        showTip("内容不能为空", "label-warning");

    else {

        announcementOperation.update({_id: id}, {title: title, writer: writer, source: source, content: content});

        $('#editAnnouncement').modal('hide');
    }
}

var imgNodeOptions = {limit: 20, page: 0, title: ""};

var imgNodeOptions2 = {limit: 10, page: 0, title: ""};

function addImage() {

    var title = addImgNodeTitle.value.trim();
    var image = addImgNodePic.files[0];

    if (image) {

        post("/addImages", {title: title, image: image}, function (res) {

            if (res.rc === 0) {

                if (addImgNode.insert === true) {

                    addImgNode.insert = false;

                    res.src = res.src.replace("wwwroot", "");

                    if (navigator.userAgent.match(/MSIE/i) || navigator.userAgent.match(/Windows NT.*Trident\//)) {
                        var imageStr = '<img src="' + res.src + '"/>'
                        methods.restoreSelection.apply(this, [imageStr, 'html'])
                    } else {
                        document.execCommand('insertimage', false, res.src);
                    }

                } else {

                    showTip("添加成功");

                    getImages(true);

                    getImages2();
                }

            } else

                showTip("添加失败", "label-warning");
        });

        $('#addImgNode').modal('hide');

    } else

        showTip("请选择图片", "label-warning");
}

function getImages(options) {

    options = options || {};

    var query = {};

    if (imgNodeOptions.title.length > 0)

        query.title = {$regex: imgNodeOptions.title};

    options.query = options.query || query;
    options.projection = options.projection || {};

    $.get("/getImages", {
        limit: imgNodeOptions.limit,
        skip: imgNodeOptions.page * imgNodeOptions.limit,
        query: JSON.stringify(options.query),
        projection: JSON.stringify({projection: options.projection})
    }, function (res) {

        if (res.rc === 0) {

            var html = "";

            var count = parseInt(res.count / imgNodeOptions.limit);
            var page = imgNodeOptions.page;

            if (res.count % imgNodeOptions.limit > 0)

                count++;

            var pagination = page === 0 ?
                '<li class="disabled"><a href="#"><span aria-hidden="true">«</span></a></li>' +
                '<li class="disabled"><a href="#"><span aria-hidden="true">‹</span></a></li>' :
                '<li><a href="#" data-page="0"><span aria-hidden="true">«</span></a></li>' +
                '<li><a href="#" data-page="' + (page - 1) + '"><span aria-hidden="true">‹</span></a></li>';

            var start = 0, end = count;

            if (end > 4) {

                if (page < 2) {

                    end = 5;

                } else if (page > end - 3) {

                    start = end - 5;

                } else {

                    start = page - 2;
                    end = page + 3;
                }
            }

            for (var i = start; i < end; i++) {

                pagination += page === i ?
                    '<li class="active"><a href="#">' + (i + 1) + '</a></li>' : '<li><a href="#" data-page="' + i + '">' + (i + 1) + '</a></li>';
            }

            pagination += page === count - 1 ?
                '<li class="disabled"><a href="#"><span aria-hidden="true">›</span></a></li>' +
                '<li class="disabled"><a href="#"><span aria-hidden="true">»</span></a></li>' :
                '<li><a href="#" data-page="' + (page + 1) + '"><span aria-hidden="true">›</span></a></li>' +
                '<li><a href="#" data-page="' + (count - 1) + '"><span aria-hidden="true">»</span></a></li>';

            imagesPagination.innerHTML = pagination;

            res.data.forEach(function (data, i) {

                var src = data.src.substr(data.src.indexOf("\\"));

                html += '<tr><th scope="row">' + (i + 1) + '</th><td>' + data.title + '</td><td>' + src + '</td>' +
                    '<td>' + new Date(data.time).format("yyyy-MM-dd hh:mm:ss") + '</td><td><img style="max-width: 32em;" src="' + src + '"/></td>' +
                    '<td class="operation" data-id="' + data._id + '" data-src="' + data.src + '">' +
                    '<span class="glyphicon1 glyphicon glyphicon-remove-sign color-danger" data-action="del"></span>' +
                    '</td></tr>';
            });

            document.querySelector("#imgNode tbody").innerHTML = html;

            if (options.tip !== false)

                showTip("获取图库成功");

        } else

            showTip("获取图库失败", "label-warning");
    });
}

function getImages2() {

    $.get("/getImages", {
        limit: imgNodeOptions2.limit,
        skip: imgNodeOptions2.page * imgNodeOptions2.limit,
        query: JSON.stringify(imgNodeOptions2.title.length ? {title: {$regex: imgNodeOptions2.title}} : {}),
        projection: JSON.stringify({projection: {title: 1, src: 1}})
    }, function (res) {

        if (res.rc === 0) {

            var html = "";

            var count = parseInt(res.count / imgNodeOptions2.limit);
            var page = imgNodeOptions2.page;

            if (res.count % imgNodeOptions2.limit > 0)

                count++;

            var pagination = page === 0 ?
                '<li class="disabled"><a href="#"><span aria-hidden="true">«</span></a></li>' +
                '<li class="disabled"><a href="#"><span aria-hidden="true">‹</span></a></li>' :
                '<li><a href="#" data-page="0"><span aria-hidden="true">«</span></a></li>' +
                '<li><a href="#" data-page="' + (page - 1) + '"><span aria-hidden="true">‹</span></a></li>';

            var start = 0, end = count;

            if (end > 4) {

                if (page < 2) {

                    end = 5;

                } else if (page > end - 3) {

                    start = end - 5;

                } else {

                    start = page - 2;
                    end = page + 3;
                }
            }

            for (var i = start; i < end; i++) {

                pagination += page === i ?
                    '<li class="active"><a href="#">' + (i + 1) + '</a></li>' : '<li><a href="#" data-page="' + i + '">' + (i + 1) + '</a></li>';
            }

            pagination += page === count - 1 ?
                '<li class="disabled"><a href="#"><span aria-hidden="true">›</span></a></li>' +
                '<li class="disabled"><a href="#"><span aria-hidden="true">»</span></a></li>' :
                '<li><a href="#" data-page="' + (page + 1) + '"><span aria-hidden="true">›</span></a></li>' +
                '<li><a href="#" data-page="' + (count - 1) + '"><span aria-hidden="true">»</span></a></li>';

            imagesNodePagination.innerHTML = pagination;

            res.data.forEach(function (data, i) {

                var src = data.src.substr(data.src.indexOf("\\"));

                html += '<tr><th scope="row"><input type="checkbox" value="' + src + '"></th><td>' + data.title + '</td>' +
                    '<td><img style="max-height: 6rem;" src="' + src + '"/></td>' +
                    '</tr>';
            });

            document.querySelector("#imagesNode tbody").innerHTML = html;

            showTip("获取图库成功");

        } else

            showTip("获取图库失败", "label-warning");
    });
}

function showTip(msg, color) {

    color = color || "label-info";

    requestAnimationFrame(function () {

        tipNode.style.transition = "initial";

        tipNode.className = "label " + color;

        tipNode.innerHTML = msg;

        requestAnimationFrame(function () {

            tipNode.style.transition = "";

            tipNode.className = "label " + color + " opacity-0";
        });
    });
}

function post(url, data, fn) {

    var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    if (typeof fn === "function") {

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {

                if (xhr.status === 200) {

                    try {

                        fn(JSON.parse(xhr.responseText));

                    } catch (e) {

                        fn(xhr.responseText);
                    }
                }
            }
        };
    }

    xhr.open("POST", url, true);

    var f = document.createElement("form");

    f.enctype = "multipart/form-data";

    var fd = new FormData(f);

    for (var attr in data)

        if (data.hasOwnProperty(attr))

            fd.append(attr, data[attr]);

    xhr.send(fd);
}

if (typeof Date.format === "undefined")

    Date.prototype.format = function (fmt) {

        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };

        if (/(y+)/.test(fmt))

            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

        for (var k in o)

            if (new RegExp("(" + k + ")").test(fmt))

                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

        return fmt;
    };

// post("/query", {
//     limit: 2,//行数
//     skip: 0,//起始位置
//     query: JSON.stringify({}),//{key: value}支持模糊查询
//     projection: JSON.stringify({"projection": {"content": 0}}),//显示列：1、显示，0、隐藏
//     collection: "announcement"//暂时允许访问：announcement、homeBanner
// }, function (res) {
//
//     console.log(res);
// });