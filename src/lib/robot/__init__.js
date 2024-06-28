/*
 *  __author__: Viktar Tserashchuk
 *
 *  Implementation of the Python robot module.
 */

var $builtinmodule = function() {
    "use strict";
    
    if (!Sk.robot) {
        throw new Error("Robot. Robot implementation is missing");
    }
    
    const maxSpeed = 10;
    const minSpeed = 0;
    let speed = 7;

    function delay() {
        return new Sk.misceval.promiseToSuspension(new Promise(function(resolve) {
            Sk.setTimeout(function() {
                resolve(Sk.builtin.none.none$);
            }, (maxSpeed - speed) * 35);
        }));
    }

    return {
        speed: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("speed", args.length, 1, 1);
            Sk.builtin.pyCheckType("number", "integer", Sk.builtin.checkInt(args[0]));
            speed = Sk.ffi.remapToJs(args[0]);
            if (speed < minSpeed) speed = minSpeed;
            if (speed > maxSpeed) speed = maxSpeed;
        }),

        
        move_right: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("move_right", args.length, 0, 0);
            Sk.robot.move('right');
            return delay();
        }),
        move_left: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("move_left", args.length, 0, 0);
            Sk.robot.move('left');
            return delay();
        }),
        move_up: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("move_up", args.length, 0, 0);
            Sk.robot.move('up');
            return delay();
        }),
        move_down: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("move_down", args.length, 0, 0);
            Sk.robot.move('down');
            return delay();
        }),
        
        
        paint: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("paint", args.length, 0, 0);
            Sk.robot.paint();
            return delay();
        }),
        is_cell_painted: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_cell_painted", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isCellPainted());
        }),


        is_wall_to_right: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_wall_to_right", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isWallFrom('right'));
        }),
        is_wall_to_left: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_wall_to_left", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isWallFrom('left'));
        }),
        is_wall_above: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_wall_above", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isWallFrom('up'));
        }),
        is_wall_below: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_wall_below", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isWallFrom('down'));
        }),
        
        
        is_open_to_right: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_open_to_right", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isFreeFrom('right'));
        }),
        is_open_to_left: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_open_to_left", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isFreeFrom('left'));
        }),
        is_open_above: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_open_above", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isFreeFrom('up'));
        }),
        is_open_below: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_open_below", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isFreeFrom('down'));
        }),


        pollution_level: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("pollution_level", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.getPollutionLevel());
        }),


        print_number: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("print_number", args.length, 1, 1);
            Sk.builtin.pyCheckType("number", "integer", Sk.builtin.checkInt(args[0]));
            Sk.robot.printNumber(Sk.ffi.remapToJs(args[0]));
            return delay();
        }),
    };
};