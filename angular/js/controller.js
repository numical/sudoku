ngSudoku.controller( 'controller',
    ['$scope', 'model', 'solver', function( $scope, model, solver ){

        $scope.model = model;
        $scope.result = '';

        $scope.solve = function(){
            var outputs = solver( model.serialisedForm() );
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
                model.set( outputs[0] );
            }
        };

        $scope.reset = function(){
            model.reset();
            $scope.result = '';
        };

        $scope.$watch(
            'model.grid',
            function( newValues, oldValues ){
                model.validate();
            },
            true );
    }] );
