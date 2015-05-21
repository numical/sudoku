(function(){
    'use strict';
    var GUI = {
            GRID: document.getElementById( 'grid' ),
            SERIALISED: document.getElementById( 'serialised' ),
            SOLVE: document.getElementById( 'solve' ),
            RESULT: document.getElementById( 'result' ),
            GRID_CELL_ID_PREFIX: 'C',
            GRID_CELLS: [],
            init: function(){
                var i;
                for( i = 0; i < 81; i += 1 ){
                    GUI.GRID_CELLS.push( document.getElementById( GUI.GRID_CELL_ID_PREFIX + i ) );
                }
            }
        },
        SERIALISED_FORMS = {
            // http://www.sudokusnake.com/eastermonster.php
            EASTER_MONSTER: '1.......2.9.4...5...6...7...5.9.3.......7.......85..4.7.....6...3...9.8...2.....1',
            BLANK: '................................................................................'
        },
        GRID_VALIDATOR = new GridValidator(),
        SOLVER = null;

    function GridValidator(){

        var BOX_CELL_INDICES = [
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
                cells = [];
            for( cellIndex = row * 9; cellIndex < (row + 1) * 9; cellIndex += 1 ){
                cells.push( GUI.GRID_CELLS[cellIndex] );
            }
            return cells;
        }

        function getColumnCells( cellIndex ){
            var column = Math.floor( cellIndex % 9 ),
                cells = [];
            for( cellIndex = column; cellIndex < 81; cellIndex += 9 ){
                cells.push( GUI.GRID_CELLS[cellIndex] );
            }
            return cells;
        }

        function getBoxCells( cellIndex ){
            var boxIndex,
                boxCellIndex,
                cells = [];
            for( boxIndex = 0; boxIndex < 9; boxIndex += 1 ){
                if( BOX_CELL_INDICES[boxIndex].indexOf( cellIndex ) > -1 ){
                    for( boxCellIndex = 0; boxCellIndex < 9; boxCellIndex += 1 ){
                        cells.push( GUI.GRID_CELLS[BOX_CELL_INDICES[boxIndex][boxCellIndex]] );
                    }
                    return cells;
                }
            }
            throw new Error();
        }

        function areCellsValid( cells ){
            var values = [];
            return cells.every( function( cell ){
                var value = cell.value;
                if( value === "" ){
                    return true;
                }
                if( values.indexOf( value ) > -1 ){
                    return false;
                }
                values.push( value );
                return true;
            } );
        }

        function addClass( element, className ){
            if( !element.className ){
                element.className = className;
            } else if( element.className.indexOf( className ) < 0 ){
                element.className += " " + className;
            }
        }

        function removeClass( element, className ){
            var newClasses;
            if( element.className && element.className.indexOf( className ) > -1 ){
                newClasses = element.className.split( ' ' ).forEach( function( existingClass ){
                    return existingClass !== className;
                } );
                element.className = newClasses;
            }
        }

        function testCellValidityAndHighlight( cellIndex ){
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
                removeClass( cell, "errorCell" );
            } );

            invalidCells.forEach( function( cell ){
                addClass( cell, "errorCell" );
            } );

            return invalidCells.length === 0;
        }

        this.validate = function( cellIndex ){
            if( cellIndex === undefined ){
                return [0, 13, 26, 27, 40, 53, 54, 67, 80].every(
                    function( cellIndex ){
                        return testCellValidityAndHighlight( cellIndex );
                    } );
            }
            return testCellValidityAndHighlight( cellIndex );
        };
    }

    function isValidHintValue( hint ){
        return hint && ( hint >= 1 && hint <= 9 );
    }

    function enableOrDisableSolve( gridIsValid ){
        var hintCount = 0;
        if( gridIsValid ){
            GUI.SERIALISED.value.split( '' ).forEach( function( hint ){
                if( isValidHintValue( hint ) ){
                    hintCount += 1;
                }
            } );
            GUI.SOLVE.disabled = (hintCount < 15 );
        } else{
            GUI.SOLVE.disabled = true;
        }

    }

    function hideResult(){
        GUI.RESULT.innerHTML = '';
    }

    function setSerialisedValueFromGrid( changedCellIndex ){
        var cellIndex, newSerialisedValue = '', cellValue, gridIsValid;
        for( cellIndex = 0; cellIndex < 81; cellIndex += 1 ){
            cellValue = GUI.GRID_CELLS[cellIndex].value;
            if( isValidHintValue( cellValue ) ){
                newSerialisedValue += cellValue;
            } else{
                newSerialisedValue += '.';
            }
        }
        GUI.SERIALISED.value = newSerialisedValue;
        gridIsValid = GRID_VALIDATOR.validate( changedCellIndex );
        enableOrDisableSolve( gridIsValid );
        hideResult();
    }

    function setGridFromSerialisedValue(){
        var cellIndex, serialisedValue, cellValue, gridIsValid;
        // clear all grid values
        for( cellIndex = 0; cellIndex < 81; cellIndex += 1 ){
            GUI.GRID_CELLS[cellIndex].value = '';
        }
        // get serialised
        serialisedValue = GUI.SERIALISED.value;
        // fill as many grid values as possible
        if( serialisedValue && serialisedValue.length > 0 ){
            for( cellIndex = 0; cellIndex < serialisedValue.length; cellIndex += 1 ){
                cellValue = serialisedValue.substr( cellIndex, 1 );
                if( isValidHintValue( cellValue ) ){
                    GUI.GRID_CELLS[cellIndex].value = cellValue;
                }
            }
        }
        gridIsValid = GRID_VALIDATOR.validate();
        enableOrDisableSolve( gridIsValid );
        hideResult();
    }

    function setSerialisedValue( serialisedValue ){
        GUI.SERIALISED.value = serialisedValue;
        setGridFromSerialisedValue();
    }

    function reset(){
        setSerialisedValue( SERIALISED_FORMS.EASTER_MONSTER );
    }

    function drawGrid(){
        var gridHTML, row, column, cellIndex, cellClass;
        // create table html
        gridHTML = '<tbody>';
        for( row = 0; row < 9; row += 1 ){
            gridHTML += '<tr>';
            for( column = 0; column < 9; column += 1 ){
                cellIndex = (9 * row + column);
                if( (row + 1) % 3 === 0 && column % 3 === 0 ){
                    cellClass = 'cell3';
                } else if( (row + 1) % 3 === 0 ){
                    cellClass = 'cell1';
                } else if( column % 3 === 0 ){
                    cellClass = 'cell2';
                } else{
                    cellClass = 'cell';
                }
                gridHTML += '<td class="';
                gridHTML += cellClass;
                gridHTML += '"><input class="input" type="text" size="1" maxlength="1";';
                gridHTML += ' oninput="sudoku.gridUpdated(';
                gridHTML += cellIndex;
                gridHTML += ')" id="';
                gridHTML += GUI.GRID_CELL_ID_PREFIX;
                gridHTML += cellIndex;
                gridHTML += '"></td>';
            }
            gridHTML += '</tr>';
        }
        gridHTML += '</tbody>';
        GUI.GRID.innerHTML = gridHTML;
        // populate GUI references
        GUI.init();
        // link grid to serialised form
        GUI.SERIALISED.oninput = setGridFromSerialisedValue;
        // set initial value
        reset();
    }

    function solve(){
        var input, outputs, message, serialised = '';

        // lazy instantiate solver
        if( SOLVER === null ){
            SOLVER = sudoku_solver();
        }
        // ensure input has 81 characters
        input = ( GUI.SERIALISED.value + SERIALISED_FORMS.BLANK ).substr( 0, 81 );
        // solve!
        outputs = SOLVER( input );
        switch( outputs.length ){
            case 0:
                message = "No Solution";
                break;
            case 1:
                message = "Unique Solution";
                break;
            default:
                message = "Multiple Solutions";

        }
        if( outputs.length > 0 ){
            outputs[0].forEach( function( digit ){
                serialised += digit;
            } );
            setSerialisedValue( serialised );
        }
        GUI.RESULT.innerHTML = message;
    }

    window.sudoku = {
        drawGrid: drawGrid,
        solve: solve,
        reset: reset,
        gridUpdated: setSerialisedValueFromGrid
    };
}());
