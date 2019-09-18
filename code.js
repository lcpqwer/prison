// 系统名称
// 防撞墙 https://model.3dmomoda.com/models/f4eac8292f144081b74d244f8b2108b9/0/gltf/
// 灯塔 https://model.3dmomoda.com/models/1eef252044d84448941c81dd3ed46b33/0/gltf/
document.title = '监狱系统'
// 设备拖拽与图层展示按钮
// <div class="nav_cont nav_point" title="设备拖拽" id="drag">
//     <div class="nav_show">
//         <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/aa/drag2.png' alt="">
//     </div>
//     <div class="nav_hide">
//         <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/aa/drag1.png' alt="">
//     </div>
// </div>
// <div class="nav_cont nav_point" title="图表展示" id="chartShow">
//     <div class="nav_show">
//         <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/aa/chart2.png' alt="">
//     </div>
//     <div class="nav_hide">
//         <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/aa/charts1.png' alt="">
//     </div>
// </div>
// 防止选中复制
document.oncontextmenu = new Function('event.returnValue=false;'); document.onselectstart = new Function('event.returnValue=false;');
function jumpTo(obj) {
    var objName = obj.id
    var obj = app.query(objName)[0]
    var objParent = obj.parent
    if (objParent.type != 'Campus') {
        app.level.change(objParent)
        //  层级切换飞行结束
        app.on(THING.EventType.LevelFlyEnd, objParent, function (ev) {
            // console.log('飞行结束，开始定位')
            app.camera.position = obj.selfToWorld([0, 0, 2]);
            app.camera.target = obj.position
            app.off(THING.EventType.LevelFlyEnd)
            clickDic[obj.id].marker.visible = true
        }, '层级切换飞行结束');

    } else {
        app.camera.position = obj.selfToWorld([0, 0, 2]);
        app.camera.target = obj.position
        clickDic[obj.id].marker.visible = true
    }
}

// 获取用户id

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    // console.log(window.location.search)
    var r = window.location.search.substr(3).match(reg);  //匹配目标参数
    if (r != null) {
        return unescape(r[2])
    };
    return null; //返回参数值
}
var user_id = getUrlParam('id');
if (!user_id) {
    user_id = 1
}

var peoplE = true;
var urlAll = "http://47.103.34.10:8080"
var i = true;
// 模型链接
// person：狱警 prisoner：犯人 outsider：外来人员 
var model_json = {
    'person': 'https://model.3dmomoda.com/models/899983b6bb294138b9db9df697268c50/0/gltf/',
    'prisoner': 'https://model.3dmomoda.com/models/01bff3f35ba54fc3b106fb16e36771b5/0/gltf/',
    'outsider': 'https://model.3dmomoda.com/models/6CBF92D4ADD14E1DBAD171C29C7FB5A3/0/gltf/',
}
// -------------------------------------------------------
// 封装楼层类
function Floor(obj) {
    // console.log('楼层', obj.floorNum)
    this.obj = obj;
    var panel = new THING.widget.Panel({
        width: "130px",
        // 是否有标题
        hasTitle: true,
        // 设置标题名称
        titleText: obj.parents.query('.Building')[0].id + '  ' + obj.floorNum,
        opacity: 0.5,
        cornerType: 'polyline',
        // isClose: true,
        height: '5px',
    })
    // 创建UIAnchor面板
    this.uiAnchor = app.create({
        // 类型
        type: 'UIAnchor',
        // 父节点设置
        parent: obj,
        // 要绑定的页面的 element 对象
        element: panel.domElement,
        // 设置 localPosition 为 [0, 0, 0]
        localPosition: [0, 0, 0],
        // 指定页面的哪个点放到localPosition位置上(百分比)
        pivot: [-0.2, 2.1]
    })
    this.uiAnchor.visible = false
    panel.on('click', function () {
        app.camera.fit(obj)
    })
}

Floor.prototype.showUI = function (boolValue) {
    this.uiAnchor.visible = boolValue
}
// ----?---------------------------------------------------
// 封装房间类
function Room(obj) {
    this.obj = obj;
    var panel = new THING.widget.Panel({
        width: "130px",
        // 是否有标题
        hasTitle: true,
        // 设置标题名称
        titleText: obj.parents.query('.Building')[0].id + '  ' + obj.id,
        opacity: 0.5,
        cornerType: 'polyline',
        // isClose: true,
        height: '5px',
    })
    // 创建UIAnchor面板
    this.uiAnchor = app.create({
        // 类型
        type: 'UIAnchor',
        // 父节点设置
        parent: obj,
        // 要绑定的页面的 element 对象
        element: panel.domElement,
        // 设置 localPosition 为 [0, 0, 0]
        localPosition: [0, 0, 0],
        // 指定页面的哪个点放到localPosition位置上(百分比)
        pivot: [-0.2, 2.1]
    })
    this.uiAnchor.visible = false
    panel.on('click', function () {
        app.camera.fit(obj)
    })
}

Room.prototype.showUI = function (boolValue) {
    this.uiAnchor.visible = boolValue
}

// -------------------------------------------------------
// 封装建筑类
function Build(obj) {
    this.obj = obj;
    var panel = new THING.widget.Panel({
        width: "130px",
        // 是否有标题
        hasTitle: true,
        // 设置标题名称
        titleText: obj.id,
        opacity: 0.5,
        cornerType: 'polyline',
        // isClose: true,
        height: '5px',
    })
    // 创建UIAnchor面板
    this.uiAnchor = app.create({
        // 类型
        type: 'UIAnchor',
        // 父节点设置
        parent: obj,
        // 要绑定的页面的 element 对象
        element: panel.domElement,
        // 设置 localPosition 为 [0, 0, 0]
        localPosition: [0, 0, 0],
        // 指定页面的哪个点放到localPosition位置上(百分比)
        pivot: [-0.2, 2.1]
    })
    this.uiAnchor.visible = false
    panel.on('click', function () {
        app.camera.fit(obj)
    })
}

Build.prototype.showUI = function (boolValue) {
    this.uiAnchor.visible = boolValue
}

// ------------------------------------------------------------
// 摄像头对象封装
function VideoCamera(obj) {
    this.obj = obj;
    this.videoFrame = null;
    this.info = { '编号': obj.name, '状态': '', '操作': '', '': '<button id="' + obj.name + '">播放<button>' }
    var that = this;
    // 创建widget (动态绑定数据用)

    this.marker = app.create({
        type: "Marker",
        offset: [0, 0.25, 0],
        size: 0.25,
        url: '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img2/摄像头.png',
        parent: obj,
        // position: [obj.position[0], 21, obj.position[2]]
        localPosition: [0, 1, 0]
    });
    this.marker.visible = false;
    this.marker.on('click', function () {
        console.log('点击marker')
        that.showPanel()
    });
}

VideoCamera.prototype.showUI = function (boolValue) {
    this.marker.visible = boolValue;
}

VideoCamera.prototype.showVideoFrame = function () {
    if (this.videoFrame) {
        this.videoFrame.destroy();
        this.videoFrame = null;
    }
    // console.log('创建面板')
    this.videoFrame = new THING.widget.Panel({
        template: '7',
        name: this.obj.name,
        closeIcon: true,
        isDrag: true,
        hasTitle: true,
        width: "538px",
        media: true,
    });
    var ui2data = { iframe: true };
    var videoUrlList = ['http://221.228.226.23/11/t/j/v/b/tjvbwspwhqdmgouolposcsfafpedmb/sh.yinyuetai.com/691201536EE4912BF7E4F1E2C67B8119.mp4', 'http://hls.open.ys7.com/openlive/c360540fb29545beac3a163094120402.m3u8'];//乌镇蓝印花布,水长城,黄龙风景名胜区
    this.videoFrame.addIframe(ui2data, 'iframe').name("　").iframeUrl('http://www.thingjs.com/demos/player/player.html?url=' + videoUrlList[1]).setHeight('500px');
    this.videoFrame.setPosition({ left: app.domElement.offsetWidth - this.videoFrame.domElement.offsetWidth - 100, top: 100 });// ui位置默认在 右上角
    this.videoFrame.setZIndex(999999);
    var that = this;
    this.videoFrame.on('close', function () {
        if (that.videoFrame) {
            that.videoFrame.destroy();
            that.videoFrame = null;
        }
    });
}

VideoCamera.prototype.showPanel = function () {
    console.log('showPanel SXT')
    var that = this
    if (this.ui) {
        console.log('UI destory')
        this.ui.destroy()
        this.ui = null
    } else {
        console.log('UI create')
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "230px",
            media: true,
        });
        var btn2 = '无'
        if (sbCaozuo[this.info['编号']].length > 0) {
            btn2 = ''
            sbCaozuo[this.info['编号']].forEach(obj => {
                btn2 = btn2 + '<button>' + obj + '</button>'
            })
        }
        this.info['操作'] = btn2
        this.info['状态'] = sbState[this.info['编号']]
        console.log(this.info)
        for (var key in this.info)
            panel.add(this.info, key);
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            el: panel.domElement,
            offset: [0, this.height + 2, 0],
            pivot: [-0.2, 1.8]
        });
    }
}
// 人员轨迹
var loucsDeviceID, locusName
function locus(obj) {
    loucsDeviceID = obj.id;
    locusName = obj.name
    $('#loucsDeviceID').html(loucsDeviceID)
    $('#locusName').html(locusName)
    $('#test1').attr('value', '')
    $('#test2').value = ''
    $('#peopleGuiji').show()
}

// 周边设备
var surroundID, surroundName
function surround(obj) {
    surroundID = obj.id;
    surroundName = obj.name
    $('#surroundID').html(surroundID)
    $('#surroundName').html(surroundName)
    $('#surround').show()

}

// ---------------------------------------------------
// 狱警对象封装
function Person(obj) {
    this.obj = obj;
    var locusBtn = '<button name="' + obj.name + '" id="' + obj.id + '" onclick="locus(this)">查看轨迹</button>'
    var surroundBtn = '<button name="' + obj.name + '" id="' + obj.id + '" onclick="surround(this)">周边设备</button>'
    this.info = { '编号': obj.id, '姓名': obj.name, '类别': '狱警', '': locusBtn, ' ': surroundBtn };
    var that1 = this
    this.marker = app.create({
        type: "Marker",
        offset: [0, 10, 0],
        size: 5,
        url: '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/b.png',
        parent: obj,
        // position: [obj.position[0], obj.position[1] + 10, obj.position[2]]
        localPosition: [0, 1, 0]
    });
    this.marker.visible = false;
    this.marker.on('click', function () {
        // app.camera.fit(obj)
        that1.showPanel()
    });


}

Person.prototype.showMarker = function (boolValue) {
    this.marker.visible = boolValue;
}



Person.prototype.showPanel = function () {
    if (this.ui) {
        this.ui.destroy()
        this.ui = null
    } else {
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "200px",
            media: true,
            // parent: this.obj
        });
        for (var key in this.info)
            panel.add(this.info, key);



        // 创建obj ui (跟随物体用)
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            el: panel.domElement,
            // offset: [0, this.height + 2, 0],
            // localPosition: [0, 0, 0],
            pivot: [-0.2, 1.8]
        });
    }
}

Person.prototype.showUI = function () {
    if (this.ui) {
        this.ui.destroy()
        this.ui = null
    } else {
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "200px",
            media: true,
            // parent: this.obj
        });
        for (var key in this.info)
            panel.add(this.info, key);



        // 创建obj ui (跟随物体用)
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            el: panel.domElement,
            // offset: [0, this.height + 2, 0],
            // localPosition: [0, 0, 0],
            pivot: [-0.2, 1.8]
        });
    }
}

// ---------------------------------------------------
// 犯人对象封装
function Prisoner(obj) {
    this.obj = obj
    var locusBtn = '<button name="' + obj.name + '" id="' + obj.id + '" onclick="locus(this)">查看轨迹</button>'
    var surroundBtn = '<button name="' + obj.name + '" id="' + obj.id + '" onclick="surround(this)">周边设备</button>'
    this.info = { '编号': obj.id, '姓名': obj.name, '类别': '犯人', '': locusBtn, ' ': surroundBtn };
    this.marker = app.create({
        type: "Marker",
        offset: [0, 1.5, 0],
        size: 1,
        url: '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/a.png',
        parent: obj,
        // position: [obj.position[0], obj.position[1] + 10, obj.position[2]]
        localPosition: [0, 1, 0],
        complete: function () {

        }
    });
    var that = this
    this.marker.visible = false;
    this.marker.on('click', function () {
        that.showUI()
    });
}

Prisoner.prototype.showMarker = function (bool) {
    this.marker.visible = bool
}

Prisoner.prototype.showUI = function () {
    if (this.ui) {
        this.ui.destroy()
        this.ui = null
    } else {
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "200px",
            media: true,
            // parent: this.obj
        });
        for (var key in this.info)
            panel.add(this.info, key);
        // 创建obj ui (跟随物体用)
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            element: panel.domElement,
            offset: [0, this.height + 2, 0],
            localPosition: [0, 0, 0],
            pivot: [-0.2, 1.5]
            // pivot: [-0.2, 1.8]
            // 类型
        });
    }
}
// ---------------------------------------------------
// 外来人员对象封装
function Outsider(obj) {
    this.obj = obj
    var locusBtn = '<button name="' + obj.name + '" id="' + obj.id + '" onclick="locus(this)">查看轨迹</button>'
    var surroundBtn = '<button name="' + obj.name + '" id="' + obj.id + '" onclick="surround(this)">周边设备</button>'
    this.info = { '编号': obj.id, '姓名': obj.name, '类别': '犯人', '': locusBtn, '': surroundBtn };
    this.marker = app.create({
        type: "Marker",
        offset: [0, 10, 0],
        size: 5,
        url: '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/c.png',
        parent: obj,
        // position: [obj.position[0], obj.position[1] + 10, obj.position[2]]
        localPosition: [0, 1, 0],
        complete: function () {

        }
    });
    var that = this
    // this.marker.visible = false;
    this.marker.on('click', function () {
        // app.camera.fit(obj)
        that.showUI()
    });
}

Outsider.prototype.showUI = function () {
    if (this.ui) {
        this.ui.destroy()
        this.ui = null
    } else {
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "200px",
            media: true,
            // parent: this.obj
        });
        for (var key in this.info)
            panel.add(this.info, key);
        // 创建obj ui (跟随物体用)
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            element: panel.domElement,
            offset: [0, this.height + 2, 0],
            localPosition: [0, 0, 0],
            pivot: [-0.2, 1.5]
            // pivot: [-0.2, 1.8]
            // 类型
        });
    }
}
// 查看设备信息
function showMJ(obj) {
    var name = obj.id
    var win = window.open("http://47.103.34.10:8080/record/door/" + name, "123213123", "width=1200px,height=600px,top=100,left=200,menubar=yes,location=yes,scrollbars=yes")//表示不会一直新建窗体，一直都是在名字为abccc的窗体打开（第一次是新建了一个abccc的窗体，之后就不会再创建）
    win.moveTo(200, 200);
}

// ---------------------------------------------------
// 门禁对象封装
function MJ(obj) {
    this.obj = obj;
    var lishiBtn = '<button id="' + obj.name + '" onclick="showMJ(this)">历史信息</button>'
    this.info = { '编号': obj.name, '类别': obj.a, '操作': '', '': lishiBtn };
    var that = this
    this.marker = app.create({
        type: "Marker",
        offset: [0, 0.25, 0],
        size: 0.25,
        url: '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img2/门禁.png',
        parent: obj,
        // position: [obj.position[0], 30, obj.position[2]]
        localPosition: [0, 1, 0]
    });
    this.marker.visible = false;
    this.marker.on('click', function () {
        that.showPanel()
        // app.camera.fit(obj)

    });

}



MJ.prototype.showUI = function (boolValue) {
    this.marker.visible = boolValue;
}

MJ.prototype.showPanel = function () {
    if (this.ui) {
        this.ui.destroy();
        this.ui = null;
    } else {
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "230px",
            media: true,
        });
        var btn2 = '无'
        console.log(sbCaozuo[this.info['编号']], "sbCaozuo[this.info['编号']]")
        if (sbCaozuo[this.info['编号']].length > 0) {
            btn2 = ''
            sbCaozuo[this.info['编号']].forEach(obj => {
                btn2 = btn2 + '<button>' + obj + '</button>'
            })
        }


        this.info['操作'] = btn2
        this.info['状态'] = sbState[this.info['编号']]
        console.log(btn2)
        for (var key in this.info)
            panel.add(this.info, key);
        this.panel = panel;
        // 创建obj ui (跟随物体用)
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            el: panel.domElement,
            // offset: [0, this.height + 2, 0],
            localPosition: [0, 0, 0],
            pivot: [-0.2, 2.1]
        });
    }
}

function showCJ(obj) {
    var name = obj.id

    var win = window.open("http://47.103.34.10:8080/record/car/" + name, "123213123", "width=1200px,height=600px,top=100,left=200,menubar=yes,location=yes,scrollbars=yes")//表示不会一直新建窗体，一直都是在名字为abccc的窗体打开（第一次是新建了一个abccc的窗体，之后就不会再创建）
    win.moveTo(200, 200);

}
// ------------------------------------------------------------
function CJ(obj) {
    var lishiBtn = '<button id="' + obj.name + '" onclick="showCJ(this)">历史信息</button>'
    this.obj = obj;
    this.info = { '编号': obj.name, '类别': obj.a, '操作': '', '': lishiBtn };
    var that = this
    this.marker = app.create({
        type: "Marker",
        offset: [0, 0.25, 0],
        size: 0.25,
        url: '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img2/车禁.png',
        parent: obj,
        // position: [obj.position[0], 30, obj.position[2]]
        localPosition: [0, 1, 0]
    });
    this.marker.visible = false;
    this.marker.on('click', function () {
        that.showPanel()
        // app.camera.fit(obj)

    });

}



CJ.prototype.showUI = function (boolValue) {
    this.marker.visible = boolValue;
}


CJ.prototype.showPanel = function () {
    if (this.ui) {
        this.ui.destroy();
        this.ui = null;
    } else {
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "230px",
            media: true,
        });
        var btn2 = '无'
        console.log(sbCaozuo[this.info['编号']], "sbCaozuo[this.info['编号']]")
        if (sbCaozuo[this.info['编号']].length > 0) {
            btn2 = ''
            sbCaozuo[this.info['编号']].forEach(obj => {
                btn2 = btn2 + '<button>' + obj + '</button>'
            })
        }
        this.info['操作'] = btn2
        this.info['状态'] = sbState[this.info['编号']]
        for (var key in this.info)
            panel.add(this.info, key);
        this.panel = panel;
        // 创建obj ui (跟随物体用)
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            el: panel.domElement,
            // offset: [0, this.height + 2, 0],
            localPosition: [0, 0, 0],
            pivot: [-0.2, 2.1]
        });
    }
}
// ---------------------------------------------------
function JZ(obj) {
    this.obj = obj;
    //console.log('基站的信息',obj)
    this.info = { '编号': obj.name, '类别': obj.a, '操作': '', '': '<button id="' + obj.name + '">查看</button>' };
    var that = this
    this.marker = app.create({
        type: "Marker",
        offset: [0, 1, 0],
        size: 0.5,
        url: '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img2/基站 (1).png',
        parent: obj,
        // position: [obj.position[0], 30, obj.position[2]]
        localPosition: [0, 1, 0]
    });
    this.marker.visible = false;
    this.marker.on('click', function () {
        that.showPanel()
        // app.camera.fit(obj)

    });


}



JZ.prototype.showUI = function (boolValue) {
    this.marker.visible = boolValue;
}

JZ.prototype.showPanel = function () {
    if (this.ui) {
        this.ui.destroy();
        this.ui = null;
    } else {
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "230px",
            media: true,
        });
        var btn2 = '无'
        console.log(sbCaozuo[this.info['编号']], "sbCaozuo[this.info['编号']]")
        if (sbCaozuo[this.info['编号']].length > 0) {
            btn2 = ''
            sbCaozuo[this.info['编号']].forEach(obj => {
                btn2 = btn2 + '<button>' + obj + '</button>'
            })
        }


        this.info['操作'] = btn2
        this.info['状态'] = sbState[this.info['编号']]
        for (var key in this.info)
            panel.add(this.info, key);
        this.panel = panel;
        // 创建obj ui (跟随物体用)
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            el: panel.domElement,
            // offset: [0, this.height + 2, 0],
            localPosition: [0, 0, 0],
            pivot: [-0.2, 2.1]
        });
    }
}
// -------------------------------------------------
function YJ(obj) {
    this.obj = obj;
    this.info = { '编号': obj.name, '类别': obj.a, '操作': '' };
    var that = this
    this.marker = app.create({
        type: "Marker",
        offset: [0, 0.25, 0],
        size: 0.25,
        url: '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img2/一键报警.png',
        parent: obj,
        // position: [obj.position[0], 30, obj.position[2]]
        localPosition: [0, 1, 0]
    });
    this.marker.visible = false;
    this.marker.on('click', function () {
        that.showPanel()
        // app.camera.fit(obj)

    });

}



YJ.prototype.showUI = function (boolValue) {
    this.marker.visible = boolValue;
}

YJ.prototype.showPanel = function () {
    if (this.ui) {
        this.ui.destroy();
        this.ui = null;
    } else {
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "230px",
            media: true,
        });
        var btn2 = '无'
        console.log(sbCaozuo[this.info['编号']], "sbCaozuo[this.info['编号']]")
        if (sbCaozuo[this.info['编号']].length > 0) {
            btn2 = ''
            sbCaozuo[this.info['编号']].forEach(obj => {
                btn2 = btn2 + '<button>' + obj + '</button>'
            })
        }


        this.info['操作'] = btn2
        this.info['状态'] = sbState[this.info['编号']]
        for (var key in this.info)
            panel.add(this.info, key);
        this.panel = panel;
        // 创建obj ui (跟随物体用)
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            el: panel.domElement,
            // offset: [0, this.height + 2, 0],
            localPosition: [0, 0, 0],
            pivot: [-0.2, 2.1]
        });
    }
}
// 删除设备报警
function deleteSebeiWarning(obj) {
    console.log(1)
    $.ajax({
        type: "post",
        url: urlAll + "/delhisalarm",
        dataType: "json",
        jsonpCallback: "callback",
        contentType: 'application/json',
        data: JSON.stringify([{ device_id: obj.id }]),
        success: function (d) {
            console.log(2)
            var sebeiwaring = sebeiwaringDict[obj.id]
            sebeiwaring.showUI()
            sebeiwaring.marker.destroy()
            delete(sebeiwaringDict[obj.id])
        },
        error: function () {
            console.log('error')
            alert('解除报警失败！！！')
        }
    })
}



// --------------------------------------------
// 封装设备报警
function SebeiWaring(obj) {
    this.obj = obj
    var sbtime =  new Date(obj.time*100).format('yyyy-MM-dd hh:mm:ss')
    this.info = { '编号': obj.device_id, '名称': obj.name, '时间': sbtime, '操作': '<button id=' + obj.device_id + ' onclick="deleteSebeiWarning(this)">解除报警</botton>' };
    this.ui = null
    var that = this
    this.marker = app.create({
        type: "Marker",
        url: "https://thingjs.com/static/images/warning.png",
        // parent: obj,
        // localPosition: [0, 2, 0],
        position: [obj.alarm_x, obj.alarm_z, obj.alarm_y],
        size: 4
    }).on('click', function () {
        that.showUI()
    });
}

SebeiWaring.prototype.showUI = function () {
    if (this.ui) {
        this.ui.destroy()
        this.ui = null
    } else {
        var panel = new THING.widget.Panel({
            cornerType: 'polyline',
            opacity: 0.5,
            template: '7',
            closeIcon: true,
            isDrag: true,
            hasTitle: true,
            width: "200px",
            media: true,
            // parent: this.obj
        });
        for (var key in this.info)
            panel.add(this.info, key);
        // 创建obj ui (跟随物体用)
        this.ui = app.create({
            type: 'UIAnchor',
            parent: this.marker,
            el: panel.domElement,
            // offset: [0, this.height + 2, 0],
            localPosition: [0, 0, 0],
            pivot: [-0.2, 1.8]
        });
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// 数组删除指定元素
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
// 分页
// 1：人员搜索  2：设备搜索  3：告警搜索  4：历史告警  5：电子围栏搜索  6：历史围栏  7：删除电子围栏  8：跟随组当前告警  9：跟随组历史告警  10：硬件告警
// 11：边界告警  12：主动触发告警  13：跟随组搜索  14：设备报警
var pag1, pag2, pag3, pag4, pag5, pag6, pag7, pag8, pag9, pag10, pag11, pag12, pag13, pag14

// 计时器
// fenceTime: 电子围栏告警   followTime: 跟随组告警   otherTime: 其他告警
var fenceTime, followTime, otherTime

addHTML()
addIndexHTML()
addSBHTML()
create_html()
create_html1()
addSearchHTML()
addComHTML()
addVoiceCalls()
addVideoCalls()
addWHTML()
addStaHTML()
var app = new THING.App({
    // 场景地址
    //"url": "http://www.thingjs.com/./uploads/wechat/bWVzb255Y2hpZA==/scene/demo",
    //"url": "http://www.thingjs.com/./uploads/wechat/bWVzb255Y2hpZA==/scene/demo15",
    "url": "http://www.thingjs.com/./uploads/wechat/bWVzb255Y2hpZA==/scene/demo06132",
    //背景设置
    "skyBox": "BlueSky"
});


// 创建Thing 
app.create({
    type: 'Thing',
    name: '防撞墙',
    url: 'https://model.3dmomoda.com/models/f4eac8292f144081b74d244f8b2108b9/0/gltf/', // 模型地址 
    position: [256, 0, 68], // 世界坐标系下的位置
    complete: function (ev) {
        //物体创建成功以后执行函数
        console.log('thing created: ' + ev.object.id);
    }
});
app.create({
    type: 'Thing',
    name: '防撞墙',
    url: 'https://model.3dmomoda.com/models/f4eac8292f144081b74d244f8b2108b9/0/gltf/', // 模型地址 
    position: [296, 0, 68], // 世界坐标系下的位置
    complete: function (ev) {
        //物体创建成功以后执行函数
        console.log('thing created: ' + ev.object.id);
    }
});
app.create({
    type: 'Thing',
    name: '监控塔',
    url: 'https://model.3dmomoda.com/models/1eef252044d84448941c81dd3ed46b33/0/gltf/', // 模型地址 
    position: [250, 0, -30], // 世界坐标系下的位置
    complete: function (ev) {
        //物体创建成功以后执行函数
        console.log('thing created: ' + ev.object.id);
    }
});
app.create({
    type: 'Thing',
    name: '监控塔',
    url: 'https://model.3dmomoda.com/models/1eef252044d84448941c81dd3ed46b33/0/gltf/', // 模型地址 
    position: [250, 0, -40], // 世界坐标系下的位置
    complete: function (ev) {
        //物体创建成功以后执行函数
        console.log('thing created: ' + ev.object.id);
    }
});


// var clickThings = []
var clickDic = {}
var mjBool = personBool = reiLiTu = false
var heatMap, heatTime;
app.on('load', function (ev) {
    sbClick()
    $('#personChoose').show()
    // clickThings = app.query(/SX/).add(app.query(/JZ/)).add(app.query(/YJ/)).add(app.query(/MJ/)).add(app.query(/CJ/))
    setInterval(getNewAlarm, 1000)
    fenceMouseup()
    create_html_gaoj()
    init()
    gaoJingAll()
    app.level.change(ev.campus)
    var app_center = app.root.defaultCampus.center
    var app_size = app.root.defaultCampus.size
    $("#view_r").on("click", function () {
        reiLiTu = !reiLiTu
        if (reiLiTu) {
            heatMap = app.create({
                type: "Heatmap",
                position: [app_center[0], 1, app_center[2]],
                width: app_size[0], // 宽度 单位米
                height: app_size[2], // 长度 单位米
                radius: 1, // 单个点的热力影响半径
                alpha: true // 未插值区域是否透明（默认为 false ）
            });

            heatMap.rotateX(90);
            $.ajax({
                type: "get",
                url: 'http://47.103.34.10:8080/heatingpower',
                dataType: "json",
                jsonpCallback: "callback",
                success: function (d) {
                    console.log('数据', d)
                    var ls = []
                    d.forEach(function (data) {
                        var l1 = [data.x - app_center[0], data.y - app_center[2], THING.Math.randomFloat(24.0, 28.0)]
                        ls.push(l1)
                    })
                    heatMap.setData(ls)

                },
                error: function () { console.log('error') }
            })
            heatTime = setInterval(function () {
                $.ajax({
                    type: "get",
                    url: 'http://47.103.34.10:8080/heatingpower',
                    dataType: "json",
                    jsonpCallback: "callback",
                    success: function (d) {
                        console.log('数据', d)
                        var ls = []
                        d.forEach(function (data) {
                            var l1 = [data.x - app_center[0], data.y - app_center[2], data.number]
                            ls.push(l1)
                        })
                        heatMap.setData(ls)

                    },
                    error: function () { console.log('error') }
                })
            }, 10000)
        } else {
            clearInterval(heatTime)
            heatMap.destroy()
        }
    })



    app.on(THING.EventType.MouseEnter, '.Marker', function (ev) {
        ev.object.style.outlineColor = '#FF0000';
        ev.object.style.color = "#00ff00"
    });
    // 鼠标离开物体边框取消
    app.on(THING.EventType.MouseLeave, '.Marker', function (ev) {
        ev.object.style.outlineColor = null;
        ev.object.style.color = null
    });

    //设备定位
    $(document.body).on("click", ".seBeName", function () {
        const typeId = $(this).attr("type")
        //console.log(111)
        const objectApp = app.query(typeId)[0]
        app.camera.flyTo({
            object: objectApp, // 飞行到的对象
            time: 2 * 1000, // 飞行时间
            complete: function () {
                // console.log('飞行结束');
            }
        });
    })






    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/g.js'])
    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/sebei.js'])


})

function addHTML() {
    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo/resource/ViewChoose.css',
        '/uploads/wechat/bWVzb255Y2hpZA==/file/demo/resource/DataChoose.css',
        '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/1.css',
        '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/a.js',
        '/uploads/wechat/bWVzb255Y2hpZA==/file/demo/resource/ViewName.css'], function () {
            var html1 = `<div id="choose-view" class="z-index1">
            <div class="title">跳转视角选择</div>
            <select id="select"></select>
            <div class="list-btn">
                <button id="view-confirm" class="view-sub">确定</button>
                <button id="view-cancel" class="view-sub">取消</button>
            </div>
        </div>`
            $('body').append(html1)
            $('#choose-view').hide()
            sync_angle()
            $('.view-sub').click(function () {
                if (this.id === 'view-confirm') {
                    var name = $("#select option:selected").val();
                    jump_angle(name)
                }
                $('#mask').hide()
                $('#choose-view').hide()
            })

            var add_html = `<div id="mask"></div>
        <div id="add-html" class="z-index1">
            <div class="title fz">设置视角名称</div>
            <div class="main">
                <span class="fz">名称：</span>
                <span><input id="angle-name" class="fz" type="text"></span>
            </div>
            <div style="text-align: center;margin-top: 30px">
                <button id="add-confirm" class="add-sub">确定</button>
                <button id="add-cancel" class="add-sub">取消</button>
            </div>
        </div>`
            $('body').append(add_html)
            $('#add-html').hide()
            $('#mask').hide()
            name_input = $('#angle-name')
            // console.log('name', name_input)

            $('.add-sub').click(function () {
                if (this.id === 'add-confirm') {
                    if ($('option').length < 10) {
                        camera_view()
                    } else {
                        alert('视角数量已达到最大数量！！')
                    }
                }
                $('#mask').hide()
                $('#add-html').hide()
            })

            var aHTML = `<div id="leftFixed" class="left_fixed" style="z-index:1">
        <div class="nav_point" id='backTo'>
            <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/20190326.png" alt="" title="退出">退出
        </div>
        <div id="goHome">
            <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/首页.png" alt="" title="首页">首页
        </div>
    </div>
    <div id="indexMenu" class="nav" style="z-index:1">
        <div style="width:485px" class="nav_poa_top">
            <div class="nav_cont nav_point" id="btns" title="透明">
                <div class="nav_show">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形111.png" alt="" class="nav_show">透明
                </div>
                <div class="nav_hide">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形11.png" alt="" class="nav_show">透明
                </div>
            </div>
            <div class="nav_cont nav_point" title="建筑信息" id="nbtn">
                <div class="nav_show">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形111.png" alt="" class="nav_show">建筑信息
                </div>
                <div class="nav_hide">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形11.png" alt="" class="nav_hide">建筑信息
                </div>
            </div>
            <div class="nav_cont nav_point" id="btn">
                <div class="nav_show">
                    <img title="3D" src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形111.png" alt=""><span>3D</span>
                </div>
                <div class="nav_hide">
                    <img title="2D" src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形11.png" alt=""><span>2D</span>
                </div>
            </div>
            <div class="nav_cont nav_point" title="视角锁定" id="view_a">
                <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形111.png" alt="">视角锁定
            </div>
            <div class="nav_cont nav_point" title="视角跳转" id="view_b">
                <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形111.png" alt="">视角跳转
            </div>
             <div class="nav_cont nav_point" title="热力图" id="view_r">
                <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形111.png" alt="">热力图
            </div>
        </div>
        <div class="nav_center">
            <div>主菜单</div>
            <div>子菜单</div>
        </div>
        <div class="nav_left" id="NavLeft">
            <div onclick="clickTab(this)" class="nav_cont nav_point choosed" title="人员" id="personMenu">
                <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/人员1.png' alt="">
            </div>
            <div onclick="clickTab(this)" class="nav_cont nav_point" title="设备" id="sbMenu">
                <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/shebei.png" alt="">
            </div>
            <div onclick="clickTab(this)" class="nav_cont nav_point" title="告警" id="alarmMenu">
                <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/警报.png" alt="">
            </div>
            <div onclick="clickTab(this)" class="nav_cont nav_point" title="指挥" id="commandMenu">
                <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/电话.png" alt="">
            </div>
            <div onclick="clickTab(this)" class="nav_cont nav_point" title="电子围栏" id="fenceMenu">
                <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/电子围栏.png" alt="">
            </div>
            <div onclick="clickTab(this)" class="nav_cont nav_point" title="跟随组" id="followgrop">
                <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/跟随模式.png" alt="">
            </div>
        </div>
        <!-- <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形1.png" class="nav_poa" alt=""> -->
        <div class="por">
            <div class="left"></div>
            <img class="center" src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/菱形20.png" alt="">
            <div class="right"></div>
        </div>
        <!--  子功能项  -->
        <div class="nav_right_cont">
            <div class="nav_right">
                <div class="nav_cont nav_point" title="搜索" id="crewSearch">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/sousuo.png" alt="">
                </div>
                <div class="nav_cont nav_point" title="警察" id="personShow1">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/警察.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/警察11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="犯人" id="personShow2">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/押解犯人.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/押解犯人11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="外来人员" id="personShow3">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/人员.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/人员11.png" alt="">
                    </div>
                </div>
            </div>
            <div class="nav_right">
                <div class="nav_cont nav_point" title="搜索" id="eqSearch">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/sousuo.png" alt="">
                </div>
                <div class="nav_cont nav_point" title="监控" id="SXT">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/摄像头.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/摄像头11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="基站" id="JZ">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/基站.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/基站11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="门禁" id="MJ">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/门禁.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/门禁11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="车禁" id="CJ">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/车.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/车11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="一键报警" id="YJBJ">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/一键.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/一键11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="设备告警" id="allSebeiAlarm">
                    <div>
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/警报.png" alt="">
                    </div>
                </div>

            </div>
            <div class="nav_right">
                <div class="nav_cont nav_point" title="搜索" id="warningSearch">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/sousuo.png" alt="">
                </div>
                <div class="nav_cont nav_point" title="边界告警" id="broAlarm">
                    <div>
                        <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/%E4%BA%BA%E5%91%98%E8%B6%85%E5%87%BA%E8%BE%B9%E7%95%8C.png'"img/人员超出边界.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="硬件告警" id="hardAlarm">
                    <div>
                        <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/%E7%A1%AC%E4%BB%B6%E9%94%99%E8%AF%AF.png'"img/硬件错误.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="人员主动触发告警" id="actAlarm">
                    <div>
                        <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/%E8%A7%A6%E5%8F%91-%E7%BA%BF.png'"img/触发-线.png" alt="">
                    </div>
                </div>
            </div>
            <div class="nav_right">
                <div class="nav_cont nav_point" title="搜索" id="commSearch">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/sousuo.png" alt="">
                </div>
                <div class="nav_cont nav_point" title="语音通话" id="voiceCalls">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/语音.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/语音11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="视频通话" id="videoCalls">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/视频通话.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/视频通话11.png" alt="">
                    </div>
                </div>
            </div>
            <div class="nav_right">
                <div class="nav_cont nav_point" title="搜索" id="fenceSearch">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/sousuo.png" alt="">
                </div>
                <div class="nav_cont nav_point" title="创建" id="fenceCreate">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/创建.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/创建11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="删除" id="fenceDel">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/删除.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/删除11.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="当前告警" id="fenceCurrent">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/警告111.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/警告1111.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="历史告警" id="fenceHistory">
                    <div class="nav_show">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/历史警告.png" alt="">
                    </div>
                    <div class="nav_hide">
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/历史警告11.png" alt="">
                    </div>
                </div>
            </div>
            <div class="nav_right">
                <div class="nav_cont nav_point" title="搜索" id="follSearch">
                    <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/sousuo.png" alt="">
                </div>
                <div class="nav_cont nav_point" title="当前告警" id="follWanringNow">
                    <div>
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/警告111.png" alt="">
                    </div>
                </div>
                <div class="nav_cont nav_point" title="历史告警" id="follWanringOld">
                    <div>
                        <img src="/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/历史警告.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        

</div>`
            $('body').append(aHTML)
            THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/a.js'])
        })
}


var yj_i = cj_i = mj_i = jz_i = sxt_i = perS2_i = perS3_i = perS1_i = tran_i = build_i = view_a_i = view_b_i = view_i = false
var dg_i = crew_i2 = eq_i = crew_i = com_i = vc_i = vdc_i = cw_i = hw_i = fc_i = fh_i = crew_i1 = false
var fence_i = false
function ckickAction() {
    // 点击设备报警
    $('#allSebeiAlarm').click(function () {
        if ($('#sebeiAlarm').is(':hidden')) {
            sebeiWaringPage(0)
            $('#sbSearh').hide()
            $('#sebeiAlarm').show()
        } else {
            $('#sebeiAlarm').hide()
        }
    })
    // 点击跟随组搜索
    $('#follSearch').click(function () {
        if ($('#followAlarm').is(':hidden')) {
            follWanringSear(0)
            $('#followOld').hide()
            $('#followNow').hide()
            $('#followAlarm').show()
        } else {
            $('#followAlarm').hide()
        }
    })
    // 点击跟随组当前告警
    $('#follWanringNow').click(function () {
        if ($('#followNow').is(':hidden')) {
            $('#followAlarm').hide()
            $('#followOld').hide()
            follWanringNew(0)
            $('#followNow').show()

        } else {
            $('#followNow').hide()
        }
    })

    // 点击跟随组历史告警
    $('#follWanringOld').click(function () {
        if ($('#followOld').is(':hidden')) {
            follWanringOld(0)
            $('#followAlarm').hide()
            $('#followNow').hide()
            $('#followOld').show()
        } else {
            $('#followOld').hide()
        }
    })

    // 点击边界告警
    $('#broAlarm').click(function () {
        if ($('#borderAlarm').is(":hidden")) {
            bordWanring(0)
            $('#hardwareAlarm').hide()
            $('#activeAlarm').hide()
            $('#borderAlarm').show()
        } else {
            $('#borderAlarm').hide()
        }
    })
    // 点击硬件告警
    $('#hardAlarm').click(function () {
        if ($('#hardwareAlarm').is(":hidden")) {
            hardWanring(0)
            $('#borderAlarm').hide()
            $('#activeAlarm').hide()
            $('#hardwareAlarm').show()
        } else {
            $('#hardwareAlarm').hide()
        }
    })
    // 点击主动触发告警
    $('#actAlarm').click(function () {
        if ($('#activeAlarm').is(":hidden")) {
            $('#hardwareAlarm').hide()
            $('#borderAlarm').hide()
            actiWanring(0)
            $('#activeAlarm').show()
        } else {
            $('#activeAlarm').hide()
        }
    })


    $('#followgrop').click(function () {
        $('.closeClass').hide()
        $('#followLeft').show()
        personHide()
        alarmHide()
        commandHide()
        sbHide()
        fenceHide()
        agreeFollow()
        getFollowAlarm()
        followTime = setInterval(getFollowAlarm, 2000)
    })

    $('#fenceDel').click(function () {
        console.log('1111')
        if ($('#delFence').is(":hidden")) {
            $('#delFence').show()
            fenceAllPage(0)
        } else {
            $('#delFence').hide()
        }
    })

    $("#fenceCreate").click(function () {
        fence_i = !fence_i
        if (fence_i) {
            app.camera.viewMode = THING.CameraView.TopView;
            app.resumeEvent('mousedown', null, '电子围栏框选创建开始')
            app.resumeEvent('mouseup', null, '电子围栏框选创建结束')
        } else {
            app.camera.viewMode = THING.CameraView.Normal
            app.pauseEvent('mousedown', null, '电子围栏框选创建开始')
            app.pauseEvent('mouseup', null, '电子围栏框选创建结束')
        }
    })
    $('#drag').click(function () {
        dg_i = !dg_i
        changeInto('dg', dg_i)
    })
    $('#fenceHistory').click(function () {
        fh_i = !fh_i
        changeInto('fenceAlarmPage', fh_i)
    })
    $('#fenceCurrent').click(function () {
        fc_i = !fc_i
        changeInto('fenceAlarm', fc_i)
    })
    $('#videoCalls').click(function () {
        vdc_i = !vdc_i
        changeInto('vc2', vdc_i)
    })
    $('#voiceCalls').click(function () {
        vc_i = !vc_i
        changeInto('vc1', vc_i)
    })
    $('#commSearch').click(function () {
        com_i = !com_i
        changeInto('coms', com_i)
    })
    $('#btns').click(function () {
        tran_i = !tran_i
        changeInto('tran', tran_i)
    })

    $('#goHome').click(function () {
        app.level.change(app.root.defaultCampus)
    })
    $('#backTo').click(function () {
        var object = app.level.current

        app.level.back()
        if (object instanceof THING.Building) {
            // console.log(111222333)
            // console.log(t1,p1)
            app.camera.flyTo({
                position: p1,
                target: t1,
                time: 2000
            });
            t1 = p1 = null

        }

        var object = app.level.current
        if (object instanceof THING.Building) {
            app.query('.Building').visible = true
        }
    })
    $('#nbtn').click(function () {
        build_i = !build_i
        changeInto('build', build_i)
    })

    $('#btn').click(function () {
        view_i = !view_i
        changeInto('view', view_i)
    })

    $('#view_a').click(function () {
        view_a_i = !view_a_i
        changeInto('view_a', view_a_i)
    })
    $('#view_b').click(function () {
        view_b_i = !view_b_i
        changeInto('view_b', view_b_i)
    })
    $('#personShow1').click(function () {
        perS1_i = !perS1_i
        changeInto('perS1', perS1_i)
    })
    $('#personShow2').click(function () {
        console.log('点击犯人')
        perS2_i = !perS2_i
        changeInto('perS2', perS2_i)
    })
    $('#personShow3').click(function () {
        perS3_i = !perS3_i
        changeInto('perS3', perS3_i)
    })
    $('#SXT').click(function () {
        sxt_i = !sxt_i
        changeInto('sxt', sxt_i)
    })
    $('#MJ').click(function () {
        mj_i = !mj_i
        changeInto('mj', mj_i)
    })
    $('#CJ').click(function () {
        cj_i = !cj_i
        changeInto('cj', cj_i)
    })
    $('#JZ').click(function () {
        jz_i = !jz_i
        changeInto('jz', jz_i)
    })
    $('#YJBJ').click(function () {
        yj_i = !yj_i
        changeInto('yjbj', yj_i)
    })
    $('#personMenu').click(function () {
        $('.closeClass').hide()
        $('#personChoose').show()
        alarmHide()
        commandHide()
        sbHide()
        fenceHide()
        clearInterval(groupTime)
        follGroupHide()

    })
    $('#sbMenu').click(function () {
        $('.closeClass').hide()
        $('#sbChoose').show()
        // addMainC()
        personHide()
        alarmHide()
        commandHide()
        fenceHide()
        clearInterval(groupTime)
        follGroupHide()
        //console.log("11")
    })

    $('#alarmMenu').click(function () {
        $('.closeClass').hide()
        $('#addPloice12').show()
        personHide()
        sbHide()
        //alarmHide()
        fenceHide()
        commandHide()
        clearInterval(groupTime)
        follGroupHide()
        getOtherAlarm()
        otherTime = setInterval(getOtherAlarm, 2000)
    })
    $('#commandMenu').click(function () {
        personHide()
        sbHide()
        fenceHide()
        alarmHide()
        clearInterval(groupTime)
        follGroupHide()
    })
    $('#fenceMenu').click(function () {
        $('.closeClass').hide()
        $('#addPloice13').show()
        personHide()
        alarmHide()
        commandHide()
        sbHide()
        clearInterval(groupTime)
        follGroupHide()
        getFenceAlarm()
        fenceTime = setInterval(getFenceAlarm, 2000)
    })
    $('#eqSearch').click(function () {
        eq_i = !eq_i
        changeInto('eS', eq_i)
    })
    $('#crewSearch').click(function () {
        crew_i = !crew_i
        changeInto('cS', crew_i)
    })
    $('#warningSearch').click(function () {
        crew_i1 = !crew_i1;
        // addPostSou2(numbee)
        changeInto('cS1', crew_i1)
    })
    $('#fenceSearch').click(function () {
        crew_i2 = !crew_i2
        changeInto('cS2', crew_i2)
    })
}
function changeInto(key, boolValue) {
    if (key === 'tran') {
        if (boolValue) {
            app.query('.Building').style.opacity = 0.3
            app.query('.Building').style.color = '#4169E1'
        } else {
            app.query('.Building').style.opacity = 1
            app.query('.Building').style.color = null
        }
    } else if (key === 'build') {
        if (buildThing) {
            buildThing.showUI(false)
            buildThing = null
        }
        buildList.forEach(function (obj) {
            obj.showUI(boolValue)
        })
    } else if (key === 'view') {
        if (boolValue) {
            app.query('地平线').visible = false
            app.camera.viewMode = THING.CameraView.TopView;
            //box_choose()
        } else {
            app.query('地平线').visible = true
            app.camera.viewMode = THING.CameraView.Normal;
            app.off('mousedown', null, '按下左键进行框选');
            app.off('mouseup', null, '抬起左键结束框选');
        }
    } else if (key === 'view_a') {
        $('#mask').show()
        $('#add-html').show()
    } else if (key === 'view_b') {
        $('#mask').show()
        $('#choose-view').show()
    } else if (key === 'perS1') {
        person_object.forEach(function (obj) {
            obj.showUI(boolValue)
        })
        if (!boolValue) {
            person_object.forEach(function (obj) {
                if (obj.ui) {
                    obj.ui.destroy()
                    obj.ui = null
                }
            })
        }
    } else if (key === 'perS2') {
        console.log(boolValue)
        prisoner_object.forEach(function (obj) {
            obj.showMarker(boolValue)
        })
        if (!boolValue) {
            prisoner_object.forEach(function (obj) {
                if (obj.ui) {
                    obj.ui.visible = false
                }
            })
        }
    } else if (key === 'perS3') {
        outsider_object.forEach(function (obj) {
            obj.showUI(boolValue)
        })
        if (!boolValue) {
            outsider_object.forEach(function (obj) {
                if (obj.ui) {
                    obj.ui.destroy()
                    obj.ui = null
                }
            })
        }
    } else if (key === 'sxt') {
        videoList.forEach(function (obj) {
            obj.showUI(boolValue)
        })
        if (!boolValue) {
            videoList.forEach(function (obj) {
                if (obj.ui) {
                    obj.ui.destroy()
                    obj.ui = null
                }
                if (obj.videoFrame) {
                    obj.videoFrame.destroy()
                    obj.videoFrame = null

                }
            })
        }
    } else if (key === 'jz') {
        jzList.forEach(function (obj) {
            obj.showUI(boolValue)
        })
        if (!boolValue) {
            jzList.forEach(function (obj) {
                if (obj.ui) {
                    obj.ui.destroy()
                    obj.ui = null
                }
            })
        }

    } else if (key === 'cj') {
        cjList.forEach(function (obj) {
            obj.showUI(boolValue)
        })
        if (!boolValue) {
            if (!boolValue) {
                cjList.forEach(function (obj) {
                    if (obj.ui) {
                        obj.ui.destroy()
                        obj.ui = null
                    }
                })
            }
        }
    } else if (key === 'yjbj') {
        yjList.forEach(function (obj) {
            obj.showUI(boolValue)
        })
        if (!boolValue) {
            if (!boolValue) {
                yjList.forEach(function (obj) {
                    if (obj.ui) {
                        obj.ui.destroy()
                        obj.ui = null
                    }
                })
            }
        }
    } else if (key === 'mj') {
        mjList.forEach(function (obj) {
            obj.showUI(boolValue)
        })
        if (!boolValue) {
            mjList.forEach(function (obj) {
                if (obj.ui) {
                    obj.ui.destroy()
                    obj.ui = null
                }
            })
        }
    } else if (key === 'eS') {
        if ($('#sbSearh').is(":hidden")) {
            $('#sebeiAlarm').hide()
            $('#sbSearh').addClass('upinput')
            addPostSou1(0)
            $('#sbSearh').show()
        } else {
            $('#sbSearh').removeClass('upinput')
            $('#sbSearh').hide()
        }
    } else if (key === 'cS') {
        if ($('#perSearch').is(":hidden")) {
            addPostSou(0)
            $('#perSearch').addClass('upinput')
            $('#perSearch').show()
        } else {
            $('#perSearch').removeClass('upinput')
            $('#perSearch').hide()
        }
    } else if (key === 'cS1') {
        if ($('#perSearch1').is(":hidden")) {
            $('#w1').hide()
            $('#w2').hide()
            searchAllWanring(0)
            $('#perSearch1').addClass('upinput')
            $('#perSearch1').show()
        } else {
            $('#perSearch1').removeClass('upinput')
            $('#perSearch1').hide()
        }
    } else if (key === 'cS2') {
        if ($('#fenS').is(":hidden")) {
            $('#fenOld').hide()
            $('#fenNow').hide()
            fenceSearchPage(0)
            $('#fenS').addClass('upinput')
            $('#fenS').show()

        } else {
            $('#fenS').removeClass('upinput')
            $('#fenS').hide()
        }
    }

    else if (key === 'coms') {
        if ($('#comSearch').is(":hidden")) {
            $('#comSearch').addClass('upinput')
            $('#comSearch').show()
        } else {
            $('#comSearch').removeClass('upinput')
            $('#comSearch').hide()
        }
    } else if (key === 'vc1') {
        if ($('#vc1').is(":hidden")) {
            $('#vc1').addClass('upinput')
            $('#vc1').show()
        } else {
            $('#vc1').removeClass('upinput')
            $('#vc1').hide()
        }
    } else if (key === 'vc2') {
        if ($('#vc2').is(":hidden")) {
            $('#vc2').addClass('upinput')
            $('#vc2').show()
        } else {
            $('#vc2').removeClass('upinput')
            $('#vc2').hide()
        }
    }
    // else if (key === 'w1') {
    //     if ($('#w1').is(":hidden")) {
    //         $('#perSearch1').hide()
    //         $('#w2').hide()
    //         showAllWarning()
    //         $('#w1').addClass('upinput')
    //         $('#w1').show()
    //     } else {
    //         $('#w1').removeClass('upinput')
    //         $('#w1').hide()
    //     }
    // } 
    else if (key == 'fenceAlarm') {
        if ($('#fenNow').is(":hidden")) {
            $('#fenS').hide()
            $('#fenOld').hide()
            showFenceWarning()
            $('#fenNow').addClass('upinput')
            $('#fenNow').show()
        } else {
            $('#fenNow').removeClass('upinput')
            $('#fenNow').hide()
        }
    }
    // else if (key === 'w2') {
    //     if ($('#w2').is(":hidden")) {
    //         $('#perSearch1').hide()
    //         $('#w1').hide()
    //         showAllWarningPage(0)
    //         $('#w2').addClass('upinput')
    //         $('#w2').show()
    //     } else {
    //         $('#w2').removeClass('upinput')
    //         $('#w2').hide()
    //     }
    // } 
    else if (key === 'fenceAlarmPage') {
        if ($('#fenOld').is(":hidden")) {
            $('#fenS').hide()
            $('#fenNow').hide()
            showFenceWarningPage(0)
            $('#fenOld').addClass('upinput')
            $('#fenOld').show()
        } else {
            $('#fenOld').removeClass('upinput')
            $('#fenOld').hide()
        }
    } else if (key === 'dg') {
        if ($('#fdrag-htmlenS').is(":hidden")) {
            $('#drag-html').show()
        } else {
            $('#drag-html').hide()
            save_Drag_Data(drag_drop_list)
        }
    }
}

function jump_angle(name) {
    // console.log(view_dic[name].pos, view_dic[name].target)
    app.camera.flyTo({
        position: view_dic[name].pos,
        target: view_dic[name].target,
        time: 500
    });
}

// 判断视角名称组成  字母、数字、下划线组合
function checkMobile(s) {
    var regu = /^[0-9a-zA-Z_]{1,}$/;
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    } else {
        return false;
    }
}

var view_dic = {}
function camera_view() {
    var pos = app.camera.position; //获取摄像机镜头位置
    var target = app.camera.target; //获取摄像机目标点位置
    var name = $('#angle-name').val();
    // console.log(pos, target)
    if (checkMobile($('#angle-name').val())) {
        console.log(view_dic[$('#angle-name').val()])
        if (view_dic[$('#angle-name').val()]) { alert('视角名称已存在！！！') } else {
            var angle_data = {
                'name': $('#angle-name').val(),
                'position_x': pos[0],
                'position_y': pos[2],
                'position_z': pos[1],
                'target_x': target[0],
                'target_y': target[2],
                'target_z': target[1],
                'create_person': user_id
            }
            console.log('视角插入数据', angle_data)
            $.ajax({
                'url': urlAll + "/insert/visual_angle", //Ajax请求服务的地址
                'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
                'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
                //发送到服务器的数据
                'contentType': "application/json; charset=utf-8",
                'data': JSON.stringify([angle_data]),
                //请求成功后的回调函数
                'success': function (data) {
                    console.log(data)
                    var option1 = $('<option value=' + name + '>' + name + '</option>')
                    $('#select').append(option1)
                    view_dic[$('#angle-name').val()] = {
                        pos: pos,
                        target: target
                    }
                },
                //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
                'error': function (xhr, status, error) {
                    console.log(xhr);
                }
            })
        }

    } else {
        alert('视角名称格式错误！！')
    }
    $('#angle-name').val('')


}


// 设备图标
var jzList = [], mjList = [], cjList = [], yjList = []
var sbAllList = []
function addSBImg() {
    app.query(/MJ/).forEach(function (mj) {
        mj.a = '门禁'
        let mjInfo = new MJ(mj)
        mjList.push(mjInfo)
        sbAllList.push(mjInfo)
        clickDic[mj.id] = mjInfo
    })
    app.query(/CJ/).forEach(function (cj) {
        cj.a = '车禁'
        let cjInfo = new CJ(cj)
        clickDic[cj.id] = cjInfo
        // cjInfo.showUI(true)
        cjList.push(cjInfo)
        sbAllList.push(cjInfo)
    })
    app.query(/YJ/).forEach(function (yj) {
        yj.a = '一键报警'
        let yjInfo = new YJ(yj)
        clickDic[yj.id] = yjInfo
        // yjInfo.showUI(true)
        yjList.push(yjInfo)
        sbAllList.push(yjInfo)
    })
    // console.log(app.query(/JZ/).length)
    app.query(/JZ/).forEach(function (jz) {
        jz.a = '基站'
        let jzInfo = new JZ(jz)
        // jzInfo.showUI(true)
        jzList.push(jzInfo)
        clickDic[jz.id] = jzInfo
        sbAllList.push(jzInfo)
    })
}

// 人员图标
var personJC = [], personFR = [], personWL = []
var personAllList = []
function addPersonimg() {
    app.query(/People/).forEach(function (peole) {
        //console.log(peole.userData)
        let person = new Person(peole)
        personAllList.push(person)
        if (peole.userData.type === '警察') {
            personJC.push(person)
        } else if (peole.userData.type === '犯人') {
            personFR.push(person)
        } else {
            personWL.push(person)
        }

    })
    // console.log('犯人', personFR.length)
    // console.log('外来', personWL.length)
}

// 摄像头图标
var videoList = [];
function addVideoInfo() {
    app.query(/SXT/).forEach(function (sxt) {
        let video = new VideoCamera(sxt)
        videoList.push(video)
        clickDic[sxt.id] = video
    })
}

// 层级初始化
function intoBuild() {
    app.pauseEvent(THING.EventType.LeaveLevel, '.Campus', THING.EventTag.LevelSceneOperations);
    app.pauseEvent(THING.EventType.EnterLevel, '.Building', THING.EventTag.LevelSetBackground);
    app.pauseEvent(THING.EventType.EnterLevel, '.Floor', THING.EventTag.LevelSetBackground);
    //  停止进入物体层级的默认行为
    app.pauseEvent(THING.EventType.EnterLevel, '.Thing', THING.EventTag.LevelSceneOperations);
    // 暂停单击返回上一层级功能
    app.pauseEvent(THING.EventType.Click, '*', THING.EventTag.LevelBackOperation);

}

// 进入建筑
function gotoBuild() {
    app.on('DBLclick', '楼', function (ev) {
        var object = ev.object;
        if (app.level.current instanceof THING.Campus) {
            t1 = app.camera.target
            p1 = app.camera.position
        }
        linkage(object.id)
        app.level.change(object)
        app.query('.Building').visible = true
    }, 'customEnterLevel');

    app.on('DBLclick', '.Floor||.Room', function (ev) {
        var object = ev.object;
        linkage(object.id)
        app.level.change(object)
    })
}

// 联动
function linkage(id) {
    var ssss = $('#' + id).next().attr('class')
    // console.log(ssss)
    $('#' + id).siblings('.' + ssss).slideToggle();
    $('#' + id).parent().siblings().find("." + ssss).slideUp();
}

// 建筑信息
var buildList = []
function addBuidInfo() {
    app.query('.Building').forEach(function (build) {
        let buildInfo = new Build(build)
        buildList.push(buildInfo)
    })
}

app.on('click', '楼', function (ev) {
    if (ev.button === 2) {
        var a = this
        if (this.isExpandBuilding) {
            a.unexpandFloors({
                'time': 500,
                'complete': function () {
                    //console.log('合并');
                    a.isExpandBuilding = false;
                }
            })
        } else {
            this.expandFloors({
                'time': 1000,
                'length': 10,
                'horzMode': false,
                'hideRoof': true,
                'complete': function () {
                    a.isExpandBuilding = true;
                }
            })
        }
    }
}, '建筑外楼层展开')


function addIndexHTML() {
    // 添加跟随组告警

    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/g.css'], function () {
        var personHTML = `<div class="navigation_bar closeClass" id="personChoose">
    <div class="title_two">
        <div class="title_a active" onclick="returnHome()">区域</div>
        <div class="title_b">人员分类</div>
    </div>
    <div style="display: block;" class="tree" id="main_a">

    </div>
    <div style="display: none;" class="tree" id="main_b">
    <div class="tree_b">
        <h3 type=1>狱警(<span></span>)</h3>
        <ul class="tree_o">
        </ul>
    </div>
    <div class="tree_b">
        <h3 type=2>犯人(<span></span>)</h3>
        <ul class="tree_o">
        </ul>
    </div>
    <div class="tree_b">
        <h3 type=3>外来人员(<span></span>)</h3>
        <ul class="tree_o">
        </ul>
    </div>

    </div>
</div>`

        $('body').append($(personHTML))
        $('#personChoose').hide()
        var h31 = $(".tree_b").find("h3");
        var tre_one1 = $(".tree_b").find(".tree_o");
        h31.each(function (i) {
            $(this).click(function () {
                tre_one1.eq(i).slideToggle();
                tre_one1.eq(i).parent().siblings().find(".tree_o").slideUp();
            })
        })
    })
}




var numberY = 0, numberF = 0, numberW = 0;
function postPloice(data) {

    $.ajax({
        'url': urlAll + "/realtimeallinfo", //Ajax请求服务的地址
        'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
        'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
        //发送到服务器的数据
        'contentType': "application/json; charset=utf-8",
        'data': data,
        //请求成功后的回调函数
        'success': function (data) {
            if (data.length < 1) {
                alert('该人员暂无实时数据汇报！！')
            } else {
                console.log('定位目标：', app.query('[id=' + data[0].device_id + ']')[0])
                var object = app.query('[id=' + data[0].device_id + ']')[0]
                app.camera.fit(object)
            }

        },
        //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
        'error': function (xhr, status, error) {
            console.log(xhr);
        }
    })

}


function postName(type, that) {

    var data = JSON.stringify([{ "type": type }])

    $.ajax({
        'url': urlAll + "/personlisquery", //Ajax请求服务的地址
        'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
        'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
        //发送到服务器的数据
        'contentType': "application/json; charset=utf-8",
        'data': data,
        //请求成功后的回调函数
        'success': function (data) {
            var dateName = $(that).next()
            $(".domeLi").remove();
            data.forEach((date, i) => {
                var tree4 = $('<li class="domeLi"><h4 class="thing_name ploiceThing" type="' + type + '" onclick="clickPlane(this)" id="' + date.device_id + '">' + date.username + '</h4></li>')
                $(dateName).append(tree4)
            })
            //$(".tree_one").css("display","none");
            //console.log("1111")
            dateName.toggle()
            $(".ploiceThing").on("click", function () {
                const type = $(this).attr("type");
                const name = $(this).attr("id");
                const date = JSON.stringify([{
                    "ptype": type,
                    "username": name
                }])
            })
        },
        //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
        'error': function (xhr, status, error) {
            console.log(xhr);
        },
    });

}



function shiSHi() {
    $.ajax({
        type: "get",
        url: urlAll + "/personnumquery",
        dataType: "json",
        jsonpCallback: "callback",
        success: function (data) {
            const classNam = ".domeShu"
            // console.log('拉取数据', data)
            data.forEach((date, i) => {
                const classN = classNam + date.type
                $(classN).text(date.number[0].count)
            })


        },
        error: function () {
            console.log('error')
        }
    })
}


function domeMAJAXPost() {
    setInterval(function () {
        $.ajax({
            type: "get",
            url: urlAll + "/fence_data/list",
            dataType: "json",
            jsonpCallback: "callback",
            success: function (data) {
                //console.log('围栏数据', data)
                //addDate(data)
                if (data) { create_Fences(data) }
            },
            error: function () {
                console.log('error')
            }
        })
    }, 1000)


}
timeData()
function timeData() {
    THING.Utils.dynamicLoad(['/uploads/wechat/emhhbmdDaGVuZw==/file/demo2000/laydate/laydate.js'], function () {
        // 轨迹时间选择
        var sbHTML1 = `<div id="peopleGuiji" style="position:absolute;left:520px;top:20px;padding: 8px;width:300px;text-align: center;background: rgba(0,0,0,0.5);height:200px;z-index:10000;border-radius: 5px 5px;" class="timerType" id="sbType">
                   <div style="color:#fff;margin-bottom: 10px;"><p style="text-align: left; margin-left: 70px;margin-top:25px">编号：<span id="loucsDeviceID"></span></div>
                   <div style="color:#fff;margin-bottom: 10px;"><p style="text-align: left; margin-left: 70px;">姓名：<span id="locusName"></span></div>
                   <div style="color:#fff;margin-bottom: 10px;">开始时间：<input style="background:none;border: 1px solid #fff;border-radius: 5px 5px;height: 20px;width: 135px;color:#ffffff;" type="text" id="test1"></div>
                   <div style="color:#fff;margin-bottom: 10px;">结束时间：<input style="background:none;border: 1px solid #fff;border-radius: 5px 5px;height: 20px;width: 135px;color:#ffffff;"  type="text" id="test2"></div>
                   <div style="color:#fff;margin-bottom: 10px;"> <button style="width: 65px;height: 25px;margin-right: 15px;" class="guijiPeople1">确定</button><button style="width: 65px;height: 25px;margin-right: 15px;" class="guijiPeople2">取消</button></div>     
             </div>`
        $('body').append($(sbHTML1))

        laydate.render({
            elem: '#test1'
            , type: 'datetime'
        });
        laydate.render({
            elem: '#test2'
            , type: 'datetime'
        });

        $('#peopleGuiji').hide()
        $(".guijiPeople2").on("click", function () {
            $("#peopleGuiji").hide();
        })



        $(".guijiPeople1").on("click", function () {
            console.log(11111111)
            var dataTime = [{
                "device_id": loucsDeviceID,
                "create_time": $('#test1').val(),
                "end_time": $('#test2').val(),
            }]
            $("#peopleGuiji").hide();
            getPersonLocus(dataTime)
        })

        // 围栏事件选择
        var sbHTML1 = `<div id="peopleWeiLan" style="position:absolute;left:520px;top:20px;padding: 8px;width:300px;text-align: center;background: rgba(0,0,0,0.5);height:100px;z-index:10000;border-radius: 5px 5px;" class="timerType" id="sbType">
                    <div style="color:#fff;margin-bottom: 10px;">开始时间：<input style="background:none;border: 1px solid #fff;border-radius: 5px 5px;height: 20px;width: 135px;color:#ffffff;" type="text" id="test10"></div>
                    <div style="color:#fff;margin-bottom: 10px;">结束时间：<input style="background:none;border: 1px solid #fff;border-radius: 5px 5px;height: 20px;width: 135px;color:#ffffff;" type="text" id="test11"></div>
                    <div style="color:#fff;margin-bottom: 10px;"> <button style="width: 65px;height: 25px;margin-right: 15px;" class="guijiPeople12">确定</button><button style="width: 65px;height: 25px;margin-right: 15px;" class="guijiPeople13">取消</button></div>
                 
             </div>`
        $('body').append($(sbHTML1))
        $('#peopleWeiLan').hide()

        laydate.render({
            elem: '#test10'
            , type: 'datetime'
        });
        laydate.render({
            elem: '#test11'
            , type: 'datetime'
        });


        $(".guijiPeople13").on("click", function () {
            $("#peopleWeiLan").hide();
        })



        $(".guijiPeople12").on("click", function () {
            var start_date = $("#test10").val();
            var end_date = $("#test11").val();
            console.log('开始时间', start_date)
            console.log('结束时间', end_date)
            if (start_date && end_date) {
                if (start_date < end_date) {
                    console.log('插入围栏！！！！！')
                    var dataAll = [{
                        "name": "",
                        "initial_coordinates_x": start_p[0],
                        "initial_coordinates_y": start_p[2],
                        "initial_coordinates_z": 0,
                        "termination_coordinates_x": end_p[0],
                        "termination_coordinates_y": end_p[2],
                        "termination_coordinates_z": 0,
                        "creation_time": start_date,
                        "end_time": end_date,
                    }]
                    weiLangShuJu(dataAll)
                } else {
                    alert('结束时间不能早于开始时间！！！')
                }

            } else {
                alert('时间不能为空！！')
            }

        })


        // 周边设备时间选择
        var surround = `<div id="surround" style="position:absolute;left:520px;top:20px;padding: 8px;width:300px;text-align: center;background: rgba(0,0,0,0.5);height:200px;z-index:10000;border-radius: 5px 5px;" class="timerType" id="sbType">
                   <div style="color:#fff;margin-bottom: 10px;"><p style="text-align: left; margin-left: 70px;margin-top:25px">编号：<span id="surroundID"></span></div>
                   <div style="color:#fff;margin-bottom: 10px;"><p style="text-align: left; margin-left: 70px;">姓名：<span id="surroundName"></span></div>
                   <div style="color:#fff;margin-bottom: 10px;">开始时间：<input style="background:none;border: 1px solid #fff;border-radius: 5px 5px;height: 20px;width: 135px;color:#ffffff;" type="text" id="test20"></div>
                   <div style="color:#fff;margin-bottom: 10px;">结束时间：<input style="background:none;border: 1px solid #fff;border-radius: 5px 5px;height: 20px;width: 135px;color:#ffffff;"  type="text" id="test21" disabled="disabled"></div>
                   <div style="color:#fff;margin-bottom: 10px;"> <button style="width: 65px;height: 25px;margin-right: 15px;" id="subSurround">确定</button><button style="width: 65px;height: 25px;margin-right: 15px;" id="delSurround">取消</button></div>     
             </div>`

        $('body').append(surround)
        $('#surround').hide()

        laydate.render({
            elem: '#test20',
            type: 'datetime',
        });

        // $('#test20').change(function(){
        //     console.log($(this).val())
        // })

        $('#test20').click(function () {
            $('.laydate-btns-confirm').click(function () {
                // console.log(1)
                // testTime = setInterval(function(){
                var value = $('#test20').val()
                if (value) {
                    console.log(value)
                    var date = new Date(value);  //1. js获取当前时间
                    // console.log(new Date(value))
                    // console.log(new Date())
                    var min = date.getMinutes();  //2. 获取当前分钟
                    date.setMinutes(min + 5);  //3. 设置当前时间+10分钟：把当前分钟数+10后的值重新设置为date对象的分钟数
                    var y = date.getFullYear();
                    var m = (date.getMonth() + 1) < 5 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
                    var d = date.getDate() < 5 ? ("0" + date.getDate()) : date.getDate();
                    var h = date.getHours() < 5 ? ('0' + date.getHours()) : date.getHours()
                    var f = date.getMinutes() < 5 ? ('0' + date.getMinutes()) : date.getMinutes()
                    var s = date.getSeconds() < 5 ? ('0' + date.getSeconds()) : date.getSeconds()
                    var formatdate = y + '-' + m + '-' + d + " " + h + ":" + f + ":" + s;
                    console.log(formatdate)
                    $('#test21').val(new Date(formatdate).format("yyyy-MM-dd hh:mm:ss"))
                    clearInterval(testTime)
                }

                // },100)

            })
        })

        $('#delSurround').click(function () {
            $('#surround').hide()
        })

        $('#subSurround').click(function () {
            var date1 = $('#test20').val()
            var date2 = $('#test21').val()
            var subDate = [{
                "device_id": surroundID,
                "create_time": date1,
                "end_time": date2
            }]
            getSurround(subDate)
        })
    })




}
var testTime
// 获取周边设备
function getSurround(data) {
    console.log(data)
    $.ajax({
        type: "post",
        url: urlAll + "/circumdevice",
        dataType: "json",
        jsonpCallback: "callback",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (d) {
            if (d.length < 1) {
                alert('该人员无周边设备')
            } else {
                addSurround(d)
            }

        },
        error: function () {
            console.log('error')
        }
    })
}

// 刷新周边设备信息
function addSurround(data) {
    $('.surroundUL').html('')
    data.forEach(function (d) {
        var li = `<li onclick="toSurround(this)" id="` + d + `">` + d + `</li>`
        $('.surroundUL').append(li)
    })
    $('#surroundSebei').show()
}

// 定位surroundSebei
function toSurround(obj) {
    var id = obj.id
    var obj = app.query(id)[0]
    console.log(obj)
    app.level.change(obj.parent)
    app.camera.fit(obj)
    // app.on(THING.EventType.LevelFlyEnd, obj.parent, function (ev) {

    //     app.off(THING.EventType.LevelFlyEnd)
    // });

}



var t1, p1


function louCengAll() {
    var className = "louYu";
    $.ajax({
        type: "get",
        url: urlAll + "/query/buildingnumber",
        dataType: "json",

        success: function (data) {
            lastBuildNum = data
            for (let j = 0; j < data.length; j++) {
                var classLou = className + data[j].id;
                // var build = builds[j]
                var b_number = 0
                var tree1 = $('<div class="tree_box"></div>')
                var tree3 = $('<ul class="tree_one"></ul>')
                var li1;
                for (var i = 0, flors = data[j].room; i < flors.length; i++) {
                    var flors
                    var classFlor = className + flors[i].id;
                    li1 = $('<li></li>')
                    var treeName;
                    var tree4 = $('<h4 class="tree_name" id="' + flors[i].name + '">' + flors[i].name + '(<span class="' + classFlor + '">' + flors[i].number + '</span>)' + '</h4>')
                    li1.append(tree4)
                    li1.append($(`<ul class='tree_two'></ul>`))
                    tree3.append(li1)
                }
                var tree2 = $('<h3 class="tree_name build_name" id="' + data[j].name + '">' + data[j].name + '(<span class="' + classLou + '">' + data[j].number + '</span>)' + '</h3>')
                tree1.append(tree2)
                tree1.append(tree3)
                $('#main_a').append(tree1)
            }

            // THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/g.js'])
            $('.tree_name').click(function () {
                var thingID = $(this).attr('id')

                $('.tree_name').removeClass('choose_color')
                $(this).addClass('choose_color')

                $(this).next().toggle()

                console.log('进入', thingID)
                app.level.change(app.query('[id=' + thingID + ']')[0])
                // app.query('["id"=' + thingID + ']')[0].style.outlineColor = '#FFFF00'
                if (app.query('[id=' + thingID + ']')[0] instanceof THING.Building) {
                    console.log('进入建筑')
                    app.query('楼').visible = true
                }
                if (app.query('[id=' + thingID + ']')[0] instanceof THING.Room) {
                    // app.query('["id"=' + thingID + ']')[0].style.outlineColor = '#FFFF00'
                }
            })


            app.on(THING.EventType.LevelFlyEnd, '.Building||.Room', function (ev) {
                ev.object.style.outlineColor = '#FFFF00'
            });

            $('#personChoose .build_name').click(function () {
                //console.log(111222)
                if (!t1 && !p1) {
                    // console.log(11221122)
                    t1 = app.camera.target
                    p1 = app.camera.position
                }

            })


        },
        error: function () {
            console.log('error')
        }
    })

}



function louCengDom() {
    var className = ".louYu";
    $.ajax({
        type: "get",
        url: urlAll + "/query/buildingnumber",
        dataType: "json",

        success: function (data) {
            for (let j = 0; j < data.length; j++) {
                var classLou = className + data[j].id;
                $(classLou).text(data[j].number)
                for (var i = 0, flors = data[j].room; i < flors.length; i++) {

                    var classFlor = className + flors[i].id;
                    $(classFlor).text(flors[i].number)
                }


            }

        },
        error: function () {
            console.log('error')
        }
    })
}




louCengAll()
var dataQuyu;
function addDate() {
    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/g.css'], function () {
        var builds = app.query('楼')
        louCengDom()
        $.ajax({
            type: "get",
            url: urlAll + "/personnumquery",
            dataType: "json",
            jsonpCallback: "callback",
            success: function (data) {
                const classNam = "domeShu"
                // console.log('拉取数据', data)
                data.forEach((date, i) => {
                    const claN = classNam + date.type;
                    var tree1 = $('<div class="tree_box"></div>')
                    var tree2 = $('<h3 class="domeDivType" type="' + date.type + '">' + date.name + '(<span class="' + claN + '">' + date.number[0].count + '</span>)' + '</h3>')
                    var tree3 = $('<ul class="tree_one"></ul>')
                    tree1.append(tree2)
                    tree1.append(tree3)
                    $('#main_b').append(tree1)
                })
                // $(".domeDivType").on("click", function () {

                //     // console.log($(this).attr("type"))
                //     postName($(this).attr("type"), this)
                // })
                // setInterval(function () {
                shiSHi()
                // }, 1000)

            },
            error: function () {
                console.log('error')
            }
        })
        $('#personChoose').show()

    })
}

function returnHome() {
    //console.log('首页')
    app.level.change(app.root.defaultCampus)
    //console.log(t1, p1)
    if (t1 && p1) {
        // console.log(12121212)
        app.camera.flyTo({
            position: p1,
            target: t1,
            time: 2000
        });
        t1 = p1 = null
    }

}

function addSBHTML() {
    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/g2.css'], function () {
        var sbHTML = `<div class="navtion_bar closeClass" id="sbChoose">
        <div class="title_two">
        <div class="title_c active">区域管理</div>
        <div class="title_d" style="width: 50%;">设备分类</div>
    </div>
    <div class="tre" id="main_c">
             
    </div>
    <div class="tre" id="main_d" style="display: none">
        <div class="tre_box">
            <h3>
                摄像头(<span id="S_num">1</span>)
            </h3>
            <ul class="tre_one" id="S_main">

            </ul>
        </div>
        <div class="tre_box">
            <h3>
                门禁(<span id="M_num">1</span>)
            </h3>
            <ul class="tre_one" id="M_main">

            </ul>
        </div>
        <div class="tre_box">
            <h3>
                一键报警(<span id="Y_num">1</span>)
            </h3>
            <ul class="tre_one" id="Y_main">

            </ul>
        </div>
        <div class="tre_box">
            <h3>
                车禁(<span id="C_num">1</span>)
            </h3>
            <ul class="tre_one" id="C_main">

            </ul>
        </div>
        <div class="tre_box">
            <h3>
                基站(<span id="J_num">1</span>)
            </h3>
            <ul class="tre_one" id="J_main">

            </ul>
        </div>
        <div class="tre_box">
            <h3>
                周界(<span id="Z_num">1</span>)
            </h3>
            <ul class="tre_one" id="Z_main">

            </ul>
        </div>
    </div>
</div>`
        $('body').append($(sbHTML))
        $('#sbChoose').hide()
        getBRNum()
    })
}


function postNameSeBe(type, that) {

    var data = JSON.stringify([{ "type": type }])

    $.ajax({
        'url': urlAll + "/devicedatashow", //Ajax请求服务的地址
        'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
        'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
        //发送到服务器的数据
        'contentType': "application/json; charset=utf-8",
        'data': data,
        //请求成功后的回调函数
        'success': function (data) {
            // console.log(data)
            var dateName = $(that).next()
            // var tree3 = $('<ul class="tre_one"></ul>')
            // app.query(/SXT/).forEach(function (obj) {
            //     var tree4 = $('<li><h4 class="thing_name" onclick="clickPlane(this)" id="' + obj.id + '">' + obj.name + '</h4></li>')
            //     tree3.append(tree4)
            // })
            // tree1.append(tree3)
            // $('#main_d').append(tree1)
            $("domeLiSeBe").remove();
            data.forEach((date, i) => {
                var tree4 = $('<li class="domeLiSeBe"><h4 class="thing_name ploiceThingSe" onclick="clickPlane(this)" id="' + date.name + '">' + date.name + '</h4></li>')
                $(dateName).append(tree4)
            })
            //$(".tree_one").css("display","none");
            //console.log("1111")
            dateName.toggle()
            $(".ploiceThingSe").on("click", function () {
                const type = $(this).attr("type");
                const name = $(this).attr("id");
                const date = JSON.stringify([{
                    "ptype": type,
                    "username": name
                }])
            })
        },
        //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
        'error': function (xhr, status, error) {
            console.log(xhr);
        },
    });

}


//实时设备
function aiSiSEBE() {
    $.ajax({
        type: "get",
        url: urlAll + "/devicenumquery",
        dataType: "json",
        jsonpCallback: "callback",
        success: function (data) {

        },
        error: function () {
            console.log('error')
        }
    })
}

// 获取设备数量
function getSebeiNum() {
    $.ajax({
        type: "get",
        url: urlAll + "/erpdevicenum",
        dataType: "json",
        jsonpCallback: "callback",
        success: function (data) {
            sebeiNumSyn(data)
        },
        error: function () {
            console.log('error')
        }
    })
}

// 设备数量同步
function sebeiNumSyn(data) {
    data.forEach(function (d) {
        var name = d.name
        // console.log(d.name, d.number)
        if (name == '摄像头') {
            $('#S_num').html(d.number)
        } else if (name == '基站') {
            $('#J_num').html(d.number)
        } else if (name == '门禁') {
            $('#M_num').html(d.number)
        } else if (name == '车禁') {
            $('#C_num').html(d.number)
        } else if (name == '一键报警') {
            $('#Y_num').html(d.number)
        } else if (name == '周界') {
            $('#Z_num').html(d.number)
        } else {

        }
    })
}


// function louCengAll1() {
//     var className = "louYu";
//     $.ajax({
//         type: "get",
//         url: urlAll + "/query/buildingnumber",
//         dataType: "json",

//         success: function (data) {
//             //console.log(data+"2222222")
//             for (let j = 0; j < data.length; j++) {
//                 var classLou = className + data[j].id;
//                 console.log(classLou)
//                 // var build = builds[j]
//                 var b_number = 0
//                 var tree1 = $('<div class="tree_box"></div>')
//                 var tree3 = $('<ul class="tree_one"></ul>')
//                 // var floors = build.query('.Floor').add(app.query(/People/).query('[parent/id=' + build.id + ']'))
//                 var li1;
//                 for (var i = 0, flors = data[j].room; i < flors.length; i++) {
//                     var flors
//                     var classFlor = className + flors[i].id;
//                     //  var li3 = $('<li></li>')
//                     //  var h5 = $('<h5 class="tree_name" id="' + room.id + '">' + treeName + '(' + r_number + ')' + '</h5>')
//                     //              li3.append(h5)
//                     //             li3.append(ul2)
//                     //             ul.append(li3)
//                     li1 = $('<li></li>')
//                     var treeName;
//                     var tree4 = $('<h5 class="tree_name" onclick="clickPlane(this)" id="' + flors[i].id + '">' + flors[i].name + '(<span class="' + classFlor + '">' + flors[i].number + '</span>)' + '</h5>')
//                     li1.append(tree4)
//                     // if (floors[i].userData.username) {
//                     //     treeName = floors[i].userData.username
//                     //     b_number++
//                     //     var tree4 = $('<h4 class="thing_name" onclick="clickPlane(this)" id="' + floors[i].id + '">' + treeName + '</h4>')
//                     //     li1.append(tree4)
//                     // } else {
//                     //     var num = i + 1;
//                     //     var fName = '第' + num + '层';
//                     //     var f_number = app.query(/People/).query('[parent/id=' + floors[i].id + ']').length
//                     //     var ul = $('<ul class="tree_two"></ul>')
//                     //     floors[i].query('.Room').add(app.query(/People/).query('[parent/id=' + floors[i].id + ']')).forEach(function (room) {

//                     //         if (room.userData.username) {
//                     //             treeName = room.userData.username
//                     //             b_number++
//                     //             var li3 =$('<li></li>')
//                     //             var h5 = $('<h5 class="thing_name" onclick="clickPlane(this)" id="' + room.id + '">' + treeName + '</h5>')
//                     //             li3.append(h5)
//                     //             ul.append(li3)
//                     //         } else {
//                     //             treeName = room.id
//                     //             var r_number = app.query(/People/).query('[parent/id=' + room.id + ']').length
//                     //             var ul2 = $('<ul class="tree_three"></ul>')
//                     //             app.query(/People/).query('[parent/id=' + room.id + ']').forEach(function (p) {
//                     //                 var li2 = $('<li id=1 class="thing_name" onclick="clickPlane(this)">Tom</li>')
//                     //                 ul2.append(li2)
//                     //                 f_number++
//                     //                 b_number++
//                     //             })
//                     //             var li3 = $('<li></li>')
//                     //             var h5 = $('<h5 class="tree_name" id="' + room.id + '">' + treeName + '(' + r_number + ')' + '</h5>')
//                     //             li3.append(h5)
//                     //             li3.append(ul2)
//                     //             ul.append(li3)
//                     //         }


//                     //     })

//                     //     var tree4 = $('<h4 class="tree_name" id="' + floors[i].id + '">' + fName + '(' + f_number + ')' + '</h4>')
//                     //     li1.append(tree4)
//                     // }



//                     //li1.append(ul)
//                     tree3.append(li1)
//                 }
//                 var tree2 = $('<h3 class="tree_name build_name" id="' + data[j].id + '">' + data[j].name + '(<span class="' + classLou + '">' + data[j].number + '</span>)' + '</h3>')
//                 tree1.append(tree2)
//                 tree1.append(tree3)
//                 $('#main_c').append(tree1)

//             }
//             // $('.tree_name').click(function () {
//             //     var thingID = $(this).attr('id')

//             //     $('.tree_name').removeClass('choose_color')
//             //     $(this).addClass('choose_color')

//             //       $(this).next().toggle()
//             //     //  app.level.change(app.query('[id=' + thingID + ']')[0])
//             //     // if (app.query('[id=' + thingID + ']')[0] instanceof THING.Building) {
//             //     //     //console.log('进入建筑')
//             //     //     app.query('楼').visible = true
//             //     // }
//             // })

//             // $('#personChoose .build_name').click(function () {
//             //     //console.log(111222)
//             //     if (!t1 && !p1) {
//             //        // console.log(11221122)
//             //         t1 = app.camera.target
//             //         p1 = app.camera.position
//             //     }

//             // })


//         },
//         error: function () {
//             console.log('error')
//         }
//     })
// }


var sbList = []
function addSBData() {
    sbList = app.query(/SXT/).add(app.query(/MJ/)).add(app.query(/CJ/)).add(app.query(/JZ/)).add(app.query(/YJ/))
    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/g2.js'], function () {
        //var builds = app.query('楼')
        // louCengAll1()
        // for (let j = 0; j < builds.length; j++) {
        //     var b_number = 0
        //     var build = builds[j]
        //     var tre1 = $('<div class="tre_box"></div>')
        //     var tre3 = $('<ul class="tre_one"></ul>')
        //     var floors = build.query('.Floor').add(sbList.query('[parent/id=' + build.id + ']'))
        //     var li1;
        //     for (var i = 0; i < floors.length; i++) {
        //         li1 = $('<li></li>')
        //         var ul = $('<ul class="tre_two"></ul>')
        //         var treName;
        //         if (floors[i] instanceof THING.Floor) {
        //             var num = i + 1;
        //             var f_number = sbList.query('[parent/id=' + floors[i].id + ']').length
        //             var fName = '第' + num + '层'
        //             floors[i].query('.Room').add(sbList.query('[parent/id=' + floors[i].id + ']')).forEach(function (room) {
        //                 if (room instanceof THING.Room) {
        //                     treName = room.id
        //                     var r_number = sbList.query('[parent/id=' + room.id + ']').length
        //                     var li3 = $('<li></li>')
        //                     var h5 = $('<h5 class="tre_name" id="' + room.id + '">' + treName + '(' + r_number + ')' + '</h5>')
        //                     li3.append(h5)
        //                     var ul2 = $('<ul class="tre_three"></ul>')
        //                     sbList.query('[parent/id=' + room.id + ']').forEach(function (p) {
        //                         var li2 = $('<li id=1 class="thing_name" onclick="clickPlane(this)">' + p.name + '</li>')
        //                         ul2.append(li2)
        //                         f_number++
        //                         b_number++
        //                     })
        //                     li3.append(ul2)
        //                     ul.append(li3)
        //                 } else {
        //                     treName = room.name
        //                     b_number++
        //                     var li3 = $('<li></li>')
        //                     var h5 = $('<h5 class="thing_name" onclick="clickPlane(this)" id="' + room.id + '">' + treName + '</h5>')
        //                     li3.append(h5)
        //                     ul.append(li3)

        //                 }

        //             })
        //             // console.log('trename', treName)
        //             var tre4 = $('<h4 class="tre_name" id="' + floors[i].id + '">' + fName + '(' + f_number + ')' + '</h4>')
        //             li1.append(tre4)
        //         } else {
        //             treName = floors[i].name;
        //             var tre4 = $('<h4 class="thing_name" onclick="clickPlane(this)" id="' + floors[i].id + '">' + treName + '</h4>')
        //             li1.append(tre4)
        //             b_number++
        //         }




        //         li1.append(ul)
        //         tre3.append(li1)
        //     }
        //     var tre2 = $('<h3 class="tre_name build_name" id="' + build.id + '">' + build.id + '(' + b_number + ')' + '</h3>')
        //     tre1.append(tre2)
        //     tre1.append(tre3)
        //     $('#main_c').append(tre1)

        // }





        // var a_number = sbList.query('[parent/id=0]').length
        // var tree1 = $('<div class="tre_box"></div>')
        // var tree2 = $('<h3>空地' + '(' + a_number + ')' + '</h3>')
        // tree1.append(tree2)
        // var tree3 = $('<ul class="tre_one"></ul>')
        // sbList.query('[parent/id=0]').forEach(function (obj) {
        //     var tree4 = $('<li><h4 class="thing_name" onclick="clickPlane(this)" id="' + obj.id + '">' + obj.name + '</h4></li>')
        //     tree3.append(tree4)
        // })
        // tree1.append(tree3)
        // $('#main_c').append(tree1)
        var sxt_number = app.query(/SXT/).length


        // var tree1 = $('<div class="tre_box"></div>')
        // var tree2 = $('<h3>摄像头' + '(' + sxt_number + ')' + '</h3>')
        // tree1.append(tree2)
        // var tree3 = $('<ul class="tre_one"></ul>')
        // app.query(/SXT/).forEach(function (obj) {
        //     var tree4 = $('<li><h4 class="thing_name" onclick="clickPlane(this)" id="' + obj.id + '">' + obj.name + '</h4></li>')
        //     tree3.append(tree4)
        // })
        // tree1.append(tree3)
        // $('#main_d').append(tree1)
        // var mj_number = app.query(/MJ/).length
        // var tree1 = $('<div class="tre_box"></div>')
        // var tree2 = $('<h3>门禁' + '(' + mj_number + ')' + '</h3>')
        // tree1.append(tree2)
        // var tree3 = $('<ul class="tre_one"></ul>')
        // app.query(/MJ/).forEach(function (obj) {
        //     var tree4 = $('<li><h4 class="thing_name" onclick="clickPlane(this)" id="' + obj.id + '">' + obj.name + '</h4></li>')
        //     tree3.append(tree4)
        // })
        // tree1.append(tree3)
        // $('#main_d').append(tree1)
        // var tree1 = $('<div class="tre_box"></div>')
        // var tree2 = $('<h3>车禁' + '(' + app.query(/CJ/).length + ')' + '</h3>')
        // tree1.append(tree2)
        // var tree3 = $('<ul class="tre_one"></ul>')
        // app.query(/CJ/).forEach(function (obj) {
        //     var tree4 = $('<li><h4 class="thing_name" onclick="clickPlane(this)" id="' + obj.id + '">' + obj.name + '</h4></li>')
        //     tree3.append(tree4)
        // })
        // tree1.append(tree3)
        // $('#main_d').append(tree1)
        // var tree1 = $('<div class="tre_box"></div>')
        // var tree2 = $('<h3>基站' + '(' + app.query(/JZ/).length + ')' + '</h3>')
        // tree1.append(tree2)
        // var tree3 = $('<ul class="tre_one"></ul>')
        // app.query(/JZ/).forEach(function (obj) {
        //     var tree4 = $('<li><h4 class="thing_name" onclick="clickPlane(this)" id="' + obj.id + '">' + obj.name + '</h4></li>')
        //     tree3.append(tree4)
        // })
        // tree1.append(tree3)
        // $('#main_d').append(tree1)
        // var tree1 = $('<div class="tre_box"></div>')
        // var tree2 = $('<h3>一键报警' + '(' + app.query(/YJ/).length + ')' + '</h3>')
        // tree1.append(tree2)
        // var tree3 = $('<ul class="tre_one"></ul>')
        // app.query(/YJ/).forEach(function (obj) {
        //     var tree4 = $('<li><h4 class="thing_name" onclick="clickPlane(this)" id="' + obj.id + '">' + obj.name + '</h4></li>')
        //     tree3.append(tree4)
        // })
        // tree1.append(tree3)
        // $('#main_d').append(tree1)
        // addSeBei()
        $('#sbChoose .build_name').click(function () {
            //console.log(111222)
            if (!t1 && !p1) {
                //console.log(11221122)
                t1 = app.camera.target
                p1 = app.camera.position
            }

        })
        // $('.tre_name').click(function () {
        //     $('.tre_name').removeClass('choose_color')
        //     $(this).addClass('choose_color')
        //     $(this).next().toggle()
        //     // var thingID = $(this).attr('id')
        //     // app.level.change(app.query('[id=' + thingID + ']')[0])


        // })
        // app.camera.fit(gold_thing)
        // console.log('长度', $('.thing_name').length)

    })
}




//gaoJing

// addGAOPLOICE()
// function addGAOPLOICE() {
//     THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/g2.css'], function () {
//         var addHTL =
//         `<div class="navtion_bar divNative" id="addPloice12">
//             <div class="title_two">
//                 <div class="title_e active" onclick="returnHome()">区域</div>
//                 <div class="title_f">告警</div>
//             </div>
//            
//           <div style="display: block;" class="tre" id="main_f">
//           </div>
//     </div>`

//         $('body').append($(addHTL))
//         $('#addPloice12').hide()
//     })
// }



// 利用模板字符串 创建页面元素
function create_html() {
    var addHTL = `<div class="navigation_bar navtiontion_car closeClass" id="addPloice12">
    <div class="title_two">
       
        <div class="titleAll title_f">告警</div>
        </div>
       
        <div style="display: block;position: relative;text-indent:10px;" class="tre" id="main_f">
        <ul></ul>
        </div>
        <div id="lookMore" style="position: absolute;top: 215px;right: 5px;cursor: pointer;"><span>>>>查看更多</span></div>
   </div>`
    $('body').append($(addHTL))
    $('#addPloice12').hide()
    $(".title_e").click(function () {
        $(".titleAll").removeClass("active");
        $(this).addClass("active")
        $("#main_e").css("display", "block")
        $("#main_f").css("display", "none")
    })
    $(".title_f").click(function () {
        $(".titleAll").removeClass("active");
        $(this).addClass("active")
        $("#main_e").css("display", "none")
        $("#main_f").css("display", "block")
    })

    $('#lookMore').click(function () {
        if ($('#perSearch1').is(":hidden")) {
            $('#w1').hide()
            $('#w2').hide()
            searchAllWanring(0)
            $('#perSearch1').addClass('upinput')
            $('#perSearch1').show()
        } else {
            $('#perSearch1').removeClass('upinput')
            $('#perSearch1').hide()
        }
    })
}
// 8.点击告警，能否直接定位到告警设备？便于了解设备位置，发生时间。
// 刷新当前告警
var lastAlarm = ''
function getNewAlarm() {
    $.ajax({
        type: "get",
        url: urlAll + "/pageallalarm?page=0",
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            if (d.toString != lastAlarm) {
                $('#main_f ul').html('')
                d.forEach(function (obj) {
                    var li = `<li>` + obj.name + `</li>`
                    $('#main_f ul').append(li)
                })
                lastAlarm = d.toString
            }
        },
        error: function () {
            console.log('error')
        }
    })
}







function addPloice() {


    var builds = app.query('楼')
    // for (let j = 0; j < builds.length; j++) {
    //     var build = builds[j]
    //     var b_number = 0
    //     var tree1 = $('<div class="tree_box"></div>')
    //     var tree3 = $('<ul class="tree_one"></ul>')
    //     var floors = build.query('.Floor').add(app.query(/People/).query('[parent/id=' + build.id + ']'))
    //     var li1;
    //     for (var i = 0; i < floors.length; i++) {
    //         li1 = $('<li></li>')
    //         var treeName;
    //         if (floors[i].userData.username) {
    //             treeName = floors[i].userData.username
    //             b_number++
    //             var tree4 = $('<h4 class="thing_name" onclick="clickPlane(this)" id="' + floors[i].id + '">' + treeName + '</h4>')
    //             li1.append(tree4)
    //         } else {
    //             var num = i + 1;
    //             var fName = '第' + num + '层';
    //             var f_number = app.query(/People/).query('[parent/id=' + floors[i].id + ']').length
    //             var ul = $('<ul class="tree_two"></ul>')
    //             floors[i].query('.Room').add(app.query(/People/).query('[parent/id=' + floors[i].id + ']')).forEach(function (room) {

    //                 if (room.userData.username) {
    //                     treeName = room.userData.username
    //                     b_number++
    //                     var li3 = $('<li></li>')
    //                     var h5 = $('<h5 class="thing_name" onclick="clickPlane(this)" id="' + room.id + '">' + treeName + '</h5>')
    //                     li3.append(h5)
    //                     ul.append(li3)
    //                 } else {
    //                     treeName = room.id
    //                     var r_number = app.query(/People/).query('[parent/id=' + room.id + ']').length
    //                     var ul2 = $('<ul class="tree_three"></ul>')
    //                     app.query(/People/).query('[parent/id=' + room.id + ']').forEach(function (p) {
    //                         var li2 = $('<li id=1 class="thing_name" onclick="clickPlane(this)">Tom</li>')
    //                         ul2.append(li2)
    //                         f_number++
    //                         b_number++
    //                     })
    //                     var li3 = $('<li></li>')
    //                     var h5 = $('<h5 class="tree_name" id="' + room.id + '">' + treeName + '(' + r_number + ')' + '</h5>')
    //                     li3.append(h5)
    //                     li3.append(ul2)
    //                     ul.append(li3)
    //                 }


    //             })

    //             var tree4 = $('<h4 class="tree_name" id="' + floors[i].id + '">' + fName + '(' + f_number + ')' + '</h4>')
    //             li1.append(tree4)
    //         }



    //         li1.append(ul)
    //         tree3.append(li1)
    //     }
    //     var tree2 = $('<h3 class="tree_name build_name" id="' + build.id + '">' + build.id + '(' + b_number + ')' + '</h3>')
    //     tree1.append(tree2)
    //     tree1.append(tree3)
    //     $('#main_e').append(tree1)

    // }
    // var tree1 = $('<div class="tree_box"></div>')
    // var tree2 = $('<h3>空地' + '(' + app.query(/People/).query('[parent/id=0]').length + ')' + '</h3>')
    // tree1.append(tree2)
    // var tree3 = $('<ul class="tree_one"></ul>')
    // app.query(/People/).query('[parent/id=0]').forEach(function (obj) {
    //     var tree4 = $('<li><h4 class="thing_name" onclick="clickPlane(this)" id="' + obj.id + '">' + obj.userData.username + '</h4></li>')
    //     tree3.append(tree4)
    // })
    // tree1.append(tree3)
    // $('#main_e').append(tree1)
    // seBeiAll()
    // setInterval(function () {
    // seBeiAll()
    // }, 300000)

    // $('.tree_name').click(function () {
    //     var thingID = $(this).attr('id')
    //     // app.level.change(app.query('[id=' + thingID + ']')[0])
    //     $('.tree_name').removeClass('choose_color')
    //     $(this).addClass('choose_color')
    //     // if (app.query('[id=' + thingID + ']')[0] instanceof THING.Building) {
    //     //     //console.log('进入建筑')
    //     //     app.query('楼').visible = true
    //     // }
    // })

    $('#addPloice12 .build_name').click(function () {
        //console.log(111222)
        if (!t1 && !p1) {
            //console.log(11221122)
            t1 = app.camera.target
            p1 = app.camera.position
        }

    })
}




// 利用模板字符串 创建页面元素
function create_html1() {
    var followHTML = `<div style="display: none;" class="navigation_bar navtiontion_car closeClass" id="followLeft">
    <div class="title_two">
        
        <div class="titleAll1 title_f1">跟随组</div>
        </div>
        <div style="display: block;" class="tre" id="followMain">
        </div>
   </div>`
    $('body').append(followHTML)
    $('#follwLeft').hide()


    var addHTL = `<div style="display: none;" class="navigation_bar navtiontion_car closeClass" id="addPloice13">
    <div class="title_two">
        
        <div class="titleAll1 title_f1">电子围栏</div>
        </div>
        <div style="display: block;" class="tre" id="main_e1">
        </div>
      
   </div>`

    $('body').append($(addHTL))
    $('#addPloice13').hide()

    $(".title_e1").click(function () {
        $(".titleAll1").removeClass("active");
        $(this).addClass("active")
        $("#main_e1").css("display", "block")
        $("#main_f1").css("display", "none")
    })
    $(".title_f1").click(function () {
        $(".titleAll1").removeClass("active");
        $(this).addClass("active")
        $("#main_e1").css("display", "none")
        $("#main_f1").css("display", "block")
    })
}






function addPloice1() {

    var builds = app.query('楼')
}







var idPloice = null;
function gold_thing_showUI(object) {
    if (gold_thing) gold_thing.obj.style.outlineColor = null
    if (gold_thing && gold_thing.ui) {
        gold_thing.ui.destroy()
        gold_thing = null
    }
    var pos = object.selfToWorld([1.5, object.size[1], 1.5]);
    if (object.name.substring(0, 1) === 'Y') {
        // console.log('改变')
        pos = object.selfToWorld([0.3, 0, 0.3])
    } else if (object.name.substring(0, 1) === 'P') {
        // console.log('改变')
        pos = object.selfToWorld([3, object.size[1] * 3, 3])
    };
    app.on(THING.EventType.LevelFlyEnd, '*', function (ev) {
        app.camera.flyTo({
            position: pos,
            target: [object.position[0], object.position[1] + object.size[1], object.position[2]],
            // radius: 2, 
            time: 1000,
            complete: function () {
                object.style.outlineColor = '#DC143C'
                //console.log(object.name.substring(0, 1))
                if (object.name.substring(0, 1) === 'P') {
                    gold_thing = new Person(object)
                    gold_thing.showPanel()
                    //console.log('人员')
                } else if (object.name.substring(0, 1) === 'M') {
                    gold_thing = new MJ(object)
                    gold_thing.showPanel()
                } else if (object.name.substring(0, 1) === 'C') {
                    gold_thing = new CJ(object)
                    gold_thing.showPanel()
                } else if (object.name.substring(0, 1) === 'Y') {
                    gold_thing = new YJ(object)
                    gold_thing.showPanel()
                } else if (object.name.substring(0, 1) === 'J') {
                    gold_thing = new JZ(object)
                    gold_thing.showPanel()
                } else if (object.name.substring(0, 1) === 'S') {
                    gold_thing = new VideoCamera(object)
                    gold_thing.showPanel()
                }
            }

        })
        app.off(THING.EventType.LevelFlyEnd, '*');

    });
    app.level.change(object.parent)
}
function clickPlane(obj) {
    $('.tre_name').removeClass('choose_color')
    $('.tree_name').removeClass('choose_color')
    $('.thing_name').removeClass('choose_color')
    $(obj).addClass('choose_color')
    // var object = app.query('[id=' + $(obj).attr('id') + ']')[0]
    // //gold_thing_showUI(object)
    var person_type = $(obj).attr("type");
    var person_name = $(obj).attr("id");
    console.log('name与type', person_name, person_type)
    // var person_date = [{
    //     "ptype": person_type,
    //     "username": person_name
    // }]
    app.camera.fit(app.query('["id"=' + person_name + ']')[0])
    // postPloice(person_data)
}

function showColor(id) {

    $('.tre_name').removeClass('choose_color')
    $('.tree_name').removeClass('choose_color')
    $('.thing_name').removeClass('choose_color')
    $('#' + id).addClass('choose_color')
}


var gold_thing = null

function addStaHTML() {
    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/h.css',], function () {
        var hHTML = `<div id="statistic" style='height: 303px;'>
        <div class="main_data border">
            <div class="data_num" id="peoNum">
                
            </div>
            <div class="data_title">
                人员
            </div>
        </div>
        <div class="main_data border">
            <div class="data_num" id="sbNum">
            </div>
            <div class="data_title">
                设备
            </div>
        </div>
            <div class="main_data">
            <div class="data_num" id="btnopen" style='font-size: 20px;'>
                信息
            </div>
            <div class="data_title">
            </div>
        </div>
    </div>`
        $('#div3d').append($(hHTML))
        $('#btnopen').click(function () {
            var win = window.open("http://47.103.34.10:8080/charlists", "123213123", "width=1200px,height=600px,top=100,left=200,menubar=yes,location=yes,scrollbars=yes")//表示不会一直新建窗体，一直都是在名字为abccc的窗体打开（第一次是新建了一个abccc的窗体，之后就不会再创建）
            win.moveTo(200, 200);
        })
        //  层级变化
        app.on(THING.EventType.LevelChange, function (ev) {
            // if (gold_thing) {
            //     gold_thing.ui.destroy()
            //     gold_thing = null
            //     gold_thing.obj.style.outlineColor = null;
            // }
            app.query('.Building').visible = true
            var object = ev.current;
            if (object instanceof THING.Campus) {
                // console.log('Campus: ' + object);
                // $('#peoNum').html(app.query(/People/).length)
                // $('#sbNum').html(sbList.length)

            }
            else if (object instanceof THING.Building) {
                //console.log('Building: ' + object);
                var peoNum = 0, sbNum = 0;
                object.query('.Floor').forEach(function (floor) {
                    peoNum = peoNum + app.query(/People/).query('[parent/id=' + floor.id + ']').length
                    sbNum = sbNum + sbList.query('[parent/id=' + floor.id + ']').length
                })
                // $('#peoNum').html(peoNum)
                // $('#sbNum').html(sbNum)
                app.query('楼').visible = true

            }
            else if (object instanceof THING.Floor) {
                // console.log('Floor: ' + object);
                // $('#peoNum').html(app.query(/People/).query('[parent/id=' + object.id + ']').length)
                // $('#sbNum').html(sbList.query('[parent/id=' + object.id + ']').length)
            }
            else if (object instanceof THING.Thing) {
                //console.log('Thing: ' + object);
            }
        });
    })
}
var numBge = numBge11 = numBge12 = false;

function addSearchHTML() {
    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/e.css',
        // '/uploads/wechat/emhhbmdDaGVuZw==/file/demo2000/paging.css',
        // '/uploads/wechat/emhhbmdDaGVuZw==/file/demo2000/paging.js',
        '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/close1.js',
        '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/w.css',
        '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/delFence.css'
    ], function () {
        var eHTML = `<div style="width:600px" class="searchThing" id="sbSearh">
        <div class="Search SB_title">
            <span>按编号搜索</span>
            <input type="text" id="sbName">
            <span><button class="SB_btn" id="sbBtn">搜索</button></span>
            <span class="close_btn">X</span>
        </div>
        <div class="SB_main">
            <ul class="info_title">
                <li style="width:25%">编号</li>
                <li style="width:25%">类别</li>
                <li style="width:25%">状态</li>
                <li style="width:25%">操作</li>
            </ul>
            <ul style="height: 350px" class="SB_info" id="sbInfo">
                </ul>
                <div id="pag2"></div>
        </div>
    </div>`
        $('body').append($(eHTML))
        $('#sbBtn').click(function () {
            var name = $('#sbName').val()
            var date1 = JSON.stringify([{ "name": name }])
            $.ajax({
                'url': urlAll + "/realtimedevicequery?page=0", //Ajax请求服务的地址
                'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
                'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
                //发送到服务器的数据
                'contentType': "application/json; charset=utf-8",
                'data': date1,
                //请求成功后的回调函数
                'success': function (data) {
                    console.log('设备搜索数据', data)
                    //$("#box1").css("display","none")
                    if (data.length > 0) {
                        addSInfo(data)
                        $('#pag2').html('')
                        pag2.init({
                            target: $('#pag2'), pagesize: 10, count: data[0].number, current: 1, callback: function (pagecount, size, count) {
                                var date = JSON.stringify([{ "name": name }])
                                seBeiSoushu(date, pagecount - 1)
                            }
                        })
                    } else {
                        alert('没有匹配到设备！！')
                    }

                },
                //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
                'error': function (xhr, status, error) {
                    console.log(xhr);
                },
            });

            //addSInfo(sbList.query(eval('/' + $('#sbName').val() + '/')))
        })
        $('#sbSearh').hide()
        var eHTML2 = `<div style="width:600px" class="searchThing" id="perSearch">
        <div class="Search SB_title">
            <span>按姓名搜索</span>
            <input type="text" id="perName">
            <span><button class="SB_btn" id="psBtn">搜索</button></span>
            <span class="close_btn">X</span>
        </div>
        <div style="bottom: 100px;" class="SB_main">
            <ul class="info_title">
                <li style="width:25%">编号</li>
                <li style="width:25%">姓名</li>
                <li style="width:25%">类别</li>
                <li style="width:25%">操作</li>
            </ul>
            <ul style="height: 350px" class="SB_info" id="perInfo">
                </ul>
            <div id="pag1"></div>
        </div>
        
    </div>`
        $('body').append($(eHTML2))


        $('#psBtn').click(function () {
            var name = $('#perName').val()
            console.log('name', name)
            var date = JSON.stringify([{ "name": name }])
            $.ajax({
                'url': urlAll + "/realtimeinfoquery?page=0", //Ajax请求服务的地址
                'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
                'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
                //发送到服务器的数据
                'contentType': "application/json; charset=utf-8",
                'data': date,
                //请求成功后的回调函数
                'success': function (data) {
                    if (data.length > 0) {
                        pag1.render({
                            count: data[0].number, current: 1, callback: (pagecount, size, count) => {
                                var date = JSON.stringify([{ "name": name }])
                                peopleSoushu(data, pagecount - 1)
                            }
                        });

                        // console.log(data)
                        addPInfoSo(data)
                    } else {
                        alert('实时数据中无此人！！')
                    }


                    //seBeiSoushu
                    //$("#box").css("display","none")
                    // 处理返回的数据
                },
                //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
                'error': function (xhr, status, error) {
                    console.log(xhr);
                },
            });




            //ajaxGetDate()
            //addPInfo(app.query(/People/).query(eval('/' + name + '/')))
        })
        $('#perSearch').hide()







        //告警

        var eHTML3 = `<div style="width:800px;height:550px" class="searchThing" id="perSearch1">
        <div class="Search SB_title">
            <span>按编号搜索</span>
            <input type="text" id="perName1">
            <span><button class="SB_btn" id="psBtn1">搜索</button></span>
            <span class="close_btn">X</span>
        </div>
        <div class="SB_main">
        <ul class="alarm_title">
            <li>告警设备</li>
            <li>告警人员</li>
            <li>告警类型</li>
            <li>告警程度</li>
            <li>告警时间</li>
        </ul>
        <ul class="alarm_main">
            
        </ul>
        <div id="pag3"></div>
    </div>
     </div>`
        $('body').append($(eHTML3))
        $('#perSearch1').hide()

        $('#psBtn1').click(function () {
            var name = $('#perName1').val()
            var date = JSON.stringify([{ 'name': name }])
            getSearchNameAlarm(date, 0)

        })

        // 围栏搜索
        var fenS = `<div style="width:800px;height:550px" class="searchThing" id="fenS">
        <div class="Search SB_title">
            <span>按编号搜索</span>
            <input type="text" id="perName3">
            <span><button class="SB_btn" id="psBtn3">搜索</button></span>
            <span class="close_btn">X</span>
        </div>
        <div class="SB_main">
        <ul class="alarm_title">
            <li>告警设备</li>
            <li>告警人员</li>
            <li>告警类型</li>
            <li>告警程度</li>
            <li>告警时间</li>
        </ul>
        <ul class="alarm_main">
            
        </ul>
        <div id="pag5"></div>
    </div>
     </div>`
        $('body').append(fenS)
        $('#fenS').hide()
        //  围栏当前告警
        var fenNow = `<div class="searchThing alarm" id="fenNow">
    <div style="width: 100%;height: 40px;position: relative;"><span class="close_btn">X</span></div>
    <div class="SB_main">
        <ul class="alarm_title">
            <li>告警设备</li>
            <li>告警人员</li>
            <li>告警类型</li>
            <li>告警程度</li>
            <li>告警时间</li>
        </ul>
        <ul class="alarm_main">
            
        </ul>
        
    </div>
</div>`
        $('body').append(fenNow)
        $('#fenNow').hide()
        // 围栏历史告警
        var fenOld = `<div class="searchThing alarm" id="fenOld">
    <div style="width: 100%;height: 40px;position: relative;"><span class="close_btn">X</span></div>
    <div class="SB_main">
        <ul class="alarm_title">
            <li>告警设备</li>
            <li>告警人员</li>
            <li>告警类型</li>
            <li>告警程度</li>
            <li>告警时间</li>
        </ul>
        <ul class="alarm_main">
            
        </ul>
        <div id="pag6"></div>
    </div>
</div>`
        $('body').append(fenOld)
        $('#fenOld').hide()
        var eHTML4 = `<div style="width:600px" class="searchThing" id="perSearch2">
        <div class="Search SB_title">
            <span>按编号搜索</span>
            <input type="text" id="perName2">
            <span><button class="SB_btn" id="psBtn2">搜索</button></span>
            <span class="close_btn">X</span>
        </div>
        <div style="bottom: 100px;" class="SB_main">
            <ul class="info_title">
            
                <li style="width:25%">告警坐标</li>
                <li style="width:40%">开始时间</li>
                <li style="width:35%">结束时间</li>
            </ul>
            <ul style="height: 300px" class="SB_info" id="perInfo2">
                </ul>
                 <div class="pagger-box pagger" id="box4"></div>
        </div>
     </div>`
        $('body').append($(eHTML4))
        $('#perSearch2').hide()
        $("#psBtn2").on("click", function () {
        })

        var delFence = `<div id="delFence" class="searchThing" style="width: 600px;z-index: 1">
            <div class="delHTML"><span class="close_btn">X</span></div>
            <ul class="fenceTitle">
                <li>编号</li>
                <li>开始坐标</li>
                <li>结束坐标</li>
                <li>状态</li>
                <li>删除</li>
            </ul>
            <ul class="fenceMain">
                
                
            </ul>
            <div id="pag7"></div>
        </div>`
        $('body').append(delFence)
        $('#delFence').hide()


        var surroundHTML = `<div id="surroundSebei" class="searchThing" style="width: 200px;">
            <div class="Search SB_title" style="width: 100%;height: 39px;position: relative">
                <span>周边设备</span>
                <span class="close_btn">X</span>
            </div>
            <ul class="surroundUL" ></ul>
        </div>`
        $('body').append(surroundHTML)
        $('#surroundSebei').hide()

        $('.close_btn').click(function () {
            console.log('关闭')
            $(this).parent().parent().hide()
        })
    })

}

// 获取条件搜索告警
function getSearchNameAlarm(nameData, pag) {
    console.log(222)
    $.ajax({
        'url': urlAll + "/conditionfind?page=" + pag, //Ajax请求服务的地址
        'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
        'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
        //发送到服务器的数据
        'contentType': "application/json",
        'data': nameData,
        //请求成功后的回调函数
        'success': function (data) {
            if (data.length > 0) {
                alarmRendering(data, '#perSearch1 .alarm_main')
                if (pag == 0) {
                    $('#pag3').html('')
                    pag3.init({
                        target: $('#pag3'), pagesize: 10, count: data[0].number, current: 1, callback: function (pagecount, size, count) {

                            getSearchNameAlarm(nameData, pagecount - 1)
                        }
                    })
                }
            } else {
                alert('无此信息！！！')
            }


        },
        //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
        'error': function (xhr, status, error) {
            console.log(xhr);
        },
    });
}





function peopleSoushu(date, page) {
    $.ajax({
        'url': urlAll + "/realtimeinfoquery?page=" + page, //Ajax请求服务的地址
        'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
        'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
        //发送到服务器的数据
        'contentType': "application/json; charset=utf-8",
        'data': date,
        //请求成功后的回调函数
        'success': function (data) {
            // console.log(data)
            addPInfoSo(data)
            //seBeiSoushu
            //$("#box").css("display","none")
            // 处理返回的数据
        },
        //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
        'error': function (xhr, status, error) {
            console.log(xhr);
        },
    });
}


function seBeiSoushu(date, number) {
    console.log(1111111)
    $.ajax({
        'url': urlAll + "/realtimedevicequery?page=" + number, //Ajax请求服务的地址
        'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
        'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
        //发送到服务器的数据
        'contentType': "application/json; charset=utf-8",
        'data': date,
        //请求成功后的回调函数
        'success': function (data) {
            //console.log(data)
            //$("#box1").css("display","none")
            addSInfo(data)
            // 处理返回的数据
        },
        //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
        'error': function (xhr, status, error) {
            console.log(xhr);
        },
    });
}






var numBage2 = false
function addPostSou(number) {
    $.ajax({
        type: "get",
        url: urlAll + "/realtimeperson?page=" + number,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (data) {
            console.log('number', number)
            addPInfo(data)
            if (number == 0) {
                if (numBage2) {
                    pag1.render({
                        count: data[0].number, current: 1, callback: (pagecount, size, count) => {
                            addPostSou(pagecount - 1)
                        }
                    });
                } else {
                    numBage2 = true
                    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                        $('#pag1').html('')
                        pag1 = new Paging()
                        pag1.init({
                            target: $('#pag1'), pagesize: 10, count: data[0].number, current: 1, callback: function (pagecount, size, count) {

                                addPostSou(pagecount - 1)
                            }
                        })
                    })
                }

            }
        },
        error: function () {
            console.log('error')
        }
    })
}

var numBage3 = false;
function addPostSou1(number) {
    $.ajax({
        type: "get",
        url: urlAll + "/realtimedevicenum?page=" + number,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (data) {
            console.log('拉取数据', data)
            addSInfo(data)
            if (number == 0) {
                if (numBage3) {
                    $('#pag2').html('')
                    pag2.init({
                        target: $('#pag2'), pagesize: 10, count: data[0].number, current: 1, callback: function (pagecount, size, count) {

                            addPostSou1(pagecount - 1)
                        }
                    })
                } else {
                    numBage3 = true
                    $('#pag2').html('')
                    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {

                        pag2 = new Paging()
                        pag2.init({
                            target: $('#pag2'), pagesize: 10, count: data[0].number, current: 1, callback: function (pagecount, size, count) {

                                addPostSou1(pagecount - 1)
                            }
                        })
                    })
                }

            }
            // var setTotalCount = 1000;
            // var totalYe = Math.ceil(data[0].number / 10)
            ///console.log(totalYe+"22233311")
            // $('#box1').paging({
            //     initPageNo: 1, // 初始页码
            //     totalPages: totalYe, //总页数
            //     // totalCount: '合计' + setTotalCount + '条数据', // 条目总数
            //     slideSpeed: 600, // 缓动速度。单位毫秒
            //     jump: true, //是否支持跳转
            //     callback: function (page) { // 回调函数
            //         // console.log(page);
            //         if (page == 0) {
            //             // var page =parseInt(page-1)
            //             addPostSou1(page)
            //         } else {
            //             var page = parseInt(page - 1)
            //             addPostSou1(page)
            //         }

            //         if (numBage3) {
            //             var page = parseInt(page - 1)
            //             addPostSou1(page)
            //         } else {
            //             numBage3 = true
            //         }
            //     }
            // })

        },
        error: function () {
            console.log('error')
        }
    })
}

var addWE = false
function addPostSou2(number) {

    $.ajax({
        type: "get",
        url: urlAll + "/devicealarmquery?page=" + number,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (data) {
            // console.log('拉取数据', data)
            // var obj = data[0];
            addPInfo1(data)
            var setTotalCount = 1000;
            var totalYe = Math.ceil(data[0].number / 10)
            ///console.log(totalYe+"22233311")
            $('#box3').paging({
                initPageNo: 1, // 初始页码
                totalPages: totalYe, //总页数
                // totalCount: '合计' + setTotalCount + '条数据', // 条目总数
                slideSpeed: 600, // 缓动速度。单位毫秒
                jump: true, //是否支持跳转
                callback: function (page) { // 回调函数
                    // console.log(page);


                    if (addWE) {
                        var page = parseInt(page - 1)
                        addPostSou2(page)
                    } else
                        addWE = true
                }
            })

        },
        error: function () {
            console.log('error')
        }
    })
}

// 人员搜索列表面板
function addPInfo(data) {
    $('#perInfo').html('')
    //console.log(data+'6666666oopp')
    data.forEach(function (obj, i) {
        var typeName = ""
        if (obj.column == "1") {
            typeName = "狱警"
        }
        if (obj.column == "2") {
            typeName = "犯人"
        }
        if (obj.column == "3") {
            typeName = "外来人员"
        }
        //console.log(i+"2222")
        const peopleNumber = i + 1;
        var info = `<li id="` + obj.chest_card_id + `">
                    <span style="width:25%">`+ obj.chest_card_id + `</span>
                    <span style="width:25%">`+ obj.name + `</span>
                    <span style="width:25%">`+ typeName + `</span>
                    <span style="width:25%"><a onclick="jumpToP(this)" id="`+ obj.chest_card_id + `" style="marign-right:10px">定位</a>&nbsp;&nbsp;&nbsp;&nbsp;<a style="marign-right:10px" class="guiJIPeople" onclick="locus(this)"  name="` + obj.name + `" id="` + obj.chest_card_id + `" >轨迹</a></span>
                </li>`
        $('#perInfo').append($(info))
    })
    // $('#perInfo li').click(function () {
    //     //var id = $(this).attr('id')
    //    // app.level.change(app.query('[id=' + id + ']')[0])
    // })

}

function addPInfoSo(data) {
    $('#perInfo').html('')
    //console.log(data)
    data.forEach(function (obj, i) {
        var typeName = ""
        if (obj.ptype == "1") {
            typeName = "狱警"
        }
        if (obj.ptype == "2") {
            typeName = "犯人"
        }
        if (obj.ptype == "3") {
            typeName = "外来人员"
        }
        //console.log(i+"2222")
        const peopleNumber = i + 1;
        var info = `<li id="` + obj.device_id + `">
                    <span style="width:25%">`+ obj.device_id + `</span>
                    <span style="width:25%">`+ obj.username + `</span>
                    <span style="width:25%">`+ typeName + `</span>
                    <span style="width:25%"><a onclick="jumpToP(this)" id="`+ obj.device_id + `" style="marign-right:10px">定位</a>&nbsp;&nbsp;&nbsp;&nbsp;<a style="marign-right:10px" class="guiJIPeople" onclick="locus(this)"  name="` + obj.username + `" id="` + obj.device_id + `" >轨迹</a></span>
                </li>`
        $('#perInfo').append($(info))

    })

}

function addSInfo(data) {
    $('#sbInfo').html('')
    data.forEach(function (obj, i) {
        var type = null;
        // console.log(obj.name.substring(0, 1))
        if (obj.name.substr(0, 1) === 'S') {
            type = '摄像头'
        } else if (obj.name.substr(0, 1) === 'M') {
            type = '门禁'
        } else if (obj.name.substr(0, 1) === 'C') {
            type = '车禁'
        } else if (obj.name.substr(0, 1) === 'J') {
            type = '基站'
        } else if (obj.name.substr(0, 1) === 'L') {
            type = '车辆'
        } else if (obj.name.substr(0, 1) === 'X') {
            type = '胸牌'
        } else if (obj.name.substr(0, 1) === 'H') {
            type = '手环'
        } else if (obj.name.substr(0, 1) === 'Z') {
            type = '周界'
        } else {
            type = '未知'
        }
        var stateType = "";
        if (obj.state == '0') {
            stateType = "掉线"
        } else if (obj.state == '1') {
            stateType = "正常"
        } else if (obj.state == '2') {
            stateType = "良好"
        } else {
            stateType = "无"
        }

        var info = `<li  id="` + obj.name + `" onclick="jumpTo(this)">
                    <span style="width:25%">`+ obj.name + `</span>
                    <span style="width:25%">`+ type + `</span>
                    <span style="width:25%">`+ stateType + `</span>
                    <span style="width:25%" >详情</span>
                </li>`
        $('#sbInfo').append($(info))

    })
    // $('#sbInfo li').click(function () {
    //     var id = $(this).attr('id')
    //     app.level.change(app.query('[id=' + id + ']')[0])
    // })
}



function addPInfo1(data) {
    $('#perInfo1').html('')
    //console.log(data+"555555")
    data.forEach(function (obj, i) {
        var type = ""
        if (obj.device_id.substr(0, 1) === 'S') {
            type = '摄像头'
        } else if (obj.device_id.substr(0, 1) === 'M') {
            type = '门禁'
        } else if (obj.device_id.substr(0, 1) === 'C') {
            type = '车禁'
        } else if (obj.device_id.substr(0, 1) === 'J') {
            type = '基站'
        } else if (obj.device_id.substr(0, 1) === 'L') {
            type = '车辆'
        } else if (obj.device_id.substr(0, 1) === 'X') {
            type = '胸牌'
        } else if (obj.device_id.substr(0, 1) === 'H') {
            type = '手环'
        } else if (obj.device_id.substr(0, 1) === 'Z') {
            type = '周界'
        } else {
            type = '未知'
        }
        var time = getLocalTime(obj.time)
        var obiZB = obj.alarm_x + "," + obj.alarm_y + "," + obj.alarm_z;
        //console.log(i+"2222")
        const peopleNumber = i + 1;
        const bianHao = type + "-" + obj.device_id
        var info = `<li id="` + obj.device_id + `">
                    <span style="width:20%">`+ bianHao + `</span>
                    <span style="width:15%">`+ obiZB + `</span>
                    <span style="width:40%">`+ time + `</span>
                    <span style="width:25%"><a class="xiangQin"  name="` + obj.name + `" id="` + obj.chest_card_id + `" >详情</a></span>
                </li>`
        $('#perInfo1').append($(info))

    })
    // $('#perInfo li').click(function () {
    //     //var id = $(this).attr('id')
    //    // app.level.change(app.query('[id=' + id + ']')[0])
    // })
    $(".xiangQin").on("click", function () {

    })
}


//电子围栏搜
function addPostSouDian(number, name) {

    //var name = $('#perName1').val()
    var date = JSON.stringify([{ "name": name }])
    $.ajax({
        'url': urlAll + "/fence_data/list?page=0", //Ajax请求服务的地址
        'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
        'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
        //发送到服务器的数据
        'contentType': "application/json; charset=utf-8",
        'data': date,
        //请求成功后的回调函数
        'success': function (data) {
            //console.log(data)
            addPInfo2(data)
            var totalYe = Math.ceil(data[0].number / 10)

            $('#box4').paging({
                initPageNo: 1, // 初始页码
                totalPages: totalYe, //总页数
                // totalCount: '合计' + setTotalCount + '条数据', // 条目总数
                slideSpeed: 600, // 缓动速度。单位毫秒
                jump: true, //是否支持跳转
                callback: function (page) { // 回调函数
                    // console.log(page);
                    var page = parseInt(page - 1)
                    addPostSouDian(date, name)
                }
            })




            //$("#box").css("display","none")
            // 处理返回的数据
        },
        //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
        'error': function (xhr, status, error) {
            console.log(xhr);
        }

    })


}

//电子围栏
function addPInfo2(data) {
    $('#perInfo2').html('')
    //console.log(data+"555555")
    data.forEach(function (obj, i) {


        var obiZB = obj.termination_coordinates_x + "," + obj.termination_coordinates_y + "," + obj.termination_coordinates_z;
        //console.log(i+"2222")
        const tim1 = getLocalTime(obj.creation_time);
        const tim2 = getLocalTime(obj.end_time);


        var info = `<li id="` + obj.name + `">
                   
                    <span style="width:25%">`+ obiZB + `</span>
                    <span style="width:40%">`+ tim1 + `</span>
                    <span style="width:35%">${tim2}</span>
                </li>`
        $('#perInfo2').append($(info))

    })
    // $('#perInfo li').click(function () {
    //     //var id = $(this).attr('id')
    //    // app.level.change(app.query('[id=' + id + ']')[0])
    // })
    $(".xiangQin").on("click", function () {

    })
}









function addComHTML() {
    var comHTML = `<div class="searchThing" id="comSearch">
        <div class="Search SB_title">
            <span>按编号搜索</span>
            <input type="text" id="comName">
            <span><button class="SB_btn" id="comBtn">搜索</button></span>
            <span class="close_btn">X</span>
        </div>
        <div class="SB_main">
            <ul class="info_title">
                <li>编号</li>
                <li>名称</li>
                <li>操作</li>
            </ul>
            <ul class="SB_info" id="comInfo">

            </ul>
        </div>
    </div>`
    $('body').append($(comHTML))
    $('#comBtn').click(function () {
        var comname = $('#comName').val()
        addComDate(app.query(/People/).query(eval('/' + comname + '/')))
    })
    $('#comSearch').hide()
    $('.close_btn').click(function () {
        console.log('关闭')
        $(this).parent().parent().hide()
    })
}

function addComDate(data) {
    $('#comInfo').html('')
    data.forEach(function (obj) {
        var cD = `<li>
                    <span>`+ obj.name + `</span>
                    <span>`+ obj.userData.username + `</span>
                    <span>
                        <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/语音.png' alt="">
                        <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/视频.png' alt="">
                    </span>
                </li>`
        $('#comInfo').append($(cD))
    })
}


function addVoiceCalls() {
    var vc1 = `<div class="searchThing" id="vc1">
        <div style="width: 100%;height: 40px;position: relative;"><span class="close_btn">X</span></div>
        <div class="SB_main">
            <ul class="info_title">
                <li>编号</li>
                <li>名称</li>
                <li>操作</li>
            </ul>
            <ul class="SB_info" id="vcInfo1">

            </ul>
        </div>
    </div>`
    $('body').append(vc1)
    $('#vc1').hide()
    $('.close_btn').click(function () {
        console.log('关闭')
        $(this).parent().parent().hide()
    })
}

function addVcData1() {
    app.query(/People/).forEach(function (obj) {
        var vd1 = `<li>
                    <span>`+ obj.name + `</span>
                    <span>`+ obj.userData.username + `</span>
                    <span>
                        <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/语音.png' alt="">
                    </span>
                </li>`
        $('#vcInfo1').append($(vd1))
    })
}


function addVideoCalls() {
    var vc1 = `<div class="searchThing" id="vc2">
    <div style="width: 100%;height: 40px;position: relative;"><span class="close_btn">X</span></div>
        <div class="SB_main">
            <ul class="info_title">
                <li>编号</li>
                <li>名称</li>
                <li>操作</li>
            </ul>
            <ul class="SB_info" id="vcInfo2">

            </ul>
        </div>
    </div>`
    $('body').append(vc1)
    $('#vc2').hide()
    $('.close_btn').click(function () {
        console.log('关闭')
        $(this).parent().parent().hide()
    })
}

function addVcData2() {
    app.query(/People/).forEach(function (obj) {
        var vd2 = `<li>
                    <span>`+ obj.name + `</span>
                    <span>`+ obj.userData.username + `</span>
                    <span>
                        <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/img/视频.png' alt="">
                    </span>
                </li>`
        $('#vcInfo2').append($(vd2))
    })
}

// 跟随组条件搜索
function followWhere(pag, data) {
    console.log('搜索中！')
    $.ajax({
        'url': urlAll + "/conditionfindfollow?page=" + pag, //Ajax请求服务的地址
        'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
        'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
        jsonpCallback: "callback",
        //发送到服务器的数据
        'contentType': "application/json; charset=utf-8",
        'data': data,
        //请求成功后的回调函数
        'success': function (d) {
            addSearData(d)
            if (pag == 0) {
                follWanrBool = false
                $('#pag13').html('')
                pag13.init({
                    target: $('#pag13'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {
                        followWhere(pagecount - 1, data)
                    }
                })
            }

        },
        //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
        'error': function (xhr, status, error) {
            console.log(xhr);
        }
    });
}


function addWHTML() {
    // 跟随组搜索页面
    var followSearch = `<div style="width:800px;height:550px" class="searchThing" id="followAlarm">
        <div class="Search SB_title" style="width: 100%;height: 40px;position: relative;">
            <span>按跟随组编号搜索</span>
            <input type="text" id="followVal">
            <span><button class="SB_btn" id="followBtn">搜索</button></span>
            <span class="close_btn">X</span>
        </div>
        <ul class="groupTitle">
            <li>名称</li>
            <li>组长</li>
            <li>起点</li>
            <li>终点</li>
            <li>状态</li>
        </ul>
        <ul class="groupMain">
            
        </ul>
        <div id="pag13"></div>
    </div>`
    $('body').append(followSearch)
    $('#followAlarm').hide()

    // 点击按钮搜索跟随组
    $('#followBtn').click(function () {
        var foll_name = $('#followVal').val()
        console.log()
        var data = JSON.stringify([{ name: foll_name }])
        followWhere(0, data)
    })
    // 边界告警页面
    var borderAlarm = `<div style="width:800px;height:550px" class="searchThing" id="borderAlarm">
            <div class="Search SB_title">
                <span class="close_btn">X</span>
            </div>
            <div class="SB_main">
                <ul class="alarm_title">
                    <li>告警设备</li>
                    <li>告警人员</li>
                    <li>告警类型</li>
                    <li>告警程度</li>
                    <li>告警时间</li>
                </ul>
                <ul class="alarm_main">
                    
                </ul>
                <div id="pag11"></div>
        
            </div>
        </div>`
    $('body').append(borderAlarm)
    $('#borderAlarm').hide()

    // 硬件告警页面
    var hardwareAlarm = `<div style="width:800px;height:550px" class="searchThing" id="hardwareAlarm">
            <div class="Search SB_title">
                <span class="close_btn">X</span>
            </div>
            <div class="SB_main">
                <ul class="alarm_title">
                    <li>告警设备</li>
                    <li>告警人员</li>
                    <li>告警类型</li>
                    <li>告警程度</li>
                    <li>告警时间</li>
                </ul>
                <ul class="alarm_main">
                    
                </ul>
                <div id="pag10"></div>
        
            </div>
        </div>`
    $('body').append(hardwareAlarm)
    $('#hardwareAlarm').hide()

    // 主动触发告警页面
    var activeAlarm = `<div style="width:800px;height:550px" class="searchThing" id="activeAlarm">
            <div class="Search SB_title">
                <span class="close_btn">X</span>
            </div>
            <div class="SB_main">
                <ul class="alarm_title">
                    <li>告警设备</li>
                    <li>告警人员</li>
                    <li>告警类型</li>
                    <li>告警程度</li>
                    <li>告警时间</li>
                </ul>
                <ul class="alarm_main">
                    
                </ul>
                <div id="pag12"></div>
        
            </div>
        </div>`
    $('body').append(activeAlarm)
    $('#activeAlarm').hide()

    // 跟随组当前告警
    var followNow = `<div class="searchThing alarm" id="followNow">
    <div style="width: 100%;height: 40px;position: relative;"><span class="close_btn">X</span></div>
        <div class="SB_main">
            <ul class="alarm_title">
                <li>告警设备</li>
                <li>告警人员</li>
                <li>告警类型</li>
                <li>告警程度</li>
                <li>告警时间</li>
            </ul>
            <ul class="alarm_main">
                
            </ul>
            <div id="pag8"></div>
            
        </div>
    </div>`
    $('body').append(followNow)
    $('#followNow').hide()

    // 跟随组历史告警
    var followOld = `<div class="searchThing alarm" id="followOld">
    <div style="width: 100%;height: 40px;position: relative;"><span class="close_btn">X</span></div>
        <div class="SB_main">
            <ul class="alarm_title">
                <li>告警设备</li>
                <li>告警人员</li>
                <li>告警类型</li>
                <li>告警程度</li>
                <li>告警时间</li>
            </ul>
            <ul class="alarm_main">
                
            </ul>
            <div id="pag9"></div>
            
        </div>
    </div>`
    $('body').append(followOld)
    $('#followOld').hide()

    // 设备报警页面
    var sebeiWaringHtml = `<div style="width:800px;height:550px" class="searchThing" id="sebeiAlarm">
        <div class="Search SB_title" style="width: 100%;height: 40px;position: relative;">
            <span>按设备编号搜索</span>
            <input type="text" id="sbalarmName">
            <span><button class="SB_btn" id="sbalarmBtn">搜索</button></span>
            <span class="close_btn">X</span>
        </div>
        <ul class="sbTitle">
            <li>报警设备</li>
            <li>报警名称</li>
            <li>报警坐标</li>
            <li>报警时间</li>
        </ul>
        <ul class="sbMain">
        </ul>
        <div id="pag14"></div>
    </div>`
    $('body').append(sebeiWaringHtml)
    $('#sebeiAlarm').hide()

    $('#sbalarmBtn').click(function () {
        var name = $('#sbalarmName').val()
        var date = JSON.stringify([{ "name": name }])
        $.ajax({
            'url': urlAll + "/realtimedeviceinfoquery?page=0", //Ajax请求服务的地址
            'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
            'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
            //发送到服务器的数据
            'contentType': "application/json; charset=utf-8",
            'data': date,
            //请求成功后的回调函数
            'success': function (data) {
                $('#pag14').hide()
                addSebeiWaring(data)
            },
            //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
            'error': function (xhr, status, error) {
                console.log(xhr);
            }
        });
    })
    $('.close_btn').click(function () {
        console.log('关闭')
        $(this).parent().parent().hide()
    })
}


// 人员隐藏
function personHide() {
    $('#perSearch').hide()

    // 人员搜索页面hide
    personAllList.forEach(function (obj) {
        obj.showUI(false)
        if (obj.ui) {
            obj.showPanel()
        }
    }) // 隐藏人员图标
    crew_i = perS1_i = perS2_i = perS3_i = false
}


// 设备隐藏

function sbHide() {
    $('#sbSearh').hide()
    sbAllList.forEach(function (obj) {
        obj.showUI(false)
        if (obj.ui) {
            obj.showPanel()
        }
    })
    videoList.forEach(function (obj) {
        obj.showUI(false)
        if (obj.ui) {
            obj.ui.destroy()
            obj.ui = null
        }
        if (obj.videoFrame) {
            obj.videoFrame()
        }

    })
    $('#sebeiAlarm').hide()
    eq_i = yj_i = cj_i = mj_i = jz_i = sxt_i = false

}



// 告警隐藏
function alarmHide() {
    $('#activeAlarm').hide()
    $("#hardwareAlarm").hide()
    $('#borderAlarm').hide()
    $("#perSearch1").hide()
    crew_i1 = cw_i = hw_i = false
    clearInterval(otherTime)
    lastFenceAlarm = new Set()
    app.query(/other/).destroy()
}

// 指挥隐藏
function commandHide() {
    $('#comSearch').hide()
    $('#vc1').hide()
    $('#vc2').hide()
    com_i = vc_i = vdc_i = false

}

// 电子围栏隐藏
function fenceHide() {

    $('#fenOld').hide()
    $('#fenNow').hide()
    $("#fenS").hide()
    crew_i2 = fc_i = fhc_i = false
    clearInterval(fenceTime)
    lastFenceAlarm = new Set()
    app.query(/fence/).destroy()
}

// 跟随组隐藏
function follGroupHide() {
    $('#followAlarm').hide()
    $('#followNow').hide()
    $('#followOld').hide()
    clearInterval(followTime)
    lastFenceAlarm = new Set()
    app.query(/follow/).destroy()
}


// 点击弹出信息框
function clickShowUI() {
    var allThing = app.query(/SXT/).add(app.query(/MJ/)).add(app.query(/CJ/)).add(app.query(/YJ/)).add(app.query(/People/)).add(app.query(/JZ/))
    allThing.on('SingleClick', function (ev) {
        console.log('点击成功')
        allThing.style.outlineColor = null
        var object = ev.object;
        show_ui(object)

    })
}

// 弹出信息框
function show_ui(object) {
    if (gold_thing) gold_thing.obj.style.outlineColor = null
    if (gold_thing && gold_thing.ui) {
        gold_thing.ui.destroy()
        gold_thing = null

    }
    object.style.outlineColor = '#DC143C'
    console.log(object.name.substring(0, 1))
    if (object.name.substring(0, 1) === 'P') {
        gold_thing = new Person(object)
        gold_thing.showPanel()
        console.log('人员')
    } else if (object.name.substring(0, 1) === 'M') {
        gold_thing = new MJ(object)
        gold_thing.showPanel()
    } else if (object.name.substring(0, 1) === 'C') {
        gold_thing = new CJ(object)
        gold_thing.showPanel()
    } else if (object.name.substring(0, 1) === 'Y') {
        gold_thing = new YJ(object)
        gold_thing.showPanel()
    } else if (object.name.substring(0, 1) === 'J') {
        gold_thing = new JZ(object)
        gold_thing.showPanel()
    } else if (object.name.substring(0, 1) === 'S') {
        gold_thing = new VideoCamera(object)
        gold_thing.showPanel()
    }
}

// 初始化楼层数据

function addFloorInfo() {
    app.query('.Building').forEach(function (build) {
        var floors = build.floors
        for (let i = 0; i < floors.length; i++) {
            if (i < 6) {
                floors[i].floorNum = '第' + (i + 1) + '层'
            } else {
                floors[i].floorNum = '楼顶'
            }

        }
    })
}

// 点击建筑房间弹出信息框
var buildThing = null;

function showBuildUI() {
    app.on('SingleClick', '.Building', function (ev) {
        var object = ev.object
        if (buildThing) {
            buildThing.showUI(false)
            buildThing = null
        }
        buildThing = new Build(object)
        buildThing.showUI(true)
    })
    app.on('SingleClick', '.Floor', function (ev) {
        var object = ev.object
        if (buildThing) {
            buildThing.showUI(false)
            buildThing = null
        }
        buildThing = new Floor(object)
        buildThing.showUI(true)
    })
    app.on('SingleClick', '.Room', function (ev) {
        var object = ev.object
        if (buildThing) {
            buildThing.showUI(false)
            buildThing = null
        }
        buildThing = new Room(object)
        buildThing.showUI(true)
    })

}
var numbee = 0, neiRon = "";
// 初始化
var setTime; var brnum, sbinfo
function init() {
    brnum = setInterval(changeBRnum, 5000)
    sbinfo = setInterval(get_sb_ALL_info, 10000)
    getRedisData()
    get_sb_ALL_info()
    clickEvent()
    setTime = setInterval(function () {
        cahgneBuildNum()
        personType()
        getRedisData()

    }, 1000)
    domeMAJAXPost()
    addBuidInfo()
    intoBuild()
    gotoBuild()
    addVideoInfo()
    addPersonimg()
    addSBImg()
    // addDate()addDate()
    addPloice()
    // addPloice1()
    addSBData()
    addVcData1()
    addVcData2()
    addFloorInfo()
    showBuildUI()


    ckickAction()
    app.camera.yAngleLimited = [0, 60]; // 设置视角上翻角度
}


function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

// 获取两个数组的不同元素 （在A数组中不在B数组中）
// 使用方法  A-B = A.filter(function(e) { return search(B,e) < 0; });
function search(arr, dst) {
    for (var i = 0; i < arr.length; i++) {
        // console.log('判断', arr[i], dst)
        if (arr[i] == dst) {
            return 1;
        }
    }
    return -1;
}



// 判断需要更改的人员
function changePLi(pIDList, dic1, dic2) {
    pIDList.forEach(function (pID) {
        if (dic1[pID].building != dic2[pID].building || dic1[pID].room != dic2[pID].room) {
            $('#main_a #' + pID).remove()
            console.log('删除', $('#main_a #' + pID))
            var building = dic2[pID].building
            var room = dic2[pID].room
            var ul;
            // console.log(building, room)
            // 添加动态新建人员标签
            if (building == ''){
                ul = $('#main_a #空地').next()
            }else {
                ul = $('#main_a #' + building).next().find('#' + room).next()
            }
            
            // console.log(ul)
            ul.append($(`<li id=` + dic2[pID].device_id + `>` + dic2[pID].username + `</li>`))
        }
    })
    lastPList = thisPList
    lastPDic = thisPDic
}

// 获取两个数组相同的元素
function getArrEqual(arr1, arr2, dic1, dic2) {
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
            if (arr1[j] === arr2[i]) {
                newArr.push(arr1[j]);
            }
        }
    }
    changePLi(newArr, dic1, dic2)
}


// 获取删除与判断改变的人员
var lastPDic = {}, thisPDic = {}
var lastPList = [], thisPList = [];
function getChangePeople(data) {
    thisPList = []
    thisPDic = {}
    data.forEach(function (d) {
        thisPDic[d.device_id] = d
        thisPList.push(d.device_id)
    })
    if (thisPDic.toString != lastPDic.toString) {
        console.log('改变')
    }
    if (lastPList.length != 0) {
        // 获取删除的人员
        // 使用方法  A-B = A.filter(function(e) { return search(B,e) < 0; });
        var delPList = lastPList.filter(function (e) { return search(thisPList, e) < 0 })
        destroyObject(delPList)
        // 获取判断改变的人员
        getArrEqual(lastPList, thisPList, lastPDic, thisPDic)
    } else {
        lastPList = thisPList
        lastPDic = thisPDic
    }

}


//获取Redis数据
var lastPeopleList = [];
function getRedisData() {
    $.ajax({
        type: "get",
        url: urlAll + "/get/device_data",
        dataType: "json",
        jsonpCallback: "callback",
        success: function (data) {
            console.log('人员数据', data)
            var newPeopleList = []
            if (data != 'error') {
                getChangePeople(data)
                createRedisData(data)
                peoplE = false
                // console.log('人员', data.length)
                var daNum = parseInt(data.length)
                $("#peoNum").html(data.length)
            }
        },
        error: function () {
            console.log('error')
        }
    })
}

// 跳转人员
function jumpToP(obj) {
    var id = obj.id
    var pObj = app.query('[id=' + id + ']')[0]
    console.log(pObj)
    if (pObj) {
        console.log(1)
        if (pObj.build) {
            console.log(2)
            var build = pObj.build
            var room = pObj.room
            var parent1 = app.query('[id=' + build + ']')[0].query('[id=' + room + ']')[0]
            console.log(3)
            app.level.change(parent1)
            //  层级切换飞行结束
            app.on(THING.EventType.LevelFlyEnd, parent1, function (ev) {
                // console.log('飞行结束，开始定位')
                app.camera.position = pObj.selfToWorld([0, 0, 5]);
                app.camera.target = pObj.position
                clickDic[id].marker.visible = true
                app.off(THING.EventType.LevelFlyEnd)
            }, '层级切换飞行结束');
        } else {
            app.camera.position = pObj.selfToWorld([0, 0, 5]);
            app.camera.target = pObj.position
        }
    } else {
        alert('查询实时数据无此人！！！')
    }

}


var person_object = []; var prisoner_object = []; var outsider_object = [];
var policeDic = prisonerDic = outsiderDic = {}
var followGroupDic = {}
function createRedisData(data) {
    data.forEach(function (d) {
        if (app.query('[id=' + d.device_id + ']').query('[name=' + d.username + ']')[0]) {
            app.query('[id=' + d.device_id + ']').query('[name=' + d.username + ']')[0].moveTo({
                position: [d.x + d.ref_x, d.z + d.ref_z, d.y + d.ref_y],
                orientToPath: true,
                orientToPathDegree: 0,
                time: 1000,
                complete: function () {
                    // console.log("moveto completed");
                }
            });
            if (d.ptype === 1) {
                var obj = app.query('[id=' + d.device_id + ']').query('[name=' + d.username + ']')[0]
                if (followGroupDic[d.device_id]) {
                    $.ajax({
                        type: "post",
                        url: urlAll + "/getfollowgroup",
                        dataType: "json",
                        jsonpCallback: "callback",
                        contentType: 'application/json',
                        data: JSON.stringify([{ device_id: d.device_id }]),
                        success: function (res) {
                            // console.log(res)
                            if (!res) {
                                app.query('gop' + obj.id).destroy()
                                delete (followGroupDic[d.device_id])
                            }
                        },
                        error: function () {
                            console.log('error1212')
                            return false
                        }
                    })

                } else {
                    $.ajax({
                        type: "post",
                        url: urlAll + "/getfollowgroup",
                        dataType: "json",
                        jsonpCallback: "callback",
                        contentType: 'application/json',
                        data: JSON.stringify([{ device_id: d.device_id }]),
                        success: function (res) {
                            if (res) {
                                followGroupDic[d.device_id] = new FollowGroup(obj)
                            }
                        },
                        error: function () {
                            console.log('error1212')
                            return false
                        }
                    })
                }
            }

        } else {
            var building = d.building
            var room = d.room
            var type = d.ptype
            var li = `<li id=` + d.device_id + ` onclick="jumpToP(this)">` + d.username + `</li>`
            if (d.building == '') {
                var ul = $('#main_a #空地').next()
                ul.append(li)
            } else {
                // console.log(building, room)

                // 添加动态新建人员标签
                var ul = $('#main_a #' + building).next().find('#' + room).next()
                ul.append(li)
            }
            // console.log(ul)
            var ul1 = $('[type=' + type + ']').next()

            ul1.append(li)
            // 创建Thing
            // person：狱警 prisoner：犯人 outsider：外来人员
            if (d.ptype == 1) {
                var person = app.create({
                    type: 'Police',
                    name: d.username,
                    id: d.device_id,
                    url: model_json['person'],
                    //url: 'https://model.3dmomoda.com/models/954F58D2A3BD47149882482D5046ABF2/0/gltf/', 
                    // 模型地址
                    position: [d.x + d.ref_x, d.z + d.ref_z, d.y + d.ref_y],
                    // 位置
                    angle: 0,
                    deviceType: d.product,
                    // 旋转
                    complete: function () {
                        // console.log('thing created: ' + this.id);
                    }
                })
                // clickThings.push(person)
                person.build = d.building
                person.floor = d.floor
                person.room = d.room
                var obj = new Person(person)
                person_object.push(obj)
                clickDic[d.device_id] = obj
                console.log(clickDic, 'clickdic')
                person.on('click', function (ev) {

                    obj.showPanel()


                })

                followGroupLeader(person, d.device_id)
            } else if (d.ptype == 2) {
                var prisoner = app.create({
                    type: 'Prisoner',
                    name: d.username,
                    id: d.device_id,
                    url: model_json['prisoner'],
                    //url: 'https://model.3dmomoda.com/models/954F58D2A3BD47149882482D5046ABF2/0/gltf/', 
                    // 模型地址
                    position: [d.x + d.ref_x, d.z + d.ref_z, d.y + d.ref_y],
                    // 位置
                    angle: 0,
                    deviceType: d.product,
                    // 旋转
                    complete: function () {
                        // console.log('thing created: ' + this.id);
                    }
                });
                // clickThings.push(prisoner)
                prisoner.build = d.building
                prisoner.floor = d.floor
                prisoner.room = d.room
                var obj = new Prisoner(prisoner)
                prisoner_object.push(obj)
                prisonerDic[d.device_id] = obj
                clickDic[d.device_id] = obj
                prisoner.on('click', function (ev) {
                    obj.marker.visible = true

                })
            } else {
                var outsider = app.create({
                    type: 'Outsider',
                    name: d.username,
                    id: d.device_id,
                    url: model_json['prisoner'],
                    position: [d.x + d.ref_x, d.z + d.ref_z, d.y + d.ref_y],
                    // 位置
                    angle: 0,
                    deviceType: d.product,
                });
                outsider.build = d.building
                outsider.floor = d.floor
                outsider.room = d.room
                var obj = new Outsider(outsider)
                outsider_object.push(obj)
                outsiderDic[d.device_id] = obj
                // clickThings.push(outsider)
                clickDic[d.device_id] = obj
                outsiderDic.on('click', function (ev) {
                    if (obj.marker.visible) {
                        obj.marker.visible = false
                        if (this.ui) {
                            this.ui.destroy()
                            this.ui = null
                        }
                    } else {
                        obj.marker.visible = true
                    }

                })
            }
        }
    })
}





//跟随组物体顶界面
var uiPlioce = null;
function test_create_ui_people(obj, type) {
    const url = 'https://model.3dmomoda.com/models/F68A51D29E1C44C8A479563035A72B56/0/gltf/';
    if (type == 1) {
        url = 'https://model.3dmomoda.com/models/78B714AC96F64F0499C52905E04905AC/0/gltf/'

    }
    uiPlioce = app.create({
        type: 'Thing',
        name: '图标',
        parent: obj,
        url: url,
        //element: create_element(),
        localPosition: [0, 2, 0],
        pivot: [0.5, 1] //  [0,0]即以界面左上角定位，[1,1]即以界面右下角进行定位
    });
}

// // 获取围栏数据
// get_Fence_Data()
// function get_Fence_Data() {
//     //console.log('测试')
//     $.ajax({
//         url: urlAll + '/fence_data/list',
//         type: "get",
//         dataType: "json",
//         jsonpCallback: 'callback'
//     }).then(function (data) {
//         //成功的回调函数
//         // console.log('成功', data);
//     }, function (err) {
//         //错误的回调函数
//         console.log('失败', err);
//     });
// }

function domeMAJAX() {

    $.ajax({
        type: "get",
        url: "http://47.103.34.10:8080/search_data/prison_building",
        dataType: "json",
        jsonpCallback: "callback",
        success: function (data) {
            //console.log('围栏数据', data)
            addDate(data)
            // if (data) { create_Fences(data) }
        },
        error: function () {
            console.log('error')
        }
    })

}

// 定位电子围栏
function jumpToF(obj) {
    var fence_name = obj.id
    app.query(/Fence/).style.outlineColor = null
    app.query(fence_name).style.outlineColor = '#ffffff'
}

var fence_List_Last = [], fence_List_New = []
// var fence_List_Last = ?[];创建有效电子围栏
function create_Fences(data) {
    fence_List_New = []
    data.forEach(function (d) {
        fence_List_New.push(d.name)
        if (!(fence_List_Last.includes(d.name))) {
            var nameLi = `<li class="liOne" id="` + d.name + `" onclick="jumpToF(this)">` + d.name + `</li>`
            $('#main_e1').append(nameLi)
            var x1 = parseFloat(d.initial_coordinates_x), y1 = parseFloat(d.initial_coordinates_y), z = parseFloat(d.initial_coordinates_z);
            var x2 = parseFloat(d.termination_coordinates_x), y2 = parseFloat(d.termination_coordinates_y)
            var px_1 = [x1, z, y1 + (y2 - y1) / 2], px_2 = [x2, z, y1 + (y2 - y1) / 2], long_x = Math.abs(y1 - y2) / 1.5
            var py_1 = [x1 + (x2 - x1) / 2, z, y1], py_2 = [x1 + (x2 - x1) / 2, z, y2], long_y = Math.abs(x1 - x2) / 1.5
            var ls = [px_1, py_1, px_2, py_2]
            var zoom;
            for (var i = 0; i < 4; i++) {
                if (i % 2 == 0) {
                    zoom = [long_x, 1, 1]
                } else {
                    zoom = [long_y, 1, 1]
                }
                // 创建围栏
                var wei = app.create({
                    type: 'Thing',
                    name: d.name,
                    url: 'http://static.3dmomoda.com/models/131db7d9aa5447b1939815e5d2497a4e/0/gltf/',
                    // 模型地址
                    position: ls[i],
                    // 位置
                    angle: 90 * (i + 1),
                    scale: zoom,
                    // 旋转
                    complete: function () {
                        // console.log('thing created: ' + this.id);
                        //this.style.color = '#0000ff'
                        this.style.color = '#0000ff'
                        // this.style.outlineColor = 0xFF0000;
                        // fence_List_New.push(this)
                    }
                });

            }
        }


    })
    fence_List_Last.forEach(function (name1) {
        var nameBool = true
        for (let n = 0; n < fence_List_New.length; n++) {
            var name2 = fence_List_New[n]
            if (name1 == name2) {
                nameBool = false
                break
            }
        }
        if (nameBool) {
            $('#' + name1).remove()
            app.query(name1).destroy()
        }
    })
    fence_List_Last = fence_List_New


}


// 拖拽
// ---------------------------------------------------------------------------------------------------------------------------------------------------------
// 拖拽创建物体
THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/xl.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/xl.js'], function () {
    var panel =
        `<div class="list fcbox" id="drag-html">
    <ul class="yiji">
        <li>
            <span class="inactive">静态设备拖拽</span>
            <ul style="display: none">
                <li class="inactive active" name="2"  title="摄像头" id="camera" data-url="http://model.3dmomoda.com/models/EFAEAF64DF8146B7B495FF7AD731AA3A/0/gltf/">
                    <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/Caemer.png' alt="">
                </li>
                <li class="inactive active" name="1"  title="门禁" id="guard" data-url="http://model.3dmomoda.com/models/EFAEAF64DF8146B7B495FF7AD731AA3A/0/gltf/">
                    <img src='/uploads/wechat/bWVzb255Y2hpZA==/file/demo0328/grude.png' alt="">
                </li>
            </ul>
        </li>
    </ul>
</div>`
    $('#div3d').append(panel);
    $('#drag-html').hide()
});


var thing = null, line;
var drag_drop_list = [];
app.on('load', function () {
    // 按钮拖拽事件(dragIcon为教程页面提供的工具)
    dragIcon('camera', dragStart);
    dragIcon('guard', dragStart);
    //get time
    var dt = "2019-05-14 17:09:06";
    var newDt = new Date(dt.replace("-", "/"));
    // console.log(newDt)


});

function guiJiPeople(data, timeDa) {
    //console.log(data)
    line = app.create({
        type: 'Line',
        color: 0x00FF00, // 轨迹线颜色
        dotSize: 2, // 轨迹点的大小
        dotColor: 0xFF0000, // 轨迹点的颜色
        points: data,
    })
    play(data, timeDa)
}



// 物体跟随鼠标移动
app.on('mousemove', function (ev) {
    if (thing) {
        var worldPosition = app.picker.pickWorldPosition(ev.clientX, ev.clientY);
        if (!worldPosition) {
            worldPosition = app.camera.screenToWorld(ev.clientX, ev.clientY);
        }

        thing.position = worldPosition;
    }
});

// 鼠标右键点击取消所有控制轴
app.on('mousedown', function (ev) {
    if (ev.button == 2) {
        app.query('.Thing').forEach(function (object) {
            object.removeControl('axisControl');
        });
    }
});

// 鼠标抬起取消物体移动
app.on('mouseup', function (ev) {
    if (thing) {
        // console.log('aaaa')
        // 重新让物体开启拾取
        thing.pickable = true;

        // 点击物体可以开启/关闭控制轴
        thing.on('singleclick', function (ev) {
            var object = ev.object;
            if (ev.button === 0) {
                if (object.hasControl('axisControl')) {
                    object.removeControl('axisControl');
                }
                else {
                    app.camera.fit(object);
                    object.addControl(new THING.AxisTransformControl(object), 'axisControl');
                }

                app.query('.Thing').not(object).forEach(function (object) {
                    object.removeControl('axisControl');
                });
                app.camera.flyTo(object)
            } else if (ev.button === 2) {
                drag_drop_list.remove(object)
                object.visible = false
            }

        });

        // 出发点击事件来给物体添加控制轴
        thing.trigger('singleclick');

        thing = null;
    }

    // 开启摄像机转动
    app.camera.enableRotate = true;
})

// 创建物体并且开始拖动
var targ_pos;
function dragStart(name, url) {
    // console.log('摄像机看点', app.camera.target)
    if (app.camera.target[1] < 0.5) {
        targ_pos = [app.camera.target[0], 0.5, app.camera.target[2]]
    } else {
        targ_pos = app.camera.target
    }
    // console.log('拖拽舞台坐标', targ_pos)
    // 创建物体
    thing = app.create({
        type: 'Thing',
        name: name,
        url,
        position: targ_pos,
        complete: function () {
            this.scale = [10, 10, 10]
            // this.model_key = id
            app.camera.fit(this)

        }
    });
    drag_drop_list.push(thing)

    // 防止拖动过程中获取时间坐标的时候，对位置进行重复拾取
    thing.pickable = false;

    // 关闭摄像机转动
    app.camera.enableRotate = false;
}

// 关联拖动图标
function dragIcon(id, callback1) {
    // console.log(id)
    var dom = document.getElementById(id);
    var url = dom.getAttribute('data-url');
    var id = dom.getAttribute('id');
    var name = dom.getAttribute('name');
    dom.onmousedown = function (e) {
        callback1(name, url)

    }
}

function save_Drag_Data(data) {
    var drag_Data_list = []
    data.forEach(function (drag_thing) {
        var type = drag_thing.name
        var control_x = drag_thing.position[0]
        var control_y = drag_thing.position[2]
        var control_z = drag_thing.position[1]
        var drag_thing_dic = { control_x: control_x, control_y: control_y, control_z: control_z, type: type }
        drag_Data_list.push(drag_thing_dic)
    })
    $.ajax({
        type: "post",
        url: urlAll + "/drag",
        dataType: "json",
        contentType: 'application/json',
        jsonpCallback: "callback",
        data: JSON.stringify(drag_Data_list),
        success: function (d) {
            //console.log(d)
        },
        error: function (d) {
            console.log('error')

        }
    });
}


//电子围栏数据

function weiLangShuJu(data) {
    console.log('插入中')
    $.ajax({
        type: "post",
        url: urlAll + "/insert/fence",
        dataType: "json",
        contentType: 'application/json',
        jsonpCallback: "callback",
        data: JSON.stringify(data),
        success: function (d) {
            //console.log(d)
            console.log('插入围栏成功！！！！')
            $("#peopleWeiLan").hide();
            view_i = !view_i
            changeInto('view', view_i)

            app.camera.viewMode = THING.CameraView.Normal;  //3D视图
            app.pauseEvent('mousedown', null, '电子围栏框选创建开始')
            app.pauseEvent('mouseup', null, '电子围栏框选创建结束')
        },
        error: function (d) {
            console.log('error')

        }
    });
}





function disableBoxSelect() {
    // app.off(THING.EventType.Pick, '.Thing', '框选Pick');
    app.off('mousedown', null, '按下左键进行框选');
    app.off('mouseup', null, '抬起左键结束框选');
}

var qiShiZuoBiao = [];
var zuiHouZuoBiao = [];
var xuanZe = false
function box_choose() {


}





// 获取当前设备报警
var ui = null;
var sebeiwaringDict = {}
function gaoJingAll() {
    $.ajax({
        type: "get",
        url: urlAll + "/historytoday",
        dataType: "json",
        jsonpCallback: "callback",
        // contentType: 'application/json',
        // jsonpCallback: "callback",
        //data: JSON.stringify(data),
        success: function (d) {
            if (d) {
                // console.log('设告警数据', d)
                d.forEach(function (data) {
                    sebeiwaringDict[data.device_id] = new SebeiWaring(data)
                })
            }
        },
        error: function (d) {
            console.log('error')

        }
    });
}



function create_html_gaoj() {
    //console.log(name,time)

    var sign =
        `<div class="sign" id="board" style="font-size: 12px;width: 190px;text-align: center;background-color: rgba(0, 0, 0, .6);border: 3px solid #eeeeee;border-radius: 8px;color: #eee;position: absolute;top: 0;left: 0;z-index: 10;display: none;">
			<div class="s1" style="margin: 5px 0px 5px 0px;line-height: 32px;overflow: hidden;">
				<span class="span-l icon" style="float: left;width: 30px;height: 30px;background:url(https://www.thingjs.com/static/images/example/hydrant.png) no-repeat center;margin: 1px 1px 1px 5px;"></span>
				<span class="span-l font seBeiName" style="float: left;margin: 0px 0px 0px 3px;">编号：<a></a></span>
				<span class="span-r point" style="float: right;width: 12px;height: 12px;background-color: red;border-radius: 50%;margin: 10px 5px 10px 0px;"></span>
			</div>
			<div class="s2" style="margin: 5px 0px 10px 0px;line-height: 18px;font-size: 10px;overflow: hidden;">
				<span class="span-l font1" style="float: left;margin: 0px 10px 0px 10px;">时间：</span>
				<span class="span-l font2 seBeiTime" style="float: left;background-color: #2480E3;"></span>
			</div>
			<div class="point-top" style="position: absolute;top: -7px;right: -7px;background-color: #3F6781;width: 10px;height: 10px;border: 3px solid #eee;border-radius: 50%;"></div>
		</div>`
    $('#div3d').append($(sign));
}
//create_html();

// 生成一个新面板
function create_element22() {
    var srcElem = document.getElementById('board');
    var newElem = srcElem.cloneNode(true);
    newElem.style.display = "block";
    app.domElement.insertBefore(newElem, srcElem);
    return newElem;
}



function test_create_ui(that) {
    ui = app.create({
        type: 'UIAnchor',
        parent: that,
        element: create_element22(),
        localPosition: [0, 1, 0],
        pivot: [0.5, 1] //  [0,0]即以界面左上角定位，[1,1]即以界面右下角进行定位
    });
    $(".point-top").on("click", function () {
        ui.destroy();
    })
}

// 电子围栏创建事件
var start_p = null, end_p = null;
function fenceMouseup() {
    app.on('mousedown', function (ev) {
        if (ev.button == 0) {
            var pick_position = ev.pickedPosition
            console.log('选择起始点', pick_position)
            if (pick_position) {
                // console.log(i)
                console.log('开启')
                console.log('开始框选')
                app.camera.inputEnabled = false;
                app.picker.startAreaPicking({
                    x: ev.x,
                    y: ev.y
                });
                start_p = ev.pickedPosition

            } else {
                i = true
                alert('请选择正确区域设置电子围栏')
            }
        }
    }, '电子围栏框选创建开始');
    app.on('mouseup', function (ev) {
        if (start_p) {
            end_p = app.camera.screenToWorld([ev.x, ev.y]);
            //console.log(zuiHouZuoBiao)
            // timeData1()
            $('#peopleWeiLan').show()
            app.camera.inputEnabled = true;
            app.picker.endAreaPicking();
            // start_p = null;
        }
    }, '电子围栏框选创建结束')
    app.pauseEvent('mousedown', null, '电子围栏框选创建开始')
    app.pauseEvent('mouseup', null, '电子围栏框选创建结束')
}

function addSebeiLi(item) {
    var sb_name = item.name;
    var ju_str = sb_name.slice(0, 1)
    var li = `<h4 id="` + item.name + `" onclick="jumpTo(this)">` + item.name + `</h4>`
    if (ju_str == 'S') {
        $('#S_main').append($(li))
    } else if (ju_str == 'J') {
        $('#J_main').append($(li))
    } else if (ju_str == 'Y') {
        $('#Y_main').append($(li))
    } else if (ju_str == 'M') {
        $('#M_main').append($(li))
    } else if (ju_str == 'C') {
        $('#C_main').append($(li))
    } else if (ju_str == 'Z') {
        $('#Z_main').append($(li))
    }
}
// 
var thisSB = [], lastSB = [], sbDic = {}, sbDic2 = {}
function analysis_sb_ALL_info(data_info, boolValue) {
    data_info.forEach(function (data) {
        var sb_name = data.name;
        thisSB.push(sb_name)
        sbDic[sb_name] = data
        if (!app.query(sb_name)[0]) {
            var ju_str = sb_name.slice(0, 1)
            if (boolValue) { addSebeiLi(data) }
            if (ju_str == 'S') {
                data.modelURL = 'https://model.3dmomoda.com/models/2DBD1DCD7B5F49BDA43CC6444FC5CBD0/0/gltf/';
                create_thing(data, ju_str)
            } else if (ju_str == 'J') {
                data.modelURL = 'https://model.3dmomoda.com/models/20141127087265/0/gltf/';
                create_thing(data, ju_str)
            } else if (ju_str == 'Y') {
                data.modelURL = 'https://model.3dmomoda.com/models/24E91613E186448C9011ADC7C38F57F7/0/gltf/';
                create_thing(data, ju_str)
            } else if (ju_str == 'M') {
                data.modelURL = 'https://model.3dmomoda.com/models/A707E60307DA49A4BBD700B12471CE31/0/gltf/'
                create_thing(data, ju_str)
            } else if (ju_str == 'C') {
                data.modelURL = 'https://model.3dmomoda.com/models/9696F4101B0E478D9F51B62166CCEF20/0/gltf/';
                create_thing(data, ju_str)
            } else if (ju_str == 'Z') {
                data.modelURL = ''
                create_thing(data, ju_str)
            }
        }
    })
}
var ls1 = [], ls2 = [], dic = {}, dic2 = {}
// 增加/删除/移动设备标签
function handleSBLi(data) {
    ls1 = []
    data.forEach(function (d) {
        ls1.push(d.name)
        dic[d.name] = d
    })
    // 添加设备标签
    ls1.forEach(function (name1) {
        if (!(ls2.includes(name1))) {
            // console.log(name1)
            var li = `<li id="` + name1 + `" onclick="jumpTo(this)">` + name1 + `<li>`
            var build = dic[name1].building_control
            var room = dic[name1].room_control
            if (build) {
                var ul = $('#main_c [name=' + build + ']').next().find('[name=' + room + ']').next()
                ul.append(li)
            } else {
                $('#main_c #空地').next().append(li)
            }

        }
    })
    if (ls2.length > 0) {
        delMOveLi(ls1, ls2, dic, dic2)
    }

    ls2 = ls1
    dic2 = dic
}

// 删除与移动设备标签
function delMOveLi(ls1, ls2, dic, dic2) {

    ls2.forEach(function (name2) {
        if (!(ls1.includes(name2))) {
            $('#main_c').find('#' + name2).remove()
        } else {
            var build = dic[name2].building_control
            var room = dic[name2].room_control
            var build2 = dic2[name2].building_control
            var room2 = dic2[name2].room_control
            if (build != build2) {
                debugger
            }
            // console.log('判断移动', build, build2)
            if (build != build2 || room != room2) {
                console.log('移动')
                $('#main_c #' + name2).remove()
                var li = `<li id="` + name2 + `">` + name2 + `</li>`
                if (!build) {
                    $('#main_c #空地').next().append(li)
                } else {
                    var ul = $('#main_c [name=' + build + ']').next().find('[name=' + room + ']').next()
                    ul.append(li)
                    console.log(ul)
                    debugger
                }


            }
        }
    })


}

// 创建设备
function create_thing(data, ju_str) {
    // console.log('创建', data.name)
    // 创建Thing 
    var obj = app.create({
        type: 'Sebei',
        name: data.name,
        url: data.modelURL, // 模型地址 
        position: [data.control_x, data.control_z, data.control_y], // 世界坐标系下的位置
        complete: function (ev) {
            //物体创建成功以后执行函数
            // console.log('thing created: ' + ev.object.id); 
        }
    }).on('singleclick', function (ev) {
        var obj = clickDic[this.name]
        console.log(obj)
        obj.marker.visible = true
    })
    // clickThings.push(obj)
    switch (ju_str) {
        case "J":
            var jzInfo = new JZ(obj)
            jzList.push(jzInfo)
            clickDic[obj.id] = jzInfo
            break;
        case "M":
            var mjInfo = new MJ(obj)
            mjList.push(mjInfo)
            clickDic[obj.id] = mjInfo
            break;
        case "C":
            var cjInfo = new CJ(obj)
            cjList.push(cjInfo)
            clickDic[obj.id] = cjInfo
            break;
        case "Z":
            break;
        case "S":
            var video = new VideoCamera(obj)
            videoList.push(video)
            clickDic[obj.id] = video
            break;
        case "Y":
            var yjInfo = new YJ(obj)
            yjList.push(yjInfo)
            clickDic[obj.id] = yjInfo
            break;
    }
}

var sbCaozuo = {}; // 设备操作数据
var sbState = {}; // 设备状态数据
function getSbCaozuo(data) {
    data.forEach(function (d) {
        // var caozuo = d.operation_content
        // if (caozuo) {
        //     var ls = caozuo.split('/')
        //     sbCaozuo[d.name] = ls
        // } else {
        //     sbCaozuo[d.name] = []
        // }

        var state1 = d.state
        if (state1 == '0') {
            state1 = '掉线';
        } else if (state1 == '1') {
            state1 = '正常';
        } else {
            state1 = '良好';
        }
        sbState[d.name] = state1
    })
}

// 获取设备信息
var sb_ALL_info = [];
var sebeiBool = false;

function get_sb_ALL_info() {
    $.ajax({
        type: "get",
        url: urlAll + "/deviceto3d",
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            getSbCaozuo(d)
            if (d.toString() != sb_ALL_info.toString()) {
                sb_ALL_info = d;
                analysis_sb_ALL_info(d, sebeiBool)
                $('#sbNum').html(d.length)
                getSebeiNum()
                if (!sebeiBool) {
                    sebeiBool = true
                    d.forEach((item) => {
                        addSebeiLi(item)
                    })
                }
            }
            handleSBLi(d)
        },
        error: function () { }
    })
}


// 视角查询/视角同步函数
function sync_angle() {
    $.ajax({
        type: "post",
        url: urlAll + "/query/visual_angle",
        dataType: "json",
        jsonpCallback: "callback",
        contentType: 'application/json',
        data: JSON.stringify([{ create_person: user_id }]),
        success: function (d) {
            console.log('获取视角数据', d)
            add_sync_angle(d)
        },
        error: function () {
            console.log('error')
        }
    })
}


// 渲染视角数据
function add_sync_angle(data) {
    data.forEach(function (d) {
        view_dic[d.name] = {
            pos: [d.position_x, d.position_z, d.position_y],
            target: [d.target_x, d.target_z, d.target_y]
        }
        var option_angle = $('<option value=' + d.name + '>' + d.name + '</option>')
        $('#select').append(option_angle)
    })
}



// 显示所有告警的当前日期告警
function showAllWarning() {
    $.ajax({
        type: "get",
        url: urlAll + "/allalarm",
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            console.log(d)
            alarmRendering(d, '#w1 .alarm_main')
        },
        error: function () {
            console.log('error')
        }
    })
}

// 显示所有告警第一页
var wBool2 = false;
function showAllWarningPage(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/pageallalarm?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            // console.log('第' + pag + '页')
            alarmRendering(d, '#w2 .alarm_main')
            if (pag == 0) {
                if (wBool2) {
                    pag4.render({
                        count: d[0].number, current: 1
                    });
                } else {
                    wBool2 = true
                    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                        pag4 = new Paging()
                        pag4.init({
                            target: $('#pag4'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                showAllWarningPage(pagecount - 1)
                            }
                        })
                    })
                }

            }
        },
        error: function () {
            console.log('error')
        }
    })
}



// 显示围栏告警当前日期前十条
function showFenceWarning() {
    $.ajax({
        type: "get",
        url: urlAll + "/fencealarm?pag=0",
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            console.log(d)
            alarmRendering(d, '#fenNow .alarm_main')
        },
        error: function () {
            console.log('error')
        }
    })
}

// 显示围栏报警第一页
var fenOldBool = false
function showFenceWarningPage(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/pagefencealarm?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            console.log(d)
            alarmRendering(d, '#fenOld .alarm_main')
            if (pag == 0) {
                if (fenOldBool) {
                    pag6.render({
                        count: d[0].number, current: 1
                    });
                } else {
                    fenOldBool = true
                    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                        pag6 = new Paging()
                        pag6.init({
                            target: $('#pag6'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                showFenceWarningPage(pagecount - 1)
                            }
                        })
                    })
                }

            }

        },
        error: function () {
            console.log('error')
        }
    })
}

// 显示搜索围栏告警第一页
var fenSBool = false
function fenceSearchPage(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/pagefencealarm?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            alarmRendering(d, '#fenS .alarm_main')
            if (pag == 0) {
                if (fenSBool) {
                    pag5.render({
                        count: d[0].number, current: 1
                    });
                } else {
                    fenSBool = true
                    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                        pag5 = new Paging()
                        pag5.init({
                            target: $('#pag5'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                fenceSearchPage(pagecount - 1)
                            }
                        })
                    })
                }

            }

        },
        error: function () {
            console.log('error')
        }
    })
}

// 硬件告警
var hardBool = false
function hardWanring(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/abnormalalarmtoday?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            if (d.length > 0) {
                alarmRendering(d, '#hardwareAlarm .alarm_main')
                if (pag == 0) {
                    if (hardBool) {
                        pag10.render({
                            count: d[0].number, current: 1
                        });
                    } else {
                        hardBool = true
                        THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                            pag10 = new Paging()
                            pag10.init({
                                target: $('#pag10'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                    hardWanring(pagecount - 1)
                                }
                            })
                        })
                    }

                }
            } else {
                alert('无信息')
            }


        },
        error: function () {
            console.log('error')
        }
    })
}

// 边界告警
var borderBool = false
function bordWanring(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/boundalarmtoday?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            if (d.length > 0) {
                alarmRendering(d, '#borderAlarm .alarm_main')
                if (pag == 0) {
                    if (borderBool) {
                        pag11.render({
                            count: d[0].number, current: 1
                        });
                    } else {
                        borderBool = true
                        THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                            pag11 = new Paging()
                            pag11.init({
                                target: $('#pag11'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                    bordWanring(pagecount - 1)
                                }
                            })
                        })
                    }

                }
            } else {
                alert('无此信息！')
            }


        },
        error: function () {
            console.log('error')
        }
    })
}

// 主动触发告警
var activBool = false
function actiWanring(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/personalarmtoday?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            if (d.length > 0) {
                alarmRendering(d, '#activeAlarm .alarm_main')
                if (pag == 0) {
                    if (activBool) {
                        pag12.render({
                            count: d[0].number, current: 1
                        });
                    } else {
                        activBool = true
                        THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                            pag12 = new Paging()
                            pag12.init({
                                target: $('#pag12'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                    actiWanring(pagecount - 1)
                                }
                            })
                        })
                    }

                }

            } else {
                alert('无此信息！！')
            }

        },
        error: function () {
            console.log('error')
        }
    })
}

// 添加跟随组搜索页面的数据
function addSearData(data) {
    $('#followAlarm .groupMain').html('')
    data.forEach(function (d) {
        var li = `<li>
                <span title="`+ d.groupname + `">` + d.groupname + `</span>
                <span title="`+ d.device + `">` + d.device + `</span>
                <span title="`+ d.start_position + `">` + d.start_position + `</span>
                <span title="`+ d.end_position + `">` + d.end_position + `</span>
                <span title="`+ d.state + `">` + d.state + `</span>
            </li>`
        $('#followAlarm .groupMain').append(li)
    })
}

// 跟随组搜索
var follWanrBool = false
function follWanringSear(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/followgroupall?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            console.log(d)
            addSearData(d)
            if (pag == 0) {
                if (follWanrBool) {
                    pag13.render({
                        count: d[0].number, current: 1
                    });
                } else {
                    follWanrBool = true
                    $('#pag13').html('')
                    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                        pag13 = new Paging()
                        pag13.init({
                            target: $('#pag13'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {
                                follWanringSear(pagecount - 1)
                            }
                        })
                    })
                }

            }

        },
        error: function () {
            console.log('error')
        }
    })
}

// 跟随组当前告警
var follNewBool = false
function follWanringNew(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/followalarmtoday?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            console.log(d)
            alarmRendering(d, '#followNow .alarm_main')
            if (pag == 0) {
                if (follNewBool) {
                    if (d.length > 0) {
                        pag8.render({
                            count: d[0].number, current: 1
                        });
                        $('#pag8').show()
                    } else {
                        $('#pag8').hide()
                    }

                } else {

                    if (d.length > 0) {
                        follNewBool = true
                        THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                            pag8 = new Paging()
                            pag8.init({
                                target: $('#pag8'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                    follWanringNew(pagecount - 1)
                                }
                            })
                        })
                    }

                }

            }

        },
        error: function () {
            console.log('error')
        }
    })
}

// 跟随组历史告警
var follOldBool = false
function follWanringOld(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/followalarmhistory?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            console.log(d)
            alarmRendering(d, '#followOld .alarm_main')
            if (pag == 0) {
                if (follOldBool) {
                    pag9.render({
                        count: d[0].number, current: 1
                    });
                } else {
                    follOldBool = true
                    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                        pag9 = new Paging()
                        pag9.init({
                            target: $('#pag9'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                follWanringOld(pagecount - 1)
                            }
                        })
                    })
                }

            }

        },
        error: function () {
            console.log('error')
        }
    })
}

// 添加设备报警页面数据
function addSebeiWaring(data) {
    $('#sebeiAlarm .sbMain').html('')
    data.forEach(function (d) {
        var wPositon = '[' + d.alarm_x + ',' + d.alarm_z + ',' + d.alarm_y + ']'
        var thisDate = new Date(d.time * 1000).format("yyyy-MM-dd hh:mm:ss")
        var li = `<li>
                <span title="`+ d.device_id + `">` + d.device_id + `</span>
                <span title="`+ d.name + `">` + d.name + `</span>
                <span title="`+ wPositon + `">` + wPositon + `</span>
                <span title="`+ thisDate + `">` + thisDate + `</span>
            </li>`
        $('#sebeiAlarm .sbMain').append(li)
    })
}


// 获取分页设备报警
var sebeiWaringBool = false
function sebeiWaringPage(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/realtimedeviceinfoquery?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            console.log(d)
            addSebeiWaring(d)
            if (pag == 0) {
                if (sebeiWaringBool) {
                    $('#pag14').show()
                    pag14.render({
                        count: d[0].number, current: 1
                    });
                } else {
                    sebeiWaringBool = true
                    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                        pag14 = new Paging()
                        pag14.init({
                            target: $('#pag14'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                sebeiWaringPage(pagecount - 1)
                            }
                        })
                    })
                }

            }

        },
        error: function () {
            console.log('error')
        }
    })
}

// 告警渲染
function alarmRendering(data, html_address) {
    $(html_address).html('')
    data.forEach(function (d) {
        var li = `<li>
                <span title="`+ d.name + `">` + d.name + `</span>
                <span title="`+ d.warn_id + `">` + d.warn_id + `</span>
                <span title="`+ d.type + `">` + d.type + `</span>
                <span title="`+ d.alarm_level + `">` + d.alarm_level + `</span>
                <span title="`+ d.alarm_time + `">` + d.alarm_time + `</span>
            </li>`
        $(html_address).append(li)
    })
}



function alarmPagTwo(html_address, totalPag) {
    $(html_address).paging({
        initPageNo: 1, // 初始页码
        totalPages: totalPag, //总页数
        // totalCount: '合计' + setTotalCount + '条数据', // 条目总数
        slideSpeed: 600, // 缓动速度。单位毫秒
        jump: true, //是否支持跳转
        callback: function (page) { // 回调函数
            var next_pag = parseInt(page) - 1
            showFenceWarningPage(next_pag)
        }
    })
}


var person_data = []


var tishiPanel = new THING.widget.Panel({
    titleText: "鼠标左键单击选择Marker放置的位置",
    hasTitle: true,
    position: [150, 0]
});
tishiPanel.visible = false
var positonMarker;
// 添加关于Marker的两个按钮
var marker_boolvalue = createMarker = false
THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/markerBtn.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0614/markerName.css'], function () {
    addMarkerBtn()
})
function addMarkerBtn() {
    // 添加取消轨迹查看按钮
    // $("#delLocus").hide()

    var htmlMarker = `<div style="z-index:1" id="delLocus">
        <button class="delLocus">取消轨迹查看</button>
    </div>
    <div style="z-index:1" class="markerBtn">
    <button class="newMarker" id="newMarkerBtn">新建Marker</button>
    <br>
    <button class="newMarker" id="showMarkerBtn">Marker展示</button>
    </div>
    <div id="nameMarker" class="z-index1">
                <div class="title fz">设置Marker名称</div>
            <div class="main">
                <span class="fz">名称：</span>
                <span><input style="color:#000000" id="markerName" class="fz" type="text"></span>
            </div>
            <div style="text-align: center;margin-top: 30px">
                <button id="addMarker" class="add-sub">确定</button>
                <button id="delMarker" class="add-sub">取消</button>
            </div>
        </div>`
    $('body').append($(htmlMarker))
    $('.delLocus').click(function () {
        locusEnd()
    })
    $('#delLocus').hide()
    app.on('mousedown', function (ev) {
        positonMarker = ev.pickedPosition
        if (positonMarker) {
            $('#nameMarker').show()
        } else {
            alert('请选择正确的地方放置Marker！！')
        }
    }, '点击放置Marker')
    app.pauseEvent('mousedown', null, '点击放置Marker')
    $('#nameMarker').hide()
    $('#newMarkerBtn').click(() => {
        createMarker = !createMarker;
        if (createMarker) {
            app.resumeEvent('mousedown', null, '点击放置Marker')
            $('#newMarkerBtn').text('取消新建')
            tishiPanel.visible = true

        } else {
            app.pauseEvent('mousedown', null, '点击放置Marker')
            $('#newMarkerBtn').text('新建Marker')
            tishiPanel.visible = false
        }

    })
    $('#delMarker').click(() => $('#nameMarker').hide())
    $('#addMarker').click(() => {
        console.log(1)
        var markerName = $('#markerName').val()
        var data = [{
            name: markerName,
            x: positonMarker[0],
            y: positonMarker[2],
            z: positonMarker[1]
        }]
        $.ajax({
            type: "post",
            url: urlAll + "/markinsert",
            dataType: "json",
            jsonpCallback: "callback",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (d) {
                if (d == '已存在') {
                    alert('Markr名称已存在！')
                } else {
                    $('#nameMarker').hide()
                    $('#markerName').val('')
                    app.pauseEvent('mousedown', null, '点击放置Marker')
                    $('#newMarkerBtn').text('新建Marker')
                    tishiPanel.visible = false
                }

            },
            error: function () {
                console.log('error')
                alert('添加Marker失败！！！')
            }
        })
    })
    $('#showMarkerBtn').click(() => {
        marker_boolvalue = !marker_boolvalue
        if (marker_boolvalue) {
            $.ajax({
                type: "get",
                url: urlAll + "/markquery",
                dataType: "json",
                jsonpCallback: "callback",
                success: function (d) {
                    if (d.length > 0) {
                        showAllMarker(d)
                        $('#showMarkerBtn').text('Marker隐藏')
                    }
                },
                error: function () {
                    console.log('error')
                }
            })
        } else {
            app.query(/Marker001/).destroy()
            $('#showMarkerBtn').text('Marker展示')
        }
    })




}

// 显示Marker图层
var showAllMarker = data => {
    data.forEach(d => {
        var marker = app.create({
            type: "Marker",
            url: "https://thingjs.com/static/images/reminder.png",
            name: 'Marker001',
            id: d.name,
            position: [d.x, d.z + 1, d.y],
            size: 2,
            keepSize: true // 保持像素大小
        })
        var panel = new THING.widget.Panel({
            width: "130px",
            // 是否有标题
            hasTitle: true,
            // 设置标题名称
            titleText: d.name,
            opacity: 0.5,
            cornerType: 'polyline',
            // isClose: true,
            height: '5px',
            width: '150px'
        })
        var info = { '操作': '<button style="color: #000000;width:40px;height:20px" id=' + d.name + ' onclick="delMarker(this)">删除</button>' }
        for (var key in info)
            panel.add(info, key);
        var ui = app.create({
            type: 'UI',
            parent: marker,
            el: panel.domElement,
            pivot: [-0.2, 1.8]
        });
        // 设置永远显示在最上层
        // marker.style.alwaysOnTop = true;
    })
}

function delMarker(obj) {
    var markername = $(obj).attr('id')
    var data = [{
        name: markername
    }]
    $.ajax({
        type: "post",
        url: urlAll + "/markdel",
        dataType: "json",
        jsonpCallback: "callback",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (d) {
            app.query('["id"=' + markername + ']').destroy()
            console.log('删除成功！！')
        },
        error: function () {
            console.log('error')
            alert('删除Marker失败！！！')
        }
    })
}

// 判断是否为组长
function followGroupLeader(obj, personID) {
    // console.log('查询', personID)
    $.ajax({
        type: "post",
        url: urlAll + "/getfollowgroup",
        dataType: "json",
        jsonpCallback: "callback",
        contentType: 'application/json',
        data: JSON.stringify([{ device_id: personID }]),
        success: function (d) {
            if (d) {
                followGroupDic[d.device_id] = new FollowGroup(obj)
            }
        },
        error: function () {
            console.log('error1212')
            return false
        }
    })
}


// 跟随组封装
function FollowGroup(obj) {
    this.obj = obj;
    var radius = 5;// 圆半径
    var center = this.obj.position; // 圆心世界坐标
    // 根据圆形和半径计算坐标点
    var points = [];
    for (var degree = 0, y = 0; degree <= 360; degree += 10) {
        var x = Math.cos(degree * 2 * Math.PI / 360) * radius;
        var z = Math.sin(degree * 2 * Math.PI / 360) * radius;
        var pos = THING.Math.addVector([x, y, z], center);
        points.push(pos);
    }

    // 创建区域
    this.region = app.create({
        parent: this.obj,
        type: 'PolygonRegion',
        name: 'gop' + obj.id,
        points: points, // 点坐标
        style: {
            regionColor: '#000000', // 区域颜色
        }
    })
}

// 摧毁消失的模型
function destroyObject(data) {
    // console.log('删除', data)
    data.forEach(function (d) {
        app.query('["id"=' + d + ']')[0].destroy()
        $('#main_a #' + d).remove()
        $('#main_b #' + d).remove()
    })
}

//搜索所有报警
var searchAllBool = false
function searchAllWanring(pag) {
    $.ajax({
        type: "get",
        url: urlAll + "/pageallalarm?page=" + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            // console.log('第' + pag + '页')
            alarmRendering(d, '#perSearch1 .alarm_main')
            if (pag == 0) {
                if (searchAllBool) {
                    pag3.render({
                        count: d[0].number, current: 1, callback: function () {
                            searchAllWanring(pagecount - 1)
                        }
                    });
                } else {
                    $('#pag3').html('')
                    searchAllBool = true
                    THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                        pag3 = new Paging()
                        pag3.init({
                            target: $('#pag3'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {

                                searchAllWanring(pagecount - 1)
                            }
                        })
                    })
                }

            }
        },
        error: function () {
            console.log('error')
        }
    })
}

// 获取人员轨迹
function getPersonLocus(personData) {
    var locusPath = [];
    $.ajax({
        'url': 'http://47.103.34.10:8080/api/guiji', //Ajax请求服务的地址
        'type': "POST", //请求方式 "POST" 或 "GET"，默认为 "GET"
        'dataType': "json",    //服务返回的数据类型，推荐使用标准JSON数据格式
        //发送到服务器的数据
        'contentType': "application/json; charset=utf-8",
        'data': JSON.stringify(personData),
        //请求成功后的回调函数
        'success': function (data) {
            if (data.length < 1) {
                alert('该人员暂无轨迹！！')
            } else {
                data.forEach((d) => {
                    var p = [d.x, d.z, d.y]
                    locusPath.push(p)
                })
                delPeopleHandle()
                startShowLocus(locusPath, personData[0].device_id)
            }


        },
        //请求失败时调用的函数 有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象
        'error': function (xhr, status, error) {
            console.log(xhr);
        }
    })
}
var lastPosition = null;
var locusObj = null;
var locusLine = null;
function startShowLocus(path, device_id) {
    locusLine = app.create({
        type: 'Line',
        color: 0x00FF00, // 轨迹线颜色
        dotSize: 2, // 轨迹点的大小
        dotColor: 0xFF0000, // 轨迹点的颜色
        points: path,
        complete: function () {
            locusObj = app.query('["id"=' + device_id + ']')[0]
            console.log('人员轨迹', locusObj)
            lastPosition = locusObj.position
            locusObj.position = path[0];
            locusObj.movePath({
                path: path,
                orientToPath: true,
                time: 600000000
            })

            // 每一帧设置摄像机位置 和 目标点
            app.on('update', locusObj, function () {
                app.camera.position = locusObj.selfToWorld([0, 5, -10]);
                app.camera.target = locusObj.position
            }, '自定义摄影机跟随');
        }
    })

}

// 查看轨迹开始取消所有人员操作
function delPeopleHandle() {
    person_object.forEach(function (obj) {
        obj.marker.visible = false
        if (obj.ui) {
            obj.ui.destroy()
            obj.ui = null
        }

    })
    prisoner_object.forEach(function (obj) {
        obj.marker.visible = false
        if (obj.ui) {
            obj.ui.destroy()
            obj.ui = null
        }

    })
    outsider_object.forEach(function (obj) {
        obj.marker.visible = false
        if (obj.ui) {
            obj.ui.destroy()
            obj.ui = null
        }

    })
    $('#personChoose').hide()
    $('#statistic').hide()
    $('#leftFixed').hide()
    $('#indexMenu').hide()
    $('.markerBtn').hide()
    $('#delLocus').show()
}

// 轨迹查看结束
function locusEnd() {
    // locusLine.destroy()
    // locusLine = null;
    $('#personChoose').show()
    $('#statistic').show()
    $('#leftFixed').show()
    $('#indexMenu').show()
    $('.markerBtn').show()
    $('#delLocus').hide()
    app.query('locus').destroy()
    locusPath = []
    locusObj.position = lastPosition
    app.off('update')
}


// 获取围栏数据
function fenceAllPage(pag) {
    $.ajax({
        type: "get",
        url: urlAll + '/query/fenceInfo?page=' + pag,
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            addDelFence(d)
            THING.Utils.dynamicLoad(['/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.css', '/uploads/wechat/bWVzb255Y2hpZA==/file/demo0618/paging.js'], function () {
                $('#pag7').html('')
                pag7 = new Paging()
                pag7.init({
                    target: $('#pag7'), pagesize: 10, count: d[0].number, current: 1, callback: function (pagecount, size, count) {
                        fenceAllPage(pagecount - 1)
                    }
                })
            })
        },
        error: function () { console.log('error') }
    })
}

// 日期格式化
Date.prototype.format = function (format) {
    var args = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
}

function del_fence(obj) {
    var fenceName = [{
        "name": obj.id
    }]
    $.ajax({
        type: "post",
        url: urlAll + "/fencedel",
        dataType: "json",
        jsonpCallback: "callback",
        contentType: 'application/json',
        data: JSON.stringify(fenceName),
        success: function (d) {
            if (d == 'ok') {
                fenceAllPage(pag7.pagecount - 1)
            } else {
                alert('删除失败')
            }
        },
        error: function () {
            console.log('error')
            alert('解除报警失败！！！')
        }
    })
}

// 删除围栏页面添加数据
function addDelFence(data) {
    var newDate = new Date().format("yyyy-MM-dd hh:mm:ss")
    $('.fenceMain').html('')
    data.forEach(function (d) {
        var s_positon = '[' + d.termination_coordinates_x + ',' + d.termination_coordinates_z + ',' + d.termination_coordinates_y + ']'
        var e_positon = '[' + d.initial_coordinates_x + ',' + d.initial_coordinates_z + ',' + d.initial_coordinates_y + ']'
        var fenceType = '未知'
        var s_time = d.creation_time, e_time = d.end_time
        console.log(s_time, 's_time')
        console.log(e_time, 'e_time')
        console.log(newDate, 'newDate')
        console.log(s_time < newDate && newDate < e_time)
        if (newDate < e_time) {
            fenceType = '进行中'
        } else if (newDate < s_time) {
            fenceType = '待进行'
        } else if (e_time < newDate) {
            fenceType = '已失效'
        }
        var liFence = `<li>
                    <span title="`+ d.name + `">` + d.name + `</span>
                    <span title="`+ s_positon + `">` + s_positon + `</span>
                    <span title="`+ e_positon + `">` + e_positon + `</span>
                    <span>`+ fenceType + `</span>
                    <span id="`+ d.name + `" onclick="del_fence(this)">删除</span>
                </li>`
        $('.fenceMain').append(liFence)

    })
}


// 添加区域设备
function addMainC() {
    var buildh3 = $('#main_c h3')
    $('#main_c .tre_one').html('')
    for (let j = 0; j < buildh3.length; j++) {
        var obj = buildh3[j]
        var buildID = obj.id
        var build1 = app.query('["id"="' + buildID + '"]')[0]
        var ul = $(obj).next()
        var sebeis = build1.query(/SX/).add(build1.query(/MJ/)).add(build1.query(/YJ/)).add(build1.query(/CJ/)).add(build1.query(/JZ/)).add(build1.query(/ZZ/))
        $(obj).parent().find('span').html(sebeis.length)
        sebeis.forEach(function (obj) {
            var h5 = `<h4 id="` + obj.id + `">` + obj.name + `</h4>`
            ul.append(h5)
        })
    }

}


var lastGroup = thisGroup = [];
var lastGroupDic = thisGroupDic = {};

// 跳转跟随组
function jumpToFollow(obj) {
    var device = obj.name
    var pObj = app.query('[id=' + device + ']')[0]
    if (pObj) {
        if (pObj.build) {
            var build = pObj.build
            var room = pObj.room
            var parent1 = app.query('[id=' + build + ']')[0].query('[id=' + room + ']')[0]
            app.level.change(parent1)
            //  层级切换飞行结束
            app.on(THING.EventType.LevelFlyEnd, parent1, function (ev) {
                // console.log('飞行结束，开始定位')
                app.camera.position = pObj.selfToWorld([0, 0, 5]);
                app.camera.target = pObj.position
                clickDic[id].marker.visible = true
                app.off(THING.EventType.LevelFlyEnd)
            }, '层级切换飞行结束');
        } else {
            app.camera.position = pObj.selfToWorld([0, 0, 5]);
            app.camera.target = pObj.position
        }
    } else {
        alert('查询实时数据无此人！！！')
    }
}

// 添加左边跟随组的标签
function addGroupLi(data, gDIC) {
    data.forEach(function (gID) {
        var g = gDIC[gID]
        console.log('添加', gID)
        var li = `<li onclick="jumpToFollow(this)" style="text-indent: 20px" type="group" name=` + g.device + ` id="` + gID + `">` + g.groupname + `</li>`
        $('#followMain').append(li)
    })
}

// 删除左边跟随组的标签
function delGroup(data) {
    data.forEach(function (gID) {
        // var li = `<li type="group" name=`+gID+` id="`+g.device+`">`+g.groupname+`</li>`
        $('[type=group]#' + gID).remove()
    })
}

// 获取进行中的跟随组添加标签在右边
var groupTime = null
function agreeFollow() {
    thisGroup = [];
    thisGroupDic = {};
    $.ajax({
        type: "get",
        url: urlAll + '/followgroup',
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            d.forEach(function (data) {
                thisGroupDic[data.id] = data
                thisGroup.push(data.id)
            })


            // 需要添加的跟随组标签// 使用方法  A-B = A.filter(function(e) { return search(B,e) < 0; });
            var gIDList = []
            var gIDList2 = []
            thisGroup.forEach(function (dst) {
                var gruopBool = false
                for (var i = 0; i < lastGroup.length; i++) {
                    if (lastGroup[i] == dst) {
                        gruopBool = true
                        // break
                    }

                }
                if (!gruopBool) {
                    gIDList.push(dst)
                }
            })
            // console.log('添加', gIDList.length)
            addGroupLi(gIDList, thisGroupDic)

            // console.log(thisGroup.length,'this')
            // console.log(lastGroup.length, 'that')
            // console.log('-------------------------------------------')
            lastGroup.forEach(function (dst2) {
                var gruopBool1 = false
                thisGroup.forEach(function (dst1) {
                    // console.log('比较', dst1,dst2)
                    if (dst1 == dst2) {
                        gruopBool1 = true
                        // break
                    }
                })
                if (!gruopBool1) {
                    gIDList2.push(dst2)
                }
            })
            // console.log('删除', gIDList2.length)
            delGroup(gIDList2)
            // }
            lastGroupDic = thisGroupDic
            lastGroup = thisGroup
            groupTime = setInterval(function () {
                thisGroup = [];
                thisGroupDic = {};
                $.ajax({
                    type: "get",
                    url: urlAll + '/followgroup',
                    dataType: "json",
                    jsonpCallback: "callback",
                    success: function (d) {
                        // console.log('跟随组数据', d)
                        d.forEach(function (data) {
                            thisGroupDic[data.id] = data
                            thisGroup.push(data.id)
                        })
                        // console.log(thisGroup.length,'this')
                        // console.log(lastGroup.length, 'that')
                        // if ($.isEmptyObject(lastGroupDic)) {
                        //     console.log('为空')
                        //     addGroupLi(thisGroup, thisGroupDic)
                        // } else {
                        // 需要添加的跟随组标签// 使用方法  A-B = A.filter(function(e) { return search(B,e) < 0; });
                        var gIDList = []
                        thisGroup.forEach(function (dst) {
                            var gruopBool = false
                            for (var i = 0; i < lastGroup.length; i++) {
                                // console.log('判断', arr[i], dst)
                                if (lastGroup[i] == dst) {
                                    gruopBool = true
                                    break
                                }

                            }
                            if (!gruopBool) {
                                gIDList.push(dst)
                            }
                        })
                        // console.log('添加', gIDList.length)
                        addGroupLi(gIDList, thisGroupDic)
                        var gIDList2 = []
                        lastGroup.forEach(function (dst) {
                            var gruopBool1 = false
                            for (var i = 0; i < thisGroup.length; i++) {
                                // console.log('判断', arr[i], dst)
                                if (thisGroup[i] == dst) {
                                    gruopBool1 = true
                                    break
                                }
                            }
                            if (!gruopBool1) {
                                gIDList2.push(dst)
                            }
                        })
                        // console.log('删除', gIDList2.length)
                        delGroup(gIDList2)
                        // var gIDList = thisGroup.filter(function (e) { return search(lastGroup, e) < 0 })
                        // console.log(gIDList)

                        // 需要删除的跟随组标签
                        // var gIDList2 = lastGroup.filter(function (e) { return search(thisGroup, e) < 0 })

                        // }
                        lastGroupDic = thisGroupDic
                        lastGroup = thisGroup
                    },
                    error: function () { console.log('error') }
                })
            }, 1000)
        },
        error: function () { console.log('error') }
    })

}


// 定义点击事件
function clickEvent() {

}

// 动态改变建筑楼层数量
var lastBuildNum = thisBuildNum = []
function cahgneBuildNum() {
    $.ajax({
        type: "get",
        url: urlAll + '/query/buildingnumber',
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            // console.log('goods')
            thisBuildNum = d
            // if (thisBuildNum.toString != lastBuildNum.toString) {
            // console.log('数量改变')
            d.forEach(function (build) {
                $('#main_a #' + build.name).find('span').html(build.number)
                build.room.forEach(function (room) {
                    $('#main_a #' + build.name).next().find('#' + room.name).find('span').html(room.number)
                })
            })
            lastBuildNum = thisBuildNum
            // }
        },
        error: function () { console.log('error') }
    })

}

// 动态显示人员分类
function personType() {
    $.ajax({
        type: "get",
        url: urlAll + '/personnumquery',
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            d.forEach(function (p1) {
                var type_p = p1.type
                var h3 = $('#main_b [type=' + type_p + ']')
                console.log()
                h3.find('span').html(p1.number[0]['count'])
            })
        },
        error: function () { console.log('error') }
    })
}

// 显示电子围栏当前告警 
function showFenceAlarm(ls, dic) {
    ls.forEach(function (name) {
        var d = dic[name]
        app.create({
            type: "Marker",
            url: "https://thingjs.com/static/images/warning.png",
            name: 'fence' + d.name,
            position: [d.warn_x, d.warn_z + 1, d.warn_y],
            size: 4,
            // keepSize: true // 保持像素大小
        })
    })
}

// 删除电子围栏当前告警 
function delFenAlarm(ls) {
    ls.forEach(function (name) {
        app.query('fence' + name).query('[type=Marker]').destroy()
    })

}

// 获取电子围栏当前告警
var lastFenceAlarm = new Set(), thisFenceAlarm;
var lastFenDic = {}, thisFenDic;
function getFenceAlarm() {
    thisFenceAlarm = new Set()
    thisFenDic = {}
    $.ajax({
        type: "get",
        url: urlAll + '/todayalarm?type=1',
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            d.forEach(function (f) {
                thisFenceAlarm.add(f.name)
                thisFenDic[f.name] = f
            })
            // 需要创建

            var createF = [], delF = []
            thisFenceAlarm.forEach(function (tf) {
                var fbool1 = true
                lastFenceAlarm.forEach(function (lf) {
                    if (tf == lf) {
                        fbool1 = false

                    }
                })
                if (fbool1) {
                    createF.push(tf)
                }
            })
            showFenceAlarm(createF, thisFenDic)

            // 需要删除
            lastFenceAlarm.forEach(function (tf) {
                var fbool2 = true
                thisFenceAlarm.forEach(function (lf) {
                    if (tf == lf) {
                        fbool2 = false

                    }
                })
                if (fbool2) {
                    delF.push(tf)
                }
            })
            delFenAlarm(delF)

            lastFenceAlarm = thisFenceAlarm


        },
        error: function () { console.log('error') }
    })
}

// 显示跟随组当前告警 
function showFollAlarm(ls, dic) {
    ls.forEach(function (name) {
        var d = dic[name]
        console.log('创建', d)
        app.create({
            type: "Marker",
            url: "https://thingjs.com/static/images/warning.png",
            name: 'follow' + d.name,
            position: [d.warn_x, d.warn_z + 1, d.warn_y],
            size: 4,
            // keepSize: true // 保持像素大小
        })
    })
}

// 移动当前告警
function moveAlarm(ls, dic) {
    ls.forEach(function (item) {
        var name = 'follow' + item
        var d = dic[item]
        app.query(name)[0].position = [d.warn_x, d.warn_z + 1, d.warn_y]
    })

}


// 删除跟随组当前告警 
function delFollAlarm(ls) {
    ls.forEach(function (name) {
        app.query('follow' + name).query('[type=Marker]').destroy()
    })

}

// 获取跟随组当前告警
function getFollowAlarm() {
    thisFenceAlarm = new Set()
    thisFenDic = {}
    $.ajax({
        type: "get",
        url: urlAll + '/todayalarm?type=2',
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            d.forEach(function (f) {
                thisFenceAlarm.add(f.name)
                thisFenDic[f.name] = f
            })
            // 需要创建

            var createF = [], delF = [], moveLs = []
            thisFenceAlarm.forEach(function (tf) {
                var fbool1 = true
                lastFenceAlarm.forEach(function (lf) {
                    if (tf == lf) {
                        moveLs.push(tf)
                        fbool1 = false
                    }
                })
                if (fbool1) {
                    createF.push(tf)
                }
            })
            console.log('需要创建', createF)
            moveAlarm(moveLs, thisFenceAlarm)
            showFollAlarm(createF, thisFenDic)

            // 需要删除
            lastFenceAlarm.forEach(function (tf) {
                var fbool2 = true
                thisFenceAlarm.forEach(function (lf) {
                    if (tf == lf) {
                        fbool2 = false

                    }
                })
                if (fbool2) {
                    delF.push(tf)
                }
            })
            delFollAlarm(delF)

            lastFenceAlarm = thisFenceAlarm


        },
        error: function () { console.log('error') }
    })
}

// 显示other当前告警 
function showOtherAlarm(ls, dic) {
    ls.forEach(function (name) {
        var d = dic[name]
        console.log('创建', name)
        app.create({
            type: "Marker",
            url: "https://thingjs.com/static/images/warning.png",
            name: 'other' + d.name,
            position: [d.warn_x, d.warn_z + 1, d.warn_y],
            size: 2,
            // keepSize: true // 保持像素大小
        })
    })
}

// 删除other当前告警 
function delOtherAlarm(ls) {
    ls.forEach(function (name) {
        console.log('删除', name)
        app.query('other' + name).query('[type=Marker]').destroy()
    })

}

// 获取other当前告警
function getOtherAlarm() {
    thisFenceAlarm = new Set()
    thisFenDic = {}
    $.ajax({
        type: "get",
        url: urlAll + '/todayalarm?type=3',
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            d.forEach(function (f) {
                thisFenceAlarm.add(f.name + f.type)
                thisFenDic[f.name + f.type] = f
            })
            // 需要创建

            var createF = [], delF = []
            thisFenceAlarm.forEach(function (tf) {
                var fbool1 = true
                lastFenceAlarm.forEach(function (lf) {
                    if (tf == lf) {
                        fbool1 = false

                    }
                })
                if (fbool1) {
                    createF.push(tf)
                }
            })
            // console.log('创建',createF)
            showOtherAlarm(createF, thisFenDic)

            // 需要删除

            lastFenceAlarm.forEach(function (tf) {
                var fbool2 = true
                thisFenceAlarm.forEach(function (lf) {
                    if (tf == lf) {
                        fbool2 = false
                    }
                })
                if (fbool2) {
                    delF.push(tf)
                }
            })
            // console.log('删除', delF)
            delOtherAlarm(delF)

            lastFenceAlarm = thisFenceAlarm
        },
        error: function () { console.log('error') }
    })
}



// 获取建筑与房间的设备数量
function getBRNum() {
    $.ajax({
        type: "get",
        url: urlAll + '/devicenumber1',
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            console.log('数据', d)
            addBRNum(d)
        },
        error: function () { console.log('error') }
    })
}

// 添加建筑房间设备数量标签
function addBRNum(data) {
    for (let j = 0; j < data.length; j++) {
        // var build = builds[j]
        var b_number = 0
        var tree1 = $('<div class="tre_box"></div>')
        var tree3 = $('<ul class="tre_one"></ul>')
        var li1;
        for (var i = 0, flors = data[j].room; i < flors.length; i++) {
            var flors
            li1 = $('<li></li>')
            var treeName;
            var tree4 = $('<h4 class="tre_name" name="' + flors[i].id + '" id="' + flors[i].name + '">' + flors[i].name + '(<span>' + flors[i].number + '</span>)' + '</h4>')
            li1.append(tree4)
            li1.append($(`<ul class='tre_two'></ul>`))
            tree3.append(li1)
        }
        var tree2 = $('<h3 class="tre_name build_name" name="' + data[j].id + '" id="' + data[j].name + '">' + data[j].name + '(<span>' + data[j].number + '</span>)' + '</h3>')
        tree1.append(tree2)
        tree1.append(tree3)
        $('#main_c').append(tree1)
    }
}

// 改变建筑房间设备数量
function changeBRnum() {
    $.ajax({
        type: "get",
        url: urlAll + '/devicenumber1',
        dataType: "json",
        jsonpCallback: "callback",
        success: function (d) {
            // console.log('拉取数据', d)
            d.forEach(function (b) {
                // console.log('改变', b.name)
                $('#main_c #' + b.name).find('span').html(b.number)
                b.room.forEach(function (r) {
                    $('#main_c #' + b.name).next().find('#' + r.name).find('span').html(r.number)
                })
            })
        },
        error: function () { console.log('error') }
    })
}



// 已存在的设备点击事件
function sbClick() {
    var allSB = app.query(/SXT/).add(app.query(/YJ/)).add(app.query(/JZ/)).add(app.query(/MJ/)).add(app.query(/CJ/))
    allSB.on('singleclick', function (ev) {
        var obj = clickDic[ev.object.id]
        console.log(obj)
        obj.marker.visible = true
    })

    allSB.on('dblclick', function (ev) {
        var obj = clickDic[ev.object.id]
        obj.marker.visible = false
        if (obj.ui) {
            obj.ui.destroy()
            obj.ui = null
        }
    })
}


