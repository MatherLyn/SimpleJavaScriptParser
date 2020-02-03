/**
 * 
 *          ,----,                                                                                  
 *        ,/   .`|                                                                                  
 *      ,`   .'  :              ,-.                                                                 
 *    ;    ;     /          ,--/ /|                         ,--,                                    
 *  .'___,/    ,'  ,---.  ,--. :/ |                 ,---, ,--.'|          ,----,            __  ,-. 
 *  |    :     |  '   ,'\ :  : ' /              ,-+-. /  ||  |,         .'   .`|          ,' ,'/ /| 
 *  ;    |.';  ; /   /   ||  '  /      ,---.   ,--.'|'   |`--'_      .'   .'  .'   ,---.  '  | |' | 
 *  `----'  |  |.   ; ,. :'  |  :     /     \ |   |  ,"' |,' ,'|   ,---, '   ./   /     \ |  |   ,' 
 *      '   :  ;'   | |: :|  |   \   /    /  ||   | /  | |'  | |   ;   | .'  /   /    /  |'  :  /   
 *      |   |  ''   | .; :'  : |. \ .    ' / ||   | |  | ||  | :   `---' /  ;--,.    ' / ||  | '    
 *      '   :  ||   :    ||  | ' \ \'   ;   /||   | |  |/ '  : |__   /  /  / .`|'   ;   /|;  : |    
 *      ;   |.'  \   \  / '  : |--' '   |  / ||   | |--'  |  | '.'|./__;     .' '   |  / ||  , ;    
 *      '---'     `----'  ;  |,'    |   :    ||   |/      ;  :    ;;   |  .'    |   :    | ---'     
 *                        '--'       \   \  / '---'       |  ,   / `---'         \   \  /           
 *                                    `----'               ---`-'                 `----'            
 * 
 */ 


/**
 * Tokenizer scans and transfers JavaScript code ⬇️
 * 
 *   const a = 'Hello world.'
 * 
 * to token table ⬇️
 * 
 *   [
 *      Token { value: 'const', type: 'keyword' },
 *      Token { value: 'a', type: 'identifier' },
 *      Token { value: '=', type: 'punctuator' },
 *      Token { value: "'Hello world.'", type: 'string' }
 *   ]
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
 * If the current word is one of these word, make its type 'keyword'.
 */
const KEYWORD: Array<string> = [
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
]

/**
 * The token table, an array to store the scanned tokens.
 */
const tokens: Array<Token> = []

/**
 * A function to judge whether the current word is one of the reserved words.
 * @param word current word
 */
function isReserved (word: string) {
  // if the word begins with _ or $, it must be an identifier
  if (word[0] === '_' || word[0] === '$') {
    return new Token(word, 'identifier')
  } else {
    // scan the token table, if it is one of these reserved word, returns keyword
    for (let item of KEYWORD) {
      if (item === word) {
        return new Token(word, 'keyword')
      }
    }
    // the scan is over, and this function doesn't returns anything
    // it means it's not a reserved word
    return new Token(word, 'identifier')
  }
}

/**
 * The main function of tokenizer
 * @param input the input of JavaScript code
 */
function tokenizer (input: string) {
  // get the length of the input to end the loop
  const length: number = input.length
  // the current index
  let index: number = 0
  // begin to scan the code
  while(index < length) {
    // 1. SPACE
    // if the current word is a space, ignore it
    if (/\s/.test(input[index])) {
      index++
      continue
    }

    // 2. LETTER
    // if it begins with a letter, it may be a keyword or an identifier
    // we have to get the whole word
    if (/[A-Za-z]/.test(input[index])) {
      // store the value of the word
      let value: string = input[index]
      // store the current letter of this word
      let temp: string = input[++index]
      // begin to scan the word
      while (/[A-Za-z0-9_$]/.test(temp) && index < length) {
        value += temp
        temp = input[++index]
      }
      // judge whether the word is a reserved word
      tokens.push(isReserved(value))
      // here, we have already get a whole word
      // we have to end this term, and begin to scan the next word
      continue
    }

    // 3. NUMBER
    // if it begins with a number, it can be:
    //   3.1. a simple number (123)
    //   3.2. an octal number (012)
    //   3.3. a hexical number (0x12)
    if (/[0-9]/.test(input[index])) {
      // store the value of the number
      let value: string = input[index]
      // store the current number
      let temp: string = input[++index]
      // begin to scan the number
      while (/[0-9.]/.test(temp) && index < length) {
        value += temp
        temp = input[++index]
      }
      // it can be a number
      tokens.push(new Token(value, 'number'))
      // end this term and begin to scan the next word
      continue
    }

    // 4. PUNCTUATOR
    // if it begins with a number, it can be:
    //   4.1. a single punctuator (;)
    //   4.2. a complex punctuator with the follow punctuator (+=, ...)
    //   4.3. a negative number (-123)
    //   4.4. an hexical number (\x35)
    //   4.5. an identifier (_abc)
    //   4.6. a comment (/* abc */, // abc)
    //   4.7. a string ('abc', "abc", `abc`)
    if (/[~`!$%^&*()-_+={}\[\]|\\:;"'<,>.?/]/.test(input[index])) {
      // 4.1. single punctuator
      if (/[~(){}\[\]?:;,]/.test(input[index])) {
        let value: string = input[index]
        index++
        tokens.push(new Token(value, 'punctuator'))
        continue
      }
      // 4.2 - 4.6
      if (/[!$%^&*\-_+=|\\<>.]/.test(input[index])) {
        let value: string = input[index]
        let temp: string = input[++index]
        if (value === '!' || value === '%' || value === '^' || value === '&') {
          if (temp === '=') {
            value += '='
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        if (value === '$') {
          if (temp === '{') {
            value += '{'
            tokens.push(new Token(value, 'punctuator'))
          } else {
            while (/[A-Za-z0-9_$]/.test(temp) && index < length) {
              // 记录内容
              value += temp
              // 指向下一个字符
              temp = input[++index]
            }
            tokens.push(new Token(value, 'identifier'))
          }
          continue
        }
        if (value === '*') {
          if (temp === '=' || temp === '*' || temp === '/') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        if (value === '-') {
          if (temp === '=' || temp === '-') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        if (value === '_') {
          while (/[A-Za-z0-9_$]/.test(temp) && index < length) {
            // 记录内容
            value += temp
            // 指向下一个字符
            temp = input[++index]
          }
          tokens.push(new Token(value, 'identifier'))
        }
        if (value === '+') {
          if (temp === '=' || temp === '+') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        if (value === '=') {
          if (temp === '=') {
            value += temp
            temp = input[++index]
            if (temp === '=') {
              value += temp
              index++
            }
          } else if (temp === '>') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        if (value === '|') {
          if (temp === '=' || temp === '|') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
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
            value += temp
            index++
            tokens.push(new Token(value, 'string'))
            continue
          } else if (temp === 'x') {
            while (/[0-9a-fA-F]/.test(temp) && index < length) {
              value += temp
              temp = input[++index]
            }
            tokens.push(new Token(value, 'number'))
            continue
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        if (value === '<') {
          if (temp === '=' || temp === '<') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        if (value === '>') {
          if (temp === '=') {
            value += temp
            index++
          } else if (temp === '>') {
            temp = input[++index]
            if (temp === '>') {
              value += temp
              index++
            }
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        if (value === '.') {
          if (temp === '.') {
            if (input[++index] === '.') {
              value = '...'
            }
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        throw new Error(`Syntax Error: unexpected token "${ value }".`)
      }
      // 4.7 a string
      if (/[`"'/]/.test(input[index])) {
        let value: string = input[index]
        let temp: string = input[++index]
        // 正则、注释、除号
        if (value === '/') {
          if (temp === '=') {
            value += temp
            index++
            tokens.push(new Token(value, 'punctuator'))
            continue
          }
          if (temp === '/') {
            value = ''
            temp = input[++index]
            while (temp !== '\n' && index < length) {
              value += temp
              temp = input[++index]
            }
            tokens.push(new Token(value, 'comments'))
            continue
          }
          if (temp === '*') {
            value = ''
            temp = input[++index]
            let end: string = input[++index]
            let flag: boolean = true
            if (end !== undefined) {
              while (index < length) {
                if (temp === '*' && end === '/') {
                  tokens.push(new Token(value.trim(), 'comments'))
                  flag = false
                  index++
                  break
                }
                value += temp
                temp = end
                end = input[++index]
              }
              if (flag) {
                throw new Error(`Syntax Error: cross line comments must have an end(*/).`)
              }
              continue
            } else {
              throw new Error(`Syntax Error: cross line comments must have an end(*/).`)
            }
          }
          tokens.push(new Token(value, 'punctuator'))
        }
        // 字符串
        if (value === '`') {
          while (temp !== '`' && index < length) {
            value += temp
            temp = input[++index]
          }
          if (temp === '`') {
            value += temp
            index++
            tokens.push(new Token(value, 'string'))
            continue
          }
        }
        if (value === '"') {
          while (temp !== '"' && index < length) {
            if (temp === '\n') {
              throw new Error(`Syntax Error: unexpected token "${ value }".`)
            }
            value += temp
            temp = input[++index]
          }
          if (temp === '"') {
            value += temp
            index++
            tokens.push(new Token(value, 'string'))
            continue
          }
        }
        if (value === '\'') {
          while (temp !== '\'' && index < length) {
            if (temp === '\n') {
              throw new Error(`Syntax Error: unexpected token "${ value }".`)
            }
            value += temp
            temp = input[++index]
          }
          if (temp === '\'') {
            value += temp
            index++
            tokens.push(new Token(value, 'string'))
            continue
          }
        }
        throw new Error(`Syntax Error: unexpected token "${ value }".`)
      }
    }
  }
  console.log(tokens)
  return tokens
}

export default tokenizer