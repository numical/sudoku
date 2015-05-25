var ngSudoku = angular.module( 'ngSudoku', [] )
    .config( function(){
        // app level config
    } )
    .factory( 'solver', function(){
        return sudoku_solver();
    } );
