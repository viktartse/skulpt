/*
 * Teaching subset of MicroPython microbit module for StepInDev.
 * Backend is injected via Sk.configure({ microbit: ... }).
 */

var $builtinmodule = function () {
    "use strict";

    if (!Sk.microbit) {
        throw new Error("Microbit. Microbit implementation is missing");
    }

    const mb = Sk.microbit;

    const {
        int_: pyInt,
        str: pyStr,
        none: { none$: pyNone },
        TypeError: pyTypeError,
        ValueError: pyValueError,
        func: pyFunc,
        checkInt,
        checkString,
        checkNone,
    } = Sk.builtin;

    const { buildNativeClass, copyKeywordsToNamedArgs } = Sk.abstr;
    const { remapToJs, remapToPy } = Sk.ffi;

    function asInt(value, name) {
        if (!checkInt(value)) {
            throw new pyTypeError(name + " must be an integer");
        }
        return remapToJs(value) | 0;
    }

    function asNonNegInt(value, name) {
        const n = asInt(value, name);
        if (n < 0) {
            throw new pyValueError(name + " cannot be negative");
        }
        return n;
    }

    function parseImagePattern(pattern) {
        if (typeof pattern !== "string") {
            throw new pyTypeError("Image pattern must be a string");
        }
        const rows = pattern.split(":");
        if (rows.length !== 5) {
            throw new pyValueError("Image must have 5 rows separated by ':'");
        }
        const matrix = [];
        for (let r = 0; r < 5; r++) {
            const row = rows[r];
            if (row.length !== 5) {
                throw new pyValueError("Each Image row must have 5 characters");
            }
            const out = [];
            for (let c = 0; c < 5; c++) {
                const ch = row.charAt(c);
                if (ch < "0" || ch > "9") {
                    throw new pyValueError("Image brightness must be a digit 0-9");
                }
                out.push(ch.charCodeAt(0) - 48);
            }
            matrix.push(out);
        }
        return matrix;
    }

    function matrixToPattern(matrix) {
        return matrix.map((row) => row.join("")).join(":");
    }

    const Image = buildNativeClass("microbit.Image", {
        constructor: function Image(matrix) {
            this.matrix = matrix;
        },
        slots: {
            tp$new(args, kwargs) {
                const [pattern] = copyKeywordsToNamedArgs("Image", [null], args, kwargs, []);
                if (pattern === undefined || checkNone(pattern)) {
                    return new Image([
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                    ]);
                }
                if (pattern instanceof Image) {
                    return new Image(pattern.matrix.map((row) => row.slice()));
                }
                if (!checkString(pattern)) {
                    throw new pyTypeError("Image() argument must be a string or Image");
                }
                return new Image(parseImagePattern(remapToJs(pattern)));
            },
            tp$str() {
                return new pyStr(matrixToPattern(this.matrix));
            },
            tp$repr() {
                return new pyStr("Image('" + matrixToPattern(this.matrix) + "')");
            },
        },
        methods: {
            get_pixel: {
                $meth(x, y) {
                    const xi = asInt(x, "x");
                    const yi = asInt(y, "y");
                    if (xi < 0 || xi > 4 || yi < 0 || yi > 4) {
                        throw new pyValueError("x and y must be in range 0..4");
                    }
                    return new pyInt(this.matrix[yi][xi]);
                },
                $flags: { MinArgs: 2, MaxArgs: 2 },
            },
            set_pixel: {
                $meth(x, y, value) {
                    const xi = asInt(x, "x");
                    const yi = asInt(y, "y");
                    const v = asInt(value, "value");
                    if (xi < 0 || xi > 4 || yi < 0 || yi > 4) {
                        throw new pyValueError("x and y must be in range 0..4");
                    }
                    if (v < 0 || v > 9) {
                        throw new pyValueError("brightness must be in range 0..9");
                    }
                    this.matrix[yi][xi] = v;
                    return pyNone;
                },
                $flags: { MinArgs: 3, MaxArgs: 3 },
            },
        },
    });

    Image.prototype.HEART = new Image(parseImagePattern("09090:99999:99999:09990:00900"));
    Image.prototype.HEART_SMALL = new Image(parseImagePattern("00000:09090:09990:00900:00000"));
    Image.prototype.HAPPY = new Image(parseImagePattern("00000:09090:00000:90009:09990"));
    Image.prototype.SAD = new Image(parseImagePattern("00000:09090:00000:09990:90009"));
    Image.prototype.YES = new Image(parseImagePattern("00000:00009:00090:90900:09000"));
    Image.prototype.NO = new Image(parseImagePattern("90009:09090:00900:09090:90009"));

    function maybeSuspend(result) {
        if (result && typeof result.then === "function") {
            return new Sk.misceval.promiseToSuspension(result.then(() => pyNone));
        }
        return pyNone;
    }

    const Display = buildNativeClass("microbit.Display", {
        constructor: function Display() {},
        methods: {
            show: {
                $meth(value, delay) {
                    const delayMs = asNonNegInt(delay, "delay");
                    if (value instanceof Image) {
                        return maybeSuspend(mb.show(value.matrix.map((row) => row.slice())));
                    }
                    if (checkString(value) || checkInt(value)) {
                        return maybeSuspend(mb.showText(String(remapToJs(value)), delayMs));
                    }
                    throw new pyTypeError("expected Image, string or integer");
                },
                $flags: { NamedArgs: ["value", "delay"], Defaults: [new pyInt(400)] },
            },
            set_pixel: {
                $meth(x, y, value) {
                    const xi = asInt(x, "x");
                    const yi = asInt(y, "y");
                    const v = asInt(value, "value");
                    mb.setPixel(xi, yi, v);
                    return pyNone;
                },
                $flags: { MinArgs: 3, MaxArgs: 3 },
            },
            get_pixel: {
                $meth(x, y) {
                    const xi = asInt(x, "x");
                    const yi = asInt(y, "y");
                    return new pyInt(mb.getPixel(xi, yi));
                },
                $flags: { MinArgs: 2, MaxArgs: 2 },
            },
            clear: {
                $meth() {
                    mb.clear();
                    return pyNone;
                },
                $flags: { MinArgs: 0, MaxArgs: 0 },
            },
        },
    });

    const Button = buildNativeClass("microbit.Button", {
        constructor: function Button(name) {
            this.name = name;
        },
        methods: {
            is_pressed: {
                $meth() {
                    return remapToPy(mb.isPressed(this.name));
                },
                $flags: { MinArgs: 0, MaxArgs: 0 },
            },
            was_pressed: {
                $meth() {
                    return remapToPy(mb.wasPressed(this.name));
                },
                $flags: { MinArgs: 0, MaxArgs: 0 },
            },
            get_presses: {
                $meth() {
                    return new pyInt(mb.getPresses(this.name));
                },
                $flags: { MinArgs: 0, MaxArgs: 0 },
            },
        },
    });

    const module = {
        __name__: new pyStr("microbit"),
        Image: Image,
        display: new Display(),
        button_a: new Button("A"),
        button_b: new Button("B"),
        sleep: new pyFunc(function (ms) {
            Sk.builtin.pyCheckArgsLen("sleep", arguments.length, 1, 1);
            const n = asNonNegInt(ms, "ms");
            return maybeSuspend(mb.sleep(n));
        }),
        running_time: new pyFunc(function () {
            Sk.builtin.pyCheckArgsLen("running_time", arguments.length, 0, 0);
            return new pyInt(mb.runningTime());
        }),
    };

    if (mb.getLastCall) {
        module.last_call = new pyFunc(function () {
            return remapToPy(mb.getLastCall());
        });
    }

    return module;
};
