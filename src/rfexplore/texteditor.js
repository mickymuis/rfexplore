export default class Texteditor {
    constructor() {
        this._accepted =false;
        this._backdropElem =null;
        this._containerElem =null;
        this._textareaElem =null;
        this._doneFunc =null;
        this._cancelFunc =null;
    }

    create( modal =true ) {
        // Create a backdrop if we should block all other elements
        if( modal ) {
            this._backdropElem = document.createElement( 'div' );
            this._backdropElem.className = 'texteditor-backdrop';
            document.body.appendChild( this._backdropElem );
        }

        // Set-up the editor
        this._containerElem = document.createElement( 'div' );
        this._containerElem.className = 'texteditor-container';
        document.body.appendChild( this._containerElem );

        let wrapper = document.createElement( 'div' );
        wrapper.className = 'wrapper';
        this._containerElem.appendChild( wrapper );

        this._textareaElem = document.createElement( 'textarea' );
        wrapper.appendChild( this._textareaElem );

        let bttnCancel = document.createElement( 'button' );
        bttnCancel.className = 'cancel';
        bttnCancel.appendChild( document.createTextNode( 'Cancel' ) );
        this._containerElem.appendChild( bttnCancel );
        bttnCancel.addEventListener( 'click', ()=> { this._onCancel(); } );

        let bttnDone = document.createElement( 'button' );
        bttnDone.className = 'done';
        bttnDone.appendChild( document.createTextNode( 'Done' ) );
        this._containerElem.appendChild( bttnDone );
        bttnDone.addEventListener( 'click', ()=> { this._onDone(); } );

    }

    set text( str ) {
        this._textareaElem.value =str;
    }

    get text() {
        return this._textareaElem.value;
    }

    set onDone( func ) { this._doneFunc = func; }
    get onDone() { return this._doneFunc; }

    set onCancel( func ) { this._cancelFunc = func; }
    get onCancel() { return this._cancelFunc; }

    get accepted() { return this._accepted; }

    remove() {
        if( this._backdropElem )
            document.body.removeChild( this._backdropElem );

        document.body.removeChild( this._containerElem );
    }

    _onDone() {
        this.remove();
        if( typeof this._doneFunc === 'function' )
            this._doneFunc( this.text );
    }

    _onCancel() {
        this.remove();
        if( typeof this._cancelFunc === 'function' ) 
            this._cancelFunc();
    }
}
