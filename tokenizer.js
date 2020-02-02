"use strict";
exports.__esModule = true;
var input_1 = require("./input");
var Token = /** @class */ (function () {
    function Token(value, type) {
        this.value = value;
        this.type = type;
    }
    return Token;
}());
var KEYWORD = [
    'abstract',
    'arguments',
    'boolean',
    'break',
    'byte',
    'case',
    'catch',
    'char',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'double',
    'else',
    'enum',
    'eval',
    'export',
    'extends',
    'false',
    'final',
    'finally',
    'float',
    'for',
    'function',
    'goto',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'int',
    'interface',
    'let',
    'long',
    'native',
    'new',
    'null',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'short',
    'static',
    'super',
    'switch',
    'synchronized',
    'this',
    'throw',
    'throws',
    'transient',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'volatile',
    'while',
    'with',
    'yield'
];
var tokens = [];
function isReserved(word) {
    if (word[0] === '_' || word[0] === '$') {
        return new Token(word, 'identifier');
    }
    else {
        for (var _i = 0, KEYWORD_1 = KEYWORD; _i < KEYWORD_1.length; _i++) {
            var item = KEYWORD_1[_i];
            if (item === word) {
                return new Token(word, 'keyword');
            }
        }
        return new Token(word, 'identifier');
    }
}
function tokenizer(input) {
    var length = input.length;
    var index = 0;
    while (index < length) {
        // 空格
        if (/\s/.test(input[index])) {
            index++;
            continue;
        }
        // 字母
        if (/[A-Za-z]/.test(input[index])) {
            // 记录内容
            var value = input[index];
            // 记录暂读到的位置的内容
            var temp = input[++index];
            // 循环记录读到的内容
            while (/[A-Za-z0-9_$]/.test(temp) && index < length) {
                // 记录内容
                value += temp;
                // 指向下一个字符
                temp = input[++index];
            }
            // 确定该单词是否是关键字
            tokens.push(isReserved(value));
            continue;
        }
        // 数字
        if (/[0-9]/.test(input[index])) {
            var value = input[index];
            var temp = input[++index];
            while (/[0-9.]/.test(temp) && index < length) {
                value += temp;
                temp = input[++index];
            }
            tokens.push(new Token(value, 'number'));
            continue;
        }
        // 符号
        if (/[~`!$%^&*()-_+={}\[\]|\\:;"'<,>.?/]/.test(input[index])) {
            // 只能单独使用的符号
            if (/[~(){}\[\]?:;,]/.test(input[index])) {
                var value = input[index];
                index++;
                tokens.push(new Token(value, 'punctuator'));
                continue;
            }
            // 可以进行不同组合的符号
            if (/[!$%^&*\-_+=|\\<>.]/.test(input[index])) {
                var value = input[index];
                var temp = input[++index];
                if (value === '!' || value === '%' || value === '^' || value === '&') {
                    if (temp === '=') {
                        value += '=';
                    }
                    tokens.push(new Token(value, 'punctuator'));
                    continue;
                }
                if (value === '$') {
                    if (temp === '{') {
                        value += '{';
                        tokens.push(new Token(value, 'punctuator'));
                    }
                    else {
                        while (/[A-Za-z0-9_$]/.test(temp) && index < length) {
                            // 记录内容
                            value += temp;
                            // 指向下一个字符
                            temp = input[++index];
                        }
                        tokens.push(new Token(value, 'identifier'));
                    }
                    continue;
                }
                if (value === '*') {
                    if (temp === '=' || temp === '*' || temp === '/') {
                        value += temp;
                        index++;
                    }
                    tokens.push(new Token(value, 'punctuator'));
                    continue;
                }
                if (value === '-') {
                    if (temp === '=' || temp === '-') {
                        value += temp;
                        index++;
                    }
                    tokens.push(new Token(value, 'punctuator'));
                    continue;
                }
                if (value === '_') {
                    while (/[A-Za-z0-9_$]/.test(temp) && index < length) {
                        // 记录内容
                        value += temp;
                        // 指向下一个字符
                        temp = input[++index];
                    }
                    tokens.push(new Token(value, 'identifier'));
                }
                if (value === '+') {
                    if (temp === '=' || temp === '+') {
                        value += temp;
                        index++;
                    }
                    tokens.push(new Token(value, 'punctuator'));
                    continue;
                }
                if (value === '=') {
                    if (temp === '=') {
                        value += temp;
                        temp = input[++index];
                        if (temp === '=') {
                            value += temp;
                            index++;
                        }
                    }
                    else if (temp === '>') {
                        value += temp;
                        index++;
                    }
                    tokens.push(new Token(value, 'punctuator'));
                    continue;
                }
                if (value === '|') {
                    if (temp === '=' || temp === '|') {
                        value += temp;
                        index++;
                    }
                    tokens.push(new Token(value, 'punctuator'));
                    continue;
                }
                if (value === '\\') {
                    if (temp === 'a' ||
                        temp === 'b' ||
                        temp === 'f' ||
                        temp === 'n' ||
                        temp === 'r' ||
                        temp === 't' ||
                        temp === 'v' ||
                        temp === '?' ||
                        temp === '\\' ||
                        temp === '\'' ||
                        temp === '\"') {
                        value += temp;
                        index++;
                    }
                    else if (/[0-7]/.test(temp)) {
                        value += temp;
                        temp = input[++index];
                        if (/[0-7]/.test(temp)) {
                            value += temp;
                            temp = input[++index];
                            if (/[0-7]/.test(temp)) {
                                value += temp;
                                index++;
                            }
                            else {
                                throw new Error("Syntax Error: octal numbers(" + value + ") out of range(0 - 7).");
                            }
                        }
                        else {
                            throw new Error("Syntax Error: octal numbers(" + value + ") out of range(0 - 7).");
                        }
                    }
                    else if (temp === 'x') {
                        if (/[0-9a-fA-F]/.test(temp)) {
                            value += temp;
                            temp = input[++index];
                            if (/[0-9a-fA-F]/.test(temp)) {
                                value += temp;
                                index++;
                            }
                            else {
                                throw new Error("Syntax Error: hex numbers(" + value + ") out of range(0 - F).");
                            }
                        }
                        else {
                            throw new Error("Syntax Error: hex numbers(" + value + ") out of range(0 - F).");
                        }
                    }
                    tokens.push(new Token(value, 'string'));
                    continue;
                }
                if (value === '<') {
                    if (temp === '=' || temp === '<') {
                        value += temp;
                        index++;
                    }
                    tokens.push(new Token(value, 'punctuator'));
                    continue;
                }
                if (value === '>') {
                    if (temp === '=') {
                        value += temp;
                        index++;
                    }
                    else if (temp === '>') {
                        temp = input[++index];
                        if (temp === '>') {
                            value += temp;
                            index++;
                        }
                    }
                    tokens.push(new Token(value, 'punctuator'));
                    continue;
                }
                if (value === '.') {
                    if (temp === '.') {
                        if (input[++index] === '.') {
                            value = '...';
                        }
                    }
                    tokens.push(new Token(value, 'punctuator'));
                    continue;
                }
                throw new Error("Syntax Error: unexpected token \"" + value + "\".");
            }
            // 组成其他元素的符号
            if (/[`"'/]/.test(input[index])) {
                var value = input[index];
                var temp = input[++index];
                // 正则、注释、除号
                if (value === '/') {
                    if (temp === '=') {
                        value += temp;
                        index++;
                        tokens.push(new Token(value, 'punctuator'));
                        continue;
                    }
                    if (temp === '/') {
                        value = '';
                        temp = input[++index];
                        while (temp !== '\n' && index < length) {
                            value += temp;
                            temp = input[++index];
                        }
                        tokens.push(new Token(value, 'annotation'));
                        continue;
                    }
                    if (temp === '*') {
                        value = '';
                        temp = input[++index];
                        var end = input[++index];
                        var flag = true;
                        if (end !== undefined) {
                            while (index < length) {
                                console.log(value);
                                console.log(temp);
                                console.log(end);
                                console.log(flag);
                                console.log(index);
                                console.log(length);
                                if (temp === '*' && end === '/') {
                                    tokens.push(new Token(value.trim(), 'annotation'));
                                    flag = false;
                                    index++;
                                    break;
                                }
                                value += temp;
                                temp = end;
                                end = input[++index];
                            }
                            if (flag) {
                                throw new Error("Syntax Error: cross line annotation must have an end(*/).");
                            }
                            continue;
                        }
                        else {
                            throw new Error("Syntax Error: cross line annotation must have an end(*/).");
                        }
                    }
                }
                // 字符串
                if (value === '`') {
                    while (temp !== '`' && index < length) {
                        value += temp;
                        temp = input[++index];
                    }
                    if (temp === '`') {
                        value += temp;
                        index++;
                        tokens.push(new Token(value, 'string'));
                        continue;
                    }
                }
                if (value === '"') {
                    while (temp !== '"' && index < length) {
                        if (temp === '\n') {
                            throw new Error("Syntax Error: unexpected token \"" + value + "\".");
                        }
                        value += temp;
                        temp = input[++index];
                    }
                    if (temp === '"') {
                        value += temp;
                        index++;
                        tokens.push(new Token(value, 'string'));
                        continue;
                    }
                }
                if (value === '\'') {
                    while (temp !== '\'' && index < length) {
                        if (temp === '\n') {
                            throw new Error("Syntax Error: unexpected token \"" + value + "\".");
                        }
                        value += temp;
                        temp = input[++index];
                    }
                    if (temp === '\'') {
                        value += temp;
                        index++;
                        tokens.push(new Token(value, 'string'));
                        continue;
                    }
                }
                throw new Error("Syntax Error: unexpected token \"" + value + "\" + " + input[84] + " + " + input[85] + " + " + input[86] + ".");
            }
        }
    }
    console.log(tokens);
}
tokenizer(input_1["default"]);
