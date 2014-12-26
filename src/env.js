/**
 * Base namespace for Skulpt. This is the only symbol that Skulpt adds to the
 * global namespace. Other user accessible symbols are noted and described
 * below.
 */

var Sk = Sk || {}; //jshint ignore:line

/**
 *
 * Set various customizable parts of Skulpt.
 *
 * output: Replacable output redirection (called from print, etc.).
 * read: Replacable function to load modules with (called via import, etc.)
 * sysargv: Setable to emulate arguments to the script. Should be an array of JS
 * strings.
 * syspath: Setable to emulate PYTHONPATH environment variable (for finding
 * modules). Should be an array of JS strings.
 *
 * Any variables that aren't set will be left alone.
 */
Sk.configure = function (options) {
    "use strict";
    
    Sk.robotEnv = options["robotEnv"] || Sk.fillEnv({});
    Sk.checkEnv(Sk.robotEnv);

    Sk.robotActionsLimit = options["robotActionsLimit"] || 200;
    goog.asserts.assert(typeof Sk.robotActionsLimit === "number");

    Sk.output = options["output"] || Sk.output;
    goog.asserts.assert(typeof Sk.output === "function");

    Sk.debugout = options["debugout"] || Sk.debugout;
    goog.asserts.assert(typeof Sk.debugout === "function");

    Sk.read = options["read"] || Sk.read;
    goog.asserts.assert(typeof Sk.read === "function");

    Sk.timeoutMsg = options["timeoutMsg"] || Sk.timeoutMsg;
    goog.asserts.assert(typeof Sk.timeoutMsg === "function");
    goog.exportSymbol("Sk.timeoutMsg", Sk.timeoutMsg);

    Sk.sysargv = options["sysargv"] || Sk.sysargv;
    goog.asserts.assert(goog.isArrayLike(Sk.sysargv));

    Sk.python3 = options["python3"] || Sk.python3;
    goog.asserts.assert(typeof Sk.python3 === "boolean");

    Sk.inputfun = options["inputfun"] || Sk.inputfun;
    goog.asserts.assert(typeof Sk.inputfun === "function");

    Sk.throwSystemExit = options["systemexit"] || false;
    goog.asserts.assert(typeof Sk.throwSystemExit === "boolean");

    Sk.retainGlobals = options["retainglobals"] || false;
    goog.asserts.assert(typeof Sk.throwSystemExit === "boolean");

    if (options["syspath"]) {
        Sk.syspath = options["syspath"];
        goog.asserts.assert(goog.isArrayLike(Sk.syspath));
        // assume that if we're changing syspath we want to force reimports.
        // not sure how valid this is, perhaps a separate api for that.
        Sk.realsyspath = undefined;
        Sk.sysmodules = new Sk.builtin.dict([]);
    }

    Sk.misceval.softspace_ = false;
};
goog.exportSymbol("Sk.configure", Sk.configure);

Sk.fillEnv = function(env) {
    env.action = env.action || function() {};
    env.walls = env.walls || [];
    env.paintedCells = env.paintedCells || [];
    env.startRow = env.startRow || 1;
    env.startCol = env.startCol || 1;
    env.width = env.width || 3;
    env.height = env.height || 2;
    return env;
};

Sk.checkEnv = function (env) {
    var i;
    if (env == null || typeof env != "object") {
        throw "Environment. No environment";
    }
    checkCallback("action");
    checkDim("width");
    checkDim("height");
    checkPos(env, "startRow", "height");
    checkPos(env, "startCol", "width");
    
    if (Object.prototype.toString.call(env.paintedCells) != "[object Array]") {
        throw "Environment. Wrong painted cells";
    }

    for (i = 0; i < env.paintedCells.length; i++) {
        checkCell(env.paintedCells[i]);
    }

    if (Object.prototype.toString.call(env.walls) != "[object Array]") {
        throw "Environment. Wrong walls";
    }
    
    for (i = 0; i < env.walls.length; i++) {
        var cells = env.walls[i];
        if (Object.prototype.toString.call(cells) != "[object Array]" || cells.length != 2) {
            throw "Environment. Wrong wall, number: " + i;
        }
        try {
            checkCell(cells[0]);
            checkCell(cells[1]);
        }
        catch (e) {
            throw e.toString() + " (wall number: " + i + ")" ;
        }
    }
    
    function checkCallback(callback) {
        if (typeof env[callback] != "function") {
            throw "Environment. No '" + callback + "' callback";
        }
    }
    
    function checkDim(dim) {
        if (typeof env[dim] != "number" || env[dim] < 1) {
            throw "Environment. Wrong " + dim;
        }
    }
    
    function checkPos(env, pos, dim) {
        if (typeof env[pos] != "number" || env[pos] < 0 || env[pos] >= env[dim]) {
            throw "Environment. Wrong " + pos;
        }
    }
    
    function checkCell(cell) {
        if (cell == null || typeof cell != "object") {
            throw "Environment. Wrong cell";
        }
        checkPos(cell, "r", "height");
        checkPos(cell, "c", "width");
    }
};


/*
 *	Replaceable message for message timeouts
 */
Sk.timeoutMsg = function () {
    return "Program exceeded run time limit.";
};
goog.exportSymbol("Sk.timeoutMsg", Sk.timeoutMsg);

/*
 * Replacable output redirection (called from print, etc).
 */
Sk.output = function (x) {
};

/*
 * Replacable function to load modules with (called via import, etc.)
 * todo; this should be an async api
 */
Sk.read = function (x) {
    throw "Sk.read has not been implemented";
};

/*
 * Setable to emulate arguments to the script. Should be array of JS strings.
 */
Sk.sysargv = [];

// lame function for sys module
Sk.getSysArgv = function () {
    return Sk.sysargv;
};
goog.exportSymbol("Sk.getSysArgv", Sk.getSysArgv);


/**
 * Setable to emulate PYTHONPATH environment variable (for finding modules).
 * Should be an array of JS strings.
 */
Sk.syspath = [];

Sk.inBrowser = goog.global["document"] !== undefined;

/**
 * Internal function used for debug output.
 * @param {...} args
 */
Sk.debugout = function (args) {
};

(function () {
    // set up some sane defaults based on availability
    if (goog.global["write"] !== undefined) {
        Sk.output = goog.global["write"];
    } else if (goog.global["console"] !== undefined && goog.global["console"]["log"] !== undefined) {
        Sk.output = function (x) {
            goog.global["console"]["log"](x);
        };
    } else if (goog.global["print"] !== undefined) {
        Sk.output = goog.global["print"];
    }
    if (goog.global["print"] !== undefined) {
        Sk.debugout = goog.global["print"];
    }
}());

// override for closure to load stuff from the command line.
if (!Sk.inBrowser) {
    goog.global.CLOSURE_IMPORT_SCRIPT = function (src) {
        goog.global["eval"](goog.global["read"]("support/closure-library/closure/goog/" + src));
        return true;
    };
}

Sk.python3 = false;
Sk.inputfun = function (args) {
    return window.prompt(args);
};

goog.exportSymbol("Sk.python3", Sk.python3);
goog.exportSymbol("Sk.inputfun", Sk.inputfun);
goog.require("goog.asserts");
