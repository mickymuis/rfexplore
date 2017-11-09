"use strict";

export default class Automaton {

/* 
 * Constructs a new Automaton given 'opts' and generates a transition table 
 */
    constructor( 
        {
            base = 2,
            mode = 2,
            rule = 0,
            input = [ 0, 0],
            maxSteps = 0,
            folds = 0,
            foldToRight = false
        } = []
    ) {
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
        this._rows.push( foldToRight? input.slice() : input.slice().reverse() );
        this._curRow = 0; // row 0 is the top (input) row
        this._curPos = this._rows[0].length -1;
        this._folds  = 0;
        
        this.ttable = this.makeTTable( base, mode, rule );
        this.nodeCount = this.width;
        this.inputSize = input.length;
    }

    /* 
     * General functions that define the dimensions 
     */
    get width() {
        return this._rows[0].length;
    }

    get rows() {
        return this._rows.length;
    }

    rowLength( i ) {
        return this._rows[i].length;
    }

    /*
     * Generate a transition table given a base, mode and rule number
     * Returns an array
     */
    makeTTable( base, mode, rule ) {
        var tt = new Array();
        let rulesize = Math.pow( base, mode );
        let maxrules = Math.pow( base, rulesize );

        console.log( "Transition table for rule #" + rule + " / " + maxrules + " * " + rulesize );
        if( rulesize > maxrules ) {
            return null;
        }

        for( let i = 0; i < rulesize; i++ )
            tt[i] = 0;

        let decimal = rule; // Rule in base 10
        let i = rulesize -1;
        while( i >= 0 && decimal > 0 ) {
            tt[i] = decimal % base;
            decimal = Math.floor( decimal / base );
            i--;
        }
        for( let i = 0; i < rulesize; i++ )
            console.log( i + ": " + tt[i] );
        return tt;
    }

    /*
     * Given a base, mode and set of input nodes A (A.length == mode),
     * returns the index of the transition table that contains the reduction rule
     * for A[0] .. A[mode-1] -> b
     */
    ttIndex( base, mode, A ) {
        let mult =1;
        let index =0;
        for( let i = mode-1; i >= 0; i-- ) {
            index += A[i] * mult;
            mult *= base;
        }
        return index;
    }

    first() {
        return this._transpose( { col: 0, row: 0 } );
    }

    isLast( {col, row} ) {
        let n = this._transpose( { col: col, row: row } );
        return (n.col === this._curPos && n.row === this._curRow);
    }

    /*
     * Return the position { col, row } of the most recently calculated node
     */
    last() {
        return this._transpose( { col: this._curPos, row: this._curRow } );
    }

    /*
     * Given a column and row, return the position of the next node that need to be calculated
     * Returns object in the form of { col, row }
     */
    next( { col, row }  ) {
        return this._transpose( this._next( this._transpose( { col: col, row: row } ) ) );
    }

    /*
     * Given a column and row, return the position of the previously calculated node
     * Returns object in the form of { col, row }
     */
    previous( { col, row } ) {
        return this._transpose( this._previous( this._transpose( { col: col, row: row } ) ) ); 
    }

    /* Given a column and row, return the value of the node in that position
     * Note that a bounds check is omitted for performance
     */
    value( { col, row } ) {
        let pos = this._transpose( { col: col, row: row } );
        return this._rows[pos.row][pos.col];
    }

    /*
     * Advance the automaton by one step
     * This step may either be a reduction step or a fold
     */
    step() { 
        if( this._curRow === 0 && this._rows.length === 0 ) {
            console.error( "Automaton: undefined top row, there is no input." );
            return;
        }
        // Step 0. compute the position of the next cell
        let nextPos = this._next( { col: this._curPos, row: this._curRow } );
        this._curRow = nextPos.row;
        this._curPos = nextPos.col;

        if( this._curRow === 0 ) {
            console.log( "fold" );
            // Top row, which means the next step can only be a fold
            // Step 1. extend all rows by one
            for( let i =0; i < this._rows.length; i++ ) {
                // push
                this._rows[i][this._rows[i].length] = -1;
            }
            // Step 2. copy ('fold') the apex/singleton row over to the top row
            let foldValue = this._rows[this._rows.length-1][0];
            this._rows[0][this._curPos] = foldValue;
            // Step 3. extend the automata
            this._rows.push( [-1] );
            this._folds++;
            this.nodeCount += this._rows.length;
            return;
        }
        else if( typeof this._rows[this._curRow] === 'undefined' ) {
            // We need to start a new row
            let len = this._rows[this._curRow-1].length - 1;
            this._rows.push( new Array(len) );
            this._rows[this._curRow].fill( -1 );
            this.nodeCount += len;
        }
        // Now we calculate the next iteration by reduction
        // Step 1. get values from parent nodes (one row up)
        let parents = this._rows[this._curRow-1].slice( this._curPos, this._curPos + this.opts.mode );

        // Step 2. Use the transition table to obtain the value for the current node
        var value =this.ttable[this.ttIndex( this.opts.base, this.opts.mode, parents )];
        this._rows[this._curRow][this._curPos] = value;

    }

    generate( done ) {
        
        while( this._folds < this.opts.folds ) this.step();

        if( typeof done  === 'function' )
            done( this );
    }

    /*
     * If the automaton is set to expand (fold) to the left, 
     * we mirror the entire datastructure for optimization.
     */
    _mirrored() {
        return !this.opts.foldToRight;
    }

    /*
     * Return the transposed (mirrored) coordinates for {col,row}
     * This translates internal coordinates to logical (abstracted) coordinates
     */
    _transpose( { col, row } ) {

        if( this.opts.foldToRight )
            return { col: col, row: row };
        else
            return { col: (this._rows[row].length-1) - col, row: row };
    }

    /*
     * Calculate the next position using internal coordinates
     */
    _next( { col, row } ) {
        let _row = this._rows[row];
        let unfoldedRowLength = this.inputSize - row * (this.opts.mode-1);
        let lastInputRow = this.inputSize-1; // TODO fix for mode > 2

        if( col < unfoldedRowLength && row < lastInputRow ) {
            if( col === unfoldedRowLength - 1 )
                return { col: 0, row: row + 1 };
            else
                return { col: col + 1, row: row };
        }
        else if( col === 0 ) {
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
    }

    /*
     * Calculate the previous position using internal coordinates
     */
    _previous( { col, row } ) {
        let pos = { col: col, row: row };
        let _row = this._rows[row];
    }

} // class Automaton
