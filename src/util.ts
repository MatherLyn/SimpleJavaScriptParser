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
 *   2. number
 *   3. string
 *   4. identifier
 *   5. punctuator
 *   6. regexp
 *   7. comment-line
 *   8. comment-block
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
 * · Program: The root of the AST. Every statement except itself is put in its "body"
 */
class Program {
  public type: string = 'Program'
  public sourceType: string = 'module'
  public body: Array<any> = []
  public comments: Array<CommentLine | CommentBlock> = []
}


/** 
 * · Identifier: A use of identifier.
 * 
 * · NumericLiteral: A wrap of some neccessary property of declaring a number.
 * 
 * · StringLiteral: A wrap of some neccessary property of declaring a string.
 * 
 * · TemplateElement: Strings devided by identifiers in template string.
 * 
 * · TemplateStringLiteral: A wrap of some neccessary property of declaring a template string.
 * 
 * · RegexpLiteral: A wrap of regular expression.
 * 
 * · BooleanLiteral: A wrap of some neccessary property of declaring a boolean.
 * 
 * · NullLiteral: A wrap of some neccessary property of declaring a null pointer.
 * 
 * · Undefined: An undefined.
 * 
 * · NaN: An NaN(not a number).
 */ 
class Identifier {
  public type: string = 'Identifier'
  public name: string
  constructor (name: string) {
    this.name = name
  }
}

class NumericLiteral {
  public type: string = 'NumericLiteral'
  public extra: Object = {
    raw: undefined,
    rawValue: undefined
  }
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
  public extra: Object = {
    raw: undefined,
    rawValue: undefined
  }
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

class RegexpLiteral {
  public type: string = 'RegexpLiteral'
  public pattern: string
  public flags: string
  public extra: Object = {
    raw: undefined,
    rawValue: undefined
  }
  public value: string
  constructor (raw: string, rawValue: string, value: string, pattern: string, flags: string) {
    this.extra = Object.create(null)
    this.extra['raw'] = raw
    this.extra['rawValue'] = rawValue
    this.value = value
    this.pattern = pattern
    this.flags = flags
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


/** 
 * · FunctionExpression: An anonymous function.
 * 
 * · ArrowFunctionExpression: ES6 "() => {}", a kind of anonymous function with "this" locked
 *    to its execution context.
 * 
 * · AwaitExpression: ES6 await in async function
 * 
 * · AssignmentExpression: An assignment expression.
 * 
 * · ArrayExpression: An anonymous array used for operation or judgment.
 * 
 * · UnaryExpression: An operation on one variable(or constant).
 * 
 * · BinaryExpression: An operation or relation on two variables(or constant). (a<b 二元表达式 关系表达式 > < !== ===)
 * 
 * · ConditionalExpression: An operation on three variables(or constant).(?:) (三元表达式)
 * 
 * · LogicalExpression: A logical judgement on two variables(or constant). (a || b逻辑表达式 || &&)
 * 
 * · ObjectExpression: An object literal declaration. (a = {})
 * 
 * · ObjectProperty: An object property literal declaration.
 * 
 * · UpdateExpression: An operation on a variable for updating itself. (++ --)
 * 
 * · CallExpression: A call on a function (调用 console.log()这种)
 * 
 * · MemberExpression: The name of a member of an object. (console.log没有括号)
 */
class FunctionExpression {
  public type: string = 'FunctionExpression'
  public identifier: Identifier
  public generator: boolean
  public async: boolean
  public params: Array<Identifier>
  public body: BlockStatement
  constructor (identifier: Identifier, generator: boolean, isAsync: boolean, params: Array<Identifier>, body: BlockStatement) {
    this.identifier = identifier
    this.generator = generator
    this.async = isAsync
    this.params = params
    this.body = body
  }
}

class ArrowFunctionExpression {
  public type: string = 'ArrowFunctionExpression'
  public identifier: Identifier
  public generator: boolean
  public async: boolean
  public params: Array<Identifier> = []
  public body: BlockStatement
  constructor (identifier: Identifier, generator: boolean, isAsync: boolean, body: BlockStatement) {
    this.identifier = identifier
    this.generator = generator
    this.async = isAsync
    this.body = body
  }
}

class AwaitExpression {
  public type: string = 'AwaitExpression'
}

class AssignmentExpression {
  public type: string = 'AssignmentExpression'
  public operator: string
  public left: any
  public right: any
  constructor (operator: string, left: any, right: any) {
    this.operator = operator
    this.left = left
    this.right = right
  }
}

class ArrayExpression {
  public type: string = 'ArrayExpression'
  public elements: Array<any> = []
}

class UnaryExpression {
  public type: string = 'UnaryExpression'
  public operator: string
  public argument: any
  constructor (operator: string, argument: any) {
    this.operator = operator
    this.argument = argument
  }
}

class BinaryExpression {
  public type: string = 'BinaryExpression'
  public left: any
  public operator: string
  public right: any
  constructor (left: any, operator: string, right: any) {
    this.left = left
    this.operator = operator
    this.right = right
  }
  
  
}

class ConditionalExpression {
  public type: string = 'ConditionalExpression'
  public test: any
  public consequent: any
  public alternate: any
  constructor (test: any, consequent: any, alternate: any) {
    this.test = test
    this.consequent = consequent
    this.alternate = alternate
  }
}

class LogicalExpression {
  public type: string = 'LogicalExpression'
  public left: any
  public operator: string
  public right: any
  constructor (left: any, operator: string, right: any) {
    this.left = left
    this.operator = operator
    this.right = right
  }
}

class ObjectExpression {
  public type: string = 'ObjectExpression'
  public properties: Array<ObjectProperty> = []
}

class ObjectProperty {
  public type: string = 'ObjectProperty'
  public method: boolean
  public key: any
  public value: any
  constructor (method: boolean, key: any, value: any) {
    this.method = method
    this.key = key
    this.value = value
  }
}

class UpdateExpression {
  public type: string = 'UpdateExpression'
  public operator: string
  public prefix: boolean
  public argument: Identifier
  constructor (operator: string, prefix: boolean, argument: Identifier) {
    this.operator = operator
    this.prefix = prefix
    this.argument = argument
  }
}

class CallExpression {
  public type: string = 'CallExpression'
  public callee: Identifier | MemberExpression
  constructor (callee: Identifier | MemberExpression) {
    this.callee = callee
  }
}

class MemberExpression {
  public type: string = 'MemberExpression'
  public object: Identifier
  public property: Identifier
  constructor (object: Identifier, property: Identifier) {
    this.object = object
    this.property = property
  }
}


/** 
 * · ExpressionStatement: A wrap of some expressions above. (表达式)
 * 
 * · BlockStatement: A wrap of some expressions by "{}".
 * 
 * · IfStatement: If statement.
 * 
 * · WhileStatement: While loop statement.
 * 
 * · ForStatement: For loop statement.
 * 
 * · ForInStatement: For...in loop statement.
 * 
 * · ForOfStatement: ES6 for...of... loop statement.
 * 
 * · BreakStatement: Break statement possibly exists in loop.
 * 
 * · ReturnStatement: Return statement at the end of the function.
 */
class ExpressionStatement {
  public type: string = 'ExpressionStatement'
  public expression: any
  constructor (expression: any) {
      this.expression = expression
  }
}

class BlockStatement {
  public type: string = 'BlockStatement'
  public body: Array<any> = []
  public directives: Array<any> = []
}

class IfStatement {
  public type: string = 'BlockStatement'
  public test: any
  public consequent: any
  constructor (test: any, consequent: any) {
    this.test = test
    this.consequent = consequent
  }
}

class WhileStatement {
  public type: string = 'WhileStatement'
  public test: any
  public body: any
  constructor (test: any, body: any) {
    this.test = test
    this.body = body
  }
}

class ForStatement {
  public type: string = 'ForStatement'
  public init: any
  public test: any
  public update: any
  public body: any
  constructor (init: any, test: any, update: any, body: any) {
    this.init = init
    this.test = test
    this.update = update
    this.body = body
  }
}

class ForInStatement {
  public type: string = 'ForInStatement'
  public left: any
  public right: any
  public body: any
  constructor (left: any, right: any, body: any) {
    this.left = left
    this.right = right
    this.body = body
  }
}

class ForOfStatement {
  public type: string = 'ForOfStatement'
  public await: boolean
  public left: any
  public right: any
  public body: any
  constructor (isAwait: boolean, left: any, right: any, body: any) {
    this.await = isAwait
    this.left = left
    this.right = right
    this.body = body
  }
}

class BreakStatement {
  public type: string = 'BreakStatement'
}

class ReturnStatement {
  public type: string = 'ReturnStatement'
  public argument: any
  constructor (argument: any) {
    this.argument = argument
  }
}

/** 
 * · VariableDeclaration: The full statement of a variable declaration.
 *    It's possible that there are more than one declarators in a declaration.(let a = 1, b = 2)
 * 
 * · VariableDeclarator: A declarator is one-to-one with a variable.
 *    It exists in an array called "declaration" in VariableDeclaration.
 * 
 * · FunctionDeclaration: The full statement of a function declaration.
 *    It's one-to-one with a function.
 * 
 * · ClassDeclaration: The full statement of an ES6 class declaration.
 *    It's one-to-one with a class.
 * 
 * · ClassBody: The body inside a class declared.
 * 
 * · ClassProperty: The properties of the class declared in the class body.
 * 
 * · ClassMethod: The methods of the class declared in the class body.
 * 
 * · CommentLine: The inline comment.
 * 
 * · CommentBlock: The block comment.
 */
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
  public initValue: any
  constructor (name: string, value: any) {
    this.identifier = new Identifier(name)
    this.initValue = value
  }
}

class FunctionDeclaration {
  public type: string = 'FunctionDeclaration'
  public identifier: Identifier
  public generator: boolean
  public async: boolean
  public params: Array<Identifier>
  public body: BlockStatement
  constructor (identifier: Identifier, generator: boolean, isAsync: boolean, params: Array<Identifier>, body: BlockStatement) {
    this.identifier = identifier
    this.generator = generator
    this.async = isAsync
    this.params = params
    this.body = body
  }
}

class ClassDeclaration {
  public type: string = 'ClassDeclaration'
  public identifier: Identifier
  public superClass: Identifier
  public body: ClassBody = new ClassBody()
}

class ClassBody {
  public type: string = 'ClassBody'
  public body: Array<ClassProperty | ClassMethod> = []
}

class ClassProperty {
  public type: string = 'ClassProperty'
  public static: boolean
  public key: any
  public value: any
  constructor (isStatic: boolean, key: any, value: any) {
    this.static = isStatic
    this.key = key
    this.value = value
  }
}

class ClassMethod {
  public type: string = 'ClassMethod'
  public static: boolean
  public kind: string
  public key: any
  public generator: boolean
  public async: boolean
  public params: Array<Identifier> = []
  public body: BlockStatement
  constructor (isStatic: boolean, kind: string, key: any, generator: boolean, isAsync: boolean, body: BlockStatement) {
    this.static = isStatic
    this.kind = kind
    this.key = key
    this.generator = generator
    this.async = isAsync
    this.body = body
  }
}

class CommentLine {
  public type: string = 'CommentLine'
  public value: string
  constructor (value: string) {
    this.value = value
  }
}

class CommentBlock {
  public type: string = 'CommentBlock'
  public value: string
  constructor (value: string) {
    this.value = value
  }
}

export {
  Token,
  KEYWORD,
  Program,
  Identifier,
  NumericLiteral,
  StringLiteral,
  TemplateElement,
  TemplateStringLiteral,
  BooleanLiteral,
  RegexpLiteral,
  NullLiteral,
  Undefined,
  NaN,
  FunctionExpression,
  ArrowFunctionExpression,
  AssignmentExpression,
  ArrayExpression,
  UnaryExpression,
  BinaryExpression,
  ConditionalExpression,
  LogicalExpression,
  ObjectExpression,
  ObjectProperty,
  UpdateExpression,
  CallExpression,
  MemberExpression,
  ExpressionStatement,
  BlockStatement,
  IfStatement,
  WhileStatement,
  ForStatement,
  ForInStatement,
  ForOfStatement,
  ReturnStatement,
  VariableDeclaration,
  VariableDeclarator,
  FunctionDeclaration,
  ClassDeclaration,
  ClassBody,
  ClassProperty,
  ClassMethod,
  CommentLine,
  CommentBlock
}