const TEXT_TYPE = 'text';
const BUTTON_TYPE = 'button';

const NO_ACTION = 'none';
const FUNC_ACTION = 'func';
const URL_ACTION = 'url';
const DROPDOWN_ACTION = 'dropdown';

class Menuitem {

    constructor( { container, text = '', iconclass = '', type = 'text', action = 'none' } ) {
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

    action( obj ) {
        if( typeof obj === 'function' ) {
            this._action = FUNC_ACTION;
            this._callback = obj;
            this._aNode.setAttribute( 'href', '#' );
        } else if( typeof obj === 'string' ) {
            this._action = URL_ACTION;
            this._callback = null;
            this._aNode.setAttribute( 'href', obj );
        }
        return this;
    }

    set text( t ) {
        this._text = t;
        this._textNode.nodeValue = t;
    }

    get text() { return this._text; }

    set iconclass( c ) {
        this._iconclass = c;
        if( this._text != '' )
            this._iconNode.className = `text-left ${c}`;
        else
            this._iconNode.className = `${c}`;
    }

    get iconclass() { return this._iconclass; }

    _appendElem() {
        this._liNode =document.createElement( 'li' );
        this.container.appendChild( this._liNode );

        switch( this._type ) {
            case TEXT_TYPE:
                this._aNode = document.createElement( 'a' );
                this._liNode.appendChild( this._aNode );
                break;
            case BUTTON_TYPE:
                this._aNode = document.createElement( 'a' );
                this._aNode.className = 'button';
                this._liNode.appendChild( this._aNode );
                break;
        }
        this._textNode = document.createTextNode( this._text );
        this._aNode.appendChild( this._textNode );
        this._iconNode = document.createElement( 'i' );
        this._aNode.appendChild( this._iconNode );
        this.iconclass = this._iconclass;

        this._aNode.addEventListener( 'click', ()=>{this._clicked();} );
    }
    _clicked() {
        switch( this._action ) {
            case NO_ACTION:
                break;
            case FUNC_ACTION:
                if( typeof this._callback === 'function' )
                    this._callback();
                break;
            case URL_ACTION:
                break;
            case DROPDOWN_ACTION:
                // TODO
                break;
        }
    }
}

export default class Menubar {
    constructor( container, { subgroup = false, parent = null, panel =false } = {} ) {
        let parentContainer =container || document.body;
        this._subgroup =subgroup;
        this._parent = parent;

        if( subgroup ) {
            this.container = parentContainer;
        } else {
            this.container =document.createElement( 'div' );
            this.container.className = "menubar";
            parentContainer.appendChild( this.container );
        }

        if( !subgroup || subgroup && panel ) {
            this._rootPanel =document.createElement( 'div' );
            this._rootPanel.className = "panel";
            this.container.appendChild( this._rootPanel );
        } else {
            this._rootPanel = parent._rootPanel;
        }
        
        this._ulNode = document.createElement( 'ul' );
        this._rootPanel.appendChild( this._ulNode );

        this._items = new Array();
        this._groups = new Array();
    }

    addGroup() {
        let group = new Menubar( this.container, { subgroup: true, parent: this } );
        this._groups.push( group );
        return group;
    }

    addPanel() {
        let group = new Menubar( this.container, { subgroup: true, parent: this, panel: true } );
        this._groups.push( group );
        return group;
    }

    addButton( text = '', iconclass = '' ) {
        let item = new Menuitem( { container: this._ulNode, text: text, iconclass: iconclass, type: BUTTON_TYPE } );
        this._items.push( item );
        return item;
    }

    addLink( text = '', iconclass = '' ) {
        let item = new Menuitem( { container: this._ulNode, text: text, iconclass: iconclass, type: TEXT_TYPE } );
        this._items.push( item );
        return item;
    }

    floatLeft() {
        this._ulNode.className = 'float-left';
        return this;
    }
    
    floatRight() {
        this._ulNode.className = 'float-right';
        return this;
    }
    
    floatCenter() {
        this._ulNode.className = 'float-center';
        return this;
    }
}
