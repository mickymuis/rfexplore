import Automaton from "./automaton.js";
import Viewport from "./viewport.js";
import Menubar from "./menubar.js";
import equals from "./value_equals.js";

class UIController {
    constructor( viewport ) {
        this.viewport =viewport;
        this.autoUpdate =true;
        this._viewmode ='circle';
        this._folded =false;
        this._palette = [ '#ff5511', '#33ffcc', '#ffaa33', '#5E69FF' ]; 
        this._automaton =null;
        this._oldopts = null;
        this._opts = { // Options to Automaton constructor
            mode: 2,
            base: 2,
            folds: 0,
            rule: 6,
            input: [ 0, 1, 1, 0, 0, 1, 0 ]
        }; 
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
        }
        else console.log( 'not changed' );

        let viewmode = this._folded ? 'folded' : this._viewmode;
        if( viewmode != this.viewport.viewmode ) {
            this.viewport.viewmode = viewmode;
            change =true;
        }
        
        if( !equals( this._palette, this.viewport.palette ) ) {
            this.viewport.palette =this._palette;
            change =true;
        }

        if( change )
            this.viewport.update();

        // Caching
        this._oldopts =JSON.parse( JSON.stringify( this._opts ) );
    }

    step() {
        if( this._automaton === null )
            render();

        this._automaton.step();
        this.viewport.update();
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
    set mode(i)         { this._opts.mode =i; this.update(); }
    get base()          { return this._opts.base; }
    set base(i)         { this._opts.base =i; this.update(); }
    get folded()        { return this._folded; }
    set folded(b)       { this._folded =b; this.update(); }
    get folds()         { return this._opts.folds; }
    set folds(i)        { this._opts.folds =i; this.update(); }
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
        step_ctrls.addButton( '', 'fa fa-step-backward' );
        step_ctrls.addButton( '', 'fa fa-step-forward' ).action( ()=>{ this.controller.step(); } );
        step_ctrls.addLink( 'Hello' );
        step_ctrls.addButton( '', 'fa fa-backward' );
        step_ctrls.addButton( '', 'fa fa-forward' );

        let r_ctrls = this.menubar.addGroup().floatRight();
        r_ctrls.addButton( '', 'fa fa-arrows-alt' );
        r_ctrls.addButton( 'Render', 'fa fa-camera-retro' );
        r_ctrls.addLink( '', 'fa fa-circle-o' );

    }
    setupToolbox() {
        this.toolbox = new dat.GUI();

        // Automaton toolbox
        let f_a = this.toolbox.addFolder( 'Automaton' );
        f_a.add( this.controller, 'mode', 2, 2 ).step(1).name( 'Mode' );
        f_a.add( this.controller, 'base', 2, 4 ).step(1).name( 'Base' );
        f_a.add( this.controller, 'folds').name( '#Folds' );
        f_a.open();

        // Visualisation toolbox
        let f_v = this.toolbox.addFolder( 'Visualisation' );
        f_v.add( this.controller, 'viewmode', { Brick : 'brick', Diamond: 'diamond', Circle: 'circle' } ).name( 'Cell shape' );
        f_v.add( this.controller, 'folded' ).name( 'Folded' );
        f_v.open();

        // Colors toolbox
        let f_c = this.toolbox.addFolder( 'Colors' );
        f_c.addColor( this.controller, 'color0' ).name( '0' ).onFinishChange( () => { this.controller.update(); } ) ;
        f_c.addColor( this.controller, 'color1' ).name( '1' );
        f_c.addColor( this.controller, 'color2' ).name( '2' );
        f_c.addColor( this.controller, 'color3' ).name( '3' );
        f_c.open();

        // Render toolbox
        let f_r = this.toolbox.addFolder( 'Render' );
        f_r.add( this.controller, 'autoUpdate' ).name( 'Auto-update' );
        f_r.add( this.controller, 'render' ).name( 'Render' );
    }
}

export default {
    App : App
};


