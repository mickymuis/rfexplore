import Automaton from "./automaton.js";
import Viewport from "./viewport.js";
import Menubar from "./menubar.js";
import equals from "./value_equals.js";
import Texteditor from "./texteditor.js";
import TTable2 from "./ttable.js";

class UIController {
    constructor( viewport ) {
        this.viewport =viewport;
        this.autoUpdate =true;
        this.cluster = /*'ttable2' */'none';
        this._viewmode ='circle';
        this._palette = [ '#ff5511', '#33ffcc', '#ffaa33', '#5E69FF' ]; 
        this._automaton =null;
        this._oldopts = null;
        this._opts = { // Options to Automaton constructor
            mode: 2,
            base: 2,
            folds: 20,
            rule: 6,
            input: [ 1, 1, 0, 0, 0, 0, 0, 0 ],
            foldToRight: false
        }; 
        this._listeners = {
            maxrules: new Array(),
            rule: new Array(),
            folds: new Array()
        };

        viewport.setOnInputClicked( (i)=>{this.incrementInput(i);} );
    }

    on( event, func ) {
        if( typeof func === 'function' 
            && typeof this._listeners[event] !== 'undefined' ) {
            this._listeners[event].push( func );
        }
    }

    update() {
        if( this.autoUpdate )
            this.render();
    }
    render() {

        let change =false;

        if( !equals( this._oldopts, this._opts ) || this._automaton === null ) {
            this._automaton = new Automaton( this._opts );
            this._automaton.generate();
            this.viewport.automaton = this._automaton;
            change =true;

            // Testing
            let tt2 = new TTable2( this._opts.base, this._opts.mode, this._opts.rule );
            console.log( tt2.computeFeature() );
        }
        else console.log( 'not changed' );

        if( this._viewmode != this.viewport.viewmode ) {
            this.viewport.viewmode = this._viewmode;
            change =true;
        }
        
        if( !equals( this._palette, this.viewport.palette ) ) {
            this.viewport.palette =this._palette;
            change =true;
        }

        if( change ) {
            this.viewport.update();
        }

        // Caching
        this._oldopts =JSON.parse( JSON.stringify( this._opts ) );
    }

    nextRule() {
        if( this.cluster === 'ttable2' ) {
            let tt2 =new TTable2( this._opts.base, this._opts.mode, this._opts.rule );
            this.rule =tt2.findNextNN( false, 1 );
        } else
            this.rule++;
    }

    previousRule() {
        if( this.cluster === 'ttable2' ) {
            let tt2 =new TTable2( this._opts.base, this._opts.mode, this._opts.rule );
            this.rule =tt2.findNextNN( true, 1 );
        } else
            this.rule--;
    }

    step() {
        if( this._automaton === null )
            render();

        this._automaton.step();
        this.viewport.update();
    }

    incrementInput( col ) {
        let automaton = this._automaton;
        if( col >= automaton.width )
            return;
        // If the automaton is left-folding, the input is on the right hand side
        let i = this._opts.foldToRight ? col : col - (automaton.width - automaton.inputSize)
        let input = this._opts.input;

        // We may need to expand the input array using values from the automaton
        let delta =0;
        if( i >= input.length ) {
            for( let j = input.length; j <= i; j++ ) {
                input[j] = automaton.value( { col: j, row: 0 } );
                delta++;
            }
        } else if( i < 0 ) {
            for( let j = automaton.width - automaton.inputSize - 1; j >= col; j-- ) {
                input.unshift( automaton.value( { col: j, row: 0 } ) );
                delta++;
            }
            i =0;
        }
        this._opts.folds -= this._opts.folds === 0 ? 0 : delta;
        input[i] = (input[i] === (this._opts.base - 1)) ? 0 : input[i]+1;
//        console.log( 'picked input ' + i + " new array" + input );
        this.render();
    }

    // Properties
    get color0()        { return this._palette[0]; }
    set color0(c)       { this._palette[0] =c; this.update(); }
    get color1()        { return this._palette[1]; }
    set color1(c)       { this._palette[1] =c; this.update(); }
    get color2()        { return this._palette[2]; }
    set color2(c)       { this._palette[2] =c; this.update(); }
    get color3()        { return this._palette[3]; }
    set color3(c)       { this._palette[3] =c; this.update(); }

    get viewmode()      { return this._viewmode; }
    set viewmode(m)     { this._viewmode =m;  this.update(); }
    get mode()          { return this._opts.mode; }
    set mode(i)         { 
        this._opts.mode =i; 
        this._emit( 'maxrules', Automaton.maxRules( this._opts.base, i ) ); 
        this.update(); 
    }
    get base()          { return this._opts.base; }
    set base(i)         { 
        if( this._opts.base > i )
            this.rule =0;
        this._opts.base =i;
        this._emit( 'maxrules', Automaton.maxRules( i, this._opts.mode ) ); 
        this.update(); 
    }
    get folds()         { return this._opts.folds; }
    set folds(i)        { this._opts.folds =i; this._emit( 'folds', i ); this.update(); }
    get foldToRight()   { return this._opts.foldToRight; }
    set foldToRight(b)  { this._opts.foldToRight =(b == 'true' || b == true); this.update(); }
    get rule()          { return this._opts.rule; }
    set rule(i)         { 
        if( i >= 0 && i < this._automaton.maxRules ) { 
            this._opts.rule =i; 
            this._emit( 'rule', i );
            this.update(); 
        } 
    }

    get inputSize()     { return this._opts.input.length; }
    set inputSize(i)    { }

    editJSON() {
        let editor = new Texteditor();
        editor.create();
        editor.text = JSON.stringify( this._opts );
        editor.onDone = (json)=>{ this._opts = JSON.parse( json ); this.update(); };
    }

    _emit( event, data ) {
        let listeners = this._listeners[event];
        if( typeof listeners === 'undefined' )
            return;
        for( const func of listeners )
            func( data );
    }
}

class App {
    constructor( { container_id = '' } ) {
        console.log( 'hallo ik ben een poes, dag vrienden' );

        // Create a viewport container inside the given element id
        this.container =document.getElementById( container_id );
        if( typeof this.container == 'undefined' )
            this.container =document.body;

        let viewport = document.createElement( 'div' )
            viewport.className = 'viewport';
        this.container.appendChild( viewport );

        // Let's set-up the viewport
        this.viewport = new Viewport( viewport );
        this.viewport.init();

        // Create the controller for the user controls
        this.controller = new UIController( this.viewport );

        // Set-up UI
        this.toolbox =null;
        this.setupToolbox();
        this.menubar =null;
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
    setupMenubar() {
        // Make a menubar 
        this.menubar = new Menubar( this.container );
        
        let a_ctrls = this.menubar.addGroup().floatLeft(); 
        a_ctrls.addLink( 'RFExplore' );

        let step_ctrls = this.menubar.addGroup().floatCenter();
        let rule_label =null;
        step_ctrls.addButton( '', 'fa fa-backward' ).action( ()=> { this.controller.previousRule(); } );
        rule_label = step_ctrls.addLink( 'Rule #' + this.controller.rule );
        this.controller.on( 'rule', (r)=> { rule_label.text = 'Rule #' + r; } );
        step_ctrls.addButton( '', 'fa fa-forward' ).action( ()=> { this.controller.nextRule(); } );

        let r_ctrls = this.menubar.addGroup().floatRight();
        r_ctrls.addButton( '', 'fa fa-arrows-alt' ).action( ()=>{ screenfull.toggle(); } );
        r_ctrls.addButton( '', 'fa fa-step-forward' ).action( ()=>{ this.controller.step(); } );
        r_ctrls.addButton( 'Render', 'fa fa-camera-retro' ).action( ()=>{ this.controller.render(); } );
        r_ctrls.addLink( '', 'fa fa-circle-o' );

    }
    setupToolbox() {
        this.toolbox = new dat.GUI();

        // Automaton toolbox
        let f_a = this.toolbox.addFolder( 'Automaton' );
        f_a.add( this.controller, 'mode', 2, 2 ).step(1).name( 'Mode' );
        f_a.add( this.controller, 'base', 2, 4 ).step(1).name( 'Base' );
        let rule_ctrl = f_a.add( this.controller, 'rule', 0, 15 ).name( 'Rule' ).step(1);
        this.controller.on( 'maxrules', (i)=>{ rule_ctrl.max(i); rule_ctrl.updateDisplay() } );
        this.controller.on( 'rule' , (i)=>{ rule_ctrl.updateDisplay(); } );
        f_a.add( this.controller, 'folds', 0, 500 ).name( '#Folds' ).step(1).listen();
        f_a.add( this.controller, 'foldToRight', { Left: false, Right: true } ).name( 'Fold' );
        f_a.add( this.controller, 'inputSize').name( 'Input size' ).step(1).listen();
        f_a.add( this.controller, 'editJSON').name( 'Edit/Import/Export' );
        f_a.open();

        // Visualisation toolbox
        let f_v = this.toolbox.addFolder( 'Visualisation' );
        f_v.add( this.controller, 'viewmode', { Brick : 'brick', Diamond: 'diamond', Circle: 'circle', Stack: 'stack', Folded: 'folded' } ).name( 'Cell shape' );
        f_v.open();
        
        let f_cl = this.toolbox.addFolder( 'Clustering' );
        f_cl.add( this.controller, 'cluster', { None : 'none', TTable2: 'ttable2' } ).name( 'Mode' );

        // Colors toolbox
        let f_c = this.toolbox.addFolder( 'Colors' );
        f_c.addColor( this.controller, 'color0' ).name( '0' ).onFinishChange( () => { this.controller.update(); } ) ;
        f_c.addColor( this.controller, 'color1' ).name( '1' );
        f_c.addColor( this.controller, 'color2' ).name( '2' );
        f_c.addColor( this.controller, 'color3' ).name( '3' );
        f_c.addColor( this.viewport, 'backgroundColor' ).name( 'Background' );
        //f_c.open();

        // Render toolbox
        let f_r = this.toolbox.addFolder( 'Render' );
        f_r.add( this.controller, 'autoUpdate' ).name( 'Auto-update' );
        f_r.add( this.viewport, 'animateSpin' ).name( 'Spin' );
        f_r.add( this.viewport, 'animateDraw' ).name( 'Animate draw' );
        f_r.add( this.viewport, 'animateDrawType', { Rows: 'rows', Ordered: 'ordered' } ).name( 'Draw type' );
        f_r.add( this.controller, 'render' ).name( 'Render' );
    }
}

export default {
    App : App
};


