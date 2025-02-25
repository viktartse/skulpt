/*
 *  __author__: Viktar Tserashchuk
 *
 *  Implementation of the Python p5 module.
 */

var $builtinmodule = function() {
    "use strict";

    let p5ref = null;

    // Content will be later. Reference need in "run" now
    const module = {};
    
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
        checkConstants(module, p5ref);
    }

    function toJs(v) {
        return Sk.ffi.remapToJs(v);
    }
    function checkConstants(module, p5)
    {
        const eps = 0.00001;
        assert(Math.abs(p5.PI - toJs(module.PI)) < eps, true);
        assert(Math.abs(p5.QUARTER_PI - toJs(module.QUARTER_PI)) < eps, true);
        assert(Math.abs(p5.TWO_PI - toJs(module.TWO_PI)) < eps, true);

        assert(p5.WEBGL, toJs(module.WEBGL));

        assert(p5.LABEL, toJs(module.LABEL));
        assert(p5.FALLBACK, toJs(module.FALLBACK));

        assert(p5.OPEN, toJs(module.OPEN));
        assert(p5.PIE, toJs(module.PIE));
        assert(p5.CHORD, toJs(module.CHORD));

        assert(p5.CENTER, toJs(module.CENTER));
        assert(p5.RADIUS, toJs(module.RADIUS));
        assert(p5.CORNER, toJs(module.CORNER));
        assert(p5.CORNERS, toJs(module.CORNERS));

        assert(p5.ROUND, toJs(module.ROUND));
        assert(p5.SQUARE, toJs(module.SQUARE));
        assert(p5.PROJECT, toJs(module.PROJECT));

        assert(p5.MITER, toJs(module.MITER));
        assert(p5.BEVEL, toJs(module.BEVEL));

        assert(p5.POINTS, toJs(module.POINTS));
        assert(p5.LINES, toJs(module.LINES));
        assert(p5.TRIANGLES, toJs(module.TRIANGLES));
        assert(p5.TRIANGLE_FAN, toJs(module.TRIANGLE_FAN));
        assert(p5.TRIANGLE_STRIP, toJs(module.TRIANGLE_STRIP));
        assert(p5.QUADS, toJs(module.QUADS));
        assert(p5.QUAD_STRIP, toJs(module.QUAD_STRIP));
        assert(p5.TESS, toJs(module.TESS));

        assert(p5.CLOSE, toJs(module.CLOSE));
    }
    
    function assert(expected, actual) {
        if (actual !== expected) 
            throw Error(`Expected '${expected} of type '${typeof expected}' but found '${actual}' of type '${typeof actual}'`);
    }
    
    function getFrameCount() {
        throwIfNoP5Reference();
        return Sk.ffi.remapToPy(p5ref.frameCount);
    }

    function throwIfNoP5Reference() {
        if (!p5ref) throw new Error("NoP5RefCreated");
    }

    function remapToJsAndCall(actionGetter, args) {
        throwIfNoP5Reference();

        const jsArgs = args.map(a => Sk.ffi.remapToJs(a));
        actionGetter().apply(p5ref, jsArgs);
    }
    
    function funcToPy(actionGetter) {
        return new Sk.builtin.func((...args) => remapToJsAndCall(actionGetter, args))
    }
    
    const moduleContent =  {
        __name__: new Sk.builtin.str("p5"),

        run: new Sk.builtin.func(run),

        create_canvas: funcToPy(() => p5ref.createCanvas),

        arc: funcToPy(() => p5ref.arc),
        circle: funcToPy(() => p5ref.circle),
        ellipse: funcToPy(() => p5ref.ellipse),
        line: funcToPy(() => p5ref.line),
        point: funcToPy(() => p5ref.point),
        quad: funcToPy(() => p5ref.quad),
        rect: funcToPy(() => p5ref.rect),
        square: funcToPy(() => p5ref.square),
        triangle: funcToPy(() => p5ref.triangle),

        ellipse_mode: funcToPy(() => p5ref.ellipseMode),
        no_smooth: funcToPy(() => p5ref.noSmooth),
        rect_mode: funcToPy(() => p5ref.rectMode),
        smooth: funcToPy(() => p5ref.smooth),
        stroke_cap: funcToPy(() => p5ref.strokeCap),
        stroke_join: funcToPy(() => p5ref.strokeJoin),
        stroke_weight: funcToPy(() => p5ref.strokeWeight),

        background: funcToPy(() => p5ref.background),
        stroke: funcToPy(() => p5ref.stroke),
        fill: funcToPy(() => p5ref.fill),
        no_stroke: funcToPy(() => p5ref.noStroke),
        no_fill: funcToPy(() => p5ref.noFill),
        
        begin_shape: funcToPy(() => p5ref.beginShape),
        end_shape: funcToPy(() => p5ref.endShape),
        vertex: funcToPy(() => p5ref.vertex),

        describe: funcToPy(() => p5ref.describe),

        frame_count: new Sk.builtin.func(getFrameCount),

        PI: new Sk.builtin.float_(Math.PI),
        QUARTER_PI: new Sk.builtin.float_(Math.PI / 4),
        TWO_PI: new Sk.builtin.float_(Math.PI * 2),

        WEBGL: new Sk.builtin.str("webgl"),

        LABEL: new Sk.builtin.str("label"),
        FALLBACK: new Sk.builtin.str("fallback"),

        OPEN: new Sk.builtin.str("open"),
        PIE: new Sk.builtin.str("pie"),
        CHORD: new Sk.builtin.str("chord"),

        CENTER: new Sk.builtin.str("center"),
        RADIUS: new Sk.builtin.str("radius"),
        CORNER: new Sk.builtin.str("corner"),
        CORNERS: new Sk.builtin.str("corners"),

        ROUND: new Sk.builtin.str("round"),
        SQUARE: new Sk.builtin.str("butt"),
        PROJECT: new Sk.builtin.str("square"),

        MITER: new Sk.builtin.str("miter"),
        BEVEL: new Sk.builtin.str("bevel"),

        POINTS: new Sk.builtin.int_(0),
        LINES: new Sk.builtin.int_(1),
        TRIANGLES: new Sk.builtin.int_(4),
        TRIANGLE_FAN: new Sk.builtin.int_(6),
        TRIANGLE_STRIP: new Sk.builtin.int_(5),
        QUADS: new Sk.builtin.str("quads"),
        QUAD_STRIP: new Sk.builtin.str("quad_strip"),
        TESS: new Sk.builtin.str("tess"),

        CLOSE: new Sk.builtin.str("close"),
    };

    Object.assign(module, moduleContent);

    return module;
};