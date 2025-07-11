// low level parser to a concrete syntax tree, derived from cpython's lib2to3

/**
 *
 * @constructor
 * @param {Object} grammar
 *
 * p = new Parser(grammar);
 * p.setup([start]);
 * foreach input token:
 *     if p.addtoken(...):
 *         break
 * root = p.rootnode
 *
 * can throw SyntaxError
 */
function Parser (filename, grammar) {
    this.filename = filename;
    this.grammar = grammar;
    this.p_flags = 0;
    return this;
}

// all possible parser flags
Parser.FUTURE_PRINT_FUNCTION = "print_function";
Parser.FUTURE_UNICODE_LITERALS = "unicode_literals";
Parser.FUTURE_DIVISION = "division";
Parser.FUTURE_ABSOLUTE_IMPORT = "absolute_import";
Parser.FUTURE_WITH_STATEMENT = "with_statement";
Parser.FUTURE_NESTED_SCOPES = "nested_scopes";
Parser.FUTURE_GENERATORS = "generators";
Parser.CO_FUTURE_PRINT_FUNCTION = 0x10000;
Parser.CO_FUTURE_UNICODE_LITERALS = 0x20000;
Parser.CO_FUTURE_DIVISON = 0x2000;
Parser.CO_FUTURE_ABSOLUTE_IMPORT = 0x4000;
Parser.CO_FUTURE_WITH_STATEMENT = 0x8000;

Parser.prototype.setup = function (start) {
    var stackentry;
    var newnode;
    start = start || this.grammar.start;
    //print("START:"+start);

    newnode =
    {
        type    : start,
        value   : null,
        context : null,
        children: []
    };
    stackentry =
    {
        dfa  : this.grammar.dfas[start],
        state: 0,
        node : newnode
    };
    this.stack = [stackentry];
    this.used_names = {};

    // Add token history for better error messages
    this.recent_tokens = [];
    this.max_recent_tokens = 5;
};

Parser.prototype.getReadableTokenName = function(labelIndex) {
    const label = this.grammar.labels[labelIndex];
    const labelType = label[0];
    const labelValue = label[1];

    // First, check if this is a keyword
    for (let keyword in this.grammar.keywords) {
        if (this.grammar.keywords[keyword] === labelIndex) {
            return "'" + keyword + "'";
        }
    }

    // Handle terminals (tokens)
    if (labelType < 256) {
        const tokenName = Sk.token.tok_name[labelType];

        // Look up the actual operator symbol from EXACT_TOKEN_TYPES
        for (const symbol in Sk.token.EXACT_TOKEN_TYPES) {
            if (Sk.token.EXACT_TOKEN_TYPES[symbol] === labelType) {
                return "'" + symbol + "'";
            }
        }

        const msgCatalog = Sk.msgCatalog;
        // Handle other token types with user-friendly names
        switch (tokenName) {
            case "T_NAME": return msgCatalog.t("token.identifier", {value: labelValue});
            case "T_NUMBER": return msgCatalog.t("token.number", {value: labelValue});
            case "T_STRING": return msgCatalog.t("token.string", {value: labelValue});
            case "T_NEWLINE": return msgCatalog.t("token.newline");
            case "T_INDENT": return msgCatalog.t("token.indentation");
            case "T_DEDENT": return msgCatalog.t("token.dedentation");
            case "T_ENDMARKER": return msgCatalog.t("token.end_of_file");
            default:
                // Remove T_ prefix and convert to lowercase
                return tokenName.replace(/^T_/, "").toLowerCase();
        }
    }

    return null;
};

Parser.prototype.getReadableSymbolName = function(symbolType) {
    if (Sk.ParseTables.number2symbol && Sk.ParseTables.number2symbol[symbolType]) {
        const symbolName = Sk.ParseTables.number2symbol[symbolType];
        const msgCatalog = Sk.msgCatalog;
        
        // Use localized symbol names based on actual grammar
        switch (symbolName) {
            // Control flow
            case "suite": return msgCatalog.t("symbol.code_block");

            // Import statements
            case "import_stmt": return msgCatalog.t("symbol.import_statement");
            case "import_name": return msgCatalog.t("symbol.import_statement");
            case "import_from": return msgCatalog.t("symbol.from_import_statement");
            case "import_as_name": return msgCatalog.t("symbol.import_alias");
            case "import_as_names": return msgCatalog.t("symbol.import_list");
            case "dotted_as_name": return msgCatalog.t("symbol.dotted_import_alias");
            case "dotted_as_names": return msgCatalog.t("symbol.dotted_import_list");
            case "dotted_name": return msgCatalog.t("symbol.module_name");

            // Expressions
            case "expr": return msgCatalog.t("symbol.expression");
            case "test": return msgCatalog.t("symbol.expression");
            case "test_nocond": return msgCatalog.t("symbol.expression");
            case "or_test": return msgCatalog.t("symbol.or_expression");
            case "and_test": return msgCatalog.t("symbol.and_expression");
            case "not_test": return msgCatalog.t("symbol.not_expression");
            case "comparison": return msgCatalog.t("symbol.comparison");
            case "comp_op": return msgCatalog.t("symbol.comparison_operator");

            // Arithmetic expressions
            case "xor_expr": return msgCatalog.t("symbol.xor_expression");
            case "and_expr": return msgCatalog.t("symbol.bitwise_and_expression");
            case "shift_expr": return msgCatalog.t("symbol.shift_expression");
            case "arith_expr": return msgCatalog.t("symbol.arithmetic_expression");
            case "term": return msgCatalog.t("symbol.term");
            case "factor": return msgCatalog.t("symbol.factor");
            case "power": return msgCatalog.t("symbol.power_expression");
            case "atom_expr": return msgCatalog.t("symbol.atom_expression");
            case "atom": return msgCatalog.t("symbol.atom");
            case "star_expr": return msgCatalog.t("symbol.star_expression");

            // Lists and comprehensions
            case "testlist": return msgCatalog.t("symbol.expression_list");
            case "testlist_comp": return msgCatalog.t("symbol.expression_list_or_comprehension");
            case "testlist_star_expr": return msgCatalog.t("symbol.expression_list_with_star");
            case "exprlist": return msgCatalog.t("symbol.expression_list");
            case "comp_for": return msgCatalog.t("symbol.comprehension_for");
            case "comp_if": return msgCatalog.t("symbol.comprehension_if");
            case "comp_iter": return msgCatalog.t("symbol.comprehension_iterator");

            // Data structures
            case "dictorsetmaker": return msgCatalog.t("symbol.dict_or_set_maker");
            case "trailer": return msgCatalog.t("symbol.trailer");
            case "subscript": return msgCatalog.t("symbol.subscript");
            case "subscriptlist": return msgCatalog.t("symbol.subscript_list");
            case "sliceop": return msgCatalog.t("symbol.slice_operator");

            // Assignment
            case "augassign": return msgCatalog.t("symbol.augmented_assignment");
            case "annassign": return msgCatalog.t("symbol.annotated_assignment");

            // Lambda expressions
            case "lambdef": return msgCatalog.t("symbol.lambda_expression");
            case "lambdef_nocond": return msgCatalog.t("symbol.lambda_expression");

            // Yield expressions
            case "yield_expr": return msgCatalog.t("symbol.yield_expression");
            case "yield_arg": return msgCatalog.t("symbol.yield_argument");

            // Encoding
            case "encoding_decl": return msgCatalog.t("symbol.encoding_declaration");

            // Default case - convert underscores and make readable
            default:
                var readable = symbolName
                    .replace(/_/g, " ")
                    .replace(/\bstmt\b/g, msgCatalog.t("symbol.statement_suffix"))
                    .replace(/\bexpr\b/g, msgCatalog.t("symbol.expression_suffix"))
                    .replace(/\btest\b/g, msgCatalog.t("symbol.test_suffix"))
                    .replace(/\blist\b/g, msgCatalog.t("symbol.list_suffix"))
                    .replace(/\bdef\b/g, msgCatalog.t("symbol.definition_suffix"));

                return readable;
        }
    }

    return null;
};

// Helper method to describe the actual token that was found
Parser.prototype.getActualTokenDescription = function(type, value) {
    const tokenName = Sk.token.tok_name[type];
    const msgCatalog = Sk.msgCatalog;
    
    if (!tokenName) {
        return msgCatalog.t("syntax.unexpected_token");
    }

    switch (tokenName) {
        case "T_NAME": return msgCatalog.t("context.identifier_value", {value: value});
        case "T_NUMBER": return msgCatalog.t("context.number_value", {value: value});
        case "T_STRING": return msgCatalog.t("context.string_value", {value: value});
        case "T_NEWLINE": return msgCatalog.t("token.newline");
        case "T_INDENT": return msgCatalog.t("token.indentation");
        case "T_DEDENT": return msgCatalog.t("token.dedentation");
        case "T_ENDMARKER": return msgCatalog.t("token.end_of_file");
        default:
            if (value && value.length <= 3) {
                return "'" + value + "'";
            }
            return tokenName.replace(/^T_/, "").toLowerCase();
    }
};

Parser.prototype.generateContextualErrorMessage = function(expected, actualType, actualValue, context) {
    // Check for string issues first
    const stringIssue = this.detectStringIssue(actualType, actualValue, context);
    if (stringIssue) {
        return stringIssue;
    }

    // Generate standard expected/got message using localization
    let message;
    const msgCatalog = Sk.msgCatalog;
    
    if (expected.length === 0) {
        message = msgCatalog.t("syntax.unexpected_token");
    } else if (expected.length === 1) {
        message = msgCatalog.t("syntax.expected_single", {expected: expected[0]});
    } else if (expected.length <= 4) {
        let expectedText;
        if (expected.length === 2) {
            expectedText = expected[0] + " " + msgCatalog.t("common.or") + " " + expected[1];
        } else {
            expectedText = expected.slice(0, -1).join(", ") + " " + msgCatalog.t("common.or") + " " + expected[expected.length - 1];
        }
        message = msgCatalog.t("syntax.expected_multiple", {expected: expectedText});
    } else {
        message = msgCatalog.t("syntax.expected_one_of", {expected: expected.slice(0, 4).join(", ")});
    }

    const actualToken = this.getActualTokenDescription(actualType, actualValue);
    if (actualToken) {
        message += msgCatalog.t("syntax.got_token", {actual: actualToken});
    }

    return message;
};

// Detect potential string literal issues
Parser.prototype.detectStringIssue = function(actualType, actulaValue, context) {
    const line = context[2];
    const col = context[0][1];

    const msgCatalog = Sk.msgCatalog;
    
    if (line && col > 0) {
        const beforeError = line.substring(0, col);
        const doubleQuotes = (beforeError.match(/"/g) || []).length;
        const singleQuotes = (beforeError.match(/'/g) || []).length;

        if (doubleQuotes % 2 === 1) {
            return msgCatalog.t("string.unterminated", {quote: '"'});
        }
        if (singleQuotes % 2 === 1) {
            return msgCatalog.t("string.unterminated", {quote: "'"});
        }

        const mixedQuotesPattern = /["'][^"']*['"]$/;
        if (mixedQuotesPattern.test(beforeError)) {
            return msgCatalog.t("string.mismatched_quotes");
        }
    }

    if (this.recent_tokens.length > 0) {
        const lastToken = this.recent_tokens[this.recent_tokens.length - 1];
        if (lastToken.type === Sk.token.tokens.T_STRING && actualType === Sk.token.tokens.T_NAME) {
            return msgCatalog.t("string.unterminated", {quote: "\""});
        }
    }

    return null;
};

function findInDfa (a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i][0] === obj[0] && a[i][1] === obj[1]) {
            return true;
        }
    }
    return false;
}


// Add a token; return true if we're done
Parser.prototype.addtoken = function (type, value, context) {
    // Store recent tokens for better error messages
    this.recent_tokens.push({
        type: type,
        value: value,
        context: context
    });
    if (this.recent_tokens.length > this.max_recent_tokens) {
        this.recent_tokens.shift();
    }

    const msgCatalog = Sk.msgCatalog;
    
    var errMessage;
    var itsfirst;
    var itsdfa;
    var state;
    var v;
    var t;
    var newstate;
    var i;
    var a;
    var arcs;
    var first;
    var states;
    var tp;
    var ilabel = this.classify(type, value, context);
    //print("ilabel:"+ilabel);

    OUTERWHILE:
    while (true) {
        tp = this.stack[this.stack.length - 1];
        states = tp.dfa[0];
        first = tp.dfa[1];
        arcs = states[tp.state];

        // look for a state with this label
        for (a = 0; a < arcs.length; ++a) {
            i = arcs[a][0];
            newstate = arcs[a][1];
            t = this.grammar.labels[i][0];
            v = this.grammar.labels[i][1];
            if (ilabel === i) {
                // look it up in the list of labels
                Sk.asserts.assert(t < 256);
                // shift a token; we're done with it
                this.shift(type, value, newstate, context);
                // pop while we are in an accept-only state
                state = newstate;
                //print("before:"+JSON.stringify(states[state]) + ":state:"+state+":"+JSON.stringify(states[state]));
                /* jshint ignore:start */
                while (states[state].length === 1
                    && states[state][0][0] === 0
                    && states[state][0][1] === state) {
                    // states[state] == [(0, state)])
                    this.pop();
                    //print("in after pop:"+JSON.stringify(states[state]) + ":state:"+state+":"+JSON.stringify(states[state]));
                    if (this.stack.length === 0) {
                        // done!
                        return true;
                    }
                    tp = this.stack[this.stack.length - 1];
                    state = tp.state;
                    states = tp.dfa[0];
                    first = tp.dfa[1];
                    //print(JSON.stringify(states), JSON.stringify(first));
                    //print("bottom:"+JSON.stringify(states[state]) + ":state:"+state+":"+JSON.stringify(states[state]));
                }
                /* jshint ignore:end */
                // done with this token
                //print("DONE, return false");
                return false;
            } else if (t >= 256) {
                itsdfa = this.grammar.dfas[t];
                itsfirst = itsdfa[1];
                if (itsfirst.hasOwnProperty(ilabel)) {
                    // push a symbol
                    this.push(t, this.grammar.dfas[t], newstate, context);
                    continue OUTERWHILE;
                }
            }
        }

        //print("findInDfa: " + JSON.stringify(arcs)+" vs. " + tp.state);
        if (findInDfa(arcs, [0, tp.state])) {
            // an accepting state, pop it and try somethign else
            //print("WAA");
            this.pop();
            if (this.stack.length === 0) {
                throw new Sk.builtin.SyntaxError(msgCatalog.t("syntax.too_much_input"), this.filename);
            }
        } else {
            // no transition
            // Generate improved error message with context

            // The message generation is in the try catch as I'm not 100% sure about the code correctness (vibe coded).
            // So, if something is wrong the original unclear message should be shown
            try {
                const expected = [];
                const seenLabels = new Set();

                // Collect all possible transitions from current state
                for (const element of arcs) {
                    const labelIndex = element[0];

                    if (seenLabels.has(labelIndex)) {
                        continue;
                    }
                    seenLabels.add(labelIndex);

                    const label = this.grammar.labels[labelIndex];
                    const labelType = label[0];

                    if (labelType < 256) {
                        const tokenName = this.getReadableTokenName(labelIndex);
                        if (tokenName) {
                            expected.push(tokenName);
                        }
                    } else {
                        const symbolName = this.getReadableSymbolName(labelType);
                        if (symbolName) {
                            expected.push(symbolName);
                        }
                    }
                }

                errMessage = this.generateContextualErrorMessage(expected, type, value, context);
            } catch {
                throw new Sk.builtin.SyntaxError("bad input", this.filename, context[0][0], context);
            }

            throw new Sk.builtin.SyntaxError(errMessage, this.filename, context[0][0], context);
        }
    }
};

// turn a token into a label
Parser.prototype.classify = function (type, value, context) {
    var ilabel;
    if (type === Sk.token.tokens.T_NAME) {
        this.used_names[value] = true;
        ilabel = this.grammar.keywords.hasOwnProperty(value) && this.grammar.keywords[value];

        /* Check for handling print as a builtin function */
        if(value === "print" && (this.p_flags & Parser.CO_FUTURE_PRINT_FUNCTION || Sk.__future__.print_function === true)) {
            ilabel = false; // ilabel determines if the value is a keyword
        }

        if (ilabel) {
            //print("is keyword");
            return ilabel;
        }
    }
    ilabel = this.grammar.tokens.hasOwnProperty(type) && this.grammar.tokens[type];
    if (!ilabel) {
        // throw new Sk.builtin.SyntaxError("bad token", type, value, context);
        // Questionable modification to put line number in position 2
        // like everywhere else and filename in position 1.
        let descr = "#"+type;
        for (let i in Sk.token.tokens) {
            if (Sk.token.tokens[i] == type) {
                descr = i;
                break;
            }
        }

        throw new Sk.builtin.SyntaxError("bad token " + descr, this.filename, context[0][0], context);
    }
    return ilabel;
};

// shift a token
Parser.prototype.shift = function (type, value, newstate, context) {
    var dfa = this.stack[this.stack.length - 1].dfa;
    var state = this.stack[this.stack.length - 1].state;
    var node = this.stack[this.stack.length - 1].node;
    //print("context", context);
    var newnode = {
        type      : type,
        value     : value,
        lineno    : context[0][0],         // throwing away end here to match cpython
        col_offset: context[0][1],
        children  : null
    };
    if (newnode) {
        node.children.push(newnode);
    }
    this.stack[this.stack.length - 1] = {
        dfa  : dfa,
        state: newstate,
        node : node
    };
};

// push a nonterminal
Parser.prototype.push = function (type, newdfa, newstate, context) {
    var dfa = this.stack[this.stack.length - 1].dfa;
    var node = this.stack[this.stack.length - 1].node;
    var newnode = {
        type      : type,
        value     : null,
        lineno    : context[0][0],      // throwing away end here to match cpython
        col_offset: context[0][1],
        children  : []
    };
    this.stack[this.stack.length - 1] = {
        dfa  : dfa,
        state: newstate,
        node : node
    };
    this.stack.push({
        dfa  : newdfa,
        state: 0,
        node : newnode
    });
};

//var ac = 0;
//var bc = 0;

// pop a nonterminal
Parser.prototype.pop = function () {
    var node;
    var pop = this.stack.pop();
    var newnode = pop.node;
    //print("POP");
    if (newnode) {
        //print("A", ac++, newnode.type);
        //print("stacklen:"+this.stack.length);
        if (this.stack.length !== 0) {
            //print("B", bc++);
            node = this.stack[this.stack.length - 1].node;
            node.children.push(newnode);
        } else {
            //print("C");
            this.rootnode = newnode;
            this.rootnode.used_names = this.used_names;
        }
    }
};

/**
 * parser for interactive input. returns a function that should be called with
 * lines of input as they are entered. the function will return false
 * until the input is complete, when it will return the rootnode of the parse.
 *
 * @param {string} filename
 * @param {string=} style root of parse tree (optional)
 */
function makeParser (filename, style) {
    if (style === undefined) {
        style = "file_input";
    }
    var p = new Parser(filename, Sk.ParseTables);
    // for closure's benefit
    if (style === "file_input") {
        p.setup(Sk.ParseTables.sym.file_input);
    } else {
        Sk.asserts.fail("todo;");
    }
    return p;
}

Sk.parse = function parse (filename, input) {
    var T_COMMENT = Sk.token.tokens.T_COMMENT;
    var T_NL = Sk.token.tokens.T_NL;
    var T_OP = Sk.token.tokens.T_OP;
    var T_ENDMARKER = Sk.token.tokens.T_ENDMARKER;
    var T_ENCODING = Sk.token.tokens.T_ENCODING;

    var endmarker_seen = false;
    var parser = makeParser(filename);

    /**
     * takes a string splits it on '\n' and returns a function that returns
     * @param {Array<string>} input
     * @returns {function(): string}
     */
    function readline(input) {
        var lines = input.split("\n").reverse().map(function (l) { return l + "\n"; });

        return function() {
            if (lines.length === 0) {
                throw new Sk.builtin.Exception("EOF");
            }

            return lines.pop();
        };
    }

    Sk._tokenize(filename, readline(input), "utf-8", function (tokenInfo) {
        var s_lineno = tokenInfo.start[0];
        var s_column = tokenInfo.start[1];
        var type = null;
        var prefix, lineno, column;

        /* I don't know
         if (s_lineno !== lineno && s_column !== column)
         {
         // todo; update prefix and line/col
         }
         */

        if (tokenInfo.type === T_COMMENT || tokenInfo.type === T_NL || tokenInfo.type === T_ENCODING) {
            prefix += tokenInfo.value;
            lineno = tokenInfo.end[0];
            column = tokenInfo.end[1];
            if (tokenInfo.string[tokenInfo.string.length - 1] === "\n") {
                lineno += 1;
                column = 0;
            }
        } else {
            if (tokenInfo.type === T_OP) {
                type = Sk.OpMap[tokenInfo.string];
            }

            parser.addtoken(type || tokenInfo.type, tokenInfo.string, [tokenInfo.start, tokenInfo.end, tokenInfo.line]);

            if (tokenInfo.type === T_ENDMARKER) {
                endmarker_seen = true;
            }
        }
    });

    if (!endmarker_seen) {
        throw new Sk.builtin.SyntaxError("incomplete input", this.filename);
    }

    /**
     * Small adjustments here in order to return th flags and the cst
     */
    return {"cst": parser.rootnode, "flags": parser.p_flags};
};

Sk.parseTreeDump = function parseTreeDump (n, indent) {
    //return JSON.stringify(n, null, 2);
    var i;
    var ret;
    indent = indent || "";
    ret = "";
    ret += indent;
    if (n.type >= 256) { // non-term
        ret += Sk.ParseTables.number2symbol[n.type] + "\n";
        for (i = 0; i < n.children.length; ++i) {
            ret += Sk.parseTreeDump(n.children[i], indent + "  ");
        }
    } else {
        ret += Sk.token.tok_name[n.type] + ": " + new Sk.builtin.str(n.value)["$r"]().v + "\n";
    }
    return ret;
};


Sk.exportSymbol("Sk.Parser", Parser);
Sk.exportSymbol("Sk.parse", Sk.parse);
Sk.exportSymbol("Sk.parseTreeDump", Sk.parseTreeDump);
