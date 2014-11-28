/*
 *  __author__: Viktar Tserashchuk
 *
 *  Implementation of the Python robot module.
 */

var $builtinmodule = function () {
    "use strict";

    var curR, curC, walls, width, height, actionsDone;
    
    resetEnv();

    return {
        right: new Sk.builtin.func(doActionAndCheckLimits(right)),
        left: new Sk.builtin.func(doActionAndCheckLimits(left)),
        up: new Sk.builtin.func(doActionAndCheckLimits(up)),
        down: new Sk.builtin.func(doActionAndCheckLimits(down)),
        paint: new Sk.builtin.func(doActionAndCheckLimits(paint)),
    };

    function doActionAndCheckLimits(action) {
        return function() {
            action();
            actionsDone++;
            if (Sk.robotActionsLimit && Sk.robotActionsLimit < actionsDone) {
                throw new Sk.builtin.Exception("Robot has done too many actions and crashed.");
            }
        };
    }

    function right() {
        Sk.builtin.pyCheckArgs("right", arguments, 0, 0);
        AssertThereIsWayTo(curR, curC + 1);
        curC++;
        Sk.robotEnv.action("right");
    }
    
    function left(){
        Sk.builtin.pyCheckArgs("left", arguments, 0, 0);
        AssertThereIsWayTo(curR, curC - 1);
        curC--;
        Sk.robotEnv.action("left");
    } 

    function up(){
        Sk.builtin.pyCheckArgs("up", arguments, 0, 0);
        AssertThereIsWayTo(curR - 1, curC);
        curR--;
        Sk.robotEnv.action("up");
    } 

    function down(){
        Sk.builtin.pyCheckArgs("down", arguments, 0, 0);
        AssertThereIsWayTo(curR + 1, curC);
        curR++;
        Sk.robotEnv.action("down");
    }

    function AssertThereIsWayTo(r, c) {
        var wallKey = createWallKey({r: curR, c: curC}, {r: r, c: c});
        if (walls[wallKey] === true || r < 0 || r >= height || c < 0 || c >= width) {
            throw new Sk.builtin.Exception("an attempt to walk through a wall"); 
        }
    }

    function paint() {
        Sk.builtin.pyCheckArgs("paint", arguments, 0, 0);
        Sk.robotEnv.action("paint");
    }

    function resetEnv() {
        Sk.builtin.pyCheckArgs("resetEnv", arguments, 0, 0);

        actionsDone = 0;

        // form walls
        walls = {};
        for (var i = 0; i < Sk.robotEnv.walls.length; i++) {
            var cell1 = Sk.robotEnv.walls[i][0];
            var cell2 = Sk.robotEnv.walls[i][1];
            var wallKey1 = createWallKey(cell1, cell2);
            var wallKey2 = createWallKey(cell2, cell1);
            walls[wallKey1] = true;
            walls[wallKey2] = true;
        }

        curR = Sk.robotEnv.startRow;
        curC = Sk.robotEnv.startCol;
        width = Sk.robotEnv.width;
        height = Sk.robotEnv.height;
    }

    function createWallKey(cell1, cell2) {
        return cell1.r + ":" + cell1.c + ":" + cell2.r + ":" + cell2.c;
    }
};