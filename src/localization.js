function MessageCatalog() {
    this.currentLocale = "en";
    this.fallbackLocale = "en";
    this.catalogs = {};
    this.loadDefaultCatalogs();
}

MessageCatalog.prototype.loadDefaultCatalogs = function() {
    // English (default)
    this.catalogs.en = {
        // Basic syntax errors
        "syntax.unexpected_token": "unexpected token",
        "syntax.expected_single": "expected {expected}",
        "syntax.expected_multiple": "expected {expected}",
        "syntax.expected_one_of": "expected one of: {expected}...",
        "syntax.got_token": " (got {actual})",
        "syntax.too_much_input": "too much input",

        // String-related errors
        "string.unterminated": "unterminated string literal (missing closing {quote})",
        "string.mismatched_quotes": "string literal uses mismatched quotes (cannot mix single and double quotes)",

        // Token names
        "token.identifier": "identifier",
        "token.number": "number",
        "token.string": "string",
        "token.newline": "newline",
        "token.indentation": "indentation",
        "token.dedentation": "dedentation",
        "token.end_of_file": "end of file",

        // Control flow
        "symbol.code_block": "code block",

        // Import statements
        "symbol.import_statement": "import statement",
        "symbol.from_import_statement": "from import statement",
        "symbol.import_alias": "import alias",
        "symbol.import_list": "import list",
        "symbol.dotted_import_alias": "dotted import alias",
        "symbol.dotted_import_list": "dotted import list",
        "symbol.module_name": "module name",

        // Expressions
        "symbol.expression": "expression",
        "symbol.or_expression": "or expression",
        "symbol.and_expression": "and expression",
        "symbol.not_expression": "not expression",
        "symbol.comparison": "comparison",
        "symbol.comparison_operator": "comparison operator",

        // Arithmetic expressions
        "symbol.xor_expression": "xor expression",
        "symbol.bitwise_and_expression": "bitwise and expression",
        "symbol.shift_expression": "shift expression",
        "symbol.arithmetic_expression": "arithmetic expression",
        "symbol.term": "continuation of expression",
        "symbol.factor": "continuation of expression",
        "symbol.power_expression": "power expression",
        "symbol.atom_expression": "atom expression",
        "symbol.atom": "atom",
        "symbol.star_expression": "star expression",

        // Lists and comprehensions
        "symbol.expression_list": "expression list",
        "symbol.expression_list_or_comprehension": "expression list or comprehension",
        "symbol.expression_list_with_star": "expression list with star",
        "symbol.comprehension_for": "comprehension for clause",
        "symbol.comprehension_if": "comprehension if clause",
        "symbol.comprehension_iterator": "comprehension iterator",

        // Data structures
        "symbol.dict_or_set_maker": "dictionary or set contents",
        "symbol.trailer": "attribute access or call",
        "symbol.subscript": "subscript",
        "symbol.subscript_list": "subscript list",
        "symbol.slice_operator": "slice operator",

        // Assignment
        "symbol.augmented_assignment": "augmented assignment operator",
        "symbol.annotated_assignment": "annotated assignment",

        // Lambda expressions
        "symbol.lambda_expression": "lambda expression",

        // Yield expressions
        "symbol.yield_expression": "yield expression",
        "symbol.yield_argument": "yield argument",

        // Encoding
        "symbol.encoding_declaration": "encoding declaration",

        // Context
        "context.identifier_value": "identifier '{value}'",
        "context.number_value": "number '{value}'",
        "context.string_value": "string '{value}'",

        // Suffixes for default case
        "symbol.statement_suffix": "statement",
        "symbol.expression_suffix": "expression",
        "symbol.test_suffix": "test",
        "symbol.list_suffix": "list",
        "symbol.definition_suffix": "definition",

        // Common conjunction
        "common.or": "or",

        // error.js
        "error.on_line": "on line",
        
        "name.is_not_defined": "name '{value}' is not defined",
        "tokenize.EOF": "construct was started but not completed",
        "abstract.binop_type_error": "unsupported operand type(s) for {op}: '{operand1}' and '{operand2}'",
        "abstract.unop_type_error": "bad operand type for unary {op}: '{operand}'",
        "function.missing_required_args": "{name}() missing {length} required argument{plural}",
        "int.invalid_literal": "invalid literal for int() with base {base}: '{origs}'",
    };

    // Russian
    this.catalogs.ru = {
        // Basic syntax errors
        "syntax.unexpected_token": "неожиданный токен",
        "syntax.expected_single": "ожидается {expected}",
        "syntax.expected_multiple": "ожидается {expected}",
        "syntax.expected_one_of": "ожидается один из элементов: {expected}...",
        "syntax.got_token": ", но присутствует {actual}",
        "syntax.too_much_input": "слишком много входных данных",
        "syntax.incomplete_input": "неполные входные данные",

        // String-related errors
        "string.unterminated": "незавершённая строковая константа (отсутствует закрывающая {quote})",
        "string.mismatched_quotes": "строковая константа использует несовпадающие кавычки (нельзя смешивать одинарные и двойные кавычки)",
        "string.incomplete_statement": "инструкция кажется незавершённой - возможно незавершённая строковая константа (получен {actual})",

        // Token names
        "token.identifier": "идентификатор",
        "token.number": "число",
        "token.string": "строка",
        "token.newline": "символ новой строки",
        "token.indentation": "отступ",
        "token.dedentation": "уменьшение отступа",
        "token.end_of_file": "конец файла",

        // Control flow
        "symbol.code_block": "блок кода",

        // Import statements
        "symbol.import_statement": "инструкция import",
        "symbol.from_import_statement": "инструкция from import",
        "symbol.import_alias": "псевдоним импорта",
        "symbol.import_list": "список импорта",
        "symbol.dotted_import_alias": "псевдоним составного импорта",
        "symbol.dotted_import_list": "список составного импорта",
        "symbol.module_name": "имя модуля",

        // Expressions
        "symbol.expression": "выражение",
        "symbol.or_expression": "or выражение",
        "symbol.and_expression": "and выражение",
        "symbol.not_expression": "not выражение",
        "symbol.comparison": "сравнение",
        "symbol.comparison_operator": "оператор сравнения",

        // Arithmetic expressions
        "symbol.xor_expression": "xor выражение",
        "symbol.bitwise_and_expression": "выражение побитового и",
        "symbol.shift_expression": "выражение сдвига",
        "symbol.arithmetic_expression": "арифметическое выражение",
        "symbol.term": "продолжение выражения",
        "symbol.factor": "продолжение выражения",
        "symbol.power_expression": "выражение возведения в степень",
        "symbol.atom_expression": "атомарное выражение",
        "symbol.atom": "атом",
        "symbol.star_expression": "звёздочное выражение",

        // Lists and comprehensions
        "symbol.expression_list": "список выражений",
        "symbol.expression_list_or_comprehension": "список выражений или генератор",
        "symbol.expression_list_with_star": "список выражений со звёздочкой",
        "symbol.comprehension_for": "for клаузула генератора",
        "symbol.comprehension_if": "if клаузула генератора",
        "symbol.comprehension_iterator": "итератор генератора",

        // Data structures
        "symbol.dict_or_set_maker": "содержимое словаря или множества",
        "symbol.trailer": "обращение к атрибуту или вызов",
        "symbol.subscript": "индекс",
        "symbol.subscript_list": "список индексов",
        "symbol.slice_operator": "оператор среза",

        // Assignment
        "symbol.augmented_assignment": "оператор расширенного присваивания",
        "symbol.annotated_assignment": "аннотированное присваивание",

        // Lambda expressions
        "symbol.lambda_expression": "lambda выражение",

        // Yield expressions
        "symbol.yield_expression": "yield выражение",
        "symbol.yield_argument": "аргумент yield",

        // Encoding
        "symbol.encoding_declaration": "объявление кодировки",

        // Context
        "context.identifier_value": "идентификатор '{value}'",
        "context.number_value": "число '{value}'",
        "context.string_value": "строка '{value}'",

        // Suffixes for default case
        "symbol.statement_suffix": "инструкция",
        "symbol.expression_suffix": "выражение",
        "symbol.test_suffix": "тест",
        "symbol.list_suffix": "список",
        "symbol.definition_suffix": "определение",

        // Common conjunction
        "common.or": "или",
        
        // error.js
        "error.on_line": "в строке",

        "name.is_not_defined": "имя '{value}' не определено",
        "tokenize.EOF": "конструкция началась и не завершилась",
        "abstract.binop_type_error": "неподдерживаемые типы операндов для {op}: '{operand1}' и '{operand2}'",
        "abstract.unop_type_error": "неподдерживаемый тип операнда для {op}: '{operand}'",
        "function.missing_required_args": "для {name}() отсутствует несколько ({length}) обязательных аргументов",
        "int.invalid_literal": "неверное представление числа для int() с основанием {base}: '{origs}'",
    };
};

MessageCatalog.prototype.setLocale = function(locale) {
    if (this.catalogs[locale]) {
        this.currentLocale = locale;
        return true;
    }
    return false;
};

MessageCatalog.prototype.t = function(key, params) {
    const message = this.getMessage(key);
    return this.interpolate(message, params || {});
};

MessageCatalog.prototype.getMessage = function(key) {
    const catalog = this.catalogs[this.currentLocale];
    if (catalog && catalog[key]) {
        return catalog[key];
    }

    // Fallback to default locale
    const fallbackCatalog = this.catalogs[this.fallbackLocale];
    if (fallbackCatalog && fallbackCatalog[key]) {
        return fallbackCatalog[key];
    }

    // Ultimate fallback
    return key;
};

MessageCatalog.prototype.interpolate = function(message, params) {
    return message.replace(/\{(\w+)\}/g, function(match, key) {
        return params[key] !== undefined ? params[key] : match;
    });
};

// Create global instance
Sk.msgCatalog = new MessageCatalog();

Sk.exportSymbol("Sk.msgCatalog", Sk.msgCatalog);