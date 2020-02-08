/**
 *
 *                   ___               ,--,    
 *           ,--,  ,--.'|_    ,--,   ,--.'|    
 *         ,'_ /|  |  | :,' ,--.'|   |  | :    
 *    .--. |  | :  :  : ' : |  |,    :  : '    
 *  ,'_ /| :  . |.;__,'  /  `--'_    |  ' |    
 *  |  ' | |  . .|  |   |   ,' ,'|   '  | |    
 *  |  | ' |  | |:__,'| :   '  | |   |  | :    
 *  :  | | :  ' ;  '  : |__ |  | :   '  : |__  
 *  |  ; ' |  | '  |  | '.'|'  : |__ |  | '.'| 
 *  :  | : ;  ; |  ;  :    ;|  | '.'|;  :    ; 
 *  '  :  `--'   \ |  ,   / ;  :    ;|  ,   /  
 *  :  ,      .-./  ---`-'  |  ,   /  ---`-'   
 *  `--`----'               ---`-'            
 *
 */

/**
 * Part I: Tokenizer
 */

/**
 * Before the program begins to scan, first we create a Token class. We have:
 *   1. 'value' to store the value of current token
 *   2. 'type' to store the possible type of current token
 * 
 * The value of 'type' may be:
 *   1. keyword
 *   2. identifier
 *   3. punctuator
 *   4. comments
 */
class Token {
  // what this word means
  public value: string
  // what this word is
  public type: string
  constructor (value: string, type: string) {
    this.value = value
    this.type = type
  }
}

/**
 * The reserved words table of ECMAScript 6.
 */
const KEYWORD: Array<string> = [
  'abstract',
  'arguments',
  'async',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'constructor',
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
  'NaN',
  'native',
  'new',
  'null',
  'of',
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
  'undefined',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield'
]

/**
 * Part II: Parser:
 */

/**
 * There are many types of statements in JavaScript. For each, we define the template of its
 * existence in the AST:
 * 
 * 1. Program: The root of the AST. Every statement except itself is put in its "body"
 * 
 * 
 * . Identifier: A use of identifier.
 * 
 * . NumericLiteral: A wrap of some neccessary property of declaring a number.
 * 
 * . StringLiteral: A wrap of some neccessary property of declaring a string.
 * 
 * . TemplateElement: Strings devided by identifiers in template string.
 * 
 * . TemplateStringLiteral: A wrap of some neccessary property of declaring a template string.
 * 
 * . BooleanLiteral: A wrap of some neccessary property of declaring a boolean.
 * 
 * . NullLiteral: A wrap of some neccessary property of declaring a null pointer.
 * 
 * . Undefined: An undefined.
 * 
 * . NaN: An NaN(not a number).
 * 
 * 
 * . VariableDeclaration: The full statement of a variable declaration.
 *    It's possible that there are more than one declarators in a declaration.(let a = 1, b = 2)
 * 
 * . VariableDeclarator: A declarator is one-to-one with a variable.
 *    It exists in an array called "declaration" in VariableDeclaration.
 * 
 * . FunctionDeclaration: The full statement of a function declaration.
 *    It's one-to-one with a function.
 * 
 * . ClassDeclaration: The full statement of an ES6 class declaration.
 *    It's one-to-one with a class.
 * 
 * . FunctionExpression: An anonymous function.
 * 
 * . ArrowFunctionExpression: ES6 "() => {}", a kind of anonymous function with "this" locked
 *    to its execution context.
 * 
 * . AssignmentExpression: An assignment expression.
 * 
 * . ArrayExpression: An anonymous array used for operation or judgment.
 * 
 * . UnaryExpression: An operation on one variable(or constant).
 * 
 * . BinaryExpression: An operation or relation on two variables(or constant). (a<b 二元表达式 关系表达式 > < !== ===)
 * 
 * . ConditionalExpression: An operation on three variables(or constant).(?:) (三元表达式)
 * 
 * . LogicalExpression: A logical judgement on two variables(or constant). (a || b逻辑表达式 || &&)
 * 
 * . ObjectExpression: A object literal declaration. (a = {})
 * 
 * . UpdateExpression: An operation on a variable for updating itself. (++ --)
 * 
 * . CallExpression: A call on a function (调用 console.log()这种)
 * 
 * . MemberExpression: The name of a member of an object. (console.log没有括号)
 * 
 * 
 * . ExpressionStatement: A wrap of some expressions above. (表达式)
 * 
 * . BlockStatement: A wrap of some expressions by "{}".
 * 
 * . IfStatement: If statement.
 * 
 * . WhileStatement: While loop statement.
 * 
 * . ForStatement: For loop statement.
 * 
 * . ForInStatement: For...in loop statement.
 * 
 * . ForOfStatement: ES6 for...of... loop statement.
 * 
 * 
 * 
 * 
 */

class Program {
  public type: string = 'Program'
  public sourceType: string = 'module'
  public body: Array<Object> = []
}

class Identifier {
  public type: string = 'Identifier'
  public name: string
  constructor (name: string) {
    this.name = name
  }
}

class NumericLiteral {
  public type: string = 'NumericLiteral'
  public extra: Object
  public value: number
  constructor (raw: string, rawValue: number, value: number) {
    this.extra = Object.create(null)
    this.extra['raw'] = raw
    this.extra['rawValue'] = rawValue
    this.value = value
  }
}

class StringLiteral {
  public type: string = 'StringLiteral'
  public extra: Object
  public value: string
  constructor (raw: string, rawValue: string, value: string) {
    this.extra = Object.create(null)
    this.extra['raw'] = raw
    this.extra['rawValue'] = rawValue
    this.value = value
  }
}

class TemplateElement {
  public type: string = 'TemplateElement'
  public value: Object
  public tail: boolean
  constructor (raw: string, cooked: string, tail: boolean) {
    this.value['raw'] = raw
    this.value['cooked'] = cooked
    this.tail = tail
  }
}

class TemplateStringLiteral {
  public type: string = 'TemplateStringLiteral'
  public expressions: Array<Identifier> = []
  public quasis: Array<TemplateElement> = []
}

class BooleanLiteral {
  public type: string = 'BooleanLiteral'
  public value: boolean
  constructor (value: boolean) {
    this.value = value
  }
}

class NullLiteral {
  public type: string = 'BooleanLiteral'
}

class Undefined {
  public type: string = 'undefined'
}

class NaN {
  public type: string = 'NaN'
}

class VariableDeclaration {
  public type: string = 'VariableDeclaration'
  public declarations: Array<VariableDeclarator> = []
  public kind: string
  constructor (kind: string) {
    this.kind = kind
  }
}

class VariableDeclarator {
  public type: string = 'VariableDeclarator'
  public identifier: Identifier
  public initValue: Identifier | NumericLiteral | StringLiteral | TemplateStringLiteral | BooleanLiteral | NullLiteral | Undefined
  constructor (name: string, value: Identifier | NumericLiteral | StringLiteral | TemplateStringLiteral | BooleanLiteral | NullLiteral | Undefined) {
    this.identifier = new Identifier(name)
    
  }
}

export {
  Token,
  KEYWORD
}