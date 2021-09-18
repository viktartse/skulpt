/*
 *  __author__: Viktar Tserashchuk
 *
 *  Implementation of the Python robot module.
 */

var $builtinmodule = function() {
    "use strict";

    return {
        move_robot: new Sk.builtin.func(checkAndRun(Sk.robot.move)),
        paint: new Sk.builtin.func(checkAndRun(Sk.robot.paint)),
        is_wall_from: new Sk.builtin.func(checkAndRun(Sk.robot.isWallFrom)),
        is_free_from: new Sk.builtin.func(checkAndRun(Sk.robot.isFreeFrom)),
        is_cell_painted: new Sk.builtin.func(checkAndRun(Sk.robot.isCellPainted)),
    };

    function checkAndRun(method){
        return function() {
            if (!Sk.robot) {
                throw "Robot. Robot implementation is missing";
            }
            let jsArgs = [...arguments].map(a => Sk.ffi.remapToJs(a));
            return Sk.ffi.remapToPy(method.apply(Sk.robot, jsArgs));
        };
    }
};