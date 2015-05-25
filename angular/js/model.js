ngSudoku.factory( 'model', function(){

    const SERIALISED_FORMS = {
        // http://www.sudokusnake.com/eastermonster.php
        EASTER_MONSTER: '1.......2.9.4...5...6...7...5.9.3.......7.......85..4.7.....6...3...9.8...2.....1',
        BLANK: '................................................................................'
    };

    var cells = [],
        grid = [];

    function init( serialisedForm ){
        var index, cell, row;
        for( index = 0; index < 81; index += 1 ){
            cell = {value: '', index: cells.length, valid: true};
            cells.push( cell );
            if( index % 9 === 0 ){
                row = [];
                grid.push( row );
            }
            row.push( cell );
        }
        setGridValues( serialisedForm.split( '' ) );
    }

    function setGridValues( digits ){
        var index = 0;
        digits.forEach( function( digit ){
            if( digit < '1' | digit > '9' ){
                digit = '';
            }
            cells[index++].value = digit;
        } );
    }

    function setGridValidity(){

        const BOX_CELL_INDICES = [
            [0, 1, 2, 9, 10, 11, 18, 19, 20],
            [3, 4, 5, 12, 13, 14, 21, 22, 23],
            [6, 7, 8, 15, 16, 17, 24, 25, 26],
            [27, 28, 29, 36, 37, 38, 45, 46, 47],
            [30, 31, 32, 39, 40, 41, 48, 49, 50],
            [33, 34, 35, 42, 43, 44, 51, 52, 53],
            [54, 55, 56, 63, 64, 65, 72, 73, 74],
            [57, 58, 59, 66, 67, 68, 75, 76, 77],
            [60, 61, 62, 69, 70, 71, 78, 79, 80]
        ];

        function getRowCells( cellIndex ){
            var row = Math.floor( cellIndex / 9 ),
                rowCells = [];
            for( cellIndex = row * 9; cellIndex < (row + 1) * 9; cellIndex += 1 ){
                rowCells.push( cells[cellIndex] );
            }
            return rowCells;
        }

        function getColumnCells( cellIndex ){
            var column = Math.floor( cellIndex % 9 ),
                columnCells = [];
            for( cellIndex = column; cellIndex < 81; cellIndex += 9 ){
                columnCells.push( cells[cellIndex] );
            }
            return columnCells;
        }

        function getBoxCells( cellIndex ){
            var boxIndex,
                boxCellIndex,
                boxCells = [];
            for( boxIndex = 0; boxIndex < 9; boxIndex += 1 ){
                if( BOX_CELL_INDICES[boxIndex].indexOf( cellIndex ) > -1 ){
                    for( boxCellIndex = 0; boxCellIndex < 9; boxCellIndex += 1 ){
                        boxCells.push( cells[BOX_CELL_INDICES[boxIndex][boxCellIndex]] );
                    }
                    return boxCells;
                }
            }
            throw new Error();
        }

        function areCellsValid( cells ){
            var values = [];
            return cells.every( function( cell ){
                var value = cell.value;
                if( value === '' ){
                    return true;
                }
                if( values.indexOf( value ) > -1 ){
                    return false;
                }
                values.push( value );
                return true;
            } );
        }

        function setCellValidity( cellIndex ){
            var validCells = [], invalidCells = [];

            [getRowCells, getColumnCells, getBoxCells].forEach( function( getFn ){
                var cells = getFn.call( this, cellIndex );
                if( areCellsValid( cells ) ){
                    validCells = validCells.concat( cells );
                } else{
                    invalidCells = invalidCells.concat( cells );
                }
            } );

            validCells.forEach( function( cell ){
                cell.valid = true;
            } );

            invalidCells.forEach( function( cell ){
                cell.valid = false;
            } );

            return invalidCells.length === 0;
        }

        // main function
        [0, 13, 26, 27, 40, 53, 54, 67, 80].every(
            function( cellIndex ){
                return setCellValidity( cellIndex );
            } );
    }

    function serialisedForm( serialisedForm ){
        if( arguments.length ){
            setGridValues( serialisedForm.split( '' ) );
        } else{
            serialisedForm = '';
            cells.forEach( function( cell ){
                if( cell.value === '' ){
                    serialisedForm += '.';
                } else{
                    serialisedForm += cell.value;
                }
            } );
            return serialisedForm;
        }
    }

    init( SERIALISED_FORMS.EASTER_MONSTER );

    return {
        grid: grid,
        reset: function(){
            setGridValues( SERIALISED_FORMS.EASTER_MONSTER.split( '' ) );
        },
        serialisedForm: serialisedForm,
        set: setGridValues,
        validate: setGridValidity
    };
} );
