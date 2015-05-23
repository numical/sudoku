ngSudoku.service( 'ngSudokuSolver', function(){

    var instance = null;

    this.solve = function( input ){
        if( instance === null ){
            instance = sudoku_solver();
        }
        return instance( input );
    };

    // in Angular 2.0 with lazy-load DI then possibly:
    // this.solve = sudoku_solver();

} );
