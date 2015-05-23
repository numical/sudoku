ngSudoku.controller( 'ngSudokuCtrl',
    ['$scope', 'ngSudokuModel', 'ngSudokuSolver', function( $scope, model, solver ){

        $scope.model = model;
        $scope.result = '';

        $scope.$watch( model.grid, function( newValues, oldValues ){
            console.log( newValues );
        } );

        $scope.solve = function(){
            var outputs = solver.solve( model.serialisedForm );
            switch( outputs.length ){
                case 0:
                    $scope.result = "No Solution";
                    break;
                case 1:
                    $scope.result = "Unique Solution";
                    break;
                default:
                    $scope.result = "Multiple Solutions";
            }
            if( outputs.length > 0 ){
                model.setFromDigitArray( outputs[0] );
            }
        };

        $scope.reset = function(){
            model.reset();
            $scope.result = '';
        };

        // initialise
        $scope.reset();
    }] );
