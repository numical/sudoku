ngSudoku.service( 'ngSudokuModel', function(){

    const SERIALISED_FORMS = {
        // http://www.sudokusnake.com/eastermonster.php
        EASTER_MONSTER: '1.......2.9.4...5...6...7...5.9.3.......7.......85..4.7.....6...3...9.8...2.....1',
        BLANK: '................................................................................'
    };

    this.serialisedForm = SERIALISED_FORMS.BLANK;

    this.grid = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];

    this.reset = function(){
        this.serialisedForm = SERIALISED_FORMS.EASTER_MONSTER;
    };

    this.setFromDigitArray = function( digitArray ){
        var s = '';
        digitArray.forEach( function( digit ){
            s += digit;
        } );
        this.serialisedForm = s;
    };
} );
