const fs = require('fs');
const path = require('path');
const program = require('commander');
const reqskulpt = require('../support/run/require-skulpt').requireSkulpt;

function test (python3, opt, module = undefined) {
    var startime, endtime, elapsed;

    // Import Skulpt
    var skulpt = reqskulpt(false);
    if (skulpt === null) {
        process.exit(1);
    }

    Sk.js_beautify = require('js-beautify').js;

    // Setup for appropriate Python version
    var dir, pyver;

    if (python3) {
        dir = "test/unit3";
        pyver = Sk.python3;
    } else {
        dir = "test/unit";
        pyver = Sk.python2;
    }

    const regexp = /.*Ran.*passed:\s+(\d+)\s+failed:\s+(\d+)/g;

    // Configure Skulpt to run unit tests
    Sk.configure({
        syspath: [dir],
        robot: getRobotImpl(),
        microbit: getMicrobitImpl(),
        read: (fname) => { return fs.readFileSync(fname, "utf8"); },
        output: (args) => { Sk.buf += args; },
        __future__: pyver
    });

    // Test each existing unit test file
    var files = fs.readdirSync(dir);
    var modules = [];

    for (var idx = 0; idx < files.length; idx++) {
        let file = dir + "/" + files[idx];
        let stat = fs.statSync(file);
        let basename = path.basename(file, ".py");

        if (stat.isFile() && basename.startsWith("test_") && path.extname(file) == ".py") {
            if (module && !basename.endsWith(module)) {
                continue;
            }

            modules.push([file, basename]);
        } else if (stat.isDirectory() && basename.startsWith("test_")) {
            if (!fs.statSync(file + "/__init__.py").isFile()) {
                continue;
            }
            if (module && !basename.endsWith(module)) {
                continue;
            }
            modules.push([file + ".py", path.basename(file + ".py", ".py")]);
        }
    }

    starttime = Date.now();

    function runtest (tests, passed, failed) {
        if (tests.length == 0) {
            endtime = Date.now();
            elapsed = (endtime - starttime) / 1000;
            console.log("Summary");
            console.log("Passed: " + passed + " Failed: " + failed);
            console.log("Total run time for all unit tests: " + elapsed.toString() + "s");
            if (failed > 0) {
                process.exit(1);
            }
            return;
        }

        var test = tests.shift();

        // Clear output buffer
        Sk.buf = "";

        // Print test name
        console.log(test[0] + "\n");

        // Run test
        Sk.misceval.asyncToPromise(function() {
            return Sk.importMain(test[1], false, true);
        }).then(function () {
            var found;

            // Print results
            console.log(Sk.buf);

            // Check for internal errors
            if (Sk.buf.indexOf("Uncaught Error in") != -1) {
                console.log("Internal uncaught errors, failed: 1\n");
                failed += 1;
            }

            // Update results
            while ((found = regexp.exec(Sk.buf)) !== null) {
                passed += parseInt(found[1]);
                failed += parseInt(found[2]);
            }
        }).catch(function (err) {
            failed += 1;
            console.log("UNCAUGHT EXCEPTION: " + err);
            console.log(err.stack);
        }).then(function () {
            runtest(tests, passed, failed)
        });
    }

    runtest(modules, 0, 0);
}

function getRobotImpl() {
    let lastCall;
    return {
        move: direction => lastCall = "move_" + direction,
        isWallFrom: direction => {lastCall = "isWallFrom_" + direction; return true;},
        isFreeFrom: direction => {lastCall = "isFreeFrom_" + direction; return true;},
        paint: () => lastCall = "paint",
        isCellPainted: () => {lastCall = "isCellPainted"; return true;},
        getPollutionLevel: () => {lastCall = "getPollutionLevel"; return 1;},
        printNumber: (num) => lastCall = "printNumber_" + num,
        getLastCall: () => lastCall
    }
}

function getMicrobitImpl() {
    let lastCall = "";
    let matrix = emptyMatrix();
    let clock = 0;
    let pressed = { A: false, B: false };
    let was = { A: false, B: false };
    let presses = { A: 0, B: 0 };

    function emptyMatrix() {
        return [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];
    }

    return {
        show: (m) => { lastCall = "show"; matrix = m.map(r => r.slice()); },
        showText: (text, delayMs) => {
            lastCall = "showText_" + text + "_" + delayMs;
            if (!text || text.length === 0) {
                return;
            }
            const last = text.charAt(text.length - 1);
            const m = emptyMatrix();
            m[2][2] = 9;
            m[0][0] = (last.charCodeAt(0) || 0) % 10;
            matrix = m;
            if (text.length > 1) {
                clock += delayMs * text.length;
                return Promise.resolve();
            }
        },
        setPixel: (x, y, v) => {
            lastCall = "setPixel";
            if (x < 0 || x > 4 || y < 0 || y > 4) throw new Error("oob");
            if (v < 0 || v > 9) throw new Error("bright");
            matrix[y][x] = v;
        },
        getPixel: (x, y) => {
            lastCall = "getPixel";
            if (x < 0 || x > 4 || y < 0 || y > 4) throw new Error("oob");
            return matrix[y][x];
        },
        clear: () => { lastCall = "clear"; matrix = emptyMatrix(); },
        isPressed: (b) => { lastCall = "isPressed_" + b; return !!pressed[b]; },
        wasPressed: (b) => {
            lastCall = "wasPressed_" + b;
            const v = !!was[b];
            was[b] = false;
            return v;
        },
        getPresses: (b) => {
            lastCall = "getPresses_" + b;
            const n = presses[b] || 0;
            presses[b] = 0;
            return n;
        },
        sleep: (ms) => {
            lastCall = "sleep_" + ms;
            clock += ms;
            return Promise.resolve();
        },
        runningTime: () => clock,
        getLastCall: () => lastCall,
    };
}

program
    .option('--python3', 'Python 3')
    .option('-o, --opt', 'use optimized skulpt')
    .option('--module <module>', 'test specific module')
    .parse(process.argv);

test(program.python3, program.opt, program.module);
