(function (a) {
    a.fn.selectRange = function (c, b) {
        return this.each(function () {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(c, b)
            } else {
                if (this.createTextRange) {
                    var d = this.createTextRange();
                    d.collapse(true);
                    d.moveEnd("character", b);
                    d.moveStart("character", c);
                    d.select()
                }
            }
        })
    }
})(jQuery);
var gLang;
var gHandle = 0;
var gBagdes = {};
var gGrades = {};
var gClipboard = {flag: false, title: "", prefix: "", suffix: ""};
var gResult = {time: 0, words: 0, right: 0, wrong: 0, rate: 0, speed: 0, highSpeed: 0};
var startTime = 0, endTime = 0;
var timer = 0;
var counter = 0;
var inputCounter = 0;
var doc = [];
var DOCS = {CH: [], EN: [], CHEN: []};
$(function () {
    typeeasy()
});
function typeeasy() {
    init()
}
function init() {
    var e = $("#btnChinese");
    var a = $("#btnEnglish");
    var f = $("#btnChineseEnglish");
    e.click(function () {
        practice("chinese")
    });
    a.click(function () {
        practice("english")
    });
    f.click(function () {
        practice("chinese_english")
    });
    var g = $("#btnBack").hide();
    var d = $("#btnSubmit").hide();
    var b = $("#btnRestart").hide();
    g.click(function () {
        start()
    });
    d.click(function () {
        submit()
    });
    b.click(function () {
        start()
    });
    var c = "//www.51dzt.com/docs.xml?" + new Date().getTime();
    $.get(c, function (i) {
        var j = $(i);
        j.find("badge").each(function () {
            var m = $(this);
            var n = m.attr("id");
            var k = m.attr("name");
            var l = m.attr("icon");
            gBagdes[n] = {name: k, icon: l}
        });
        j.find("grade").each(function () {
            var n = $(this);
            var o = n.attr("lang");
            var m = n.attr("speed1");
            var l = n.attr("speed2");
            var k = n.attr("speed3");
            gGrades[o] = {speed1: m, speed2: l, speed3: k}
        });
        var h = j.find("clipboard");
        gClipboard.title = h.attr("title");
        gClipboard.prefix = h.attr("prefix");
        gClipboard.suffix = h.attr("suffix");
        j.find("CH").each(function (m) {
            var n = $(this);
            var l = $.trim(n.attr("line1"));
            var k = $.trim(n.attr("line2"));
            var o = $.trim(n.attr("line3"));
            DOCS.CH.push([l, k, o])
        });
        j.find("EN").each(function (m) {
            var n = $(this);
            var l = $.trim(n.attr("line1"));
            var k = $.trim(n.attr("line2"));
            var o = $.trim(n.attr("line3"));
            DOCS.EN.push([l, k, o])
        });
        j.find("CHEN").each(function (m) {
            var n = $(this);
            var l = $.trim(n.attr("line1"));
            var k = $.trim(n.attr("line2"));
            var o = $.trim(n.attr("line3"));
            DOCS.CHEN.push([l, k, o])
        })
    })
}
function start() {
    timerStop();
    var d = $("#btnBack").hide();
    var b = $("#btnSubmit").hide();
    var a = $("#btnRestart").hide();
    var e = $("#start");
    var c = $("#practice");
    e.show();
    c.hide()
}
function practice(k) {
    gHandle = 0;
    gResult = {time: 0, words: 0, right: 0, wrong: 0, rate: 0, speed: 0, highSpeed: 0};
    timer = 0;
    counter = 0;
    inputCounter = 0;
    startTime = 0;
    endTime = 0;
    var i = $("#btnBack");
    var l = $("#btnSubmit");
    var n = $("#btnRestart");
    var e = Math.random();
    var j = 0;
    doc = [];
    switch (k) {
        case"chinese":
            gLang = 0;
            j = Math.round(e * DOCS.CH.length);
            doc = DOCS.CH[j];
            break;
        case"english":
            gLang = 1;
            j = Math.round(e * DOCS.EN.length);
            doc = DOCS.EN[j];
            break;
        case"chinese_english":
            gLang = 2;
            j = Math.round(e * DOCS.CHEN.length);
            doc = DOCS.CHEN[j];
            break;
        default:
            break
    }
    var d = doc[0].length;
    var c = doc[1].length;
    var b = doc[2].length;
    var f = d + c + b;
    var p = $("#line1, #line2, #line3");
    p.eq(0).html(doc[0]);
    p.eq(1).html(doc[1]);
    p.eq(2).html(doc[2]);
    var m = $("#text1, #text2, #text3");
    m.val("");
    m.unbind("keydown").bind("keydown", function (q) {
        counter++;
        getResult()
    });
    m.unbind("textchange").bind("textchange", function (q, t) {
        var w = $(this);
        var x = w.val();
        if (x.length > t.length) {
            inputCounter = inputCounter + Math.abs(x.length - t.length)
        }
        var v = parseInt(w.attr("id").slice(-1));
        var y = check(doc[v - 1], x);
        p.eq(v - 1).html(y);
        var r = doc[v - 1].length;
        if (x.length >= r) {
            w.val(x.slice(0, r));
            if (v != 3) {
                var s = m.eq(v);
                s.val(s.val() + x.slice(r));
                s.selectRange(s.val().length, s.val().length)
            }
        }
        if (getTextCount() >= f) {
            i.hide();
            l.css("display", "inline-block");
            n.hide();
            var u = getExamWordsRightWrongCount();
            if (u.words == u.right) {
                l.click()
            }
        }
        getResult()
    });
    m.one("keydown", function () {
        timerStart()
    });
    getResult();
    var a = $("#start");
    var g = $("#practice");
    var o = $("#panelExam");
    var h = $("#panelFinish");
    a.hide();
    g.show();
    o.show();
    h.hide();
    i.css("display", "inline-block");
    l.hide();
    n.hide();
    m.eq(0).focus()
}
function submit() {
    timerStop();
    var i = $("#panelExam");
    var c = $("#panelFinish");
    i.hide();
    c.show();
    var e = $("#btnBack");
    var g = $("#btnSubmit");
    var h = $("#btnRestart");
    e.hide();
    g.hide();
    h.css("display", "inline-block");
    var f = getRightRate();
    gResult.rate = f;
    var b = getResultSpeed();
    gResult.speed = b;
    var d = getExamWordsRightWrongCount();
    gResult.words = inputCounter;
    gResult.right = d.right;
    gResult.wrong = gResult.words - d.right;
    c.find(".result").html(getExamResult());
    c.find(".clipboardText").text(getClipboardResult());
    $("#iconSina").attr("href", getWeiboUrl("sina"));
    $("#iconTencent").attr("href", getWeiboUrl("tencent"));
    if (!gClipboard.flag) {
        var a = $("#btnClipboard");
        a.zclip({
            path: "js/zero_clipboard.swf", copy: function () {
                var j = $(".clipboardText").val();
                var k = gClipboard.title + "\r\n" + gClipboard.prefix + "\r\n" + j.replace(/\n/g, "\r\n") + "\r\n" + gClipboard.suffix;
                return k
            }
        });
        gClipboard.flag = true
    }
}
function timerStart() {
    if (gHandle != 0) {
        return
    }
    startTime = new Date().getTime();
    timer = 1;
    getResult();
    gHandle = setInterval(function () {
        timer++;
        getResult()
    }, 1000)
}
function timerStop() {
    clearInterval(gHandle)
}
function resize() {
    var b = $(document).width();
    var a = $(document).height();
    window.resizeBy(540 - b, 335 - a)
}
function getResult() {
    var h = getTime(timer);
    var f = getKPMSpeed();
    var e = getRightRate();
    var d = $("#panelResult .time");
    var c = $("#panelResult .speed");
    var a = $("#panelResult .rate");
    d.html(h);
    c.html(f + " kpm");
    a.html(e + "%");
    var g = getResultSpeed();
    var b = gResult.highSpeed;
    if (g > b) {
        b = g
    }
    gResult.time = timer;
    gResult.speed = g;
    gResult.highSpeed = b
}
function getTime() {
    var a = timer % 60;
    var c = parseInt(timer / 60);
    if (a < 10) {
        a = "0" + a
    }
    if (c < 10) {
        c = "0" + c
    }
    var b = c + ":" + a;
    return b
}
function getChineseTime(f) {
    var b = f % 60;
    var e = parseInt(f / 60);
    var d = "";
    var a = "";
    if (e > 0) {
        d = e + "分"
    }
    if (b != 0) {
        a = b + "秒"
    }
    if (f == 0) {
        a = "0秒"
    }
    var c = d + a;
    return c
}
function getKPMSpeed() {
    var a = new Date().getTime();
    var c = 0;
    var b = a - startTime;
    if (b > 300) {
        c = parseInt(counter * 1000 * 60 / b)
    }
    return c
}
function getWPMSpeed() {
    var a = new Date().getTime();
    var c = 0;
    var b = a - startTime;
    if (b > 300) {
        c = parseInt(inputCounter * 1000 * 60 / b)
    }
    return c
}
function getTextCount() {
    var c = 0;
    var b = $("#text1, #text2, #text3");
    for (var a = 0; a != 3; a++) {
        var d = b.eq(a).val();
        c += d.length
    }
    return c
}
function getResultSpeed() {
    var a = getRightRate();
    var c = 0;
    if (a >= 25) {
        var b = getTextCount();
        c = Math.floor(Math.floor(b / timer * 60 * a / 100).toFixed(1))
    }
    return c
}
function getRightRate() {
    var b = 0;
    var c = getExamWordsRightWrongCount();
    var d = c.words;
    var e = c.right;
    var a = c.wrong;
    if (inputCounter != 0) {
        b = parseInt(e * 100 / inputCounter)
    }
    if (isNaN(b)) {
    }
    return b
}
function getExamWordsRightWrongCount() {
    var b = 0;
    var a = 0;
    var j = 0;
    var g = $("#text1, #text2, #text3");
    for (var c = 0; c != 3; c++) {
        var f = doc[c];
        var d = g.eq(c).val();
        b += d.length;
        var e = getRightWrongCount(f, d);
        a += e.right;
        j += e.wrong
    }
    var h = {words: b, right: a, wrong: j};
    return h
}
function getRightWrongCount(f, e) {
    var b = 0;
    var j = 0;
    var c = Math.min(f.length, e.length);
    for (var d = 0; d != c; d++) {
        var g = f.slice(d, d + 1);
        var a = e.slice(d, d + 1);
        if (g == a) {
            b++
        } else {
            j++
        }
    }
    var h = {right: b, wrong: j};
    return h
}
function getWeiboUrl(g) {
    var e = {url: "http://v.t.sina.com.cn/share/share.php?", face: "[抓狂]"};
    var b = {url: "http://v.t.qq.com/share/share.php?", face: "/抓狂"};
    var a, f;
    if (g == "sina") {
        a = e.url;
        f = e.face
    } else {
        a = b.url;
        f = b.face
    }
    var j;
    if (gLang == 0) {
        j = "中文输入"
    } else {
        if (gLang == 1) {
            j = "英文输入"
        } else {
            j = "中英混输"
        }
    }
    var c = getResultSpeed();
    var i = getBadge(c, gLang);
    var k = "刚刚用#打字通2011#在线测试了打字速度，我的" + j + "成绩是每分钟" + c + "个字，得到了打字通徽章【" + i.name + "】，求超越！" + f + " 有木有！？有木有？！" + f + " http://app.baidu.com/app/enter?appid=117675";
    var d = {title: k, pic: i.icon};
    var h = $.param(d);
    return a + h
}
function getBadge(e, g) {
    var c;
    var f = gGrades[g];
    var d = f.speed1;
    var b = f.speed2;
    var a = f.speed3;
    if (e < d) {
        c = gBagdes[0]
    } else {
        if (e < b) {
            c = gBagdes[1]
        } else {
            if (e < a) {
                c = gBagdes[2]
            } else {
                c = gBagdes[3]
            }
        }
    }
    return c
}
//a为判断后的html
function check(c, g) {
    var a = "";
    var e = Math.min(c.length, g.length);
    for (var d = 0; d != e; d++) {
        var b = c.slice(d, d + 1);
        var f = g.slice(d, d + 1);
        if (b == f) {
            a = a + '<font color="#808080">' + b + "</font>"
        } else {
            a = a + '<font color="#ff8080">' + b + "</font>"
        }
    }
    a = a + c.slice(e);
    return a
}
function getExamResult() {
    var c, b, a;
    if (gLang == 0) {
        c = "中文打字"
    } else {
        if (gLang == 1) {
            c = "英文打字"
        } else {
            c = "中英混输"
        }
    }
    var d = getResultSpeed();
    if (d == 0) {
        a = "正确率有待提高哦，赶快练习！"
    } else {
        if (d < 50) {
            a = "不给力呀，加把劲！！"
        } else {
            if (d < 100) {
                a = "太棒了，继续加油哟！！！"
            } else {
                if (d < 150) {
                    a = "偶滴神啊，崇拜！！！！"
                } else {
                    a = "传说的打字高手就是你呀！！！！！"
                }
            }
        }
    }
    b = "您最终的" + c + "成绩是：每分钟" + d + "个字。";
    return b + "<br>" + a
}
function getClipboardResult() {
    var f = gResult.time;
    var h = gResult.words;
    var c = gResult.right;
    var a = gResult.wrong;
    var d = gResult.rate;
    var e = gResult.speed;
    var b = gResult.highSpeed;
    var g = "测试时间：" + getChineseTime(f) + "\r一共打了：" + h + "个字\r打对了：" + c + "个字\r打错了：" + a + "个字\r正确率：" + d + "%\r速度：" + e + "字/分钟\r打字速度峰值：" + b + "字/分钟";
    return g
};
