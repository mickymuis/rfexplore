import Automaton from "./automaton.js";

/* Given an array containing the digits of a number with a given base,
 * increment this number by one
 */
var varbase_incr = function( A, base ) {
    for( let i =A.length-1; i >= 0; i-- ) {
        if( (++A[i]) < base )
            break;
        else
            A[i] =0;
    }
}

/*
 * Provides a second level transition table with support for feature extraction
 */
export default class TTable2 {
    constructor( base, mode, rule ) {
        // Generate the level1 ttable
        this.level1 = Automaton.makeTTable( base, mode, rule );

        // Size of the level2 ttable is |tt|^2
        this.size = this.level1.length * this.level1.length;

        // Buffer to hold the input pattern as we increment it
        let A = new Array( mode*mode );
        A.fill( 0 );

        this.entry = new Array( this.size );
        for( let i =0; i < this.size; i++ ) {
            let input =A.slice( 0, A.length );
            let output =new Array( mode );
            for( let j =0; j < mode; j++ ) {
                let n = Automaton.ttIndex( base, mode, A.slice( j*mode, j*mode + mode ) );
                output[j] = this.level1[n];
            }
            this.entry[i] = { input: input, output: output };

            varbase_incr( A, base );
        }

        this.mode =mode;
        this.base =base;
        this.rule =rule;
    }
    /*
     * Compute the feature vector of this transition table
     */
    computeFeature() {
        // We categorize the level2 transitions based on these semantics
        let invert =0;
        let join =0;
        let select =0;
        let combine =0;
        let other =0;

        for( let i =0; i < this.size; i++ ) {
            let input = this.entry[i].input;
            let output = this.entry[i].output;
            //console.log( input + " -> " + output );
            if( i === 0 || i === this.size-1 ) {
                if( input[0] == output[0] )
                    join++;
                else
                    invert++;
            }
            else if( this._isSelect( input, output ) ) {
                select++;
            }
            else if( this._isCombine( input, output ) ) {
                combine++;
            }
            else
                other++;
        }
        return [ invert, join, select, combine, other ];
    }

    /*
     * Compute the Euclidian distance between two feature vectors
     */
    static distance( v1, v2 ) {
        let diff =0;
        for( let i =0; i < v1.length; i++ ) {
            diff += Math.pow( Math.abs( v1[i] - v2[i] ), 2 );
        }
        return Math.sqrt( diff );
    }

    /*
     * Find the next nearest neighbor within the same cluster
     * Starts in forward direction (if backwards=false)
     * Resulting next rule has a distance <= maxDist
     */
    findNextNN( backwards =false, maxDist =0 ) {
        let v1 = this.computeFeature();
        let rule = this.rule;
        let maxRules = Automaton.maxRules( this.base, this.mode );
        
        do {
            if( backwards )
                rule--;
            else rule++;

            let tt2 = new TTable2( this.base, this.mode, rule );
            let v2 = tt2.computeFeature();
            if( TTable2.distance( v1, v2 ) <= maxDist )
                return rule;
        } while( rule >= 0 && rule < maxRules )

        return rule;
    }

    _isSelect( input, output ) {
        for( let i =0; i < this.mode; i++ ) {
            if( this._comp( input, i * this.mode, output, 0, this.mode ) )
                return true;
        }
        return false;
    }

    _isCombine( input, output ) {
        // This works for mode == 2, a factatorial rescursive version is needed otherwise
        if( this.mode === 2 ) {
            return ( input[0] == output[0] && input[4] == output[1] )
                || ( input[1] == output[1] && input[3] == output[0] );
        }
        return false;
    }

    _isCombineRecursive( input, output, A, n ) {
    // TODO
    }

    /*
     * Compare A[i]..A[i+N-1] to B[j]..B[j+N-1]
     */
    _comp( A, i, B, j, N ) {
        for( let n =0; n < N; n++ ) {
            if( A[i+n] != B[j+n] )
                return false;
        }
        return true;
    }
}
