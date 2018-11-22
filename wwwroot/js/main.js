var _phone = /^1[3456789]\d{9}$/;

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll("input[type=\"file\"][accept=\"image/*\"]").forEach(function (input) {

        if (input.previousElementSibling && input.previousElementSibling.tagName === "IMG") {

            var img = input.previousElementSibling;

            img.onerror = function () {

                this.src = "/img/0.png";
            };

            input.onchange = function () {

                var fr = new FileReader();

                fr.onload = function () {

                    img.src = fr.result;
                };

                fr.readAsDataURL(this.files[0]);
            };
        }
    });

    $(document).on("click", "table.leadership .operation > span", function () {

        if (leadershipOperation.hasOwnProperty(this.dataset.action)) {

            leadershipOperation[this.dataset.action](this.parentNode.dataset, this);
        }
    });

    $(document).on("click", "#leadershipNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            leadershipOptions.page = parseInt(this.dataset.page);

            getLeadership(true);
        }
    });

    $(document).on("click", "table.department .operation > span", function () {

        if (departmentOperation.hasOwnProperty(this.dataset.action)) {

            departmentOperation[this.dataset.action](this.parentNode.dataset, this);
        }
    });

    $(document).on("click", "#departmentNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            departmentOptions.page = parseInt(this.dataset.page);

            getDepartment(true);
        }
    });

    $(document).on("click", "table.person .operation > span", function () {

        if (personOperation.hasOwnProperty(this.dataset.action)) {

            personOperation[this.dataset.action](this.parentNode.dataset, this);
        }
    });

    $(document).on("click", "#personNode ul.pagination > li > a, #doctorNode ul.pagination > li > a, #nurseNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            personCurrent.options.page = parseInt(this.dataset.page);

            getPerson(true);
        }
    });

    $(document).on("click", "#trendsNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            trendsOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "#recruitmentNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            recruitmentOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "#armamentariumNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            armamentariumOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "#techniqueNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            techniqueOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "#policiesNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            policiesOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "#partyNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            partyOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "#honorNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            honorOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "#staffNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            staffOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "#patientsNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            patientsOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "#healthNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            healthOptions.page = parseInt(this.dataset.page);

            getAnnouncement({projection: {content: 0}});
        }
    });

    $(document).on("click", "table.files .operation > span", function () {

        if (fileOperation.hasOwnProperty(this.dataset.action)) {

            fileOperation[this.dataset.action](this.parentNode.dataset, this);
        }
    });

    $(document).on("click", "#fileNode ul.pagination > li > a", function () {

        if (this.dataset.page) {

            fileNodeOptions.page = parseInt(this.dataset.page);

            getFiles();
        }
    });

    $("#presidentSpeechNode form textarea").Editor();

    $("#historyNode form textarea").Editor();

    $("#treatmentNode form textarea").Editor();

    $("#hospitalNode form textarea").Editor();

    $("#registrationNode form textarea").Editor();

    $("#medicineNode form textarea").Editor();

    $("#contactNode form textarea").Editor();

    $("#introductionNode form textarea").Editor();

    $("#outpatientNode form textarea").Editor();

    // $("#honorNode form textarea").Editor();

    $("#addDepartmentNode form textarea").Editor();

    $("#editDepartmentNode form textarea").Editor();
});

function addLeadership() {

    var form = document.querySelector("#addLeadershipNode form");

    var name = form.realname.value.trim();
    var position = form.position.value.trim();
    var img = form.img.files[0];
    var detail = form.detail.value;

    if (name.length < 2)

        showTip("姓名小于2个字符", "label-warning");

    else if (position.length < 2)

        showTip("职位小于2个字符", "label-warning");

    else {

        post("/insert", {
            image: img,
            name: name,
            position: position,
            detail: detail,
            collection: "leadership"
        }, function (res) {

            if (res.rc === 0) {

                showTip("添加班子成员成功");

                getLeadership(true);
            }
        });

        form.img.previousElementSibling.src = "";

        requestAnimationFrame(function () {

            form.img.type = "";

            requestAnimationFrame(function () {

                form.img.type = "file";
            });
        });

        $('#addLeadershipNode').modal('hide');
    }
}

function editLeadership() {

    var form = document.querySelector("#editLeadershipNode form");

    var name = form.realname.value.trim();
    var id = form.realname.dataset.id;
    var position = form.position.value.trim();
    var img = form.img.files[0];
    var src = form.img.dataset.src;
    var detail = form.detail.value;

    if (name.length < 2)

        showTip("姓名小于2个字符", "label-warning");

    else if (position.length < 2)

        showTip("职位小于2个字符", "label-warning");

    else

        post("/update", {
                collection: "leadership",
                query: JSON.stringify({_id: id}),
                data: JSON.stringify({name: name, position: position, detail: detail, src: src}),
                image: img
            },
            function (res) {

                if (res.rc === 0) {

                    showTip("保存成功");

                    getLeadership(true);

                } else

                    showTip("保存失败", "label-warning");
            });

    $('#editLeadershipNode').modal('hide');
}

var leadershipOptions = {limit: 20, page: 0, name: "", position: ""};

var leadershipOperation = {

    up: function (data, node) {

        node = node.parentNode;

        this.update({_id: node.dataset.id}, {time: Date.now()});
    },

    del: function (data) {

        if (confirm("该操作不能撤销你确认删除？")) {

            var query = {_id: data.id, src: data.src};

            $.post("/delete", {
                    collection: "leadership",
                    query: JSON.stringify(query)
                },
                function (res) {

                    if (res.rc === 0) {

                        showTip("删除成功");

                        getLeadership(true);

                    } else

                        showTip("删除失败", "label-warning");
                });
        }
    },

    edit: function (data) {

        var form = document.querySelector("#editLeadershipNode form");

        form.realname.value = data.name;
        form.realname.dataset.id = data.id;
        form.position.value = data.position;
        form.detail.value = data.detail;
        form.img.dataset.src = data.src;
        form.querySelector("img.img-thumbnail").src = clearSrc(data.src);

        requestAnimationFrame(function () {

            form.img.type = "";

            requestAnimationFrame(function () {

                form.img.type = "file";
            });
        });
    },

    update: function (query, data) {

        $.post("/update1", {
                collection: "leadership",
                query: JSON.stringify(query),
                data: JSON.stringify(data)
            },
            function (res) {

                if (res.rc === 0) {

                    showTip("保存成功");

                    getLeadership(true);

                } else

                    showTip("保存失败", "label-warning");
            });
    }
};

pageAction.leadershipNode = getLeadership;

function getLeadership(noTip) {

    var query = {};

    if (leadershipOptions.name.length > 0)

        query.name = {$regex: leadershipOptions.name};

    if (leadershipOptions.position.length > 0)

        query.position = {$regex: leadershipOptions.position};

    post("/query", {
        limit: leadershipOptions.limit,
        skip: leadershipOptions.page * leadershipOptions.limit,
        query: JSON.stringify(query),
        collection: "leadership"
    }, function (res) {

        if (res.rc === 0) {

            initPagination(leadershipNode.querySelector(".pagination"), leadershipOptions, res.count);

            var html = "";

            res.data.forEach(function (data, i) {

                html += '<tr><th scope="row">' + (i + 1) +
                    '</th><td><img class="img-thumbnail img2"' + (data.src ? ' src="' + data.src.substr(7) + '"' : "") + '" /></td>' +
                    '<td>' + data.name + '</td><td>' + data.position + '</td><td>' + data.detail.substr(0, 10) + (data.detail.length > 10 ? "..." : "") + '</td>' +
                    '<td class="operation" data-id="' + data._id + '" data-src="' + data.src + '" data-name="' + data.name
                    + '" data-position="' + data.position + '" data-detail="' + data.detail + '">' +
                    '<span class="glyphicon1 glyphicon glyphicon-circle-arrow-up color-info" data-action="up"></span>' +
                    '<span class="glyphicon1 glyphicon glyphicon-remove-sign color-danger" data-action="del"></span>' +
                    '<span class="glyphicon1 glyphicon glyphicon glyphicon-info-sign color-primary" data-action="edit"' +
                    'data-toggle="modal" data-target="#editLeadershipNode"></span>' +
                    '</td></tr>';
            });

            document.querySelector("#leadershipNode tbody").innerHTML = html;

            if (noTip !== true)

                showTip("获取领导班子成功");
        }
    });
}

function filterLeadership() {

    var form = document.querySelector("#leadershipNode form");

    leadershipOptions.name = form.realname.value.trim();
    leadershipOptions.position = form.position.value.trim();
    leadershipOptions.page = 0;

    getLeadership();
}

function initPagination(node, option, COUNT) {

    var count = parseInt(COUNT / option.limit);
    var page = option.page;

    if (COUNT % option.limit > 0)

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

    node.innerHTML = pagination;
}

function clearSrc(src) {

    if (src && src.indexOf("wwwroot\\") === 0 || src && src.indexOf("wwwroot/") === 0)

        return src.substr(7);

    else

        return src;
}

pageAction.presidentSpeechNode = getSpecial;

pageAction.historyNode = getSpecial;

pageAction.treatmentNode = getSpecial;

pageAction.hospitalNode = getSpecial;

pageAction.registrationNode = getSpecial;

pageAction.medicineNode = getSpecial;

pageAction.contactNode = getSpecial;

pageAction.introductionNode = getSpecial;

pageAction.outpatientNode = getSpecial;

// pageAction.honorNode = getSpecial;

function getSpecial(node) {

    post("/query", {
        limit: 1,
        skip: 0,
        query: JSON.stringify({title: node.firstElementChild.innerText.trim()}),
        collection: "special"
    }, function (res) {

        if (res.rc === 0) {

            node.querySelector(".Editor-container [contenteditable=true]").innerHTML = res.data[0].content;

            showTip("获取数据成功");
        }
    });
}

function setSpecial(node) {

    var content = node.form.parentElement.querySelector(".Editor-container [contenteditable=true]").innerHTML;

    if (content.length < 2)

        showTip("内容小于2个字符", "label-warning");

    else

        post("/update", {
                collection: "special",
                query: JSON.stringify({title: node.form.previousElementSibling.innerText.trim()}),
                data: JSON.stringify({content: content})
            },
            function (res) {

                if (res.rc === 0)

                    showTip("保存成功");

                else

                    showTip("保存失败", "label-warning");
            });
}

var departmentOptions = {limit: 20, page: 0, name: "", class: ""};

var departmentOperation = {

    del: function (data) {

        if (confirm("该操作不能撤销你确认删除？")) {

            var query = {_id: data.id, src: data.src};

            $.post("/delete", {
                    collection: "department",
                    query: JSON.stringify(query)
                },
                function (res) {

                    if (res.rc === 0) {

                        showTip("删除成功");

                        getDepartment(true);

                    } else

                        showTip("删除失败", "label-warning");
                });
        }
    },

    edit: function (data) {

        var form = document.querySelector("#editDepartmentNode form");

        requestAnimationFrame(function () {

            form.img.type = "";

            requestAnimationFrame(function () {

                form.img.type = "file";
            });
        });

        post("/select", {
            collection: "department",
            query: JSON.stringify({_id: data.id})
        }, function (res) {

            if (res.rc === 0) {

                showTip("获取数据成功");

                form.name1.value = res.data.name;
                form.name1.dataset.id = res.data._id;
                form.class1.value = res.data.class;
                form.tel.value = res.data.tel;
                form.img.previousElementSibling.src = clearSrc(res.data.src);
                form.img.dataset.src = res.data.src;
                document.querySelector("#editDepartmentNode .Editor-container [contenteditable=true]").innerHTML = res.data.content;

            } else

                showTip("获取数据失败", "label-warning");
        });
    }
};

pageAction.departmentNode = getDepartment;

function addDepartment() {

    var form = document.querySelector("#addDepartmentNode form");

    var name = form.name1.value.trim();
    var class1 = form.class1.value.trim();
    var tel = form.tel.value.trim();
    var img = form.img.files[0];
    var content = form.querySelector(".Editor-container [contenteditable=true]").innerHTML;

    if (name.length < 2)

        showTip("名称小于2个字符", "label-warning");

    else {

        post("/insert", {
            image: img,
            name: name,
            class: class1,
            tel: tel,
            content: content,
            collection: "department"
        }, function (res) {

            if (res.rc === 0) {

                showTip("添加班子成员成功");

                getDepartment(true);
            }
        });

        form.img.previousElementSibling.src = "";

        requestAnimationFrame(function () {

            form.img.type = "";

            requestAnimationFrame(function () {

                form.img.type = "file";
            });
        });

        $('#addDepartmentNode').modal('hide');
    }
}

function editDepartment() {

    var form = document.querySelector("#editDepartmentNode form");

    var name = form.name1.value.trim();
    var id = form.name1.dataset.id;
    var class1 = form.class1.value.trim();
    var tel = form.tel.value.trim();
    var img = form.img.files[0];
    var src = form.img.dataset.src;
    var content = form.querySelector(".Editor-container [contenteditable=true]").innerHTML;

    if (name.length < 2)

        showTip("名称小于2个字符", "label-warning");

    else {

        post("/update", {
                collection: "department",
                query: JSON.stringify({_id: id}),
                data: JSON.stringify({name: name, class: class1, tel: tel, content: content, src: src}),
                image: img
            },
            function (res) {

                if (res.rc === 0) {

                    showTip("保存成功");

                    getDepartment(true);

                } else

                    showTip("保存失败", "label-warning");
            });

        $('#editDepartmentNode').modal('hide');
    }
}

function getDepartment(noTip) {

    var query = {};

    if (departmentOptions.name.length > 0)

        query.name = {$regex: departmentOptions.name};

    if (departmentOptions.class.length > 0)

        query.class = {$regex: departmentOptions.class};

    post("/query", {
        limit: departmentOptions.limit,
        skip: departmentOptions.page * departmentOptions.limit,
        query: JSON.stringify(query),
        projection: JSON.stringify({projection: {name: 1, class: 1, src: 1}}),
        sort: JSON.stringify({name: 1}),
        collection: "department"
    }, function (res) {

        if (res.rc === 0) {

            initPagination(departmentNode.querySelector(".pagination"), departmentOptions, res.count);

            var html = "";

            res.data.forEach(function (data, i) {

                html += '<tr><th scope="row">' + (i + 1) +
                    '</th><td>' + data.name + '</td><td>' + data.class + '</td>' +
                    '<td class="operation" data-id="' + data._id + '" data-src="' + data.src + '">' +
                    '<span class="glyphicon1 glyphicon glyphicon-remove-sign color-danger" data-action="del"></span>' +
                    '<span class="glyphicon1 glyphicon glyphicon glyphicon-info-sign color-primary" data-action="edit"' +
                    'data-toggle="modal" data-target="#editDepartmentNode"></span>' +
                    '</td></tr>';
            });

            document.querySelector("#departmentNode tbody").innerHTML = html;

            if (noTip !== true)

                showTip("获取科室成功");
        }
    });
}

function filterDepartment() {

    var form = document.querySelector("#departmentNode form");

    departmentOptions.name = form.name1.value.trim();
    departmentOptions.class = form.class1.value.trim();
    departmentOptions.page = 0;

    getDepartment();
}

var personCurrent = {};

var personOptions = {
    limit: 20,
    page: 0,
    name: "",
    department: "",
    tel: "",
    duty: "",
    title: "",
    position: "",
    type: "1"
};

var doctorOptions = {
    limit: 20,
    page: 0,
    name: "",
    department: "",
    tel: "",
    duty: "",
    title: "",
    position: "",
    type: "2"
};

var nurseOptions = {
    limit: 20,
    page: 0,
    name: "",
    department: "",
    tel: "",
    duty: "",
    title: "",
    position: "",
    type: "3"
};

var personOperation = {

    del: function (data) {

        if (confirm("该操作不能撤销你确认删除？")) {

            var query = {_id: data.id, src: data.src};

            $.post("/delete", {
                    collection: "person",
                    query: JSON.stringify(query)
                },
                function (res) {

                    if (res.rc === 0) {

                        showTip("删除成功");

                        getPerson(true);

                    } else

                        showTip("删除失败", "label-warning");
                });
        }
    },

    edit: function (data) {

        var form = document.querySelector("#editPersonNode form");

        requestAnimationFrame(function () {

            form.img.type = "";

            requestAnimationFrame(function () {

                form.img.type = "file";
            });
        });

        getDepartmentList(editPersonNode, function () {

            post("/select", {
                collection: "person",
                query: JSON.stringify({_id: data.id})
            }, function (res) {

                if (res.rc === 0) {

                    showTip("获取数据成功");

                    form.name1.value = res.data.name;
                    form.name1.dataset.id = res.data._id;
                    form.department.value = res.data.department;
                    form.tel.value = res.data.tel;
                    form.img.previousElementSibling.src = clearSrc(res.data.src);
                    form.img.dataset.src = res.data.src;
                    form.duty.value = res.data.duty;
                    form.title.value = res.data.title;
                    form.position.value = res.data.position;
                    form.adept.value = res.data.adept;
                    form.detail.value = res.data.detail;

                } else

                    showTip("获取数据失败", "label-warning");
            });
        });
    }
};

pageAction.personNode = function () {

    personCurrent.options = personOptions;
    personCurrent.node = personNode;

    getPerson();
};

pageAction.doctorNode = function () {

    personCurrent.options = doctorOptions;
    personCurrent.node = doctorNode;

    getPerson();
};

pageAction.nurseNode = function () {

    personCurrent.options = nurseOptions;
    personCurrent.node = nurseNode;

    getPerson();
};

function getDepartmentList(select, fn) {

    post("/query", {
        limit: 1000,
        skip: 0,
        projection: JSON.stringify({projection: {name: 1}}),
        sort: JSON.stringify({name: 1}),
        collection: "department"
    }, function (res) {

        if (res.rc === 0) {

            var temp = {};

            select = select.querySelector("form select");

            var html = '<option value="">请选择科室</option>';

            res.data.forEach(function (data) {

                if (!temp.hasOwnProperty(data.name)) {

                    temp[data.name] = 1;

                    html += '<option value="' + data.name + '">' + data.name + '</option>';
                }
            });

            select.innerHTML = html;

            if (fn)

                fn();
        }
    });
}

function addPerson() {

    var form = document.querySelector("#addPersonNode form");

    var name = form.name1.value.trim();
    var department = form.department.value.trim();
    var tel = form.tel.value.trim();
    var img = form.img.files[0];
    var duty = form.duty.value.trim();
    var title = form.title.value.trim();
    var position = form.position.value.trim();
    var adept = form.adept.value;
    var detail = form.detail.value;

    if (name.length < 2)

        showTip("姓名小于2个字符", "label-warning");

    else if (!(_phone.test(tel)))

        showTip("电话号码格式有误", "label-warning");

    else if (department.length === 0)

        showTip("请选择科室", "label-warning");

    else if (duty.length < 2)

        showTip("职务小于2个字符", "label-warning");

    else {

        post("/insert", {
            image: img,
            name: name,
            department: department,
            tel: tel,
            pwd: md5(tel.substr(tel.length - 6)),
            duty: duty,
            title: title,
            position: position,
            adept: adept,
            detail: detail,
            type: personCurrent.options.type,
            collection: "person"
        }, function (res) {

            if (res.rc === 0) {

                showTip("添加成功");

                getPerson(true);

                form.img.previousElementSibling.src = "";

                requestAnimationFrame(function () {

                    form.img.type = "";

                    requestAnimationFrame(function () {

                        form.img.type = "file";
                    });
                });

                $('#addPersonNode').modal('hide');

            } else

                showTip(res.rm, "label-danger");
        });
    }
}

function editPerson() {

    var form = document.querySelector("#editPersonNode form");

    var name = form.name1.value.trim();
    var id = form.name1.dataset.id;
    var department = form.department.value.trim();
    var tel = form.tel.value.trim();
    var img = form.img.files[0];
    var src = form.img.dataset.src;
    var duty = form.duty.value.trim();
    var title = form.title.value.trim();
    var position = form.position.value.trim();
    var adept = form.adept.value;
    var detail = form.detail.value;

    if (name.length < 2)

        showTip("姓名小于2个字符", "label-warning");

    else if (!(_phone.test(tel)))

        showTip("电话号码格式有误", "label-warning");

    else if (department.length === 0)

        showTip("请选择科室", "label-warning");

    else if (duty.length < 2)

        showTip("职务小于2个字符", "label-warning");

    else {

        post("/update", {
                collection: "person",
                query: JSON.stringify({_id: id}),
                data: JSON.stringify({
                    name: name, department: department, tel: tel, duty: duty, src: src, title: title,
                    position: position, adept: adept, detail: detail
                }),
                image: img
            },
            function (res) {

                if (res.rc === 0) {

                    showTip("保存成功");

                    getPerson(true);

                } else

                    showTip("保存失败", "label-warning");
            });

        $('#editPersonNode').modal('hide');
    }
}

function getPerson(noTip) {

    var query = {}, option = personCurrent.options, node = personCurrent.node;

    if (option.name.length > 0)

        query.name = {$regex: option.name};

    if (option.tel.length > 0)

        query.tel = {$regex: option.tel};

    if (option.department.length > 0)

        query.department = {$regex: option.department};

    if (option.duty.length > 0)

        query.duty = {$regex: option.duty};

    if (option.title.length > 0)

        query.title = {$regex: option.title};

    if (option.position.length > 0)

        query.position = {$regex: option.position};

    query.type = personCurrent.options.type;

    post("/query", {
        limit: option.limit,
        skip: option.page * option.limit,
        query: JSON.stringify(query),
        projection: JSON.stringify({
            projection: {
                name: 1,
                tel: 1,
                department: 1,
                duty: 1,
                title: 1,
                position: 1,
                src: 1
            }
        }),
        sort: JSON.stringify({name: 1}),
        collection: "person"
    }, function (res) {

        if (res.rc === 0) {

            initPagination(node.querySelector(".pagination"), option, res.count);

            var html = "";

            res.data.forEach(function (data, i) {

                html += '<tr><th scope="row">' + (i + 1) +
                    '</th><td><img class="img-thumbnail img3" src="' + clearSrc(data.src) + '" /></td><td>' + data.name + '</td>' +
                    '<td>' + data.tel + '</td><td>' + data.department + '</td><td>' + data.duty + '</td>' +
                    '<td>' + data.title + '</td><td>' + data.position + '</td>' +
                    '<td class="operation" data-id="' + data._id + '" data-src="' + data.src + '">' +
                    '<span class="glyphicon1 glyphicon glyphicon-remove-sign color-danger" data-action="del"></span>' +
                    '<span class="glyphicon1 glyphicon glyphicon glyphicon-info-sign color-primary" data-action="edit"' +
                    'data-toggle="modal" data-target="#editPersonNode"></span>' +
                    '</td></tr>';
            });

            node.querySelector("tbody").innerHTML = html;

            if (noTip !== true)

                showTip("获取成功");
        }
    });
}

function filterPerson() {

    var form = personCurrent.node.querySelector("form");

    personCurrent.options.name = form.name1.value.trim();
    personCurrent.options.department = form.department.value.trim();
    personCurrent.options.tel = form.tel.value.trim();
    personCurrent.options.duty = form.duty.value.trim();
    personCurrent.options.title = form.title.value.trim();
    personCurrent.options.position = form.position.value.trim();
    personCurrent.options.page = 0;

    getPerson();
}

var trendsOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 2};

pageAction.trendsNode = function () {

    announcementCurrent = {
        option: trendsOptions,
        paginationNode: document.querySelector("#trendsNode .pagination"),
        name: "#trendsNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterTrends() {

    var form = document.querySelector("#trendsNode form");

    trendsOptions.title = form.title.value.trim();
    trendsOptions.writer = form.writer.value.trim();
    trendsOptions.source = form.source.value.trim();
    trendsOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var recruitmentOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 3};

pageAction.recruitmentNode = function () {

    announcementCurrent = {
        option: recruitmentOptions,
        paginationNode: document.querySelector("#recruitmentNode .pagination"),
        name: "#recruitmentNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterRecruitment() {

    var form = document.querySelector("#recruitmentNode form");

    recruitmentOptions.title = form.title.value.trim();
    recruitmentOptions.writer = form.writer.value.trim();
    recruitmentOptions.source = form.source.value.trim();
    recruitmentOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var armamentariumOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 4};

pageAction.armamentariumNode = function () {

    announcementCurrent = {
        option: armamentariumOptions,
        paginationNode: document.querySelector("#armamentariumNode .pagination"),
        name: "#armamentariumNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterArmamentarium() {

    var form = document.querySelector("#armamentariumNode form");

    armamentariumOptions.title = form.title.value.trim();
    armamentariumOptions.writer = form.writer.value.trim();
    armamentariumOptions.source = form.source.value.trim();
    armamentariumOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var techniqueOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 5};

pageAction.techniqueNode = function () {

    announcementCurrent = {
        option: techniqueOptions,
        paginationNode: document.querySelector("#techniqueNode .pagination"),
        name: "#techniqueNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterTechnique() {

    var form = document.querySelector("#techniqueNode form");

    techniqueOptions.title = form.title.value.trim();
    techniqueOptions.writer = form.writer.value.trim();
    techniqueOptions.source = form.source.value.trim();
    techniqueOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var policiesOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 6};

pageAction.policiesNode = function () {

    announcementCurrent = {
        option: policiesOptions,
        paginationNode: document.querySelector("#policiesNode .pagination"),
        name: "#policiesNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterPolicies() {

    var form = document.querySelector("#policiesNode form");

    policiesOptions.title = form.title.value.trim();
    policiesOptions.writer = form.writer.value.trim();
    policiesOptions.source = form.source.value.trim();
    policiesOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var partyOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 7};

pageAction.partyNode = function () {

    announcementCurrent = {
        option: partyOptions,
        paginationNode: document.querySelector("#partyNode .pagination"),
        name: "#partyNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterParty() {

    var form = document.querySelector("#partyNode form");

    partyOptions.title = form.title.value.trim();
    partyOptions.writer = form.writer.value.trim();
    partyOptions.source = form.source.value.trim();
    partyOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var honorOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 8};

pageAction.honorNode = function () {

    announcementCurrent = {
        option: honorOptions,
        paginationNode: document.querySelector("#honorNode .pagination"),
        name: "#honorNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterHonor() {

    var form = document.querySelector("#honorNode form");

    honorOptions.title = form.title.value.trim();
    honorOptions.writer = form.writer.value.trim();
    honorOptions.source = form.source.value.trim();
    honorOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var staffOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 9};

pageAction.staffNode = function () {

    announcementCurrent = {
        option: staffOptions,
        paginationNode: document.querySelector("#staffNode .pagination"),
        name: "#staffNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterStaff() {

    var form = document.querySelector("#staffNode form");

    staffOptions.title = form.title.value.trim();
    staffOptions.writer = form.writer.value.trim();
    staffOptions.source = form.source.value.trim();
    staffOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var patientsOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 10};

pageAction.patientsNode = function () {

    announcementCurrent = {
        option: patientsOptions,
        paginationNode: document.querySelector("#patientsNode .pagination"),
        name: "#patientsNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterPatients() {

    var form = document.querySelector("#patientsNode form");

    patientsOptions.title = form.title.value.trim();
    patientsOptions.writer = form.writer.value.trim();
    patientsOptions.source = form.source.value.trim();
    patientsOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var healthOptions = {limit: 20, page: 0, title: "", writer: "", source: "", type: 11};

pageAction.healthNode = function () {

    announcementCurrent = {
        option: healthOptions,
        paginationNode: document.querySelector("#healthNode .pagination"),
        name: "#healthNode"
    };

    getAnnouncement({projection: {content: 0}, tip: false});
};

function filterHealth() {

    var form = document.querySelector("#healthNode form");

    healthOptions.title = form.title.value.trim();
    healthOptions.writer = form.writer.value.trim();
    healthOptions.source = form.source.value.trim();
    healthOptions.page = 0;

    getAnnouncement({projection: {content: 0}});
}

var fileNodeOptions = {limit: 20, page: 0, title: ""};
var fileNodeOptions2 = {limit: 10, page: 0, title: ""};

pageAction.fileNode = getFiles;

var fileOperation = {

    del: function (data) {

        if (confirm("该操作不能撤销你确认删除？")) {

            $.post("/delFile", {id: data.id, path: data.src}, function (res) {

                if (res.rc === 0) {

                    showTip("删除成功");

                    getFiles(true);

                } else

                    showTip("删除失败", "label-warning");
            });
        }
    }
};

function addFile() {

    var form = document.querySelector("#addFileNode form");

    var title = form.title.value.trim();
    var file = form.file.files[0];

    if (file) {

        post("/addFile", {title: title, image: file}, function (res) {

            if (res.rc === 0) {

                console.log(res);

                if (addImgNode.insert === true) {

                    // addImgNode.insert = false;
                    //
                    // res.src = res.src.replace("wwwroot", "");
                    //
                    // if (navigator.userAgent.match(/MSIE/i) || navigator.userAgent.match(/Windows NT.*Trident\//)) {
                    //     var imageStr = '<img src="' + res.src + '"/>'
                    //     methods.restoreSelection.apply(this, [imageStr, 'html'])
                    // } else {
                    //     document.execCommand('insertimage', false, res.src);
                    // }

                } else {

                    showTip("添加成功");

                    getFiles(true);

                    // getImages2();
                }

            } else

                showTip("添加失败", "label-warning");
        });

        $('#addFileNode').modal('hide');

    } else

        showTip("请选择文件", "label-warning");
}

function getFiles(noTip) {

    var query = {};

    if (fileNodeOptions.title.length > 0)

        query.title = {$regex: fileNodeOptions.title};

    post("/query", {
        limit: fileNodeOptions.limit,
        skip: fileNodeOptions.page * fileNodeOptions.limit,
        query: JSON.stringify(query),
        sort: JSON.stringify({title: 1}),
        collection: "files"
    }, function (res) {

        if (res.rc === 0) {

            initPagination(fileNode.querySelector(".pagination"), fileNodeOptions, res.count);

            var html = "";

            res.data.forEach(function (data, i) {

                html += '<tr><th scope="row">' + (i + 1) + '</th><td>' + data.title + '</td><td>' + clearSrc(data.src) + '</td>' +
                    '<td>' + new Date(data.time).format("yyyy-MM-dd hh:mm:ss") + '</td>' +
                    '<td class="operation" data-id="' + data._id + '" data-src="' + data.src + '">' +
                    '<span class="glyphicon1 glyphicon glyphicon-remove-sign color-danger" data-action="del"></span>' +
                    '</td></tr>';
            });

            fileNode.querySelector("tbody").innerHTML = html;

            if (noTip !== true)

                showTip("获取成功");
        }
    });
}

function getFiles2() {

    var query = {};

    if (fileNodeOptions2.title.length > 0)

        query.title = {$regex: fileNodeOptions2.title};

    post("/query", {
        limit: fileNodeOptions2.limit,
        skip: fileNodeOptions2.page * fileNodeOptions2.limit,
        query: JSON.stringify(query),
        sort: JSON.stringify({title: 1}),
        collection: "files"
    }, function (res) {

        if (res.rc === 0) {

            initPagination(filesNode.querySelector(".pagination"), fileNodeOptions2, res.count);

            var html = "";

            res.data.forEach(function (data) {

                html += '<tr><th scope="row"><input type="checkbox" value="' + clearSrc(data.src) + '" data-title="' + data.title + '"></th><td>' + data.title + '</td>' +
                    '<td>' + new Date(data.time).format("yyyy-MM-dd hh:mm:ss") + '</td>' +
                    '</tr>';
            });

            filesNode.querySelector("tbody").innerHTML = html;

            showTip("获取成功");
        }
    });
}

function filterFiles() {

    var form = document.querySelector("#fileNode form");

    fileNodeOptions.title = form.title.value.trim();
    fileNodeOptions.page = 0;

    getFiles();
}

pageAction.emailNode = function () {

    post("/query", {
        limit: 1,
        skip: 0,
        query: JSON.stringify({title: "医院简介"}),
        collection: "special"
    }, function (res) {

        if (res.rc === 0) {

            document.querySelector("#emailNode input").value = res.data[0].content;

            showTip("获取数据成功");
        }
    });
};

function setEmail(node) {

    if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(node.form.email.value.trim())) {

        post("/update", {
                collection: "special",
                query: JSON.stringify({title: "院长邮箱"}),
                data: JSON.stringify({content: node.form.email.value.trim()})
            },
            function (res) {

                if (res.rc === 0)

                    showTip("保存成功");

                else

                    showTip("保存失败", "label-warning");
            });

    } else

        showTip("邮箱格式不正确", "label-warning");
}