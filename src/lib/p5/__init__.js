/*
 *  __author__: Viktar Tserashchuk
 *
 *  Implementation of the Python robot module.
 */

var $builtinmodule = function() {
    "use strict";

    let p5ref = null;

    // create p5 reference
    function run() {
        const sketch = p => {
            p.setup = function() {
                const setupFunction = Sk.globals["setup"];
                if (setupFunction) {
                    Sk.misceval.callsimArray(setupFunction)
                }
            };

            p.draw = function() {
                const drawFunction = Sk.globals["draw"];

                if (drawFunction) {
                    Sk.misceval.callsimArray(drawFunction)
                }
            };
        };

        p5ref = new p5(sketch);
    }
    
    function createCanvas(...args) {
        Sk.builtin.pyCheckArgsLen("createCanvas", args.length, 2, 2);
        Sk.builtin.pyCheckType("width", "integer", Sk.builtin.checkInt(args[0]));
        Sk.builtin.pyCheckType("height", "integer", Sk.builtin.checkInt(args[1]));

        remapToJsAndCall(() => p5ref.createCanvas, args);
    }

    function line(...args) {
        Sk.builtin.pyCheckArgsLen("line", args.length, 4, 4);
        Sk.builtin.pyCheckType("x1", "number", Sk.builtin.checkNumber(args[0]));
        Sk.builtin.pyCheckType("y1", "number", Sk.builtin.checkNumber(args[1]));
        Sk.builtin.pyCheckType("x2", "number", Sk.builtin.checkNumber(args[2]));
        Sk.builtin.pyCheckType("y2", "number", Sk.builtin.checkNumber(args[3]));

        remapToJsAndCall(() => p5ref.line, args);
    }

    function background(...args) {
        Sk.builtin.pyCheckArgsLen("background", args.length, 1, 4);
        checkColorParams(args);

        remapToJsAndCall(() => p5ref.background, args);
    }

    function stroke(...args) {
        Sk.builtin.pyCheckArgsLen("stroke", args.length, 1, 4);
        checkColorParams(args);

        remapToJsAndCall(() => p5ref.stroke, args);
    }

    function fill(...args) {
        Sk.builtin.pyCheckArgsLen("fill", args.length, 1, 4);
        checkColorParams(args)

        remapToJsAndCall(() => p5ref.fill, args);
    }

    function checkColorParams(args) {
        if (args.length === 1) {
            Sk.builtin.pyCheckType("value", "number or string", checkStringOrNumber(args[0]));
        }
        else if (args.length === 2) {
            Sk.builtin.pyCheckType("gray", "number", Sk.builtin.checkNumber(args[0]));
            Sk.builtin.pyCheckType("alpha", "number", Sk.builtin.checkNumber(args[1]));
        }
        else if (args.length === 3) {
            Sk.builtin.pyCheckType("v1", "number", Sk.builtin.checkNumber(args[0]));
            Sk.builtin.pyCheckType("v2", "number", Sk.builtin.checkNumber(args[1]));
            Sk.builtin.pyCheckType("v3", "number", Sk.builtin.checkNumber(args[2]));
        }
        else if (args.length === 4) {
            Sk.builtin.pyCheckType("v1", "number", Sk.builtin.checkNumber(args[0]));
            Sk.builtin.pyCheckType("v2", "number", Sk.builtin.checkNumber(args[1]));
            Sk.builtin.pyCheckType("v3", "number", Sk.builtin.checkNumber(args[2]));
            Sk.builtin.pyCheckType("alpha", "number", Sk.builtin.checkNumber(args[3]));
        }
    }
    
    function strokeWeight(...args) {
        Sk.builtin.pyCheckArgsLen("strokeWeight", args.length, 1, 1);
        Sk.builtin.pyCheckType("weight", "number", Sk.builtin.checkNumber(args[0]));
        
        remapToJsAndCall(() => p5ref.strokeWeight, args);
    }

    function circle(...args) {
        Sk.builtin.pyCheckArgsLen("circle", args.length, 3, 3);
        Sk.builtin.pyCheckType("x", "number", Sk.builtin.checkNumber(args[0]));
        Sk.builtin.pyCheckType("y", "number", Sk.builtin.checkNumber(args[1]));
        Sk.builtin.pyCheckType("d", "number", Sk.builtin.checkNumber(args[2]));

        remapToJsAndCall(() => p5ref.circle, args);
    }

    circle.co_varnames = ["x", "y", "d"];

    function describe(...args) {
        Sk.builtin.pyCheckArgsLen("describe", args.length, 1, 2);
        Sk.builtin.pyCheckType("text", "string", Sk.builtin.checkString(args[0]));
        if (args.length === 2) {
            Sk.builtin.pyCheckType("display", "string", Sk.builtin.checkString(args[1]));
        }

        remapToJsAndCall(() => p5ref.describe, args);
    }


    function rect(...args) {
        Sk.builtin.pyCheckArgsLen("rect", args.length, 4, 8);
        Sk.builtin.pyCheckType("x", "number", Sk.builtin.checkNumber(args[0]));
        Sk.builtin.pyCheckType("y", "number", Sk.builtin.checkNumber(args[1]));
        Sk.builtin.pyCheckType("w", "number", Sk.builtin.checkNumber(args[2]));
        Sk.builtin.pyCheckType("h", "number", Sk.builtin.checkNumber(args[3]));
        if (args.length > 4)
            Sk.builtin.pyCheckType("tl", "number", Sk.builtin.checkNumber(args[4]));
        if (args.length > 5)
            Sk.builtin.pyCheckType("tr", "number", Sk.builtin.checkNumber(args[5]));
        if (args.length > 6)
            Sk.builtin.pyCheckType("br", "number", Sk.builtin.checkNumber(args[6]));
        if (args.length > 7)
            Sk.builtin.pyCheckType("bl", "number", Sk.builtin.checkNumber(args[7]));

        remapToJsAndCall(() => p5ref.rect, args);
    }

    function square(...args) {
        Sk.builtin.pyCheckArgsLen("square", args.length, 3, 7);
        Sk.builtin.pyCheckType("x", "number", Sk.builtin.checkNumber(args[0]));
        Sk.builtin.pyCheckType("y", "number", Sk.builtin.checkNumber(args[1]));
        Sk.builtin.pyCheckType("s", "number", Sk.builtin.checkNumber(args[2]));
        if (args.length > 3)
            Sk.builtin.pyCheckType("tl", "number", Sk.builtin.checkNumber(args[2]));
        if (args.length > 4)
            Sk.builtin.pyCheckType("tr", "number", Sk.builtin.checkNumber(args[4]));
        if (args.length > 5)
            Sk.builtin.pyCheckType("br", "number", Sk.builtin.checkNumber(args[5]));
        if (args.length > 6)
            Sk.builtin.pyCheckType("bl", "number", Sk.builtin.checkNumber(args[6]));

        remapToJsAndCall(() => p5ref.square, args);
    }
    

    function triangle(...args) {
        Sk.builtin.pyCheckArgsLen("triangle", args.length, 6, 6);
        Sk.builtin.pyCheckType("x1", "number", Sk.builtin.checkNumber(args[0]));
        Sk.builtin.pyCheckType("y1", "number", Sk.builtin.checkNumber(args[1]));
        Sk.builtin.pyCheckType("x2", "number", Sk.builtin.checkNumber(args[2]));
        Sk.builtin.pyCheckType("y2", "number", Sk.builtin.checkNumber(args[3]));
        Sk.builtin.pyCheckType("x3", "number", Sk.builtin.checkNumber(args[4]));
        Sk.builtin.pyCheckType("y3", "number", Sk.builtin.checkNumber(args[5]));

        remapToJsAndCall(() => p5ref.triangle, args);
    }

    function arc(...args) {
        Sk.builtin.pyCheckArgsLen("arc", args.length, 6, 7);
        Sk.builtin.pyCheckType("x", "number", Sk.builtin.checkNumber(args[0]));
        Sk.builtin.pyCheckType("y", "number", Sk.builtin.checkNumber(args[1]));
        Sk.builtin.pyCheckType("w", "number", Sk.builtin.checkNumber(args[2]));
        Sk.builtin.pyCheckType("h", "number", Sk.builtin.checkNumber(args[3]));
        Sk.builtin.pyCheckType("start", "number", Sk.builtin.checkNumber(args[4]));
        Sk.builtin.pyCheckType("stop", "number", Sk.builtin.checkNumber(args[5]));
        if (args.length > 6)
            Sk.builtin.pyCheckType("mode", "number", Sk.builtin.checkString(args[6]));

        remapToJsAndCall(() => p5ref.arc, args);
    }
    
    function getFrameCount() {
        throwIfNoP5Reference();
        return Sk.ffi.remapToPy(p5ref.frameCount);
    }
    
    function noStroke() {
        remapToJsAndCall(() => p5ref.noStroke, []);
    }

    function checkStringOrNumber(param) {
        return Sk.builtin.checkNumber(param) || Sk.builtin.checkString(param);
    }

    function throwIfNoP5Reference() {
        if (!p5ref) throw new Error("NoP5RefCreated");
    }
    
    function remapToJsAndCall(actionGetter, args) {
        throwIfNoP5Reference();

        const jsArgs = args.map(a => Sk.ffi.remapToJs(a));
        actionGetter().apply(p5ref, jsArgs);
    }
    
    const module =  {
        __name__: new Sk.builtin.str("p5"),

        run: new Sk.builtin.func(run),
        create_canvas: new Sk.builtin.func(createCanvas),
        line: new Sk.builtin.func(line),
        background: new Sk.builtin.func(background),
        stroke: new Sk.builtin.func(stroke),
        stroke_weight: new Sk.builtin.func(strokeWeight),
        circle: new Sk.builtin.func(circle),
        LABEL: new Sk.builtin.str("label"),
        FALLBACK: new Sk.builtin.str("fallback"),
        describe: new Sk.builtin.func(describe),
        rect: new Sk.builtin.func(rect),
        triangle: new Sk.builtin.func(triangle),
        square: new Sk.builtin.func(square),
        arc: new Sk.builtin.func(arc),
        OPEN: new Sk.builtin.str("open"),
        PIE: new Sk.builtin.str("pie"),
        CHORD: new Sk.builtin.str("chord"),
        PI: new Sk.builtin.float_(Math.PI),
        QUARTER_PI: new Sk.builtin.float_(Math.PI / 4),
        TWO_PI: new Sk.builtin.float_(Math.PI * 2),
        WEBGL: new Sk.builtin.str("webgl"),
        frame_count: new Sk.builtin.func(getFrameCount),
        fill: new Sk.builtin.func(fill),
        no_stroke: new Sk.builtin.func(noStroke),
    };

    return module;
};