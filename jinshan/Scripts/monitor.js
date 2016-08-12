var baidu = baidu || {version: "1-2-0"};
baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || +RegExp["\x241"]) : undefined;
baidu.page = baidu.page || {};
baidu.page.getHeight = function () {
    var d = document, a = d.body, c = d.documentElement, b = d.compatMode == "BackCompat" ? a : d.documentElement;
    return Math.max(c.scrollHeight, a.scrollHeight, b.clientHeight)
};
var IE = !!window.attachEvent;
baidu.page.getsHeight = function () {
    var d = document, a = d.body, c = d.documentElement, b = d.compatMode == "BackCompat" ? a : d.documentElement;
    return IE ? (a.offsetHeight || b.offsetHeight) : Math.max(c.offsetHeight, a.offsetHeight, b.offsetHeight)
};
baidu.page.getWidth = function () {
    var d = document, a = d.body, c = d.documentElement, b = d.compatMode == "BackCompat" ? a : d.documentElement;
    return Math.max(c.scrollWidth, a.scrollWidth, b.clientWidth)
};
baidu.page.getViewWidth = function () {
    var b = document, a = b.compatMode == "BackCompat" ? b.body : b.documentElement;
    return a.clientWidth
};
baidu.app = baidu.app || {};
baidu.app.run = function (a) {
    return baidu.app[a] ? baidu.app[a] : function () {
    }
};
baidu.app.utils = {
    getPageHeight: function () {
        return baidu.page.getHeight()
    }, createIframe: function (c, e) {
        if (!c.method || (top == self) || (document.location.protocol == "https:")) {
            return
        }
        var d = [];
        for (var a in c) {
            d.push(a + "=" + c[a])
        }
        d = d.join("&");
        var b = document.createElement("iframe");
        b.style.cssText = "width:1px;height:1px;position:absolute;visibility:hidden;top:0;right:0;";
        b.src = (baidu.app.bAPPFlag ? decodeURIComponent(baidu.app.relay) : "http://app.baidu.com/static/appstore/html/bdjs_callback.html") + "#stamp=" + ((new Date()).getTime().toString(32)) + "&" + d;
        baidu.domready(function () {
            document.body.appendChild(b)
        });
        if (e) {
            baidu.app.utils.addEvent(b, "load", function () {
                setTimeout(function () {
                    e()
                }, 40)
            })
        }
    }, addEvent: function (b, a, c) {
        if (b.attachEvent) {
            b.attachEvent("on" + a, c)
        } else {
            b.addEventListener(a, c, false)
        }
    }, removeEvent: function (b, a, c) {
        if (b.detachEvent) {
            b.detachEvent("on" + a, c)
        } else {
            b.removeEventListener(a, c, false)
        }
    }, createStats: function (a) {
        a.method = "stats";
        baidu.app.utils.createIframe(a)
    }, children: function (b) {
        for (var a = [], c = b.firstChild; c; c = c.nextSibling) {
            if (c.nodeType == 1) {
                a.push(c)
            }
        }
        return a
    }
};
baidu.app.addEvent = baidu.app.utils.addEvent;
baidu.app.removeEvent = baidu.app.utils.removeEvent;
baidu.app.eventCenter = {
    _events: {}, subscribe: function (b, c) {
        var a = baidu.app.eventCenter._events;
        if (!a[b]) {
            a[b] = [c]
        } else {
            a[b].push(c)
        }
    }, clear: function (b) {
        var a = baidu.app.eventCenter._events;
        if (a[b]) {
            delete a[b]
        }
    }, fire: function (c) {
        var b = baidu.app.eventCenter._events;
        if (b[c]) {
            var e = b[c];
            for (var d = 0, a = e.length; d < a; d++) {
                e[d].apply(e[d], Array.prototype.slice.call(arguments, 0))
            }
        }
    }
};
baidu.app.config = {};
(function () {
    if (baidu.domready) {
        return
    }
    var c = [];
    c.isReady = false;
    c.ready = function (k) {
        if (c.isReady) {
            k()
        } else {
            c.push(k)
        }
    };
    c.fireReady = function () {
        if (!c.isReady) {
            if (!document.body) {
                return setTimeout(c.fireReady, 16)
            }
            c.isReady = 1;
            if (c.length) {
                for (var k = 0, l; l = c[k]; k++) {
                    l()
                }
            }
        }
    };
    if (document.readyState === "complete") {
        c.fireReady()
    } else {
        if (-[1,]) {
            document.addEventListener("DOMContentLoaded", function () {
                document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                c.fireReady()
            }, false)
        } else {
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState == "complete") {
                    document.detachEvent("onreadystatechange", arguments.callee);
                    c.fireReady()
                }
            });
            (function () {
                if (c.isReady) {
                    return
                }
                var k = new Image;
                try {
                    k.doScroll();
                    k = null
                } catch (l) {
                    setTimeout(arguments.callee, 64);
                    return
                }
                c.fireReady()
            })()
        }
    }
    baidu.domready = c.ready;
    function e(o) {
        var n = {};
        if (o.join) {
            for (var l = 0, k = o.length; l < k; l++) {
                var m = o[l].split("=");
                if (m[0].match(/[a-zA-Z]/g)) {
                    n[m[0]] = m[1] || m[0]
                }
            }
        }
        return n
    }

    function h(l) {
        var m = [];
        for (var k in l) {
            m.push(k + "=" + l[k])
        }
        return m.join("&")
    }

    function b(k) {
        k.name = k.name.match(/bd@[^@]*@bd/g) ? k.name : k.name + "bd@@bd";
        return k.name.match(/(bd@)([^@]*)(@bd)/g).join("").replace(/bd@|@bd/g, "").replace(/^;/g, "").split(";")
    }

    function d(k, l) {
        k.name = k.name.match(/bd@[^@]*@bd/g) ? k.name : k.name + "bd@@bd";
        k.name = k.name.replace(/(bd@)([^@]*)(@bd)/g, "bd@$2;" + l + "@bd")
    }

    function f() {
        var k = b(window);
        for (var l = 0; l < k.length; l++) {
            if (k[l].indexOf("bAPPFlag") != -1) {
                return k[l]
            }
        }
        return 0
    }

    (function () {
        var l = location.hash.indexOf("bAPPFlag") != -1 ? location.hash : f();
        if (!l) {
            return
        }
        l = l.replace(/#|BAPP@|@BAPP/g, "").split("&");
        var k = e(l);
        baidu.app.bAPPFlag = k.bAPPFlag;
        baidu.app.appFlag = k.appFlag;
        baidu.app.relay = decodeURIComponent(k.relay);
        if (baidu.app.bAPPFlag) {
            d(window, l.join("&"))
        }
        if (document.getElementById("mask") && document.getElementById("AppAdv")) {
            document.getElementById("mask").style.display = "none";
            document.getElementById("AppAdv").style.display = "none"
        }
    })();
    if (baidu.app.bAPPFlag) {
        var g = baidu.app.utils.createIframe;
        baidu.app.eventCenter.subscribe("message", function (l, k) {
            if (k.bAPPFlag) {
                switch (k.mess) {
                    case"bd_adv_finish":
                        baidu.app.advState = 0;
                        baidu.app.run("hideAd")();
                        break;
                    default:
                        break
                }
            }
        });
        baidu.app.utils.createIframe = function (k, l) {
            k.bAPPFlag = baidu.app.bAPPFlag;
            k.appFlag = baidu.app.appFlag;
            if (window.postMessage) {
                parent.postMessage(h(k), "*");
                l && setTimeout(l, 240)
            } else {
                g(k, l)
            }
        };
        if (window.postMessage) {
            baidu.app.utils.addEvent(window, "message", function (k) {
                baidu.app.eventCenter.fire("message", e(k.data))
            })
        } else {
            var a = "";
            var j = setInterval(function () {
                if (window.name != a) {
                    a = window.name;
                    var k = b(window);
                    for (var l = 0; l < k.length; l++) {
                        baidu.app.eventCenter.fire("message", e(k[l].split("&")))
                    }
                }
            }, 500)
        }
        baidu.app.sendMessage = function (k) {
            baidu.app.utils.createIframe(k)
        }
    }
})();
(function () {
    function d(n) {
        var m = {};
        if (n.join) {
            for (var k = 0, j = n.length; k < j; k++) {
                var l = n[k].split("=");
                if (l[0].match(/[a-zA-Z]/g)) {
                    m[l[0]] = l[1] || l[0]
                }
            }
        }
        return m
    }

    function a(k) {
        var l = [];
        for (var j in k) {
            l.push(j + "=" + k[j])
        }
        return l.join("&")
    }

    function g(j) {
        j.name = j.name.match(/bd@[^@]*@bd/g) ? j.name : j.name + "bd@@bd";
        return j.name.match(/(bd@)([^@]*)(@bd)/g).join("").replace(/bd@|@bd/g, "").replace(/^;/g, "").split(";")
    }

    function h(j, k) {
        j.name = j.name.match(/bd@[^@]*@bd/g) ? j.name : j.name + "bd@@bd";
        j.name = j.name.replace(/(bd@)([^@]*)(@bd)/g, "bd@$2;" + k + "@bd")
    }

    function f() {
        var j = g(window);
        for (var k = 0; k < j.length; k++) {
            if (j[k].indexOf("bAPPFlag") != -1) {
                return j[k]
            }
        }
        return 0
    }

    (function () {
        var k = location.hash.indexOf("bAPPFlag") != -1 ? location.hash : f();
        if (!k) {
            return
        }
        k = k.replace(/#|BAPP@|@BAPP/g, "").split("&");
        var j = d(k);
        baidu.app.bAPPFlag = j.bAPPFlag;
        baidu.app.appFlag = j.appFlag;
        baidu.app.relay = decodeURIComponent(j.relay);
        if (document.getElementById("mask")) {
            document.getElementById("mask").style.display = "none";
            document.getElementById("AppAdv").style.display = "none"
        }
    })();
    if (baidu.app.bAPPFlag) {
        var e = baidu.app.utils.createIframe;
        baidu.app.eventCenter.subscribe("message", function (k, j) {
            if (j.bAPPFlag) {
                switch (j.mess) {
                    case"bd_adv_finish":
                        baidu.app.advState = 0;
                        baidu.app.run("hideAd")();
                        break;
                    default:
                        break
                }
            }
        });
        baidu.app.utils.createIframe = function (j, k) {
            j.bAPPFlag = baidu.app.bAPPFlag;
            j.appFlag = baidu.app.appFlag;
            if (window.postMessage) {
                parent.postMessage(a(j), "*");
                k && setTimeout(k, 240)
            } else {
                e(j, k)
            }
        };
        if (window.postMessage) {
            baidu.app.utils.addEvent(window, "message", function (j) {
                baidu.app.eventCenter.fire("message", d(j.data))
            })
        } else {
            var c = "";
            var b = setInterval(function () {
                if (window.name != c) {
                    c = window.name;
                    var j = g(window);
                    for (var k = 0; k < j.length; k++) {
                        baidu.app.eventCenter.fire("message", d(j[k].split("&")))
                    }
                }
            }, 500)
        }
        baidu.app.sendMessage = function (j) {
            baidu.app.utils.createIframe(j)
        }
    }
})();
if (window.app_client_config) {
    for (var i in app_client_config) {
        baidu.app.config[i] = app_client_config[i]
    }
}
(function () {
    var b = false;
    var d = 0;

    function c() {
        return window.bd_render_head_time ? +(new Date()) - window.bd_render_head_time : -1
    }

    var a = {
        _init: function () {
            baidu.app.utils.createIframe({method: "loader", flag: 1});
            baidu.app.addEvent(window, "load", a._onload);
            baidu.domready && baidu.domready(a._domready)
        }, _domready: function () {
            d = +(new Date());
            var e = document.getElementsByTagName("embed").length || document.getElementsByTagName("object").length;
            baidu.app.utils.createIframe({method: "loaded", type: "flash", body: c(), flash: 0})
        }, _forceLoad: function () {
            setTimeout(function () {
                baidu.app.utils.createIframe({method: "stats", body: c(), force: 1, flash: 0})
            }, document.body ? 300 : 2500)
        }, _onload: function () {
            var e = +(new Date());
            d && baidu.app.utils.createIframe({
                method: "stats",
                domready: d,
                headtime: window.bd_render_head_time || 0,
                onload: e
            });
            if (b) {
                return
            }
            baidu.app.utils.createIframe({method: "time", time: e});
            baidu.app.utils.createIframe({method: "loaded", body: c(), flash: 0});
            b = true
        }
    };
    a._init();
    a._forceLoad();
    baidu.app.LoadingMgr = a;
    baidu.app.loaded = function () {
        a._onload()
    }
})();
(function () {
    var b = {
        _resize_interval: 100, _last_height: 0, init: function () {
            setInterval(b._autoHeight, b._resize_interval)
        }, _autoHeight: function () {
            baidu.domready(function () {
                if (baidu.app.config.autoHeight) {
                    var e = baidu.app.utils.getPageHeight();
                    b.setHeight(e)
                }
            })
        }, setHeight: function (e, f) {
            if (e != b._last_height) {
                b._last_height = e;
                baidu.app.utils.createIframe({method: "resize", height: e}, f)
            }
        }, autoHeight: function () {
            b.setHeight(baidu.page.getsHeight(), function () {
                baidu.app.config.autoHeight = true
            })
        }, clearAutoHeight: function () {
            baidu.app.config.autoHeight = false
        }
    };
    b.init();
    baidu.app.HeightMgr = b;
    baidu.app.autoHeight = b.autoHeight;
    baidu.app.clearAutoHeight = b.clearAutoHeight;
    baidu.app.setHeight = b.setHeight;
    var d, a;

    function c() {
        var e = baidu.page.getViewWidth();
        e = Math.floor(e / 750) * 800 || Math.floor(e / 600) * 650 || 540;
        if (a == e) {
            return
        }
        if (e > 800) {
            e = 800
        }
        if (a != e) {
            d && d(e)
        }
        a = e
    }

    baidu.app.resizePlayer = function (e) {
        d = e;
        c();
        if (baidu.ie == 6) {
            baidu.domready(function () {
                setInterval(c, 112)
            })
        } else {
            baidu.app.utils.addEvent(window, "resize", c)
        }
    }
})();
(function () {
    var a = location.href.match(/(app_width=[0-9]+)|(app_sid=[^&#]+)|(app_cid=[^&#]+)/g) || ["id=jiadeba"];
    a = a.join("&").replace("app_width", "appid");
    a = a.replace(/app_/g, "");
    function c(e, g) {
        var j = "log2_" + (new Date()).getTime();
        var h = window[j] = new Image();
        h.onload = (h.onerror = function () {
            window[j] = null
        });
        if (g) {
            h.src = e
        } else {
            h.src = "http://nsclick.baidu.com/v.gif?pj=app&pid=201&tid=7000&zone=web-list&fm=apppv&" + a + e + "&t=" + (+(new Date()))
        }
    }

    var b = {
        _init: function () {
            baidu.app.addEvent(document, "click", b._clickStats);
            baidu.app.addEvent(document, "click", b._clickLog)
        }, _clickLog: function (g, f) {
            baidu.app.utils.createIframe({method: "sendClickLog"})
        }, _clickStats: function () {
            baidu.app.utils.createStats({click: 1, sendTo: "v.gif"});
            baidu.app.removeEvent(document, "click", b._clickStats)
        }
    };
    b._init();
    var d;
    baidu.app.StatsMgr = b;
    baidu.app.send = function (e) {
        switch (e.type) {
            case"list":
                c("&item=show-list");
                break;
            case"play":
                c("&item=action-play");
                break;
            default:
                d = parseInt(e);
                break
        }
    };
    baidu.app.utils.addEvent(window, "beforeunload", function () {
        d && c("&item=play-pos&tm=" + d);
        d = 0
    });
    baidu.app.utils.addEvent(window, "unload", function () {
        d && c("&item=play-pos&tm=" + d)
    })
})();
(function () {
    var a = {
        show: function () {
            baidu.app.utils.createIframe({method: "adv", flag: 1})
        }, initSearchingHash: function () {
            a.tm = setInterval(function () {
                a.onFinish()
            }, 500)
        }, onFinish: function (c) {
            var b = location.href;
            if (b.indexOf("bd_adv_finish") != -1 || c) {
                clearInterval(a.tm);
                baidu.app.eventCenter.fire("adv:finish");
                baidu.app.eventCenter.clear("adv:finish")
            }
        }
    };
    baidu.app.showAd = a.show;
    baidu.app.hideAd = function () {
        a.onFinish(true)
    };
    baidu.app.sleep = function (c) {
        baidu.app.utils.createIframe({method: "suspend", flag: 1});
        baidu.app.eventCenter.subscribe("adv:finish", function () {
            c && c();
            clearTimeout(b)
        });
        if (baidu.app.advState == 0) {
            a.onFinish(true);
            return
        }
        a.initSearchingHash();
        var b = setTimeout(function () {
            a.onFinish(true)
        }, 7000)
    }
})();
(function () {
    if (location.href.match(/&bd_debug=1/gi) && (document.location.protocol == "http:")) {
        var b = document.createElement("SCRIPT"), c = "utf-8", a = "http://app.baidu.com/static/appstore/monitor_debug.js";
        b.setAttribute("type", "text/javascript");
        b.setAttribute("charset", c);
        b.setAttribute("src", a);
        document.getElementsByTagName("script")[0].parentNode.appendChild(b)
    }
})();