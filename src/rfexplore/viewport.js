
"use strict";
import equals from "./value_equals.js";

const diamondWidth = 1 * Math.sqrt( 2 );

export default class Viewport {
    constructor( elem ) {

        this.container =elem;
        
        this.automaton = null;
        // fixme: remove
        this.palette = [ '#ff5511', '#33eeff', '#ff33dd', '#386ebb' ];

        this.viewportWidth = this.container.offsetWidth;
        this.viewportHeight = this.container.offsetHeight;

        this._viewmode = 'folded'; // one of 'brick', 'diamond', 'circle', 'folded'
        this._backgroundColor = '#666666'
        this._scene = null;
        this._aspect =1.0;
        this._cameraPersp = null;
        this._cameraOrtho = null;
        this._controls = null;
        this._sceneHeight = 10;
        this._renderer = null;
        this._lights = new Array();
        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();
        this._model = { 
            geometry: null,     // BufferGeometry reference
            attr_normal: null,  // BufferAttribute for normal
            buf_normal: null,   // Int16Array with normals
            attr_color: null,   // BufferAttribute for color
            buf_color: null,    // Uint8Array with color data
            attr_position: null,// BufferAttribute for position
            buf_position: null, // Float32Array with position data
            offset: 0,          // Pointer after the last element
            template_size: 0,   // Elements in the template geometry
            node_count: 0,      // Total number of nodes in the geometry
            mesh: null,         // Mesh reference to the final object
            viewmode: null,     // Viewmode used to construct geometry
            mode: 0,            // Mode used to contruct geometry
            input_pickers: null,// Array of Meshes 
            picked: null,       // Reference to the picked Mesh
            right: false        // Pivot is at right hand side
        };
        this._animation = {
            alwaysClearGeometry: false,
            spin: true,
            animateDraw: true,
            drawType: 'rows', //  one of 'rows', 'ordered'
            drawDone: false,
            node: { col:0, row: 0 },
            row: 0
        };
        this._inputClickCallback = null;
    }

    render() {
        if( this._viewmode === 'folded' ) {
            this._renderer.render( this._scene, this._cameraPersp );
        } else {
            this._renderer.render( this._scene, this._cameraOrtho );
        }

    }

    animate() { 
        let req =false; // request new frame

        if( !this._animation.drawDone ) {
            this._updateCellsAnimated();
            req =true;
        }
        if( this._animation.spin && this._viewmode === 'folded' ) {
            this._model.mesh.rotateY( 0.002 );
            req =true;
        }

        this._controls.update();
        this.render();
        
        if( req ) 
            requestAnimationFrame( ()=>{this.animate()} );
    }

    init() {
        console.log( 'Initializing WebGL' );
  
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color( this.backgroundColor );
        this._aspect = this.viewportWidth / this.viewportHeight;
        this._cameraPersp = new THREE.PerspectiveCamera( 35, this._aspect, 0.1, 3000 );
        this._cameraOrtho = new THREE.OrthographicCamera( 
                this._aspect * this._sceneHeight / -2, 
                this._aspect * this._sceneHeight / 2, 
                -this._sceneHeight / 2, this._sceneHeight / 2 );
        
        this._renderer = new THREE.WebGLRenderer( {antialias:true} );
        this._renderer.setSize( this.viewportWidth, this.viewportHeight );
        this.container.appendChild( this._renderer.domElement );

        this._cameraOrtho.position.z = 10;
        this._cameraPersp.position.z = 10;

        // Setup orbit controls
        this._controls = new THREE.OrbitControls( this._cameraPersp, this._renderer.domElement );
        this._controls.addEventListener( 'change', () => { this.render(); } );

        // Setup lights for the 3d view
        let lights = this._lights;
        lights[0] = new THREE.AmbientLight( 0x151515, 3 );
        lights[0].position.set( 0, 0, 0 );
        lights[0].target = new THREE.Vector3( 0, 0, 0 );
        this._scene.add( lights[0] );
        
        lights[1] = new THREE.DirectionalLight( 0xEDE2A7 );
        lights[1].position.set( 10, 10, 10 );
        this._scene.add( lights[1] );
        
        lights[2] = new THREE.DirectionalLight( 0xC7E8AD );
        lights[2].position.set( 0, -10, -10 );
        this._scene.add( lights[2] );
        
        lights[3] = new THREE.DirectionalLight( 0xC8D9A8 );
        lights[3].position.set( -10, 10, 0 );
        this._scene.add( lights[3] );
        
        this.render();

        window.addEventListener( 'resize', () => { this._onWindowResize(); } );
        document.addEventListener( 'mousemove', (e) => { this._onDocumentMousemove(e); } );
        this.container.addEventListener( 'click', () => { this._onClick(); } );

    }

    updateCamera() {
        let sceneHeight = this._sceneHeight;
        let aspect = this._aspect;
        this._cameraPersp.aspect = aspect;
        this._cameraPersp.position.z = 1.2
            * (sceneHeight / 2 ) 
            / Math.tan( this._cameraPersp.fov / 360 * Math.PI );
        this._cameraPersp.updateProjectionMatrix();
        this._cameraOrtho.left = aspect * sceneHeight / -2;
        this._cameraOrtho.right = aspect * sceneHeight / 2;
        this._cameraOrtho.top = sceneHeight / 2;
        this._cameraOrtho.bottom = sceneHeight / -2;
        this._cameraOrtho.updateProjectionMatrix();

    }

    set viewmode( m ) {
        let viewmode = this._viewmode;
        let controls = this._controls;

        if( viewmode === 'folded' && m !== 'folded' ) {
            controls.reset();
            controls.object = this._cameraOrtho;
            controls.enableRotate =false;
        } else if ( viewmode !== 'folded' && m === 'folded' ) {
            controls.reset();
            controls.object = this._cameraPersp;
            controls.enableRotate = true;
        }
        this._viewmode =m;
        //this.updateGeometry();

    }

    set animateDrawType( t ) { this._animation.drawType = t;  }
    get animateDrawType() { return this._animation.drawType; }

    set animateSpin( b ) { this._animation.spin = b; if( b ) this.animate(); }
    get animateSpin() { return this._animation.spin; }

    set animateDraw( b ) { this._animation.animateDraw =b; }
    get animateDraw() { return this._animation.animateDraw; }

    set alwaysClearGeometry( b ) { this._animation.alwaysClearGeometry =b; }
    get alwaysClearGeometry() { return this._animation.alwaysClearGeometry; }
    
    set backgroundColor( str ) {
        this._backgroundColor = str;
        this._scene.background = new THREE.Color( this.backgroundColor );
        this.render();
    }
    get backgroundColor() { return this._backgroundColor; }

    setOnInputClicked( func ) {
        this._inputClickCallback = func;
    }

    clearGeometry() {
        let scene =this._scene;
        for(let i = 0; i < scene.children.length; i++){
            if( scene.children[i].name !== 'helper' &&
                    !(scene.children[i] instanceof THREE.AmbientLight) &&
                    !(scene.children[i] instanceof THREE.DirectionalLight) ) {
                scene.remove(scene.children[i]);
                i--;
            }
        }
    }

    update() {
        if( this.automaton === null )
            return;
        // See if we need to update the geometry at all, criteria are:
        // - Different viewmode
        // - More cells 
        // - Different mode
        // - Pivot position
        if( this._viewmode !== this._model.viewmode 
            || this.automaton.opts.mode !== this._model.mode
            || this.automaton.nodeCount !== this._model.node_count 
            || (!this.automaton.opts.foldToRight) !== this._model.right ) {
            console.log( 'Viewport: rebuilding geometry' );
            let populate = !this._animation.animateDraw;
            this._updateGeometry( populate );
        }
        else {
            if( !this._animation.animateDraw )
                this._updateCells();
        }
        if( this._animation.animateDraw ) {
            if( this._animation.alwaysClearGeometry )
                this._updateCells( true );
            this._animation.node = this.automaton.first(); this._animation.row =0;
            this._animation.drawDone = false;
        }
        this.animate();
    }
    
    //
    // Private event listeners
    //
    
    _onWindowResize() {
        let container = this.container;

        this.viewportWidth = container.offsetWidth;
        this.viewportHeight = container.offsetHeight;
        this._aspect = this.viewportWidth / this.viewportHeight;
        this.updateCamera();
        this._renderer.setSize( this.viewportWidth, this.viewportHeight );
        this.render();
    }

    _onDocumentMousemove( event ) {
        this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this._mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        if( this.viewmode !== 'folded' ) {
            let render =false;

            this._raycaster.setFromCamera( this._mouse, this._cameraOrtho );
            let intersects = this._raycaster.intersectObjects( this._model.input_pickers );

            if( this._model.picked !== null ) {
                this._model.picked.material.opacity = 0.0;
                this._model.picked = null;
                render =true;
            }
            if( intersects.length !== 0 ) {
                intersects[0].object.material.opacity = 0.5;
                this._model.picked = intersects[0].object;
                render =true;
            }
            if( render )
                this.render();
        }
    }

    _onClick() {
        let picked = this._model.picked;
        if( picked !== null ) {
            if( typeof this._inputClickCallback === 'function' ) {
                this._inputClickCallback( picked.userData.col );
            }
        }
    }

    //
    // Private functions
    //
    
    
    /*
     * Set the geometry's color at position of node to color
     */
    _setColor( node, color ) {
        let M = this._model;
        let n = M.template_size; // elements per template geometry
        let offset = node * n;
        for( let i =0; i < n; i+=3 ) {
            M.buf_color[offset+i] = color.r * 255;
            M.buf_color[offset+i+1] = color.g * 255;
            M.buf_color[offset+i+2] = color.b * 255;
        }
        if( M.attr_color.updateRange.count === -1 ) {
            M.attr_color.updateRange.offset = offset;
            M.attr_color.updateRange.count = n;
        } else {
            let old_offset = M.attr_color.updateRange.offset;
            if( old_offset < offset ) {
                M.attr_color.updateRange.count = (offset - old_offset) + n;
            }
            else {
                M.attr_color.updateRange.offset = offset;
                M.attr_color.updateRange.count = (old_offset - offset) + n;
            }
        }
    }

    /* 
     * Given a col and row, return the color that represents the value
     * of this node in the automaton
     */
    _nodeColor( node ) {
        let color = this.backgroundColor;
        let value = this.automaton.value( node );
        if( value >= 0 ) 
            color = this.palette[ value ];
        return new THREE.Color( color );
    }

    /*
     * Given a col and row, calculate the offset within the geometry
     */
    _calcNodeOffset( { col, row } ) {
        // FIXME: add support for modes
        let width = this.automaton.width;
        let rowoffs =0;
        for( let i =0; i < row; i++ )
            rowoffs += (width--);
        return rowoffs + col;
    }

    /*
     * Change the colors of the geometry such that it represents the current automaton 
     */
    _updateCells( only_clean = false ) {
        const automaton =this.automaton;
        if( automaton === null )
            return;

        let node =0;
        if( !only_clean ) {
            for( let i =0; i < automaton.rows; i++ ) {
                for( let j =0; j < automaton.rowLength(i); j++ ) {
                    let color = this._nodeColor( { row: i, col: j } );
                    this._setColor( this._calcNodeOffset( { col: j, row: i } ), new THREE.Color( color ) );

                    node++;
                }
            }
        }
        // Make the rest of the cells blank
        for( let n =node; n < this._model.node_count; n++ ) {
            this._setColor( n, new THREE.Color( this.backgroundColor ) );
        }
        // Update the buffer
        this._model.attr_color.needsUpdate =true;
    }

    /*
     * Change the colors of the geometry such that it represents the current automaton,
     * when animated, this function performs the next step in the animation.
     */
    _updateCellsAnimated() {
        const automaton =this.automaton;
        if( automaton === null )
            return;

        if( this._animation.drawType === 'ordered' ) {
            let node = this._animation.node;
            let color = this._nodeColor( node );
            let offset = this._calcNodeOffset( node );

            this._setColor( offset, color );
            if( equals( node, automaton.last() ) )
                this._animation.drawDone =true;
            else
                this._animation.node = automaton.next( node );
        } else if( this._animation.drawType === 'rows' ) {
            let row = this._animation.row;
            for( let j =0; j < automaton.rowLength(row); j++ ) {
                let node = { col: j, row: row };
                let color = this._nodeColor( node );
                let offset = this._calcNodeOffset( node );
                this._setColor( offset, color );
            }
            if( row+1 === automaton.rows )
                this._animation.drawDone =true;
            else
                this._animation.row++;
        }

        // Update the buffer
        this._model.attr_color.needsUpdate =true;
    }

    /*
     * Create a new geometry (mesh) based on the size of the automaton 
     * and the viewmode. Discards all previous geometry.
     */
    _updateGeometry( populate = true ) { 
        const automaton =this.automaton;
        if( automaton === null )
            return;
        const viewmode =this._viewmode;

        // Cleanup from previous calls
        //
        
        let M = this._model;
        if( M.geometry !== null ) {
            this._scene.remove( M.mesh );
           /* M.attr_position.setArray(null);
            M.attr_normal.setArray(null);
            M.attr_color.setArray(null);*/
            M.geometry.dispose();
            for( let i =0; i < M.input_pickers.length; i++ ) {
                this._scene.remove( M.input_pickers[i] );
            }
            
        }
        M.input_pickers = new Array();
        
        // For some viewmode we use a template geometry
        // Here we prepare this geometry and the material

        let template =null;
        let material =null;
        
        M.template_size =0;
        if( viewmode !== 'folded' ) {
            material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, vertexColors: THREE.VertexColors} );
            if( viewmode === 'brick' ) {
                template = new THREE.PlaneBufferGeometry( 1, 1 );
                template = template.toNonIndexed();
            } 
            else if ( viewmode === 'diamond' ) {
                template = new THREE.PlaneBufferGeometry( 1, 1 );
                template.rotateZ( Math.PI * 0.25 );
                template.scale( 1 / diamondWidth, 1 , 1 );
                template = template.toNonIndexed();
            } 
            else if( viewmode === 'circle' ) {
                template = new THREE.CircleBufferGeometry( 0.5, 32 );
                template = template.toNonIndexed();
            } else if( viewmode === 'stack' ) {
                template = new THREE.BufferGeometry();
                let positions = new Float32Array( [
                        Math.cos( 2/3 * Math.PI ), 0.0, Math.sin( 2/3 * Math.PI ),
                        Math.cos( 4/3 * Math.PI ), 0.0, Math.sin( 4/3 * Math.PI ),
                        Math.cos( 0 ), 0.0, Math.sin( 0 ) ] );
       /*         let normals = new Float32Array( [
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0 ] );*/
                template.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            }

            M.template_size = template.getAttribute( 'position' ).array.length; 
        }
        else {
            material = new THREE.MeshStandardMaterial( {side: THREE.DoubleSide, vertexColors: THREE.VertexColors, metalness: 0, roughness: 1 } );
            template = new THREE.SphereBufferGeometry( 1.1, 8, 8 );
            template = template.toNonIndexed();
            M.template_size = template.getAttribute( 'position' ).array.length; 
        }


        // Prepare buffers for the geometry

        M.geometry = new THREE.BufferGeometry();
        let array_size = automaton.nodeCount * M.template_size; 
        M.buf_position = new Float32Array( array_size );
        M.buf_color = new Uint8Array( array_size );
        M.buf_normal = new Int16Array( array_size );
        M.offset =0;
        M.node_count = automaton.nodeCount;
        M.right = !automaton.opts.foldToRight; // Position of the pivot

        let addInstance = function( color, translate ) {
            let positions = template.getAttribute( 'position' ).array;
            let normals = null;
            if( viewmode === 'folded' )
                normals = template.getAttribute( 'normal' ).array;
            for( let i =0; i < M.template_size; i+=3 ) {
                M.buf_position[M.offset+i] = positions[i] + translate.x;
                M.buf_position[M.offset+i+1] = positions[i+1] + translate.y;
                M.buf_position[M.offset+i+2] = positions[i+2] + translate.z;

                M.buf_color[M.offset+i] = color.r * 255;
                M.buf_color[M.offset+i+1] = color.g * 255;
                M.buf_color[M.offset+i+2] = color.b * 255;
                
                if( viewmode === 'folded' ) {
                    M.buf_normal[M.offset+i] = normals[i] * 32767;
                    M.buf_normal[M.offset+i+1] = normals[i+1] * 32767;
                    M.buf_normal[M.offset+i+2] = normals[i+2] * 32767;
                }
            }
            M.offset += positions.length;
        };

        let foldedPosition = function( row, col, width, inputLength, right, mode, flat =false ) {
            // The pivot position determines where the rows start
            //let coneCol = right ? (width-1) - col : col;
            // Map the `triangle row' onto the `diagonal row'
            //let coneRow = row + coneCol;
            let coneRow = right ? row + (width-1) - col : row + col;
            let coneCol = right ? row : coneRow - col;
            let fold =!(coneRow < inputLength);
            let coneRowWidth = coneRow + (fold ? 0 : 1); // FIXME: support for mode > 2

            // Calculate the position of the node on the `cone'
            let calcPosition = function( offset ) {
                let p = new THREE.Vector3( 0, 0, 0 );
                let phi = (coneCol+offset) * (2 * Math.PI / (coneRowWidth));
                let fold_offset = (coneCol+offset) / coneRowWidth;
                let radius = (coneRowWidth + fold_offset) / Math.PI;

                p.x = Math.cos( phi ) * radius;
                p.z = Math.sin( phi ) * radius;

                p.y = -coneRow*2 - ((fold && !flat) ? 2 * fold_offset : 0);
                return p;
            }
            return new Array( calcPosition( 0 ), calcPosition( 1 ) );
        }

        let heightstep = 1.0;
        if( automaton.opts.mode % 2 === 0 ) {
            if( viewmode === 'diamond' )
                heightstep = 1 / diamondWidth;
            else if( viewmode === 'circle' ) 
                heightstep = 0.5 + Math.sqrt(0.125);
        }

        let position = new THREE.Vector3 ( 
                0, 
                (automaton.rows - 1) * heightstep / 2,
                0 );
        for( let i =0; i < automaton.rows; i++ ) {
            for( let j =0; j < automaton.rowLength(i); j++ ) {
                position.x = -automaton.width / 2 + 0.5 * i + j; 
                
                let color =populate ? this._nodeColor( {row: i, col: j} ) : new THREE.Color( this.backgroundColor );
                
                if( viewmode === 'folded' ) {
                    let p = foldedPosition( i, j, automaton.rowLength(i), automaton.opts.input.length, M.right, automaton.opts.mode, false )[0];
                    p.y += automaton.width;
                    addInstance( color, p );
                }
                else if( viewmode === 'stack' ) {
                    let ps = foldedPosition( i, j, automaton.rowLength(i), automaton.opts.input.length, M.right, automaton.opts.mode, true );
                    // swap y and z
                    let t = ps[0].y;
                    ps[0].y = ps[0].z;
                    ps[0].z = t;
                    t = ps[1].y;
                    ps[1].y = ps[1].z;
                    ps[1].z = t;
                    // Use these positions to place the triangle
                    let tri = template.getAttribute( 'position' ).array;
                    tri[0] = 0.0;       tri[1] = 0.0;     tri[2] = ps[0].z;  // x y z
                    tri[3] = ps[0].x;   tri[4] = ps[0].y; tri[5] = ps[0].z;  // x y z
                    tri[6] = ps[1].x;   tri[7] = ps[1].y; tri[8] = ps[1].z;  // x y z
                    addInstance( color, new THREE.Vector3( 0,0,0 )  );
                }
                else {
                    // Add an instance to the main geometry
                    addInstance( color, position );

                    // If the node is an input node, also add a picking-mesh for user input
                    if( i === 0 ) {
                        let g = template.clone();
                        g.translate( position.x, position.y, 1 );
                        let picker_material = 
                            new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, color: '#ffffff', transparent: true, opacity: 0.0 } );
                        let picker_mesh = new THREE.Mesh( g, picker_material );
                        
                        picker_mesh.userData.col = j;
                        this._scene.add( picker_mesh );                       
                        M.input_pickers.push( picker_mesh );
                    }
                }
            }
            position.y -= heightstep;
        }
        M.attr_position =new THREE.BufferAttribute(M.buf_position, 3 );
        M.attr_color    =new THREE.BufferAttribute(M.buf_color, 3 );
        M.attr_color.normalized = true;
        M.geometry.addAttribute('position', M.attr_position );
        M.geometry.addAttribute('color', M.attr_color ) ;
        if( viewmode === 'folded' ) {
            M.attr_normal   =new THREE.BufferAttribute(M.buf_normal, 3 );
            M.attr_normal.normalized = true;
            M.geometry.addAttribute('normal', M.attr_normal );
        }
        M.geometry.computeBoundingSphere();

        M.mesh = new THREE.Mesh( M.geometry, material );
        this._scene.add( M.mesh );

        M.viewmode = viewmode;
        M.mode = automaton.opts.mode;

        if( viewmode === 'folded' )
            this._sceneHeight = automaton.width * 2;
        else if( viewmode === 'stack' )
            this._sceneHeight = automaton.width * 0.8;
        else
            this._sceneHeight = automaton.width * 1.1;
        
        this.updateCamera();

    }

}

