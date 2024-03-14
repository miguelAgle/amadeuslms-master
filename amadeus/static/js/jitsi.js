! function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.JitsiMeetExternalAPI = e() : t.JitsiMeetExternalAPI = e()
}(this, function() {
    return function(t) {
        function e(i) {
            if (n[i]) return n[i].exports;
            var o = n[i] = {
                exports: {},
                id: i,
                loaded: !1
            };
            return t[i].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports
        }
        var n = {};
        return e.m = t, e.c = n, e.p = "/libs/", e(0)
    }([function(t, e, n) {
        (function(e) {
            "use strict";

            function i(t, e) {
                t.send(e)
            }

            function o(t, e) {
                t.numberOfParticipants += e
            }

            function r(t, e, n, i, o, r, s, f) {
                if ((!n || n < l) && (n = l), (!i || i < h) && (i = h), this.parentNode = null, o) this.parentNode = o;
                else {
                    var p = document.scripts[document.scripts.length - 1];
                    this.parentNode = p.parentNode
                }
                this.iframeHolder = this.parentNode.appendChild(document.createElement("div")), this.iframeHolder.id = "jitsiConference" + u, n && (this.iframeHolder.style.width = "100%"), i && (this.iframeHolder.style.height = "100%"), this.frameName = "jitsiConferenceFrame" + u, this.url = f ? "http" : "https://" + t + "/", e && (this.url += e), this.url += "#jitsi_meet_external_api_id=" + u;
                var c;
                if (r)
                    for (c in r) r.hasOwnProperty(c) && "string" == typeof c && (this.url += "&config." + c + "=" + r[c]);
                if (s)
                    for (c in s) s.hasOwnProperty(c) && "string" == typeof c && (this.url += "&interfaceConfig." + c + "=" + s[c]);
                this.frame = document.createElement("iframe"), this.frame.src = this.url, this.frame.name = this.frameName, this.frame.id = this.frameName, this.frame.width = "100%", this.frame.height = "100%", this.frame.setAttribute("allowFullScreen", "true"), this.frame = this.iframeHolder.appendChild(this.frame), this.postis = a({
                    window: this.frame.contentWindow,
                    scope: "jitsi_meet_external_api_" + u
                }), this.eventHandlers = {}, this.postisListeners = {}, this.numberOfParticipants = 1, this._setupListeners(), u++
            }
            var s = n(3).getLogger(e),
                a = n(4),
                l = 790,
                h = 300,
                u = 0,
                f = {
                    displayName: "display-name",
                    toggleAudio: "toggle-audio",
                    toggleVideo: "toggle-video",
                    toggleFilmStrip: "toggle-film-strip",
                    toggleChat: "toggle-chat",
                    toggleContactList: "toggle-contact-list",
                    toggleShareScreen: "toggle-share-screen",
                    hangup: "video-hangup",
                    email: "email",
                    avatarUrl: "avatar-url"
                },
                p = {
                    incomingMessage: "incoming-message",
                    outgoingMessage: "outgoing-message",
                    displayNameChange: "display-name-change",
                    participantJoined: "participant-joined",
                    participantLeft: "participant-left",
                    videoConferenceJoined: "video-conference-joined",
                    videoConferenceLeft: "video-conference-left",
                    readyToClose: "video-ready-to-close"
                };
            r.prototype.executeCommand = function(t) {
                for (var e = arguments.length, n = Array(e > 1 ? e - 1 : 0), o = 1; o < e; o++) n[o - 1] = arguments[o];
                return t in f ? void i(this.postis, {
                    method: f[t],
                    params: n
                }) : void s.error("Not supported command name.")
            }, r.prototype.executeCommands = function(t) {
                for (var e in t) this.executeCommand(e, t[e])
            }, r.prototype.addEventListeners = function(t) {
                for (var e in t) this.addEventListener(e, t[e])
            }, r.prototype.addEventListener = function(t, e) {
                return t in p ? (this.postisListeners[t] || (this.postis.listen(p[t], function(e) {
                    t in this.eventHandlers && "function" == typeof this.eventHandlers[t] && this.eventHandlers[t].call(null, e)
                }.bind(this)), this.postisListeners[t] = !0), void(this.eventHandlers[t] = e)) : void s.error("Not supported event name.")
            }, r.prototype.removeEventListener = function(t) {
                return t in this.eventHandlers ? void delete this.eventHandlers[t] : void s.error("The event " + t + " is not registered.")
            }, r.prototype.removeEventListeners = function(t) {
                for (var e = 0; e < t.length; e++) this.removeEventListener(t[e])
            }, r.prototype.getNumberOfParticipants = function() {
                return this.numberOfParticipants
            }, r.prototype._setupListeners = function() {
                this.postis.listen("participant-joined", o.bind(null, this, 1)), this.postis.listen("participant-left", o.bind(null, this, -1))
            }, r.prototype.dispose = function() {
                this.postis.destroy();
                var t = document.getElementById(this.frameName);
                t && (t.src = "about:blank");
                var e = this;
                window.setTimeout(function() {
                    e.iframeHolder.removeChild(e.frame), e.iframeHolder.parentNode.removeChild(e.iframeHolder)
                }, 10)
            }, t.exports = r
        }).call(e, "modules/API/external/external_api.js")
    }, function(t, e) {
        function n() {
            var t = {
                    methodName: "",
                    fileLocation: "",
                    line: null,
                    column: null
                },
                e = new Error,
                n = e.stack ? e.stack.split("\n") : [];
            if (!n || n.length < 1) return t;
            var i = null;
            return n[3] && (i = n[3].match(/\s*at\s*(.+?)\s*\((\S*)\s*:(\d*)\s*:(\d*)\)/)), !i || i.length <= 4 ? (0 === n[2].indexOf("log@") ? t.methodName = n[3].substr(0, n[3].indexOf("@")) : t.methodName = n[2].substr(0, n[2].indexOf("@")), t) : (t.methodName = i[1], t.fileLocation = i[2], t.line = i[3], t.column = i[4], t)
        }

        function i() {
            var t = arguments[0],
                e = arguments[1],
                i = Array.prototype.slice.call(arguments, 2);
            if (!(r[e] < t.level))
                for (var o = n(), a = s.concat(t.transports), l = 0; l < a.length; l++) {
                    var h = a[l],
                        u = h[e];
                    u && "function" == typeof u && u.bind(h, t.id ? "[" + t.id + "]" : "", "<" + o.methodName + ">: ").apply(h, i)
                }
        }

        function o(t, e, n, o) {
            this.id = e, this.format = o, this.transports = n, this.transports || (this.transports = []), this.level = r[t];
            for (var s = Object.keys(r), a = 0; a < s.length; a++) this[s[a]] = i.bind(null, this, s[a])
        }
        var r = {
            trace: 0,
            debug: 1,
            info: 2,
            log: 3,
            warn: 4,
            error: 5
        };
        o.consoleTransport = console;
        var s = [o.consoleTransport];
        o.addGlobalTransport = function(t) {
            s.indexOf(t) === -1 && s.push(t)
        }, o.removeGlobalTransport = function(t) {
            var e = s.indexOf(t);
            e !== -1 && s.splice(e, 1)
        }, o.prototype.setLevel = function(t) {
            this.level = r[t]
        }, t.exports = o, o.levels = {
            TRACE: "trace",
            DEBUG: "debug",
            INFO: "info",
            LOG: "log",
            WARN: "warn",
            ERROR: "error"
        }
    }, function(t, e, n) {
        function i(t, e) {
            this.logStorage = t, this.stringifyObjects = !(!e || !e.stringifyObjects) && e.stringifyObjects, this.storeInterval = e && e.storeInterval ? e.storeInterval : 3e4, this.maxEntryLength = e && e.maxEntryLength ? e.maxEntryLength : 1e4, Object.keys(o.levels).forEach(function(t) {
                var e = o.levels[t];
                this[e] = function(t) {
                    this._log.apply(this, arguments)
                }.bind(this, t)
            }.bind(this)), this.storeLogsIntervalID = null, this.queue = [], this.totalLen = 0, this.outputCache = []
        }
        var o = n(1);
        i.prototype.stringify = function(t) {
            try {
                return JSON.stringify(t)
            } catch (t) {
                return "[object with circular refs?]"
            }
        }, i.prototype.formatLogMessage = function(t) {
            for (var e = "", n = 1, i = arguments.length; n < i; n++) {
                var r = arguments[n];
                !this.stringifyObjects && t !== o.levels.ERROR || "object" != typeof r || (r = this.stringify(r)), e += r, n != i - 1 && (e += " ")
            }
            return e.length ? e : null
        }, i.prototype._log = function() {
            var t = this.formatLogMessage.apply(this, arguments);
            if (t) {
                var e = this.queue.length ? this.queue[this.queue.length - 1] : void 0,
                    n = "object" == typeof e ? e.text : e;
                n == t ? "object" == typeof e ? e.count += 1 : this.queue[this.queue.length - 1] = {
                    text: t,
                    count: 2
                } : (this.queue.push(t), this.totalLen += t.length)
            }
            this.totalLen >= this.maxEntryLength && this._flush(!0, !0)
        }, i.prototype.start = function() {
            this._reschedulePublishInterval()
        }, i.prototype._reschedulePublishInterval = function() {
            this.storeLogsIntervalID && (window.clearTimeout(this.storeLogsIntervalID), this.storeLogsIntervalID = null), this.storeLogsIntervalID = window.setTimeout(this._flush.bind(this, !1, !0), this.storeInterval)
        }, i.prototype.flush = function() {
            this._flush(!1, !0)
        }, i.prototype._flush = function(t, e) {
            this.totalLen > 0 && (this.logStorage.isReady() || t) && (this.logStorage.isReady() ? (this.outputCache.length && (this.outputCache.forEach(function(t) {
                this.logStorage.storeLogs(t)
            }.bind(this)), this.outputCache = []), this.logStorage.storeLogs(this.queue)) : this.outputCache.push(this.queue), this.queue = [], this.totalLen = 0), e && this._reschedulePublishInterval()
        }, i.prototype.stop = function() {
            this._flush(!1, !1)
        }, t.exports = i
    }, function(t, e, n) {
        var i = n(1),
            o = n(2),
            r = {},
            s = [],
            a = i.levels.TRACE;
        t.exports = {
            addGlobalTransport: function(t) {
                i.addGlobalTransport(t)
            },
            removeGlobalTransport: function(t) {
                i.removeGlobalTransport(t)
            },
            getLogger: function(t, e, n) {
                var o = new i(a, t, e, n);
                return t ? (r[t] = r[t] || [], r[t].push(o)) : s.push(o), o
            },
            setLogLevelById: function(t, e) {
                for (var n = e ? r[e] || [] : s, i = 0; i < n.length; i++) n[i].setLevel(t)
            },
            setLogLevel: function(t) {
                a = t;
                for (var e = 0; e < s.length; e++) s[e].setLevel(t);
                for (var n in r) {
                    var i = r[n] || [];
                    for (e = 0; e < i.length; e++) i[e].setLevel(t)
                }
            },
            levels: i.levels,
            LogCollector: o
        }
    }, function(t, e) {
        function n(t) {
            var e, n = t.scope,
                i = t.window,
                o = t.windowForEventListening || window,
                r = {},
                s = [],
                a = {},
                l = !1,
                h = "__ready__",
                u = function(t) {
                    var e;
                    try {
                        e = JSON.parse(t.data)
                    } catch (t) {
                        return
                    }
                    if (e.postis && e.scope === n) {
                        var i = r[e.method];
                        if (i)
                            for (var o = 0; o < i.length; o++) i[o].call(null, e.params);
                        else a[e.method] = a[e.method] || [], a[e.method].push(e.params)
                    }
                };
            o.addEventListener("message", u, !1);
            var f = {
                    listen: function(t, e) {
                        r[t] = r[t] || [], r[t].push(e);
                        var n = a[t];
                        if (n)
                            for (var i = r[t], o = 0; o < i.length; o++)
                                for (var s = 0; s < n.length; s++) i[o].call(null, n[s]);
                        delete a[t]
                    },
                    send: function(t) {
                        var e = t.method;
                        (l || t.method === h) && i && "function" == typeof i.postMessage ? i.postMessage(JSON.stringify({
                            postis: !0,
                            scope: n,
                            method: e,
                            params: t.params
                        }), "*") : s.push(t)
                    },
                    ready: function(t) {
                        l ? t() : setTimeout(function() {
                            f.ready(t)
                        }, 50)
                    },
                    destroy: function(t) {
                        clearInterval(e), l = !1, o && "function" == typeof o.removeEventListener && o.removeEventListener("message", u), t && t()
                    }
                },
                p = +new Date + Math.random() + "";
            return e = setInterval(function() {
                f.send({
                    method: h,
                    params: p
                })
            }, 50), f.listen(h, function(t) {
                if (t === p) {
                    clearInterval(e), l = !0;
                    for (var n = 0; n < s.length; n++) f.send(s[n]);
                    s = []
                } else f.send({
                    method: h,
                    params: t
                })
            }), f
        }
        t.exports = n
    }])
});
//# sourceMappingURL=external_api.min.map
