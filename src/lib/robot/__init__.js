/*
 *  __author__: Viktar Tserashchuk
 *
 *  Implementation of the Python robot module.
 */

var $builtinmodule = function () {
    "use strict";

    var curR, curC, walls, width, height, actionsDone, paintedCells;
    
    resetEnv();

    return {
        right: new Sk.builtin.func(doActionAndCheckLimits(right)),
        left: new Sk.builtin.func(doActionAndCheckLimits(left)),
        up: new Sk.builtin.func(doActionAndCheckLimits(up)),
        down: new Sk.builtin.func(doActionAndCheckLimits(down)),
        paint: new Sk.builtin.func(doActionAndCheckLimits(paint)),
        cell_is_painted: new Sk.builtin.func(cellIsPainted),
        cell_is_unpainted: new Sk.builtin.func(cellIsUnpainted),
        wall_from_right: new Sk.builtin.func(wallFromRight),
        wall_from_left: new Sk.builtin.func(wallFromLeft),
        wall_from_up: new Sk.builtin.func(wallFromUp),
        wall_from_down: new Sk.builtin.func(wallFromDown),
        free_from_right: new Sk.builtin.func(freeFromRight),
        free_from_left: new Sk.builtin.func(freeFromLeft),
        free_from_up: new Sk.builtin.func(freeFromUp),
        free_from_down: new Sk.builtin.func(freeFromDown)
    };

    function doActionAndCheckLimits(action) {
        return function() {
            action();
            actionsDone++;
            if (Sk.robotActionsLimit && Sk.robotActionsLimit < actionsDone) {
                throw new Sk.builtin.Exception("too many actions");
            }
        };
    }

    function right() {
        Sk.builtin.pyCheckArgs("right", arguments, 0, 0);
        assertThereIsWayTo(curR, curC + 1);
        curC++;
        Sk.robotEnv.action("right");
    }
    
    function left(){
        Sk.builtin.pyCheckArgs("left", arguments, 0, 0);
        assertThereIsWayTo(curR, curC - 1);
        curC--;
        Sk.robotEnv.action("left");
    } 

    function up(){
        Sk.builtin.pyCheckArgs("up", arguments, 0, 0);
        assertThereIsWayTo(curR - 1, curC);
        curR--;
        Sk.robotEnv.action("up");
    } 

    function down(){
        Sk.builtin.pyCheckArgs("down", arguments, 0, 0);
        assertThereIsWayTo(curR + 1, curC);
        curR++;
        Sk.robotEnv.action("down");
    }

    function assertThereIsWayTo(r, c) {
        if (isThereWayTo(r, c)) {
            throw new Sk.builtin.Exception("an attempt to walk through a wall"); 
        }
    }

    function isThereWayTo(r, c) {
        var wallKey = createWallKey({ r: curR, c: curC }, { r: r, c: c });
        return walls[wallKey] === true || r < 0 || r >= height || c < 0 || c >= width;
    }

    function paint() {
        Sk.builtin.pyCheckArgs("paint", arguments, 0, 0);
        var cellKey = createCellKey({ r: curR, c: curC });
        paintedCells[cellKey] = true;
        Sk.robotEnv.action("paint");
    }

    function cellIsPainted() {
        Sk.builtin.pyCheckArgs("cell_is_painted", arguments, 0, 0);
        var cellKey = createCellKey({ r: curR, c: curC });
        return !!paintedCells[cellKey];
    }

    function cellIsUnpainted() {
        Sk.builtin.pyCheckArgs("cell_is_unpainted", arguments, 0, 0);
        var cellKey = createCellKey({ r: curR, c: curC });
        return !paintedCells[cellKey];
    }

    function wallFromRight() {
        Sk.builtin.pyCheckArgs("wall_from_right", arguments, 0, 0);
        return isThereWayTo(curR, curC + 1);
    }

    function wallFromLeft() {
        Sk.builtin.pyCheckArgs("wall_from_left", arguments, 0, 0);
        return isThereWayTo(curR, curC - 1);
    }

    function wallFromUp() {
        Sk.builtin.pyCheckArgs("wall_from_up", arguments, 0, 0);
        return isThereWayTo(curR - 1, curC);
    }

    function wallFromDown() {
        Sk.builtin.pyCheckArgs("wall_from_down", arguments, 0, 0);
        return isThereWayTo(curR + 1, curC);
    }

    function freeFromRight() {
        Sk.builtin.pyCheckArgs("free_from_right", arguments, 0, 0);
        return !isThereWayTo(curR, curC + 1);
    }

    function freeFromLeft() {
        Sk.builtin.pyCheckArgs("free_from_left", arguments, 0, 0);
        return !isThereWayTo(curR, curC - 1);
    }

    function freeFromUp() {
        Sk.builtin.pyCheckArgs("free_from_up", arguments, 0, 0);
        return !isThereWayTo(curR - 1, curC);
    }

    function freeFromDown() {
        Sk.builtin.pyCheckArgs("free_from_down", arguments, 0, 0);
        return !isThereWayTo(curR + 1, curC);
    }

    function resetEnv() {
        Sk.builtin.pyCheckArgs("resetEnv", arguments, 0, 0);

        actionsDone = 0;

        // form walls
        walls = {};
        if (Sk.robotEnv.walls) {
            for (var i = 0; i < Sk.robotEnv.walls.length; i++) {
                var cell1 = Sk.robotEnv.walls[i][0];
                var cell2 = Sk.robotEnv.walls[i][1];
                var wallKey1 = createWallKey(cell1, cell2);
                var wallKey2 = createWallKey(cell2, cell1);
                walls[wallKey1] = true;
                walls[wallKey2] = true;
            }
        }

        paintedCells = {};
        if (Sk.robotEnv.paintedCells) {
            for (var j = 0; j < Sk.robotEnv.paintedCells.length; j++) {
                var cell = Sk.robotEnv.paintedCells[j];
                var cellKey = createCellKey(cell);
                paintedCells[cellKey] = true;
            } 
        }

        curR = Sk.robotEnv.startRow;
        curC = Sk.robotEnv.startCol;
        width = Sk.robotEnv.width;
        height = Sk.robotEnv.height;
    }

    function createWallKey(cell1, cell2) {
        return createCellKey(cell1) + ":" + createCellKey(cell2);
    }

    function createCellKey(cell) {
        return cell.r + ":" + cell.c;
    }
};