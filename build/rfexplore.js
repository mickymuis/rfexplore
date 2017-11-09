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
	
	var _menubar = __webpack_require__(4);
	
	var _menubar2 = _interopRequireDefault(_menubar);
	
	var _value_equals = __webpack_require__(5);
	
	var _value_equals2 = _interopRequireDefault(_value_equals);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UIController = function () {
	    function UIController(viewport) {
	        _classCallCheck(this, UIController);
	
	        this.viewport = viewport;
	        this.autoUpdate = true;
	        this._viewmode = 'circle';
	        this._folded = false;
	        this._palette = ['#ff5511', '#33ffcc', '#ffaa33', '#5E69FF'];
	        this._automaton = null;
	        this._oldopts = null;
	        this._opts = { // Options to Automaton constructor
	            mode: 2,
	            base: 2,
	            folds: 0,
	            rule: 6,
	            input: [0, 1, 1, 0, 0, 1, 0]
	        };
	    }
	
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
	
	        var viewmode = this._folded ? 'folded' : this._viewmode;
	        if (viewmode != this.viewport.viewmode) {
	            this.viewport.viewmode = viewmode;
	            change = true;
	        }
	
	        if (!(0, _value_equals2.default)(this._palette, this.viewport.palette)) {
	            this.viewport.palette = this._palette;
	            change = true;
	        }
	
	        if (change) this.viewport.update();
	
	        // Caching
	        this._oldopts = JSON.parse(JSON.stringify(this._opts));
	    };
	
	    UIController.prototype.step = function step() {
	        if (this._automaton === null) render();
	
	        this._automaton.step();
	        this.viewport.update();
	    };
	
	    // Properties
	
	
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
	            this._opts.mode = i;this.update();
	        }
	    }, {
	        key: "base",
	        get: function get() {
	            return this._opts.base;
	        },
	        set: function set(i) {
	            this._opts.base = i;this.update();
	        }
	    }, {
	        key: "folded",
	        get: function get() {
	            return this._folded;
	        },
	        set: function set(b) {
	            this._folded = b;this.update();
	        }
	    }, {
	        key: "folds",
	        get: function get() {
	            return this._opts.folds;
	        },
	        set: function set(i) {
	            this._opts.folds = i;this.update();
	        }
	    }]);
	
	    return UIController;
	}();
	
	var App = function () {
	    function App(_ref) {
	        var _ref$container_id = _ref.container_id,
	            container_id = _ref$container_id === undefined ? '' : _ref$container_id;
	
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
	        var _this = this;
	
	        // Make a menubar 
	        this.menubar = new _menubar2.default(this.container);
	
	        var a_ctrls = this.menubar.addGroup().floatLeft();
	        a_ctrls.addLink('RFExplore');
	
	        var step_ctrls = this.menubar.addGroup().floatCenter();
	        step_ctrls.addButton('', 'fa fa-step-backward');
	        step_ctrls.addButton('', 'fa fa-step-forward').action(function () {
	            _this.controller.step();
	        });
	        step_ctrls.addLink('Hello');
	        step_ctrls.addButton('', 'fa fa-backward');
	        step_ctrls.addButton('', 'fa fa-forward');
	
	        var r_ctrls = this.menubar.addGroup().floatRight();
	        r_ctrls.addButton('', 'fa fa-arrows-alt');
	        r_ctrls.addButton('Render', 'fa fa-camera-retro');
	        r_ctrls.addLink('', 'fa fa-circle-o');
	    };
	
	    App.prototype.setupToolbox = function setupToolbox() {
	        var _this2 = this;
	
	        this.toolbox = new dat.GUI();
	
	        // Automaton toolbox
	        var f_a = this.toolbox.addFolder('Automaton');
	        f_a.add(this.controller, 'mode', 2, 2).step(1).name('Mode');
	        f_a.add(this.controller, 'base', 2, 4).step(1).name('Base');
	        f_a.add(this.controller, 'folds').name('#Folds');
	        f_a.open();
	
	        // Visualisation toolbox
	        var f_v = this.toolbox.addFolder('Visualisation');
	        f_v.add(this.controller, 'viewmode', { Brick: 'brick', Diamond: 'diamond', Circle: 'circle' }).name('Cell shape');
	        f_v.add(this.controller, 'folded').name('Folded');
	        f_v.open();
	
	        // Colors toolbox
	        var f_c = this.toolbox.addFolder('Colors');
	        f_c.addColor(this.controller, 'color0').name('0').onFinishChange(function () {
	            _this2.controller.update();
	        });
	        f_c.addColor(this.controller, 'color1').name('1');
	        f_c.addColor(this.controller, 'color2').name('2');
	        f_c.addColor(this.controller, 'color3').name('3');
	        f_c.open();
	
	        // Render toolbox
	        var f_r = this.toolbox.addFolder('Render');
	        f_r.add(this.controller, 'autoUpdate').name('Auto-update');
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
	        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],
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
	
	    /*
	     * Generate a transition table given a base, mode and rule number
	     * Returns an array
	     */
	
	
	    Automaton.prototype.makeTTable = function makeTTable(base, mode, rule) {
	        var tt = new Array();
	        var rulesize = Math.pow(base, mode);
	        var maxrules = Math.pow(base, rulesize);
	
	        console.log("Transition table for rule #" + rule + " / " + maxrules + " * " + rulesize);
	        if (rulesize > maxrules) {
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
	            console.log("fold");
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
	
	        while (this._folds < this.opts.folds) {
	            this.step();
	        }if (typeof done === 'function') done(this);
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
	
	var _value_equals = __webpack_require__(5);
	
	var _value_equals2 = _interopRequireDefault(_value_equals);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var diamondWidth = 1 * Math.sqrt(2);
	
	var Viewport = function () {
	    function Viewport(elem) {
	        _classCallCheck(this, Viewport);
	
	        this.container = elem;
	        this.disabledColor = '#aaaaaa';
	        this.backgroundColor = '#bbbbbb';
	
	        this.automaton = null;
	        // fixme: remove
	        this.palette = ['#ff5511', '#33eeff', '#ff33dd'];
	
	        this.viewportWidth = this.container.offsetWidth;
	        this.viewportHeight = this.container.offsetHeight;
	
	        this._viewmode = 'folded'; // one of 'brick', 'diamond', 'circle', 'folded'
	        this._scene = null;
	        this._aspect = 1.0;
	        this._cameraPersp = null;
	        this._cameraOrtho = null;
	        this._controls = null;
	        this._sceneHeight = 10;
	        this._renderer = null;
	        this._lights = new Array();
	        this._model = {
	            geometry: null,
	            attr_normal: null,
	            buf_normal: null,
	            attr_color: null,
	            buf_color: null,
	            attr_position: null,
	            buf_position: null,
	            offset: 0,
	            template_size: 0,
	            node_count: 0,
	            mesh: null,
	            viewmode: null,
	            mode: 0,
	            input_nodes: null
	        };
	        this._animation = {
	            animateGeometry: true,
	            mode: 'rows', //  one of 'rows', 'ordered'
	            done: false,
	            node: { col: 0, row: 0 },
	            row: 0
	        };
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
	
	        if (this._animation.done) return;
	        requestAnimationFrame(function () {
	            _this.animate();
	        });
	        this._controls.update();
	        this._updateCellsAnimated();
	        this.render();
	    };
	
	    Viewport.prototype.init = function init() {
	        var _this2 = this;
	
	        console.log('Initializing WebGL');
	
	        this._scene = new THREE.Scene();
	        this._scene.background = new THREE.Color(this.backgroundColor);
	        this._aspect = this.viewportWidth / this.viewportHeight;
	        this._cameraPersp = new THREE.PerspectiveCamera(75, this._aspect, 0.1, 1000);
	        this._cameraOrtho = new THREE.OrthographicCamera(this._aspect * this._sceneHeight / -2, this._aspect * this._sceneHeight / 2, -this._sceneHeight / 2, this._sceneHeight / 2);
	
	        this._renderer = new THREE.WebGLRenderer({ antialias: true });
	        this._renderer.setSize(this.viewportWidth, this.viewportHeight);
	        this.container.appendChild(this._renderer.domElement);
	        window.addEventListener('resize', function () {
	            _this2.resized();
	        });
	
	        /*let geometry = new THREE.BoxGeometry( 1, 1, 1 );
	        let material = new THREE.MeshNormalMaterial();
	        let cube = new THREE.Mesh( geometry, material );
	        this._scene.add( cube );*/
	        this._cameraOrtho.position.z = 10;
	        this._cameraPersp.position.z = 10;
	
	        // Setup orbit controls
	        this._controls = new THREE.OrbitControls(this._cameraPersp, this._renderer.domElement);
	        this._controls.addEventListener('change', function () {
	            _this2.render();
	        });
	        //controls.enableRotate = false;
	
	        // Setup lights for the 3d view
	        var lights = this._lights;
	        lights[0] = new THREE.AmbientLight(0x13162B, 4);
	        lights[0].position.set(0, 0, 0);
	        lights[0].target = new THREE.Vector3(0, 0, 0);
	        this._scene.add(lights[0]);
	
	        lights[1] = new THREE.DirectionalLight(0xEDE2C7);
	        lights[1].position.set(10, 10, 10);
	        //lights[1].target = new THREE.Vector3( 0, 0, 0 );
	        this._scene.add(lights[1]);
	
	        lights[2] = new THREE.DirectionalLight(0xC7E8ED);
	        lights[2].position.set(0, -10, -10);
	        //lights[2].target = new THREE.Vector3( 0, 0, 0 );
	        this._scene.add(lights[2]);
	
	        lights[3] = new THREE.DirectionalLight(0xC8D9C8);
	        lights[3].position.set(-10, 10, 0);
	        // lights[3].target = new THREE.Vector3( 0, 0, 0 );
	        this._scene.add(lights[3]);
	
	        //     this._scene.add( new THREE.DirectionalLightHelper( lights[0], 0.2 ));
	        //     this._scene.add( new THREE.DirectionalLightHelper( lights[1], 0.2 ));
	        //     this._scene.add( new THREE.DirectionalLightHelper( lights[2], 0.2 ));
	        this.render();
	    };
	
	    Viewport.prototype.updateCamera = function updateCamera() {
	        var sceneHeight = this._sceneHeight;
	        var aspect = this._aspect;
	        this._cameraPersp.aspect = aspect;
	        this._cameraPersp.updateProjectionMatrix();
	        this._cameraOrtho.left = aspect * sceneHeight / -2;
	        this._cameraOrtho.right = aspect * sceneHeight / 2;
	        this._cameraOrtho.top = sceneHeight / 2;
	        this._cameraOrtho.bottom = sceneHeight / -2;
	        this._cameraOrtho.updateProjectionMatrix();
	    };
	
	    Viewport.prototype.resized = function resized() {
	        var container = this.container;
	
	        this.viewportWidth = container.offsetWidth;
	        this.viewportHeight = container.offsetHeight;
	        this._aspect = this.viewportWidth / this.viewportHeight;
	        this.updateCamera();
	        this._renderer.setSize(this.viewportWidth, this.viewportHeight);
	        this.render();
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
	        var automaton = this.automaton;
	        if (automaton === null) return;
	        // See if we need to update the geometry at all, criteria are:
	        // - Different viewmode
	        // - More cells 
	        // - Different mode
	        if (this._viewmode !== this._model.viewmode || this.automaton.opts.mode !== this._model.mode || this.automaton.nodeCount != this._model.node_count) {
	            console.log('Viewport: rebuilding geometry');
	            var populate = !this._animation.animateGeometry;
	            this._updateGeometry(populate);
	        } else {
	            if (!this._animation.animateGeometry) this._updateCells();
	        }
	        if (this._animation.animateGeometry) {
	            this._updateCells(true);
	            this._animation.node = automaton.first();this._animation.row = 0;
	            this._animation.done = false;
	            this.animate();
	        }
	        this.render();
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
	
	        if (this._animation.mode === 'ordered') {
	            var node = this._animation.node;
	            var color = this._nodeColor(node);
	            var offset = this._calcNodeOffset(node);
	
	            this._setColor(offset, color);
	            if ((0, _value_equals2.default)(node, automaton.last())) this._animation.done = true;else this._animation.node = automaton.next(node);
	        } else if (this._animation.mode === 'rows') {
	            var row = this._animation.row;
	            for (var j = 0; j < automaton.rowLength(row); j++) {
	                var _node = { col: j, row: row };
	                var _color = this._nodeColor(_node);
	                var _offset = this._calcNodeOffset(_node);
	                this._setColor(_offset, _color);
	            }
	            if (row + 1 === automaton.rows) this._animation.done = true;else this._animation.row++;
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
	        var right = !automaton.opts.foldToRight; // Position of the pivot
	
	        // Cleanup from previous calls
	        //
	
	        var M = this._model;
	        if (M.geometry !== null) {
	            this._scene.remove(M.mesh);
	            /* M.attr_position.setArray(null);
	             M.attr_normal.setArray(null);
	             M.attr_color.setArray(null);*/
	            M.geometry.dispose();
	        }
	
	        // For some viewmode we use a template geometry
	        // Here we prepare this geometry and the material
	
	        var template = null;
	        var material = null;
	
	        M.template_size = 0;
	        if (viewmode !== 'folded') {
	            material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
	            if (viewmode === 'brick') {
	                template = new THREE.PlaneBufferGeometry(1, 1);
	            } else if (viewmode === 'diamond') {
	                template = new THREE.PlaneBufferGeometry(1, 1);
	                template.rotateZ(Math.PI * 0.25);
	                template.scale(1 / diamondWidth, 1, 1);
	            } else if (viewmode === 'circle') {
	                template = new THREE.CircleBufferGeometry(0.5, 32);
	            }
	
	            template = template.toNonIndexed();
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
	
	        var addInstance = function addInstance(color, translate) {
	            var positions = template.getAttribute('position').array;
	            var normals = template.getAttribute('normal').array;
	            for (var i = 0; i < M.template_size; i += 3) {
	                M.buf_position[M.offset + i] = positions[i] + translate.x;
	                M.buf_position[M.offset + i + 1] = positions[i + 1] + translate.y;
	                M.buf_position[M.offset + i + 2] = positions[i + 2] + translate.z;
	
	                M.buf_color[M.offset + i] = color.r * 255;
	                M.buf_color[M.offset + i + 1] = color.g * 255;
	                M.buf_color[M.offset + i + 2] = color.b * 255;
	
	                M.buf_normal[M.offset + i] = normals[i] * 32767;
	                M.buf_normal[M.offset + i + 1] = normals[i + 1] * 32767;
	                M.buf_normal[M.offset + i + 2] = normals[i + 2] * 32767;
	            }
	            M.offset += positions.length;
	        };
	
	        var foldedPosition = function foldedPosition(row, col, width, inputLength, right, mode) {
	            var p = new THREE.Vector3(0, 0, 0);
	            // The pivot position determines where the rows start
	            var coneCol = right ? width - 1 - col : col;
	            // Map the `triangle row' onto the `diagonal row'
	            var coneRow = row + coneCol;
	            var fold = !(coneRow < inputLength);
	            var coneRowWidth = coneRow + (fold ? 0 : 1);
	
	            // Calculate the position of the node on the `cone'
	            var offset = 0; //(coneRow%2 === 0) ? 0.125 : -0.125;
	            var phi = (coneCol + offset) * (2 * Math.PI / coneRowWidth);
	            var radius = coneRowWidth / Math.PI;
	
	            p.x = Math.cos(phi) * radius;
	            p.z = Math.sin(phi) * radius;
	
	            var yoffset = 2 * coneCol / coneRowWidth;
	            p.y = -coneRow * 2 + (fold ? yoffset : 0);
	
	            return p;
	        };
	
	        var heightstep = 1.0;
	        if (automaton.opts.mode % 2 === 0) {
	            if (viewmode === 'diamond') heightstep = 1 / diamondWidth;else if (viewmode === 'circle') heightstep = 0.5 + Math.sqrt(0.125);
	        }
	
	        var position = new THREE.Vector3(0, (automaton.rows - 1) * heightstep / 2, 0);
	        for (var i = 0; i < automaton.rows; i++) {
	            for (var j = 0; j < automaton.rowLength(i); j++) {
	                position.x = -automaton.width / 2 + 0.5 * i + j;
	
	                var color = populate ? this._nodeColor({ row: i, col: i }) : new THREE.Color(this.backgroundColor);
	
	                if (viewmode !== 'folded') {
	                    addInstance(color, position);
	                } else {
	                    var p = foldedPosition(i, j, automaton.rowLength(i), automaton.opts.input.length, right, automaton.opts.mode);
	                    addInstance(color, p);
	                }
	            }
	            position.y -= heightstep;
	        }
	        M.attr_position = new THREE.BufferAttribute(M.buf_position, 3);
	        M.attr_normal = new THREE.BufferAttribute(M.buf_normal, 3);
	        M.attr_color = new THREE.BufferAttribute(M.buf_color, 3);
	        M.attr_color.normalized = true;
	        M.attr_normal.normalized = true;
	        M.geometry.addAttribute('position', M.attr_position);
	        M.geometry.addAttribute('normal', M.attr_normal);
	        M.geometry.addAttribute('color', M.attr_color);
	        M.geometry.computeBoundingSphere();
	
	        M.mesh = new THREE.Mesh(M.geometry, material);
	        this._scene.add(M.mesh);
	
	        M.viewmode = viewmode;
	        M.mode = automaton.opts.mode;
	
	        this._sceneHeight = automaton.width * 1.1;
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

/***/ },
/* 5 */
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=rfexplore.js.map