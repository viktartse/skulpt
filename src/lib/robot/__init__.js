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

    const module =  {
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
        is_cell_not_painted: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_cell_not_painted", args.length, 0, 0);
            return Sk.ffi.remapToPy(!Sk.robot.isCellPainted());
        }),


        is_wall_right: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_wall_right", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isWallFrom('right'));
        }),
        is_wall_left: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_wall_left", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isWallFrom('left'));
        }),
        is_wall_up: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_wall_up", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isWallFrom('up'));
        }),
        is_wall_down: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_wall_down", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isWallFrom('down'));
        }),
        
        
        is_free_right: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_free_right", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isFreeFrom('right'));
        }),
        is_free_left: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_free_left", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isFreeFrom('left'));
        }),
        is_free_up: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_free_up", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isFreeFrom('up'));
        }),
        is_free_down: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("is_free_down", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.isFreeFrom('down'));
        }),


        pollution: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("pollution", args.length, 0, 0);
            return Sk.ffi.remapToPy(Sk.robot.getPollutionLevel());
        }),


        print_number: new Sk.builtin.func((...args) => {
            Sk.builtin.pyCheckArgsLen("print_number", args.length, 1, 1);
            Sk.builtin.pyCheckType("number", "integer", Sk.builtin.checkInt(args[0]));
            Sk.robot.printNumber(Sk.ffi.remapToJs(args[0]));
            return delay();
        }),
    };
    
    // add synonyms
    module.mr = module.move_right;
    module.ml = module.move_left;
    module.mu = module.move_up;
    module.md = module.move_down;
    
    module.iscp = module.is_cell_painted;
    module.iscnp = module.is_cell_not_painted;

    module.iswr = module.is_wall_right;
    module.iswl = module.is_wall_left;
    module.iswu = module.is_wall_up;
    module.iswd = module.is_wall_down;

    module.isfr = module.is_free_right;
    module.isfl = module.is_free_left;
    module.isfu = module.is_free_up;
    module.isfd = module.is_free_down;

    module.pol = module.pollution;
    module.printn = module.print_number;
    
    // it needs if we run tests to find out what method was called on the robot implementation
    if (Sk.robot.getLastCall) {
        module.last_call = () => {return Sk.ffi.remapToPy(Sk.robot.getLastCall())};
    }
    
    return module;
};