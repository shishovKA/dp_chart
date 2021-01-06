(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

function LinearEasing (x) {
  return x;
}

module.exports = function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};

},{}],2:[function(require,module,exports){
//
//
// Based on: http://www.html5rocks.com/en/tutorials/canvas/hidpi/

//
var scaleFn = function(canvas, context, customWidth, customHeight) {
  if(!canvas || !context) { throw new Error('Must pass in `canvas` and `context`.'); }

  var width = customWidth ||
              canvas.width || // attr, eg: <canvas width='400'>
              canvas.clientWidth; // keep existing width
  var height = customHeight ||
               canvas.height ||
               canvas.clientHeight;
  var deviceRatio = window.devicePixelRatio || 1;
  var bsRatio = context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
  var ratio = deviceRatio / bsRatio;

  // Adjust canvas if ratio =/= 1
  if (deviceRatio !== bsRatio) {
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.scale(ratio, ratio);
  }
  return ratio;
};

// expose functionality
if(typeof window !== 'undefined') { window.canvasDpiScaler = scaleFn; }
module.exports = scaleFn;

},{}],3:[function(require,module,exports){
/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */
/*global define:false, require:false, exports:false, module:false, signals:false */

/** @license
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license
 * Author: Miller Medeiros
 * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
 */

(function(global){

    // SignalBinding -------------------------------------------------
    //================================================================

    /**
     * Object that represents a binding between a Signal and a listener function.
     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
     * @author Miller Medeiros
     * @constructor
     * @internal
     * @name SignalBinding
     * @param {Signal} signal Reference to Signal object that listener is currently bound to.
     * @param {Function} listener Handler function bound to the signal.
     * @param {boolean} isOnce If binding should be executed just once.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. (default = 0).
     */
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

        /**
         * Handler function bound to the signal.
         * @type Function
         * @private
         */
        this._listener = listener;

        /**
         * If binding should be executed just once.
         * @type boolean
         * @private
         */
        this._isOnce = isOnce;

        /**
         * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @memberOf SignalBinding.prototype
         * @name context
         * @type Object|undefined|null
         */
        this.context = listenerContext;

        /**
         * Reference to Signal object that listener is currently bound to.
         * @type Signal
         * @private
         */
        this._signal = signal;

        /**
         * Listener priority
         * @type Number
         * @private
         */
        this._priority = priority || 0;
    }

    SignalBinding.prototype = {

        /**
         * If binding is active and should be executed.
         * @type boolean
         */
        active : true,

        /**
         * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
         * @type Array|null
         */
        params : null,

        /**
         * Call listener passing arbitrary parameters.
         * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
         * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
         * @return {*} Value returned by the listener.
         */
        execute : function (paramsArr) {
            var handlerReturn, params;
            if (this.active && !!this._listener) {
                params = this.params? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if (this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        },

        /**
         * Detach binding from signal.
         * - alias to: mySignal.remove(myBinding.getListener());
         * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
         */
        detach : function () {
            return this.isBound()? this._signal.remove(this._listener, this.context) : null;
        },

        /**
         * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
         */
        isBound : function () {
            return (!!this._signal && !!this._listener);
        },

        /**
         * @return {boolean} If SignalBinding will only be executed once.
         */
        isOnce : function () {
            return this._isOnce;
        },

        /**
         * @return {Function} Handler function bound to the signal.
         */
        getListener : function () {
            return this._listener;
        },

        /**
         * @return {Signal} Signal that listener is currently bound to.
         */
        getSignal : function () {
            return this._signal;
        },

        /**
         * Delete instance properties
         * @private
         */
        _destroy : function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[SignalBinding isOnce:' + this._isOnce +', isBound:'+ this.isBound() +', active:' + this.active + ']';
        }

    };


/*global SignalBinding:false*/

    // Signal --------------------------------------------------------
    //================================================================

    function validateListener(listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName) );
        }
    }

    /**
     * Custom event broadcaster
     * <br />- inspired by Robert Penner's AS3 Signals.
     * @name Signal
     * @author Miller Medeiros
     * @constructor
     */
    function Signal() {
        /**
         * @type Array.<SignalBinding>
         * @private
         */
        this._bindings = [];
        this._prevParams = null;

        // enforce dispatch to aways work on same context (#47)
        var self = this;
        this.dispatch = function(){
            Signal.prototype.dispatch.apply(self, arguments);
        };
    }

    Signal.prototype = {

        /**
         * Signals Version Number
         * @type String
         * @const
         */
        VERSION : '1.0.0',

        /**
         * If Signal should keep record of previously dispatched parameters and
         * automatically execute listener during `add()`/`addOnce()` if Signal was
         * already dispatched before.
         * @type boolean
         */
        memorize : false,

        /**
         * @type boolean
         * @private
         */
        _shouldPropagate : true,

        /**
         * If Signal is active and should broadcast events.
         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
         * @type boolean
         */
        active : true,

        /**
         * @param {Function} listener
         * @param {boolean} isOnce
         * @param {Object} [listenerContext]
         * @param {Number} [priority]
         * @return {SignalBinding}
         * @private
         */
        _registerListener : function (listener, isOnce, listenerContext, priority) {

            var prevIndex = this._indexOfListener(listener, listenerContext),
                binding;

            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
                }
            } else {
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding);
            }

            if(this.memorize && this._prevParams){
                binding.execute(this._prevParams);
            }

            return binding;
        },

        /**
         * @param {SignalBinding} binding
         * @private
         */
        _addBinding : function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;
            do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
            this._bindings.splice(n + 1, 0, binding);
        },

        /**
         * @param {Function} listener
         * @return {number}
         * @private
         */
        _indexOfListener : function (listener, context) {
            var n = this._bindings.length,
                cur;
            while (n--) {
                cur = this._bindings[n];
                if (cur._listener === listener && cur.context === context) {
                    return n;
                }
            }
            return -1;
        },

        /**
         * Check if listener was attached to Signal.
         * @param {Function} listener
         * @param {Object} [context]
         * @return {boolean} if Signal has the specified listener.
         */
        has : function (listener, context) {
            return this._indexOfListener(listener, context) !== -1;
        },

        /**
         * Add a listener to the signal.
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        add : function (listener, listenerContext, priority) {
            validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority);
        },

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        addOnce : function (listener, listenerContext, priority) {
            validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority);
        },

        /**
         * Remove a single listener from the dispatch queue.
         * @param {Function} listener Handler function that should be removed.
         * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
         * @return {Function} Listener handler function.
         */
        remove : function (listener, context) {
            validateListener(listener, 'remove');

            var i = this._indexOfListener(listener, context);
            if (i !== -1) {
                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
                this._bindings.splice(i, 1);
            }
            return listener;
        },

        /**
         * Remove all listeners from the Signal.
         */
        removeAll : function () {
            var n = this._bindings.length;
            while (n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        },

        /**
         * @return {number} Number of listeners attached to the Signal.
         */
        getNumListeners : function () {
            return this._bindings.length;
        },

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
         * @see Signal.prototype.disable
         */
        halt : function () {
            this._shouldPropagate = false;
        },

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         * @param {...*} [params] Parameters that should be passed to each handler.
         */
        dispatch : function (params) {
            if (! this.active) {
                return;
            }

            var paramsArr = Array.prototype.slice.call(arguments),
                n = this._bindings.length,
                bindings;

            if (this.memorize) {
                this._prevParams = paramsArr;
            }

            if (! n) {
                //should come after memorize
                return;
            }

            bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
            //reverse loop since listeners with higher priority will be added at the end of the list
            do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        },

        /**
         * Forget memorized arguments.
         * @see Signal.memorize
         */
        forget : function(){
            this._prevParams = null;
        },

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
         */
        dispose : function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[Signal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';
        }

    };


    // Namespace -----------------------------------------------------
    //================================================================

    /**
     * Signals namespace
     * @namespace
     * @name signals
     */
    var signals = Signal;

    /**
     * Custom event broadcaster
     * @see Signal
     */
    // alias for backwards compatibility (see #gh-44)
    signals.Signal = Signal;



    //exports to multiple environments
    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return signals; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = signals;
    } else { //browser
        //use string because of Google closure compiler ADVANCED_MODE
        /*jslint sub:true */
        global['signals'] = signals;
    }

}(this));

},{}],4:[function(require,module,exports){
/* Web Font Loader v1.6.28 - (c) Adobe Systems, Google. License: Apache 2.0 */(function(){function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function p(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return p.apply(null,arguments)}var q=Date.now||function(){return+new Date};function ca(a,b){this.a=a;this.o=b||a;this.c=this.o.document}var da=!!window.FontFace;function t(a,b,c,d){b=a.c.createElement(b);if(c)for(var e in c)c.hasOwnProperty(e)&&("style"==e?b.style.cssText=c[e]:b.setAttribute(e,c[e]));d&&b.appendChild(a.c.createTextNode(d));return b}function u(a,b,c){a=a.c.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(c,a.lastChild)}function v(a){a.parentNode&&a.parentNode.removeChild(a)}
function w(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function y(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
function ea(a){return a.o.location.hostname||a.a.location.hostname}function z(a,b,c){function d(){m&&e&&f&&(m(g),m=null)}b=t(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,m=c||null;da?(b.onload=function(){e=!0;d()},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");d()}):setTimeout(function(){e=!0;d()},0);u(a,"head",b)}
function A(a,b,c,d){var e=a.c.getElementsByTagName("head")[0];if(e){var f=t(a,"script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")))},d||5E3);return f}return null};function B(){this.a=0;this.c=null}function C(a){a.a++;return function(){a.a--;D(a)}}function E(a,b){a.c=b;D(a)}function D(a){0==a.a&&a.c&&(a.c(),a.c=null)};function F(a){this.a=a||"-"}F.prototype.c=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function G(a,b){this.c=a;this.f=4;this.a="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.a=c[1],this.f=parseInt(c[2],10))}function fa(a){return H(a)+" "+(a.f+"00")+" 300px "+I(a.c)}function I(a){var b=[];a=a.split(/,\s*/);for(var c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1!=d.indexOf(" ")||/^\d/.test(d)?b.push("'"+d+"'"):b.push(d)}return b.join(",")}function J(a){return a.a+a.f}function H(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b}
function ga(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function ha(a,b){this.c=a;this.f=a.o.document.documentElement;this.h=b;this.a=new F("-");this.j=!1!==b.events;this.g=!1!==b.classes}function ia(a){a.g&&w(a.f,[a.a.c("wf","loading")]);K(a,"loading")}function L(a){if(a.g){var b=y(a.f,a.a.c("wf","active")),c=[],d=[a.a.c("wf","loading")];b||c.push(a.a.c("wf","inactive"));w(a.f,c,d)}K(a,"inactive")}function K(a,b,c){if(a.j&&a.h[b])if(c)a.h[b](c.c,J(c));else a.h[b]()};function ja(){this.c={}}function ka(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.c[e];f&&d.push(f(b[e],c))}return d};function M(a,b){this.c=a;this.f=b;this.a=t(this.c,"span",{"aria-hidden":"true"},this.f)}function N(a){u(a.c,"body",a.a)}function O(a){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+I(a.c)+";"+("font-style:"+H(a)+";font-weight:"+(a.f+"00")+";")};function P(a,b,c,d,e,f){this.g=a;this.j=b;this.a=d;this.c=c;this.f=e||3E3;this.h=f||void 0}P.prototype.start=function(){var a=this.c.o.document,b=this,c=q(),d=new Promise(function(d,e){function f(){q()-c>=b.f?e():a.fonts.load(fa(b.a),b.h).then(function(a){1<=a.length?d():setTimeout(f,25)},function(){e()})}f()}),e=null,f=new Promise(function(a,d){e=setTimeout(d,b.f)});Promise.race([f,d]).then(function(){e&&(clearTimeout(e),e=null);b.g(b.a)},function(){b.j(b.a)})};function Q(a,b,c,d,e,f,g){this.v=a;this.B=b;this.c=c;this.a=d;this.s=g||"BESbswy";this.f={};this.w=e||3E3;this.u=f||null;this.m=this.j=this.h=this.g=null;this.g=new M(this.c,this.s);this.h=new M(this.c,this.s);this.j=new M(this.c,this.s);this.m=new M(this.c,this.s);a=new G(this.a.c+",serif",J(this.a));a=O(a);this.g.a.style.cssText=a;a=new G(this.a.c+",sans-serif",J(this.a));a=O(a);this.h.a.style.cssText=a;a=new G("serif",J(this.a));a=O(a);this.j.a.style.cssText=a;a=new G("sans-serif",J(this.a));a=
O(a);this.m.a.style.cssText=a;N(this.g);N(this.h);N(this.j);N(this.m)}var R={D:"serif",C:"sans-serif"},S=null;function T(){if(null===S){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);S=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10))}return S}Q.prototype.start=function(){this.f.serif=this.j.a.offsetWidth;this.f["sans-serif"]=this.m.a.offsetWidth;this.A=q();U(this)};
function la(a,b,c){for(var d in R)if(R.hasOwnProperty(d)&&b===a.f[R[d]]&&c===a.f[R[d]])return!0;return!1}function U(a){var b=a.g.a.offsetWidth,c=a.h.a.offsetWidth,d;(d=b===a.f.serif&&c===a.f["sans-serif"])||(d=T()&&la(a,b,c));d?q()-a.A>=a.w?T()&&la(a,b,c)&&(null===a.u||a.u.hasOwnProperty(a.a.c))?V(a,a.v):V(a,a.B):ma(a):V(a,a.v)}function ma(a){setTimeout(p(function(){U(this)},a),50)}function V(a,b){setTimeout(p(function(){v(this.g.a);v(this.h.a);v(this.j.a);v(this.m.a);b(this.a)},a),0)};function W(a,b,c){this.c=a;this.a=b;this.f=0;this.m=this.j=!1;this.s=c}var X=null;W.prototype.g=function(a){var b=this.a;b.g&&w(b.f,[b.a.c("wf",a.c,J(a).toString(),"active")],[b.a.c("wf",a.c,J(a).toString(),"loading"),b.a.c("wf",a.c,J(a).toString(),"inactive")]);K(b,"fontactive",a);this.m=!0;na(this)};
W.prototype.h=function(a){var b=this.a;if(b.g){var c=y(b.f,b.a.c("wf",a.c,J(a).toString(),"active")),d=[],e=[b.a.c("wf",a.c,J(a).toString(),"loading")];c||d.push(b.a.c("wf",a.c,J(a).toString(),"inactive"));w(b.f,d,e)}K(b,"fontinactive",a);na(this)};function na(a){0==--a.f&&a.j&&(a.m?(a=a.a,a.g&&w(a.f,[a.a.c("wf","active")],[a.a.c("wf","loading"),a.a.c("wf","inactive")]),K(a,"active")):L(a.a))};function oa(a){this.j=a;this.a=new ja;this.h=0;this.f=this.g=!0}oa.prototype.load=function(a){this.c=new ca(this.j,a.context||this.j);this.g=!1!==a.events;this.f=!1!==a.classes;pa(this,new ha(this.c,a),a)};
function qa(a,b,c,d,e){var f=0==--a.h;(a.f||a.g)&&setTimeout(function(){var a=e||null,m=d||null||{};if(0===c.length&&f)L(b.a);else{b.f+=c.length;f&&(b.j=f);var h,l=[];for(h=0;h<c.length;h++){var k=c[h],n=m[k.c],r=b.a,x=k;r.g&&w(r.f,[r.a.c("wf",x.c,J(x).toString(),"loading")]);K(r,"fontloading",x);r=null;if(null===X)if(window.FontFace){var x=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),xa=/OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent)&&/Apple/.exec(window.navigator.vendor);
X=x?42<parseInt(x[1],10):xa?!1:!0}else X=!1;X?r=new P(p(b.g,b),p(b.h,b),b.c,k,b.s,n):r=new Q(p(b.g,b),p(b.h,b),b.c,k,b.s,a,n);l.push(r)}for(h=0;h<l.length;h++)l[h].start()}},0)}function pa(a,b,c){var d=[],e=c.timeout;ia(b);var d=ka(a.a,c,a.c),f=new W(a.c,b,e);a.h=d.length;b=0;for(c=d.length;b<c;b++)d[b].load(function(b,d,c){qa(a,f,b,d,c)})};function ra(a,b){this.c=a;this.a=b}
ra.prototype.load=function(a){function b(){if(f["__mti_fntLst"+d]){var c=f["__mti_fntLst"+d](),e=[],h;if(c)for(var l=0;l<c.length;l++){var k=c[l].fontfamily;void 0!=c[l].fontStyle&&void 0!=c[l].fontWeight?(h=c[l].fontStyle+c[l].fontWeight,e.push(new G(k,h))):e.push(new G(k))}a(e)}else setTimeout(function(){b()},50)}var c=this,d=c.a.projectId,e=c.a.version;if(d){var f=c.c.o;A(this.c,(c.a.api||"https://fast.fonts.net/jsapi")+"/"+d+".js"+(e?"?v="+e:""),function(e){e?a([]):(f["__MonotypeConfiguration__"+
d]=function(){return c.a},b())}).id="__MonotypeAPIScript__"+d}else a([])};function sa(a,b){this.c=a;this.a=b}sa.prototype.load=function(a){var b,c,d=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new B;b=0;for(c=d.length;b<c;b++)z(this.c,d[b],C(g));var m=[];b=0;for(c=e.length;b<c;b++)if(d=e[b].split(":"),d[1])for(var h=d[1].split(","),l=0;l<h.length;l+=1)m.push(new G(d[0],h[l]));else m.push(new G(d[0]));E(g,function(){a(m,f)})};function ta(a,b){a?this.c=a:this.c=ua;this.a=[];this.f=[];this.g=b||""}var ua="https://fonts.googleapis.com/css";function va(a,b){for(var c=b.length,d=0;d<c;d++){var e=b[d].split(":");3==e.length&&a.f.push(e.pop());var f="";2==e.length&&""!=e[1]&&(f=":");a.a.push(e.join(f))}}
function wa(a){if(0==a.a.length)throw Error("No fonts to load!");if(-1!=a.c.indexOf("kit="))return a.c;for(var b=a.a.length,c=[],d=0;d<b;d++)c.push(a.a[d].replace(/ /g,"+"));b=a.c+"?family="+c.join("%7C");0<a.f.length&&(b+="&subset="+a.f.join(","));0<a.g.length&&(b+="&text="+encodeURIComponent(a.g));return b};function ya(a){this.f=a;this.a=[];this.c={}}
var za={latin:"BESbswy","latin-ext":"\u00e7\u00f6\u00fc\u011f\u015f",cyrillic:"\u0439\u044f\u0416",greek:"\u03b1\u03b2\u03a3",khmer:"\u1780\u1781\u1782",Hanuman:"\u1780\u1781\u1782"},Aa={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Ba={i:"i",italic:"i",n:"n",normal:"n"},
Ca=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
function Da(a){for(var b=a.f.length,c=0;c<b;c++){var d=a.f[c].split(":"),e=d[0].replace(/\+/g," "),f=["n4"];if(2<=d.length){var g;var m=d[1];g=[];if(m)for(var m=m.split(","),h=m.length,l=0;l<h;l++){var k;k=m[l];if(k.match(/^[\w-]+$/)){var n=Ca.exec(k.toLowerCase());if(null==n)k="";else{k=n[2];k=null==k||""==k?"n":Ba[k];n=n[1];if(null==n||""==n)n="4";else var r=Aa[n],n=r?r:isNaN(n)?"4":n.substr(0,1);k=[k,n].join("")}}else k="";k&&g.push(k)}0<g.length&&(f=g);3==d.length&&(d=d[2],g=[],d=d?d.split(","):
g,0<d.length&&(d=za[d[0]])&&(a.c[e]=d))}a.c[e]||(d=za[e])&&(a.c[e]=d);for(d=0;d<f.length;d+=1)a.a.push(new G(e,f[d]))}};function Ea(a,b){this.c=a;this.a=b}var Fa={Arimo:!0,Cousine:!0,Tinos:!0};Ea.prototype.load=function(a){var b=new B,c=this.c,d=new ta(this.a.api,this.a.text),e=this.a.families;va(d,e);var f=new ya(e);Da(f);z(c,wa(d),C(b));E(b,function(){a(f.a,f.c,Fa)})};function Ga(a,b){this.c=a;this.a=b}Ga.prototype.load=function(a){var b=this.a.id,c=this.c.o;b?A(this.c,(this.a.api||"https://use.typekit.net")+"/"+b+".js",function(b){if(b)a([]);else if(c.Typekit&&c.Typekit.config&&c.Typekit.config.fn){b=c.Typekit.config.fn;for(var e=[],f=0;f<b.length;f+=2)for(var g=b[f],m=b[f+1],h=0;h<m.length;h++)e.push(new G(g,m[h]));try{c.Typekit.load({events:!1,classes:!1,async:!0})}catch(l){}a(e)}},2E3):a([])};function Ha(a,b){this.c=a;this.f=b;this.a=[]}Ha.prototype.load=function(a){var b=this.f.id,c=this.c.o,d=this;b?(c.__webfontfontdeckmodule__||(c.__webfontfontdeckmodule__={}),c.__webfontfontdeckmodule__[b]=function(b,c){for(var g=0,m=c.fonts.length;g<m;++g){var h=c.fonts[g];d.a.push(new G(h.name,ga("font-weight:"+h.weight+";font-style:"+h.style)))}a(d.a)},A(this.c,(this.f.api||"https://f.fontdeck.com/s/css/js/")+ea(this.c)+"/"+b+".js",function(b){b&&a([])})):a([])};var Y=new oa(window);Y.a.c.custom=function(a,b){return new sa(b,a)};Y.a.c.fontdeck=function(a,b){return new Ha(b,a)};Y.a.c.monotype=function(a,b){return new ra(b,a)};Y.a.c.typekit=function(a,b){return new Ga(b,a)};Y.a.c.google=function(a,b){return new Ea(b,a)};var Z={load:p(Y.load,Y)};"function"===typeof define&&define.amd?define(function(){return Z}):"undefined"!==typeof module&&module.exports?module.exports=Z:(window.WebFont=Z,window.WebFontConfig&&Y.load(window.WebFontConfig));}());

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axis = void 0;
var signals_1 = require("signals");
var Rectangle_1 = require("./Rectangle");
var Ticks_1 = require("./Ticks");
var Canvas_1 = require("./Canvas");
var Grid_1 = require("./Grid");
var Label_1 = require("./Label");
var Point_1 = require("./Point");
//описание класса
var Axis = /** @class */ (function () {
    function Axis(MinMax, type, container) {
        this.display = false;
        this.position = 'start';
        this.gridOn = false;
        this.customTicks = [];
        this.legends = [];
        this.onRefreshed = new signals_1.Signal();
        this.onOptionsSetted = new signals_1.Signal();
        this.onMinMaxSetted = new signals_1.Signal();
        this.onCustomTicksAdded = new signals_1.Signal();
        this.onNameSetted = new signals_1.Signal();
        this.min = 0;
        this.max = 0;
        this.setMinMax(MinMax);
        this.type = type;
        this.label = new Label_1.Label(this.type);
        this.canvas = new Canvas_1.Canvas(container);
        this.canvas.canvas.style.zIndex = "2";
        this.optionsDraw = {
            lineWidth: 1,
            lineColor: '#000000',
            lineDash: []
        };
        this.ticks = new Ticks_1.Ticks(this.type);
        this.grid = new Grid_1.Grid(this.type);
        this.bindChildSignals();
        this.bindSignals();
    }
    Axis.prototype.refresh = function () {
        this.createTicks();
        this.draw();
        this.onRefreshed.dispatch();
    };
    Axis.prototype.bindSignals = function () {
        var _this = this;
        this.onMinMaxSetted.add(function () {
            _this.createTicks();
            _this.draw();
        });
        this.onOptionsSetted.add(function () {
            _this.draw();
        });
        this.onCustomTicksAdded.add(function () {
            //this.createTicks(true);
            _this.draw();
        });
        this.onNameSetted.add(function () {
            _this.draw();
        });
    };
    Axis.prototype.bindChildSignals = function () {
        var _this = this;
        //canvas
        this.canvas.resized.add(function () {
            _this.createTicks(true);
            _this.draw();
        });
        this.canvas.onPaddingsSetted.add(function () {
            //this.createTicks(true);
            _this.draw();
        });
        //ticks
        this.ticks.onOptionsSetted.add(function () {
            //this.createTicks(true);
            _this.draw();
        });
        this.ticks.onCustomLabelsAdded.add(function () {
            //this.createTicks(true);
            _this.draw();
        });
        this.ticks.onCoordsChanged.add(function () {
            _this.draw();
        });
        //label
        this.label.onOptionsSetted.add(function () {
            _this.draw();
        });
        //ticks.labels
        this.ticks.label.onOptionsSetted.add(function () {
            _this.draw();
        });
        //grid
        this.grid.onOptionsSetted.add(function () {
            _this.draw();
        });
    };
    Object.defineProperty(Axis.prototype, "length", {
        get: function () {
            return Math.abs(this.max - this.min);
        },
        enumerable: false,
        configurable: true
    });
    Axis.prototype.addLegend = function (newLegend) {
        this.legends.push(newLegend);
    };
    Axis.prototype.setName = function (name, namePosition) {
        this.name = name;
        this.namePosition = namePosition;
        return this;
    };
    Axis.prototype.setOptions = function (position, lineWidth, lineColor, lineDash) {
        if (position)
            this.position = position;
        if (lineWidth)
            this.optionsDraw.lineWidth = lineWidth;
        if (lineColor)
            this.optionsDraw.lineColor = lineColor;
        if (lineDash)
            this.optionsDraw.lineDash = lineDash;
        this.onOptionsSetted.dispatch();
    };
    Axis.prototype.setMinMax = function (MinMax, hasPlotAnimation) {
        var to = [];
        var from = [];
        from = [this.min, this.max];
        switch (MinMax.length) {
            case 0:
                to = [0, 100];
                break;
            case 1:
                to = [MinMax[0], 100];
                break;
            case 2:
                to = [MinMax[0], MinMax[1]];
                break;
        }
        this.min = to[0];
        this.max = to[1];
        this.onMinMaxSetted.dispatch(hasPlotAnimation);
    };
    Axis.prototype.setMinMaxStatic = function (MinMax) {
        var to = [];
        var from = [];
        from = [this.min, this.max];
        switch (MinMax.length) {
            case 0:
                to = [0, 100];
                break;
            case 1:
                to = [MinMax[0], 100];
                break;
            case 2:
                to = [MinMax[0], MinMax[1]];
                break;
        }
        this.min = to[0];
        this.max = to[1];
    };
    Axis.prototype.draw = function () {
        var _this = this;
        var ctx = this.canvas.ctx;
        if (ctx) {
            this.canvas.clear();
            if (this.display)
                this.drawAxis();
            this.ticks.draw(ctx, this.canvas.viewport);
            this.customTicks.forEach(function (ticks) {
                ticks.draw(ctx, _this.canvas.viewport);
            });
            if (this.grid.display)
                this.grid.draw(ctx, this.canvas.viewport, this.ticks.coords);
            this.drawAxisName();
            this.legends.forEach(function (legend) {
                legend.draw(ctx, _this.canvas.viewport);
            });
        }
    };
    Axis.prototype.createTicks = function (noAnimate) {
        var _this = this;
        var ctx = this.canvas.ctx;
        if (ctx) {
            this.ticks.createTicks(this.min, this.max, this.axisViewport, ctx, noAnimate);
            this.customTicks.forEach(function (ticks) {
                ticks.createTicks(_this.min, _this.max, _this.axisViewport, ctx, noAnimate);
            });
        }
    };
    Axis.prototype.addCustomTicks = function (ticks) {
        var _this = this;
        ticks.onCoordsChangedLast.add(function () {
            _this.draw();
        });
        this.customTicks.push(ticks);
        this.onCustomTicksAdded.dispatch();
    };
    Object.defineProperty(Axis.prototype, "axisViewport", {
        get: function () {
            var vp = this.canvas.viewport;
            var axisVP = new Rectangle_1.Rectangle(0, 0, 0, 0);
            switch (this.position) {
                case 'start':
                    switch (this.type) {
                        case 'vertical':
                            axisVP = new Rectangle_1.Rectangle(vp.x1, vp.y1, vp.x1, vp.y2);
                            break;
                        case 'horizontal':
                            axisVP = new Rectangle_1.Rectangle(vp.x1, vp.y2, vp.x2, vp.y2);
                            break;
                    }
                    break;
                case 'end':
                case 'start':
                    switch (this.type) {
                        case 'vertical':
                            axisVP = new Rectangle_1.Rectangle(vp.x2, vp.y1, vp.x2, vp.y2);
                            break;
                        case 'horizontal':
                            axisVP = new Rectangle_1.Rectangle(vp.x1, vp.y1, vp.x2, vp.y1);
                            break;
                    }
                    break;
                    break;
            }
            return axisVP;
        },
        enumerable: false,
        configurable: true
    });
    Axis.prototype.drawAxis = function () {
        var ctx = this.canvas.ctx;
        var viewport = this.axisViewport;
        if (ctx) {
            ctx.strokeStyle = this.optionsDraw.lineColor;
            ctx.lineWidth = this.optionsDraw.lineWidth;
            ctx.setLineDash(this.optionsDraw.lineDash);
            ctx.beginPath();
            ctx.moveTo(viewport.x1, viewport.y1);
            ctx.lineTo(viewport.x2, viewport.y2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    };
    Axis.prototype.drawAxisName = function () {
        var ctx = this.canvas.ctx;
        var viewport = this.canvas.viewport;
        var xCoord = 0;
        var yCoord = 0;
        (this.type == 'horizontal') ? xCoord = viewport.midX : ((this.namePosition == 'start') ? xCoord = viewport.x1 : xCoord = viewport.x2);
        (this.type == 'vertical') ? yCoord = viewport.midY : ((this.namePosition == 'start') ? yCoord = viewport.y2 : yCoord = viewport.y1);
        var coord = new Point_1.Point(xCoord, yCoord);
        if ((this.name) && (ctx)) {
            this.label.draw(ctx, coord, this.name);
        }
    };
    return Axis;
}());
exports.Axis = Axis;

},{"./Canvas":7,"./Grid":10,"./Label":11,"./Point":14,"./Rectangle":15,"./Ticks":16,"signals":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackGround = void 0;
var Canvas_1 = require("./Canvas");
var BackGround = /** @class */ (function () {
    function BackGround(type, container) {
        this.type = 'default';
        this.type = type;
        this.canvas = new Canvas_1.Canvas(container);
        this.canvas.canvas.style.zIndex = "1";
    }
    BackGround.prototype.draw = function (xCoord, yCoord) {
        this.canvas.clear();
        switch (this.type) {
            case 'coloredGrid_cbh':
                this.drawColoredGrid(xCoord, yCoord);
                break;
        }
    };
    BackGround.prototype.drawColoredGrid = function (xCoord, yCoord) {
        var ctx = this.canvas.ctx;
        if (ctx) {
            ctx.globalAlpha = 0.1;
            var colorPalette = ['#8CCB76', '#BED68D', '#E7D180', '#CC9263', '#CF5031'];
            for (var i = 0; i < xCoord.length - 1; i++) {
                ctx.fillStyle = colorPalette[i];
                ctx.fillRect(xCoord[i].x, yCoord[0].y, xCoord[i + 1].x - xCoord[i].x, yCoord[yCoord.length - 1].y - yCoord[0].y);
            }
            for (var i = 0; i < yCoord.length - 1; i++) {
                ctx.fillStyle = colorPalette[i];
                ctx.fillRect(xCoord[0].x, yCoord[i].y, xCoord[xCoord.length - 1].x - xCoord[0].x, yCoord[i + 1].y - yCoord[i].y);
            }
            ctx.globalAlpha = 1;
        }
    };
    return BackGround;
}());
exports.BackGround = BackGround;

},{"./Canvas":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
var signals_1 = require("signals");
var Point_1 = require("./Point");
var Rectangle_1 = require("./Rectangle");
var canvasDpiScaler = require('canvas-dpi-scaler');
var Canvas = /** @class */ (function () {
    function Canvas(container) {
        var _this = this;
        var paddings = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paddings[_i - 1] = arguments[_i];
        }
        this.isSquare = false;
        this.lineWidth = 1;
        this.color = 'black';
        this.onPaddingsSetted = new signals_1.Signal();
        this.mouseMoved = new signals_1.Signal();
        this.mouseOuted = new signals_1.Signal();
        this.touchEnded = new signals_1.Signal();
        this.resized = new signals_1.Signal();
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;
        this.container.appendChild(this.canvas);
        this._ctx = this.canvas.getContext('2d');
        //bind
        this.clear = this.clear.bind(this);
        //listeners
        window.addEventListener('resize', function () { _this.resize(); });
        //call methods
        this.setPaddings.apply(this, paddings);
        this.resize();
    }
    Canvas.prototype.turnOnListenres = function () {
        var _this = this;
        this.canvas.addEventListener('mousemove', function (event) {
            _this.mouseCoords = _this.getMouseCoords(event);
            if (_this.inDrawArea) {
                _this.mouseMoved.dispatch();
            }
            else {
                _this.mouseCoords = new Point_1.Point(_this.viewport.x2, _this.viewport.zeroY);
                _this.mouseOuted.dispatch();
            }
        });
        this.canvas.addEventListener('mouseleave', function (event) {
            _this.mouseCoords = new Point_1.Point(_this.viewport.x2, _this.viewport.zeroY);
            _this.mouseOuted.dispatch();
        });
        this.canvas.addEventListener('touchmove', function (event) {
            _this.mouseCoords = _this.getTouchCoords(event);
            if (_this.inDrawArea) {
                _this.mouseMoved.dispatch();
            }
            else {
                _this.mouseCoords = new Point_1.Point(_this.viewport.x2, _this.viewport.zeroY);
                _this.mouseOuted.dispatch();
            }
        });
        this.canvas.addEventListener('touchend', function (event) {
            _this.mouseCoords = new Point_1.Point(_this.viewport.x2, _this.viewport.zeroY);
            _this.touchEnded.dispatch();
        });
        this.mouseCoords = new Point_1.Point(this.viewport.x2, this.viewport.zeroY);
    };
    Canvas.prototype.addOnPage = function () {
        this.container.appendChild(this.canvas);
    };
    Object.defineProperty(Canvas.prototype, "inDrawArea", {
        get: function () {
            if (this.mouseCoords.x < 0)
                return false;
            if (this.mouseCoords.x > this.viewport.width)
                return false;
            if (this.mouseCoords.y < 0)
                return false;
            if (this.mouseCoords.y > this.viewport.height)
                return false;
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.setPaddings = function () {
        var paddings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paddings[_i] = arguments[_i];
        }
        var fields = {};
        var defaultPad = 50;
        switch (paddings.length) {
            case 0:
                this.top = defaultPad;
                this.right = defaultPad;
                this.bottom = defaultPad;
                this.left = defaultPad;
                break;
            case 1:
                this.top = paddings[0];
                this.right = defaultPad;
                this.bottom = defaultPad;
                this.left = defaultPad;
                break;
            case 2:
                this.top = paddings[0];
                this.right = paddings[1];
                this.bottom = paddings[0];
                this.left = paddings[1];
                break;
            case 3:
                this.top = paddings[0];
                this.right = paddings[1];
                this.bottom = paddings[2];
                this.left = defaultPad;
                break;
            case 4:
                this.top = paddings[0];
                this.right = paddings[1];
                this.bottom = paddings[2];
                this.left = paddings[3];
                break;
        }
        this.mouseCoords = new Point_1.Point(this.viewport.x2, this.viewport.zeroY);
        this.onPaddingsSetted.dispatch();
        return;
    };
    Object.defineProperty(Canvas.prototype, "ctx", {
        get: function () {
            return this._ctx;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "squareRes", {
        set: function (res) {
            this.isSquare = res;
            this.resize();
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.resize = function () {
        if (this.isSquare) {
            var w = this.container.getBoundingClientRect().width;
            var h = this.container.getBoundingClientRect().height;
            this.width = Math.min(w, h);
            this.height = Math.min(w, h);
        }
        else {
            this.width = this.container.getBoundingClientRect().width;
            this.height = this.container.getBoundingClientRect().height;
        }
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width.toString() + 'px';
        this.canvas.style.height = this.height.toString() + 'px';
        canvasDpiScaler(this.canvas, this._ctx, this.width, this.height);
        this.resized.dispatch();
    };
    Canvas.prototype.clear = function () {
        if (this._ctx)
            this._ctx.clearRect(0, 0, this.width, this.height);
    };
    Object.defineProperty(Canvas.prototype, "viewport", {
        get: function () {
            return new Rectangle_1.Rectangle(this.left, this.top, this.width - this.right, this.height - this.bottom);
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.drawVp = function () {
        var rect = this.viewport;
        // @ts-ignore
        this.ctx.rect(rect.x1, rect.y1, rect.width, rect.height);
        if (this.ctx) {
            this.ctx.strokeStyle = this.color;
            this.ctx.fillStyle = this.color;
            this.ctx.lineWidth = this.lineWidth;
        }
        // @ts-ignore
        this.ctx.stroke();
    };
    // @ts-ignore
    Canvas.prototype.getMouseCoords = function (event) {
        var bcr = this.canvas.getBoundingClientRect();
        return new Point_1.Point(event.clientX - bcr.left - this.viewport.x1, event.clientY - bcr.top - this.viewport.y1);
    };
    // @ts-ignore
    Canvas.prototype.getTouchCoords = function (event) {
        var clientX = event.touches[0].clientX;
        var clientY = event.touches[0].clientY;
        var bcr = this.canvas.getBoundingClientRect();
        return new Point_1.Point(clientX - bcr.left - this.viewport.x1, clientY - bcr.top - this.viewport.y1);
    };
    Canvas.prototype.clipCanvas = function () {
        var rect = this.viewport;
        var squarePath = new Path2D();
        squarePath.rect(rect.x1, rect.y1, rect.width, rect.height);
        // @ts-ignore
        this._ctx.clip(squarePath);
    };
    return Canvas;
}());
exports.Canvas = Canvas;

},{"./Point":14,"./Rectangle":15,"canvas-dpi-scaler":2,"signals":3}],8:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chart = void 0;
var Canvas_1 = require("./Canvas");
var Data_1 = require("./Data");
var Plot_1 = require("./Plot");
var Axis_1 = require("./Axis");
var Transformer_1 = require("./Transformer");
var Rectangle_1 = require("./Rectangle");
var Point_1 = require("./Point");
var BackGround_1 = require("./BackGround");
var signals_1 = require("signals");
var SeriesBase_1 = require("./series/SeriesBase");
var SeriesXY_1 = require("./series/SeriesXY");
var Chart = /** @class */ (function () {
    function Chart(container, xMinMax, yMinMax) {
        this.hasBorder = false;
        this.clipSeriesCanvas = false;
        //signals
        this.tooltipsDataIndexUpdated = new signals_1.Signal();
        this.container = container;
        this.canvasTT = new Canvas_1.Canvas(container);
        this.canvasTT.turnOnListenres();
        this.canvasTT.canvas.style.zIndex = "4";
        this.data = new Data_1.Data();
        this.plots = [];
        this.xAxis = new Axis_1.Axis(xMinMax, 'horizontal', container);
        this.yAxis = new Axis_1.Axis(yMinMax, 'vertical', container);
        //bind
        this.tooltipsDraw = this.tooltipsDraw.bind(this);
        this.seriesReDraw = this.seriesReDraw.bind(this);
        //call methods
        this.bindChildSignals();
        this.tooltipsDraw(true);
    }
    Chart.prototype.refresh = function () {
        this.xAxis.refresh();
        this.yAxis.refresh();
    };
    Chart.prototype.switchResolution = function () {
        this.xAxis.canvas.squareRes = true;
        this.yAxis.canvas.squareRes = true;
        this.canvasTT.squareRes = true;
        if (this.background)
            this.background.canvas.squareRes = true;
        this.data.seriesStorage.forEach(function (series, ind) {
            series.canvas.squareRes = true;
        });
    };
    Chart.prototype.bindChildSignals = function () {
        var _this = this;
        this.xAxis.onRefreshed.add(function () {
            _this.seriesUpdatePlotData();
            _this.tooltipsDraw(true);
        });
        this.yAxis.onRefreshed.add(function () {
            _this.seriesUpdatePlotData();
            _this.tooltipsDraw(true);
        });
        //min max
        this.xAxis.onMinMaxSetted.add(function (hasPlotAnimation) {
            // @ts-ignore
            if (hasPlotAnimation)
                _this.seriesUpdatePlotData();
            _this.tooltipsDraw(true);
        });
        //min max
        this.yAxis.onMinMaxSetted.add(function (hasPlotAnimation) {
            if (hasPlotAnimation)
                _this.seriesUpdatePlotData();
            _this.tooltipsDraw(true);
        });
        // canvas
        this.canvasTT.mouseMoved.add(this.tooltipsDraw);
        this.canvasTT.mouseOuted.add(function () {
            _this.tooltipsDraw(true);
        });
        this.canvasTT.touchEnded.add(function () {
            _this.tooltipsDraw(true);
        });
    };
    Object.defineProperty(Chart.prototype, "axisRect", {
        get: function () {
            return (new Rectangle_1.Rectangle(this.xAxis.min, this.yAxis.min, this.xAxis.max, this.yAxis.max));
        },
        enumerable: false,
        configurable: true
    });
    // генерируем PlotData у series
    Chart.prototype.seriesUpdatePlotData = function () {
        var _this = this;
        this.data.seriesStorage.forEach(function (series, ind) {
            series.updatePlotData(_this.axisRect, series.canvas.viewport);
        });
    };
    // отрисовка одной серии
    Chart.prototype.seriesReDraw = function (series) {
        var _this = this;
        var canvas = series.canvas;
        canvas.clear();
        if (this.clipSeriesCanvas)
            canvas.clipCanvas();
        series.plots.forEach(function (plotId) {
            var plot = _this.findPlotById(plotId);
            if (plot) {
                // @ts-ignore
                plot.drawPlot(canvas.ctx, series.plotDataArr, canvas.viewport, series.plotLabels);
            }
            ;
        });
        this.tooltipsDraw(true);
    };
    Chart.prototype.setCanvasPaddings = function () {
        var _a, _b, _c, _d;
        var paddings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paddings[_i] = arguments[_i];
        }
        (_a = this.canvasTT).setPaddings.apply(_a, paddings);
        (_b = this.xAxis.canvas).setPaddings.apply(_b, paddings);
        (_c = this.yAxis.canvas).setPaddings.apply(_c, paddings);
        if (this.background)
            (_d = this.background.canvas).setPaddings.apply(_d, paddings);
        this.data.seriesStorage.forEach(function (series, ind) {
            var _a;
            (_a = series.canvas).setPaddings.apply(_a, paddings);
        });
    };
    Chart.prototype.addBackGround = function (type) {
        var _this = this;
        this.background = new BackGround_1.BackGround(type, this.container);
        //ticks
        this.xAxis.ticks.onCoordsChanged.add(function () {
            _this.backgroundDraw();
        });
        this.yAxis.ticks.onCoordsChanged.add(function () {
            _this.backgroundDraw();
        });
        this.background.canvas.resized.add(function () {
            _this.backgroundDraw();
        });
        this.backgroundDraw();
    };
    Chart.prototype.backgroundDraw = function () {
        if (this.background)
            this.background.draw(this.xAxis.ticks.coords, this.yAxis.ticks.coords);
    };
    Chart.prototype.addPlot = function (id, type) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        var plot = new (Plot_1.Plot.bind.apply(Plot_1.Plot, __spreadArrays([void 0, id, type], options)))();
        this.plots.push(plot);
        return plot;
    };
    Chart.prototype.findPlotById = function (id) {
        var plots = this.plots.filter(function (plot) {
            return plot.id === id;
        });
        if (plots.length !== 0)
            return plots[0];
        return null;
    };
    Chart.prototype.addSeries = function (id, seriesData, labels) {
        var _this = this;
        var newSeries = new SeriesXY_1.SeriesXY(id, this.container, seriesData, labels);
        this.data.seriesStorage.push(newSeries);
        newSeries.canvas.setPaddings(this.canvasTT.top, this.canvasTT.right, this.canvasTT.bottom, this.canvasTT.left);
        newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        newSeries.onPlotDataChanged.add(this.seriesReDraw);
        newSeries.onSeriesDataChanged.add(function (series) {
            series.updatePlotData(_this.axisRect, series.canvas.viewport);
        });
        newSeries.canvas.resized.add(function () {
            newSeries.updatePlotData(_this.axisRect, newSeries.canvas.viewport, true);
        });
        newSeries.canvas.onPaddingsSetted.add(function () {
            newSeries.updatePlotData(_this.axisRect, newSeries.canvas.viewport, true);
        });
        return newSeries;
    };
    Chart.prototype.addSeriesRow = function (id, seriesData) {
        var _this = this;
        var newSeries = new SeriesBase_1.SeriesBase(id, this.container, seriesData);
        this.data.seriesStorage.push(newSeries);
        newSeries.canvas.setPaddings(this.canvasTT.top, this.canvasTT.right, this.canvasTT.bottom, this.canvasTT.left);
        newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        newSeries.onPlotDataChanged.add(this.seriesReDraw);
        newSeries.onSeriesDataChanged.add(function (series) {
            series.updatePlotData(_this.axisRect, series.canvas.viewport);
        });
        newSeries.canvas.resized.add(function () {
            newSeries.updatePlotData(_this.axisRect, newSeries.canvas.viewport, true);
        });
        newSeries.canvas.onPaddingsSetted.add(function () {
            newSeries.updatePlotData(_this.axisRect, newSeries.canvas.viewport, true);
        });
        return newSeries;
    };
    Chart.prototype.switchDataAnimation = function (hasAnimation, duration) {
        this.data.seriesStorage.forEach(function (series, ind) {
            series.hasAnimation = hasAnimation;
            if (duration)
                series.animationDuration = duration;
        });
    };
    // отрисовываем тултипы
    Chart.prototype.tooltipsDraw = function (drawLast) {
        var _this = this;
        this.canvasTT.clear();
        var mouseXY = this.canvasTT.mouseCoords;
        var transformer = new Transformer_1.Transformer();
        var delta_abs_buf = [];
        var delta_abs_buf_coord = [];
        // @ts-ignore
        var data_y_end_buf = [];
        this.data.seriesStorage.forEach(function (series) {
            var seriesX = _this.xAxis.min + mouseXY.x * (_this.xAxis.length) / _this.canvasTT.viewport.width;
            var seriesY = _this.yAxis.max - mouseXY.y * (_this.yAxis.length) / _this.canvasTT.viewport.height;
            var sriesP = new Point_1.Point(seriesX, seriesY);
            var _a = series.getClosestDataPointX(sriesP), pointData = _a[0], tt_ind = _a[1];
            var _b = series.getClosestDataPointXY(sriesP), pointDataXY = _b[0], tt_ind_XY = _b[1];
            var tooltipCoordX = series.getClosestPlotPointX(new Point_1.Point(mouseXY.x + _this.canvasTT.left, mouseXY.y + _this.canvasTT.top));
            var tooltipCoordXY = series.getClosestPlotPointXY(new Point_1.Point(mouseXY.x + _this.canvasTT.left, mouseXY.y + _this.canvasTT.top));
            _this.tooltipsDataIndexUpdated.dispatch(pointData.x);
            var tooltipCoord = transformer.getVeiwportCoord(_this.axisRect, _this.canvasTT.viewport, pointData);
            series.plots.forEach(function (plotId) {
                var plot = _this.findPlotById(plotId);
                if (plot) {
                    plot.tooltips.forEach(function (tooltip) {
                        if (drawLast) {
                            switch (tooltip.type) {
                                case 'data_y_end':
                                    data_y_end_buf.push([tooltip, tooltipCoordX, pointData]);
                                    break;
                                case 'circle_series':
                                    // @ts-ignore
                                    tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, new Point_1.Point(tooltipCoordX.x, tooltipCoordX.y), pointData);
                                    break;
                            }
                        }
                        else {
                            switch (tooltip.type) {
                                case 'delta_abs':
                                    if (delta_abs_buf.length == 0) {
                                        delta_abs_buf.push(pointData);
                                        delta_abs_buf_coord.push(tooltipCoordX);
                                    }
                                    else {
                                        var ttCoord = (delta_abs_buf_coord[0].y < tooltipCoordX.y) ? delta_abs_buf_coord[0] : tooltipCoordX;
                                        var absData = new Point_1.Point(Math.abs(pointData.x - delta_abs_buf[0].x), Math.abs(pointData.y - delta_abs_buf[0].y));
                                        // @ts-ignore
                                        tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, ttCoord, absData);
                                        delta_abs_buf.pop();
                                        delta_abs_buf_coord.pop();
                                    }
                                    break;
                                case 'data_y_end':
                                    data_y_end_buf.push([tooltip, tooltipCoordX, pointData]);
                                    break;
                                case 'label_x_start':
                                    // @ts-ignore
                                    tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, new Point_1.Point(tooltipCoordX.x, tooltipCoordX.y), pointData, tt_ind);
                                    break;
                                case 'line_vertical_full':
                                    // @ts-ignore
                                    tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, new Point_1.Point(tooltipCoordX.x, tooltipCoordX.y), pointData);
                                    break;
                                case 'data_label':
                                    // @ts-ignore
                                    tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, new Point_1.Point(tooltipCoordXY.x, tooltipCoordXY.y), pointDataXY, tt_ind_XY);
                                    // @ts-ignore
                                    if (plot.type == 'unicode')
                                        plot.drawPlot(_this.canvasTT.ctx, [tooltipCoordXY], _this.canvasTT.viewport, '', true);
                                    break;
                                default:
                                    // @ts-ignore
                                    tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, new Point_1.Point(tooltipCoordX.x, tooltipCoordX.y), pointData);
                                    break;
                            }
                        }
                    });
                }
                ;
            });
        });
        // рассталкиваем друг от друга боковые тултипы
        // @ts-ignore
        data_y_end_buf.sort(function (a, b) { return a[1].y - b[1].y; });
        var hasOverlap = true;
        var counter = 0;
        while ((hasOverlap) && (counter < data_y_end_buf.length * data_y_end_buf.length)) {
            // код
            // также называемый "телом цикла"
            counter = counter + 1;
            for (var i = 0; i < data_y_end_buf.length - 1; i++) {
                // @ts-ignore
                var rect1 = data_y_end_buf[i][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i][1], data_y_end_buf[i][2], 0, false);
                // @ts-ignore
                var rect2 = data_y_end_buf[i + 1][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i + 1][1], data_y_end_buf[i + 1][2], 0, false);
                if (rect1.y2 > rect2.y1) {
                    var abs = Math.abs(rect1.y2 - rect2.y1);
                    var abs1 = -abs * 0.5;
                    var abs2 = abs * 0.5;
                    if (Math.abs(rect1.y1 - this.canvasTT.viewport.y1) < Math.abs(abs1)) {
                        abs1 = -Math.abs(rect1.y1 - this.canvasTT.viewport.y1);
                        abs2 = (abs + abs1);
                    }
                    if (Math.abs(rect2.y2 - this.canvasTT.viewport.y2) < abs2) {
                        abs2 = -Math.abs(rect1.y2 - this.canvasTT.viewport.y2);
                        abs1 = -(abs - abs2);
                    }
                    // @ts-ignore
                    data_y_end_buf[i][1].y = data_y_end_buf[i][1].y + abs1;
                    // @ts-ignore
                    data_y_end_buf[i + 1][1].y = data_y_end_buf[i + 1][1].y + abs2;
                }
            }
            hasOverlap = false;
            for (var i = 0; i < data_y_end_buf.length - 1; i++) {
                // @ts-ignore
                var rect1 = data_y_end_buf[i][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i][1], data_y_end_buf[i][2], 0, false);
                // @ts-ignore
                var rect2 = data_y_end_buf[i + 1][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i + 1][1], data_y_end_buf[i + 1][2], 0, false);
                if (rect1.y2 > rect2.y1) {
                    hasOverlap = true;
                }
            }
        }
        // @ts-ignore
        data_y_end_buf.forEach(function (ttRow) {
            ttRow[0].drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, ttRow[1], ttRow[2], 0, true);
        });
    };
    return Chart;
}());
exports.Chart = Chart;

},{"./Axis":5,"./BackGround":6,"./Canvas":7,"./Data":9,"./Plot":13,"./Point":14,"./Rectangle":15,"./Transformer":18,"./series/SeriesBase":19,"./series/SeriesXY":20,"signals":3}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
var Data = /** @class */ (function () {
    function Data() {
        this.seriesStorage = [];
    }
    Data.prototype.findExtremes = function (type, from, to) {
        var maxArr = [];
        var minArr = [];
        this.seriesStorage.forEach(function (series) {
            var dataRange;
            if ((from !== undefined) && (to !== undefined)) {
                dataRange = series.getDataRange(type, from, to);
            }
            else {
                dataRange = series.seriesData;
            }
            var extremes = series.findExtremes(dataRange);
            switch (type) {
                case 'ind':
                    if (extremes[2] !== undefined)
                        minArr.push(extremes[2]);
                    if (extremes[3] !== undefined)
                        maxArr.push(extremes[3]);
                    break;
                case 'val':
                    if (extremes[0] !== undefined)
                        minArr.push(extremes[0]);
                    if (extremes[1] !== undefined)
                        maxArr.push(extremes[1]);
                    break;
            }
        });
        return [Math.min.apply(Math, minArr), Math.max.apply(Math, maxArr)];
    };
    Data.prototype.findSeriesById = function (id) {
        var series = this.seriesStorage.filter(function (series) {
            return series.id === id;
        });
        if (series.length !== 0)
            return series[0];
        return null;
    };
    Data.prototype.switchAllSeriesAnimation = function (hasAnimation, duration) {
        this.seriesStorage.forEach(function (series, ind) {
            series.hasAnimation = hasAnimation;
            if (duration)
                series.animationDuration = duration;
        });
    };
    Data.prototype.changeAllSeriesAnimationTimeFunction = function (newTimeFunc) {
        this.seriesStorage.forEach(function (series, ind) {
            series.timeFunc = newTimeFunc;
        });
    };
    return Data;
}());
exports.Data = Data;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var signals_1 = require("signals");
var Grid = /** @class */ (function () {
    function Grid(type) {
        this.display = false;
        this.onOptionsSetted = new signals_1.Signal();
        this.type = type;
        this.width = 1;
        this.color = 'black';
        this.lineDash = [1, 0];
    }
    Grid.prototype.setOptions = function (display, color, width, lineDash) {
        this.display = display;
        this.width = width;
        this.color = color;
        this.lineDash = lineDash;
        this.onOptionsSetted.dispatch();
    };
    Grid.prototype.draw = function (ctx, vp, coords) {
        var _this = this;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.setLineDash(this.lineDash);
        coords.forEach(function (tick) {
            ctx.beginPath();
            switch (_this.type) {
                case 'vertical':
                    ctx.moveTo(vp.x1, tick.y);
                    ctx.lineTo(vp.x2, tick.y);
                    break;
                case 'horizontal':
                    ctx.moveTo(tick.x, vp.y1);
                    ctx.lineTo(tick.x, vp.y2);
                    break;
            }
            ;
            ctx.stroke();
        });
        ctx.setLineDash([]);
    };
    return Grid;
}());
exports.Grid = Grid;

},{"signals":3}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = void 0;
var Point_1 = require("./Point");
var signals_1 = require("signals");
var Rectangle_1 = require("./Rectangle");
var Label = /** @class */ (function () {
    function Label(type) {
        this.display = true;
        this.color = 'black';
        this.color_counter = 0;
        this.fontFamily = 'serif';
        this.fontSize = 16;
        this.isScalebale = false;
        this.fontTarget = 12;
        this.fontBase = 1000;
        this.position = 'bottom';
        this.offset = 0;
        this.rotationAngle = 0;
        this.isUpperCase = false;
        this.fontSizeList = [];
        this.queryList = [];
        this.hasOutline = false;
        this.onOptionsSetted = new signals_1.Signal();
        switch (type) {
            case 'vertical':
                this.position = 'left';
                break;
            case 'horizontal':
                this.position = 'bottom';
                break;
        }
    }
    Label.prototype.setOptions = function (display, color, position, offset, fontOptions, colorArr) {
        this.color = color || 'black';
        this.position = position || 'bottom';
        this.offset = offset || 0;
        this.display = display;
        if (colorArr) {
            this.colorArr = colorArr;
            this.color_counter = 0;
        }
        if (fontOptions) {
            this.fontFamily = fontOptions[1];
            this.fontSize = +fontOptions[0];
            if (fontOptions[2] !== undefined) {
                if (fontOptions[3] !== undefined) {
                    this.fontSizeList = fontOptions[3];
                }
                if (fontOptions[4] !== undefined) {
                    this.queryList = fontOptions[4];
                }
                this.turnOnMediaQueries();
            }
        }
        this.onOptionsSetted.dispatch();
        return this;
    };
    Label.prototype.turnOnMediaQueries = function () {
        var _this = this;
        this.queryList.forEach(function (q, ind) {
            var mediaQuery = window.matchMedia(q);
            mediaQuery.addEventListener("change", function () {
                if (mediaQuery.matches) {
                    _this.fontSize = _this.fontSizeList[ind];
                }
            });
        });
    };
    Label.prototype.calculateFontSize = function (ctx) {
        if (this.isScalebale) {
            var size = this.getRowHeight(ctx);
            var fontString = size + "px " + this.fontFamily;
            return fontString;
        }
        else {
            var fontString = this.fontSize + "px " + this.fontFamily;
            return fontString;
        }
    };
    Label.prototype.getRowHeight = function (ctx) {
        if (this.isScalebale) {
            var canvasWidth = ctx.canvas.clientWidth;
            var ratio = this.fontTarget / this.fontBase; // calc ratio
            var size = canvasWidth * ratio;
            if (size > this.fontSize) {
                size = this.fontSize;
            }
            return size;
        }
        else {
            return this.fontSize;
        }
    };
    Object.defineProperty(Label.prototype, "font", {
        get: function () {
            var fontString = this.fontSize + "px " + this.fontFamily;
            return fontString;
        },
        enumerable: false,
        configurable: true
    });
    Label.prototype.setOutline = function (options) {
        this.hasOutline = true;
        this.outlineOptions = options;
    };
    Label.prototype.setOffset = function (x, y) {
        this.offsetX = x;
        this.offsetY = y;
        this.onOptionsSetted.dispatch();
    };
    Label.prototype.addOffset = function (labelCoord) {
        if (this.offsetX && this.offsetY) {
            labelCoord.y = labelCoord.y - this.offsetY;
            labelCoord.x = labelCoord.x + this.offsetX;
        }
        else
            switch (this.position) {
                case 'top':
                    labelCoord.y = labelCoord.y - this.offset - this.fontSize * 0.5;
                    break;
                case 'bottom':
                    labelCoord.y = labelCoord.y + this.offset + this.fontSize * 0.5;
                    break;
                case 'left':
                    labelCoord.x = labelCoord.x - this.offset;
                    break;
                case 'right':
                    labelCoord.x = labelCoord.x + this.offset;
                    break;
            }
    };
    Label.prototype.draw = function (ctx, coord, labeltext) {
        if (this.colorArr) {
            ctx.fillStyle = this.colorArr[this.color_counter];
            this.color_counter = this.color_counter + 1;
            if (this.color_counter == this.colorArr.length)
                this.color_counter = 0;
        }
        else {
            ctx.fillStyle = this.color;
        }
        //ctx.font = this.calculateFontSize(ctx);
        ctx.font = this.font;
        ctx.textBaseline = 'middle';
        if ((this.isUpperCase) && (typeof labeltext == 'string')) {
            labeltext = labeltext.toUpperCase();
        }
        var text = ctx.measureText(labeltext);
        var labelCoord = new Point_1.Point(coord.x - text.width * 0.5, coord.y);
        this.addOffset(labelCoord);
        var printText = labeltext;
        if (this.units)
            printText = labeltext + this.units;
        if (this.rotationAngle !== 0) {
            ctx.save();
            ctx.translate(labelCoord.x + text.width * 0.5, labelCoord.y + this.fontSize * 0.5);
            ctx.rotate((Math.PI / 180) * this.rotationAngle);
            ctx.translate(-labelCoord.x - text.width * 0.5, -labelCoord.y - this.fontSize * 0.5);
            ctx.fillText(printText, labelCoord.x, labelCoord.y);
            ctx.restore();
        }
        else {
            if (this.hasOutline) {
                this.drawOutline(ctx, labelCoord, printText);
            }
            ctx.fillText(printText, labelCoord.x, labelCoord.y);
        }
    };
    Label.prototype.drawOutline = function (ctx, coord, text) {
        if (this.outlineOptions) {
            ctx.lineWidth = this.outlineOptions.width;
            ctx.strokeStyle = this.outlineOptions.color;
            ctx.strokeText(text, coord.x, coord.y);
        }
    };
    Label.prototype.getlabelRect = function (ctx, coord, labeltext) {
        ctx.font = this.font;
        var text = ctx.measureText(labeltext);
        var labelCoord = new Point_1.Point(coord.x - text.width * 0.5, coord.y);
        this.addOffset(labelCoord);
        var textYgap = 0;
        if (this.font.indexOf('Transcript Pro') !== -1) {
            textYgap = 2;
        }
        var labelRect = new Rectangle_1.Rectangle(labelCoord.x, labelCoord.y - this.fontSize * 0.5, labelCoord.x + text.width, labelCoord.y + this.fontSize * 0.5 - textYgap);
        return labelRect;
    };
    return Label;
}());
exports.Label = Label;

},{"./Point":14,"./Rectangle":15,"signals":3}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Legend = void 0;
var Label_1 = require("./Label");
var Legend = /** @class */ (function () {
    function Legend(text, getCoord) {
        this.text = text;
        this.label = new Label_1.Label();
        this.getCoord = getCoord;
        return this;
    }
    Legend.prototype.draw = function (ctx, vp) {
        var _this = this;
        var coord = this.getCoord(vp);
        this.text.forEach(function (textrow) {
            _this.label.draw(ctx, coord, textrow);
            coord.y = coord.y + _this.label.fontSize;
        });
    };
    return Legend;
}());
exports.Legend = Legend;

},{"./Label":11}],13:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plot = void 0;
var Point_1 = require("./Point");
var Tooltip_1 = require("./Tooltip");
var Label_1 = require("./Label");
//описание класса
var Plot = /** @class */ (function () {
    function Plot(id, type) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        this._id = id;
        this.type = type;
        this._options = {
            lineWidth: 0.5,
            lineColor: '#000000',
            brushColor: '#000000',
            mainSize: 1,
            fontSize: 10,
            char: '1',
            lineDash: [],
            lineJoin: 'miter',
        };
        this.setOptions(options);
        this.tooltips = [];
        this.label = new Label_1.Label(this.type);
        return this;
    }
    Plot.prototype.setOptions = function (options) {
        switch (this.type) {
            case 'dotted':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
                break;
            case 'line':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.lineDash = options[2];
                if (options[3])
                    this._options.lineJoin = options[3];
                break;
            case 'area':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                break;
            case 'area_bottom':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                break;
            case 'unicode':
                this._options.fontSize = options[0];
                this._options.brushColor = options[1];
                this._options.char = options[2];
                break;
            case 'text':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                break;
        }
    };
    Object.defineProperty(Plot.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Plot.prototype.drawPlot = function (ctx, plotData, vp, labels, highlighted) {
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.globalAlpha = 1;
        ctx.fillStyle = this._options.brushColor;
        ctx.lineJoin = this._options.lineJoin;
        switch (this.type) {
            case 'dotted':
                this.drawDotted(ctx, plotData);
                break;
            case 'line':
                this.drawLine(ctx, plotData);
                break;
            case 'area':
                this.drawArea(ctx, plotData, vp);
                break;
            case 'area_bottom':
                this.drawArea(ctx, plotData, vp);
                break;
            case 'unicode':
                this.drawUnicode(ctx, plotData, highlighted);
                break;
            case 'text':
                this.drawText(ctx, plotData, labels);
                break;
        }
    };
    Plot.prototype.drawDotted = function (ctx, plotData) {
        for (var i = 0; i < plotData.length; i++) {
            ctx.beginPath();
            ctx.arc(plotData[i].x, plotData[i].y, this._options.mainSize, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    };
    Plot.prototype.drawUnicode = function (ctx, plotData, highlighted) {
        ctx.font = this._options.fontSize + "px serif";
        ctx.textBaseline = 'middle';
        var text = ctx.measureText(this._options.char);
        for (var i = 0; i < plotData.length; i++) {
            ctx.globalAlpha = 1;
            ctx.fillText(this._options.char, plotData[i].x - text.width * 0.5, plotData[i].y);
            if (highlighted) {
                ctx.lineWidth = 7;
                ctx.globalAlpha = 0.3;
                ctx.strokeText(this._options.char, plotData[i].x - text.width * 0.5, plotData[i].y);
                ctx.globalAlpha = 1;
                ctx.fillText(this._options.char, plotData[i].x - text.width * 0.5, plotData[i].y);
            }
        }
    };
    Plot.prototype.drawText = function (ctx, plotData, labels) {
        var _this = this;
        for (var i = 0; i < plotData.length; i++) {
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(plotData[i].x, plotData[i].y - 10);
            ctx.lineTo(plotData[i].x, plotData[i].y - 25);
            ctx.stroke();
        }
        var _loop_1 = function (i) {
            var printText = labels[i];
            if (!printText)
                printText = '';
            var printTextArr = printText.split('\\n');
            printTextArr.forEach(function (row, ind, mas) {
                var coord = new Point_1.Point(plotData[i].x, plotData[i].y - (mas.length - ind - 1) * _this.label.getRowHeight(ctx));
                _this.label.draw(ctx, coord, row);
            });
        };
        for (var i = 0; i < plotData.length; i++) {
            _loop_1(i);
        }
    };
    Plot.prototype.drawLine = function (ctx, plotData) {
        ctx.setLineDash(this._options.lineDash);
        ctx.beginPath();
        ctx.moveTo(plotData[0].x, plotData[0].y);
        for (var i = 1; i < plotData.length; i++) {
            ctx.lineTo(plotData[i].x, plotData[i].y);
        }
        ctx.stroke();
    };
    Plot.prototype.drawArea = function (ctx, plotData, vp) {
        ctx.beginPath();
        if (this.type == 'area_bottom') {
            ctx.lineTo(vp.x1, vp.zeroY);
        }
        ctx.lineTo(plotData[0].x, plotData[0].y);
        for (var i = 1; i < plotData.length; i++) {
            ctx.lineTo(plotData[i].x, plotData[i].y);
        }
        if (this.type == 'area_bottom') {
            ctx.lineTo(vp.x2, vp.zeroY);
            //ctx.lineTo(vp.x1, vp.zeroY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    Plot.prototype.addTooltip = function (id, type) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        var tooltip = new (Tooltip_1.Tooltip.bind.apply(Tooltip_1.Tooltip, __spreadArrays([void 0, id, type], options)))();
        this.tooltips.push(tooltip);
        return tooltip;
    };
    Plot.prototype.findTooltipById = function (id) {
        var tooltips = this.tooltips.filter(function (tooltip) {
            return tooltip.id === id;
        });
        if (tooltips.length !== 0)
            return tooltips[0];
        return null;
    };
    return Plot;
}());
exports.Plot = Plot;

},{"./Label":11,"./Point":14,"./Tooltip":17}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var Point = /** @class */ (function () {
    function Point(x, y) {
        //this.x = Math.round(x);
        //this.y = Math.round(y);
        this.x = x;
        this.y = y;
    }
    Point.prototype.findDist = function (next) {
        var dist = Math.sqrt((this.x - next.x) * (this.x - next.x) + (this.y - next.y) * (this.y - next.y));
        return dist;
    };
    Point.prototype.findDistX = function (next) {
        var dist = Math.abs(this.x - next.x);
        return dist;
    };
    return Point;
}());
exports.Point = Point;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = void 0;
var Rectangle = /** @class */ (function () {
    function Rectangle(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.updateCoords(x1, y1, x2, y2);
    }
    Object.defineProperty(Rectangle.prototype, "width", {
        get: function () {
            return Math.abs(this.x1 - this.x2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        get: function () {
            return Math.abs(this.y1 - this.y2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "zeroX", {
        get: function () {
            return this.x1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "zeroY", {
        get: function () {
            return this.y2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "midX", {
        get: function () {
            return this.x1 + Math.abs(this.x2 - this.x1) * 0.5;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "midY", {
        get: function () {
            return this.y1 + Math.abs(this.y2 - this.y1) * 0.5;
        },
        enumerable: false,
        configurable: true
    });
    Rectangle.prototype.updateCoords = function (x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    };
    // @ts-ignore
    Rectangle.prototype.countDistBetweenRects = function (type, next) {
        switch (type) {
            case 'vertical':
                return this.y1 - next.y2;
                break;
            case 'horizontal':
                return this.x1 - next.x2;
                break;
        }
    };
    Rectangle.prototype.move = function (dx, dy) {
        this.x1 = this.x1 + dx;
        this.y1 = this.y1 + dy;
        this.x2 = this.x2 + dx;
        this.y2 = this.y2 + dy;
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;

},{}],16:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticks = void 0;
var signals_1 = require("signals");
var Point_1 = require("./Point");
var Rectangle_1 = require("./Rectangle");
var Label_1 = require("./Label");
var Transformer_1 = require("./Transformer");
var Ticks = /** @class */ (function () {
    function Ticks(axistype) {
        this.display = false;
        this.hasCustomLabels = false;
        this.hasAnimation = false;
        this.animationDuration = 300;
        this.timeFunc = function (time) {
            return time;
        };
        // параметры отрисовки тика
        this.linewidth = 2;
        this.tickSize = 5;
        this.color = 'black';
        this.lineDash = [];
        this.onOptionsSetted = new signals_1.Signal();
        this.onCustomLabelsAdded = new signals_1.Signal();
        this.onCoordsChanged = new signals_1.Signal();
        this.onCoordsChangedLast = new signals_1.Signal();
        this.coords = [];
        this.values = [];
        this.labels = [];
        this.type = axistype;
        this.label = new Label_1.Label(this.type);
        this.distributionType = 'default';
        this.count = 5;
        this.step = 100;
        this.bindChildSignals();
    }
    Ticks.prototype.switchAnimation = function (hasAnimation, duration) {
        this.hasAnimation = hasAnimation;
        if (duration)
            this.animationDuration = duration;
    };
    Ticks.prototype.bindChildSignals = function () {
    };
    Ticks.prototype.setCustomLabels = function (labels) {
        this.hasCustomLabels = true;
        this.customLabels = labels;
        this.onCustomLabelsAdded.dispatch();
    };
    Ticks.prototype.settickDrawOptions = function (length, width, color, lineDash) {
        this.linewidth = width;
        this.tickSize = length;
        this.color = color;
        if (lineDash)
            this.lineDash = lineDash;
    };
    Ticks.prototype.setOptions = function (display, distributionType) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        this.display = display;
        switch (distributionType) {
            case 'default':
                this.distributionType = distributionType;
                this.count = options[0];
                break;
            case 'fixedCount':
                this.distributionType = distributionType;
                this.count = options[0];
                break;
            case 'fixedStep':
                this.distributionType = distributionType;
                this.step = options[0];
                break;
            case 'customDateTicks':
                this.distributionType = distributionType;
                if (options.length !== 0)
                    this.customTicksOptions = options[0];
                break;
            case 'niceCbhStep':
                this.distributionType = distributionType;
                if (options.length !== 0)
                    this.customTicksOptions = options[0];
                break;
            case 'midStep':
                this.distributionType = distributionType;
                this.count = options[0];
                break;
            case 'zero':
                this.distributionType = distributionType;
                break;
            case 'min':
                this.distributionType = distributionType;
                break;
        }
        this.onOptionsSetted.dispatch();
    };
    Ticks.prototype.createTicks = function (min, max, vp, ctx, noAnimate) {
        var coords = [];
        switch (this.distributionType) {
            case 'default':
                coords = this.generateFixedCountTicks(min, max, vp);
                break;
            case 'fixedStep':
                coords = this.generateFixedStepTicks(min, max, vp);
                break;
            case 'fixedCount':
                coords = this.generateFixedCountTicks(min, max, vp);
                break;
            case 'customDateTicks':
                //coords = this.generateFixedCountTicksDate(min, max, vp);
                coords = this.generateCustomDateTicks(min, max, vp, ctx);
                break;
            case 'niceCbhStep':
                coords = this.generateNiceCbhTicks(min, max, vp);
                break;
            case 'midStep':
                coords = this.generateMidStep(min, max, vp);
                break;
            case 'zero':
                coords = this.generateOneTick(min, max, vp, 0);
                break;
            case 'min':
                coords = this.generateOneTick(min, max, vp, min);
                break;
        }
        //если нужна анимация тиков
        if ((this.hasAnimation) && (!noAnimate)) {
            var from = this.makeFromPointArr(this.coords, coords);
            if (from.length == 0) {
                this.coords = __spreadArrays(coords);
                this.onCoordsChanged.dispatch();
                this.onCoordsChangedLast.dispatch();
                return this;
            }
            this.coords = __spreadArrays(from);
            this.onCoordsChanged.dispatch();
            this.onCoordsChangedLast.dispatch();
            this.tickCoordAnimation(from, coords, this.animationDuration);
            return this;
        }
        this.coords = __spreadArrays(coords);
        this.onCoordsChanged.dispatch();
        this.onCoordsChangedLast.dispatch();
    };
    Ticks.prototype.generateOneTick = function (min, max, vp, value) {
        var coords = [];
        this.values = [];
        this.labels = [];
        var rectXY = [];
        var transformer = new Transformer_1.Transformer();
        switch (this.type) {
            case 'vertical':
                rectXY = [0, min, 1, max];
                break;
            case 'horizontal':
                rectXY = [min, 0, max, 1];
                break;
        }
        var fromRect = new Rectangle_1.Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
        var pointXY = [];
        if (this.hasCustomLabels) {
            // @ts-ignore
            this.labels.push(this.customLabels[0]);
        }
        else {
            this.labels.push(value.toFixed(2).toString());
        }
        switch (this.type) {
            case 'vertical':
                pointXY = [0, value];
                break;
            case 'horizontal':
                pointXY = [value, 0];
                break;
        }
        var valuePoint = new Point_1.Point(pointXY[0], pointXY[1]);
        var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
        coords.push(coordPoint);
        this.values.push(value);
        return coords;
    };
    Ticks.prototype.generateMidStep = function (min, max, vp) {
        var coords = [];
        this.values = [];
        this.labels = [];
        var stepCoord = 0;
        var rectXY = [];
        var transformer = new Transformer_1.Transformer();
        var stepValue = Math.abs(max - min) / (this.count);
        switch (this.type) {
            case 'vertical':
                stepCoord = vp.height / this.count;
                rectXY = [0, min, 1, max];
                break;
            case 'horizontal':
                stepCoord = vp.width / this.count;
                rectXY = [min, 0, max, 1];
                break;
        }
        var fromRect = new Rectangle_1.Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
        for (var i = 0; i <= this.count - 1; i++) {
            var pointXY = [];
            var value = min + i * stepValue + stepValue * 0.5;
            if (this.hasCustomLabels) {
                //value = Math.round(value);
                // @ts-ignore
                this.labels.push(this.customLabels[0]);
            }
            else {
                this.labels.push(value.toFixed(2).toString());
            }
            switch (this.type) {
                case 'vertical':
                    pointXY = [0, value];
                    break;
                case 'horizontal':
                    pointXY = [value, 0];
                    break;
            }
            var valuePoint = new Point_1.Point(pointXY[0], pointXY[1]);
            var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
            coords.push(coordPoint);
            this.values.push(value);
        }
        return coords;
    };
    Ticks.prototype.generateFixedCountTicksDate = function (min, max, vp) {
        var coords = [];
        this.values = [];
        this.labels = [];
        var stepCoord = 0;
        var rectXY = [];
        var transformer = new Transformer_1.Transformer();
        var stepValue = Math.abs(max - min) / this.count;
        switch (this.type) {
            case 'vertical':
                stepCoord = vp.height / this.count;
                rectXY = [0, min, 1, max];
                break;
            case 'horizontal':
                stepCoord = vp.width / this.count;
                rectXY = [min, 0, max, 1];
                break;
        }
        var fromRect = new Rectangle_1.Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
        for (var i = 0; i <= this.count; i++) {
            var pointXY = [];
            var value = min + i * stepValue;
            if (this.hasCustomLabels) {
                value = Math.round(value);
                // @ts-ignore
                this.labels.push(this.customLabels[value].toLocaleDateString('en'));
                //const labelText = (this.labels[ind]).toLocaleDateString('en');
            }
            else {
                this.labels.push(value.toFixed(2).toString());
            }
            switch (this.type) {
                case 'vertical':
                    pointXY = [0, value];
                    break;
                case 'horizontal':
                    pointXY = [value, 0];
                    break;
            }
            var valuePoint = new Point_1.Point(pointXY[0], pointXY[1]);
            var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
            coords.push(coordPoint);
            this.values.push(value);
        }
        return coords;
    };
    Ticks.prototype.generateFixedCountTicks = function (min, max, vp) {
        var coords = [];
        this.values = [];
        this.labels = [];
        var stepCoord = 0;
        var rectXY = [];
        var transformer = new Transformer_1.Transformer();
        var stepValue = Math.abs(max - min) / this.count;
        switch (this.type) {
            case 'vertical':
                stepCoord = vp.height / this.count;
                rectXY = [0, min, 1, max];
                break;
            case 'horizontal':
                stepCoord = vp.width / this.count;
                rectXY = [min, 0, max, 1];
                break;
        }
        var fromRect = new Rectangle_1.Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
        for (var i = 0; i <= this.count; i++) {
            var pointXY = [];
            var value = min + i * stepValue;
            if (this.hasCustomLabels) {
                value = Math.round(value);
                // @ts-ignore
                this.labels.push(this.customLabels[value]);
                //const labelText = (this.labels[ind]).toLocaleDateString('en');
            }
            else {
                this.labels.push(value.toFixed(2).toString());
            }
            switch (this.type) {
                case 'vertical':
                    pointXY = [0, value];
                    break;
                case 'horizontal':
                    pointXY = [value, 0];
                    break;
            }
            var valuePoint = new Point_1.Point(pointXY[0], pointXY[1]);
            var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
            coords.push(coordPoint);
            this.values.push(value);
        }
        return coords;
    };
    Ticks.prototype.generateFixedStepTicks = function (min, max, vp, step, toFixed) {
        var coords = [];
        this.values = [];
        this.labels = [];
        var rectXY = [];
        var tickStep = this.step;
        if (step) {
            tickStep = step;
        }
        var transformer = new Transformer_1.Transformer();
        switch (this.type) {
            case 'vertical':
                rectXY = [0, min, 1, max];
                break;
            case 'horizontal':
                rectXY = [min, 0, max, 1];
                break;
        }
        var fromRect = new Rectangle_1.Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
        var startValue = 0;
        var curValue = startValue;
        while (curValue < max) {
            if ((curValue >= min) && (curValue <= max)) {
                var pointXY = [];
                var value = curValue;
                if (this.hasCustomLabels) {
                    value = Math.round(curValue);
                    // @ts-ignore
                    this.labels.push(this.customLabels[value]);
                }
                else {
                    if (toFixed !== null) {
                        this.labels.push(value.toFixed(toFixed).toString());
                    }
                    else {
                        this.labels.push(value.toFixed(2).toString());
                    }
                }
                switch (this.type) {
                    case 'vertical':
                        pointXY = [0, value];
                        break;
                    case 'horizontal':
                        pointXY = [value, 0];
                        break;
                }
                var valuePoint = new Point_1.Point(pointXY[0], pointXY[1]);
                var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                coords.push(coordPoint);
                this.values.push(value);
            }
            curValue = curValue + tickStep;
        }
        curValue = startValue;
        curValue = curValue - tickStep;
        while (curValue > min) {
            if ((curValue >= min) && (curValue <= max)) {
                var pointXY = [];
                var value = curValue;
                if (this.hasCustomLabels) {
                    value = Math.round(curValue);
                    // @ts-ignore
                    this.labels.push(this.customLabels[value]);
                }
                else {
                    if (toFixed !== null) {
                        this.labels.push(value.toFixed(toFixed).toString());
                    }
                    else {
                        this.labels.push(value.toFixed(2).toString());
                    }
                }
                switch (this.type) {
                    case 'vertical':
                        pointXY = [0, value];
                        break;
                    case 'horizontal':
                        pointXY = [value, 0];
                        break;
                }
                var valuePoint = new Point_1.Point(pointXY[0], pointXY[1]);
                var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                coords.push(coordPoint);
                this.values.push(value);
            }
            curValue = curValue - tickStep;
        }
        return coords;
    };
    Ticks.prototype.generateNiceCbhTicks = function (min, max, vp) {
        var coords = [];
        var deviation = Math.abs(max - min);
        var devInd = 0;
        // @ts-ignore
        for (var j = 0; j < this.customTicksOptions.length; j++) {
            // @ts-ignore
            coords = this.generateFixedStepTicks(min, max, vp, this.customTicksOptions[j], 0);
            var maxValue = this.values.reduce(function (prev, element) {
                return (element > prev) ? element : prev;
            }, this.values[0]);
            if ((Math.abs(maxValue - max) < deviation) && (coords.length <= 10) && (coords.length >= 4)) {
                devInd = j;
                deviation = Math.abs(maxValue - max);
            }
        }
        // @ts-ignore
        coords = this.generateFixedStepTicks(min, max, vp, this.customTicksOptions[devInd], 0);
        return coords;
    };
    Ticks.prototype.generateCustomDateTicks = function (min, max, vp, ctx) {
        var coords = [];
        // @ts-ignore
        for (var j = 0; j < this.customTicksOptions.length; j++) {
            var ticksArr = this.generateCustomDateTicksByOption(j, min, max, vp, ctx);
            coords = ticksArr[0];
            var values = ticksArr[1];
            var labels = ticksArr[2];
            if (this.checkLabelsOverlap(ctx, coords, labels)) {
                this.values = values;
                this.labels = labels;
                if (coords.length <= 2) {
                    coords = this.generateFixedCountTicksDate(min, max, vp);
                }
                return coords;
            }
        }
        if (coords.length <= 2) {
            coords = this.generateFixedCountTicksDate(min, max, vp);
        }
        return coords;
    };
    // Метод анимации изменение набора координат тиков
    Ticks.prototype.tickCoordAnimation = function (from, to, duration) {
        var _this = this;
        var start = performance.now();
        // @ts-ignore 
        var animate = function (time) {
            var tekTime = (time - start) / duration;
            var timeFraction = _this.timeFunc(tekTime);
            if (tekTime > 1)
                tekTime = 1;
            var tek = from.map(function (el, i) {
                return new Point_1.Point(from[i].x + (to[i].x - from[i].x) * timeFraction, from[i].y + (to[i].y - from[i].y) * timeFraction);
            });
            _this.coords = __spreadArrays(tek);
            _this.onCoordsChanged.dispatch();
            if (tekTime < 1) {
                requestAnimationFrame(animate);
            }
            else {
                _this.coords = __spreadArrays(to);
                _this.onCoordsChanged.dispatch();
                _this.onCoordsChangedLast.dispatch();
            }
        };
        requestAnimationFrame(animate);
    };
    Ticks.prototype.makeFromPointArr = function (from, to) {
        var resultArr = [];
        to.forEach(function (toPoint) {
            if (from.length !== 0) {
                var minP = from.reduce(function (fromPoint, cur) {
                    if (fromPoint.findDist(toPoint) < cur.findDist(toPoint))
                        return fromPoint;
                    return cur;
                }, from[0]);
                resultArr.push(minP);
            }
        });
        return resultArr;
    };
    // генерация пробных тиков
    Ticks.prototype.generateCustomDateTicksByOption = function (j, min, max, vp, ctx) {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var rectXY = [];
        var transformer = new Transformer_1.Transformer();
        switch (this.type) {
            case 'vertical':
                rectXY = [0, min, 1, max];
                break;
            case 'horizontal':
                rectXY = [min, 0, max, 1];
                break;
        }
        var fromRect = new Rectangle_1.Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
        var pointXY = [];
        var coords = [];
        var values = [];
        var labels = [];
        var yearDel = 1;
        // @ts-ignore
        var partYear = this.customTicksOptions[j];
        switch (partYear) {
            case '5m':
                yearDel = 2;
                break;
            case '3m':
                yearDel = 3;
                break;
            case '2m':
                yearDel = 4;
                break;
            case '1m':
                yearDel = 6;
                break;
            case 'only year':
                yearDel = 12;
                break;
        }
        // @ts-ignore
        var last = (max > this.customLabels.length) ? this.customLabels.length : max;
        for (var i = min + 1; i <= last - 1; i++) {
            // @ts-ignore
            var curDate = this.customLabels[i];
            // @ts-ignore
            var preDate = this.customLabels[i - 1];
            //начала годов
            if ((curDate.getFullYear() - preDate.getFullYear()) !== 0) {
                switch (this.type) {
                    case 'vertical':
                        pointXY = [0, i];
                        break;
                    case 'horizontal':
                        pointXY = [i, 0];
                        break;
                }
                var valuePoint = new Point_1.Point(pointXY[0], pointXY[1]);
                var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                coords.push(coordPoint);
                values.push(i);
                labels.push(curDate.getFullYear());
            }
            else {
                //начала месяцев
                // @ts-ignore
                if ((this.customTicksOptions[j] !== partYear) || (!(curDate.getMonth() % yearDel))) {
                    if ((curDate.getMonth() - preDate.getMonth()) !== 0) {
                        switch (this.type) {
                            case 'vertical':
                                pointXY = [0, i];
                                break;
                            case 'horizontal':
                                pointXY = [i, 0];
                                break;
                        }
                        var valuePoint = new Point_1.Point(pointXY[0], pointXY[1]);
                        var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                        coords.push(coordPoint);
                        values.push(i);
                        labels.push(monthNames[curDate.getMonth()]);
                    }
                }
            }
            //середины месяцев
            // @ts-ignore
            if (this.customTicksOptions[j] == 'half month') {
                if ((curDate.getDay() !== 0) && (curDate.getDay() !== 6)) {
                    if ((curDate.getDate() == 14 || curDate.getDate() == 15 || curDate.getDate() == 16) &&
                        (curDate.getDay() == 1 || curDate.getDay() == 4) || (curDate.getDate() == 14 && curDate.getDay() == 5)) {
                        switch (this.type) {
                            case 'vertical':
                                pointXY = [0, i];
                                break;
                            case 'horizontal':
                                pointXY = [i, 0];
                                break;
                        }
                        var valuePoint = new Point_1.Point(pointXY[0], pointXY[1]);
                        var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                        coords.push(coordPoint);
                        values.push(i);
                        labels.push(curDate.getDate());
                    }
                }
            }
        }
        return [coords, values, labels];
    };
    Ticks.prototype.checkLabelsOverlap = function (ctx, coords, labels) {
        for (var i = 1; i < coords.length; i++) {
            var curRec = this.label.getlabelRect(ctx, coords[i], labels[i]);
            var preRec = this.label.getlabelRect(ctx, coords[i - 1], labels[i - 1]);
            if (curRec.countDistBetweenRects(this.type, preRec) <= 3)
                return false;
        }
        return true;
    };
    Ticks.prototype.draw = function (ctx, viewport) {
        var _this = this;
        this.coords.forEach(function (tickCoord, i) {
            if (_this.display)
                _this.drawTick(ctx, tickCoord);
            if (_this.label.display)
                _this.label.draw(ctx, tickCoord, _this.labels[i]);
        });
        //console.log(this.coords);
    };
    Ticks.prototype.drawTick = function (ctx, tick) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.linewidth;
        ctx.setLineDash(this.lineDash);
        var r = this.tickSize;
        switch (this.type) {
            case 'vertical':
                ctx.moveTo(tick.x - r, tick.y);
                ctx.lineTo(tick.x, tick.y);
                ctx.stroke();
                break;
            case 'horizontal':
                ctx.moveTo(tick.x, tick.y - r);
                ctx.lineTo(tick.x, tick.y);
                ctx.stroke();
                break;
        }
    };
    return Ticks;
}());
exports.Ticks = Ticks;

},{"./Label":11,"./Point":14,"./Rectangle":15,"./Transformer":18,"signals":3}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
var Rectangle_1 = require("./Rectangle");
var Point_1 = require("./Point");
var Label_1 = require("./Label");
//описание класса
var Tooltip = /** @class */ (function () {
    function Tooltip(id, type) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        this._id = id;
        this.type = type;
        this._options = {
            lineWidth: 1,
            lineColor: '#000000',
            brushColor: '#000000',
            mainSize: 2,
            lineDash: [],
        };
        this.label = new Label_1.Label();
        //if (labels) this.labels = labels;
        this.setOptions(options);
    }
    Object.defineProperty(Tooltip.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Tooltip.prototype.setOptions = function (options) {
        switch (this.type) {
            case 'circle_series':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
                break;
            case 'line_vertical_full':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.lineDash = options[2];
                break;
            case 'line_horizontal_end':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.lineDash = options[2];
                break;
            case 'label_x_start':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
                this.labels = options[4];
                break;
            case 'circle_y_end':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
                break;
            case 'data_y_end':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
                break;
            case 'delta_abs':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
                break;
            case 'data_label':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this.labels = options[3];
                break;
        }
    };
    Tooltip.prototype.drawTooltip = function (ctx, vp, ttCoord, xyData, ind, toDraw) {
        switch (this.type) {
            case 'circle_series':
                this.drawCircleSeries(ctx, ttCoord);
                break;
            case 'line_vertical_full':
                this.drawLineVerticalFull(ctx, vp, ttCoord);
                break;
            case 'line_horizontal_end':
                this.drawLineHorizontalEnd(ctx, vp, ttCoord);
                break;
            case 'label_x_start':
                this.drawLabelXStart(ctx, vp, ttCoord, xyData, ind);
                break;
            case 'circle_y_end':
                this.drawCircleYEnd(ctx, vp, ttCoord);
                break;
            case 'data_y_end':
                return this.drawDataYEnd(ctx, vp, ttCoord, xyData, toDraw);
            case 'delta_abs':
                this.drawDeltaAbs(ctx, vp, ttCoord, xyData);
                break;
            case 'data_label':
                this.drawDataLabel(ctx, vp, ttCoord, xyData, ind);
                break;
        }
    };
    Tooltip.prototype.drawDataLabel = function (ctx, vp, ttCoord, seriesData, ind) {
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);
        var labelCoord = new Point_1.Point(ttCoord.x, ttCoord.y);
        //параметры начальные
        this.label.position = 'top';
        var lineX = ttCoord.x;
        var rectPadding = 6;
        // @ts-ignore
        var labelText = this.labels[ind] + '; x: ' + (seriesData.x).toFixed(1) + '; y: ' + (seriesData.y).toFixed(1);
        var cornersRadius = this._options.mainSize;
        var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
        var roundRect = new Rectangle_1.Rectangle(labelRect.x1 - rectPadding, labelRect.y1 - rectPadding, labelRect.x2 + rectPadding, labelRect.y2 + rectPadding);
        /*
                if (roundRect.x2 > vp.x2) {
                    labelCoord.x = labelCoord.x - roundRect.x2 + vp.x2;
                    roundRect.move(- roundRect.x2 + vp.x2, 0)
                }
        */
        if (roundRect.x2 > vp.x2) {
            labelCoord.x = labelCoord.x - Math.abs(roundRect.x2 - vp.x2) - rectPadding;
            labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
            roundRect = new Rectangle_1.Rectangle(labelRect.x1 - rectPadding, labelRect.y1 - rectPadding, labelRect.x2 + rectPadding, labelRect.y2 + rectPadding);
        }
        if (roundRect.x1 < vp.x1) {
            labelCoord.x = labelCoord.x + Math.abs(roundRect.x1 - vp.x1) + rectPadding;
            labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
            roundRect = new Rectangle_1.Rectangle(labelRect.x1 - rectPadding, labelRect.y1 - rectPadding, labelRect.x2 + rectPadding, labelRect.y2 + rectPadding);
        }
        if (roundRect.y1 < vp.y1) {
            this.label.position = 'bottom';
            labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
            roundRect = new Rectangle_1.Rectangle(labelRect.x1 - rectPadding, labelRect.y1 - rectPadding, labelRect.x2 + rectPadding, labelRect.y2 + rectPadding);
            //labelCoord.y = labelCoord.y + vp.y1 - roundRect.y1;
            //roundRect.move(0, vp.y1 - roundRect.y1);
        }
        this.roundRect(ctx, roundRect.x1, roundRect.y1, roundRect.width, roundRect.height, cornersRadius);
        ctx.fill();
        ctx.stroke();
        this.label.draw(ctx, labelCoord, labelText);
    };
    Tooltip.prototype.drawCircleSeries = function (ctx, ttCoord) {
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);
        ctx.beginPath();
        ctx.arc(ttCoord.x, ttCoord.y, this._options.mainSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    Tooltip.prototype.drawLineVerticalFull = function (ctx, vp, ttCoord) {
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.setLineDash(this._options.lineDash);
        ctx.beginPath();
        ctx.moveTo(ttCoord.x, vp.y1);
        ctx.lineTo(ttCoord.x, vp.zeroY);
        ctx.stroke();
        ctx.setLineDash([]);
    };
    Tooltip.prototype.drawLineHorizontalEnd = function (ctx, vp, ttCoord) {
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.setLineDash(this._options.lineDash);
        ctx.beginPath();
        ctx.moveTo(ttCoord.x, ttCoord.y);
        ctx.lineTo(vp.x2, ttCoord.y);
        ctx.stroke();
        ctx.setLineDash([]);
    };
    Tooltip.prototype.drawLabelXStart = function (ctx, vp, ttCoord, seriesData, ind) {
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);
        // параметры
        var rectPadding = 6;
        var rectWidth = 60;
        // @ts-ignore
        var labelText = (this.labels[ind]).toLocaleDateString('en');
        var cornersRadius = this._options.mainSize;
        var labelCoord = new Point_1.Point(ttCoord.x, vp.zeroY);
        var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
        var labelCenter = new Point_1.Point(labelCoord.x, labelRect.y1 + labelRect.height * 0.5);
        var roundRect = new Rectangle_1.Rectangle(labelCenter.x - rectWidth * 0.5, labelCenter.y - rectPadding - labelRect.height * 0.5, labelCenter.x + rectWidth * 0.5, labelCenter.y + rectPadding + labelRect.height * 0.5);
        if (roundRect.x1 < vp.x1) {
            labelCoord.x = labelCoord.x + vp.x1 - roundRect.x1;
            roundRect.move(0, vp.x1 - roundRect.x1);
        }
        if (roundRect.x2 > vp.x2) {
            labelCoord.x = labelCoord.x - (roundRect.x2 - vp.x2);
            roundRect.move(0, -roundRect.x2 + vp.x2);
        }
        labelCenter = new Point_1.Point(labelCoord.x, labelRect.y1 + labelRect.height * 0.5);
        roundRect = new Rectangle_1.Rectangle(labelCenter.x - rectWidth * 0.5, labelCenter.y - rectPadding - labelRect.height * 0.5, labelCenter.x + rectWidth * 0.5, labelCenter.y + rectPadding + labelRect.height * 0.5);
        this.roundRect(ctx, roundRect.x1, roundRect.y1, roundRect.width, roundRect.height, cornersRadius);
        ctx.fill();
        ctx.stroke();
        this.label.draw(ctx, labelCoord, labelText);
        return roundRect;
    };
    Tooltip.prototype.roundRect = function (ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    };
    Tooltip.prototype.drawCircleYEnd = function (ctx, vp, ttCoord) {
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);
        ctx.beginPath();
        ctx.arc(vp.x2, ttCoord.y, this._options.mainSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    Tooltip.prototype.drawDataYEnd = function (ctx, vp, start_ttCoord, seriesData, toDraw) {
        var ttCoord = new Point_1.Point(start_ttCoord.x, start_ttCoord.y);
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);
        // параметры
        var rectPadding = 6;
        var labelText = (seriesData.y).toFixed(1) + '%';
        var cornersRadius = this._options.mainSize;
        this.label.position = 'right';
        var labelCoord = new Point_1.Point(vp.x2, ttCoord.y);
        var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
        var labelStart = new Point_1.Point(labelRect.x1, labelRect.y1);
        var labelCenter = new Point_1.Point(labelRect.x1 + labelRect.width * 0.5, labelCoord.y);
        var roundRectWidth = 40;
        var roundRect = new Rectangle_1.Rectangle(labelCenter.x - roundRectWidth * 0.5, labelStart.y - rectPadding, labelCenter.x + roundRectWidth * 0.5, labelStart.y + labelRect.height + rectPadding);
        /*
        let roundRect: Rectangle = new Rectangle(vp.x2 + 11 - rectPadding + 3,
            labelStart.y - rectPadding,
            vp.x2 + rectPadding + 35 + 3,
            labelStart.y  + labelRect.height + rectPadding);
        */
        if (roundRect.y1 < vp.y1) {
            labelCoord.y = labelCoord.y + vp.y1 - roundRect.y1;
            ttCoord.y = labelCoord.y;
            roundRect.move(0, vp.y1 - roundRect.y1);
        }
        if (roundRect.y2 > vp.y2) {
            labelCoord.y = labelCoord.y - (roundRect.y2 - vp.y2);
            ttCoord.y = labelCoord.y;
            roundRect.move(0, -roundRect.y2 + vp.y2);
        }
        this.roundRect(ctx, roundRect.x1, roundRect.y1, roundRect.width, roundRect.height, cornersRadius);
        //labelCoord.x = roundRect.x1+roundRect.width*0.5-labelRect.width*0.5-this.label.offset;
        if (toDraw) {
            ctx.fill();
            ctx.stroke();
            this.label.draw(ctx, labelCoord, labelText);
        }
        //console.log(labelCoord, labelText);
        return roundRect;
    };
    Tooltip.prototype.drawDeltaAbs = function (ctx, vp, ttCoord, seriesData) {
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);
        var labelCoord = new Point_1.Point(ttCoord.x, ttCoord.y);
        //параметры начальные
        this.label.position = 'right';
        var lineX = ttCoord.x;
        labelCoord.y = labelCoord.y - 25;
        var rectPadding = 6;
        var labelText = 'Δ ' + (seriesData.y).toFixed(1) + 'pp';
        var cornersRadius = this._options.mainSize;
        var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
        var labelStart = new Point_1.Point(labelRect.x1, labelRect.y1);
        var labelCenter = new Point_1.Point(labelRect.x1 + labelRect.width * 0.5, labelCoord.y);
        var roundRectWidth = 52;
        var roundRect = new Rectangle_1.Rectangle(labelCenter.x - roundRectWidth * 0.5, labelStart.y - rectPadding, labelCenter.x + roundRectWidth * 0.5, labelStart.y + labelRect.height + rectPadding);
        /*
        let roundRect: Rectangle = new Rectangle(labelStart.x - rectPadding,
            labelStart.y - rectPadding,
            labelStart.x - rectPadding + labelRect.width + 2 * rectPadding,
            labelStart.y - rectPadding + labelRect.height + 2 * rectPadding);
        */
        if (roundRect.x2 > vp.x2) {
            labelCoord.x = labelCoord.x - roundRect.x2 + vp.x2;
            roundRect.move(-roundRect.x2 + vp.x2, 0);
        }
        if (roundRect.x1 < lineX) {
            labelCoord.x = lineX;
            this.label.position = 'left';
            labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
            labelStart = new Point_1.Point(labelRect.x2, labelRect.y1);
            roundRect = new Rectangle_1.Rectangle(labelStart.x - labelRect.width - rectPadding, labelStart.y - rectPadding, labelStart.x + rectPadding, labelStart.y + labelRect.height + rectPadding);
        }
        if (roundRect.y1 < vp.y1) {
            labelCoord.y = labelCoord.y + vp.y1 - roundRect.y1;
            roundRect.move(0, vp.y1 - roundRect.y1);
        }
        this.roundRect(ctx, roundRect.x1, roundRect.y1, roundRect.width, roundRect.height, cornersRadius);
        ctx.fill();
        ctx.stroke();
        this.label.draw(ctx, labelCoord, labelText);
    };
    return Tooltip;
}());
exports.Tooltip = Tooltip;

},{"./Label":11,"./Point":14,"./Rectangle":15}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformer = void 0;
var Rectangle_1 = require("./Rectangle");
var Point_1 = require("./Point");
var Transformer = /** @class */ (function () {
    function Transformer() {
        this.matrix = [];
    }
    Transformer.prototype.getPlotRect = function (axisRect, seriesRect, vp) {
        var tx = (seriesRect.x1 - axisRect.x1);
        var ty = -(seriesRect.y2 - axisRect.y2);
        var scaleX = seriesRect.width / axisRect.width;
        var scaleY = seriesRect.height / axisRect.height;
        tx = Math.round(tx * vp.width / axisRect.width);
        ty = Math.round(ty * vp.height / axisRect.height);
        this.matrix = [scaleX, 0, tx, 0, scaleY, ty];
        return this.transform(vp);
    };
    Transformer.prototype.getVeiwportCoord = function (fromRect, toRect, point) {
        var tx = (point.x - fromRect.x1);
        var ty = -(point.y - fromRect.y2);
        tx = Math.round(tx * toRect.width / fromRect.width);
        ty = Math.round(ty * toRect.height / fromRect.height);
        this.matrix = [0, 0, tx, 0, 0, ty];
        var coordRect = this.transform(toRect);
        var coord = new Point_1.Point(coordRect.zeroX, coordRect.zeroY);
        return coord;
    };
    Transformer.prototype.transform = function (viewport) {
        var matrix = [1, 0, 0, 0, 1, 0];
        if (this.matrix) {
            matrix = this.matrix;
        }
        var x1;
        var y1;
        var x2;
        var y2;
        x1 = this.transFunc(0, 0, matrix.slice(0, 3)) + viewport.x1;
        y1 = this.transFunc(0, 0, matrix.slice(3)) + viewport.y1;
        x2 = this.transFunc(viewport.width, viewport.height, matrix.slice(0, 3)) + viewport.x1;
        y2 = this.transFunc(viewport.width, viewport.height, matrix.slice(3)) + viewport.y1;
        return new Rectangle_1.Rectangle(x1, y1, x2, y2);
    };
    Transformer.prototype.transFunc = function (x, y, coeff) {
        var res;
        return res = coeff[0] * x + coeff[1] * y + coeff[2];
    };
    return Transformer;
}());
exports.Transformer = Transformer;

},{"./Point":14,"./Rectangle":15}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesBase = void 0;
var signals_1 = require("signals");
var Canvas_1 = require("../Canvas");
var Point_1 = require("../Point");
var Rectangle_1 = require("../Rectangle");
var Transformer_1 = require("../Transformer");
var SeriesBase = /** @class */ (function () {
    function SeriesBase(id, container, seriesData) {
        this.hasAnimation = false;
        this.animationDuration = 300;
        this.timeFunc = function (time) {
            return time;
        };
        this.onPlotDataChanged = new signals_1.Signal();
        this.onSeriesDataChanged = new signals_1.Signal();
        this.id = id;
        this.seriesData = this.getInitialData(seriesData);
        this.extremes = this.findExtremes();
        this.plots = [];
        this.plotData = [];
        this.canvas = new Canvas_1.Canvas(container);
        this.canvas.canvas.style.zIndex = "0";
        return this;
    }
    SeriesBase.prototype.bindChildSignals = function () {
        this.canvas.resized.add(function () {
        });
    };
    SeriesBase.prototype.getInitialData = function (initialData) {
        var resultData = [];
        initialData.forEach(function (dataRow) {
            var ind = [];
            var val = [];
            dataRow.forEach(function (element, index) {
                ind.push(index);
                val.push(element);
            });
            resultData.push(ind);
            resultData.push(val);
        });
        return resultData;
    };
    SeriesBase.prototype.setPlotsIds = function () {
        var plotIds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            plotIds[_i] = arguments[_i];
        }
        this.plots = plotIds;
    };
    SeriesBase.prototype.findExtremes = function (data) {
        var seriesData = [];
        if (data)
            seriesData = data;
        if (!data)
            seriesData = this.seriesData.slice();
        var xMin = seriesData[0][0];
        var xMax = seriesData[0][0];
        var yMin = seriesData[1][0];
        var yMax = seriesData[1][0];
        seriesData.forEach(function (dataRow, ind) {
            dataRow.forEach(function (element) {
                switch (ind % 2) {
                    case 0:
                        if (element < xMin)
                            xMin = element;
                        if (element > xMax)
                            xMax = element;
                        break;
                    case 1:
                        if (element < yMin)
                            yMin = element;
                        if (element > yMax)
                            yMax = element;
                        break;
                }
            });
        });
        return [xMin, xMax, yMin, yMax];
    };
    Object.defineProperty(SeriesBase.prototype, "dataRect", {
        get: function () {
            var extremes = this.extremes;
            return new Rectangle_1.Rectangle(extremes[0], extremes[2], extremes[1], extremes[3]);
        },
        enumerable: false,
        configurable: true
    });
    SeriesBase.prototype.getDataRange = function (type, min, max) {
        var data = [];
        var _loop_1 = function (i) {
            var ind = [];
            var val = [];
            var dataRowInd = this_1.seriesData[i].slice();
            var dataRowVal = this_1.seriesData[i + 1].slice();
            if (i == 2) {
                dataRowInd = dataRowInd.slice();
                dataRowVal = dataRowVal.slice();
            }
            dataRowInd.forEach(function (el, i) {
                if ((el >= min) && (el <= max)) {
                    ind.push(dataRowInd[i]);
                    val.push(dataRowVal[i]);
                }
            });
            data.push(ind);
            data.push(val);
        };
        var this_1 = this;
        for (var i = 0; i < this.seriesData.length; i = i + 2) {
            _loop_1(i);
        }
        return data;
    };
    SeriesBase.prototype.replaceSeriesData = function (seriesData_to, animate) {
        this.seriesData = this.getInitialData(seriesData_to);
        this.extremes = this.findExtremes();
        if (animate)
            this.onSeriesDataChanged.dispatch(this);
    };
    SeriesBase.prototype.getClosestDataPointX = function (seriesPoint) {
        var _this = this;
        var ind = 0;
        var resultPoint = this.seriesData[0].reduce(function (prev, curr, i) {
            var curPoint = new Point_1.Point(curr, _this.seriesData[1][i]);
            var curDif = seriesPoint.findDistX(curPoint);
            var prevDif = seriesPoint.findDistX(prev);
            if (curDif < prevDif) {
                ind = i;
                return curPoint;
            }
            return prev;
        }, new Point_1.Point(this.seriesData[0][0], this.seriesData[1][0]));
        return [resultPoint, ind];
    };
    SeriesBase.prototype.getClosestDataPointXY = function (seriesPoint) {
        var _this = this;
        var ind = 0;
        var resultPoint = this.seriesData[0].reduce(function (prev, curr, i) {
            var curPoint = new Point_1.Point(curr, _this.seriesData[1][i]);
            var curDif = seriesPoint.findDist(curPoint);
            var prevDif = seriesPoint.findDist(prev);
            if (curDif < prevDif) {
                ind = i;
                return curPoint;
            }
            return prev;
        }, new Point_1.Point(this.seriesData[0][0], this.seriesData[1][0]));
        return [resultPoint, ind];
    };
    SeriesBase.prototype.getClosestPlotPointX = function (coordPoint) {
        var coord = this.plotDataArr.reduce(function (prev, curr, i) {
            var curDif = coordPoint.findDistX(curr);
            var prevDif = coordPoint.findDistX(prev);
            if (curDif < prevDif)
                return curr;
            return prev;
        }, this.plotDataArr[0]);
        if (!coord) {
            //console.log(coordPoint, this.plotDataArr, this.plotData, this.seriesData);
            return new Point_1.Point(0, 0);
        }
        return new Point_1.Point(coord.x, coord.y);
    };
    SeriesBase.prototype.getClosestPlotPointXY = function (coordPoint) {
        var coord = this.plotDataArr.reduce(function (prev, curr, i) {
            var curDif = coordPoint.findDist(curr);
            var prevDif = coordPoint.findDist(prev);
            if (curDif < prevDif)
                return curr;
            return prev;
        }, this.plotDataArr[0]);
        if (!coord) {
            //console.log(coordPoint, this.plotDataArr, this.plotData, this.seriesData);
            return new Point_1.Point(0, 0);
        }
        return new Point_1.Point(coord.x, coord.y);
    };
    Object.defineProperty(SeriesBase.prototype, "plotDataArr", {
        get: function () {
            var lineArr = [];
            for (var i = 0; i < this.plotData.length; i++) {
                var plotRow = this.plotData[i];
                if (i == 1) {
                    plotRow = plotRow.slice().reverse();
                }
                plotRow.forEach(function (element) {
                    lineArr.push(element);
                });
            }
            return lineArr;
        },
        enumerable: false,
        configurable: true
    });
    SeriesBase.prototype.updatePlotData = function (axisRect, vp, noAnimation) {
        var plotData = this.generatePlotData(axisRect, vp);
        if (plotData[0].length === 0) {
            noAnimation = true;
        }
        if (this.plotData.length === 0) {
            noAnimation = true;
        }
        else if (this.plotData[0].length === 0) {
            noAnimation = true;
        }
        //если нужна анимация графиков
        if (noAnimation) {
            this.plotData = plotData;
            this.onPlotDataChanged.dispatch(this);
            return this;
        }
        if (this.hasAnimation) {
            var fromData = [];
            var toData = [];
            for (var i = 0; i < this.plotData.length; i++) {
                var plotRow = this.plotData[i];
                var fromTo = this.makeFromPointArr(plotRow.slice(), plotData[i].slice());
                fromData.push(fromTo[0]);
                toData.push(fromTo[1]);
            }
            this.сoordAnimation(fromData, toData, this.animationDuration, plotData);
        }
        this.plotData = plotData;
        this.onPlotDataChanged.dispatch(this);
        return this;
    };
    SeriesBase.prototype.generatePlotData = function (axisRect, vp) {
        var seriesData = this.getDataRange('ind', axisRect.x1, axisRect.x2);
        // const seriesData = this.seriesData.slice();
        var plotData = [];
        var transformer = new Transformer_1.Transformer();
        var _loop_2 = function (i) {
            var plotDataRow = [];
            var dataRowInd = seriesData[i];
            var dataRowVal = seriesData[i + 1];
            dataRowInd.forEach(function (element, ind) {
                var seriesPoint = new Point_1.Point(dataRowInd[ind], dataRowVal[ind]);
                var plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
                plotDataRow.push(new Point_1.Point(Math.round(plotPoint.x), Math.round(plotPoint.y)));
            });
            plotData.push(plotDataRow);
        };
        for (var i = 0; i < seriesData.length; i = i + 2) {
            _loop_2(i);
        }
        return plotData;
    };
    // Метод анимации изменение набора координат
    SeriesBase.prototype.сoordAnimation = function (fromData, toData, duration, finalData) {
        var _this = this;
        var start = performance.now();
        var animate = function (time) {
            var tekTime = (time - start) / duration;
            var timeFraction = _this.timeFunc(tekTime);
            if (tekTime > 1)
                tekTime = 1;
            var tekData = [];
            fromData.forEach(function (fromRow, ind) {
                var tekRow = fromRow.map(function (el, i) {
                    return new Point_1.Point(Math.round(fromRow[i].x + (toData[ind][i].x - fromRow[i].x) * timeFraction), Math.round(fromRow[i].y + (toData[ind][i].y - fromRow[i].y) * timeFraction));
                });
                tekData.push(tekRow);
            });
            _this.plotData = tekData;
            _this.onPlotDataChanged.dispatch(_this);
            if (tekTime < 1) {
                requestAnimationFrame(animate);
            }
            else {
                _this.plotData = finalData;
                _this.onPlotDataChanged.dispatch(_this);
            }
        };
        requestAnimationFrame(animate);
    };
    SeriesBase.prototype.makeFromPointArr = function (from, to) {
        var resultArr = [];
        if (from.length == 0)
            return resultArr;
        var fromResult = [];
        var toResult = [];
        var toArr = to.slice();
        var fromArr = from.slice();
        // если from < to
        if (fromArr.length < toArr.length) {
            var capacity = Math.floor(toArr.length / fromArr.length);
            var fromInd = 0;
            var roomCount = 0;
            while (fromInd < fromArr.length) {
                fromResult.push(fromArr[fromInd]);
                toArr.shift();
                roomCount = roomCount + 1;
                if (roomCount == capacity) {
                    fromInd = fromInd + 1;
                    roomCount = 0;
                }
            }
            while (toArr.length !== 0) {
                fromResult.push(fromArr[fromArr.length - 1]);
                toArr.shift();
            }
            resultArr.push(fromResult);
            resultArr.push(to);
            return resultArr;
        }
        // если from > to
        else {
            var capacity = Math.floor(fromArr.length / toArr.length);
            var toInd = 0;
            var roomCount = 0;
            while (toInd < toArr.length) {
                toResult.push(toArr[toInd]);
                fromArr.shift();
                roomCount = roomCount + 1;
                if (roomCount == capacity) {
                    toInd = toInd + 1;
                    roomCount = 0;
                }
            }
            while (fromArr.length !== 0) {
                toResult.push(toArr[toArr.length - 1]);
                fromArr.shift();
            }
            resultArr.push(from);
            resultArr.push(toResult);
            return resultArr;
        }
    };
    return SeriesBase;
}());
exports.SeriesBase = SeriesBase;

},{"../Canvas":7,"../Point":14,"../Rectangle":15,"../Transformer":18,"signals":3}],20:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesXY = void 0;
var Point_1 = require("../Point");
var Transformer_1 = require("../Transformer");
var SeriesBase_1 = require("./SeriesBase");
var SeriesXY = /** @class */ (function (_super) {
    __extends(SeriesXY, _super);
    function SeriesXY(id, container, seriesData, labels) {
        var _this = _super.call(this, id, container, seriesData) || this;
        _this.plotLabels = [];
        _this.canvas.canvas.style.zIndex = "3";
        if (labels)
            _this.labels = labels;
        return _this;
    }
    SeriesXY.prototype.getInitialData = function (initialData) {
        var resultData = [];
        var x = [];
        var y = [];
        initialData[0].forEach(function (element, index) {
            x.push(element);
            y.push(initialData[1][index]);
        });
        resultData.push(x);
        resultData.push(y);
        return resultData;
    };
    SeriesXY.prototype.generatePlotData = function (axisRect, vp) {
        var seriesData = this.getDataRange('ind', axisRect.x1, axisRect.x2);
        // const seriesData = this.seriesData.slice();
        var plotData = [];
        var transformer = new Transformer_1.Transformer();
        var plotDataRow = [];
        var dataRowX = seriesData[0];
        var dataRowY = seriesData[1];
        dataRowX.forEach(function (element, ind) {
            var seriesPoint = new Point_1.Point(dataRowX[ind], dataRowY[ind]);
            var plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
            plotDataRow.push(new Point_1.Point(Math.round(plotPoint.x), Math.round(plotPoint.y)));
        });
        plotData.push(plotDataRow);
        return plotData;
    };
    SeriesXY.prototype.getDataRange = function (type, min, max) {
        var _this = this;
        var data = [];
        this.plotLabels.splice(0, this.plotLabels.length);
        var x = [];
        var y = [];
        var dataRowX = this.seriesData[0].slice();
        var dataRowY = this.seriesData[1].slice();
        dataRowX.forEach(function (el, i) {
            if ((el >= min) && (el <= max)) {
                x.push(dataRowX[i]);
                y.push(dataRowY[i]);
                if (_this.labels)
                    _this.plotLabels.push(_this.labels[i]);
            }
        });
        data.push(x);
        data.push(y);
        return data;
    };
    return SeriesXY;
}(SeriesBase_1.SeriesBase));
exports.SeriesXY = SeriesXY;

},{"../Point":14,"../Transformer":18,"./SeriesBase":19}],21:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChart = exports.chart = void 0;
var Chart_1 = require("../classes/Chart");
var Ticks_1 = require("../classes/Ticks");
var helpers_1 = require("../scripts/helpers");
var cbh1 = [];
var cbh5 = [];
var cbh55 = []; // additional serie
var xLabels = [];
var zeroSeries = [];
var seriesLabeled;
var seriesText;
var gapY = 0.08;
var bezier = require('bezier-easing');
var easing = bezier(0.65, 0, 0.35, 1);
// @ts-ignore
function createChart(container, data) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    // @ts-ignore
    //chart = new Chart(container, [0, 900], [0, 2000]);
    exports.chart = new Chart_1.Chart(container, [0, 900], [0, 2000]);
    _a = __spreadArrays(data), xLabels = _a[0], cbh5 = _a[1], cbh1 = _a[2], cbh55 = _a[3], zeroSeries = _a[4], seriesLabeled = _a[5], seriesText = _a[6];
    // перевести данные в % если нужно (точка 0 = cbh5[0] и cbh1[0] соответсвенно)
    //let serie5star = calculateDeviationsVal(cbh5, cbh5[0]);
    //let serie1star = calculateDeviationsVal(cbh1, cbh1[0]);
    // оставить исходные данные
    var serie5star = cbh5;
    var serie1star = cbh1;
    var serie55star = cbh55;
    setLastUpdateDate(xLabels[xLabels.length - 1]);
    // ось X
    exports.chart.xAxis.setOptions('start', 0.5, 'black');
    // @ts-ignore
    exports.chart.xAxis.ticks.setCustomLabels(xLabels);
    exports.chart.xAxis.display = true;
    exports.chart.xAxis.ticks.setOptions(true, 'customDateTicks', ['half month', '5m', '3m', '2m', '1m', 'only year']);
    exports.chart.xAxis.ticks.display = true;
    exports.chart.xAxis.ticks.settickDrawOptions(-6, 0.5, 'black');
    exports.chart.xAxis.ticks.label.setOptions(true, '#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);
    exports.chart.xAxis.ticks.label.isUpperCase = true;
    // ось Y
    exports.chart.yAxis.setOptions('end', 1, '#B2B2B2', [1, 2]);
    exports.chart.yAxis.display = true;
    exports.chart.yAxis.position = 'end';
    exports.chart.yAxis.ticks.settickDrawOptions(-50, 1, '#B2B2B2', [1, 2]);
    exports.chart.yAxis.ticks.setOptions(true, 'niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
    exports.chart.yAxis.ticks.label.setOptions(true, '#B2B2B2', 'right', 0, ['12', '"Transcript Pro"']).setOffset(30, 10);
    exports.chart.yAxis.ticks.label.units = '%';
    exports.chart.yAxis.grid.setOptions(true, '#B2B2B2', 1, [1, 2]);
    //добавляем custom ticks для Y
    var zeroTick = new Ticks_1.Ticks(exports.chart.yAxis.type);
    zeroTick.setOptions(true, 'zero');
    zeroTick.settickDrawOptions(-50, 1, '#000000', [2, 1]);
    zeroTick.label.display = false;
    zeroTick.hasAnimation = true;
    zeroTick.timeFunc = easing;
    exports.chart.yAxis.addCustomTicks(zeroTick);
    var minTick = new Ticks_1.Ticks(exports.chart.yAxis.type);
    minTick.setOptions(true, 'min');
    minTick.settickDrawOptions(-50, 0.5, 'black', []);
    minTick.label.display = false;
    exports.chart.yAxis.addCustomTicks(minTick);
    // создаем Plots
    exports.chart.addPlot('red_line', 'line', 1, '#FF2222', []);
    exports.chart.addPlot('red_area', 'area_bottom', 0, '#FFE5E5', '#FFE5E5', 0);
    exports.chart.addPlot('blue_line', 'line', 1, '#0070FF', []);
    exports.chart.addPlot('blue_area', 'area_bottom', 0, '#D9EAFF', '#D9EAFF', 0);
    exports.chart.addPlot('green_line', 'line', 1, '#009e2f', []);
    exports.chart.addPlot('green_area', 'area_bottom', 0, '#75d993', '#75d993', 0);
    exports.chart.addPlot('zero_line', 'line', 1, '#000000', [2, 1]); //пунктирная линия 0
    exports.chart.addPlot('labeled', 'text', 1, '#000000', '#000000') //график с лейблами
        .label.setOptions(true, 'black', 'top', 10 + 15 + 10, ['18', '"Transcript Pro"'])
        .setOutline({ width: 5, color: 'white' });
    // создаем Tooltips
    // lines
    (_b = exports.chart.findPlotById('blue_line')) === null || _b === void 0 ? void 0 : _b.addTooltip('ttId', 'line_vertical_full', 1, '#B2B2B2', [1, 2]);
    (_c = exports.chart.findPlotById('red_line')) === null || _c === void 0 ? void 0 : _c.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
    (_d = exports.chart.findPlotById('blue_line')) === null || _d === void 0 ? void 0 : _d.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
    // circles
    (_e = exports.chart.findPlotById('green_line')) === null || _e === void 0 ? void 0 : _e.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#009e2f', 4);
    (_f = exports.chart.findPlotById('blue_line')) === null || _f === void 0 ? void 0 : _f.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#0070FF', 4);
    (_g = exports.chart.findPlotById('red_line')) === null || _g === void 0 ? void 0 : _g.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#FF2222', 4);
    (_h = exports.chart.findPlotById('green_line')) === null || _h === void 0 ? void 0 : _h.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#009e2f', 4);
    (_j = exports.chart.findPlotById('blue_line')) === null || _j === void 0 ? void 0 : _j.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#0070FF', 4);
    (_k = exports.chart.findPlotById('red_line')) === null || _k === void 0 ? void 0 : _k.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#FF2222', 4);
    // labels
    (_l = exports.chart.findPlotById('red_line')) === null || _l === void 0 ? void 0 : _l.addTooltip('ttId', 'label_x_start', 0.5, 'black', '#ebebeb', 4, xLabels).label.setOptions(true, 'black', 'bottom', 14, ['12', '"Transcript Pro"']);
    // data
    (_m = exports.chart.findPlotById('green_line')) === null || _m === void 0 ? void 0 : _m.addTooltip('ttId', 'data_y_end', 0.5, '#009e2f', '#009e2f', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);
    (_o = exports.chart.findPlotById('red_line')) === null || _o === void 0 ? void 0 : _o.addTooltip('ttId', 'data_y_end', 0.5, '#FF2222', '#FF2222', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);
    (_p = exports.chart.findPlotById('blue_line')) === null || _p === void 0 ? void 0 : _p.addTooltip('ttId', 'data_y_end', 0.5, '#0070FF', '#0070FF', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);
    // delta
    (_q = exports.chart.findPlotById('red_line')) === null || _q === void 0 ? void 0 : _q.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);
    (_r = exports.chart.findPlotById('blue_line')) === null || _r === void 0 ? void 0 : _r.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);
    // создаем Series
    exports.chart.addSeriesRow('cyberHedge55_area', [serie55star]).setPlotsIds('green_area');
    exports.chart.addSeriesRow('cyberHedge5_area', [serie5star]).setPlotsIds('blue_area');
    exports.chart.addSeriesRow('cyberHedge1_area', [serie1star]).setPlotsIds('red_area');
    exports.chart.addSeriesRow('cyberHedge55_line', [serie55star]).setPlotsIds('green_line');
    exports.chart.addSeriesRow('cyberHedge5_line', [serie5star]).setPlotsIds('blue_line');
    exports.chart.addSeriesRow('cyberHedge1_line', [serie1star]).setPlotsIds('red_line');
    exports.chart.addSeriesRow('zero_line', [zeroSeries]).setPlotsIds('zero_line');
    exports.chart.addSeries('cyberHedge_labels', seriesLabeled, seriesText).setPlotsIds('labeled');
    //включаем анимацию
    exports.chart.xAxis.ticks.switchAnimation(true, 300);
    exports.chart.yAxis.ticks.switchAnimation(true, 300);
    exports.chart.switchDataAnimation(true, 300);
    exports.chart.data.changeAllSeriesAnimationTimeFunction(easing);
    exports.chart.setCanvasPaddings(25, 80, 40, 40); // задаем отступы для области отрисовки
    // настраиваем Min Max осей
    exports.chart.xAxis.setMinMaxStatic(exports.chart.data.findExtremes('val')); //по экстремумам оси X
    exports.chart.yAxis.setMinMaxStatic(exports.chart.data.findExtremes('ind', exports.chart.xAxis.min, exports.chart.xAxis.max)); //scale to fit по Y
    exports.chart.yAxis.setMinMaxStatic([exports.chart.yAxis.min - gapY * exports.chart.yAxis.length, exports.chart.yAxis.max + gapY * exports.chart.yAxis.length]); //добавляем по отступам как на сайте
    exports.chart.refresh();
}
exports.createChart = createChart;
// преобразование данных ряда из абсолютных величин в % относительно zeroPoint
function calculateDeviationsVal(rowData, zeroPoint) {
    var chartDataVariation = [];
    chartDataVariation = [];
    for (var j = 0, m = rowData.length; j < m; j++) {
        chartDataVariation.push(100 * (rowData[j] - zeroPoint) / zeroPoint);
    }
    return chartDataVariation;
}
// подключение слушателей к разметке как на cbh
//функция вешает слушатели на панель nav - USA / EU
(function prepareCsvLoadMenu() {
    var zoneItems = document.querySelectorAll('.zones_article li');
    zoneItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var link = item.querySelector('a');
            // @ts-ignore
            document.querySelector('.zones_article li.selected').classList.remove('selected');
            item.classList.add('selected');
            var rangeSelected = document.querySelector('.ranges_article li.selected');
            // @ts-ignore
            helpers_1.customLoadDataFromCsv(link.href).then(function (data) {
                // @ts-ignore
                var chartData = helpers_1.csvToCols(data);
                cbh1 = chartData[2].slice(1).map(function (el) { return +el; });
                cbh5 = chartData[1].slice(1).map(function (el) { return +el; });
                xLabels = chartData[0].slice(1).map(function (el) { return new Date(el); });
                zeroSeries = cbh1.map(function () { return 0; });
                cbh1 = cbh1.reverse();
                cbh5 = cbh5.reverse();
                xLabels = xLabels.reverse();
                setLastUpdateDate(xLabels[xLabels.length - 1]);
                var max = xLabels.length - 1;
                var min = 0;
                reorganizeChart(cbh5, cbh1, min, max, false);
                // @ts-ignore
                rangeSelected.click(rangeSelected);
            });
        });
    });
}());
//функция вешает слушатели на панель ranges
(function prepareRangesMenu() {
    var ranges = document.querySelectorAll('.ranges_article li');
    ranges.forEach(function (item) {
        item.addEventListener('click', function () {
            // @ts-ignore
            document.querySelector('.ranges_article li.selected').classList.remove('selected');
            item.classList.add('selected');
            var lastLb = xLabels[xLabels.length - 1];
            var maxDate = lastLb, minDate, max = xLabels.length - 1, min = 0;
            switch (item.innerHTML) {
                case '2D':
                    minDate = new Date(new Date(maxDate.getTime()).setDate(maxDate.getDate() - 2));
                    min = findDateInd(minDate);
                    break;
                case '6M':
                    minDate = new Date(new Date(maxDate.getTime()).setMonth(maxDate.getMonth() - 6));
                    min = findDateInd(minDate);
                    break;
                case '1Y':
                    minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 1));
                    min = findDateInd(minDate);
                    break;
                case '2Y':
                    minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 2));
                    min = findDateInd(minDate);
                    break;
                case 'YTD':
                    minDate = new Date(new Date(maxDate.getFullYear(), 0, 1).getTime()),
                        min = findDateInd(minDate);
                    break;
            }
            reorganizeChart(cbh5, cbh1, min, max, true);
        });
    });
}());
// настройка Chart
// @ts-ignore
function reorganizeChart(cbh5, cbh1, min, max, onlyData) {
    // перевести данные в % если нужно (точка 0 = cbh5[0] и cbh1[0] соответсвенно)
    // let serie5star = calculateDeviationsVal(cbh5, cbh5[min]);
    // let serie1star = calculateDeviationsVal(cbh1, cbh1[min]);
    // оставить исходные данные
    //let serie5star = cbh5;
    //let serie1star = cbh1;
    //let serie55star = cbh55;
    //chart.data.findSeriesById('cyberHedge5_area')?.replaceSeriesData([serie5star], false);
    //chart.data.findSeriesById('cyberHedge5_area')?.replaceSeriesData([serie5star], false);
    //chart.data.findSeriesById('cyberHedge1_area')?.replaceSeriesData([serie1star], false);
    //chart.data.findSeriesById('cyberHedge5_line')?.replaceSeriesData([serie5star], false);
    //chart.data.findSeriesById('cyberHedge1_line')?.replaceSeriesData([serie1star], false);
    //chart.data.findSeriesById('zero_line')?.replaceSeriesData([zeroSeries], false);
    if (onlyData) {
        // @ts-ignore
        exports.chart.xAxis.setMinMax([min, max], false);
        // @ts-ignore
        var MinMaxY = exports.chart.data.findExtremes('ind', min, max);
        var lengthY = Math.abs(MinMaxY[0] - MinMaxY[1]);
        exports.chart.yAxis.setMinMax([MinMaxY[0] - gapY * lengthY, MinMaxY[1] + gapY * lengthY], true);
    }
}
function setLastUpdateDate(lastDate) {
    // NOTE: fill last update node
    var lastUpdateNode = document.querySelector('.last-update-article time');
    // @ts-ignore
    lastUpdateNode.datetime = lastDate.toISOString();
    // @ts-ignore
    lastUpdateNode.innerHTML = [lastDate.getDate(), lastDate.toLocaleString('en-US', { month: 'long' }), lastDate.getFullYear()].join(' ');
}
//поиск индекса ближайщей даты
function findDateInd(date) {
    var ind = xLabels.reduce(function (prev, curr, i) {
        // @ts-ignore
        var curDif = Math.abs(curr - date);
        // @ts-ignore
        var prevDif = Math.abs(xLabels[prev] - date);
        if (curDif < prevDif)
            return i;
        return prev;
    }, 0);
    return ind;
}

},{"../classes/Chart":8,"../classes/Ticks":16,"../scripts/helpers":27,"bezier-easing":1}],22:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChart = exports.chart = void 0;
var Chart_1 = require("../classes/Chart");
var Ticks_1 = require("../classes/Ticks");
var cbhRow = [];
var xLabels = [];
var zeroSeries = [];
var seriesLabeled;
var seriesText;
var gapY = 0.08;
var bezier = require('bezier-easing');
var easing = bezier(0.65, 0, 0.35, 1);
// @ts-ignore
function createChart(container, data) {
    var _a;
    // @ts-ignore
    exports.chart = new Chart_1.Chart(container, [0, 900], [0, 2000]);
    _a = __spreadArrays(data), xLabels = _a[0], cbhRow = _a[1], zeroSeries = _a[2], seriesLabeled = _a[3], seriesText = _a[4];
    // ось X
    exports.chart.xAxis.setOptions('start', 0.5, 'black');
    exports.chart.xAxis.display = true;
    exports.chart.xAxis.ticks.display = true;
    // @ts-ignore
    exports.chart.xAxis.ticks.setCustomLabels(xLabels);
    exports.chart.xAxis.ticks.setOptions(true, 'customDateTicks', ['half month', '5m', '3m', '2m', '1m', 'only year']);
    exports.chart.xAxis.ticks.settickDrawOptions(-6, 0.5, 'black');
    exports.chart.xAxis.ticks.label.setOptions(true, '#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);
    exports.chart.xAxis.ticks.label.isUpperCase = true;
    exports.chart.xAxis.grid.setOptions(true, '#B2B2B2', 1, [1, 2]);
    // ось Y
    exports.chart.yAxis.setOptions('end', 1, '#B2B2B2', [1, 2]);
    exports.chart.yAxis.display = true;
    exports.chart.yAxis.position = 'end';
    exports.chart.yAxis.ticks.setOptions(true, 'niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
    exports.chart.yAxis.ticks.settickDrawOptions(-50, 1, '#B2B2B2', [1, 2]);
    exports.chart.yAxis.ticks.label.setOptions(true, '#B2B2B2', 'right', 0, ['12', '"Transcript Pro"']);
    exports.chart.yAxis.ticks.label.setOffset(30, 10);
    exports.chart.yAxis.ticks.label.units = '%';
    exports.chart.yAxis.grid.setOptions(true, '#B2B2B2', 1, [1, 2]);
    //добавляем custom ticks для Y
    var zeroTick = new Ticks_1.Ticks(exports.chart.yAxis.type);
    zeroTick.setOptions(true, 'zero');
    zeroTick.settickDrawOptions(-50, 1, '#000000', [2, 1]);
    zeroTick.label.display = false;
    zeroTick.hasAnimation = true;
    zeroTick.timeFunc = easing;
    exports.chart.yAxis.addCustomTicks(zeroTick);
    var minTick = new Ticks_1.Ticks(exports.chart.yAxis.type);
    minTick.setOptions(true, 'min');
    minTick.settickDrawOptions(-50, 0.5, 'black', []);
    minTick.label.display = false;
    exports.chart.yAxis.addCustomTicks(minTick);
    // создаем Plots
    exports.chart.addPlot('black_line', 'line', 1, '#000000', [], 'round'); //черная линия
    //chart.addPlot('black_line', 'line', 1, '#000000', [])._options.lineJoin = 'round';
    exports.chart.addPlot('light_gray_area', 'area_bottom', 0, '#F2F2F2', '#F2F2F2', 0); //серая заливка области
    exports.chart.addPlot('zero_line', 'line', 1, '#000000', [2, 1]); //пунктирная линия 0
    var fontSizesList = [10, 14, 18];
    var queryList = ['(min-width:320px) and (max-width:480px)', '(min-width:480px) and (max-width:768px)', '(min-width: 768px)'];
    exports.chart.addPlot('labeled', 'text', 1, '#000000', '#000000') //график с лейблами
        .label.setOptions(true, 'black', 'top', 10 + 15 + 10, ['18', '"Transcript Pro"', true, fontSizesList, queryList])
        .setOutline({ width: 5, color: 'white' });
    var seriesRow = calculateDeviationsVal(cbhRow, cbhRow[0]);
    var seriesL = [seriesLabeled[0], calculateDeviationsVal(seriesLabeled[1], cbhRow[0])];
    // создаем Series и привязвыаем к ним инструменты отрисовки Plots
    exports.chart.addSeriesRow('cyberHedge_area', [seriesRow]).setPlotsIds('light_gray_area');
    exports.chart.addSeriesRow('cyberHedge_line', [seriesRow]).setPlotsIds('black_line');
    exports.chart.addSeriesRow('zero_line', [zeroSeries]).setPlotsIds('zero_line');
    exports.chart.addSeries('cyberHedge_labels', seriesL, seriesText).setPlotsIds('labeled');
    // настраиваем Min Max осей
    exports.chart.xAxis.setMinMaxStatic(exports.chart.data.findExtremes('val')); //по экстремумам оси X
    exports.chart.yAxis.setMinMaxStatic(exports.chart.data.findExtremes('ind', exports.chart.xAxis.min, exports.chart.xAxis.max)); //scale to fit по Y
    exports.chart.yAxis.setMinMaxStatic([exports.chart.yAxis.min - gapY * exports.chart.yAxis.length, exports.chart.yAxis.max + gapY * exports.chart.yAxis.length]); //добавляем по отступам как на сайте
    //включаем анимацию
    exports.chart.xAxis.ticks.switchAnimation(true, 300);
    exports.chart.yAxis.ticks.switchAnimation(true, 300);
    exports.chart.switchDataAnimation(true, 300);
    exports.chart.data.changeAllSeriesAnimationTimeFunction(easing);
    exports.chart.setCanvasPaddings(25, 80, 40, 40); // задаем отступы для области отрисовки
    exports.chart.refresh();
}
exports.createChart = createChart;
// преобразование данных ряда из абсолютных величин в % относительно zeroPoint
function calculateDeviationsVal(rowData, zeroPoint) {
    var chartDataVariation = [];
    chartDataVariation = [];
    for (var j = 0, m = rowData.length; j < m; j++) {
        chartDataVariation.push(100 * (rowData[j] - zeroPoint) / zeroPoint);
    }
    return chartDataVariation;
}
// подключение слушателей к разметке как на cbh
//функция вешает слушатели на панель ranges
(function prepareRangesMenu() {
    var ranges = document.querySelectorAll('.ranges_black li');
    ranges.forEach(function (item) {
        item.addEventListener('click', function () {
            // @ts-ignore
            document.querySelector('.ranges_black li.selected').classList.remove('selected');
            item.classList.add('selected');
            var lastLb = xLabels[xLabels.length - 1];
            var maxDate = lastLb, minDate, max = xLabels.length - 1, min = 0;
            switch (item.innerHTML) {
                case '6M':
                    minDate = new Date(new Date(maxDate.getTime()).setMonth(maxDate.getMonth() - 6));
                    min = findDateInd(minDate);
                    break;
                case '1Y':
                    minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 1));
                    min = findDateInd(minDate);
                    break;
                case '2Y':
                    minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 2));
                    min = findDateInd(minDate);
                    break;
                case 'YTD':
                    minDate = new Date(new Date(maxDate.getFullYear(), 0, 1).getTime()),
                        min = findDateInd(minDate);
                    break;
            }
            reorganizeChart(cbhRow, min, max, true);
        });
    });
}());
// настройка Chart
// @ts-ignore
function reorganizeChart(cbhRow, min, max, onlyData) {
    var _a, _b, _c, _d;
    var seriesRow = calculateDeviationsVal(cbhRow, cbhRow[min]);
    var seriesL = [seriesLabeled[0], calculateDeviationsVal(seriesLabeled[1], cbhRow[min])];
    // создаем Series
    (_a = exports.chart.data.findSeriesById('cyberHedge_area')) === null || _a === void 0 ? void 0 : _a.replaceSeriesData([seriesRow], false);
    (_b = exports.chart.data.findSeriesById('cyberHedge_line')) === null || _b === void 0 ? void 0 : _b.replaceSeriesData([seriesRow], false);
    (_c = exports.chart.data.findSeriesById('zero_line')) === null || _c === void 0 ? void 0 : _c.replaceSeriesData([zeroSeries], false);
    (_d = exports.chart.data.findSeriesById('cyberHedge_labels')) === null || _d === void 0 ? void 0 : _d.replaceSeriesData(seriesL, false);
    if (onlyData) {
        // @ts-ignore
        exports.chart.xAxis.ticks.setCustomLabels(xLabels);
        exports.chart.xAxis.setMinMax([min, max], false);
        var MinMaxY = exports.chart.data.findExtremes('ind', min, max);
        var lengthY = Math.abs(MinMaxY[0] - MinMaxY[1]);
        exports.chart.yAxis.setMinMax([MinMaxY[0] - gapY * lengthY, MinMaxY[1] + gapY * lengthY], true);
    }
}
//поиск индекса ближайщей даты
function findDateInd(date) {
    var ind = xLabels.reduce(function (prev, curr, i) {
        // @ts-ignore
        var curDif = Math.abs(curr - date);
        // @ts-ignore
        var prevDif = Math.abs(xLabels[prev] - date);
        if (curDif < prevDif)
            return i;
        return prev;
    }, 0);
    return ind;
}

},{"../classes/Chart":8,"../classes/Ticks":16,"bezier-easing":1}],23:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChart = exports.chart = void 0;
var Chart_1 = require("../classes/Chart");
var Ticks_1 = require("../classes/Ticks");
var helpers_1 = require("../scripts/helpers");
var cbh1 = [];
var cbh5 = [];
var xLabels = [];
var zeroSeries = [];
var gapY = 0.08;
var bezier = require('bezier-easing');
var easing = bezier(0.65, 0, 0.35, 1);
// @ts-ignore
function createChart(container, data) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    // @ts-ignore
    exports.chart = new Chart_1.Chart(container, [0, 900], [0, 2000]);
    _a = __spreadArrays(data), xLabels = _a[0], cbh5 = _a[1], cbh1 = _a[2], zeroSeries = _a[3];
    setLastUpdateDate(xLabels[xLabels.length - 1]);
    exports.chart.tooltipsDataIndexUpdated.add(conncetRedWidget);
    exports.chart.tooltipsDataIndexUpdated.add(conncetBlueWidget);
    // ось X
    exports.chart.xAxis.setOptions('start', 0.5, 'black');
    // @ts-ignore
    exports.chart.xAxis.ticks.setCustomLabels(xLabels);
    exports.chart.xAxis.display = true;
    exports.chart.xAxis.ticks.setOptions(true, 'customDateTicks', ['half month', '5m', '3m', '2m', '1m', 'only year']);
    exports.chart.xAxis.ticks.display = true;
    exports.chart.xAxis.ticks.settickDrawOptions(-6, 0.5, 'black');
    exports.chart.xAxis.ticks.label.setOptions(true, '#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);
    exports.chart.xAxis.ticks.label.isUpperCase = true;
    // ось Y
    exports.chart.yAxis.setOptions('end', 1, '#B2B2B2', [1, 2]);
    exports.chart.yAxis.display = true;
    exports.chart.yAxis.position = 'end';
    exports.chart.yAxis.ticks.settickDrawOptions(-50, 1, '#B2B2B2', [1, 2]);
    exports.chart.yAxis.ticks.setOptions(true, 'niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
    exports.chart.yAxis.ticks.label.setOptions(true, '#B2B2B2', 'right', 0, ['12', '"Transcript Pro"']).setOffset(30, 10);
    exports.chart.yAxis.ticks.label.units = '%';
    exports.chart.yAxis.grid.setOptions(true, '#B2B2B2', 1, [1, 2]);
    //добавляем custom ticks для Y
    var zeroTick = new Ticks_1.Ticks(exports.chart.yAxis.type);
    zeroTick.setOptions(true, 'zero');
    zeroTick.settickDrawOptions(-50, 1, '#000000', [2, 1]);
    zeroTick.label.display = false;
    zeroTick.hasAnimation = true;
    zeroTick.timeFunc = easing;
    exports.chart.yAxis.addCustomTicks(zeroTick);
    var minTick = new Ticks_1.Ticks(exports.chart.yAxis.type);
    minTick.setOptions(true, 'min');
    minTick.settickDrawOptions(-50, 0.5, 'black', []);
    minTick.label.display = false;
    exports.chart.yAxis.addCustomTicks(minTick);
    // создаем Plots
    exports.chart.addPlot('red_line', 'line', 1, '#FF2222', []);
    exports.chart.addPlot('red_area', 'area_bottom', 0, '#FFE5E5', '#FFE5E5', 0);
    exports.chart.addPlot('blue_line', 'line', 1, '#0070FF', []);
    exports.chart.addPlot('blue_area', 'area_bottom', 0, '#D9EAFF', '#D9EAFF', 0);
    exports.chart.addPlot('zero_line', 'line', 1, '#000000', [2, 1]); //пунктирная линия 0
    // создаем Tooltipы
    // lines
    (_b = exports.chart.findPlotById('blue_line')) === null || _b === void 0 ? void 0 : _b.addTooltip('ttId', 'line_vertical_full', 1, '#B2B2B2', [1, 2]);
    (_c = exports.chart.findPlotById('red_line')) === null || _c === void 0 ? void 0 : _c.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
    (_d = exports.chart.findPlotById('blue_line')) === null || _d === void 0 ? void 0 : _d.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
    // circles
    (_e = exports.chart.findPlotById('blue_line')) === null || _e === void 0 ? void 0 : _e.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#0070FF', 4);
    (_f = exports.chart.findPlotById('red_line')) === null || _f === void 0 ? void 0 : _f.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#FF2222', 4);
    (_g = exports.chart.findPlotById('black_line')) === null || _g === void 0 ? void 0 : _g.addTooltip('ttId', 'circle_series', 3, '#ffffff', 'black', 4);
    (_h = exports.chart.findPlotById('blue_line')) === null || _h === void 0 ? void 0 : _h.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#0070FF', 4);
    (_j = exports.chart.findPlotById('red_line')) === null || _j === void 0 ? void 0 : _j.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#FF2222', 4);
    // labels
    (_k = exports.chart.findPlotById('red_line')) === null || _k === void 0 ? void 0 : _k.addTooltip('ttId', 'label_x_start', 0.5, 'black', '#ebebeb', 4, xLabels).label.setOptions(true, 'black', 'bottom', 14, ['12', '"Transcript Pro"']);
    // data
    (_l = exports.chart.findPlotById('red_line')) === null || _l === void 0 ? void 0 : _l.addTooltip('ttId', 'data_y_end', 0.5, '#FF2222', '#FF2222', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);
    (_m = exports.chart.findPlotById('blue_line')) === null || _m === void 0 ? void 0 : _m.addTooltip('ttId', 'data_y_end', 0.5, '#0070FF', '#0070FF', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);
    // delta
    (_o = exports.chart.findPlotById('red_line')) === null || _o === void 0 ? void 0 : _o.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);
    (_p = exports.chart.findPlotById('blue_line')) === null || _p === void 0 ? void 0 : _p.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);
    // подготавливаем данные как на сайте CyberHedge
    var serie5star = calculateDeviationsVal(cbh5, cbh5[0]);
    var serie1star = calculateDeviationsVal(cbh1, cbh1[0]);
    // создаем Series
    exports.chart.addSeriesRow('cyberHedge5_area', [serie5star]).setPlotsIds('blue_area');
    exports.chart.addSeriesRow('cyberHedge1_area', [serie1star]).setPlotsIds('red_area');
    exports.chart.addSeriesRow('cyberHedge5_line', [serie5star]).setPlotsIds('blue_line');
    exports.chart.addSeriesRow('cyberHedge1_line', [serie1star]).setPlotsIds('red_line');
    exports.chart.addSeriesRow('zero_line', [zeroSeries]).setPlotsIds('zero_line');
    // настраиваем Min Max осей
    exports.chart.xAxis.setMinMax(exports.chart.data.findExtremes('val'), true); //по экстремумам оси X
    exports.chart.yAxis.setMinMax(exports.chart.data.findExtremes('ind', exports.chart.xAxis.min, exports.chart.xAxis.max), true); //scale to fit по Y
    exports.chart.yAxis.setMinMax([exports.chart.yAxis.min - gapY * exports.chart.yAxis.length, exports.chart.yAxis.max + gapY * exports.chart.yAxis.length], true); //добавляем по отступам как на сайте
    exports.chart.setCanvasPaddings(25, 80, 40, 40); // задаем отступы для области отрисовки
    //включаем анимацию
    exports.chart.xAxis.ticks.switchAnimation(true, 300);
    exports.chart.yAxis.ticks.switchAnimation(true, 300);
    exports.chart.switchDataAnimation(true, 300);
    exports.chart.data.changeAllSeriesAnimationTimeFunction(easing);
    exports.chart.refresh();
}
exports.createChart = createChart;
// преобразование данных ряда из абсолютных величин в % относительно zeroPoint
function calculateDeviationsVal(rowData, zeroPoint) {
    var chartDataVariation = [];
    chartDataVariation = [];
    for (var j = 0, m = rowData.length; j < m; j++) {
        chartDataVariation.push(100 * (rowData[j] - zeroPoint) / zeroPoint);
    }
    return chartDataVariation;
}
// подключение слушателей к разметке как на cbh
//функция вешает слушатели на панель nav - USA / EU
(function prepareCsvLoadMenu() {
    var zoneItems = document.querySelectorAll('.zones_colored li');
    zoneItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var link = item.querySelector('a');
            // @ts-ignore
            document.querySelector('.zones_colored li.selected').classList.remove('selected');
            item.classList.add('selected');
            var rangeSelected = document.querySelector('.ranges_сolored li.selected');
            // @ts-ignore
            helpers_1.customLoadDataFromCsv(link.href).then(function (data) {
                // @ts-ignore
                var chartData = helpers_1.csvToCols(data);
                cbh1 = chartData[2].slice(1).map(function (el) { return +el; });
                cbh5 = chartData[1].slice(1).map(function (el) { return +el; });
                xLabels = chartData[0].slice(1).map(function (el) { return new Date(el); });
                zeroSeries = cbh1.map(function () { return 0; });
                //xLabels.sort();
                setLastUpdateDate(xLabels[xLabels.length - 1]);
                var max = xLabels.length - 1;
                var min = 0;
                reorganizeChart(cbh5, cbh1, min, max, false);
                // @ts-ignore
                rangeSelected.click(rangeSelected);
            });
        });
    });
}());
//функция вешает слушатели на панель ranges
(function prepareRangesMenu() {
    var ranges = document.querySelectorAll('.ranges_сolored li');
    ranges.forEach(function (item) {
        item.addEventListener('click', function () {
            // @ts-ignore
            document.querySelector('.ranges_сolored li.selected').classList.remove('selected');
            item.classList.add('selected');
            var lastLb = xLabels[xLabels.length - 1];
            var maxDate = lastLb, minDate, max = xLabels.length - 1, min = 0;
            switch (item.innerHTML) {
                case '6M':
                    minDate = new Date(new Date(maxDate.getTime()).setMonth(maxDate.getMonth() - 6));
                    min = findDateInd(minDate);
                    break;
                case '1Y':
                    minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 1));
                    min = findDateInd(minDate);
                    break;
                case '2Y':
                    minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 2));
                    min = findDateInd(minDate);
                    break;
                case 'YTD':
                    minDate = new Date(new Date(maxDate.getFullYear(), 0, 1).getTime()),
                        min = findDateInd(minDate);
                    break;
            }
            reorganizeChart(cbh5, cbh1, min, max, true);
        });
    });
}());
//настройка виджетов для отображения данных Тултипов
var redWidget = document.getElementById('cbhIdx1-val-colored');
var blueWidget = document.getElementById('cbhIdx5-val-colored');
function conncetRedWidget(index) {
    if (redWidget)
        redWidget.innerHTML = cbh1[index].toFixed(1);
}
function conncetBlueWidget(index) {
    if (blueWidget)
        blueWidget.innerHTML = cbh5[index].toFixed(1);
}
// настройка Chart
// @ts-ignore
function reorganizeChart(cbh5, cbh1, min, max, onlyData) {
    var _a, _b, _c, _d, _e;
    // подготавливаем данные как на сайте CyberHedge
    var serie5star = calculateDeviationsVal(cbh5, cbh5[min]);
    var serie1star = calculateDeviationsVal(cbh1, cbh1[min]);
    (_a = exports.chart.data.findSeriesById('cyberHedge5_area')) === null || _a === void 0 ? void 0 : _a.replaceSeriesData([serie5star], false);
    (_b = exports.chart.data.findSeriesById('cyberHedge1_area')) === null || _b === void 0 ? void 0 : _b.replaceSeriesData([serie1star], false);
    (_c = exports.chart.data.findSeriesById('cyberHedge5_line')) === null || _c === void 0 ? void 0 : _c.replaceSeriesData([serie5star], false);
    (_d = exports.chart.data.findSeriesById('cyberHedge1_line')) === null || _d === void 0 ? void 0 : _d.replaceSeriesData([serie1star], false);
    (_e = exports.chart.data.findSeriesById('zero_line')) === null || _e === void 0 ? void 0 : _e.replaceSeriesData([zeroSeries], false);
    if (onlyData) {
        // @ts-ignore
        exports.chart.xAxis.setMinMax([min, max], false);
        // @ts-ignore
        exports.chart.xAxis.ticks.setCustomLabels(xLabels);
        var MinMaxY = exports.chart.data.findExtremes('ind', min, max);
        var lengthY = Math.abs(MinMaxY[0] - MinMaxY[1]);
        exports.chart.yAxis.setMinMax([MinMaxY[0] - gapY * lengthY, MinMaxY[1] + gapY * lengthY], true);
    }
}
function setLastUpdateDate(lastDate) {
    // NOTE: fill last update node
    var lastUpdateNode = document.querySelector('.last-update-colored time');
    // @ts-ignore
    lastUpdateNode.datetime = lastDate.toISOString();
    // @ts-ignore
    lastUpdateNode.innerHTML = [lastDate.getDate(), lastDate.toLocaleString('en-US', { month: 'long' }), lastDate.getFullYear()].join(' ');
}
//поиск индекса ближайщей даты
function findDateInd(date) {
    var ind = xLabels.reduce(function (prev, curr, i) {
        // @ts-ignore
        var curDif = Math.abs(curr - date);
        // @ts-ignore
        var prevDif = Math.abs(xLabels[prev] - date);
        if (curDif < prevDif)
            return i;
        return prev;
    }, 0);
    return ind;
}

},{"../classes/Chart":8,"../classes/Ticks":16,"../scripts/helpers":27,"bezier-easing":1}],24:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareDataforCbh = exports.createChart = exports.chart = void 0;
var Chart_1 = require("../classes/Chart");
var helpers_1 = require("../scripts/helpers");
var cbh1 = [];
var cbh5 = [];
var xLabels = [];
var zeroSeries = [];
var gapY = 0.08;
// @ts-ignore
function createChart(container, data) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    // @ts-ignore
    exports.chart = new Chart_1.Chart(container, [0, 900], [0, 2000]);
    _a = __spreadArrays(data), xLabels = _a[0], cbh5 = _a[1], cbh1 = _a[2], zeroSeries = _a[3];
    setLastUpdateDate(xLabels[xLabels.length - 1]);
    exports.chart.tooltipsDataIndexUpdated.add(conncetRedWidget);
    exports.chart.tooltipsDataIndexUpdated.add(conncetBlueWidget);
    exports.chart.setCanvasPaddings(25, 60, 40, 20); // задаем отступы для области отрисовки
    // ось X
    exports.chart.xAxis.setOptions('start', 1, 'black');
    exports.chart.xAxis.ticks.display = true;
    exports.chart.xAxis.ticks.settickDrawOptions(6, 1, 'black');
    exports.chart.xAxis.ticks.label.setOptions(true, '#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);
    // ось Y
    exports.chart.yAxis.setOptions('end', 1, '#B2B2B2', [1, 2]);
    exports.chart.yAxis.display = true;
    exports.chart.yAxis.position = 'end';
    exports.chart.yAxis.ticks.label.setOptions(true, '#B2B2B2', 'right', 20, ['12', '"Transcript Pro"']);
    // создаем Plots
    exports.chart.addPlot('red_line', 'line', 1, '#FF2222', []);
    exports.chart.addPlot('red_area', 'area', 0, '#FFE5E5', '#FFE5E5', 0);
    exports.chart.addPlot('blue_line', 'line', 1, '#0070FF', []);
    exports.chart.addPlot('blue_area', 'area', 0, '#D9EAFF', '#D9EAFF', 0);
    exports.chart.addPlot('black_line', 'line', 1, '#000000', []);
    // создаем Tooltipы
    // lines
    (_b = exports.chart.findPlotById('blue_line')) === null || _b === void 0 ? void 0 : _b.addTooltip('ttId', 'line_vertical_full', 1, '#B2B2B2', [1, 2]);
    (_c = exports.chart.findPlotById('red_line')) === null || _c === void 0 ? void 0 : _c.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
    (_d = exports.chart.findPlotById('blue_line')) === null || _d === void 0 ? void 0 : _d.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
    // circles
    (_e = exports.chart.findPlotById('blue_line')) === null || _e === void 0 ? void 0 : _e.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#0070FF', 4);
    (_f = exports.chart.findPlotById('red_line')) === null || _f === void 0 ? void 0 : _f.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#FF2222', 4);
    (_g = exports.chart.findPlotById('black_line')) === null || _g === void 0 ? void 0 : _g.addTooltip('ttId', 'circle_series', 3, '#ffffff', 'black', 4);
    (_h = exports.chart.findPlotById('blue_line')) === null || _h === void 0 ? void 0 : _h.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#0070FF', 4);
    (_j = exports.chart.findPlotById('red_line')) === null || _j === void 0 ? void 0 : _j.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#FF2222', 4);
    // labels
    (_k = exports.chart.findPlotById('red_line')) === null || _k === void 0 ? void 0 : _k.addTooltip('ttId', 'label_x_start', 0.5, 'black', '#ebebeb', 4, xLabels).label.setOptions(true, 'black', 'bottom', 14, ['12', '"Transcript Pro"']);
    // data
    (_l = exports.chart.findPlotById('red_line')) === null || _l === void 0 ? void 0 : _l.addTooltip('ttId', 'data_y_end', 0.5, '#FF2222', '#FF2222', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);
    (_m = exports.chart.findPlotById('blue_line')) === null || _m === void 0 ? void 0 : _m.addTooltip('ttId', 'data_y_end', 0.5, '#0070FF', '#0070FF', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);
    // delta
    (_o = exports.chart.findPlotById('red_line')) === null || _o === void 0 ? void 0 : _o.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);
    (_p = exports.chart.findPlotById('blue_line')) === null || _p === void 0 ? void 0 : _p.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);
    // подготавливаем данные как на сайте CyberHedge
    var dataNew = prepareDataforCbh(cbh5, cbh1, 0);
    var serie5star = dataNew.serie5star, area5starTop = dataNew.area5starTop, area5starBottom = dataNew.area5starBottom, serie1star = dataNew.serie1star, area1starTop = dataNew.area1starTop, area1starBottom = dataNew.area1starBottom;
    // создаем Series
    exports.chart.addSeriesRow('cyberHedge5_area', [area5starTop, area5starBottom]).setPlotsIds('blue_area');
    exports.chart.addSeriesRow('cyberHedge1_area', [area1starTop, area1starBottom]).setPlotsIds('red_area');
    exports.chart.addSeriesRow('cyberHedge5_line', [serie5star]).setPlotsIds('blue_line');
    exports.chart.addSeriesRow('cyberHedge1_line', [serie1star]).setPlotsIds('red_line');
    exports.chart.addSeriesRow('zero_line', [zeroSeries]).setPlotsIds('black_line');
    //настраиваем параметры осей
    exports.chart.yAxis.ticks.setOptions(false, 'niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
    exports.chart.yAxis.ticks.label.units = '%';
    // @ts-ignore
    exports.chart.xAxis.ticks.setCustomLabels(xLabels);
    exports.chart.xAxis.ticks.setOptions(true, 'customDateTicks', ['half month', '5m', '3m', '2m', '1m', 'only year']);
    exports.chart.xAxis.display = true;
    // настраиваем Min Max осей
    exports.chart.xAxis.setMinMaxStatic(exports.chart.data.findExtremes('val')); //по экстремумам оси X
    exports.chart.yAxis.setMinMaxStatic(exports.chart.data.findExtremes('ind', exports.chart.xAxis.min, exports.chart.xAxis.max)); //scale to fit по Y
    exports.chart.yAxis.setMinMaxStatic([exports.chart.yAxis.min - gapY * exports.chart.yAxis.length, exports.chart.yAxis.max + gapY * exports.chart.yAxis.length]); //добавляем по отступам как на сайте
    //включаем анимацию
    var bezier = require('bezier-easing');
    var easing = bezier(0.65, 0, 0.35, 1);
    //включаем анимацию
    exports.chart.xAxis.ticks.switchAnimation(true, 300);
    exports.chart.yAxis.ticks.switchAnimation(true, 300);
    exports.chart.switchDataAnimation(true, 300);
    exports.chart.data.changeAllSeriesAnimationTimeFunction(easing);
    exports.chart.setCanvasPaddings(25, 60, 40, 40); // задаем отступы для области отрисовки
    //generate inital data
    exports.chart.refresh();
}
exports.createChart = createChart;
// подготоваливает данные для Chart
function prepareDataforCbh(star5, star1, fromIndex) {
    var arrLength = star5.length;
    var serie5star = calculateDeviations(star5, fromIndex), serie1star = calculateDeviations(star1, fromIndex), area5starTop = [], area5starBottom = [], area1starTop = [], area1starBottom = [];
    for (var i = 0, l = arrLength; i < l; i++) {
        var item5star = serie5star[i], item1star = serie1star[i];
        var elTop5 = (item5star > 0) ? ((item5star > item1star) ? item5star : item5star) : 0;
        area5starTop.push(elTop5);
        var elBot5 = (item5star > 0) ? ((item1star > 0) ? ((item1star > item5star) ? item5star : item1star) : 0) : item5star;
        area5starBottom.push(elBot5);
        var elTop1 = (item1star > 0) ? item1star : ((item5star > 0) ? 0 : ((item5star < item1star) ? item1star : item5star));
        area1starTop.push(elTop1);
        var elBot1 = (item1star > 0) ? 0 : ((item5star < item1star) ? item1star : item1star);
        area1starBottom.push(elBot1);
    }
    return { serie5star: serie5star, area5starTop: area5starTop, area5starBottom: area5starBottom, serie1star: serie1star, area1starTop: area1starTop, area1starBottom: area1starBottom };
}
exports.prepareDataforCbh = prepareDataforCbh;
// перевод из абсолютных величин в %
function calculateDeviations(rowData, fromIndex) {
    var chartDataVariation = [];
    var zeroPoint = rowData[fromIndex];
    chartDataVariation = [];
    for (var j = 0, m = rowData.length; j < m; j++) {
        chartDataVariation.push(100 * (rowData[j] - zeroPoint) / zeroPoint);
    }
    return chartDataVariation;
}
// подключение слушателей к разметке как на cbh
//функция вешает слушатели на панель nav - USA / EU
(function prepareCsvLoadMenu() {
    var zoneItems = document.querySelectorAll('.index .zones li');
    zoneItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var link = item.querySelector('a');
            // @ts-ignore
            document.querySelector('.index .zones li.selected').classList.remove('selected');
            item.classList.add('selected');
            var rangeSelected = document.querySelector('.ranges_indices li.selected');
            // @ts-ignore
            helpers_1.customLoadDataFromCsv(link.href).then(function (data) {
                // @ts-ignore
                var chartData = helpers_1.csvToCols(data);
                cbh1 = chartData[2].slice(1).map(function (el) { return +el; });
                cbh5 = chartData[1].slice(1).map(function (el) { return +el; });
                xLabels = chartData[0].slice(1).map(function (el) { return new Date(el); });
                zeroSeries = cbh1.map(function () { return 0; });
                setLastUpdateDate(xLabels[xLabels.length - 1]);
                var max = xLabels.length - 1;
                var min = 0;
                reorganizeChart(cbh5, cbh1, min, max, false);
                // @ts-ignore
                rangeSelected.click(rangeSelected);
            });
        });
    });
}());
//функция вешает слушатели на панель ranges
(function prepareRangesMenu() {
    var ranges = document.querySelectorAll('.ranges_indices li');
    ranges.forEach(function (item) {
        item.addEventListener('click', function () {
            // @ts-ignore
            document.querySelector('.ranges_indices li.selected').classList.remove('selected');
            item.classList.add('selected');
            var lastLb = xLabels[xLabels.length - 1];
            var maxDate = lastLb, minDate, max = xLabels.length - 1, min = 0;
            switch (item.innerHTML) {
                case '6M':
                    minDate = new Date(new Date(maxDate.getTime()).setMonth(maxDate.getMonth() - 6));
                    min = findDateInd(minDate);
                    break;
                case '1Y':
                    minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 1));
                    min = findDateInd(minDate);
                    break;
                case '2Y':
                    minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 2));
                    min = findDateInd(minDate);
                    break;
                case 'YTD':
                    minDate = new Date(new Date(maxDate.getFullYear(), 0, 1).getTime()),
                        min = findDateInd(minDate);
                    break;
            }
            reorganizeChart(cbh5, cbh1, min, max, true);
        });
    });
}());
//настройка виджетов для отображения данных Тултипов
var redWidget = document.getElementById('cbhIdx1-val');
var blueWidget = document.getElementById('cbhIdx5-val');
function conncetRedWidget(index) {
    if (redWidget)
        redWidget.innerHTML = cbh1[index].toFixed(1);
}
function conncetBlueWidget(index) {
    if (blueWidget)
        blueWidget.innerHTML = cbh5[index].toFixed(1);
}
// настройка Chart
// @ts-ignore
function reorganizeChart(cbh5, cbh1, min, max, onlyData) {
    var _a, _b, _c, _d, _e;
    var data = prepareDataforCbh(cbh5, cbh1, min);
    var serie5star = data.serie5star, area5starTop = data.area5starTop, area5starBottom = data.area5starBottom, serie1star = data.serie1star, area1starTop = data.area1starTop, area1starBottom = data.area1starBottom;
    (_a = exports.chart.data.findSeriesById('cyberHedge5_area')) === null || _a === void 0 ? void 0 : _a.replaceSeriesData([area5starTop, area5starBottom], false);
    (_b = exports.chart.data.findSeriesById('cyberHedge1_area')) === null || _b === void 0 ? void 0 : _b.replaceSeriesData([area1starTop, area1starBottom], false);
    (_c = exports.chart.data.findSeriesById('cyberHedge5_line')) === null || _c === void 0 ? void 0 : _c.replaceSeriesData([serie5star], false);
    (_d = exports.chart.data.findSeriesById('cyberHedge1_line')) === null || _d === void 0 ? void 0 : _d.replaceSeriesData([serie1star], false);
    (_e = exports.chart.data.findSeriesById('zero_line')) === null || _e === void 0 ? void 0 : _e.replaceSeriesData([zeroSeries], false);
    if (onlyData) {
        // @ts-ignore
        //chart.xAxis.ticks.setCustomLabels(xLabels);
        exports.chart.xAxis.setMinMax([min, max], false);
        var MinMaxY = exports.chart.data.findExtremes('ind', min, max);
        var lengthY = Math.abs(MinMaxY[0] - MinMaxY[1]);
        exports.chart.yAxis.setMinMax([MinMaxY[0] - gapY * lengthY, MinMaxY[1] + gapY * lengthY], true);
    }
}
function setLastUpdateDate(lastDate) {
    // NOTE: fill last update node
    var lastUpdateNode = document.querySelector('.last-update time');
    // @ts-ignore
    lastUpdateNode.datetime = lastDate.toISOString();
    // @ts-ignore
    lastUpdateNode.innerHTML = [lastDate.getDate(), lastDate.toLocaleString('en-US', { month: 'long' }), lastDate.getFullYear()].join(' ');
}
//поиск индекса ближайщей даты
function findDateInd(date) {
    var ind = xLabels.reduce(function (prev, curr, i) {
        // @ts-ignore
        var curDif = Math.abs(curr - date);
        // @ts-ignore
        var prevDif = Math.abs(xLabels[prev] - date);
        if (curDif < prevDif)
            return i;
        return prev;
    }, 0);
    return ind;
}

},{"../classes/Chart":8,"../scripts/helpers":27,"bezier-easing":1}],25:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorganizeChart = exports.createChart = exports.prepareData = exports.chart = void 0;
var Chart_1 = require("../classes/Chart");
var Legend_1 = require("../classes/Legend");
var Point_1 = require("../classes/Point");
var Ticks_1 = require("../classes/Ticks");
// @ts-ignore
function prepareData(data) {
    //разбираем CSV по рядам
    var x, y, labels;
    var oneX = [1.3];
    var oneY = [2.5];
    // @ts-ignore
    x = data[0].slice(1).map(function (el) { return +el; });
    // @ts-ignore
    y = data[1].slice(1).map(function (el) { return +el; });
    // @ts-ignore
    labels = data[2].slice(1).map(function (el) { return el; });
    return [x, y, oneX, oneY, labels];
}
exports.prepareData = prepareData;
//функция создает и настраивает Chart квадратный
// @ts-ignore
function createChart(container, data) {
    var _a;
    var _b;
    // @ts-ignore
    exports.chart = new Chart_1.Chart(container, [0, 5], [0, 5]);
    var x, y, oneX, oneY, labels;
    _a = __spreadArrays(data), x = _a[0], y = _a[1], oneX = _a[2], oneY = _a[3], labels = _a[4];
    // ось X
    exports.chart.xAxis.setOptions('end', 1, 'black');
    exports.chart.xAxis.ticks.setOptions(false, 'fixedCount', 5);
    exports.chart.xAxis.ticks.label.setOptions(false, '#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);
    exports.chart.xAxis.grid.setOptions(true, 'black', 0.5, []);
    exports.chart.xAxis.setName('Capital Managment', 'start').label.setOptions(true, 'black', 'top', -30, ['18', '"Transcript Pro"']);
    //легенда для оси X
    var lowRisk = new Legend_1.Legend(['Low', 'Risk'], function (vp) { return new Point_1.Point(vp.x1 - 25, vp.y2 + 25); });
    lowRisk.label.setOptions(true, 'black', 'top', 0, ['14', '"Transcript Pro"']);
    exports.chart.xAxis.addLegend(lowRisk);
    var highRisk = new Legend_1.Legend(['High', 'Risk'], function (vp) { return new Point_1.Point(vp.x2 + 25, vp.y1 - 25); });
    highRisk.label.setOptions(true, 'black', 'top', 0, ['14', '"Transcript Pro"']);
    exports.chart.xAxis.addLegend(highRisk);
    //добавляем custom ticks для X
    var newTicks = new Ticks_1.Ticks(exports.chart.xAxis.type);
    newTicks.setOptions(false, 'midStep', 5);
    newTicks.label.setOptions(true, '#B2B2B2', 'top', 17, ['25', '"Transcript Pro"'], ['#60bb4c', '#accd5a', '#eed15c', '#ee9c58', '#e94f49']);
    newTicks.setCustomLabels(['●']);
    exports.chart.xAxis.addCustomTicks(newTicks);
    // ось Y
    exports.chart.yAxis.setOptions('end', 1, '#B2B2B2');
    exports.chart.yAxis.ticks.setOptions(false, 'fixedCount', 5);
    exports.chart.yAxis.ticks.label.setOptions(false, '#B2B2B2', 'right', 20, ['12', '"Transcript Pro"']);
    exports.chart.yAxis.grid.setOptions(true, 'black', 0.5, []);
    exports.chart.yAxis.setName('Vulnerability', 'start').label.setOptions(true, 'black', 'right', -10, ['18', '"Transcript Pro"']);
    exports.chart.yAxis.label.rotationAngle = -90;
    //добавляем custom ticks для Y
    var newYTicks = new Ticks_1.Ticks(exports.chart.yAxis.type);
    newYTicks.setOptions(false, 'midStep', 5);
    newYTicks.label.setOptions(true, '#B2B2B2', 'right', 30, ['25', '"Transcript Pro"'], ['#60bb4c', '#accd5a', '#eed15c', '#ee9c58', '#e94f49']);
    newYTicks.setCustomLabels(['●']);
    exports.chart.yAxis.addCustomTicks(newYTicks);
    // контур графика
    exports.chart.hasBorder = true;
    // создаем Plots
    exports.chart.addPlot('uni_circles', 'unicode', 20, '#454e56', '●');
    exports.chart.addPlot('uni_triangle', 'unicode', 20, '#454e56', '▼');
    //tt
    (_b = exports.chart.findPlotById('uni_circles')) === null || _b === void 0 ? void 0 : _b.addTooltip('ttId', 'data_label', 0.5, 'black', '#ebebeb', labels).label.setOptions(true, 'black', 'top', 15, ['12', '"Transcript Pro"']);
    //chart.findPlotById('uni_triangle')?.addTooltip('ttId', 'data_label', 0.5, 'black', '#ebebeb', labels).label.setOptions('black', 'top', 15, ['12', '"Transcript Pro"']);
    // создаем Series
    exports.chart.addSeries('portfolio', [x, y]).setPlotsIds('uni_circles');
    exports.chart.addSeries('portfolio_1', [oneX, oneY]).setPlotsIds('uni_triangle');
    //включаем анимацию
    var bezier = require('bezier-easing');
    var easing = bezier(0.65, 0, 0.35, 1);
    exports.chart.xAxis.ticks.switchAnimation(false, 300);
    exports.chart.yAxis.ticks.switchAnimation(false, 300);
    exports.chart.switchDataAnimation(true, 300);
    exports.chart.data.changeAllSeriesAnimationTimeFunction(easing);
    // задаем отступы для области отрисовки
    exports.chart.setCanvasPaddings(60, 60, 60, 60);
    // делаем квадратное соотношение
    exports.chart.switchResolution();
    //обавляем фон
    exports.chart.addBackGround('coloredGrid_cbh');
    exports.chart.refresh();
    // элементы управления
    var randBtn = document.getElementById('rand_btn');
    //@ts-ignore
    randBtn.addEventListener('click', function () {
        reorganizeChart();
    });
}
exports.createChart = createChart;
function reorganizeChart() {
    var _a, _b, _c;
    var x, y, oneX, oneY, labels;
    x = [];
    y = [];
    labels = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    var newLength = 1 + Math.round(Math.random() * 16);
    for (var i = 0; i < newLength; i++) {
        x.push(0.1 + Math.random() * 4.8);
        y.push(0.1 + Math.random() * 4.8);
        labels.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    oneX = [0.1 + Math.random() * 4.8];
    oneY = [0.1 + Math.random() * 4.8];
    (_a = exports.chart.data.findSeriesById('portfolio')) === null || _a === void 0 ? void 0 : _a.replaceSeriesData([x, y], true);
    (_b = exports.chart.data.findSeriesById('portfolio_1')) === null || _b === void 0 ? void 0 : _b.replaceSeriesData([oneX, oneY], true);
    // @ts-ignore
    (_c = exports.chart.findPlotById('uni_circles')) === null || _c === void 0 ? void 0 : _c.findTooltipById('ttId').labels = labels;
}
exports.reorganizeChart = reorganizeChart;
/* index.ts


// @ts-ignore
import WebFont from 'webfontloader';

import { customLoadDataFromCsv, csvToCols } from "./scripts/helpers"
import { Chart } from "./classes/Chart"

// выбираем config
import { prepareData, createChart, reorganizeChart } from "./configs/square-chart"

//подгрузка CSV файла
const sqrData = require('./data/cbhVulnerability_test.csv');


//объявляем переменные
let chart: Chart;
const chartContainer = document.getElementById('indexChart');
const fonts = ['Transcript Pro'];


// проверка подгрузки шрифта
const WebFont = require('webfontloader')

WebFont.load({
  custom: {
    families: fonts,
  },

  active: function () {

    customLoadDataFromCsv(sqrData).then((data) => {
      // @ts-ignore
      let chartData = csvToCols(data);
      //разбираем CSV по рядам
      chartData = prepareData(chartData);
      //создаем chart
      chart = createChart(chartContainer, [...chartData]);
    })
      .catch((err) => {
        console.log(err);
      })
  },
});






*/ 

},{"../classes/Chart":8,"../classes/Legend":12,"../classes/Point":14,"../classes/Ticks":16,"bezier-easing":1}],26:[function(require,module,exports){
"use strict";
// browserify ./src/index.ts -p [ tsify --noImplicitAny ] > chart-bundle.js
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
// @ts-ignore
var webfontloader_1 = __importDefault(require("webfontloader"));
// helpers
var helpers_1 = require("./scripts/helpers");
// config cbh-indicies-black
var indices_chart_black_1 = require("./configs/indices-chart-black");
// config cbh-indicies-colored
var indices_chart_colored_1 = require("./configs/indices-chart-colored");
// config cbh-indicies
var indices_chart_1 = require("./configs/indices-chart");
// config square-chart
var square_chart_1 = require("./configs/square-chart");
var square_chart_2 = require("./configs/square-chart");
// config indicies-article1
var indices_article_1 = require("./configs/indices-article");
//пути до CSV файлов
var sqrData = './src/data/cbhVulnerability_test.csv';
var EU = './src/data/cbhPlotData_EU.csv';
var EU_Labels = './src/data/cbhPlotData_EU_labeled.csv';
var startCSVurl = './src/data/cbhPlotData_US.csv';
var article1 = './src/data/article1.csv';
var article1_labels = './src/data/article1_labels.csv';
// проверка подгрузки шрифта
webfontloader_1.default.load({
    custom: {
        families: ['Transcript Pro']
    },
    active: function () {
        // график по серии Article1
        helpers_1.customLoadDataFromCsv(article1).then(function (data) {
            helpers_1.customLoadDataFromCsv(article1_labels).then(function (dataLables) {
                var chartContainer = document.getElementById('indexChart_4');
                // @ts-ignore
                var chartData = helpers_1.csvToCols(data);
                var cbh1 = chartData[2].slice(1).map(function (el) { return +el; }).reverse();
                var cbh5 = chartData[1].slice(1).map(function (el) { return +el; }).reverse();
                var cbh55 = chartData[1].slice(1).map(function (el) { return (+el * -1); }).reverse();
                var xLabels = chartData[0].slice(1).map(function (el) { return new Date(el); }).reverse();
                var zeroSeries = cbh1.map(function () { return 0; });
                // @ts-ignore
                var chartLables = helpers_1.csvToCols(dataLables);
                var x = chartLables[0].slice(1).map(function (el) { return +el; });
                var y = chartLables[1].slice(1).map(function (el) { return +el; });
                var texts = chartLables[2].slice(1).map(function (el) { return el; });
                // вызов функции создания графика из конфига .src/configs/indices-chart-colored.ts
                indices_article_1.createChart(chartContainer, [xLabels, cbh5, cbh1, cbh55, zeroSeries, [x, y], texts]);
            });
        })
            .catch(function (err) {
            console.log(err);
        });
        // черно-белый график
        helpers_1.customLoadDataFromCsv(EU).then(function (data) {
            helpers_1.customLoadDataFromCsv(EU_Labels).then(function (dataLables) {
                var chartContainer = document.getElementById('indexChart_0');
                // @ts-ignore
                var chartData = helpers_1.csvToCols(data);
                var cbh = chartData[1].slice(1).map(function (el) { return +el; });
                var xLabels = chartData[0].slice(1).map(function (el) { return new Date(el); });
                var zeroSeries = cbh.map(function () { return 0; });
                // @ts-ignore
                var chartLables = helpers_1.csvToCols(dataLables);
                var x = chartLables[0].slice(1).map(function (el) { return +el; });
                var y = chartLables[1].slice(1).map(function (el) { return +el; });
                var texts = chartLables[2].slice(1).map(function (el) { return el; });
                indices_chart_black_1.createChart(chartContainer, [xLabels, cbh, zeroSeries, [x, y], texts]); //кастомная функция создания и настройки объекта Chart
            });
        })
            .catch(function (err) {
            console.log(err);
        });
        // цветной график CBH-indices-colored
        helpers_1.customLoadDataFromCsv(startCSVurl).then(function (data) {
            var chartContainer = document.getElementById('indexChart_1');
            // @ts-ignore
            var chartData = helpers_1.csvToCols(data);
            var cbh1 = chartData[2].slice(1).map(function (el) { return +el; });
            var cbh5 = chartData[1].slice(1).map(function (el) { return +el; });
            var xLabels = chartData[0].slice(1).map(function (el) { return new Date(el); });
            var zeroSeries = cbh1.map(function () { return 0; });
            // вызов функции создания графика из конфига .src/configs/indices-chart-colored.ts
            indices_chart_colored_1.createChart(chartContainer, [xLabels, cbh5, cbh1, zeroSeries]);
        })
            .catch(function (err) {
            console.log(err);
        });
        // старый график CBH-indices
        helpers_1.customLoadDataFromCsv(startCSVurl).then(function (data) {
            var chartContainer = document.getElementById('indexChart_2');
            // @ts-ignore
            var chartData = helpers_1.csvToCols(data);
            var cbh1 = chartData[2].slice(1).map(function (el) { return +el; });
            var cbh5 = chartData[1].slice(1).map(function (el) { return +el; });
            var xLabels = chartData[0].slice(1).map(function (el) { return new Date(el); });
            var zeroSeries = cbh1.map(function () { return 0; });
            indices_chart_1.createChart(chartContainer, [xLabels, cbh5, cbh1, zeroSeries]);
        })
            .catch(function (err) {
            console.log(err);
        });
        // квадратный график
        helpers_1.customLoadDataFromCsv(sqrData).then(function (data) {
            var chartContainer = document.getElementById('indexChart_3');
            // @ts-ignore
            var chartData = helpers_1.csvToCols(data);
            //разбираем CSV по рядам
            chartData = square_chart_2.prepareData(chartData);
            //создаем chart
            square_chart_1.createChart(chartContainer, __spreadArrays(chartData));
        })
            .catch(function (err) {
            console.log(err);
        });
        /*
    */
    },
});

},{"./configs/indices-article":21,"./configs/indices-chart":24,"./configs/indices-chart-black":22,"./configs/indices-chart-colored":23,"./configs/square-chart":25,"./scripts/helpers":27,"webfontloader":4}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvToCols = exports.customLoadDataFromCsv = void 0;
// рукописная загрузка из CSV
function customLoadDataFromCsv(filePath) {
    return fetch(filePath).then(function (response) {
        var contentType = response.headers.get("content-type");
        if (contentType && (contentType.includes("text/csv") || contentType.includes("application/octet-stream"))) {
            return response.ok ? response.text() : Promise.reject(response.status);
        }
        throw new TypeError("Oops, we haven't got CSV!");
    });
}
exports.customLoadDataFromCsv = customLoadDataFromCsv;
// csv to array
// @ts-ignore
function csvToCols(strData, strDelimiter) {
    strDelimiter = strDelimiter || ",";
    var rowData = strData.split("\n");
    var colResult = [];
    for (var i = rowData[0].split(strDelimiter).length - 1; i >= 0; i--)
        colResult.push([]);
    for (var i = 0, l = rowData.length; i < l; i++) {
        if (rowData[i].length) {
            var row = rowData[i].split(strDelimiter);
            // @ts-ignore
            for (var j = row.length - 1; j >= 0; j--)
                colResult[j].push(row[j]);
        }
    }
    return colResult;
}
exports.csvToCols = csvToCols;

},{}]},{},[26]);
