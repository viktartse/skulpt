/*
 *  __author__: Viktar Tserashchuk
 *
 *  Implementation of the Python p5 module.
 */

var $builtinmodule = function() {
    "use strict";

    // create p5 reference
    const sketch = p => {
        p.setup = () => {
            const setupFunction = Sk.globals["setup"];
            if (setupFunction) Sk.misceval.callsimArray(setupFunction);
        }

        p.draw = () => {
            const drawFunction = Sk.globals["draw"];
            if (drawFunction) Sk.misceval.callsimArray(drawFunction)
        }

        p.windowResized = (...args) => {
            const windowResized = Sk.globals["windowResized"];
            if (windowResized) {
                Sk.misceval.callsimArray(windowResized, sliceOrAdd(args, windowResized.co_argcount))
            }
        }
    };
    
    const p5ref = new p5(sketch);
    
    function sliceOrAdd(args, requiredSize) {
        if (args.length > requiredSize)
            args = args.slice(0, requiredSize);

        if (args.length < requiredSize) {
            for (let i = 0; i < requiredSize - args.length; i++) {
                args.push(null);
            }
        }

        return args.map(a => Sk.ffi.remapToPy(a));
    }
    
    function toJs(v) {
        return Sk.ffi.remapToJs(v);
    }
    function checkConstants(module, p5)
    {
        const eps = 0.00001;

        assert(p5.HSB, toJs(module.HSB));
        
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

        assert(p5.ARROW, toJs(module.ARROW));
        assert(p5.CROSS, toJs(module.CROSS));
        assert(p5.HAND, toJs(module.HAND));
        assert(p5.MOVE, toJs(module.MOVE));
        assert(p5.TEXT, toJs(module.TEXT));
        assert(p5.WAIT, toJs(module.WAIT));
    }
    
    function assert(expected, actual) {
        if (actual !== expected) 
            throw Error(`Expected '${expected} of type '${typeof expected}' but found '${actual}' of type '${typeof actual}'`);
    }

    function throwIfNoP5Reference() {
        if (!p5ref) throw new Error("NoP5RefCreated");
    }

    function varToPyFunc(varGetter) {
        return new Sk.builtin.func(() => {
            throwIfNoP5Reference();
            return Sk.ffi.remapToPy(varGetter());
        });
    }

    function processUnhandledHook(fn) {
        if (fn && fn.tp$call) {
            return function (...args) {
                Sk.misceval.callsimArray(fn, sliceOrAdd(args, fn.co_argcount))
            };
        }
    }
    
    function remapToJsAndCall(actionGetter, args) {
        throwIfNoP5Reference();
        const jsArgs = args.map(a => Sk.ffi.remapToJs(a, { unhandledHook: processUnhandledHook }));
        return Sk.ffi.remapToPy(actionGetter().apply(p5ref, jsArgs));
    }
    
    function funcToPy(actionGetter) {
        return new Sk.builtin.func((...args) => remapToJsAndCall(actionGetter, args))
    }
    
    const module =  {
        __name__: new Sk.builtin.str("p5"),

        create_canvas: funcToPy(() => p5ref.createCanvas),

        // Shape. 2D Primitives
        arc: funcToPy(() => p5ref.arc),
        circle: funcToPy(() => p5ref.circle),
        ellipse: funcToPy(() => p5ref.ellipse),
        line: funcToPy(() => p5ref.line),
        point: funcToPy(() => p5ref.point),
        quad: funcToPy(() => p5ref.quad),
        rect: funcToPy(() => p5ref.rect),
        square: funcToPy(() => p5ref.square),
        triangle: funcToPy(() => p5ref.triangle),

        // Shape. Attributes
        ellipse_mode: funcToPy(() => p5ref.ellipseMode),
        no_smooth: funcToPy(() => p5ref.noSmooth),
        rect_mode: funcToPy(() => p5ref.rectMode),
        smooth: funcToPy(() => p5ref.smooth),
        stroke_cap: funcToPy(() => p5ref.strokeCap),
        stroke_join: funcToPy(() => p5ref.strokeJoin),
        stroke_weight: funcToPy(() => p5ref.strokeWeight),

        // Shape. Vertex
        begin_contour: funcToPy(() => p5ref.beginContour),
        begin_shape: funcToPy(() => p5ref.beginShape),
        bezier_vertex: funcToPy(() => p5ref.bezierVertex),
        curve_vertex: funcToPy(() => p5ref.curveVertex),
        end_contour: funcToPy(() => p5ref.endContour),
        end_shape: funcToPy(() => p5ref.endShape),
        normal: funcToPy(() => p5ref.normal),
        quadratic_vertex: funcToPy(() => p5ref.quadraticVertex),
        vertex: funcToPy(() => p5ref.vertex),
        
        // Color. Creating & Reading
        alpha: funcToPy(() => p5ref.alpha),
        blue: funcToPy(() => p5ref.blue),
        brightness: funcToPy(() => p5ref.brightness),
        color: funcToPy(() => p5ref.color),
        green: funcToPy(() => p5ref.green),
        hue: funcToPy(() => p5ref.hue),
        lerp_color: funcToPy(() => p5ref.lerpColor),
        lightness: funcToPy(() => p5ref.lightness),
        palette_lerp: funcToPy(() => p5ref.paletteLerp),
        red: funcToPy(() => p5ref.red),
        saturation: funcToPy(() => p5ref.saturation),
        
        // Color. Setting
        background: funcToPy(() => p5ref.background),
        begin_clip: funcToPy(() => p5ref.beginClip),
        clear: funcToPy(() => p5ref.clear),
        clip: funcToPy(() => p5ref.clip),
        color_mode: funcToPy(() => p5ref.colorMode),
        end_clip: funcToPy(() => p5ref.endClip),
        erase: funcToPy(() => p5ref.erase),
        fill: funcToPy(() => p5ref.fill),
        no_erase: funcToPy(() => p5ref.noErase),
        no_fill: funcToPy(() => p5ref.noFill),
        no_stroke: funcToPy(() => p5ref.noStroke),
        stroke: funcToPy(() => p5ref.stroke),

        // Environment
        cursor: funcToPy(() => p5ref.cursor),
        delta_time: varToPyFunc(() => p5ref.deltaTime),
        describe: funcToPy(() => p5ref.describe),
        describe_element: funcToPy(() => p5ref.describeElement),
        display_density: funcToPy(() => p5ref.displayDensity),
        display_height: varToPyFunc(() => p5ref.displayHeight),
        display_width: varToPyFunc(() => p5ref.displayWidth),
        focused: varToPyFunc(() => p5ref.focused),
        frame_count: varToPyFunc(() => p5ref.frameCount),
        frame_rate: funcToPy(() => p5ref.frameRate),
        fullscreen: funcToPy(() => p5ref.fullscreen),
        get_target_frame_rate: funcToPy(() => p5ref.getTargetFrameRate),
        get_url: funcToPy(() => p5ref.getURL),
        get_url_params: funcToPy(() => p5ref.getURLParams),
        get_url_path: funcToPy(() => p5ref.getURLPath),
        grid_output: funcToPy(() => p5ref.gridOutput),
        height: varToPyFunc(() => p5ref.height),
        no_cursor: funcToPy(() => p5ref.noCursor),
        pixel_density: funcToPy(() => p5ref.pixelDensity),
        // print: funcToPy(() => p5ref.print), already have "print" from standard python
        text_output: funcToPy(() => p5ref.textOutput),
        webgl_version: varToPyFunc(() => p5ref.webglVersion),
        width: varToPyFunc(() => p5ref.width),
        window_height: varToPyFunc(() => p5ref.windowHeight),
        window_width: varToPyFunc(() => p5ref.windowWidth),
        
        // 3D. Interaction. Not done
        orbit_control: funcToPy(() => p5ref.orbitControl),
        
        // 3D Material. Not done
        normal_material: funcToPy(() => p5ref.normalMaterial),
        
        // Constants. Not done
        HSB: new Sk.builtin.str("hsb"),
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

        ARROW: new Sk.builtin.str("default"),
        CROSS: new Sk.builtin.str("crosshair"),
        HAND: new Sk.builtin.str("pointer"),
        MOVE: new Sk.builtin.str("move"),
        TEXT: new Sk.builtin.str("text"),
        WAIT: new Sk.builtin.str("wait"),
    };

    checkConstants(module, p5ref);

    return module;
};