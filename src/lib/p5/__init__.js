function $builtinmodule() {
    let pInstance = null;

    // setup a p5 object on Sk if not already there
    Sk.p5 || (Sk.p5 = {});

    if (!Sk.p5.node) {
        throw new Error(`Cannot use p5 in current environment.`);
    }
    
    Sk.p5.kill = () => pInstance?.remove();
    
    const mod = {
        __name__: new Sk.builtin.str("p5"),
        __doc__: new Sk.builtin.str("A skulpt implementation of the p5 library"),
    };
    
    
    // fill module based on p5 prototype
    // reference to p5 functions are resolved at moment of calling because p5 monkey patches them for preload
    for (let i in window.p5.prototype) {
        if (i.startsWith("_")) continue;

        const isFunction = typeof window.p5.prototype[i] === "function";
        
        let asStr = new Sk.builtin.str(i);
        let mangled = asStr.$mangled;
        // it would be crazy to override builtins like print
        if (mangled in Sk.builtins) {
            // add prefixes for function so that it's still possible to use them 
            if (isFunction) {
                asStr = new Sk.builtin.str("p5_" + i);
                mangled = asStr.$mangled;
            } else {
                continue;
            }
        }

        mod[mangled]  = isFunction 
            ? funcToPy(() => pInstance[i])
            : Sk.ffi.remapToPy(window.p5.prototype[i]);
    }
    
    const wrapP5EventHandler = (func) => (...args) => {
        try {
            // need to pass exact number of arguments that the wrapped function requires
            const mappedArgs = sliceOrAddArguments(args, func.co_argcount);
            // to reset starting point for execLimit on every event handler call
            // e.g. draw() can be called a lot of times but every call should not take more than execLimit
            Sk.execStart = new Date();
            return Sk.ffi.remapToJs(Sk.misceval.callsimArray(func, mappedArgs));
        } catch (e) {
            Sk.uncaughtException && Sk.uncaughtException(e);
        }
        // note we can't suspend because promises are just ignored in these methods
    };
    
    function throwIfNoP5Reference() {
        if (!pInstance) throw new Error("p5 functions can be used only inside event handlers (setup, draw, ...).");
    }
    
    function processUnhandledHook(fn) {
        // for a python function passed as a callback for another function
        if (fn && fn.tp$call) {
            return wrapP5EventHandler(fn);
        }
    }
    
    function remapToJsAndCall(actionGetter, args) {
        throwIfNoP5Reference();
        const jsArgs = args.map(a => Sk.ffi.remapToJs(a, { unhandledHook: processUnhandledHook }));
        return Sk.ffi.remapToPy(actionGetter().apply(pInstance, jsArgs));
    }

    function funcToPy(actionGetter) {
        return new Sk.builtin.func((...args) => remapToJsAndCall(actionGetter, args))
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

        return res.map(a => Sk.ffi.remapToPy(a));
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
            const method = Sk.globals[methodName];
            if (method !== undefined) {
                p[methodName] = wrapP5EventHandler(method);
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

        pInstance = new p5(sketch, Sk.p5.node);

        delete window.p5.prototype._start;
        pInstance._start = _start;

        window.p5._report = function(message, method, color) {
            throw new Error(message.replace(/\[.*?] /, ""));
        }

        Sk.p5.instance = pInstance;

        // p5 wants to change the global namespace of things like frameCount, key. So let it
        const _setProperty = pInstance._setProperty;
        pInstance._setProperty = function (prop, val) {
            _setProperty.call(this, prop, val);
            if (!prop.startsWith("_")) {
                const asStr = new Sk.builtin.str(prop);
                const mangled = asStr.$mangled;
                mod[mangled] = main[mangled] = Sk.ffi.remapToPy(val);
            } 
        };

        pInstance._start();
    });

    return mod;
}