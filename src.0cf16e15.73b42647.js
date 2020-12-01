// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src.0cf16e15.js":[function(require,module,exports) {
var define;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

parcelRequire = function (e, r, t, n) {
  var i,
      o = "function" == typeof parcelRequire && parcelRequire,
      u = "function" == typeof require && require;

  function f(t, n) {
    if (!r[t]) {
      if (!e[t]) {
        var i = "function" == typeof parcelRequire && parcelRequire;
        if (!n && i) return i(t, !0);
        if (o) return o(t, !0);
        if (u && "string" == typeof t) return u(t);
        var c = new Error("Cannot find module '" + t + "'");
        throw c.code = "MODULE_NOT_FOUND", c;
      }

      p.resolve = function (r) {
        return e[t][1][r] || r;
      }, p.cache = {};
      var l = r[t] = new f.Module(t);
      e[t][0].call(l.exports, p, l, l.exports, this);
    }

    return r[t].exports;

    function p(e) {
      return f(p.resolve(e));
    }
  }

  f.isParcelRequire = !0, f.Module = function (e) {
    this.id = e, this.bundle = f, this.exports = {};
  }, f.modules = e, f.cache = r, f.parent = o, f.register = function (r, t) {
    e[r] = [function (e, r) {
      r.exports = t;
    }, {}];
  };

  for (var c = 0; c < t.length; c++) {
    try {
      f(t[c]);
    } catch (e) {
      i || (i = e);
    }
  }

  if (t.length) {
    var l = f(t[t.length - 1]);
    "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = l : "function" == typeof define && define.amd ? define(function () {
      return l;
    }) : n && (this[n] = l);
  }

  if (parcelRequire = f, i) throw i;
  return f;
}({
  "GxDM": [function (require, module, exports) {
    var define;
    var t;
    !function () {
      function n(t, n, i) {
        return t.call.apply(t.bind, arguments);
      }

      function i(t, n, i) {
        if (!t) throw Error();

        if (2 < arguments.length) {
          var e = Array.prototype.slice.call(arguments, 2);
          return function () {
            var i = Array.prototype.slice.call(arguments);
            return Array.prototype.unshift.apply(i, e), t.apply(n, i);
          };
        }

        return function () {
          return t.apply(n, arguments);
        };
      }

      function e(t, o, a) {
        return (e = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? n : i).apply(null, arguments);
      }

      var o = Date.now || function () {
        return +new Date();
      };

      function a(t, n) {
        this.a = t, this.o = n || t, this.c = this.o.document;
      }

      var s = !!window.FontFace;

      function r(t, n, i, e) {
        if (n = t.c.createElement(n), i) for (var o in i) {
          i.hasOwnProperty(o) && ("style" == o ? n.style.cssText = i[o] : n.setAttribute(o, i[o]));
        }
        return e && n.appendChild(t.c.createTextNode(e)), n;
      }

      function f(t, n, i) {
        (t = t.c.getElementsByTagName(n)[0]) || (t = document.documentElement), t.insertBefore(i, t.lastChild);
      }

      function c(t) {
        t.parentNode && t.parentNode.removeChild(t);
      }

      function h(t, n, i) {
        n = n || [], i = i || [];

        for (var e = t.className.split(/\s+/), o = 0; o < n.length; o += 1) {
          for (var a = !1, s = 0; s < e.length; s += 1) {
            if (n[o] === e[s]) {
              a = !0;
              break;
            }
          }

          a || e.push(n[o]);
        }

        for (n = [], o = 0; o < e.length; o += 1) {
          for (a = !1, s = 0; s < i.length; s += 1) {
            if (e[o] === i[s]) {
              a = !0;
              break;
            }
          }

          a || n.push(e[o]);
        }

        t.className = n.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "");
      }

      function l(t, n) {
        for (var i = t.className.split(/\s+/), e = 0, o = i.length; e < o; e++) {
          if (i[e] == n) return !0;
        }

        return !1;
      }

      function u(t, n, i) {
        function e() {
          h && o && a && (h(c), h = null);
        }

        n = r(t, "link", {
          rel: "stylesheet",
          href: n,
          media: "all"
        });
        var o = !1,
            a = !0,
            c = null,
            h = i || null;
        s ? (n.onload = function () {
          o = !0, e();
        }, n.onerror = function () {
          o = !0, c = Error("Stylesheet failed to load"), e();
        }) : setTimeout(function () {
          o = !0, e();
        }, 0), f(t, "head", n);
      }

      function p(t, n, i, e) {
        var o = t.c.getElementsByTagName("head")[0];

        if (o) {
          var a = r(t, "script", {
            src: n
          }),
              s = !1;
          return a.onload = a.onreadystatechange = function () {
            s || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (s = !0, i && i(null), a.onload = a.onreadystatechange = null, "HEAD" == a.parentNode.tagName && o.removeChild(a));
          }, o.appendChild(a), setTimeout(function () {
            s || (s = !0, i && i(Error("Script load timeout")));
          }, e || 5e3), a;
        }

        return null;
      }

      function g() {
        this.a = 0, this.c = null;
      }

      function d(t) {
        return t.a++, function () {
          t.a--, w(t);
        };
      }

      function v(t, n) {
        t.c = n, w(t);
      }

      function w(t) {
        0 == t.a && t.c && (t.c(), t.c = null);
      }

      function m(t) {
        this.a = t || "-";
      }

      function y(t, n) {
        this.c = t, this.f = 4, this.a = "n";
        var i = (n || "n4").match(/^([nio])([1-9])$/i);
        i && (this.a = i[1], this.f = parseInt(i[2], 10));
      }

      function b(t) {
        var n = [];
        t = t.split(/,\s*/);

        for (var i = 0; i < t.length; i++) {
          var e = t[i].replace(/['"]/g, "");
          -1 != e.indexOf(" ") || /^\d/.test(e) ? n.push("'" + e + "'") : n.push(e);
        }

        return n.join(",");
      }

      function x(t) {
        return t.a + t.f;
      }

      function j(t) {
        var n = "normal";
        return "o" === t.a ? n = "oblique" : "i" === t.a && (n = "italic"), n;
      }

      function _(t) {
        var n = 4,
            i = "n",
            e = null;
        return t && ((e = t.match(/(normal|oblique|italic)/i)) && e[1] && (i = e[1].substr(0, 1).toLowerCase()), (e = t.match(/([1-9]00|normal|bold)/i)) && e[1] && (/bold/i.test(e[1]) ? n = 7 : /[1-9]00/.test(e[1]) && (n = parseInt(e[1].substr(0, 1), 10)))), i + n;
      }

      function k(t, n) {
        this.c = t, this.f = t.o.document.documentElement, this.h = n, this.a = new m("-"), this.j = !1 !== n.events, this.g = !1 !== n.classes;
      }

      function T(t) {
        if (t.g) {
          var n = l(t.f, t.a.c("wf", "active")),
              i = [],
              e = [t.a.c("wf", "loading")];
          n || i.push(t.a.c("wf", "inactive")), h(t.f, i, e);
        }

        S(t, "inactive");
      }

      function S(t, n, i) {
        t.j && t.h[n] && (i ? t.h[n](i.c, x(i)) : t.h[n]());
      }

      function C() {
        this.c = {};
      }

      function A(t, n) {
        this.c = t, this.f = n, this.a = r(this.c, "span", {
          "aria-hidden": "true"
        }, this.f);
      }

      function N(t) {
        f(t.c, "body", t.a);
      }

      function E(t) {
        return "display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" + b(t.c) + ";font-style:" + j(t) + ";font-weight:" + t.f + "00;";
      }

      function W(t, n, i, e, o, a) {
        this.g = t, this.j = n, this.a = e, this.c = i, this.f = o || 3e3, this.h = a || void 0;
      }

      function F(t, n, i, e, o, a, s) {
        this.v = t, this.B = n, this.c = i, this.a = e, this.s = s || "BESbswy", this.f = {}, this.w = o || 3e3, this.u = a || null, this.m = this.j = this.h = this.g = null, this.g = new A(this.c, this.s), this.h = new A(this.c, this.s), this.j = new A(this.c, this.s), this.m = new A(this.c, this.s), t = E(t = new y(this.a.c + ",serif", x(this.a))), this.g.a.style.cssText = t, t = E(t = new y(this.a.c + ",sans-serif", x(this.a))), this.h.a.style.cssText = t, t = E(t = new y("serif", x(this.a))), this.j.a.style.cssText = t, t = E(t = new y("sans-serif", x(this.a))), this.m.a.style.cssText = t, N(this.g), N(this.h), N(this.j), N(this.m);
      }

      m.prototype.c = function (t) {
        for (var n = [], i = 0; i < arguments.length; i++) {
          n.push(arguments[i].replace(/[\W_]+/g, "").toLowerCase());
        }

        return n.join(this.a);
      }, W.prototype.start = function () {
        var t = this.c.o.document,
            n = this,
            i = o(),
            e = new Promise(function (e, a) {
          !function s() {
            o() - i >= n.f ? a() : t.fonts.load(function (t) {
              return j(t) + " " + t.f + "00 300px " + b(t.c);
            }(n.a), n.h).then(function (t) {
              1 <= t.length ? e() : setTimeout(s, 25);
            }, function () {
              a();
            });
          }();
        }),
            a = null,
            s = new Promise(function (t, i) {
          a = setTimeout(i, n.f);
        });
        Promise.race([s, e]).then(function () {
          a && (clearTimeout(a), a = null), n.g(n.a);
        }, function () {
          n.j(n.a);
        });
      };
      var I = {
        D: "serif",
        C: "sans-serif"
      },
          O = null;

      function P() {
        if (null === O) {
          var t = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);
          O = !!t && (536 > parseInt(t[1], 10) || 536 === parseInt(t[1], 10) && 11 >= parseInt(t[2], 10));
        }

        return O;
      }

      function B(t, n, i) {
        for (var e in I) {
          if (I.hasOwnProperty(e) && n === t.f[I[e]] && i === t.f[I[e]]) return !0;
        }

        return !1;
      }

      function L(t) {
        var n,
            i = t.g.a.offsetWidth,
            a = t.h.a.offsetWidth;
        (n = i === t.f.serif && a === t.f["sans-serif"]) || (n = P() && B(t, i, a)), n ? o() - t.A >= t.w ? P() && B(t, i, a) && (null === t.u || t.u.hasOwnProperty(t.a.c)) ? D(t, t.v) : D(t, t.B) : function (t) {
          setTimeout(e(function () {
            L(this);
          }, t), 50);
        }(t) : D(t, t.v);
      }

      function D(t, n) {
        setTimeout(e(function () {
          c(this.g.a), c(this.h.a), c(this.j.a), c(this.m.a), n(this.a);
        }, t), 0);
      }

      function $(t, n, i) {
        this.c = t, this.a = n, this.f = 0, this.m = this.j = !1, this.s = i;
      }

      F.prototype.start = function () {
        this.f.serif = this.j.a.offsetWidth, this.f["sans-serif"] = this.m.a.offsetWidth, this.A = o(), L(this);
      };

      var q = null;

      function H(t) {
        0 == --t.f && t.j && (t.m ? ((t = t.a).g && h(t.f, [t.a.c("wf", "active")], [t.a.c("wf", "loading"), t.a.c("wf", "inactive")]), S(t, "active")) : T(t.a));
      }

      function M(t) {
        this.j = t, this.a = new C(), this.h = 0, this.f = this.g = !0;
      }

      function z(t, n, i, o, a) {
        var s = 0 == --t.h;
        (t.f || t.g) && setTimeout(function () {
          var t = a || null,
              r = o || {};
          if (0 === i.length && s) T(n.a);else {
            n.f += i.length, s && (n.j = s);
            var f,
                c = [];

            for (f = 0; f < i.length; f++) {
              var l = i[f],
                  u = r[l.c],
                  p = n.a,
                  g = l;
              if (p.g && h(p.f, [p.a.c("wf", g.c, x(g).toString(), "loading")]), S(p, "fontloading", g), p = null, null === q) if (window.FontFace) {
                g = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent);
                var d = /OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent) && /Apple/.exec(window.navigator.vendor);
                q = g ? 42 < parseInt(g[1], 10) : !d;
              } else q = !1;
              p = q ? new W(e(n.g, n), e(n.h, n), n.c, l, n.s, u) : new F(e(n.g, n), e(n.h, n), n.c, l, n.s, t, u), c.push(p);
            }

            for (f = 0; f < c.length; f++) {
              c[f].start();
            }
          }
        }, 0);
      }

      function G(t, n) {
        this.c = t, this.a = n;
      }

      function K(t, n) {
        this.c = t, this.a = n;
      }

      function R(t, n) {
        this.c = t || U, this.a = [], this.f = [], this.g = n || "";
      }

      $.prototype.g = function (t) {
        var n = this.a;
        n.g && h(n.f, [n.a.c("wf", t.c, x(t).toString(), "active")], [n.a.c("wf", t.c, x(t).toString(), "loading"), n.a.c("wf", t.c, x(t).toString(), "inactive")]), S(n, "fontactive", t), this.m = !0, H(this);
      }, $.prototype.h = function (t) {
        var n = this.a;

        if (n.g) {
          var i = l(n.f, n.a.c("wf", t.c, x(t).toString(), "active")),
              e = [],
              o = [n.a.c("wf", t.c, x(t).toString(), "loading")];
          i || e.push(n.a.c("wf", t.c, x(t).toString(), "inactive")), h(n.f, e, o);
        }

        S(n, "fontinactive", t), H(this);
      }, M.prototype.load = function (t) {
        this.c = new a(this.j, t.context || this.j), this.g = !1 !== t.events, this.f = !1 !== t.classes, function (t, n, i) {
          var e = [],
              o = i.timeout;
          !function (t) {
            t.g && h(t.f, [t.a.c("wf", "loading")]), S(t, "loading");
          }(n);

          var e = function (t, n, i) {
            var e,
                o = [];

            for (e in n) {
              if (n.hasOwnProperty(e)) {
                var a = t.c[e];
                a && o.push(a(n[e], i));
              }
            }

            return o;
          }(t.a, i, t.c),
              a = new $(t.c, n, o);

          for (t.h = e.length, n = 0, i = e.length; n < i; n++) {
            e[n].load(function (n, i, e) {
              z(t, a, n, i, e);
            });
          }
        }(this, new k(this.c, t), t);
      }, G.prototype.load = function (t) {
        var n = this,
            i = n.a.projectId,
            e = n.a.version;

        if (i) {
          var o = n.c.o;
          p(this.c, (n.a.api || "https://fast.fonts.net/jsapi") + "/" + i + ".js" + (e ? "?v=" + e : ""), function (e) {
            e ? t([]) : (o["__MonotypeConfiguration__" + i] = function () {
              return n.a;
            }, function n() {
              if (o["__mti_fntLst" + i]) {
                var e,
                    a = o["__mti_fntLst" + i](),
                    s = [];
                if (a) for (var r = 0; r < a.length; r++) {
                  var f = a[r].fontfamily;
                  null != a[r].fontStyle && null != a[r].fontWeight ? (e = a[r].fontStyle + a[r].fontWeight, s.push(new y(f, e))) : s.push(new y(f));
                }
                t(s);
              } else setTimeout(function () {
                n();
              }, 50);
            }());
          }).id = "__MonotypeAPIScript__" + i;
        } else t([]);
      }, K.prototype.load = function (t) {
        var n,
            i,
            e = this.a.urls || [],
            o = this.a.families || [],
            a = this.a.testStrings || {},
            s = new g();

        for (n = 0, i = e.length; n < i; n++) {
          u(this.c, e[n], d(s));
        }

        var r = [];

        for (n = 0, i = o.length; n < i; n++) {
          if ((e = o[n].split(":"))[1]) for (var f = e[1].split(","), c = 0; c < f.length; c += 1) {
            r.push(new y(e[0], f[c]));
          } else r.push(new y(e[0]));
        }

        v(s, function () {
          t(r, a);
        });
      };
      var U = "https://fonts.googleapis.com/css";

      function V(t) {
        this.f = t, this.a = [], this.c = {};
      }

      var X = {
        latin: "BESbswy",
        "latin-ext": "çöüğş",
        cyrillic: "йяЖ",
        greek: "αβΣ",
        khmer: "កខគ",
        Hanuman: "កខគ"
      },
          J = {
        thin: "1",
        extralight: "2",
        "extra-light": "2",
        ultralight: "2",
        "ultra-light": "2",
        light: "3",
        regular: "4",
        book: "4",
        medium: "5",
        "semi-bold": "6",
        semibold: "6",
        "demi-bold": "6",
        demibold: "6",
        bold: "7",
        "extra-bold": "8",
        extrabold: "8",
        "ultra-bold": "8",
        ultrabold: "8",
        black: "9",
        heavy: "9",
        l: "3",
        r: "4",
        b: "7"
      },
          Q = {
        i: "i",
        italic: "i",
        n: "n",
        normal: "n"
      },
          Y = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;

      function Z(t, n) {
        this.c = t, this.a = n;
      }

      var tt = {
        Arimo: !0,
        Cousine: !0,
        Tinos: !0
      };

      function nt(t, n) {
        this.c = t, this.a = n;
      }

      function it(t, n) {
        this.c = t, this.f = n, this.a = [];
      }

      Z.prototype.load = function (t) {
        var n = new g(),
            i = this.c,
            e = new R(this.a.api, this.a.text),
            o = this.a.families;
        !function (t, n) {
          for (var i = n.length, e = 0; e < i; e++) {
            var o = n[e].split(":");
            3 == o.length && t.f.push(o.pop());
            var a = "";
            2 == o.length && "" != o[1] && (a = ":"), t.a.push(o.join(a));
          }
        }(e, o);
        var a = new V(o);
        !function (t) {
          for (var n = t.f.length, i = 0; i < n; i++) {
            var e = t.f[i].split(":"),
                o = e[0].replace(/\+/g, " "),
                a = ["n4"];

            if (2 <= e.length) {
              var s;
              if (s = [], r = e[1]) for (var r, f = (r = r.split(",")).length, c = 0; c < f; c++) {
                var h;
                if ((h = r[c]).match(/^[\w-]+$/)) {
                  if (null == (u = Y.exec(h.toLowerCase()))) h = "";else {
                    if (h = null == (h = u[2]) || "" == h ? "n" : Q[h], null == (u = u[1]) || "" == u) u = "4";else var l = J[u],
                        u = l || (isNaN(u) ? "4" : u.substr(0, 1));
                    h = [h, u].join("");
                  }
                } else h = "";
                h && s.push(h);
              }
              0 < s.length && (a = s), 3 == e.length && (s = [], 0 < (e = (e = e[2]) ? e.split(",") : s).length && (e = X[e[0]]) && (t.c[o] = e));
            }

            for (t.c[o] || (e = X[o]) && (t.c[o] = e), e = 0; e < a.length; e += 1) {
              t.a.push(new y(o, a[e]));
            }
          }
        }(a), u(i, function (t) {
          if (0 == t.a.length) throw Error("No fonts to load!");
          if (-1 != t.c.indexOf("kit=")) return t.c;

          for (var n = t.a.length, i = [], e = 0; e < n; e++) {
            i.push(t.a[e].replace(/ /g, "+"));
          }

          return n = t.c + "?family=" + i.join("%7C"), 0 < t.f.length && (n += "&subset=" + t.f.join(",")), 0 < t.g.length && (n += "&text=" + encodeURIComponent(t.g)), n;
        }(e), d(n)), v(n, function () {
          t(a.a, a.c, tt);
        });
      }, nt.prototype.load = function (t) {
        var n = this.a.id,
            i = this.c.o;
        n ? p(this.c, (this.a.api || "https://use.typekit.net") + "/" + n + ".js", function (n) {
          if (n) t([]);else if (i.Typekit && i.Typekit.config && i.Typekit.config.fn) {
            n = i.Typekit.config.fn;

            for (var e = [], o = 0; o < n.length; o += 2) {
              for (var a = n[o], s = n[o + 1], r = 0; r < s.length; r++) {
                e.push(new y(a, s[r]));
              }
            }

            try {
              i.Typekit.load({
                events: !1,
                classes: !1,
                async: !0
              });
            } catch (f) {}

            t(e);
          }
        }, 2e3) : t([]);
      }, it.prototype.load = function (t) {
        var n = this.f.id,
            i = this.c.o,
            e = this;
        n ? (i.__webfontfontdeckmodule__ || (i.__webfontfontdeckmodule__ = {}), i.__webfontfontdeckmodule__[n] = function (n, i) {
          for (var o = 0, a = i.fonts.length; o < a; ++o) {
            var s = i.fonts[o];
            e.a.push(new y(s.name, _("font-weight:" + s.weight + ";font-style:" + s.style)));
          }

          t(e.a);
        }, p(this.c, (this.f.api || "https://f.fontdeck.com/s/css/js/") + function (t) {
          return t.o.location.hostname || t.a.location.hostname;
        }(this.c) + "/" + n + ".js", function (n) {
          n && t([]);
        })) : t([]);
      };
      var et = new M(window);
      et.a.c.custom = function (t, n) {
        return new K(n, t);
      }, et.a.c.fontdeck = function (t, n) {
        return new it(n, t);
      }, et.a.c.monotype = function (t, n) {
        return new G(n, t);
      }, et.a.c.typekit = function (t, n) {
        return new nt(n, t);
      }, et.a.c.google = function (t, n) {
        return new Z(n, t);
      };
      var ot = {
        load: e(et.load, et)
      };
      "function" == typeof t && t.amd ? t(function () {
        return ot;
      }) : "undefined" != typeof module && module.exports ? module.exports = ot : (window.WebFont = ot, window.WebFontConfig && et.load(window.WebFontConfig));
    }();
  }, {}],
  "y8wP": [function (require, module, exports) {
    "use strict";

    function t(t) {
      return fetch(t).then(function (t) {
        var e = t.headers.get("content-type");
        if (e && (e.includes("text/csv") || e.includes("application/octet-stream"))) return t.ok ? t.text() : Promise.reject(t.status);
        throw new TypeError("Oops, we haven't got CSV!");
      });
    }

    function e(t, e) {
      e = e || ",";

      for (var o = t.split("\n"), r = [], s = o[0].split(e).length - 1; s >= 0; s--) {
        r.push([]);
      }

      s = 0;

      for (var n = o.length; s < n; s++) {
        if (o[s].length) for (var a = o[s].split(e), c = a.length - 1; c >= 0; c--) {
          r[c].push(a[c]);
        }
      }

      return r;
    }

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.csvToCols = exports.customLoadDataFromCsv = void 0, exports.customLoadDataFromCsv = t, exports.csvToCols = e;
  }, {}],
  "nPxR": [function (require, module, exports) {
    var define;
    var global = arguments[3];
    var i,
        t = arguments[3];
    !function (t) {
      function n(i, t, n, e, s) {
        this._listener = t, this._isOnce = n, this.context = e, this._signal = i, this._priority = s || 0;
      }

      function e(i, t) {
        if ("function" != typeof i) throw new Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}", t));
      }

      function s() {
        this._bindings = [], this._prevParams = null;
        var i = this;

        this.dispatch = function () {
          s.prototype.dispatch.apply(i, arguments);
        };
      }

      n.prototype = {
        active: !0,
        params: null,
        execute: function execute(i) {
          var t, n;
          return this.active && this._listener && (n = this.params ? this.params.concat(i) : i, t = this._listener.apply(this.context, n), this._isOnce && this.detach()), t;
        },
        detach: function detach() {
          return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
        },
        isBound: function isBound() {
          return !!this._signal && !!this._listener;
        },
        isOnce: function isOnce() {
          return this._isOnce;
        },
        getListener: function getListener() {
          return this._listener;
        },
        getSignal: function getSignal() {
          return this._signal;
        },
        _destroy: function _destroy() {
          delete this._signal, delete this._listener, delete this.context;
        },
        toString: function toString() {
          return "[SignalBinding isOnce:" + this._isOnce + ", isBound:" + this.isBound() + ", active:" + this.active + "]";
        }
      }, s.prototype = {
        VERSION: "1.0.0",
        memorize: !1,
        _shouldPropagate: !0,
        active: !0,
        _registerListener: function _registerListener(i, t, e, s) {
          var r,
              o = this._indexOfListener(i, e);

          if (-1 !== o) {
            if ((r = this._bindings[o]).isOnce() !== t) throw new Error("You cannot add" + (t ? "" : "Once") + "() then add" + (t ? "Once" : "") + "() the same listener without removing the relationship first.");
          } else r = new n(this, i, t, e, s), this._addBinding(r);

          return this.memorize && this._prevParams && r.execute(this._prevParams), r;
        },
        _addBinding: function _addBinding(i) {
          var t = this._bindings.length;

          do {
            --t;
          } while (this._bindings[t] && i._priority <= this._bindings[t]._priority);

          this._bindings.splice(t + 1, 0, i);
        },
        _indexOfListener: function _indexOfListener(i, t) {
          for (var n, e = this._bindings.length; e--;) {
            if ((n = this._bindings[e])._listener === i && n.context === t) return e;
          }

          return -1;
        },
        has: function has(i, t) {
          return -1 !== this._indexOfListener(i, t);
        },
        add: function add(i, t, n) {
          return e(i, "add"), this._registerListener(i, !1, t, n);
        },
        addOnce: function addOnce(i, t, n) {
          return e(i, "addOnce"), this._registerListener(i, !0, t, n);
        },
        remove: function remove(i, t) {
          e(i, "remove");

          var n = this._indexOfListener(i, t);

          return -1 !== n && (this._bindings[n]._destroy(), this._bindings.splice(n, 1)), i;
        },
        removeAll: function removeAll() {
          for (var i = this._bindings.length; i--;) {
            this._bindings[i]._destroy();
          }

          this._bindings.length = 0;
        },
        getNumListeners: function getNumListeners() {
          return this._bindings.length;
        },
        halt: function halt() {
          this._shouldPropagate = !1;
        },
        dispatch: function dispatch(i) {
          if (this.active) {
            var t,
                n = Array.prototype.slice.call(arguments),
                e = this._bindings.length;

            if (this.memorize && (this._prevParams = n), e) {
              t = this._bindings.slice(), this._shouldPropagate = !0;

              do {
                e--;
              } while (t[e] && this._shouldPropagate && !1 !== t[e].execute(n));
            }
          }
        },
        forget: function forget() {
          this._prevParams = null;
        },
        dispose: function dispose() {
          this.removeAll(), delete this._bindings, delete this._prevParams;
        },
        toString: function toString() {
          return "[Signal active:" + this.active + " numListeners:" + this.getNumListeners() + "]";
        }
      };
      var r = s;
      r.Signal = s, "function" == typeof i && i.amd ? i(function () {
        return r;
      }) : "undefined" != typeof module && module.exports ? module.exports = r : t.signals = r;
    }(this);
  }, {}],
  "vCld": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Point = void 0;

    var t = function () {
      function t(t, i) {
        this.x = t, this.y = i;
      }

      return t.prototype.findDist = function (t) {
        return Math.sqrt((this.x - t.x) * (this.x - t.x) + (this.y - t.y) * (this.y - t.y));
      }, t.prototype.findDistX = function (t) {
        return Math.abs(this.x - t.x);
      }, t;
    }();

    exports.Point = t;
  }, {}],
  "nW7D": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Rectangle = void 0;

    var t = function () {
      function t(t, e, i, r) {
        this.x1 = t, this.y1 = e, this.x2 = i, this.y2 = r, this.updateCoords(t, e, i, r);
      }

      return Object.defineProperty(t.prototype, "width", {
        get: function get() {
          return Math.abs(this.x1 - this.x2);
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(t.prototype, "height", {
        get: function get() {
          return Math.abs(this.y1 - this.y2);
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(t.prototype, "zeroX", {
        get: function get() {
          return this.x1;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(t.prototype, "zeroY", {
        get: function get() {
          return this.y2;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(t.prototype, "midX", {
        get: function get() {
          return this.x1 + .5 * Math.abs(this.x2 - this.x1);
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(t.prototype, "midY", {
        get: function get() {
          return this.y1 + .5 * Math.abs(this.y2 - this.y1);
        },
        enumerable: !1,
        configurable: !0
      }), t.prototype.updateCoords = function (t, e, i, r) {
        this.x1 = t, this.y1 = e, this.x2 = i, this.y2 = r;
      }, t.prototype.countDistBetweenRects = function (t, e) {
        switch (t) {
          case "vertical":
            return this.y1 - e.y2;

          case "horizontal":
            return this.x1 - e.x2;
        }
      }, t.prototype.move = function (t, e) {
        this.x1 = this.x1 + t, this.y1 = this.y1 + e, this.x2 = this.x2 + t, this.y2 = this.y2 + e;
      }, t;
    }();

    exports.Rectangle = t;
  }, {}],
  "eUOa": [function (require, module, exports) {
    var i = function i(_i, t, e, o) {
      if (!_i || !t) throw new Error("Must pass in `canvas` and `context`.");
      var a = e || _i.width || _i.clientWidth,
          n = o || _i.height || _i.clientHeight,
          r = window.devicePixelRatio || 1,
          c = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1,
          d = r / c;
      return r !== c && (_i.width = Math.round(a * d), _i.height = Math.round(n * d), _i.style.width = a + "px", _i.style.height = n + "px", t.scale(d, d)), d;
    };

    "undefined" != typeof window && (window.canvasDpiScaler = i), module.exports = i;
  }, {}],
  "Z1aF": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Canvas = void 0;

    var t = require("signals"),
        e = require("./Point"),
        i = require("./Rectangle"),
        s = require("canvas-dpi-scaler"),
        o = function () {
      function o(e) {
        for (var i = this, s = [], o = 1; o < arguments.length; o++) {
          s[o - 1] = arguments[o];
        }

        this.isSquare = !1, this.lineWidth = 1, this.color = "black", this.onPaddingsSetted = new t.Signal(), this.mouseMoved = new t.Signal(), this.mouseOuted = new t.Signal(), this.touchEnded = new t.Signal(), this.resized = new t.Signal(), this.container = e, this.canvas = document.createElement("canvas"), this.canvas.style.position = "absolute", this.top = 0, this.right = 0, this.bottom = 0, this.left = 0, this.container.appendChild(this.canvas), this._ctx = this.canvas.getContext("2d"), this.clear = this.clear.bind(this), window.addEventListener("resize", function () {
          i.resize();
        }), this.setPaddings.apply(this, s), this.resize();
      }

      return o.prototype.turnOnListenres = function () {
        var t = this;
        this.canvas.addEventListener("mousemove", function (i) {
          t.mouseCoords = t.getMouseCoords(i), t.inDrawArea ? t.mouseMoved.dispatch() : (t.mouseCoords = new e.Point(t.viewport.x2, t.viewport.zeroY), t.mouseOuted.dispatch());
        }), this.canvas.addEventListener("mouseleave", function (i) {
          t.mouseCoords = new e.Point(t.viewport.x2, t.viewport.zeroY), t.mouseOuted.dispatch();
        }), this.canvas.addEventListener("touchmove", function (i) {
          t.mouseCoords = t.getTouchCoords(i), t.inDrawArea ? t.mouseMoved.dispatch() : (t.mouseCoords = new e.Point(t.viewport.x2, t.viewport.zeroY), t.mouseOuted.dispatch());
        }), this.canvas.addEventListener("touchend", function (i) {
          t.mouseCoords = new e.Point(t.viewport.x2, t.viewport.zeroY), t.touchEnded.dispatch();
        }), this.mouseCoords = new e.Point(this.viewport.x2, this.viewport.zeroY);
      }, o.prototype.addOnPage = function () {
        this.container.appendChild(this.canvas);
      }, Object.defineProperty(o.prototype, "inDrawArea", {
        get: function get() {
          return !(this.mouseCoords.x < 0) && !(this.mouseCoords.x > this.viewport.width) && !(this.mouseCoords.y < 0) && !(this.mouseCoords.y > this.viewport.height);
        },
        enumerable: !1,
        configurable: !0
      }), o.prototype.setPaddings = function () {
        for (var t = [], i = 0; i < arguments.length; i++) {
          t[i] = arguments[i];
        }

        switch (t.length) {
          case 0:
            this.top = 50, this.right = 50, this.bottom = 50, this.left = 50;
            break;

          case 1:
            this.top = t[0], this.right = 50, this.bottom = 50, this.left = 50;
            break;

          case 2:
            this.top = t[0], this.right = t[1], this.bottom = t[0], this.left = t[1];
            break;

          case 3:
            this.top = t[0], this.right = t[1], this.bottom = t[2], this.left = 50;
            break;

          case 4:
            this.top = t[0], this.right = t[1], this.bottom = t[2], this.left = t[3];
        }

        this.mouseCoords = new e.Point(this.viewport.x2, this.viewport.zeroY), this.onPaddingsSetted.dispatch();
      }, Object.defineProperty(o.prototype, "ctx", {
        get: function get() {
          return this._ctx;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(o.prototype, "squareRes", {
        set: function set(t) {
          this.isSquare = t, this.resize();
        },
        enumerable: !1,
        configurable: !0
      }), o.prototype.resize = function () {
        if (this.isSquare) {
          var t = this.container.getBoundingClientRect().width,
              e = this.container.getBoundingClientRect().height;
          this.width = Math.min(t, e), this.height = Math.min(t, e);
        } else this.width = this.container.getBoundingClientRect().width, this.height = this.container.getBoundingClientRect().height;

        this.canvas.width = this.width, this.canvas.height = this.height, this.canvas.style.width = this.width.toString() + "px", this.canvas.style.height = this.height.toString() + "px", s(this.canvas, this._ctx, this.width, this.height), this.resized.dispatch();
      }, o.prototype.clear = function () {
        this._ctx && this._ctx.clearRect(0, 0, this.width, this.height);
      }, Object.defineProperty(o.prototype, "viewport", {
        get: function get() {
          return new i.Rectangle(this.left, this.top, this.width - this.right, this.height - this.bottom);
        },
        enumerable: !1,
        configurable: !0
      }), o.prototype.drawVp = function () {
        var t = this.viewport;
        this.ctx.rect(t.x1, t.y1, t.width, t.height), this.ctx && (this.ctx.strokeStyle = this.color, this.ctx.fillStyle = this.color, this.ctx.lineWidth = this.lineWidth), this.ctx.stroke();
      }, o.prototype.getMouseCoords = function (t) {
        var i = this.canvas.getBoundingClientRect();
        return new e.Point(t.clientX - i.left - this.viewport.x1, t.clientY - i.top - this.viewport.y1);
      }, o.prototype.getTouchCoords = function (t) {
        var i = t.touches[0].clientX,
            s = t.touches[0].clientY,
            o = this.canvas.getBoundingClientRect();
        return new e.Point(i - o.left - this.viewport.x1, s - o.top - this.viewport.y1);
      }, o.prototype.clipCanvas = function () {
        var t = this.viewport,
            e = new Path2D();
        e.rect(t.x1, t.y1, t.width, t.height), this._ctx.clip(e);
      }, o;
    }();

    exports.Canvas = o;
  }, {
    "signals": "nPxR",
    "./Point": "vCld",
    "./Rectangle": "nW7D",
    "canvas-dpi-scaler": "eUOa"
  }],
  "UETv": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Data = void 0;

    var t = function () {
      function t() {
        this.seriesStorage = [];
      }

      return t.prototype.findExtremes = function (t, e, i) {
        var n = [],
            r = [];
        return this.seriesStorage.forEach(function (a) {
          var o;
          o = void 0 !== e && void 0 !== i ? a.getDataRange(t, e, i) : a.seriesData;
          var s = a.findExtremes(o);

          switch (t) {
            case "ind":
              r.push(s[2]), n.push(s[3]);
              break;

            case "val":
              r.push(s[0]), n.push(s[1]);
          }
        }), [Math.min.apply(Math, r), Math.max.apply(Math, n)];
      }, t.prototype.findSeriesById = function (t) {
        var e = this.seriesStorage.filter(function (e) {
          return e.id === t;
        });
        return 0 !== e.length ? e[0] : null;
      }, t.prototype.switchAllSeriesAnimation = function (t, e) {
        this.seriesStorage.forEach(function (i, n) {
          i.hasAnimation = t, e && (i.animationDuration = e);
        });
      }, t.prototype.changeAllSeriesAnimationTimeFunction = function (t) {
        this.seriesStorage.forEach(function (e, i) {
          e.timeFunc = t;
        });
      }, t;
    }();

    exports.Data = t;
  }, {}],
  "TL4g": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Label = void 0;

    var t = require("./Point"),
        i = require("signals"),
        o = require("./Rectangle"),
        e = function () {
      function e(t) {
        switch (this.display = !0, this.color = "black", this.color_counter = 0, this.font = "16px serif", this.fontSize = 16, this.position = "bottom", this.offset = 0, this.rotationAngle = 0, this.isUpperCase = !1, this.hasOutline = !1, this.onOptionsSetted = new i.Signal(), t) {
          case "vertical":
            this.position = "left";
            break;

          case "horizontal":
            this.position = "bottom";
        }
      }

      return e.prototype.setOptions = function (t, i, o, e, s, n) {
        return this.color = i || "black", this.position = o || "bottom", this.offset = e || 0, this.display = t, n && (this.colorArr = n, this.color_counter = 0), s && (this.font = s[0] + "px " + s[1], this.fontSize = +s[0]), this.onOptionsSetted.dispatch(), this;
      }, e.prototype.setOutline = function (t) {
        this.hasOutline = !0, this.outlineOptions = t;
      }, e.prototype.setOffset = function (t, i) {
        this.offsetX = t, this.offsetY = i, this.onOptionsSetted.dispatch();
      }, e.prototype.addOffset = function (t) {
        if (this.offsetX && this.offsetY) t.y = t.y - this.offsetY, t.x = t.x + this.offsetX;else switch (this.position) {
          case "top":
            t.y = t.y - this.offset - .5 * this.fontSize;
            break;

          case "bottom":
            t.y = t.y + this.offset + .5 * this.fontSize;
            break;

          case "left":
            t.x = t.x - this.offset;
            break;

          case "right":
            t.x = t.x + this.offset;
        }
      }, e.prototype.draw = function (i, o, e) {
        this.colorArr ? (i.fillStyle = this.colorArr[this.color_counter], this.color_counter = this.color_counter + 1, this.color_counter == this.colorArr.length && (this.color_counter = 0)) : i.fillStyle = this.color, i.font = this.font, i.textBaseline = "middle", this.isUpperCase && "string" == typeof e && (e = e.toUpperCase());
        var s = i.measureText(e),
            n = new t.Point(o.x - .5 * s.width, o.y);
        this.addOffset(n);
        var r = e;
        this.units && (r = e + this.units), 0 !== this.rotationAngle ? (i.save(), i.translate(n.x + .5 * s.width, n.y + .5 * this.fontSize), i.rotate(Math.PI / 180 * this.rotationAngle), i.translate(-n.x - .5 * s.width, -n.y - .5 * this.fontSize), i.fillText(r, n.x, n.y), i.restore()) : (this.hasOutline && this.drawOutline(i, n, r), i.fillText(r, n.x, n.y));
      }, e.prototype.drawOutline = function (t, i, o) {
        this.outlineOptions && (t.lineWidth = this.outlineOptions.width, t.strokeStyle = this.outlineOptions.color, t.strokeText(o, i.x, i.y));
      }, e.prototype.getlabelRect = function (i, e, s) {
        i.font = this.font;
        var n = i.measureText(s),
            r = new t.Point(e.x - .5 * n.width, e.y);
        this.addOffset(r);
        var h = 0;
        return -1 !== this.font.indexOf("Transcript Pro") && (h = 2), new o.Rectangle(r.x, r.y - .5 * this.fontSize, r.x + n.width, r.y + .5 * this.fontSize - h);
      }, e;
    }();

    exports.Label = e;
  }, {
    "./Point": "vCld",
    "signals": "nPxR",
    "./Rectangle": "nW7D"
  }],
  "uGaW": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Tooltip = void 0;

    var t = require("./Rectangle"),
        i = require("./Point"),
        e = require("./Label"),
        o = function () {
      function o(t, i) {
        for (var o = [], s = 2; s < arguments.length; s++) {
          o[s - 2] = arguments[s];
        }

        this._id = t, this.type = i, this._options = {
          lineWidth: 1,
          lineColor: "#000000",
          brushColor: "#000000",
          mainSize: 2,
          lineDash: []
        }, this.label = new e.Label(), this.setOptions(o);
      }

      return Object.defineProperty(o.prototype, "id", {
        get: function get() {
          return this._id;
        },
        enumerable: !1,
        configurable: !0
      }), o.prototype.setOptions = function (t) {
        switch (this.type) {
          case "circle_series":
            this._options.lineWidth = t[0], this._options.lineColor = t[1], this._options.brushColor = t[2], this._options.mainSize = t[3];
            break;

          case "line_vertical_full":
          case "line_horizontal_end":
            this._options.lineWidth = t[0], this._options.lineColor = t[1], this._options.lineDash = t[2];
            break;

          case "label_x_start":
            this._options.lineWidth = t[0], this._options.lineColor = t[1], this._options.brushColor = t[2], this._options.mainSize = t[3], this.labels = t[4];
            break;

          case "circle_y_end":
          case "data_y_end":
          case "delta_abs":
            this._options.lineWidth = t[0], this._options.lineColor = t[1], this._options.brushColor = t[2], this._options.mainSize = t[3];
            break;

          case "data_label":
            this._options.lineWidth = t[0], this._options.lineColor = t[1], this._options.brushColor = t[2], this.labels = t[3];
        }
      }, o.prototype.drawTooltip = function (t, i, e, o, s, n) {
        switch (this.type) {
          case "circle_series":
            this.drawCircleSeries(t, e);
            break;

          case "line_vertical_full":
            this.drawLineVerticalFull(t, i, e);
            break;

          case "line_horizontal_end":
            this.drawLineHorizontalEnd(t, i, e);
            break;

          case "label_x_start":
            this.drawLabelXStart(t, i, e, o, s);
            break;

          case "circle_y_end":
            this.drawCircleYEnd(t, i, e);
            break;

          case "data_y_end":
            return this.drawDataYEnd(t, i, e, o, n);

          case "delta_abs":
            this.drawDeltaAbs(t, i, e, o);
            break;

          case "data_label":
            this.drawDataLabel(t, i, e, o, s);
        }
      }, o.prototype.drawDataLabel = function (e, o, s, n, l) {
        e.strokeStyle = this._options.lineColor, e.lineWidth = this._options.lineWidth, e.fillStyle = this._options.brushColor, e.setLineDash(this._options.lineDash);
        var a = new i.Point(s.x, s.y);
        this.label.position = "top";
        s.x;
        var h = this.labels[l] + "; x: " + n.x.toFixed(1) + "; y: " + n.y.toFixed(1),
            r = this._options.mainSize,
            y = this.label.getlabelRect(e, a, h),
            p = new t.Rectangle(y.x1 - 6, y.y1 - 6, y.x2 + 6, y.y2 + 6);
        p.x2 > o.x2 && (a.x = a.x - Math.abs(p.x2 - o.x2) - 6, y = this.label.getlabelRect(e, a, h), p = new t.Rectangle(y.x1 - 6, y.y1 - 6, y.x2 + 6, y.y2 + 6)), p.x1 < o.x1 && (a.x = a.x + Math.abs(p.x1 - o.x1) + 6, y = this.label.getlabelRect(e, a, h), p = new t.Rectangle(y.x1 - 6, y.y1 - 6, y.x2 + 6, y.y2 + 6)), p.y1 < o.y1 && (this.label.position = "bottom", y = this.label.getlabelRect(e, a, h), p = new t.Rectangle(y.x1 - 6, y.y1 - 6, y.x2 + 6, y.y2 + 6)), this.roundRect(e, p.x1, p.y1, p.width, p.height, r), e.fill(), e.stroke(), this.label.draw(e, a, h);
      }, o.prototype.drawCircleSeries = function (t, i) {
        t.strokeStyle = this._options.lineColor, t.lineWidth = this._options.lineWidth, t.fillStyle = this._options.brushColor, t.setLineDash(this._options.lineDash), t.beginPath(), t.arc(i.x, i.y, this._options.mainSize, 0, 2 * Math.PI, !0), t.closePath(), t.fill(), t.stroke();
      }, o.prototype.drawLineVerticalFull = function (t, i, e) {
        t.strokeStyle = this._options.lineColor, t.lineWidth = this._options.lineWidth, t.setLineDash(this._options.lineDash), t.beginPath(), t.moveTo(e.x, i.y1), t.lineTo(e.x, i.zeroY), t.stroke(), t.setLineDash([]);
      }, o.prototype.drawLineHorizontalEnd = function (t, i, e) {
        t.strokeStyle = this._options.lineColor, t.lineWidth = this._options.lineWidth, t.setLineDash(this._options.lineDash), t.beginPath(), t.moveTo(e.x, e.y), t.lineTo(i.x2, e.y), t.stroke(), t.setLineDash([]);
      }, o.prototype.drawLabelXStart = function (e, o, s, n, l) {
        e.strokeStyle = this._options.lineColor, e.lineWidth = this._options.lineWidth, e.fillStyle = this._options.brushColor, e.setLineDash(this._options.lineDash);
        var a = this.labels[l].toLocaleDateString("en"),
            h = this._options.mainSize,
            r = new i.Point(s.x, o.zeroY),
            y = this.label.getlabelRect(e, r, a),
            p = new i.Point(r.x, y.y1 + .5 * y.height),
            x = new t.Rectangle(p.x - 30, p.y - 6 - .5 * y.height, p.x + 30, p.y + 6 + .5 * y.height);
        return x.x1 < o.x1 && (r.x = r.x + o.x1 - x.x1, x.move(0, o.x1 - x.x1)), x.x2 > o.x2 && (r.x = r.x - (x.x2 - o.x2), x.move(0, -x.x2 + o.x2)), p = new i.Point(r.x, y.y1 + .5 * y.height), x = new t.Rectangle(p.x - 30, p.y - 6 - .5 * y.height, p.x + 30, p.y + 6 + .5 * y.height), this.roundRect(e, x.x1, x.y1, x.width, x.height, h), e.fill(), e.stroke(), this.label.draw(e, r, a), x;
      }, o.prototype.roundRect = function (t, i, e, o, s, n) {
        t.beginPath(), t.moveTo(i + n, e), t.lineTo(i + o - n, e), t.quadraticCurveTo(i + o, e, i + o, e + n), t.lineTo(i + o, e + s - n), t.quadraticCurveTo(i + o, e + s, i + o - n, e + s), t.lineTo(i + n, e + s), t.quadraticCurveTo(i, e + s, i, e + s - n), t.lineTo(i, e + n), t.quadraticCurveTo(i, e, i + n, e), t.closePath();
      }, o.prototype.drawCircleYEnd = function (t, i, e) {
        t.strokeStyle = this._options.lineColor, t.lineWidth = this._options.lineWidth, t.fillStyle = this._options.brushColor, t.setLineDash(this._options.lineDash), t.beginPath(), t.arc(i.x2, e.y, this._options.mainSize, 0, 2 * Math.PI, !0), t.closePath(), t.fill(), t.stroke();
      }, o.prototype.drawDataYEnd = function (e, o, s, n, l) {
        var a = new i.Point(s.x, s.y);
        e.strokeStyle = this._options.lineColor, e.lineWidth = this._options.lineWidth, e.fillStyle = this._options.brushColor, e.setLineDash(this._options.lineDash);
        var h = n.y.toFixed(1) + "%",
            r = this._options.mainSize;
        this.label.position = "right";
        var y = new i.Point(o.x2, a.y),
            p = this.label.getlabelRect(e, y, h),
            x = new i.Point(p.x1, p.y1),
            d = new i.Point(p.x1 + .5 * p.width, y.y),
            c = new t.Rectangle(d.x - 20, x.y - 6, d.x + 20, x.y + p.height + 6);
        return c.y1 < o.y1 && (y.y = y.y + o.y1 - c.y1, a.y = y.y, c.move(0, o.y1 - c.y1)), c.y2 > o.y2 && (y.y = y.y - (c.y2 - o.y2), a.y = y.y, c.move(0, -c.y2 + o.y2)), this.roundRect(e, c.x1, c.y1, c.width, c.height, r), l && (e.fill(), e.stroke(), this.label.draw(e, y, h)), c;
      }, o.prototype.drawDeltaAbs = function (e, o, s, n) {
        e.strokeStyle = this._options.lineColor, e.lineWidth = this._options.lineWidth, e.fillStyle = this._options.brushColor, e.setLineDash(this._options.lineDash);
        var l = new i.Point(s.x, s.y);
        this.label.position = "right";
        var a = s.x;
        l.y = l.y - 25;
        var h = "Δ " + n.y.toFixed(1) + "pp",
            r = this._options.mainSize,
            y = this.label.getlabelRect(e, l, h),
            p = new i.Point(y.x1, y.y1),
            x = new i.Point(y.x1 + .5 * y.width, l.y),
            d = new t.Rectangle(x.x - 26, p.y - 6, x.x + 26, p.y + y.height + 6);
        d.x2 > o.x2 && (l.x = l.x - d.x2 + o.x2, d.move(-d.x2 + o.x2, 0)), d.x1 < a && (l.x = a, this.label.position = "left", y = this.label.getlabelRect(e, l, h), p = new i.Point(y.x2, y.y1), d = new t.Rectangle(p.x - y.width - 6, p.y - 6, p.x + 6, p.y + y.height + 6)), d.y1 < o.y1 && (l.y = l.y + o.y1 - d.y1, d.move(0, o.y1 - d.y1)), this.roundRect(e, d.x1, d.y1, d.width, d.height, r), e.fill(), e.stroke(), this.label.draw(e, l, h);
      }, o;
    }();

    exports.Tooltip = o;
  }, {
    "./Rectangle": "nW7D",
    "./Point": "vCld",
    "./Label": "TL4g"
  }],
  "vyAQ": [function (require, module, exports) {
    "use strict";

    var t = this && this.__spreadArrays || function () {
      for (var t = 0, o = 0, i = arguments.length; o < i; o++) {
        t += arguments[o].length;
      }

      var e = Array(t),
          n = 0;

      for (o = 0; o < i; o++) {
        for (var r = arguments[o], s = 0, a = r.length; s < a; s++, n++) {
          e[n] = r[s];
        }
      }

      return e;
    };

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Plot = void 0;

    var o = require("./Point"),
        i = require("./Tooltip"),
        e = require("./Label"),
        n = function () {
      function n(t, o) {
        for (var i = [], n = 2; n < arguments.length; n++) {
          i[n - 2] = arguments[n];
        }

        return this._id = t, this.type = o, this._options = {
          lineWidth: .5,
          lineColor: "#000000",
          brushColor: "#000000",
          mainSize: 1,
          fontSize: 10,
          char: "1",
          lineDash: []
        }, this.setOptions(i), this.tooltips = [], this.label = new e.Label(this.type), this;
      }

      return n.prototype.setOptions = function (t) {
        switch (this.type) {
          case "dotted":
            this._options.lineWidth = t[0], this._options.lineColor = t[1], this._options.brushColor = t[2], this._options.mainSize = t[3];
            break;

          case "line":
            this._options.lineWidth = t[0], this._options.lineColor = t[1], this._options.lineDash = t[2];
            break;

          case "area":
          case "area_bottom":
            this._options.lineWidth = t[0], this._options.lineColor = t[1], this._options.brushColor = t[2];
            break;

          case "unicode":
            this._options.fontSize = t[0], this._options.brushColor = t[1], this._options.char = t[2];
            break;

          case "text":
            this._options.lineWidth = t[0], this._options.lineColor = t[1];
        }
      }, Object.defineProperty(n.prototype, "id", {
        get: function get() {
          return this._id;
        },
        enumerable: !1,
        configurable: !0
      }), n.prototype.drawPlot = function (t, o, i, e, n) {
        switch (t.strokeStyle = this._options.lineColor, t.lineWidth = this._options.lineWidth, t.globalAlpha = 1, t.fillStyle = this._options.brushColor, this.type) {
          case "dotted":
            this.drawDotted(t, o);
            break;

          case "line":
            this.drawLine(t, o);
            break;

          case "area":
          case "area_bottom":
            this.drawArea(t, o, i);
            break;

          case "unicode":
            this.drawUnicode(t, o, n);
            break;

          case "text":
            this.drawText(t, o, e);
        }
      }, n.prototype.drawDotted = function (t, o) {
        for (var i = 0; i < o.length; i++) {
          t.beginPath(), t.arc(o[i].x, o[i].y, this._options.mainSize, 0, 2 * Math.PI, !0), t.closePath(), t.fill(), t.stroke();
        }
      }, n.prototype.drawUnicode = function (t, o, i) {
        t.font = this._options.fontSize + "px serif", t.textBaseline = "middle";

        for (var e = t.measureText(this._options.char), n = 0; n < o.length; n++) {
          t.globalAlpha = 1, t.fillText(this._options.char, o[n].x - .5 * e.width, o[n].y), i && (t.lineWidth = 7, t.globalAlpha = .3, t.strokeText(this._options.char, o[n].x - .5 * e.width, o[n].y), t.globalAlpha = 1, t.fillText(this._options.char, o[n].x - .5 * e.width, o[n].y));
        }
      }, n.prototype.drawText = function (t, i, e) {
        for (var n = this, r = 0; r < i.length; r++) {
          t.globalAlpha = 1, t.beginPath(), t.setLineDash([]), t.moveTo(i[r].x, i[r].y - 10), t.lineTo(i[r].x, i[r].y - 25), t.stroke();
        }

        var s = function s(r) {
          var s = e[r];
          s || (s = ""), s.split("\\n").forEach(function (e, s, a) {
            var l = new o.Point(i[r].x, i[r].y - (a.length - s - 1) * n.label.fontSize);
            n.label.draw(t, l, e);
          });
        };

        for (r = 0; r < i.length; r++) {
          s(r);
        }
      }, n.prototype.drawLine = function (t, o) {
        t.setLineDash(this._options.lineDash), t.beginPath(), t.moveTo(o[0].x, o[0].y);

        for (var i = 1; i < o.length; i++) {
          t.lineTo(o[i].x, o[i].y);
        }

        t.stroke();
      }, n.prototype.drawArea = function (t, o, i) {
        t.beginPath(), "area_bottom" == this.type && t.lineTo(i.x1, i.zeroY), t.lineTo(o[0].x, o[0].y);

        for (var e = 1; e < o.length; e++) {
          t.lineTo(o[e].x, o[e].y);
        }

        "area_bottom" == this.type && t.lineTo(i.x2, i.zeroY), t.closePath(), t.fill(), t.stroke();
      }, n.prototype.addTooltip = function (o, e) {
        for (var n = [], r = 2; r < arguments.length; r++) {
          n[r - 2] = arguments[r];
        }

        var s = new (i.Tooltip.bind.apply(i.Tooltip, t([void 0, o, e], n)))();
        return this.tooltips.push(s), s;
      }, n.prototype.findTooltipById = function (t) {
        var o = this.tooltips.filter(function (o) {
          return o.id === t;
        });
        return 0 !== o.length ? o[0] : null;
      }, n;
    }();

    exports.Plot = n;
  }, {
    "./Point": "vCld",
    "./Tooltip": "uGaW",
    "./Label": "TL4g"
  }],
  "djXD": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Transformer = void 0;

    var t = require("./Rectangle"),
        r = require("./Point"),
        e = function () {
      function e() {
        this.matrix = [];
      }

      return e.prototype.getPlotRect = function (t, r, e) {
        var i = r.x1 - t.x1,
            n = -(r.y2 - t.y2),
            h = r.width / t.width,
            o = r.height / t.height;
        return i = Math.round(i * e.width / t.width), n = Math.round(n * e.height / t.height), this.matrix = [h, 0, i, 0, o, n], this.transform(e);
      }, e.prototype.getVeiwportCoord = function (t, e, i) {
        var n = i.x - t.x1,
            h = -(i.y - t.y2);
        n = Math.round(n * e.width / t.width), h = Math.round(h * e.height / t.height), this.matrix = [0, 0, n, 0, 0, h];
        var o = this.transform(e);
        return new r.Point(o.zeroX, o.zeroY);
      }, e.prototype.transform = function (r) {
        var e,
            i,
            n,
            h,
            o = [1, 0, 0, 0, 1, 0];
        return this.matrix && (o = this.matrix), e = this.transFunc(0, 0, o.slice(0, 3)) + r.x1, i = this.transFunc(0, 0, o.slice(3)) + r.y1, n = this.transFunc(r.width, r.height, o.slice(0, 3)) + r.x1, h = this.transFunc(r.width, r.height, o.slice(3)) + r.y1, new t.Rectangle(e, i, n, h);
      }, e.prototype.transFunc = function (t, r, e) {
        return e[0] * t + e[1] * r + e[2];
      }, e;
    }();

    exports.Transformer = e;
  }, {
    "./Rectangle": "nW7D",
    "./Point": "vCld"
  }],
  "N6PM": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Ticks = void 0;

    var t = require("signals"),
        e = require("./Point"),
        s = require("./Rectangle"),
        i = require("./Label"),
        a = require("./Transformer"),
        o = function () {
      function o(e) {
        this.display = !1, this.hasCustomLabels = !1, this.hasAnimation = !1, this.animationDuration = 300, this.timeFunc = function (t) {
          return t;
        }, this.linewidth = 2, this.tickSize = 5, this.color = "black", this.lineDash = [], this.onOptionsSetted = new t.Signal(), this.onCustomLabelsAdded = new t.Signal(), this.onCoordsChanged = new t.Signal(), this.coords = [], this.values = [], this.labels = [], this.type = e, this.label = new i.Label(this.type), this.distributionType = "default", this.count = 5, this.step = 100, this.bindChildSignals();
      }

      return o.prototype.switchAnimation = function (t, e) {
        this.hasAnimation = t, e && (this.animationDuration = e);
      }, o.prototype.bindChildSignals = function () {}, o.prototype.setCustomLabels = function (t) {
        this.hasCustomLabels = !0, this.customLabels = t, this.onCustomLabelsAdded.dispatch();
      }, o.prototype.settickDrawOptions = function (t, e, s, i) {
        this.linewidth = e, this.tickSize = t, this.color = s, i && (this.lineDash = i);
      }, o.prototype.setOptions = function (t, e) {
        for (var s = [], i = 2; i < arguments.length; i++) {
          s[i - 2] = arguments[i];
        }

        switch (this.display = t, e) {
          case "default":
          case "fixedCount":
            this.distributionType = e, this.count = s[0];
            break;

          case "fixedStep":
            this.distributionType = e, this.step = s[0];
            break;

          case "customDateTicks":
          case "niceCbhStep":
            this.distributionType = e, 0 !== s.length && (this.customTicksOptions = s[0]);
            break;

          case "midStep":
            this.distributionType = e, this.count = s[0];
            break;

          case "zero":
          case "min":
            this.distributionType = e;
        }

        this.onOptionsSetted.dispatch();
      }, o.prototype.createTicks = function (t, e, s, i, a) {
        var o = [];

        switch (this.distributionType) {
          case "default":
            o = this.generateFixedCountTicks(t, e, s);
            break;

          case "fixedStep":
            o = this.generateFixedStepTicks(t, e, s);
            break;

          case "fixedCount":
            o = this.generateFixedCountTicks(t, e, s);
            break;

          case "customDateTicks":
            o = this.generateCustomDateTicks(t, e, s, i);
            break;

          case "niceCbhStep":
            o = this.generateNiceCbhTicks(t, e, s);
            break;

          case "midStep":
            o = this.generateMidStep(t, e, s);
            break;

          case "zero":
            o = this.generateOneTick(t, e, s, 0);
            break;

          case "min":
            o = this.generateOneTick(t, e, s, t);
        }

        if (this.hasAnimation && !a) {
          var r = this.makeFromPointArr(this.coords, o);
          return 0 == r.length ? (this.coords = o, this.onCoordsChanged.dispatch(), this) : (this.coords = r, this.onCoordsChanged.dispatch(), this.tickCoordAnimation(r, o, this.animationDuration), this);
        }

        this.coords = o, this.onCoordsChanged.dispatch();
      }, o.prototype.generateOneTick = function (t, i, o, r) {
        var n = [];
        this.values = [], this.labels = [];
        var h = [],
            c = new a.Transformer();

        switch (this.type) {
          case "vertical":
            h = [0, t, 1, i];
            break;

          case "horizontal":
            h = [t, 0, i, 1];
        }

        var l = new s.Rectangle(h[0], h[1], h[2], h[3]),
            u = [];

        switch (this.hasCustomLabels ? this.labels.push(this.customLabels[0]) : this.labels.push(r.toFixed(2).toString()), this.type) {
          case "vertical":
            u = [0, r];
            break;

          case "horizontal":
            u = [r, 0];
        }

        var p = new e.Point(u[0], u[1]),
            d = c.getVeiwportCoord(l, o, p);
        return n.push(d), this.values.push(r), n;
      }, o.prototype.generateMidStep = function (t, i, o) {
        var r = [];
        this.values = [], this.labels = [];
        var n = [],
            h = new a.Transformer(),
            c = Math.abs(i - t) / this.count;

        switch (this.type) {
          case "vertical":
            o.height / this.count, n = [0, t, 1, i];
            break;

          case "horizontal":
            o.width / this.count, n = [t, 0, i, 1];
        }

        for (var l = new s.Rectangle(n[0], n[1], n[2], n[3]), u = 0; u <= this.count - 1; u++) {
          var p = [],
              d = t + u * c + .5 * c;

          switch (this.hasCustomLabels ? this.labels.push(this.customLabels[0]) : this.labels.push(d.toFixed(2).toString()), this.type) {
            case "vertical":
              p = [0, d];
              break;

            case "horizontal":
              p = [d, 0];
          }

          var b = new e.Point(p[0], p[1]),
              g = h.getVeiwportCoord(l, o, b);
          r.push(g), this.values.push(d);
        }

        return r;
      }, o.prototype.generateFixedCountTicks = function (t, i, o) {
        var r = [];
        this.values = [], this.labels = [];
        var n = [],
            h = new a.Transformer(),
            c = Math.abs(i - t) / this.count;

        switch (this.type) {
          case "vertical":
            o.height / this.count, n = [0, t, 1, i];
            break;

          case "horizontal":
            o.width / this.count, n = [t, 0, i, 1];
        }

        for (var l = new s.Rectangle(n[0], n[1], n[2], n[3]), u = 0; u <= this.count; u++) {
          var p = [],
              d = t + u * c;

          switch (this.hasCustomLabels ? (d = Math.round(d), this.labels.push(this.customLabels[d])) : this.labels.push(d.toFixed(2).toString()), this.type) {
            case "vertical":
              p = [0, d];
              break;

            case "horizontal":
              p = [d, 0];
          }

          var b = new e.Point(p[0], p[1]),
              g = h.getVeiwportCoord(l, o, b);
          r.push(g), this.values.push(d);
        }

        return r;
      }, o.prototype.generateFixedStepTicks = function (t, i, o, r, n) {
        var h = [];
        this.values = [], this.labels = [];
        var c = [],
            l = this.step;
        r && (l = r);
        var u = new a.Transformer();

        switch (this.type) {
          case "vertical":
            c = [0, t, 1, i];
            break;

          case "horizontal":
            c = [t, 0, i, 1];
        }

        for (var p = new s.Rectangle(c[0], c[1], c[2], c[3]), d = 0; d < i;) {
          if (d >= t && d <= i) {
            var b = [],
                g = d;

            switch (this.hasCustomLabels ? (g = Math.round(d), this.labels.push(this.customLabels[g])) : null !== n ? this.labels.push(g.toFixed(n).toString()) : this.labels.push(g.toFixed(2).toString()), this.type) {
              case "vertical":
                b = [0, g];
                break;

              case "horizontal":
                b = [g, 0];
            }

            var v = new e.Point(b[0], b[1]),
                k = u.getVeiwportCoord(p, o, v);
            h.push(k), this.values.push(g);
          }

          d += l;
        }

        for (d = 0, d -= l; d > t;) {
          if (d >= t && d <= i) {
            b = [], g = d;

            switch (this.hasCustomLabels ? (g = Math.round(d), this.labels.push(this.customLabels[g])) : null !== n ? this.labels.push(g.toFixed(n).toString()) : this.labels.push(g.toFixed(2).toString()), this.type) {
              case "vertical":
                b = [0, g];
                break;

              case "horizontal":
                b = [g, 0];
            }

            v = new e.Point(b[0], b[1]), k = u.getVeiwportCoord(p, o, v);
            h.push(k), this.values.push(g);
          }

          d -= l;
        }

        return h;
      }, o.prototype.generateNiceCbhTicks = function (t, e, s) {
        for (var i = [], a = Math.abs(e - t), o = 0, r = 0; r < this.customTicksOptions.length; r++) {
          i = this.generateFixedStepTicks(t, e, s, this.customTicksOptions[r], 0);
          var n = this.values.reduce(function (t, e) {
            return e > t ? e : t;
          }, this.values[0]);
          Math.abs(n - e) < a && i.length <= 10 && i.length >= 4 && (o = r, a = Math.abs(n - e));
        }

        return i = this.generateFixedStepTicks(t, e, s, this.customTicksOptions[o], 0);
      }, o.prototype.generateCustomDateTicks = function (t, e, s, i) {
        for (var a = [], o = 0; o < this.customTicksOptions.length; o++) {
          var r = this.generateCustomDateTicksByOption(o, t, e, s, i);
          a = r[0];
          var n = r[1],
              h = r[2];
          if (this.checkLabelsOverlap(i, a, h)) return this.values = n, this.labels = h, a;
        }

        return a;
      }, o.prototype.tickCoordAnimation = function (t, s, i) {
        var a = this,
            o = performance.now();
        requestAnimationFrame(function r(n) {
          var h = (n - o) / i,
              c = a.timeFunc(h);
          h > 1 && (h = 1);
          var l = t.map(function (i, a) {
            return new e.Point(t[a].x + (s[a].x - t[a].x) * c, t[a].y + (s[a].y - t[a].y) * c);
          });
          a.coords = l, a.onCoordsChanged.dispatch(), h < 1 ? requestAnimationFrame(r) : (a.coords = s, a.onCoordsChanged.dispatch());
        });
      }, o.prototype.makeFromPointArr = function (t, e) {
        var s = [];
        return e.forEach(function (e) {
          if (0 !== t.length) {
            var i = t.reduce(function (t, s) {
              return t.findDist(e) < s.findDist(e) ? t : s;
            }, t[0]);
            s.push(i);
          }
        }), s;
      }, o.prototype.generateCustomDateTicksByOption = function (t, i, o, r, n) {
        var h = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            c = [],
            l = new a.Transformer();

        switch (this.type) {
          case "vertical":
            c = [0, i, 1, o];
            break;

          case "horizontal":
            c = [i, 0, o, 1];
        }

        var u = new s.Rectangle(c[0], c[1], c[2], c[3]),
            p = [],
            d = [],
            b = [],
            g = [],
            v = 1,
            k = this.customTicksOptions[t];

        switch (k) {
          case "half year":
            v = 2;
            break;

          case "third year":
            v = 3;
            break;

          case "quarter year":
            v = 4;
        }

        for (var f = i + 1; f <= o; f++) {
          var m = this.customLabels[f],
              y = this.customLabels[f - 1];

          if (m.getFullYear() - y.getFullYear() != 0) {
            switch (this.type) {
              case "vertical":
                p = [0, f];
                break;

              case "horizontal":
                p = [f, 0];
            }

            var w = new e.Point(p[0], p[1]),
                T = l.getVeiwportCoord(u, r, w);
            d.push(T), b.push(f), g.push(m.getFullYear());
          } else if (!(this.customTicksOptions[t] === k && m.getMonth() % v || m.getMonth() - y.getMonth() == 0)) {
            switch (this.type) {
              case "vertical":
                p = [0, f];
                break;

              case "horizontal":
                p = [f, 0];
            }

            w = new e.Point(p[0], p[1]), T = l.getVeiwportCoord(u, r, w);
            d.push(T), b.push(f), g.push(h[m.getMonth()]);
          }

          if ("half month" == this.customTicksOptions[t] && 0 !== m.getDay() && 6 !== m.getDay() && ((14 == m.getDate() || 15 == m.getDate() || 16 == m.getDate()) && (1 == m.getDay() || 4 == m.getDay()) || 14 == m.getDate() && 5 == m.getDay())) {
            switch (this.type) {
              case "vertical":
                p = [0, f];
                break;

              case "horizontal":
                p = [f, 0];
            }

            w = new e.Point(p[0], p[1]), T = l.getVeiwportCoord(u, r, w);
            d.push(T), b.push(f), g.push(m.getDate());
          }
        }

        return [d, b, g];
      }, o.prototype.checkLabelsOverlap = function (t, e, s) {
        for (var i = 1; i < e.length; i++) {
          var a = this.label.getlabelRect(t, e[i], s[i]),
              o = this.label.getlabelRect(t, e[i - 1], s[i - 1]);
          if (a.countDistBetweenRects(this.type, o) <= 0) return !1;
        }

        return !0;
      }, o.prototype.draw = function (t, e) {
        var s = this;
        this.coords.forEach(function (e, i) {
          s.display && s.drawTick(t, e), s.label.display && s.label.draw(t, e, s.labels[i]);
        });
      }, o.prototype.drawTick = function (t, e) {
        t.beginPath(), t.strokeStyle = this.color, t.lineWidth = this.linewidth, t.setLineDash(this.lineDash);
        var s = this.tickSize;

        switch (this.type) {
          case "vertical":
            t.moveTo(e.x - s, e.y), t.lineTo(e.x, e.y), t.stroke();
            break;

          case "horizontal":
            t.moveTo(e.x, e.y - s), t.lineTo(e.x, e.y), t.stroke();
        }
      }, o;
    }();

    exports.Ticks = o;
  }, {
    "signals": "nPxR",
    "./Point": "vCld",
    "./Rectangle": "nW7D",
    "./Label": "TL4g",
    "./Transformer": "djXD"
  }],
  "jmLa": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Grid = void 0;

    var t = require("signals"),
        i = function () {
      function i(i) {
        this.display = !1, this.onOptionsSetted = new t.Signal(), this.type = i, this.width = 1, this.color = "black", this.lineDash = [1, 0];
      }

      return i.prototype.setOptions = function (t, i, e, s) {
        this.display = t, this.width = e, this.color = i, this.lineDash = s, this.onOptionsSetted.dispatch();
      }, i.prototype.draw = function (t, i, e) {
        var s = this;
        t.strokeStyle = this.color, t.fillStyle = this.color, t.lineWidth = this.width, t.setLineDash(this.lineDash), e.forEach(function (e) {
          switch (t.beginPath(), s.type) {
            case "vertical":
              t.moveTo(i.x1, e.y), t.lineTo(i.x2, e.y);
              break;

            case "horizontal":
              t.moveTo(e.x, i.y1), t.lineTo(e.x, i.y2);
          }

          t.stroke();
        }), t.setLineDash([]);
      }, i;
    }();

    exports.Grid = i;
  }, {
    "signals": "nPxR"
  }],
  "ffzu": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Axis = void 0;

    var t = require("signals"),
        i = require("./Rectangle"),
        s = require("./Ticks"),
        e = require("./Canvas"),
        n = require("./Grid"),
        a = require("./Label"),
        o = require("./Point"),
        r = function () {
      function r(i, o, r) {
        this.display = !1, this.position = "start", this.gridOn = !1, this.customTicks = [], this.legends = [], this.onOptionsSetted = new t.Signal(), this.onMinMaxSetted = new t.Signal(), this.onCustomTicksAdded = new t.Signal(), this.onNameSetted = new t.Signal(), this.min = 0, this.max = 0, this.setMinMax(i), this.type = o, this.label = new a.Label(this.type), this.canvas = new e.Canvas(r), this.canvas.canvas.style.zIndex = "2", this.optionsDraw = {
          lineWidth: 1,
          lineColor: "#000000",
          lineDash: []
        }, this.ticks = new s.Ticks(this.type), this.grid = new n.Grid(this.type), this.bindChildSignals(), this.bindSignals();
      }

      return r.prototype.bindSignals = function () {
        var t = this;
        this.onMinMaxSetted.add(function () {
          t.createTicks(), t.draw();
        }), this.onOptionsSetted.add(function () {
          t.draw();
        }), this.onCustomTicksAdded.add(function () {
          t.createTicks(), t.draw();
        }), this.onNameSetted.add(function () {
          t.draw();
        });
      }, r.prototype.bindChildSignals = function () {
        var t = this;
        this.canvas.resized.add(function () {
          t.createTicks(!0), t.draw();
        }), this.canvas.onPaddingsSetted.add(function () {
          t.createTicks(), t.draw();
        }), this.ticks.onOptionsSetted.add(function () {
          t.createTicks(), t.draw();
        }), this.ticks.onCustomLabelsAdded.add(function () {
          t.createTicks(), t.draw();
        }), this.ticks.onCoordsChanged.add(function () {
          t.draw();
        }), this.label.onOptionsSetted.add(function () {
          t.draw();
        }), this.ticks.label.onOptionsSetted.add(function () {
          t.draw();
        }), this.grid.onOptionsSetted.add(function () {
          t.draw();
        });
      }, Object.defineProperty(r.prototype, "length", {
        get: function get() {
          return Math.abs(this.max - this.min);
        },
        enumerable: !1,
        configurable: !0
      }), r.prototype.addLegend = function (t) {
        this.legends.push(t);
      }, r.prototype.setName = function (t, i) {
        return this.name = t, this.namePosition = i, this;
      }, r.prototype.setOptions = function (t, i, s, e) {
        t && (this.position = t), i && (this.optionsDraw.lineWidth = i), s && (this.optionsDraw.lineColor = s), e && (this.optionsDraw.lineDash = e), this.onOptionsSetted.dispatch();
      }, r.prototype.setMinMax = function (t, i) {
        var s = [];

        switch ([this.min, this.max], t.length) {
          case 0:
            s = [0, 100];
            break;

          case 1:
            s = [t[0], 100];
            break;

          case 2:
            s = [t[0], t[1]];
        }

        this.min = s[0], this.max = s[1], this.onMinMaxSetted.dispatch(i);
      }, r.prototype.draw = function () {
        var t = this,
            i = this.canvas.ctx;

        if (i) {
          this.canvas.clear();
          this.axisViewport;
          this.display && this.drawAxis(), this.ticks.draw(i, this.canvas.viewport), this.customTicks.forEach(function (s) {
            s.draw(i, t.canvas.viewport);
          }), this.grid.display && this.grid.draw(i, this.canvas.viewport, this.ticks.coords), this.drawAxisName(), this.legends.forEach(function (s) {
            s.draw(i, t.canvas.viewport);
          });
        }
      }, r.prototype.createTicks = function (t) {
        var i = this,
            s = this.canvas.ctx;
        s && (this.ticks.createTicks(this.min, this.max, this.axisViewport, s, t), this.customTicks.forEach(function (e) {
          e.createTicks(i.min, i.max, i.axisViewport, s, t);
        }));
      }, r.prototype.addCustomTicks = function (t) {
        var i = this;
        t.onCoordsChanged.add(function () {
          i.draw();
        }), this.customTicks.push(t), this.onCustomTicksAdded.dispatch();
      }, Object.defineProperty(r.prototype, "axisViewport", {
        get: function get() {
          var t = this.canvas.viewport,
              s = new i.Rectangle(0, 0, 0, 0);

          switch (this.position) {
            case "start":
              switch (this.type) {
                case "vertical":
                  s = new i.Rectangle(t.x1, t.y1, t.x1, t.y2);
                  break;

                case "horizontal":
                  s = new i.Rectangle(t.x1, t.y2, t.x2, t.y2);
              }

              break;

            case "end":
            case "start":
              switch (this.type) {
                case "vertical":
                  s = new i.Rectangle(t.x2, t.y1, t.x2, t.y2);
                  break;

                case "horizontal":
                  s = new i.Rectangle(t.x1, t.y1, t.x2, t.y1);
              }

          }

          return s;
        },
        enumerable: !1,
        configurable: !0
      }), r.prototype.drawAxis = function () {
        var t = this.canvas.ctx,
            i = this.axisViewport;
        t && (t.strokeStyle = this.optionsDraw.lineColor, t.lineWidth = this.optionsDraw.lineWidth, t.setLineDash(this.optionsDraw.lineDash), t.beginPath(), t.moveTo(i.x1, i.y1), t.lineTo(i.x2, i.y2), t.stroke(), t.setLineDash([]));
      }, r.prototype.drawAxisName = function () {
        var t = this.canvas.ctx,
            i = this.canvas.viewport,
            s = 0,
            e = 0;
        s = "horizontal" == this.type ? i.midX : "start" == this.namePosition ? i.x1 : i.x2, e = "vertical" == this.type ? i.midY : "start" == this.namePosition ? i.y2 : i.y1;
        var n = new o.Point(s, e);
        this.name && t && this.label.draw(t, n, this.name);
      }, r;
    }();

    exports.Axis = r;
  }, {
    "signals": "nPxR",
    "./Rectangle": "nW7D",
    "./Ticks": "N6PM",
    "./Canvas": "Z1aF",
    "./Grid": "jmLa",
    "./Label": "TL4g",
    "./Point": "vCld"
  }],
  "IvRc": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.BackGround = void 0;

    var t = require("./Canvas"),
        e = function () {
      function e(e, a) {
        this.type = "default", this.type = e, this.canvas = new t.Canvas(a), this.canvas.canvas.style.zIndex = "1";
      }

      return e.prototype.draw = function (t, e) {
        switch (this.canvas.clear(), this.type) {
          case "coloredGrid_cbh":
            this.drawColoredGrid(t, e);
        }
      }, e.prototype.drawColoredGrid = function (t, e) {
        var a = this.canvas.ctx;

        if (a) {
          a.globalAlpha = .1;

          for (var r = ["#8CCB76", "#BED68D", "#E7D180", "#CC9263", "#CF5031"], l = 0; l < t.length - 1; l++) {
            a.fillStyle = r[l], a.fillRect(t[l].x, e[0].y, t[l + 1].x - t[l].x, e[e.length - 1].y - e[0].y);
          }

          for (l = 0; l < e.length - 1; l++) {
            a.fillStyle = r[l], a.fillRect(t[0].x, e[l].y, t[t.length - 1].x - t[0].x, e[l + 1].y - e[l].y);
          }

          a.globalAlpha = 1;
        }
      }, e;
    }();

    exports.BackGround = e;
  }, {
    "./Canvas": "Z1aF"
  }],
  "S85J": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.SeriesBase = void 0;

    var t = require("signals"),
        e = require("../Canvas"),
        n = require("../Point"),
        i = require("../Rectangle"),
        r = require("../Transformer"),
        a = function () {
      function a(n, i, r) {
        return this.hasAnimation = !1, this.animationDuration = 300, this.timeFunc = function (t) {
          return t;
        }, this.onPlotDataChanged = new t.Signal(), this.onSeriesDataChanged = new t.Signal(), this.id = n, this.seriesData = this.getInitialData(r), this.extremes = this.findExtremes(), this.plots = [], this.plotData = [], this.canvas = new e.Canvas(i), this.canvas.canvas.style.zIndex = "0", this;
      }

      return a.prototype.bindChildSignals = function () {
        this.canvas.resized.add(function () {});
      }, a.prototype.getInitialData = function (t) {
        var e = [];
        return t.forEach(function (t) {
          var n = [],
              i = [];
          t.forEach(function (t, e) {
            n.push(e), i.push(t);
          }), e.push(n), e.push(i);
        }), e;
      }, a.prototype.setPlotsIds = function () {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        this.plots = t;
      }, a.prototype.findExtremes = function (t) {
        var e = [];
        t && (e = t), t || (e = this.seriesData.slice());
        var n = e[0][0],
            i = e[0][0],
            r = e[1][0],
            a = e[1][0];
        return e.forEach(function (t, e) {
          t.forEach(function (t) {
            switch (e % 2) {
              case 0:
                t < n && (n = t), t > i && (i = t);
                break;

              case 1:
                t < r && (r = t), t > a && (a = t);
            }
          });
        }), [n, i, r, a];
      }, Object.defineProperty(a.prototype, "dataRect", {
        get: function get() {
          var t = this.extremes;
          return new i.Rectangle(t[0], t[2], t[1], t[3]);
        },
        enumerable: !1,
        configurable: !0
      }), a.prototype.getDataRange = function (t, e, n) {
        for (var i = [], r = function r(t) {
          var r = [],
              o = [],
              s = a.seriesData[t].slice(),
              h = a.seriesData[t + 1].slice();
          2 == t && (s = s.slice(), h = h.slice()), s.forEach(function (t, i) {
            t >= e && t <= n && (r.push(s[i]), o.push(h[i]));
          }), i.push(r), i.push(o);
        }, a = this, o = 0; o < this.seriesData.length; o += 2) {
          r(o);
        }

        return i;
      }, a.prototype.replaceSeriesData = function (t) {
        this.seriesData = this.getInitialData(t), this.extremes = this.findExtremes();
      }, a.prototype.getClosestDataPointX = function (t) {
        var e = this,
            i = 0;
        return [this.seriesData[0].reduce(function (r, a, o) {
          var s = new n.Point(a, e.seriesData[1][o]);
          return t.findDistX(s) < t.findDistX(r) ? (i = o, s) : r;
        }, new n.Point(this.seriesData[0][0], this.seriesData[1][0])), i];
      }, a.prototype.getClosestPlotPointX = function (t) {
        var e = this.plotDataArr.reduce(function (e, n, i) {
          return t.findDistX(n) < t.findDistX(e) ? n : e;
        }, this.plotDataArr[0]);
        return new n.Point(e.x, e.y);
      }, a.prototype.getClosestPlotPointXY = function (t) {
        var e = this.plotDataArr.reduce(function (e, n, i) {
          return t.findDist(n) < t.findDist(e) ? n : e;
        }, this.plotDataArr[0]);
        return new n.Point(e.x, e.y);
      }, Object.defineProperty(a.prototype, "plotDataArr", {
        get: function get() {
          for (var t = [], e = 0; e < this.plotData.length; e++) {
            var n = this.plotData[e];
            1 == e && (n = n.slice().reverse()), n.forEach(function (e) {
              t.push(e);
            });
          }

          return t;
        },
        enumerable: !1,
        configurable: !0
      }), a.prototype.updatePlotData = function (t, e, n) {
        var i = this.generatePlotData(t, e);
        if (n) return this.plotData = i, this.onPlotDataChanged.dispatch(this), this;

        if (this.hasAnimation) {
          for (var r = [], a = [], o = 0; o < this.plotData.length; o++) {
            var s = this.plotData[o],
                h = this.makeFromPointArr(s.slice(), i[o].slice());
            r.push(h[0]), a.push(h[1]);
          }

          this.сoordAnimation(r, a, this.animationDuration, i);
        }

        return this.plotData = i, this.onPlotDataChanged.dispatch(this), this;
      }, a.prototype.generatePlotData = function (t, e) {
        for (var i = this.getDataRange("ind", t.x1, t.x2), a = [], o = new r.Transformer(), s = function s(r) {
          var s = [],
              h = i[r],
              u = i[r + 1];
          h.forEach(function (i, r) {
            var a = new n.Point(h[r], u[r]),
                p = o.getVeiwportCoord(t, e, a);
            s.push(new n.Point(Math.round(p.x), Math.round(p.y)));
          }), a.push(s);
        }, h = 0; h < i.length; h += 2) {
          s(h);
        }

        return a;
      }, a.prototype.сoordAnimation = function (t, e, i, r) {
        var a = this,
            o = performance.now();
        requestAnimationFrame(function s(h) {
          var u = (h - o) / i,
              p = a.timeFunc(u);
          u > 1 && (u = 1);
          var c = [];
          t.forEach(function (t, i) {
            var r = t.map(function (r, a) {
              return new n.Point(Math.round(t[a].x + (e[i][a].x - t[a].x) * p), Math.round(t[a].y + (e[i][a].y - t[a].y) * p));
            });
            c.push(r);
          }), a.plotData = c, a.onPlotDataChanged.dispatch(a), u < 1 ? requestAnimationFrame(s) : (a.plotData = r, a.onPlotDataChanged.dispatch(a));
        });
      }, a.prototype.makeFromPointArr = function (t, e) {
        var n = [];
        if (0 == t.length) return n;
        var i = [],
            r = [],
            a = e.slice(),
            o = t.slice();

        if (o.length < a.length) {
          for (var s = Math.floor(a.length / o.length), h = 0, u = 0; h < o.length;) {
            i.push(o[h]), a.shift(), (u += 1) == s && (h += 1, u = 0);
          }

          for (; 0 !== a.length;) {
            i.push(o[o.length - 1]), a.shift();
          }

          return n.push(i), n.push(e), n;
        }

        s = Math.floor(o.length / a.length);
        var p = 0;

        for (u = 0; p < a.length;) {
          r.push(a[p]), o.shift(), (u += 1) == s && (p += 1, u = 0);
        }

        for (; 0 !== o.length;) {
          r.push(a[a.length - 1]), o.shift();
        }

        return n.push(t), n.push(r), n;
      }, a;
    }();

    exports.SeriesBase = a;
  }, {
    "signals": "nPxR",
    "../Canvas": "Z1aF",
    "../Point": "vCld",
    "../Rectangle": "nW7D",
    "../Transformer": "djXD"
  }],
  "chKS": [function (require, module, exports) {
    "use strict";

    var t = this && this.__extends || function () {
      var _t = function t(e, r) {
        return (_t = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (t, e) {
          t.__proto__ = e;
        } || function (t, e) {
          for (var r in e) {
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
          }
        })(e, r);
      };

      return function (e, r) {
        function n() {
          this.constructor = e;
        }

        _t(e, r), e.prototype = null === r ? Object.create(r) : (n.prototype = r.prototype, new n());
      };
    }();

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.SeriesXY = void 0;

    var e = require("../Point"),
        r = require("../Transformer"),
        n = require("./SeriesBase"),
        o = function (n) {
      function o(t, e, r, o) {
        var s = n.call(this, t, e, r) || this;
        return s.plotLabels = [], s.canvas.canvas.style.zIndex = "3", o && (s.labels = o), s;
      }

      return t(o, n), o.prototype.getInitialData = function (t) {
        var e = [],
            r = [],
            n = [];
        return t[0].forEach(function (e, o) {
          r.push(e), n.push(t[1][o]);
        }), e.push(r), e.push(n), e;
      }, o.prototype.generatePlotData = function (t, n) {
        var o = this.getDataRange("ind", t.x1, t.x2),
            s = [],
            a = new r.Transformer(),
            i = [],
            u = o[0],
            p = o[1];
        return u.forEach(function (r, o) {
          var s = new e.Point(u[o], p[o]),
              c = a.getVeiwportCoord(t, n, s);
          i.push(new e.Point(Math.round(c.x), Math.round(c.y)));
        }), s.push(i), s;
      }, o.prototype.getDataRange = function (t, e, r) {
        var n = this,
            o = [];
        this.plotLabels.splice(0, this.plotLabels.length);
        var s = [],
            a = [],
            i = this.seriesData[0].slice(),
            u = this.seriesData[1].slice();
        return i.forEach(function (t, o) {
          t >= e && t <= r && (s.push(i[o]), a.push(u[o]), n.labels && n.plotLabels.push(n.labels[o]));
        }), o.push(s), o.push(a), o;
      }, o;
    }(n.SeriesBase);

    exports.SeriesXY = o;
  }, {
    "../Point": "vCld",
    "../Transformer": "djXD",
    "./SeriesBase": "S85J"
  }],
  "ojD5": [function (require, module, exports) {
    "use strict";

    var a = this && this.__spreadArrays || function () {
      for (var a = 0, t = 0, s = arguments.length; t < s; t++) {
        a += arguments[t].length;
      }

      var i = Array(a),
          e = 0;

      for (t = 0; t < s; t++) {
        for (var n = arguments[t], o = 0, r = n.length; o < r; o++, e++) {
          i[e] = n[o];
        }
      }

      return i;
    };

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Chart = void 0;

    var t = require("./Canvas"),
        s = require("./Data"),
        i = require("./Plot"),
        e = require("./Axis"),
        n = require("./Transformer"),
        o = require("./Rectangle"),
        r = require("./Point"),
        c = require("./BackGround"),
        d = require("signals"),
        h = require("./series/SeriesBase"),
        p = require("./series/SeriesXY"),
        v = function () {
      function v(a, i, n) {
        this.hasBorder = !1, this.clipSeriesCanvas = !1, this.tooltipsDataIndexUpdated = new d.Signal(), this.container = a, this.canvasTT = new t.Canvas(a), this.canvasTT.turnOnListenres(), this.canvasTT.canvas.style.zIndex = "4", this.data = new s.Data(), this.plots = [], this.xAxis = new e.Axis(i, "horizontal", a), this.yAxis = new e.Axis(n, "vertical", a), this.tooltipsDraw = this.tooltipsDraw.bind(this), this.seriesReDraw = this.seriesReDraw.bind(this), this.bindChildSignals(), this.tooltipsDraw(!0);
      }

      return v.prototype.switchResolution = function () {
        this.xAxis.canvas.squareRes = !0, this.yAxis.canvas.squareRes = !0, this.canvasTT.squareRes = !0, this.background && (this.background.canvas.squareRes = !0), this.data.seriesStorage.forEach(function (a, t) {
          a.canvas.squareRes = !0;
        });
      }, v.prototype.bindChildSignals = function () {
        var a = this;
        this.xAxis.onMinMaxSetted.add(function (t) {
          t && a.seriesUpdatePlotData(), a.tooltipsDraw(!0);
        }), this.yAxis.onMinMaxSetted.add(function (t) {
          t && a.seriesUpdatePlotData(), a.tooltipsDraw(!0);
        }), this.canvasTT.mouseMoved.add(this.tooltipsDraw), this.canvasTT.mouseOuted.add(function () {
          a.tooltipsDraw(!0);
        }), this.canvasTT.touchEnded.add(function () {
          a.tooltipsDraw(!0);
        });
      }, Object.defineProperty(v.prototype, "axisRect", {
        get: function get() {
          return new o.Rectangle(this.xAxis.min, this.yAxis.min, this.xAxis.max, this.yAxis.max);
        },
        enumerable: !1,
        configurable: !0
      }), v.prototype.seriesUpdatePlotData = function () {
        var a = this;
        this.data.seriesStorage.forEach(function (t, s) {
          t.updatePlotData(a.axisRect, t.canvas.viewport);
        });
      }, v.prototype.seriesReDraw = function (a) {
        var t = this,
            s = a.canvas;
        s.clear(), this.clipSeriesCanvas && s.clipCanvas(), a.plots.forEach(function (i) {
          var e = t.findPlotById(i);
          e && e.drawPlot(s.ctx, a.plotDataArr, s.viewport, a.plotLabels);
        }), this.tooltipsDraw(!0);
      }, v.prototype.setCanvasPaddings = function () {
        for (var a, t, s, i, e = [], n = 0; n < arguments.length; n++) {
          e[n] = arguments[n];
        }

        (a = this.canvasTT).setPaddings.apply(a, e), (t = this.xAxis.canvas).setPaddings.apply(t, e), (s = this.yAxis.canvas).setPaddings.apply(s, e), this.background && (i = this.background.canvas).setPaddings.apply(i, e), this.data.seriesStorage.forEach(function (a, t) {
          var s;
          (s = a.canvas).setPaddings.apply(s, e);
        });
      }, v.prototype.addBackGround = function (a) {
        var t = this;
        this.background = new c.BackGround(a, this.container), this.xAxis.ticks.onCoordsChanged.add(function () {
          t.backgroundDraw();
        }), this.yAxis.ticks.onCoordsChanged.add(function () {
          t.backgroundDraw();
        }), this.background.canvas.resized.add(function () {
          t.backgroundDraw();
        }), this.backgroundDraw();
      }, v.prototype.backgroundDraw = function () {
        this.background && this.background.draw(this.xAxis.ticks.coords, this.yAxis.ticks.coords);
      }, v.prototype.addPlot = function (t, s) {
        for (var e = [], n = 2; n < arguments.length; n++) {
          e[n - 2] = arguments[n];
        }

        var o = new (i.Plot.bind.apply(i.Plot, a([void 0, t, s], e)))();
        return this.plots.push(o), o;
      }, v.prototype.findPlotById = function (a) {
        var t = this.plots.filter(function (t) {
          return t.id === a;
        });
        return 0 !== t.length ? t[0] : null;
      }, v.prototype.addSeries = function (a, t, s) {
        var i = this,
            e = new p.SeriesXY(a, this.container, t, s);
        return this.data.seriesStorage.push(e), e.canvas.setPaddings(this.canvasTT.top, this.canvasTT.right, this.canvasTT.bottom, this.canvasTT.left), e.updatePlotData(this.axisRect, e.canvas.viewport, !0), e.onPlotDataChanged.add(this.seriesReDraw), e.onSeriesDataChanged.add(function (a) {
          a.updatePlotData(i.axisRect, a.canvas.viewport);
        }), e.canvas.resized.add(function () {
          e.updatePlotData(i.axisRect, e.canvas.viewport, !0);
        }), e.canvas.onPaddingsSetted.add(function () {
          e.updatePlotData(i.axisRect, e.canvas.viewport, !0);
        }), e;
      }, v.prototype.addSeriesRow = function (a, t) {
        var s = this,
            i = new h.SeriesBase(a, this.container, t);
        return this.data.seriesStorage.push(i), i.canvas.setPaddings(this.canvasTT.top, this.canvasTT.right, this.canvasTT.bottom, this.canvasTT.left), i.updatePlotData(this.axisRect, i.canvas.viewport, !0), i.onPlotDataChanged.add(this.seriesReDraw), i.onSeriesDataChanged.add(function (a) {
          a.updatePlotData(s.axisRect, a.canvas.viewport);
        }), i.canvas.resized.add(function () {
          i.updatePlotData(s.axisRect, i.canvas.viewport, !0);
        }), i.canvas.onPaddingsSetted.add(function () {
          i.updatePlotData(s.axisRect, i.canvas.viewport, !0);
        }), i;
      }, v.prototype.switchDataAnimation = function (a, t) {
        this.data.seriesStorage.forEach(function (s, i) {
          s.hasAnimation = a, t && (s.animationDuration = t);
        });
      }, v.prototype.tooltipsDraw = function (a) {
        var t = this;
        this.canvasTT.clear();
        var s = this.canvasTT.mouseCoords,
            i = new n.Transformer(),
            e = [],
            o = [],
            c = [];
        this.data.seriesStorage.forEach(function (n) {
          var d = t.xAxis.min + s.x * t.xAxis.length / t.canvasTT.viewport.width,
              h = t.yAxis.max - s.y * t.yAxis.length / t.canvasTT.viewport.height,
              p = new r.Point(d, h),
              v = n.getClosestDataPointX(p),
              l = v[0],
              u = v[1],
              T = n.getClosestPlotPointX(new r.Point(s.x + t.canvasTT.left, s.y + t.canvasTT.top)),
              w = n.getClosestPlotPointXY(new r.Point(s.x + t.canvasTT.left, s.y + t.canvasTT.top));
          t.tooltipsDataIndexUpdated.dispatch(l.x);
          i.getVeiwportCoord(t.axisRect, t.canvasTT.viewport, l);
          n.plots.forEach(function (s) {
            var i = t.findPlotById(s);
            i && i.tooltips.forEach(function (s) {
              if (a) switch (s.type) {
                case "data_y_end":
                  c.push([s, T, l]);
                  break;

                case "circle_series":
                  s.drawTooltip(t.canvasTT.ctx, t.canvasTT.viewport, new r.Point(T.x, T.y), l);
              } else switch (s.type) {
                case "delta_abs":
                  if (0 == e.length) e.push(l), o.push(T);else {
                    var n = o[0].y < T.y ? o[0] : T,
                        d = new r.Point(Math.abs(l.x - e[0].x), Math.abs(l.y - e[0].y));
                    s.drawTooltip(t.canvasTT.ctx, t.canvasTT.viewport, n, d), e.pop(), o.pop();
                  }
                  break;

                case "data_y_end":
                  c.push([s, T, l]);
                  break;

                case "label_x_start":
                  s.drawTooltip(t.canvasTT.ctx, t.canvasTT.viewport, new r.Point(T.x, T.y), l, u);
                  break;

                case "line_vertical_full":
                  s.drawTooltip(t.canvasTT.ctx, t.canvasTT.viewport, new r.Point(T.x, T.y), l);
                  break;

                case "data_label":
                  s.drawTooltip(t.canvasTT.ctx, t.canvasTT.viewport, new r.Point(w.x, w.y), l, u), "unicode" == i.type && i.drawPlot(t.canvasTT.ctx, [w], t.canvasTT.viewport, !0);
                  break;

                default:
                  s.drawTooltip(t.canvasTT.ctx, t.canvasTT.viewport, new r.Point(T.x, T.y), l);
              }
            });
          });
        }), c.sort(function (a, t) {
          return a[1].y - t[1].y;
        });

        for (var d = 0; d < c.length - 1; d++) {
          var h = c[d][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, c[d][1], c[d][2], 0, !1),
              p = c[d + 1][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, c[d + 1][1], c[d + 1][2], 0, !1);

          if (h.y2 > p.y1) {
            var v = Math.abs(h.y2 - p.y1),
                l = .5 * -v,
                u = .5 * v;
            Math.abs(h.y1 - this.canvasTT.viewport.y1) < Math.abs(l) && (u = v + (l = -Math.abs(h.y1 - this.canvasTT.viewport.y1))), Math.abs(p.y2 - this.canvasTT.viewport.y2) < u && (l = -(v - (u = -Math.abs(h.y2 - this.canvasTT.viewport.y2)))), c[d][1].y = c[d][1].y + l, c[d + 1][1].y = c[d + 1][1].y + u;
          }
        }

        c.forEach(function (a) {
          a[0].drawTooltip(t.canvasTT.ctx, t.canvasTT.viewport, a[1], a[2], 0, !0);
        });
      }, v;
    }();

    exports.Chart = v;
  }, {
    "./Canvas": "Z1aF",
    "./Data": "UETv",
    "./Plot": "vyAQ",
    "./Axis": "ffzu",
    "./Transformer": "djXD",
    "./Rectangle": "nW7D",
    "./Point": "vCld",
    "./BackGround": "IvRc",
    "signals": "nPxR",
    "./series/SeriesBase": "S85J",
    "./series/SeriesXY": "chKS"
  }],
  "Cvim": [function (require, module, exports) {
    var r = 4,
        n = .001,
        t = 1e-7,
        u = 10,
        e = 11,
        o = 1 / (e - 1),
        f = "function" == typeof Float32Array;

    function i(r, n) {
      return 1 - 3 * n + 3 * r;
    }

    function a(r, n) {
      return 3 * n - 6 * r;
    }

    function c(r) {
      return 3 * r;
    }

    function v(r, n, t) {
      return ((i(n, t) * r + a(n, t)) * r + c(n)) * r;
    }

    function l(r, n, t) {
      return 3 * i(n, t) * r * r + 2 * a(n, t) * r + c(n);
    }

    function w(r, n, e, o, f) {
      var i,
          a,
          c = 0;

      do {
        (i = v(a = n + (e - n) / 2, o, f) - r) > 0 ? e = a : n = a;
      } while (Math.abs(i) > t && ++c < u);

      return a;
    }

    function s(n, t, u, e) {
      for (var o = 0; o < r; ++o) {
        var f = l(t, u, e);
        if (0 === f) return t;
        t -= (v(t, u, e) - n) / f;
      }

      return t;
    }

    function y(r) {
      return r;
    }

    module.exports = function (r, t, u, i) {
      if (!(0 <= r && r <= 1 && 0 <= u && u <= 1)) throw new Error("bezier x values must be in [0, 1] range");
      if (r === t && u === i) return y;

      for (var a = f ? new Float32Array(e) : new Array(e), c = 0; c < e; ++c) {
        a[c] = v(c * o, r, u);
      }

      return function (f) {
        return 0 === f ? 0 : 1 === f ? 1 : v(function (t) {
          for (var f = 0, i = 1, c = e - 1; i !== c && a[i] <= t; ++i) {
            f += o;
          }

          var v = f + (t - a[--i]) / (a[i + 1] - a[i]) * o,
              y = l(v, r, u);
          return y >= n ? s(t, v, r, u) : 0 === y ? v : w(t, f, f + o, r, u);
        }(f), t, i);
      };
    };
  }, {}],
  "XIH4": [function (require, module, exports) {
    "use strict";

    var e = this && this.__spreadArrays || function () {
      for (var e = 0, t = 0, s = arguments.length; t < s; t++) {
        e += arguments[t].length;
      }

      var r = Array(e),
          a = 0;

      for (t = 0; t < s; t++) {
        for (var i = arguments[t], c = 0, o = i.length; c < o; c++, a++) {
          r[a] = i[c];
        }
      }

      return r;
    };

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.createChart = exports.chart = void 0;

    var t,
        s,
        r = require("../classes/Chart"),
        a = require("../classes/Ticks"),
        i = [],
        c = [],
        o = [],
        n = .08,
        x = require("bezier-easing"),
        l = x(.65, 0, .35, 1);

    function p(x, p) {
      var d;
      exports.chart = new r.Chart(x, [0, 900], [0, 2e3]), d = e(p), c = d[0], i = d[1], o = d[2], t = d[3], s = d[4], exports.chart.xAxis.setOptions("start", .5, "black"), exports.chart.xAxis.display = !0, exports.chart.xAxis.ticks.display = !0, exports.chart.xAxis.ticks.setCustomLabels(c), exports.chart.xAxis.ticks.setOptions(!0, "customDateTicks", ["half month", "year", "half year", "third year", "quarter year"]), exports.chart.xAxis.ticks.settickDrawOptions(-6, .5, "black"), exports.chart.xAxis.ticks.label.setOptions(!0, "#B2B2B2", "bottom", 11, ["12", '"Transcript Pro"']), exports.chart.xAxis.ticks.label.isUpperCase = !0, exports.chart.xAxis.grid.setOptions(!0, "#B2B2B2", 1, [1, 2]), exports.chart.yAxis.setOptions("end", 1, "#B2B2B2", [1, 2]), exports.chart.yAxis.display = !0, exports.chart.yAxis.position = "end", exports.chart.yAxis.ticks.setOptions(!0, "niceCbhStep", [1, 5, 10, 15, 20, 25, 30]), exports.chart.yAxis.ticks.settickDrawOptions(-50, 1, "#B2B2B2", [1, 2]), exports.chart.yAxis.ticks.label.setOptions(!0, "#B2B2B2", "right", 0, ["12", '"Transcript Pro"']), exports.chart.yAxis.ticks.label.setOffset(30, 10), exports.chart.yAxis.ticks.label.units = "%", exports.chart.yAxis.grid.setOptions(!0, "#B2B2B2", 1, [1, 2]);
      var y = new a.Ticks(exports.chart.yAxis.type);
      y.setOptions(!0, "zero"), y.settickDrawOptions(-50, 1, "#000000", [2, 1]), y.label.display = !1, y.hasAnimation = !0, y.timeFunc = l, exports.chart.yAxis.addCustomTicks(y);
      var A = new a.Ticks(exports.chart.yAxis.type);
      A.setOptions(!0, "min"), A.settickDrawOptions(-50, .5, "black", []), A.label.display = !1, exports.chart.yAxis.addCustomTicks(A), exports.chart.addPlot("black_line", "line", 1, "#000000", []), exports.chart.addPlot("light_gray_area", "area_bottom", 0, "#F2F2F2", "#F2F2F2", 0), exports.chart.addPlot("zero_line", "line", 1, "#000000", [2, 1]), exports.chart.addPlot("labeled", "text", 1, "#000000", "#000000").label.setOptions(!0, "black", "top", 35, ["18", '"Transcript Pro"']).setOutline({
        width: 5,
        color: "white"
      });
      var u = h(i, i[0]),
          b = [t[0], h(t[1], i[0])];
      exports.chart.addSeriesRow("cyberHedge_area", [u]).setPlotsIds("light_gray_area"), exports.chart.addSeriesRow("cyberHedge_line", [u]).setPlotsIds("black_line"), exports.chart.addSeriesRow("zero_line", [o]).setPlotsIds("zero_line"), exports.chart.addSeries("cyberHedge_labels", b, s).setPlotsIds("labeled"), exports.chart.xAxis.setMinMax(exports.chart.data.findExtremes("val"), !1), exports.chart.yAxis.setMinMax(exports.chart.data.findExtremes("ind", exports.chart.xAxis.min, exports.chart.xAxis.max), !1), exports.chart.yAxis.setMinMax([exports.chart.yAxis.min - n * exports.chart.yAxis.length, exports.chart.yAxis.max + n * exports.chart.yAxis.length], !1), exports.chart.xAxis.ticks.switchAnimation(!0, 300), exports.chart.yAxis.ticks.switchAnimation(!0, 300), exports.chart.switchDataAnimation(!0, 300), exports.chart.data.changeAllSeriesAnimationTimeFunction(l), exports.chart.setCanvasPaddings(25, 80, 40, 20);
    }

    function h(e, t) {
      var s = [];
      s = [];

      for (var r = 0, a = e.length; r < a; r++) {
        s.push(100 * (e[r] - t) / t);
      }

      return s;
    }

    function d(e, s, r, a) {
      var i,
          x,
          l,
          p,
          d = h(e, e[s]),
          y = [t[0], h(t[1], e[s])];

      if (null === (i = exports.chart.data.findSeriesById("cyberHedge_area")) || void 0 === i || i.replaceSeriesData([d]), null === (x = exports.chart.data.findSeriesById("cyberHedge_line")) || void 0 === x || x.replaceSeriesData([d]), null === (l = exports.chart.data.findSeriesById("zero_line")) || void 0 === l || l.replaceSeriesData([o]), null === (p = exports.chart.data.findSeriesById("cyberHedge_labels")) || void 0 === p || p.replaceSeriesData(y), a) {
        exports.chart.xAxis.ticks.setCustomLabels(c), exports.chart.xAxis.setMinMax([s, r], !1);
        var A = exports.chart.data.findExtremes("ind", s, r),
            u = Math.abs(A[0] - A[1]);
        exports.chart.yAxis.setMinMax([A[0] - n * u, A[1] + n * u], !0);
      }
    }

    function y(e) {
      return c.reduce(function (t, s, r) {
        return Math.abs(s - e) < Math.abs(c[t] - e) ? r : t;
      }, 0);
    }

    exports.createChart = p, document.querySelectorAll(".ranges_black li").forEach(function (e) {
      e.addEventListener("click", function () {
        document.querySelector(".ranges_black li.selected").classList.remove("selected"), e.classList.add("selected");
        var t = c[c.length - 1],
            s = c.length - 1,
            r = 0;

        switch (e.innerHTML) {
          case "6M":
            r = y(new Date(new Date(t.getTime()).setMonth(t.getMonth() - 6)));
            break;

          case "1Y":
            r = y(new Date(new Date(t.getTime()).setFullYear(t.getFullYear() - 1)));
            break;

          case "2Y":
            r = y(new Date(new Date(t.getTime()).setFullYear(t.getFullYear() - 2)));
            break;

          case "YTD":
            r = y(new Date(new Date(t.getFullYear(), 0, 1).getTime()));
        }

        d(i, r, s, !0);
      });
    });
  }, {
    "../classes/Chart": "ojD5",
    "../classes/Ticks": "N6PM",
    "bezier-easing": "Cvim"
  }],
  "frlZ": [function (require, module, exports) {
    "use strict";

    var e = this && this.__spreadArrays || function () {
      for (var e = 0, t = 0, r = arguments.length; t < r; t++) {
        e += arguments[t].length;
      }

      var a = Array(e),
          s = 0;

      for (t = 0; t < r; t++) {
        for (var i = arguments[t], o = 0, l = i.length; o < l; o++, s++) {
          a[s] = i[o];
        }
      }

      return a;
    };

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.createChart = exports.chart = void 0;

    var t = require("../classes/Chart"),
        r = require("../classes/Ticks"),
        a = require("../scripts/helpers"),
        s = [],
        i = [],
        o = [],
        l = [],
        n = .08,
        d = require("bezier-easing"),
        c = d(.65, 0, .35, 1);

    function p(a, d) {
      var p, h, u, b, v, m, g, A, B, I, k, F, T, P;
      exports.chart = new t.Chart(a, [0, 900], [0, 2e3]), p = e(d), o = p[0], i = p[1], s = p[2], l = p[3], _(o[o.length - 1]), exports.chart.tooltipsDataIndexUpdated.add(f), exports.chart.tooltipsDataIndexUpdated.add(y), exports.chart.xAxis.setOptions("start", .5, "black"), exports.chart.xAxis.ticks.setCustomLabels(o), exports.chart.xAxis.display = !0, exports.chart.xAxis.ticks.setOptions(!0, "customDateTicks", ["half month", "year", "half year", "third year", "quarter year"]), exports.chart.xAxis.ticks.display = !0, exports.chart.xAxis.ticks.settickDrawOptions(-6, .5, "black"), exports.chart.xAxis.ticks.label.setOptions(!0, "#B2B2B2", "bottom", 11, ["12", '"Transcript Pro"']), exports.chart.xAxis.ticks.label.isUpperCase = !0, exports.chart.yAxis.setOptions("end", 1, "#B2B2B2", [1, 2]), exports.chart.yAxis.display = !0, exports.chart.yAxis.position = "end", exports.chart.yAxis.ticks.settickDrawOptions(-50, 1, "#B2B2B2", [1, 2]), exports.chart.yAxis.ticks.setOptions(!0, "niceCbhStep", [1, 5, 10, 15, 20, 25, 30]), exports.chart.yAxis.ticks.label.setOptions(!0, "#B2B2B2", "right", 0, ["12", '"Transcript Pro"']).setOffset(30, 10), exports.chart.yAxis.ticks.label.units = "%", exports.chart.yAxis.grid.setOptions(!0, "#B2B2B2", 1, [1, 2]);
      var S = new r.Ticks(exports.chart.yAxis.type);
      S.setOptions(!0, "zero"), S.settickDrawOptions(-50, 1, "#000000", [2, 1]), S.label.display = !1, S.hasAnimation = !0, S.timeFunc = c, exports.chart.yAxis.addCustomTicks(S);
      var w = new r.Ticks(exports.chart.yAxis.type);
      w.setOptions(!0, "min"), w.settickDrawOptions(-50, .5, "black", []), w.label.display = !1, exports.chart.yAxis.addCustomTicks(w), exports.chart.addPlot("red_line", "line", 1, "#FF2222", []), exports.chart.addPlot("red_area", "area_bottom", 0, "#FFE5E5", "#FFE5E5", 0), exports.chart.addPlot("blue_line", "line", 1, "#0070FF", []), exports.chart.addPlot("blue_area", "area_bottom", 0, "#D9EAFF", "#D9EAFF", 0), exports.chart.addPlot("zero_line", "line", 1, "#000000", [2, 1]), null === (h = exports.chart.findPlotById("blue_line")) || void 0 === h || h.addTooltip("ttId", "line_vertical_full", 1, "#B2B2B2", [1, 2]), null === (u = exports.chart.findPlotById("red_line")) || void 0 === u || u.addTooltip("ttId", "line_horizontal_end", 1, "#B2B2B2", [1, 2]), null === (b = exports.chart.findPlotById("blue_line")) || void 0 === b || b.addTooltip("ttId", "line_horizontal_end", 1, "#B2B2B2", [1, 2]), null === (v = exports.chart.findPlotById("blue_line")) || void 0 === v || v.addTooltip("ttId", "circle_series", 3, "#ffffff", "#0070FF", 4), null === (m = exports.chart.findPlotById("red_line")) || void 0 === m || m.addTooltip("ttId", "circle_series", 3, "#ffffff", "#FF2222", 4), null === (g = exports.chart.findPlotById("black_line")) || void 0 === g || g.addTooltip("ttId", "circle_series", 3, "#ffffff", "black", 4), null === (A = exports.chart.findPlotById("blue_line")) || void 0 === A || A.addTooltip("ttId", "circle_y_end", 3, "#ffffff", "#0070FF", 4), null === (B = exports.chart.findPlotById("red_line")) || void 0 === B || B.addTooltip("ttId", "circle_y_end", 3, "#ffffff", "#FF2222", 4), null === (I = exports.chart.findPlotById("red_line")) || void 0 === I || I.addTooltip("ttId", "label_x_start", .5, "black", "#ebebeb", 4, o).label.setOptions(!0, "black", "bottom", 14, ["12", '"Transcript Pro"']), null === (k = exports.chart.findPlotById("red_line")) || void 0 === k || k.addTooltip("ttId", "data_y_end", .5, "#FF2222", "#FF2222", 4).label.setOptions(!0, "white", "right", 30, ["12", '"Transcript Pro"']), null === (F = exports.chart.findPlotById("blue_line")) || void 0 === F || F.addTooltip("ttId", "data_y_end", .5, "#0070FF", "#0070FF", 4).label.setOptions(!0, "white", "right", 30, ["12", '"Transcript Pro"']), null === (T = exports.chart.findPlotById("red_line")) || void 0 === T || T.addTooltip("delta_1", "delta_abs", .5, "black", "#ebebeb", 4).label.setOptions(!0, "black", "right", 35, ["12", '"Transcript Pro"']), null === (P = exports.chart.findPlotById("blue_line")) || void 0 === P || P.addTooltip("delta_1", "delta_abs", .5, "black", "#ebebeb", 4).label.setOptions(!0, "black", "right", 35, ["12", '"Transcript Pro"']);
      var D = x(i, i[0]),
          M = x(s, s[0]);
      exports.chart.addSeriesRow("cyberHedge5_area", [D]).setPlotsIds("blue_area"), exports.chart.addSeriesRow("cyberHedge1_area", [M]).setPlotsIds("red_area"), exports.chart.addSeriesRow("cyberHedge5_line", [D]).setPlotsIds("blue_line"), exports.chart.addSeriesRow("cyberHedge1_line", [M]).setPlotsIds("red_line"), exports.chart.addSeriesRow("zero_line", [l]).setPlotsIds("zero_line"), exports.chart.xAxis.setMinMax(exports.chart.data.findExtremes("val"), !0), exports.chart.yAxis.setMinMax(exports.chart.data.findExtremes("ind", exports.chart.xAxis.min, exports.chart.xAxis.max), !0), exports.chart.yAxis.setMinMax([exports.chart.yAxis.min - n * exports.chart.yAxis.length, exports.chart.yAxis.max + n * exports.chart.yAxis.length], !0), exports.chart.xAxis.ticks.switchAnimation(!0, 300), exports.chart.yAxis.ticks.switchAnimation(!0, 300), exports.chart.switchDataAnimation(!0, 300), exports.chart.data.changeAllSeriesAnimationTimeFunction(c), exports.chart.setCanvasPaddings(25, 80, 40, 20);
    }

    function x(e, t) {
      var r = [];
      r = [];

      for (var a = 0, s = e.length; a < s; a++) {
        r.push(100 * (e[a] - t) / t);
      }

      return r;
    }

    exports.createChart = p, document.querySelectorAll(".zones_colored li").forEach(function (e) {
      e.addEventListener("click", function () {
        var t = e.querySelector("a");
        document.querySelector(".zones_colored li.selected").classList.remove("selected"), e.classList.add("selected");
        var r = document.querySelector(".ranges_сolored li.selected");
        a.customLoadDataFromCsv(t.href).then(function (e) {
          var t = a.csvToCols(e);
          s = t[2].slice(1).map(function (e) {
            return +e;
          }), i = t[1].slice(1).map(function (e) {
            return +e;
          }), o = t[0].slice(1).map(function (e) {
            return new Date(e);
          }), l = s.map(function () {
            return 0;
          }), _(o[o.length - 1]);
          var n = o.length - 1;
          b(i, s, 0, n, !1), r.click(r);
        });
      });
    }), document.querySelectorAll(".ranges_сolored li").forEach(function (e) {
      e.addEventListener("click", function () {
        document.querySelector(".ranges_сolored li.selected").classList.remove("selected"), e.classList.add("selected");
        var t = o[o.length - 1],
            r = o.length - 1,
            a = 0;

        switch (e.innerHTML) {
          case "6M":
            a = v(new Date(new Date(t.getTime()).setMonth(t.getMonth() - 6)));
            break;

          case "1Y":
            a = v(new Date(new Date(t.getTime()).setFullYear(t.getFullYear() - 1)));
            break;

          case "2Y":
            a = v(new Date(new Date(t.getTime()).setFullYear(t.getFullYear() - 2)));
            break;

          case "YTD":
            a = v(new Date(new Date(t.getFullYear(), 0, 1).getTime()));
        }

        b(i, s, a, r, !0);
      });
    });
    var h = document.getElementById("cbhIdx1-val-colored"),
        u = document.getElementById("cbhIdx5-val-colored");

    function f(e) {
      h && (h.innerHTML = s[e].toFixed(1));
    }

    function y(e) {
      u && (u.innerHTML = i[e].toFixed(1));
    }

    function b(e, t, r, a, s) {
      var i,
          d,
          c,
          p,
          h,
          u = x(e, e[r]),
          f = x(t, t[r]);

      if (null === (i = exports.chart.data.findSeriesById("cyberHedge5_area")) || void 0 === i || i.replaceSeriesData([u]), null === (d = exports.chart.data.findSeriesById("cyberHedge1_area")) || void 0 === d || d.replaceSeriesData([f]), null === (c = exports.chart.data.findSeriesById("cyberHedge5_line")) || void 0 === c || c.replaceSeriesData([u]), null === (p = exports.chart.data.findSeriesById("cyberHedge1_line")) || void 0 === p || p.replaceSeriesData([f]), null === (h = exports.chart.data.findSeriesById("zero_line")) || void 0 === h || h.replaceSeriesData([l]), s) {
        exports.chart.xAxis.ticks.setCustomLabels(o), exports.chart.xAxis.setMinMax([r, a], !1);
        var y = exports.chart.data.findExtremes("ind", r, a),
            b = Math.abs(y[0] - y[1]);
        exports.chart.yAxis.setMinMax([y[0] - n * b, y[1] + n * b], !0);
      }
    }

    function _(e) {
      var t = document.querySelector(".last-update-colored time");
      t.datetime = e.toISOString(), t.innerHTML = [e.getDate(), e.toLocaleString("en-US", {
        month: "long"
      }), e.getFullYear()].join(" ");
    }

    function v(e) {
      return o.reduce(function (t, r, a) {
        return Math.abs(r - e) < Math.abs(o[t] - e) ? a : t;
      }, 0);
    }
  }, {
    "../classes/Chart": "ojD5",
    "../classes/Ticks": "N6PM",
    "../scripts/helpers": "y8wP",
    "bezier-easing": "Cvim"
  }],
  "unV5": [function (require, module, exports) {
    "use strict";

    var e = this && this.__spreadArrays || function () {
      for (var e = 0, t = 0, r = arguments.length; t < r; t++) {
        e += arguments[t].length;
      }

      var a = Array(e),
          s = 0;

      for (t = 0; t < r; t++) {
        for (var i = arguments[t], o = 0, l = i.length; o < l; o++, s++) {
          a[s] = i[o];
        }
      }

      return a;
    };

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.prepareDataforCbh = exports.createChart = exports.chart = void 0;

    var t = require("../classes/Chart"),
        r = require("../scripts/helpers"),
        a = [],
        s = [],
        i = [],
        o = [],
        l = .08;

    function n(r, n) {
      var c, p, x, f, y, _, v, m, g, B, I, A, F, T;

      exports.chart = new t.Chart(r, [0, 900], [0, 2e3]), c = e(n), i = c[0], s = c[1], a = c[2], o = c[3], b(i[i.length - 1]), exports.chart.tooltipsDataIndexUpdated.add(h), exports.chart.tooltipsDataIndexUpdated.add(u), exports.chart.setCanvasPaddings(25, 60, 40, 20), exports.chart.xAxis.setOptions("start", 1, "black"), exports.chart.xAxis.ticks.display = !0, exports.chart.xAxis.ticks.settickDrawOptions(6, 1, "black"), exports.chart.xAxis.ticks.label.setOptions(!0, "#B2B2B2", "bottom", 11, ["12", '"Transcript Pro"']), exports.chart.yAxis.setOptions("end", 1, "#B2B2B2", [1, 2]), exports.chart.yAxis.display = !0, exports.chart.yAxis.position = "end", exports.chart.yAxis.ticks.label.setOptions(!0, "#B2B2B2", "right", 20, ["12", '"Transcript Pro"']), exports.chart.addPlot("red_line", "line", 1, "#FF2222", []), exports.chart.addPlot("red_area", "area", 0, "#FFE5E5", "#FFE5E5", 0), exports.chart.addPlot("blue_line", "line", 1, "#0070FF", []), exports.chart.addPlot("blue_area", "area", 0, "#D9EAFF", "#D9EAFF", 0), exports.chart.addPlot("black_line", "line", 1, "#000000", []), null === (p = exports.chart.findPlotById("blue_line")) || void 0 === p || p.addTooltip("ttId", "line_vertical_full", 1, "#B2B2B2", [1, 2]), null === (x = exports.chart.findPlotById("red_line")) || void 0 === x || x.addTooltip("ttId", "line_horizontal_end", 1, "#B2B2B2", [1, 2]), null === (f = exports.chart.findPlotById("blue_line")) || void 0 === f || f.addTooltip("ttId", "line_horizontal_end", 1, "#B2B2B2", [1, 2]), null === (y = exports.chart.findPlotById("blue_line")) || void 0 === y || y.addTooltip("ttId", "circle_series", 3, "#ffffff", "#0070FF", 4), null === (_ = exports.chart.findPlotById("red_line")) || void 0 === _ || _.addTooltip("ttId", "circle_series", 3, "#ffffff", "#FF2222", 4), null === (v = exports.chart.findPlotById("black_line")) || void 0 === v || v.addTooltip("ttId", "circle_series", 3, "#ffffff", "black", 4), null === (m = exports.chart.findPlotById("blue_line")) || void 0 === m || m.addTooltip("ttId", "circle_y_end", 3, "#ffffff", "#0070FF", 4), null === (g = exports.chart.findPlotById("red_line")) || void 0 === g || g.addTooltip("ttId", "circle_y_end", 3, "#ffffff", "#FF2222", 4), null === (B = exports.chart.findPlotById("red_line")) || void 0 === B || B.addTooltip("ttId", "label_x_start", .5, "black", "#ebebeb", 4, i).label.setOptions(!0, "black", "bottom", 14, ["12", '"Transcript Pro"']), null === (I = exports.chart.findPlotById("red_line")) || void 0 === I || I.addTooltip("ttId", "data_y_end", .5, "#FF2222", "#FF2222", 4).label.setOptions(!0, "white", "right", 30, ["12", '"Transcript Pro"']), null === (A = exports.chart.findPlotById("blue_line")) || void 0 === A || A.addTooltip("ttId", "data_y_end", .5, "#0070FF", "#0070FF", 4).label.setOptions(!0, "white", "right", 30, ["12", '"Transcript Pro"']), null === (F = exports.chart.findPlotById("red_line")) || void 0 === F || F.addTooltip("delta_1", "delta_abs", .5, "black", "#ebebeb", 4).label.setOptions(!0, "black", "right", 35, ["12", '"Transcript Pro"']), null === (T = exports.chart.findPlotById("blue_line")) || void 0 === T || T.addTooltip("delta_1", "delta_abs", .5, "black", "#ebebeb", 4).label.setOptions(!0, "black", "right", 35, ["12", '"Transcript Pro"']);
      var P = d(s, a, 0),
          k = P.serie5star,
          S = P.area5starTop,
          D = P.area5starBottom,
          w = P.serie1star,
          M = P.area1starTop,
          E = P.area1starBottom;
      exports.chart.addSeriesRow("cyberHedge5_area", [S, D]).setPlotsIds("blue_area"), exports.chart.addSeriesRow("cyberHedge1_area", [M, E]).setPlotsIds("red_area"), exports.chart.addSeriesRow("cyberHedge5_line", [k]).setPlotsIds("blue_line"), exports.chart.addSeriesRow("cyberHedge1_line", [w]).setPlotsIds("red_line"), exports.chart.addSeriesRow("zero_line", [o]).setPlotsIds("black_line"), exports.chart.yAxis.ticks.setOptions(!1, "niceCbhStep", [1, 5, 10, 15, 20, 25, 30]), exports.chart.yAxis.ticks.label.units = "%", exports.chart.xAxis.ticks.setCustomLabels(i), exports.chart.xAxis.ticks.setOptions(!0, "customDateTicks", ["half month", "year", "half year", "third year", "quarter year"]), exports.chart.xAxis.display = !0, exports.chart.xAxis.setMinMax(exports.chart.data.findExtremes("val"), !0), exports.chart.yAxis.setMinMax(exports.chart.data.findExtremes("ind", exports.chart.xAxis.min, exports.chart.xAxis.max), !0), exports.chart.yAxis.setMinMax([exports.chart.yAxis.min - l * exports.chart.yAxis.length, exports.chart.yAxis.max + l * exports.chart.yAxis.length], !0);

      var L = require("bezier-easing")(.65, 0, .35, 1);

      exports.chart.xAxis.ticks.switchAnimation(!0, 300), exports.chart.yAxis.ticks.switchAnimation(!0, 300), exports.chart.switchDataAnimation(!0, 300), exports.chart.data.changeAllSeriesAnimationTimeFunction(L), exports.chart.setCanvasPaddings(25, 60, 40, 20);
    }

    function d(e, t, r) {
      for (var a = e.length, s = c(e, r), i = c(t, r), o = [], l = [], n = [], d = [], p = 0, x = a; p < x; p++) {
        var h = s[p],
            u = i[p],
            f = h > 0 ? h : 0;
        o.push(f);
        var b = h > 0 ? u > 0 ? u > h ? h : u : 0 : h;
        l.push(b);
        var y = u > 0 ? u : h > 0 ? 0 : h < u ? u : h;
        n.push(y);

        var _ = u > 0 ? 0 : u;

        d.push(_);
      }

      return {
        serie5star: s,
        area5starTop: o,
        area5starBottom: l,
        serie1star: i,
        area1starTop: n,
        area1starBottom: d
      };
    }

    function c(e, t) {
      var r = [],
          a = e[t];
      r = [];

      for (var s = 0, i = e.length; s < i; s++) {
        r.push(100 * (e[s] - a) / a);
      }

      return r;
    }

    exports.createChart = n, exports.prepareDataforCbh = d, document.querySelectorAll(".index .zones li").forEach(function (e) {
      e.addEventListener("click", function () {
        var t = e.querySelector("a");
        document.querySelector(".index .zones li.selected").classList.remove("selected"), e.classList.add("selected");
        var l = document.querySelector(".ranges_indices li.selected");
        r.customLoadDataFromCsv(t.href).then(function (e) {
          var t = r.csvToCols(e);
          a = t[2].slice(1).map(function (e) {
            return +e;
          }), s = t[1].slice(1).map(function (e) {
            return +e;
          }), i = t[0].slice(1).map(function (e) {
            return new Date(e);
          }), o = a.map(function () {
            return 0;
          }), b(i[i.length - 1]);
          var n = i.length - 1;
          f(s, a, 0, n, !1), l.click(l);
        });
      });
    }), document.querySelectorAll(".ranges_indices li").forEach(function (e) {
      e.addEventListener("click", function () {
        document.querySelector(".ranges_indices li.selected").classList.remove("selected"), e.classList.add("selected");
        var t = i[i.length - 1],
            r = i.length - 1,
            o = 0;

        switch (e.innerHTML) {
          case "6M":
            o = y(new Date(new Date(t.getTime()).setMonth(t.getMonth() - 6)));
            break;

          case "1Y":
            o = y(new Date(new Date(t.getTime()).setFullYear(t.getFullYear() - 1)));
            break;

          case "2Y":
            o = y(new Date(new Date(t.getTime()).setFullYear(t.getFullYear() - 2)));
            break;

          case "YTD":
            o = y(new Date(new Date(t.getFullYear(), 0, 1).getTime()));
        }

        f(s, a, o, r, !0);
      });
    });
    var p = document.getElementById("cbhIdx1-val"),
        x = document.getElementById("cbhIdx5-val");

    function h(e) {
      p && (p.innerHTML = a[e].toFixed(1));
    }

    function u(e) {
      x && (x.innerHTML = s[e].toFixed(1));
    }

    function f(e, t, r, a, s) {
      var n,
          c,
          p,
          x,
          h,
          u = d(e, t, r),
          f = u.serie5star,
          b = u.area5starTop,
          y = u.area5starBottom,
          _ = u.serie1star,
          v = u.area1starTop,
          m = u.area1starBottom;

      if (null === (n = exports.chart.data.findSeriesById("cyberHedge5_area")) || void 0 === n || n.replaceSeriesData([b, y]), null === (c = exports.chart.data.findSeriesById("cyberHedge1_area")) || void 0 === c || c.replaceSeriesData([v, m]), null === (p = exports.chart.data.findSeriesById("cyberHedge5_line")) || void 0 === p || p.replaceSeriesData([f]), null === (x = exports.chart.data.findSeriesById("cyberHedge1_line")) || void 0 === x || x.replaceSeriesData([_]), null === (h = exports.chart.data.findSeriesById("zero_line")) || void 0 === h || h.replaceSeriesData([o]), s) {
        exports.chart.xAxis.ticks.setCustomLabels(i), exports.chart.xAxis.setMinMax([r, a], !1);
        var g = exports.chart.data.findExtremes("ind", r, a),
            B = Math.abs(g[0] - g[1]);
        exports.chart.yAxis.setMinMax([g[0] - l * B, g[1] + l * B], !0);
      }
    }

    function b(e) {
      var t = document.querySelector(".last-update time");
      t.datetime = e.toISOString(), t.innerHTML = [e.getDate(), e.toLocaleString("en-US", {
        month: "long"
      }), e.getFullYear()].join(" ");
    }

    function y(e) {
      return i.reduce(function (t, r, a) {
        return Math.abs(r - e) < Math.abs(i[t] - e) ? a : t;
      }, 0);
    }
  }, {
    "../classes/Chart": "ojD5",
    "../scripts/helpers": "y8wP",
    "bezier-easing": "Cvim"
  }],
  "Xq8Z": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Legend = void 0;

    var e = require("./Label"),
        t = function () {
      function t(t, r) {
        return this.text = t, this.label = new e.Label(), this.getCoord = r, this;
      }

      return t.prototype.draw = function (e, t) {
        var r = this,
            o = this.getCoord(t);
        this.text.forEach(function (t) {
          r.label.draw(e, o, t), o.y = o.y + r.label.fontSize;
        });
      }, t;
    }();

    exports.Legend = t;
  }, {
    "./Label": "TL4g"
  }],
  "srla": [function (require, module, exports) {
    "use strict";

    var t = this && this.__spreadArrays || function () {
      for (var t = 0, r = 0, e = arguments.length; r < e; r++) {
        t += arguments[r].length;
      }

      var s = Array(t),
          a = 0;

      for (r = 0; r < e; r++) {
        for (var i = arguments[r], o = 0, n = i.length; o < n; o++, a++) {
          s[a] = i[o];
        }
      }

      return s;
    };

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.reorganizeChart = exports.createChart = exports.prepareData = exports.chart = void 0;

    var r = require("../classes/Chart"),
        e = require("../classes/Legend"),
        s = require("../classes/Point"),
        a = require("../classes/Ticks");

    function i(t) {
      return [t[0].slice(1).map(function (t) {
        return +t;
      }), t[1].slice(1).map(function (t) {
        return +t;
      }), [1.3], [2.5], t[2].slice(1).map(function (t) {
        return t;
      })];
    }

    function o(i, o) {
      var n, c, p, l, d, x, h;
      exports.chart = new r.Chart(i, [0, 5], [0, 5]), p = (n = t(o))[0], l = n[1], d = n[2], x = n[3], h = n[4], exports.chart.xAxis.setOptions("end", 1, "black"), exports.chart.xAxis.ticks.setOptions(!1, "fixedCount", 5), exports.chart.xAxis.ticks.label.setOptions(!1, "#B2B2B2", "bottom", 11, ["12", '"Transcript Pro"']), exports.chart.xAxis.grid.setOptions(!0, "black", .5, []), exports.chart.xAxis.setName("Capital Managment", "start").label.setOptions(!0, "black", "top", -30, ["18", '"Transcript Pro"']);
      var u = new e.Legend(["Low", "Risk"], function (t) {
        return new s.Point(t.x1 - 25, t.y2 + 25);
      });
      u.label.setOptions(!0, "black", "top", 0, ["14", '"Transcript Pro"']), exports.chart.xAxis.addLegend(u);
      var b = new e.Legend(["High", "Risk"], function (t) {
        return new s.Point(t.x2 + 25, t.y1 - 25);
      });
      b.label.setOptions(!0, "black", "top", 0, ["14", '"Transcript Pro"']), exports.chart.xAxis.addLegend(b);
      var A = new a.Ticks(exports.chart.xAxis.type);
      A.setOptions(!1, "midStep", 5), A.label.setOptions(!0, "#B2B2B2", "top", 17, ["25", '"Transcript Pro"'], ["#60bb4c", "#accd5a", "#eed15c", "#ee9c58", "#e94f49"]), A.setCustomLabels(["●"]), exports.chart.xAxis.addCustomTicks(A), exports.chart.yAxis.setOptions("end", 1, "#B2B2B2"), exports.chart.yAxis.ticks.setOptions(!1, "fixedCount", 5), exports.chart.yAxis.ticks.label.setOptions(!1, "#B2B2B2", "right", 20, ["12", '"Transcript Pro"']), exports.chart.yAxis.grid.setOptions(!0, "black", .5, []), exports.chart.yAxis.setName("Vulnerability", "start").label.setOptions(!0, "black", "right", -10, ["18", '"Transcript Pro"']), exports.chart.yAxis.label.rotationAngle = -90;
      var f = new a.Ticks(exports.chart.yAxis.type);
      f.setOptions(!1, "midStep", 5), f.label.setOptions(!0, "#B2B2B2", "right", 30, ["25", '"Transcript Pro"'], ["#60bb4c", "#accd5a", "#eed15c", "#ee9c58", "#e94f49"]), f.setCustomLabels(["●"]), exports.chart.yAxis.addCustomTicks(f), exports.chart.hasBorder = !0, exports.chart.addPlot("uni_circles", "unicode", 20, "#454e56", "●"), exports.chart.addPlot("uni_triangle", "unicode", 20, "#454e56", "▼"), null === (c = exports.chart.findPlotById("uni_circles")) || void 0 === c || c.addTooltip("ttId", "data_label", .5, "black", "#ebebeb", h).label.setOptions(!0, "black", "top", 15, ["12", '"Transcript Pro"']), exports.chart.addSeries("portfolio", [p, l]).setPlotsIds("uni_circles"), exports.chart.addSeries("portfolio_1", [d, x]).setPlotsIds("uni_triangle");

      var g = require("bezier-easing")(.65, 0, .35, 1);

      exports.chart.xAxis.ticks.switchAnimation(!1, 300), exports.chart.yAxis.ticks.switchAnimation(!1, 300), exports.chart.switchDataAnimation(!0, 300), exports.chart.data.changeAllSeriesAnimationTimeFunction(g), exports.chart.addBackGround("coloredGrid_cbh"), exports.chart.switchResolution(), exports.chart.setCanvasPaddings(60, 60, 60, 60);
    }

    function n() {
      var t, r, e, s, a, i, o, n;
      s = [], a = [], n = [];

      for (var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".length, p = 1 + Math.round(16 * Math.random()), l = 0; l < p; l++) {
        s.push(.1 + 4.8 * Math.random()), a.push(.1 + 4.8 * Math.random()), n.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * c)));
      }

      i = [.1 + 4.8 * Math.random()], o = [.1 + 4.8 * Math.random()], null === (t = exports.chart.data.findSeriesById("portfolio")) || void 0 === t || t.replaceSeriesData([s, a]), null === (r = exports.chart.data.findSeriesById("portfolio_1")) || void 0 === r || r.replaceSeriesData([i, o]), null === (e = exports.chart.findPlotById("uni_circles")) || void 0 === e || (e.findTooltipById("ttId").labels = n);
    }

    exports.prepareData = i, exports.createChart = o, exports.reorganizeChart = n;
  }, {
    "../classes/Chart": "ojD5",
    "../classes/Legend": "Xq8Z",
    "../classes/Point": "vCld",
    "../classes/Ticks": "N6PM",
    "bezier-easing": "Cvim"
  }],
  "B6dB": [function (require, module, exports) {
    "use strict";

    var t = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      var r = Array(t),
          c = 0;

      for (e = 0; e < n; e++) {
        for (var a = arguments[e], o = 0, i = a.length; o < i; o++, c++) {
          r[c] = a[o];
        }
      }

      return r;
    },
        e = this && this.__importDefault || function (t) {
      return t && t.__esModule ? t : {
        default: t
      };
    };

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var n = e(require("webfontloader")),
        r = require("./scripts/helpers"),
        c = require("./configs/indices-chart-black"),
        a = require("./configs/indices-chart-colored"),
        o = require("./configs/indices-chart"),
        i = require("./configs/square-chart"),
        s = require("./configs/square-chart"),
        u = "./src/data/cbhVulnerability_test.csv",
        l = "./src/data/cbhPlotData_EU.csv",
        f = "./src/data/cbhPlotData_EU_labeled.csv",
        m = "./src/data/cbhPlotData_US.csv";

    n.default.load({
      custom: {
        families: ["Transcript Pro"]
      },
      active: function active() {
        r.customLoadDataFromCsv(l).then(function (t) {
          r.customLoadDataFromCsv(f).then(function (e) {
            var n = document.getElementById("indexChart_0"),
                a = r.csvToCols(t),
                o = a[1].slice(1).map(function (t) {
              return +t;
            }),
                i = a[0].slice(1).map(function (t) {
              return new Date(t);
            }),
                s = o.map(function () {
              return 0;
            }),
                u = r.csvToCols(e),
                l = u[0].slice(1).map(function (t) {
              return +t;
            }),
                f = u[1].slice(1).map(function (t) {
              return +t;
            }),
                m = u[2].slice(1).map(function (t) {
              return t;
            });
            c.createChart(n, [i, o, s, [l, f], m]);
          });
        }).catch(function (t) {
          console.log(t);
        }), r.customLoadDataFromCsv(m).then(function (t) {
          var e = document.getElementById("indexChart_1"),
              n = r.csvToCols(t),
              c = n[2].slice(1).map(function (t) {
            return +t;
          }),
              o = n[1].slice(1).map(function (t) {
            return +t;
          }),
              i = n[0].slice(1).map(function (t) {
            return new Date(t);
          }),
              s = c.map(function () {
            return 0;
          });
          a.createChart(e, [i, o, c, s]);
        }).catch(function (t) {
          console.log(t);
        }), r.customLoadDataFromCsv(m).then(function (t) {
          var e = document.getElementById("indexChart_2"),
              n = r.csvToCols(t),
              c = n[2].slice(1).map(function (t) {
            return +t;
          }),
              a = n[1].slice(1).map(function (t) {
            return +t;
          }),
              i = n[0].slice(1).map(function (t) {
            return new Date(t);
          }),
              s = c.map(function () {
            return 0;
          });
          o.createChart(e, [i, a, c, s]);
        }).catch(function (t) {
          console.log(t);
        }), r.customLoadDataFromCsv(u).then(function (e) {
          var n = document.getElementById("indexChart_3"),
              c = r.csvToCols(e);
          c = s.prepareData(c), i.createChart(n, t(c));
        }).catch(function (t) {
          console.log(t);
        });
      }
    });
  }, {
    "webfontloader": "GxDM",
    "./scripts/helpers": "y8wP",
    "./configs/indices-chart-black": "XIH4",
    "./configs/indices-chart-colored": "frlZ",
    "./configs/indices-chart": "unV5",
    "./configs/square-chart": "srla"
  }]
}, {}, ["B6dB"], null);
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "13315" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src.0cf16e15.js"], null)
//# sourceMappingURL=/src.0cf16e15.73b42647.js.map