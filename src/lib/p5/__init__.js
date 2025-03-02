function $builtinmodule() {
    let pInstance = null;

    // setup a p5 object on Sk if not already there
    Sk.p5 || (Sk.p5 = {});

    Sk.p5.kill = () => pInstance?.remove();
    
    const mod = {
        __name__: new Sk.builtin.str("p5"),
        __doc__: new Sk.builtin.str("A skulpt implementation of the p5 library"),
    };
    
    
    // fill module based on p5 prototype
    // reference to p5 functions are resolved at moment of calling because p5 monkey patches them for preload
    for (let i in window.p5.prototype) {
        if (i.startsWith("_")) continue;

        let pName = isSnakeCaseRequired(i) ? toSnakeCase(i) : i;
        const asStr = new Sk.builtin.str(pName);
        const mangled = asStr.$mangled;
        // it would be crazy to override builtins like print
        if (mangled in Sk.builtins) continue;

        mod[mangled]  = (typeof window.p5.prototype[i] === "function") 
            ? funcToPy(() => pInstance[i])
            : Sk.ffi.remapToPy(window.p5.prototype[i]);
    }
    
    const wrapFunc = (func) => (...args) => {
        try {
            // need to pass exact number of arguments that the wrapped function requires
            const mappedArgs = sliceOrAddArguments(args, func.co_argcount);
            Sk.misceval.callsimArray(func, mappedArgs);
        } catch (e) {
            Sk.uncaughtException && Sk.uncaughtException(e);
        }
        // note we can't suspend because promises are just ignored in these methods
    };
    
    function isSnakeCaseRequired(name) {
        const firstChar = name.charAt(0);
        // if first char is not capital 
        return firstChar.toUpperCase() !== firstChar;
    }
    
    function throwIfNoP5Reference() {
        if (!pInstance) throw new Error("NoP5RefCreated");
    }
    
    function processUnhandledHook(fn) {
        // for a python function passed as a callback for another function
        if (fn && fn.tp$call) {
            return function (...args) {
                return Sk.misceval.callsimArray(fn, sliceOrAddArguments(args, fn.co_argcount))
            };
        }
    }
    
    function remapToJsAndCall(actionGetter, args) {
        throwIfNoP5Reference();
        const jsArgs = args.map(a => unwrapPyNameWrapper(Sk.ffi.remapToJs(a, { unhandledHook: processUnhandledHook })));
        return Sk.ffi.remapToPy(toPyNameWrapper(actionGetter().apply(pInstance, jsArgs)));
    }

    function funcToPy(actionGetter) {
        return new Sk.builtin.func((...args) => remapToJsAndCall(actionGetter, args))
    }

    function toPyNameWrapper(value) {
        if (typeof value !== 'object' || value === null || Object.getPrototypeOf(value) === Object.prototype) {
            return value;
        }
        
        console.log("wrapping", value);

        // Use a prototype. Otherwise, it will be translated to python object as dictionary 
        const wrapper = Object.create({});
        wrapper.$wrappedValue = value;
        // used by skulpt to display object type in error messages
        wrapper[Symbol.toStringTag] = value.constructor && value.constructor.name;

        const valuePrototype = Object.getPrototypeOf(value);
        const allKeys = new Set([
            ...Object.getOwnPropertyNames(value),
            // get methods from the value prototype if it has one different from Object prototype
            // just one level of prototypes should be enough
            ...(valuePrototype && valuePrototype !== Object.prototype ? Object.getOwnPropertyNames(valuePrototype) : [])
        ]);

        for (const key of allKeys) {
            // don't want to proxy constructor and private properties
            if (key === "constructor" || key.startsWith("_") || !isSnakeCaseRequired(key)) continue;

            const snakeKey = toSnakeCase(key);
            const propValue = value[key];

            if (typeof propValue === "function") {
                wrapper[snakeKey] = (...args) => toPyNameWrapper(propValue.apply(value, args));
            } else {
                Object.defineProperty(wrapper, snakeKey, {
                    get: () => value[key],
                    set: (newValue) => {
                        value[key] = newValue;
                    },
                    enumerable: true,
                });
            }
        }

        return wrapper;
    }

    function unwrapPyNameWrapper(wrapper) {
        return wrapper && wrapper.$wrappedValue ? wrapper.$wrappedValue : wrapper;
    }

    function toSnakeCase(str) {
        return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
    }
    
    const sliceOrAddArguments = (args, requiredSize) => {
        let res = [...args];

        if (res.length > requiredSize)
            res = res.slice(0, requiredSize);

        if (res.length < requiredSize) {
            for (let i = 0; i < requiredSize - res.length; i++) {
                res.push(null);
            }
        }

        return res.map(a => Sk.ffi.remapToPy(toPyNameWrapper(a)));
    }

    const sketch = p => {
        [
            "preload",
            "setup",
            "draw",
            "deviceMoved",
            "deviceTurned",
            "deviceShaken",
            "windowResized",
            "keyPressed",
            "keyReleased",
            "keyTyped",
            "mousePressed",
            "mouseReleased",
            "mouseClicked",
            "doubleClicked",
            "mouseMoved",
            "mouseDragged",
            "mouseWheel",
            "touchStarted",
            "touchMoved",
            "touchEnded",
        ].forEach((methodName) => {
            const snakeName = toSnakeCase(methodName);
            const method = Sk.globals[snakeName];
            if (method !== undefined) {
                p[methodName] = wrapFunc(method);
            }
        });
    };

    mod.run = new Sk.builtin.func(function run() {
        const main = Sk.sysmodules.quick$lookup(new Sk.builtin.str("__main__")).$d;
        
        const runName = "run";
        const isImportedInGlobalNamespace = main[runName] && main[runName] === mod[runName];
        if (!isImportedInGlobalNamespace) {
            throw new Error("Only 'from p5 import *' supported.")
        }

        // override _start to a plain function and call this in run when we need it
        // this is kind of hacky
        // _start is set in the constructor and then called
        // by overriding the prototype means we can delay the call to _start
        // which p5 does on initialization to get the methods in the namespace
        let _start;
        Object.defineProperty(window.p5.prototype, "_start", {
            get() {
                return () => {};
            },
            set(val) {
                _start = val;
            },
            configurable: true,
        });

        pInstance = new p5(sketch, Sk.p5.node || Sk.canvas);

        delete window.p5.prototype._start;
        pInstance._start = _start;
        
        Sk.p5.instance = pInstance;

        // p5 wants to change the global namespace of things like frameCount, key. So let it
        const _setProperty = pInstance._setProperty;
        pInstance._setProperty = function (prop, val) {
            _setProperty.call(this, prop, val);
            if (!prop.startsWith("_")) {
                const pName = isSnakeCaseRequired(prop) ? toSnakeCase(prop) : prop;
                const asStr = new Sk.builtin.str(pName);
                const mangled = asStr.$mangled;
                mod[mangled] = main[mangled] = Sk.ffi.remapToPy(val);
            } 
        };

        pInstance._start();
    });

    return mod;
}