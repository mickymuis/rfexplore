(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rfexplore"] = factory();
	else
		root["rfexplore"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _rfexplore = __webpack_require__(1);
	
	var _rfexplore2 = _interopRequireDefault(_rfexplore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _rfexplore2.default;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _automaton = __webpack_require__(2);
	
	var _automaton2 = _interopRequireDefault(_automaton);
	
	var _viewport = __webpack_require__(3);
	
	var _viewport2 = _interopRequireDefault(_viewport);
	
	var _menubar = __webpack_require__(5);
	
	var _menubar2 = _interopRequireDefault(_menubar);
	
	var _value_equals = __webpack_require__(4);
	
	var _value_equals2 = _interopRequireDefault(_value_equals);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UIController = function () {
	    function UIController(viewport) {
	        var _this = this;
	
	        _classCallCheck(this, UIController);
	
	        this.viewport = viewport;
	        this.autoUpdate = true;
	        this._viewmode = 'circle';
	        this._palette = ['#ff5511', '#33ffcc', '#ffaa33', '#5E69FF'];
	        this._automaton = null;
	        this._oldopts = null;
	        this._opts = { // Options to Automaton constructor
	            mode: 2,
	            base: 2,
	            folds: 0,
	            rule: 6,
	            input: [0, 1, 1, 0, 0, 1, 0],
	            foldToRight: false
	        };
	        this._listeners = {
	            maxrules: new Array(),
	            rule: new Array(),
	            folds: new Array()
	        };
	
	        viewport.setOnInputClicked(function (i) {
	            _this.incrementInput(i);
	        });
	    }
	
	    UIController.prototype.on = function on(event, func) {
	        if (typeof func === 'function' && typeof this._listeners[event] !== 'undefined') {
	            this._listeners[event].push(func);
	        }
	    };
	
	    UIController.prototype.update = function update() {
	        if (this.autoUpdate) this.render();
	    };
	
	    UIController.prototype.render = function render() {
	
	        var change = false;
	
	        if (!(0, _value_equals2.default)(this._oldopts, this._opts) || this._automaton === null) {
	            this._automaton = new _automaton2.default(this._opts);
	            this._automaton.generate();
	            this.viewport.automaton = this._automaton;
	            change = true;
	        } else console.log('not changed');
	
	        if (this._viewmode != this.viewport.viewmode) {
	            this.viewport.viewmode = this._viewmode;
	            change = true;
	        }
	
	        if (!(0, _value_equals2.default)(this._palette, this.viewport.palette)) {
	            this.viewport.palette = this._palette;
	            change = true;
	        }
	
	        if (change) {
	            this.viewport.update();
	        }
	
	        // Caching
	        this._oldopts = JSON.parse(JSON.stringify(this._opts));
	    };
	
	    UIController.prototype.nextRule = function nextRule() {
	        this.rule++;
	    };
	
	    UIController.prototype.previousRule = function previousRule() {
	        this.rule--;
	    };
	
	    UIController.prototype.step = function step() {
	        if (this._automaton === null) render();
	
	        this._automaton.step();
	        this.viewport.update();
	    };
	
	    UIController.prototype.incrementInput = function incrementInput(col) {
	        var automaton = this._automaton;
	        if (col >= automaton.width) return;
	        // If the automaton is left-folding, the input is on the right hand side
	        var i = this._opts.foldToRight ? col : col - (automaton.width - automaton.inputSize);
	        var input = this._opts.input;
	
	        // We may need to expand the input array using values from the automaton
	        var delta = 0;
	        if (i >= input.length) {
	            for (var j = input.length; j <= i; j++) {
	                input[j] = automaton.value({ col: j, row: 0 });
	                delta++;
	            }
	        } else if (i < 0) {
	            for (var _j = automaton.width - automaton.inputSize - 1; _j >= col; _j--) {
	                input.unshift(automaton.value({ col: _j, row: 0 }));
	                delta++;
	            }
	            i = 0;
	        }
	        this._opts.folds -= this._opts.folds === 0 ? 0 : delta;
	        input[i] = input[i] === this._opts.base - 1 ? 0 : input[i] + 1;
	        //        console.log( 'picked input ' + i + " new array" + input );
	        this.render();
	    };
	
	    // Properties
	
	
	    UIController.prototype._emit = function _emit(event, data) {
	        var listeners = this._listeners[event];
	        if (typeof listeners === 'undefined') return;
	        for (var _iterator = listeners, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	            var _ref;
	
	            if (_isArray) {
	                if (_i >= _iterator.length) break;
	                _ref = _iterator[_i++];
	            } else {
	                _i = _iterator.next();
	                if (_i.done) break;
	                _ref = _i.value;
	            }
	
	            var func = _ref;
	
	            func(data);
	        }
	    };
	
	    _createClass(UIController, [{
	        key: "color0",
	        get: function get() {
	            return this._palette[0];
	        },
	        set: function set(c) {
	            this._palette[0] = c;this.update();
	        }
	    }, {
	        key: "color1",
	        get: function get() {
	            return this._palette[1];
	        },
	        set: function set(c) {
	            this._palette[1] = c;this.update();
	        }
	    }, {
	        key: "color2",
	        get: function get() {
	            return this._palette[2];
	        },
	        set: function set(c) {
	            this._palette[2] = c;this.update();
	        }
	    }, {
	        key: "color3",
	        get: function get() {
	            return this._palette[3];
	        },
	        set: function set(c) {
	            this._palette[3] = c;this.update();
	        }
	    }, {
	        key: "viewmode",
	        get: function get() {
	            return this._viewmode;
	        },
	        set: function set(m) {
	            this._viewmode = m;this.update();
	        }
	    }, {
	        key: "mode",
	        get: function get() {
	            return this._opts.mode;
	        },
	        set: function set(i) {
	            this._opts.mode = i;
	            this._emit('maxrules', _automaton2.default.maxRules(this._opts.base, i));
	            this.update();
	        }
	    }, {
	        key: "base",
	        get: function get() {
	            return this._opts.base;
	        },
	        set: function set(i) {
	            this._opts.base = i;
	            this._emit('maxrules', _automaton2.default.maxRules(i, this._opts.mode));
	            this.update();
	        }
	    }, {
	        key: "folds",
	        get: function get() {
	            return this._opts.folds;
	        },
	        set: function set(i) {
	            this._opts.folds = i;this._emit('folds', i);this.update();
	        }
	    }, {
	        key: "foldToRight",
	        get: function get() {
	            return this._opts.foldToRight;
	        },
	        set: function set(b) {
	            this._opts.foldToRight = b == 'true' || b == true;this.update();
	        }
	    }, {
	        key: "rule",
	        get: function get() {
	            return this._opts.rule;
	        },
	        set: function set(i) {
	            if (i >= 0 && i < this._automaton.maxRules) {
	                this._opts.rule = i;
	                this._emit('rule', i);
	                this.update();
	            }
	        }
	    }, {
	        key: "inputSize",
	        get: function get() {
	            return this._opts.input.length;
	        },
	        set: function set(i) {}
	    }]);
	
	    return UIController;
	}();
	
	var App = function () {
	    function App(_ref2) {
	        var _ref2$container_id = _ref2.container_id,
	            container_id = _ref2$container_id === undefined ? '' : _ref2$container_id;
	
	        _classCallCheck(this, App);
	
	        console.log('hallo ik ben een poes, dag vrienden');
	
	        // Create a viewport container inside the given element id
	        this.container = document.getElementById(container_id);
	        if (typeof this.container == 'undefined') this.container = document.body;
	
	        var viewport = document.createElement('div');
	        viewport.className = 'viewport';
	        this.container.appendChild(viewport);
	
	        // Let's set-up the viewport
	        this.viewport = new _viewport2.default(viewport);
	        this.viewport.init();
	
	        // Create the controller for the user controls
	        this.controller = new UIController(this.viewport);
	
	        // Set-up UI
	        this.toolbox = null;
	        this.setupToolbox();
	        this.menubar = null;
	        this.setupMenubar();
	
	        // Render initial settings
	        this.controller.render();
	
	        /*let a = this.controller._automaton;
	        let n = a.first();
	        do {
	            console.log( `Node: ${n.row},${n.col}` );
	            n = a.next(n);
	        } while( a.isLast(n) );*/
	    }
	
	    App.prototype.setupMenubar = function setupMenubar() {
	        var _this2 = this;
	
	        // Make a menubar 
	        this.menubar = new _menubar2.default(this.container);
	
	        var a_ctrls = this.menubar.addGroup().floatLeft();
	        a_ctrls.addLink('RFExplore');
	
	        var step_ctrls = this.menubar.addGroup().floatCenter();
	        var rule_label = null;
	        step_ctrls.addButton('', 'fa fa-backward').action(function () {
	            _this2.controller.previousRule();
	        });
	        rule_label = step_ctrls.addLink('Rule #' + this.controller.rule);
	        this.controller.on('rule', function (r) {
	            rule_label.text = 'Rule #' + r;
	        });
	        step_ctrls.addButton('', 'fa fa-forward').action(function () {
	            _this2.controller.nextRule();
	        });
	
	        var r_ctrls = this.menubar.addGroup().floatRight();
	        r_ctrls.addButton('', 'fa fa-arrows-alt').action(function () {
	            screenfull.toggle();
	        });
	        r_ctrls.addButton('', 'fa fa-step-forward').action(function () {
	            _this2.controller.step();
	        });
	        r_ctrls.addButton('Render', 'fa fa-camera-retro').action(function () {
	            _this2.controller.render();
	        });
	        r_ctrls.addLink('', 'fa fa-circle-o');
	    };
	
	    App.prototype.setupToolbox = function setupToolbox() {
	        var _this3 = this;
	
	        this.toolbox = new dat.GUI();
	
	        // Automaton toolbox
	        var f_a = this.toolbox.addFolder('Automaton');
	        f_a.add(this.controller, 'mode', 2, 2).step(1).name('Mode');
	        f_a.add(this.controller, 'base', 2, 4).step(1).name('Base');
	        var rule_ctrl = f_a.add(this.controller, 'rule', 0, 15).name('Rule').step(1);
	        this.controller.on('maxrules', function (i) {
	            rule_ctrl.max(i);rule_ctrl.updateDisplay();
	        });
	        this.controller.on('rule', function (i) {
	            rule_ctrl.updateDisplay();
	        });
	        f_a.add(this.controller, 'folds', 0, 500).name('#Folds').step(1).listen();
	        f_a.add(this.controller, 'foldToRight', { Left: false, Right: true }).name('Fold');
	        f_a.add(this.controller, 'inputSize').name('Input size').step(1).listen();
	        f_a.open();
	
	        // Visualisation toolbox
	        var f_v = this.toolbox.addFolder('Visualisation');
	        f_v.add(this.controller, 'viewmode', { Brick: 'brick', Diamond: 'diamond', Circle: 'circle', Stack: 'stack', Folded: 'folded' }).name('Cell shape');
	        f_v.open();
	
	        // Colors toolbox
	        var f_c = this.toolbox.addFolder('Colors');
	        f_c.addColor(this.controller, 'color0').name('0').onFinishChange(function () {
	            _this3.controller.update();
	        });
	        f_c.addColor(this.controller, 'color1').name('1');
	        f_c.addColor(this.controller, 'color2').name('2');
	        f_c.addColor(this.controller, 'color3').name('3');
	        f_c.addColor(this.viewport, 'backgroundColor').name('Background');
	        //f_c.open();
	
	        // Render toolbox
	        var f_r = this.toolbox.addFolder('Render');
	        f_r.add(this.controller, 'autoUpdate').name('Auto-update');
	        f_r.add(this.viewport, 'animateSpin').name('Spin');
	        f_r.add(this.viewport, 'animateDraw').name('Animate draw');
	        f_r.add(this.viewport, 'animateDrawType', { Rows: 'rows', Ordered: 'ordered' }).name('Draw type');
	        f_r.add(this.controller, 'render').name('Render');
	    };
	
	    return App;
	}();
	
	exports.default = {
	    App: App
	};
	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Automaton = function () {
	
	    /* 
	     * Constructs a new Automaton given 'opts' and generates a transition table 
	     */
	    function Automaton() {
	        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	            _ref$base = _ref.base,
	            base = _ref$base === undefined ? 2 : _ref$base,
	            _ref$mode = _ref.mode,
	            mode = _ref$mode === undefined ? 2 : _ref$mode,
	            _ref$rule = _ref.rule,
	            rule = _ref$rule === undefined ? 0 : _ref$rule,
	            _ref$input = _ref.input,
	            input = _ref$input === undefined ? [0, 0] : _ref$input,
	            _ref$maxSteps = _ref.maxSteps,
	            maxSteps = _ref$maxSteps === undefined ? 0 : _ref$maxSteps,
	            _ref$folds = _ref.folds,
	            folds = _ref$folds === undefined ? 0 : _ref$folds,
	            _ref$foldToRight = _ref.foldToRight,
	            foldToRight = _ref$foldToRight === undefined ? false : _ref$foldToRight;
	
	        _classCallCheck(this, Automaton);
	
	        this.opts = {
	            base: base,
	            mode: mode,
	            rule: rule,
	            input: input,
	            maxSteps: maxSteps,
	            folds: folds,
	            foldToRight: foldToRight
	        };
	        /*        this._= {
	                    curRow : 1, // row 0 is the top (input) row
	                    curPos : ( foldToRight ? this._rows[0].length-2 : 0 ),
	                    folds: 0
	                };*/
	        // Internal state
	        this._rows = new Array();
	        this._rows.push(foldToRight ? input.slice() : input.slice().reverse());
	        this._curRow = 0; // row 0 is the top (input) row
	        this._curPos = this._rows[0].length - 1;
	        this._folds = 0;
	
	        this.maxRules = 0;
	        this.ttable = this.makeTTable(base, mode, rule);
	        this.nodeCount = this.width;
	        this.inputSize = input.length;
	    }
	
	    /* 
	     * General functions that define the dimensions 
	     */
	
	
	    Automaton.prototype.rowLength = function rowLength(i) {
	        return this._rows[i].length;
	    };
	
	    Automaton.maxRules = function maxRules(base, mode) {
	        var rulesize = Math.pow(base, mode);
	        return Math.pow(base, rulesize);
	    };
	
	    /*
	     * Generate a transition table given a base, mode and rule number
	     * Returns an array
	     */
	
	
	    Automaton.prototype.makeTTable = function makeTTable(base, mode, rule) {
	        var tt = new Array();
	        var rulesize = Math.pow(base, mode);
	        this.maxRules = Math.pow(base, rulesize);
	
	        console.log("Transition table for rule #" + rule + " / " + this.maxRules + " * " + rulesize);
	        if (rulesize > this.maxRules) {
	            return null;
	        }
	
	        for (var _i = 0; _i < rulesize; _i++) {
	            tt[_i] = 0;
	        }var decimal = rule; // Rule in base 10
	        var i = rulesize - 1;
	        while (i >= 0 && decimal > 0) {
	            tt[i] = decimal % base;
	            decimal = Math.floor(decimal / base);
	            i--;
	        }
	        for (var _i2 = 0; _i2 < rulesize; _i2++) {
	            console.log(_i2 + ": " + tt[_i2]);
	        }return tt;
	    };
	
	    /*
	     * Given a base, mode and set of input nodes A (A.length == mode),
	     * returns the index of the transition table that contains the reduction rule
	     * for A[0] .. A[mode-1] -> b
	     */
	
	
	    Automaton.prototype.ttIndex = function ttIndex(base, mode, A) {
	        var mult = 1;
	        var index = 0;
	        for (var i = mode - 1; i >= 0; i--) {
	            index += A[i] * mult;
	            mult *= base;
	        }
	        return index;
	    };
	
	    Automaton.prototype.first = function first() {
	        return this._transpose({ col: 0, row: 0 });
	    };
	
	    Automaton.prototype.isLast = function isLast(_ref2) {
	        var col = _ref2.col,
	            row = _ref2.row;
	
	        var n = this._transpose({ col: col, row: row });
	        return n.col === this._curPos && n.row === this._curRow;
	    };
	
	    /*
	     * Return the position { col, row } of the most recently calculated node
	     */
	
	
	    Automaton.prototype.last = function last() {
	        return this._transpose({ col: this._curPos, row: this._curRow });
	    };
	
	    /*
	     * Given a column and row, return the position of the next node that need to be calculated
	     * Returns object in the form of { col, row }
	     */
	
	
	    Automaton.prototype.next = function next(_ref3) {
	        var col = _ref3.col,
	            row = _ref3.row;
	
	        return this._transpose(this._next(this._transpose({ col: col, row: row })));
	    };
	
	    /*
	     * Given a column and row, return the position of the previously calculated node
	     * Returns object in the form of { col, row }
	     */
	
	
	    Automaton.prototype.previous = function previous(_ref4) {
	        var col = _ref4.col,
	            row = _ref4.row;
	
	        return this._transpose(this._previous(this._transpose({ col: col, row: row })));
	    };
	
	    /* Given a column and row, return the value of the node in that position
	     * Note that a bounds check is omitted for performance
	     */
	
	
	    Automaton.prototype.value = function value(_ref5) {
	        var col = _ref5.col,
	            row = _ref5.row;
	
	        var pos = this._transpose({ col: col, row: row });
	        return this._rows[pos.row][pos.col];
	    };
	
	    /*
	     * Advance the automaton by one step
	     * This step may either be a reduction step or a fold
	     */
	
	
	    Automaton.prototype.step = function step() {
	        if (this._curRow === 0 && this._rows.length === 0) {
	            console.error("Automaton: undefined top row, there is no input.");
	            return;
	        }
	        // Step 0. compute the position of the next cell
	        var nextPos = this._next({ col: this._curPos, row: this._curRow });
	        this._curRow = nextPos.row;
	        this._curPos = nextPos.col;
	
	        if (this._curRow === 0) {
	            //console.log( "fold" );
	            // Top row, which means the next step can only be a fold
	            // Step 1. extend all rows by one
	            for (var i = 0; i < this._rows.length; i++) {
	                // push
	                this._rows[i][this._rows[i].length] = -1;
	            }
	            // Step 2. copy ('fold') the apex/singleton row over to the top row
	            var foldValue = this._rows[this._rows.length - 1][0];
	            this._rows[0][this._curPos] = foldValue;
	            // Step 3. extend the automata
	            this._rows.push([-1]);
	            this._folds++;
	            this.nodeCount += this._rows.length;
	            return;
	        } else if (typeof this._rows[this._curRow] === 'undefined') {
	            // We need to start a new row
	            var len = this._rows[this._curRow - 1].length - 1;
	            this._rows.push(new Array(len));
	            this._rows[this._curRow].fill(-1);
	            this.nodeCount += len;
	        }
	        // Now we calculate the next iteration by reduction
	        // Step 1. get values from parent nodes (one row up)
	        var parents = this._rows[this._curRow - 1].slice(this._curPos, this._curPos + this.opts.mode);
	
	        // Step 2. Use the transition table to obtain the value for the current node
	        var value = this.ttable[this.ttIndex(this.opts.base, this.opts.mode, parents)];
	        this._rows[this._curRow][this._curPos] = value;
	    };
	
	    Automaton.prototype.generate = function generate(done) {
	
	        while (this._rows[this._curRow].length !== 1 || this._folds !== this.opts.folds) {
	            this.step();
	        }
	
	        if (typeof done === 'function') done(this);
	    };
	
	    /*
	     * If the automaton is set to expand (fold) to the left, 
	     * we mirror the entire datastructure for optimization.
	     */
	
	
	    Automaton.prototype._mirrored = function _mirrored() {
	        return !this.opts.foldToRight;
	    };
	
	    /*
	     * Return the transposed (mirrored) coordinates for {col,row}
	     * This translates internal coordinates to logical (abstracted) coordinates
	     */
	
	
	    Automaton.prototype._transpose = function _transpose(_ref6) {
	        var col = _ref6.col,
	            row = _ref6.row;
	
	
	        if (this.opts.foldToRight) return { col: col, row: row };else return { col: this._rows[row].length - 1 - col, row: row };
	    };
	
	    /*
	     * Calculate the next position using internal coordinates
	     */
	
	
	    Automaton.prototype._next = function _next(_ref7) {
	        var col = _ref7.col,
	            row = _ref7.row;
	
	        var _row = this._rows[row];
	        var unfoldedRowLength = this.inputSize - row * (this.opts.mode - 1);
	        var lastInputRow = this.inputSize - 1; // TODO fix for mode > 2
	
	        if (col < unfoldedRowLength && row < lastInputRow) {
	            if (col === unfoldedRowLength - 1) return { col: 0, row: row + 1 };else return { col: col + 1, row: row };
	        } else if (col === 0) {
	            return { col: this.inputSize + (row - lastInputRow), row: 0 };
	        }
	
	        return { col: col - 1, row: row + 1 };
	
	        /* // Case 1: we're the apex, return to the top row
	         if( _row.length === 1 ) {
	             return { col: this._rows[0].length, row: 0 };
	         }
	         // Case 2: end of the row, advance one row
	         else if( col+1 >= _row.length ) {
	             if( row+1 < this.rows ) {
	                 let _row = this._rows[row+1];
	                 // Case 2a: We're folding, only one value missing
	                 if( typeof _row !== 'undefined'  && _row[0] !== -1 )
	                     return { col: _row.length-1, row: row + 1 };
	             }
	             // Case 2b: Not folding, start at the beginning
	             return { col: 0, row: row + 1 };
	         }
	         // Case 3: next column is already calculated, advance one row
	         //else if( _row[col+1] !== -1 ) {
	         //    return { col: 0, row: row + 1 };
	         //}
	         // Case 4: just advance the column
	         return { col: col + 1, row: row };*/
	    };
	
	    /*
	     * Calculate the previous position using internal coordinates
	     */
	
	
	    Automaton.prototype._previous = function _previous(_ref8) {
	        var col = _ref8.col,
	            row = _ref8.row;
	
	        var pos = { col: col, row: row };
	        var _row = this._rows[row];
	    };
	
	    _createClass(Automaton, [{
	        key: "width",
	        get: function get() {
	            return this._rows[0].length;
	        }
	    }, {
	        key: "rows",
	        get: function get() {
	            return this._rows.length;
	        }
	    }]);
	
	    return Automaton;
	}(); // class Automaton
	
	
	exports.default = Automaton;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _value_equals = __webpack_require__(4);
	
	var _value_equals2 = _interopRequireDefault(_value_equals);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var diamondWidth = 1 * Math.sqrt(2);
	
	var Viewport = function () {
	    function Viewport(elem) {
	        _classCallCheck(this, Viewport);
	
	        this.container = elem;
	
	        this.automaton = null;
	        // fixme: remove
	        this.palette = ['#ff5511', '#33eeff', '#ff33dd'];
	
	        this.viewportWidth = this.container.offsetWidth;
	        this.viewportHeight = this.container.offsetHeight;
	
	        this._viewmode = 'folded'; // one of 'brick', 'diamond', 'circle', 'folded'
	        this._backgroundColor = '#777777';
	        this._scene = null;
	        this._aspect = 1.0;
	        this._cameraPersp = null;
	        this._cameraOrtho = null;
	        this._controls = null;
	        this._sceneHeight = 10;
	        this._renderer = null;
	        this._lights = new Array();
	        this._raycaster = new THREE.Raycaster();
	        this._mouse = new THREE.Vector2();
	        this._model = {
	            geometry: null, // BufferGeometry reference
	            attr_normal: null, // BufferAttribute for normal
	            buf_normal: null, // Int16Array with normals
	            attr_color: null, // BufferAttribute for color
	            buf_color: null, // Uint8Array with color data
	            attr_position: null, // BufferAttribute for position
	            buf_position: null, // Float32Array with position data
	            offset: 0, // Pointer after the last element
	            template_size: 0, // Elements in the template geometry
	            node_count: 0, // Total number of nodes in the geometry
	            mesh: null, // Mesh reference to the final object
	            viewmode: null, // Viewmode used to construct geometry
	            mode: 0, // Mode used to contruct geometry
	            input_pickers: null, // Array of Meshes 
	            picked: null, // Reference to the picked Mesh
	            right: false // Pivot is at right hand side
	        };
	        this._animation = {
	            spin: true,
	            animateDraw: true,
	            drawType: 'rows', //  one of 'rows', 'ordered'
	            drawDone: false,
	            node: { col: 0, row: 0 },
	            row: 0
	        };
	        this._inputClickCallback = null;
	    }
	
	    Viewport.prototype.render = function render() {
	        if (this._viewmode === 'folded') {
	            this._renderer.render(this._scene, this._cameraPersp);
	        } else {
	            this._renderer.render(this._scene, this._cameraOrtho);
	        }
	    };
	
	    Viewport.prototype.animate = function animate() {
	        var _this = this;
	
	        var req = false; // request new frame
	
	        if (!this._animation.drawDone) {
	            this._updateCellsAnimated();
	            req = true;
	        }
	        if (this._animation.spin && this._viewmode === 'folded') {
	            this._model.mesh.rotateY(0.002);
	            req = true;
	        }
	
	        this._controls.update();
	        this.render();
	
	        if (req) requestAnimationFrame(function () {
	            _this.animate();
	        });
	    };
	
	    Viewport.prototype.init = function init() {
	        var _this2 = this;
	
	        console.log('Initializing WebGL');
	
	        this._scene = new THREE.Scene();
	        this._scene.background = new THREE.Color(this.backgroundColor);
	        this._aspect = this.viewportWidth / this.viewportHeight;
	        this._cameraPersp = new THREE.PerspectiveCamera(35, this._aspect, 0.1, 3000);
	        this._cameraOrtho = new THREE.OrthographicCamera(this._aspect * this._sceneHeight / -2, this._aspect * this._sceneHeight / 2, -this._sceneHeight / 2, this._sceneHeight / 2);
	
	        this._renderer = new THREE.WebGLRenderer({ antialias: true });
	        this._renderer.setSize(this.viewportWidth, this.viewportHeight);
	        this.container.appendChild(this._renderer.domElement);
	
	        this._cameraOrtho.position.z = 10;
	        this._cameraPersp.position.z = 10;
	
	        // Setup orbit controls
	        this._controls = new THREE.OrbitControls(this._cameraPersp, this._renderer.domElement);
	        this._controls.addEventListener('change', function () {
	            _this2.render();
	        });
	
	        // Setup lights for the 3d view
	        var lights = this._lights;
	        lights[0] = new THREE.AmbientLight(0x13162B, 4);
	        lights[0].position.set(0, 0, 0);
	        lights[0].target = new THREE.Vector3(0, 0, 0);
	        this._scene.add(lights[0]);
	
	        lights[1] = new THREE.DirectionalLight(0xEDE2C7);
	        lights[1].position.set(10, 10, 10);
	        this._scene.add(lights[1]);
	
	        lights[2] = new THREE.DirectionalLight(0xC7E8ED);
	        lights[2].position.set(0, -10, -10);
	        this._scene.add(lights[2]);
	
	        lights[3] = new THREE.DirectionalLight(0xC8D9C8);
	        lights[3].position.set(-10, 10, 0);
	        this._scene.add(lights[3]);
	
	        this.render();
	
	        window.addEventListener('resize', function () {
	            _this2._onWindowResize();
	        });
	        document.addEventListener('mousemove', function (e) {
	            _this2._onDocumentMousemove(e);
	        });
	        this.container.addEventListener('click', function () {
	            _this2._onClick();
	        });
	    };
	
	    Viewport.prototype.updateCamera = function updateCamera() {
	        var sceneHeight = this._sceneHeight;
	        var aspect = this._aspect;
	        this._cameraPersp.aspect = aspect;
	        this._cameraPersp.position.z = 1.2 * (sceneHeight / 2) / Math.tan(this._cameraPersp.fov / 360 * Math.PI);
	        this._cameraPersp.updateProjectionMatrix();
	        this._cameraOrtho.left = aspect * sceneHeight / -2;
	        this._cameraOrtho.right = aspect * sceneHeight / 2;
	        this._cameraOrtho.top = sceneHeight / 2;
	        this._cameraOrtho.bottom = sceneHeight / -2;
	        this._cameraOrtho.updateProjectionMatrix();
	    };
	
	    Viewport.prototype.setOnInputClicked = function setOnInputClicked(func) {
	        this._inputClickCallback = func;
	    };
	
	    Viewport.prototype.clearGeometry = function clearGeometry() {
	        var scene = this._scene;
	        for (var i = 0; i < scene.children.length; i++) {
	            if (scene.children[i].name !== 'helper' && !(scene.children[i] instanceof THREE.AmbientLight) && !(scene.children[i] instanceof THREE.DirectionalLight)) {
	                scene.remove(scene.children[i]);
	                i--;
	            }
	        }
	    };
	
	    Viewport.prototype.update = function update() {
	        if (this.automaton === null) return;
	        // See if we need to update the geometry at all, criteria are:
	        // - Different viewmode
	        // - More cells 
	        // - Different mode
	        // - Pivot position
	        if (this._viewmode !== this._model.viewmode || this.automaton.opts.mode !== this._model.mode || this.automaton.nodeCount !== this._model.node_count || !this.automaton.opts.foldToRight !== this._model.right) {
	            console.log('Viewport: rebuilding geometry');
	            var populate = !this._animation.animateDraw;
	            this._updateGeometry(populate);
	        } else {
	            if (!this._animation.animateDraw) this._updateCells();
	        }
	        if (this._animation.animateDraw) {
	            this._updateCells(true);
	            this._animation.node = this.automaton.first();this._animation.row = 0;
	            this._animation.drawDone = false;
	        }
	        this.animate();
	    };
	
	    //
	    // Private event listeners
	    //
	
	    Viewport.prototype._onWindowResize = function _onWindowResize() {
	        var container = this.container;
	
	        this.viewportWidth = container.offsetWidth;
	        this.viewportHeight = container.offsetHeight;
	        this._aspect = this.viewportWidth / this.viewportHeight;
	        this.updateCamera();
	        this._renderer.setSize(this.viewportWidth, this.viewportHeight);
	        this.render();
	    };
	
	    Viewport.prototype._onDocumentMousemove = function _onDocumentMousemove(event) {
	        this._mouse.x = event.clientX / window.innerWidth * 2 - 1;
	        this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
	        if (this.viewmode !== 'folded') {
	            var render = false;
	
	            this._raycaster.setFromCamera(this._mouse, this._cameraOrtho);
	            var intersects = this._raycaster.intersectObjects(this._model.input_pickers);
	
	            if (this._model.picked !== null) {
	                this._model.picked.material.opacity = 0.0;
	                this._model.picked = null;
	                render = true;
	            }
	            if (intersects.length !== 0) {
	                intersects[0].object.material.opacity = 0.5;
	                this._model.picked = intersects[0].object;
	                render = true;
	            }
	            if (render) this.render();
	        }
	    };
	
	    Viewport.prototype._onClick = function _onClick() {
	        var picked = this._model.picked;
	        if (picked !== null) {
	            if (typeof this._inputClickCallback === 'function') {
	                this._inputClickCallback(picked.userData.col);
	            }
	        }
	    };
	
	    //
	    // Private functions
	    //
	
	
	    /*
	     * Set the geometry's color at position of node to color
	     */
	
	
	    Viewport.prototype._setColor = function _setColor(node, color) {
	        var M = this._model;
	        var n = M.template_size; // elements per template geometry
	        var offset = node * n;
	        for (var i = 0; i < n; i += 3) {
	            M.buf_color[offset + i] = color.r * 255;
	            M.buf_color[offset + i + 1] = color.g * 255;
	            M.buf_color[offset + i + 2] = color.b * 255;
	        }
	        if (M.attr_color.updateRange.count === -1) {
	            M.attr_color.updateRange.offset = offset;
	            M.attr_color.updateRange.count = n;
	        } else {
	            var old_offset = M.attr_color.updateRange.offset;
	            if (old_offset < offset) {
	                M.attr_color.updateRange.count = offset - old_offset + n;
	            } else {
	                M.attr_color.updateRange.offset = offset;
	                M.attr_color.updateRange.count = old_offset - offset + n;
	            }
	        }
	    };
	
	    /* 
	     * Given a col and row, return the color that represents the value
	     * of this node in the automaton
	     */
	
	
	    Viewport.prototype._nodeColor = function _nodeColor(node) {
	        var color = this.backgroundColor;
	        var value = this.automaton.value(node);
	        if (value >= 0) color = this.palette[value];
	        return new THREE.Color(color);
	    };
	
	    /*
	     * Given a col and row, calculate the offset within the geometry
	     */
	
	
	    Viewport.prototype._calcNodeOffset = function _calcNodeOffset(_ref) {
	        var col = _ref.col,
	            row = _ref.row;
	
	        // FIXME: add support for modes
	        var width = this.automaton.width;
	        var rowoffs = 0;
	        for (var i = 0; i < row; i++) {
	            rowoffs += width--;
	        }return rowoffs + col;
	    };
	
	    /*
	     * Change the colors of the geometry such that it represents the current automaton 
	     */
	
	
	    Viewport.prototype._updateCells = function _updateCells() {
	        var only_clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	
	        var automaton = this.automaton;
	        if (automaton === null) return;
	
	        var node = 0;
	        if (!only_clean) {
	            for (var i = 0; i < automaton.rows; i++) {
	                for (var j = 0; j < automaton.rowLength(i); j++) {
	                    var color = this._nodeColor({ row: i, col: j });
	                    this._setColor(this._calcNodeOffset({ col: j, row: i }), new THREE.Color(color));
	
	                    node++;
	                }
	            }
	        }
	        // Make the rest of the cells blank
	        for (var n = node; n < this._model.node_count; n++) {
	            this._setColor(n, new THREE.Color(this.backgroundColor));
	        }
	        // Update the buffer
	        this._model.attr_color.needsUpdate = true;
	    };
	
	    /*
	     * Change the colors of the geometry such that it represents the current automaton,
	     * when animated, this function performs the next step in the animation.
	     */
	
	
	    Viewport.prototype._updateCellsAnimated = function _updateCellsAnimated() {
	        var automaton = this.automaton;
	        if (automaton === null) return;
	
	        if (this._animation.drawType === 'ordered') {
	            var node = this._animation.node;
	            var color = this._nodeColor(node);
	            var offset = this._calcNodeOffset(node);
	
	            this._setColor(offset, color);
	            if ((0, _value_equals2.default)(node, automaton.last())) this._animation.drawDone = true;else this._animation.node = automaton.next(node);
	        } else if (this._animation.drawType === 'rows') {
	            var row = this._animation.row;
	            for (var j = 0; j < automaton.rowLength(row); j++) {
	                var _node = { col: j, row: row };
	                var _color = this._nodeColor(_node);
	                var _offset = this._calcNodeOffset(_node);
	                this._setColor(_offset, _color);
	            }
	            if (row + 1 === automaton.rows) this._animation.drawDone = true;else this._animation.row++;
	        }
	
	        // Update the buffer
	        this._model.attr_color.needsUpdate = true;
	    };
	
	    /*
	     * Create a new geometry (mesh) based on the size of the automaton 
	     * and the viewmode. Discards all previous geometry.
	     */
	
	
	    Viewport.prototype._updateGeometry = function _updateGeometry() {
	        var populate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        var automaton = this.automaton;
	        if (automaton === null) return;
	        var viewmode = this._viewmode;
	
	        // Cleanup from previous calls
	        //
	
	        var M = this._model;
	        if (M.geometry !== null) {
	            this._scene.remove(M.mesh);
	            /* M.attr_position.setArray(null);
	             M.attr_normal.setArray(null);
	             M.attr_color.setArray(null);*/
	            M.geometry.dispose();
	            for (var i = 0; i < M.input_pickers.length; i++) {
	                this._scene.remove(M.input_pickers[i]);
	            }
	        }
	        M.input_pickers = new Array();
	
	        // For some viewmode we use a template geometry
	        // Here we prepare this geometry and the material
	
	        var template = null;
	        var material = null;
	
	        M.template_size = 0;
	        if (viewmode !== 'folded') {
	            material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
	            if (viewmode === 'brick') {
	                template = new THREE.PlaneBufferGeometry(1, 1);
	                template = template.toNonIndexed();
	            } else if (viewmode === 'diamond') {
	                template = new THREE.PlaneBufferGeometry(1, 1);
	                template.rotateZ(Math.PI * 0.25);
	                template.scale(1 / diamondWidth, 1, 1);
	                template = template.toNonIndexed();
	            } else if (viewmode === 'circle') {
	                template = new THREE.CircleBufferGeometry(0.5, 32);
	                template = template.toNonIndexed();
	            } else if (viewmode === 'stack') {
	                template = new THREE.BufferGeometry();
	                var positions = new Float32Array([Math.cos(2 / 3 * Math.PI), 0.0, Math.sin(2 / 3 * Math.PI), Math.cos(4 / 3 * Math.PI), 0.0, Math.sin(4 / 3 * Math.PI), Math.cos(0), 0.0, Math.sin(0)]);
	                /*         let normals = new Float32Array( [
	                                 0.0, 0.0, 1.0,
	                                 0.0, 0.0, 1.0,
	                                 0.0, 0.0, 1.0 ] );*/
	                template.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	            }
	
	            M.template_size = template.getAttribute('position').array.length;
	        } else {
	            material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors, metalness: 0 });
	            template = new THREE.SphereBufferGeometry(1.0, 8, 8);
	            template = template.toNonIndexed();
	            M.template_size = template.getAttribute('position').array.length;
	        }
	
	        // Prepare buffers for the geometry
	
	        M.geometry = new THREE.BufferGeometry();
	        var array_size = automaton.nodeCount * M.template_size;
	        M.buf_position = new Float32Array(array_size);
	        M.buf_color = new Uint8Array(array_size);
	        M.buf_normal = new Int16Array(array_size);
	        M.offset = 0;
	        M.node_count = automaton.nodeCount;
	        M.right = !automaton.opts.foldToRight; // Position of the pivot
	
	        var addInstance = function addInstance(color, translate) {
	            var positions = template.getAttribute('position').array;
	            var normals = null;
	            if (viewmode === 'folded') normals = template.getAttribute('normal').array;
	            for (var _i = 0; _i < M.template_size; _i += 3) {
	                M.buf_position[M.offset + _i] = positions[_i] + translate.x;
	                M.buf_position[M.offset + _i + 1] = positions[_i + 1] + translate.y;
	                M.buf_position[M.offset + _i + 2] = positions[_i + 2] + translate.z;
	
	                M.buf_color[M.offset + _i] = color.r * 255;
	                M.buf_color[M.offset + _i + 1] = color.g * 255;
	                M.buf_color[M.offset + _i + 2] = color.b * 255;
	
	                if (viewmode === 'folded') {
	                    M.buf_normal[M.offset + _i] = normals[_i] * 32767;
	                    M.buf_normal[M.offset + _i + 1] = normals[_i + 1] * 32767;
	                    M.buf_normal[M.offset + _i + 2] = normals[_i + 2] * 32767;
	                }
	            }
	            M.offset += positions.length;
	        };
	
	        var foldedPosition = function foldedPosition(row, col, width, inputLength, right, mode) {
	            var noY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
	
	            // The pivot position determines where the rows start
	            //let coneCol = right ? (width-1) - col : col;
	            // Map the `triangle row' onto the `diagonal row'
	            //let coneRow = row + coneCol;
	            var coneRow = right ? row + (width - 1) - col : row + col;
	            var coneCol = right ? row : coneRow - col;
	            var fold = !(coneRow < inputLength);
	            var coneRowWidth = coneRow + (fold ? 0 : 1); // FIXME: support for mode > 2
	
	            // Calculate the position of the node on the `cone'
	            var calcPosition = function calcPosition(offset) {
	                var p = new THREE.Vector3(0, 0, 0);
	                var phi = (coneCol + offset) * (2 * Math.PI / coneRowWidth);
	                var fold_offset = (coneCol + offset) / coneRowWidth;
	                var radius = (coneRowWidth + fold_offset) / Math.PI;
	
	                p.x = Math.cos(phi) * radius;
	                p.z = Math.sin(phi) * radius;
	
	                p.y = -coneRow * 2 - (fold && !noY ? 2 * fold_offset : 0);
	                return p;
	            };
	            return new Array(calcPosition(0), calcPosition(1));
	        };
	
	        var heightstep = 1.0;
	        if (automaton.opts.mode % 2 === 0) {
	            if (viewmode === 'diamond') heightstep = 1 / diamondWidth;else if (viewmode === 'circle') heightstep = 0.5 + Math.sqrt(0.125);
	        }
	
	        var position = new THREE.Vector3(0, (automaton.rows - 1) * heightstep / 2, 0);
	        for (var _i2 = 0; _i2 < automaton.rows; _i2++) {
	            for (var j = 0; j < automaton.rowLength(_i2); j++) {
	                position.x = -automaton.width / 2 + 0.5 * _i2 + j;
	
	                var color = populate ? this._nodeColor({ row: _i2, col: j }) : new THREE.Color(this.backgroundColor);
	
	                if (viewmode === 'folded') {
	                    var p = foldedPosition(_i2, j, automaton.rowLength(_i2), automaton.opts.input.length, M.right, automaton.opts.mode, false)[0];
	                    p.y += automaton.width;
	                    addInstance(color, p);
	                } else if (viewmode === 'stack') {
	                    var ps = foldedPosition(_i2, j, automaton.rowLength(_i2), automaton.opts.input.length, M.right, automaton.opts.mode, true);
	                    // swap y and z
	                    var t = ps[0].y;
	                    ps[0].y = ps[0].z;
	                    ps[0].z = t;
	                    t = ps[1].y;
	                    ps[1].y = ps[1].z;
	                    ps[1].z = t;
	                    // Use these positions to place the triangle
	                    var tri = template.getAttribute('position').array;
	                    tri[0] = 0.0;tri[1] = 0.0;tri[2] = ps[0].z; // x y z
	                    tri[3] = ps[0].x;tri[4] = ps[0].y;tri[5] = ps[0].z; // x y z
	                    tri[6] = ps[1].x;tri[7] = ps[1].y;tri[8] = ps[1].z; // x y z
	                    addInstance(color, new THREE.Vector3(0, 0, 0));
	                } else {
	                    // Add an instance to the main geometry
	                    addInstance(color, position);
	
	                    // If the node is an input node, also add a picking-mesh for user input
	                    if (_i2 === 0) {
	                        var g = template.clone();
	                        g.translate(position.x, position.y, 1);
	                        var picker_material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: '#ffffff', transparent: true, opacity: 0.0 });
	                        var picker_mesh = new THREE.Mesh(g, picker_material);
	
	                        picker_mesh.userData.col = j;
	                        this._scene.add(picker_mesh);
	                        M.input_pickers.push(picker_mesh);
	                    }
	                }
	            }
	            position.y -= heightstep;
	        }
	        M.attr_position = new THREE.BufferAttribute(M.buf_position, 3);
	        M.attr_color = new THREE.BufferAttribute(M.buf_color, 3);
	        M.attr_color.normalized = true;
	        M.geometry.addAttribute('position', M.attr_position);
	        M.geometry.addAttribute('color', M.attr_color);
	        if (viewmode === 'folded') {
	            M.attr_normal = new THREE.BufferAttribute(M.buf_normal, 3);
	            M.attr_normal.normalized = true;
	            M.geometry.addAttribute('normal', M.attr_normal);
	        }
	        M.geometry.computeBoundingSphere();
	
	        M.mesh = new THREE.Mesh(M.geometry, material);
	        this._scene.add(M.mesh);
	
	        M.viewmode = viewmode;
	        M.mode = automaton.opts.mode;
	
	        if (viewmode === 'folded') this._sceneHeight = automaton.width * 2;else if (viewmode === 'stack') this._sceneHeight = automaton.width * 0.8;else this._sceneHeight = automaton.width * 1.1;
	
	        this.updateCamera();
	    };
	
	    _createClass(Viewport, [{
	        key: "viewmode",
	        set: function set(m) {
	            var viewmode = this._viewmode;
	            var controls = this._controls;
	
	            if (viewmode === 'folded' && m !== 'folded') {
	                controls.reset();
	                controls.object = this._cameraOrtho;
	                controls.enableRotate = false;
	            } else if (viewmode !== 'folded' && m === 'folded') {
	                controls.reset();
	                controls.object = this._cameraPersp;
	                controls.enableRotate = true;
	            }
	            this._viewmode = m;
	            //this.updateGeometry();
	        }
	    }, {
	        key: "animateDrawType",
	        set: function set(t) {
	            this._animation.drawType = t;
	        },
	        get: function get() {
	            return this._animation.drawType;
	        }
	    }, {
	        key: "animateSpin",
	        set: function set(b) {
	            this._animation.spin = b;if (b) this.animate();
	        },
	        get: function get() {
	            return this._animation.spin;
	        }
	    }, {
	        key: "animateDraw",
	        set: function set(b) {
	            this._animation.animateDraw = b;
	        },
	        get: function get() {
	            return this._animation.animateDraw;
	        }
	    }, {
	        key: "backgroundColor",
	        set: function set(str) {
	            this._backgroundColor = str;
	            this._scene.background = new THREE.Color(this.backgroundColor);
	            this.render();
	        },
	        get: function get() {
	            return this._backgroundColor;
	        }
	    }]);
	
	    return Viewport;
	}();
	
	exports.default = Viewport;
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = equals;
	/*  value_equals.js
	    
	    The MIT License (MIT)
	    
	    Copyright (c) 2013-2017, Reactive Sets
	    
	    Permission is hereby granted, free of charge, to any person obtaining a copy
	    of this software and associated documentation files (the "Software"), to deal
	    in the Software without restriction, including without limitation the rights
	    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	    copies of the Software, and to permit persons to whom the Software is
	    furnished to do so, subject to the following conditions:
	    
	    The above copyright notice and this permission notice shall be included in all
	    copies or substantial portions of the Software.
	    
	    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	    SOFTWARE.
	*/
	/* Slightly modified version of https://github.com/ReactiveSets/toubkal/blob/master/lib/util/value_equals.js */
	
	/* -----------------------------------------------------------------------------------------
	 equals( a, b [, enforce_properties_order, cyclic] )
	 
	 Returns true if a and b are deeply equal, false otherwise.
	 
	 Parameters:
	   - a (Any type): value to compare to b
	   - b (Any type): value compared to a
	 
	 Optional Parameters:
	   - enforce_properties_order (Boolean): true to check if Object properties are provided
	     in the same order between a and b
	   
	   - cyclic (Boolean): true to check for cycles in cyclic objects
	 
	 Implementation:
	   'a' is considered equal to 'b' if all scalar values in a and b are strictly equal as
	   compared with operator '===' except for these two special cases:
	     - 0 === -0 but are not equal.
	     - NaN is not === to itself but is equal.
	   
	   RegExp objects are considered equal if they have the same lastIndex, i.e. both regular
	   expressions have matched the same number of times.
	   
	   Functions must be identical, so that they have the same closure context.
	   
	   "undefined" is a valid value, including in Objects
	   
	   106 automated tests.
	   
	   Provide options for slower, less-common use cases:
	   
	     - Unless enforce_properties_order is true, if 'a' and 'b' are non-Array Objects, the
	       order of occurence of their attributes is considered irrelevant:
	         { a: 1, b: 2 } is considered equal to { b: 2, a: 1 }
	     
	     - Unless cyclic is true, Cyclic objects will throw:
	         RangeError: Maximum call stack size exceeded
	*/
	function equals(a, b, enforce_properties_order, cyclic) {
	  return a === b // strick equality should be enough unless zero
	  && a !== 0 // because 0 === -0, requires test by _equals()
	  || _equals(a, b) // handles not strictly equal or zero values
	  ;
	
	  function _equals(a, b) {
	    // a and b have already failed test for strict equality or are zero
	
	    var s, l, p, x, y;
	
	    // They should have the same toString() signature
	    if ((s = toString.call(a)) !== toString.call(b)) return false;
	
	    switch (s) {
	      default:
	        // Boolean, Date, String
	        return a.valueOf() === b.valueOf();
	
	      case '[object Number]':
	        // Converts Number instances into primitive values
	        // This is required also for NaN test bellow
	        a = +a;
	        b = +b;
	
	        return a ? // a is Non-zero and Non-NaN
	        a === b : // a is 0, -0 or NaN
	        a === a ? // a is 0 or -O
	        1 / a === 1 / b // 1/0 !== 1/-0 because Infinity !== -Infinity
	        : b !== b // NaN, the only Number not equal to itself!
	        ;
	      // [object Number]
	
	      case '[object RegExp]':
	        return a.source == b.source && a.global == b.global && a.ignoreCase == b.ignoreCase && a.multiline == b.multiline && a.lastIndex == b.lastIndex;
	      // [object RegExp]
	
	      case '[object Function]':
	        return false; // functions should be strictly equal because of closure context
	      // [object Function]
	
	      case '[object Array]':
	        if (cyclic && (x = reference_equals(a, b)) !== null) return x; // intentionally duplicated bellow for [object Object]
	
	        if ((l = a.length) != b.length) return false;
	        // Both have as many elements
	
	        while (l--) {
	          if ((x = a[l]) === (y = b[l]) && x !== 0 || _equals(x, y)) continue;
	
	          return false;
	        }
	
	        return true;
	      // [object Array]
	
	      case '[object Object]':
	        if (cyclic && (x = reference_equals(a, b)) !== null) return x; // intentionally duplicated from above for [object Array]
	
	        l = 0; // counter of own properties
	
	        if (enforce_properties_order) {
	          var properties = [];
	
	          for (p in a) {
	            if (a.hasOwnProperty(p)) {
	              properties.push(p);
	
	              if ((x = a[p]) === (y = b[p]) && x !== 0 || _equals(x, y)) continue;
	
	              return false;
	            }
	          }
	
	          // Check if 'b' has as the same properties as 'a' in the same order
	          for (p in b) {
	            if (b.hasOwnProperty(p) && properties[l++] != p) return false;
	          }
	        } else {
	          for (p in a) {
	            if (a.hasOwnProperty(p)) {
	              ++l;
	
	              if ((x = a[p]) === (y = b[p]) && x !== 0 || _equals(x, y)) continue;
	
	              return false;
	            }
	          }
	
	          // Check if 'b' has as not more own properties than 'a'
	          for (p in b) {
	            if (b.hasOwnProperty(p) && --l < 0) return false;
	          }
	        }
	
	        return true;
	      // [object Object]
	    } // switch toString.call( a )
	  } // _equals()
	
	  /* -----------------------------------------------------------------------------------------
	     reference_equals( a, b )
	     
	     Helper function to compare object references on cyclic objects or arrays.
	     
	     Returns:
	       - null if a or b is not part of a cycle, adding them to object_references array
	       - true: same cycle found for a and b
	       - false: different cycle found for a and b
	     
	     On the first call of a specific invocation of equal(), replaces self with inner function
	     holding object_references array object in closure context.
	     
	     This allows to create a context only if and when an invocation of equal() compares
	     objects or arrays.
	  */
	  function reference_equals(a, b) {
	    var object_references = [];
	
	    return (reference_equals = _reference_equals)(a, b);
	
	    function _reference_equals(a, b) {
	      var l = object_references.length;
	
	      while (l--) {
	        if (object_references[l--] === b) return object_references[l] === a;
	      }object_references.push(a, b);
	
	      return null;
	    } // _reference_equals()
	  } // reference_equals()
	} // equals()
	
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TEXT_TYPE = 'text';
	var BUTTON_TYPE = 'button';
	
	var NO_ACTION = 'none';
	var FUNC_ACTION = 'func';
	var URL_ACTION = 'url';
	var DROPDOWN_ACTION = 'dropdown';
	
	var Menuitem = function () {
	    function Menuitem(_ref) {
	        var container = _ref.container,
	            _ref$text = _ref.text,
	            text = _ref$text === undefined ? '' : _ref$text,
	            _ref$iconclass = _ref.iconclass,
	            iconclass = _ref$iconclass === undefined ? '' : _ref$iconclass,
	            _ref$type = _ref.type,
	            type = _ref$type === undefined ? 'text' : _ref$type,
	            _ref$action = _ref.action,
	            action = _ref$action === undefined ? 'none' : _ref$action;
	
	        _classCallCheck(this, Menuitem);
	
	        this.container = container;
	        this._text = text;
	        this._iconclass = iconclass;
	        this._type = type;
	        this._action = action;
	        this._callback = null;
	
	        this._liNode = null;
	        this._aNode = null;
	        this._textNode = null;
	        this._iconNode = null;
	
	        this._appendElem();
	    }
	
	    Menuitem.prototype.action = function action(obj) {
	        if (typeof obj === 'function') {
	            this._action = FUNC_ACTION;
	            this._callback = obj;
	            this._aNode.setAttribute('href', '#');
	        } else if (typeof obj === 'string') {
	            this._action = URL_ACTION;
	            this._callback = null;
	            this._aNode.setAttribute('href', obj);
	        }
	        return this;
	    };
	
	    Menuitem.prototype._appendElem = function _appendElem() {
	        var _this = this;
	
	        this._liNode = document.createElement('li');
	        this.container.appendChild(this._liNode);
	
	        switch (this._type) {
	            case TEXT_TYPE:
	                this._aNode = document.createElement('a');
	                this._liNode.appendChild(this._aNode);
	                break;
	            case BUTTON_TYPE:
	                this._aNode = document.createElement('a');
	                this._aNode.className = 'button';
	                this._liNode.appendChild(this._aNode);
	                break;
	        }
	        this._textNode = document.createTextNode(this._text);
	        this._aNode.appendChild(this._textNode);
	        this._iconNode = document.createElement('i');
	        this._aNode.appendChild(this._iconNode);
	        this.iconclass = this._iconclass;
	
	        this._aNode.addEventListener('click', function () {
	            _this._clicked();
	        });
	    };
	
	    Menuitem.prototype._clicked = function _clicked() {
	        switch (this._action) {
	            case NO_ACTION:
	                break;
	            case FUNC_ACTION:
	                if (typeof this._callback === 'function') this._callback();
	                break;
	            case URL_ACTION:
	                break;
	            case DROPDOWN_ACTION:
	                // TODO
	                break;
	        }
	    };
	
	    _createClass(Menuitem, [{
	        key: 'text',
	        set: function set(t) {
	            this._text = t;
	            this._textNode.nodeValue = t;
	        },
	        get: function get() {
	            return this._text;
	        }
	    }, {
	        key: 'iconclass',
	        set: function set(c) {
	            this._iconclass = c;
	            if (this._text != '') this._iconNode.className = 'text-left ' + c;else this._iconNode.className = '' + c;
	        },
	        get: function get() {
	            return this._iconclass;
	        }
	    }]);
	
	    return Menuitem;
	}();
	
	var Menubar = function () {
	    function Menubar(container) {
	        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	            _ref2$subgroup = _ref2.subgroup,
	            subgroup = _ref2$subgroup === undefined ? false : _ref2$subgroup,
	            _ref2$parent = _ref2.parent,
	            parent = _ref2$parent === undefined ? null : _ref2$parent,
	            _ref2$panel = _ref2.panel,
	            panel = _ref2$panel === undefined ? false : _ref2$panel;
	
	        _classCallCheck(this, Menubar);
	
	        var parentContainer = container || document.body;
	        this._subgroup = subgroup;
	        this._parent = parent;
	
	        if (subgroup) {
	            this.container = parentContainer;
	        } else {
	            this.container = document.createElement('div');
	            this.container.className = "menubar";
	            parentContainer.appendChild(this.container);
	        }
	
	        if (!subgroup || subgroup && panel) {
	            this._rootPanel = document.createElement('div');
	            this._rootPanel.className = "panel";
	            this.container.appendChild(this._rootPanel);
	        } else {
	            this._rootPanel = parent._rootPanel;
	        }
	
	        this._ulNode = document.createElement('ul');
	        this._rootPanel.appendChild(this._ulNode);
	
	        this._items = new Array();
	        this._groups = new Array();
	    }
	
	    Menubar.prototype.addGroup = function addGroup() {
	        var group = new Menubar(this.container, { subgroup: true, parent: this });
	        this._groups.push(group);
	        return group;
	    };
	
	    Menubar.prototype.addPanel = function addPanel() {
	        var group = new Menubar(this.container, { subgroup: true, parent: this, panel: true });
	        this._groups.push(group);
	        return group;
	    };
	
	    Menubar.prototype.addButton = function addButton() {
	        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	        var iconclass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	        var item = new Menuitem({ container: this._ulNode, text: text, iconclass: iconclass, type: BUTTON_TYPE });
	        this._items.push(item);
	        return item;
	    };
	
	    Menubar.prototype.addLink = function addLink() {
	        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	        var iconclass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	        var item = new Menuitem({ container: this._ulNode, text: text, iconclass: iconclass, type: TEXT_TYPE });
	        this._items.push(item);
	        return item;
	    };
	
	    Menubar.prototype.floatLeft = function floatLeft() {
	        this._ulNode.className = 'float-left';
	        return this;
	    };
	
	    Menubar.prototype.floatRight = function floatRight() {
	        this._ulNode.className = 'float-right';
	        return this;
	    };
	
	    Menubar.prototype.floatCenter = function floatCenter() {
	        this._ulNode.className = 'float-center';
	        return this;
	    };
	
	    return Menubar;
	}();
	
	exports.default = Menubar;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=rfexplore.js.map