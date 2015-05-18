(function(){
    'use strict';
    var GUI = {
            GRID: document.getElementById( 'grid' ),
            SERIALISED: document.getElementById( 'serialised' ),
            SOLVE: document.getElementById( 'solve' ),
            RESULT: document.getElementById( 'result' )
        },
        GRID_CELL_ID_PREFIX = 'C',
        SERIALISED_FORMS = {
            // http://www.sudokusnake.com/eastermonster.php
            EASTER_MONSTER: '1.......2.9.4...5...6...7...5.9.3.......7.......85..4.7.....6...3...9.8...2.....1',
            BLANK: '................................................................................'
        },
        SOLVER = null;

    function isValidHint( hint ){
        return hint && ( hint >= 1 && hint <= 9 );
    }

    function getGridCell( cellIndex ){
        return document.getElementById( GRID_CELL_ID_PREFIX + cellIndex );
    }

    function enableOrDisableSolve(){
        var hintCount = 0;
        GUI.SERIALISED.value.split( '' ).forEach( function( hint ){
            if( isValidHint( hint ) ){
                hintCount += 1;
            }
        } );
        GUI.SOLVE.disabled = (hintCount < 15 );
    }

    function hideResult(){
        GUI.RESULT.innerHTML = '';
    }

    function setSerialisedValueFromGrid(){
        var cellIndex, newSerialisedValue = '', cellValue;
        for( cellIndex = 0; cellIndex < 81; cellIndex += 1 ){
            cellValue = getGridCell( cellIndex ).value;
            if( isValidHint( cellValue ) ){
                newSerialisedValue += cellValue;
            } else{
                newSerialisedValue += '.';
            }
        }
        GUI.SERIALISED.value = newSerialisedValue;
        enableOrDisableSolve();
        hideResult();
    }

    function setGridFromSerialisedValue(){
        var cellIndex, serialisedValue, cellValue;
        // clear all grid values
        for( cellIndex = 0; cellIndex < 81; cellIndex += 1 ){
            getGridCell( cellIndex ).value = '';
        }
        // get serialised
        serialisedValue = GUI.SERIALISED.value;
        // fill as many grid values as possible
        if( serialisedValue && serialisedValue.length > 0 ){
            for( cellIndex = 0; cellIndex < serialisedValue.length; cellIndex += 1 ){
                cellValue = serialisedValue.substr( cellIndex, 1 );
                if( isValidHint( cellValue ) ){
                    getGridCell( cellIndex ).value = cellValue;
                }
            }
        }
        enableOrDisableSolve();
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
        var gridHTML, row, column, cellClass;
        // create table html
        gridHTML = '<tbody>';
        for( row = 0; row < 9; row += 1 ){
            gridHTML += '<tr>';
            for( column = 0; column < 9; column += 1 ){
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
                gridHTML += ' oninput="sudoku.update()" id="';
                gridHTML += GRID_CELL_ID_PREFIX;
                gridHTML += (9 * row + column);
                gridHTML += '"></td>';
            }
            gridHTML += '</tr>';
        }
        gridHTML += '</tbody>';
        GUI.GRID.innerHTML = gridHTML;
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
        update: setSerialisedValueFromGrid
    };
})();
