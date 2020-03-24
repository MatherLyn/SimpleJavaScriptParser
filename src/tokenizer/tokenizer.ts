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
 * Before the program starts to scan, we import a Token class from utilities module.
 * This class ensures that elements in the "tokens" array is an object like:
 * 
 * {
 *    value: ";",
 *    type: "punctuator"
 * }
 * 
 * View util.ts to learn more about Token class
 */
import { Token } from '../util/util'

/**
 * Use the reserved words to define words in the code while scanning.
 * If the current word is one of these word, make its type 'keyword'.
 */
import { KEYWORD } from '../util/util'

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
    const SPACE = /\s/
    // if the current word is a space, ignore it
    if (SPACE.test(input[index])) {
      index++
      continue
    }

    // 2. LETTER
    const LETTER = /[A-Za-z]/
    // if it begins with a letter, it may be a keyword or an identifier
    // we have to get the whole word
    if (LETTER.test(input[index])) {
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
    const NUMBER = /[0-9]/
    // if it begins with a number, it can be:
    //   3.1. an octal number (012, banned)
    //   3.2. a hexical number (0x12)
    //   3.3. a simple number (123)
    if (NUMBER.test(input[index])) {
      // store the value of the number
      let value: string = input[index]
      // store the current number
      let temp: string = input[++index]
      // 3.1 & 3.2
      if (value === '0') {
        if (temp === 'x' || temp === 'o') {
          // a hexical number
          value += temp
          temp = input[++index]
        } else {
          // octal literal is not allowed to use
          throw new Error('Octal literals are not allowed in strict mode.')
        }
        while (/[0-9A-Fa-f]/.test(temp) && index < length) {
          value += temp
          temp = input[++index]
        }
        // it can be an octal number or a hexical number
        tokens.push(new Token(value, 'number'))
        // end this term and begin to scan the next word
        continue
      } else {
        // begin to scan the number
        // record the dot
        let dot = false
        while (/[0-9.]/.test(temp) && index < length) {
          if (dot && temp === '.') {
            throw new Error(`Syntax Error: unexpected token "${ value }.".`)
          }
          if (temp === '.') {
            dot = true
          }
          value += temp
          temp = input[++index]
        }
        // it can be a number
        tokens.push(new Token(value, 'number'))
        // end this term and begin to scan the next word
        continue
      }
    }

    // 4. PUNCTUATOR
    const PUNCTUATOR = /[~`!$%^&*()-_+={}\[\]|\\:;"'<,>.?/]/
    // if it begins with a number, it can be:
    //   4.1. a single punctuator (;)
    const SINGLEPUNC = /[~(){}\[\]?:;,]/
    //   4.2. a complex punctuator with the follow punctuator (+=, ...)
    //   4.3. an hexical number (\x35)
    //   4.4. a float number (.123)
    //   4.5. an identifier (_abc)
    //   4.6. a comment (/* abc */, // abc)
    const COMPOSEPUNC = /[!$%^&*\-_+=|\\<>.]/
    //   4.7. a string ('abc', "abc", `abc`)
    const QUOTATIONMARK = /[`"'/]/
    if (PUNCTUATOR.test(input[index])) {
      // 4.1. single punctuator
      if (SINGLEPUNC.test(input[index])) {
        let value: string = input[index]
        index++
        tokens.push(new Token(value, 'punctuator'))
        continue
      }
      // 4.2 - 4.6
      if (COMPOSEPUNC.test(input[index])) {
        let value: string = input[index]
        let temp: string = input[++index]
        // ! , != , % , %= , ^ , ^= , & , &=
        if (value === '!' || value === '%' || value === '^' || value === '&') {
          if (temp === '=') {
            value += '='
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        // $ , ${}
        else if (value === '$') {
          if (temp === '{') {
            value += '{'
            tokens.push(new Token(value, 'punctuator'))
            index++
          } else {
            while (/[A-Za-z0-9_$]/.test(temp) && index < length) {
              value += temp
              temp = input[++index]
            }
            tokens.push(new Token(value, 'identifier'))
          }
          continue
        }
        // * , *= , ** , */
        else if (value === '*') {
          if (temp === '=' || temp === '*' || temp === '/') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        // - , -= , --
        else if (value === '-') {
          if (temp === '=' || temp === '-') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        // identifier
        else if (value === '_') {
          while (/[A-Za-z0-9_$]/.test(temp) && index < length) {
            // 记录内容
            value += temp
            // 指向下一个字符
            temp = input[++index]
          }
          tokens.push(new Token(value, 'identifier'))
        }
        // += , ++
        else if (value === '+') {
          if (temp === '=' || temp === '+') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        // = , == , === , =>
        else if (value === '=') {
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
        // | , |= , ||
        else if (value === '|') {
          if (temp === '=' || temp === '|') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        // \ , string , hex
        else if (value === '\\') {
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
        // < , <= , <<
        else if (value === '<') {
          if (temp === '=' || temp === '<') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        // > , >= , >> , >>>
        else if (value === '>') {
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
        // . , ... , float number
        else if (value === '.') {
          if (temp === '.') {
            if (input[++index] === '.') {
              value = '...'
            }
          } else if (/\d/.test(temp)) {
            value = '0' + temp
            temp = input[++index]
            while (/\d/.test(temp) && index < length) {
              value += temp
              temp = input[++index]
            }
            tokens.push(new Token(value, 'number'))
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
        throw new Error(`Syntax Error: unexpected token "${ value }".`)
      }
      // 4.7 / , string , comments
      if (QUOTATIONMARK.test(input[index])) {
        let value: string = input[index]
        let temp: string = input[++index]
        // / , /= , comments
        if (value === '/') {
          if (temp === '=') {
            value += temp
            index++
            tokens.push(new Token(value, 'punctuator'))
            continue
          } else if (temp === '/') {
            value = ''
            temp = input[++index]
            while (temp !== '\n' && index < length) {
              value += temp
              temp = input[++index]
            }
            tokens.push(new Token(value, 'comment-line'))
            continue
          } else if (temp === '*') {
            value = ''
            temp = input[++index]
            let end: string = input[++index]
            let flag: boolean = true
            if (end !== undefined) {
              while (index < length) {
                if (temp === '*' && end === '/') {
                  tokens.push(new Token(value, 'comment-block'))
                  flag = false
                  index++
                  break
                }
                value += temp
                temp = end
                end = input[++index]
              }
              if (flag) {
                throw new Error(`Syntax Error: comment block must have an end(*/).`)
              }
              continue
            } else {
              throw new Error(`Syntax Error: comment block must have an end(*/).`)
            }
          } else {
            // we try to scan the following words to judge if this is a regexp
            // so we define a symbol to retract index if this is not a regexp
            let tempIndex = index
            // begin to scan the following words
            while (temp !== '\n' && temp !== '/' && index < length) {
              value += temp
              temp = input[++index]
            }
            // if it ends with a /, it becomes a regexp
            if (temp === '/') {
              value += temp
              temp = input[++index]
              while (/[img]/.test(temp)) {
                value += temp
                temp = input[++index]
              }
              tokens.push(new Token(value, 'regexp'))
              continue
            } else {
              // it's just a normal /, so retract index
              index = tempIndex
              tokens.push(new Token('/', 'punctuator'))
              continue
            }
          }
        }
        // string
        else if (value === '`') {
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
        else if (value === '"') {
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
        else if (value === '\'') {
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

  document.getElementById('tokenizer').innerHTML =JSON.stringify(tokens)
  .replace(/^\[/, '<ul>[')
  .replace(/\]$/, '</li>]</ul>')
  .replace(/({"value")/g, '<li>&nbsp;&nbsp;&nbsp;&nbsp;{"value"')
  .replace(/(},)/g, '},</li>')

  document.getElementById('tokenizer').style.marginBottom = '40px'

  return tokens
}

export default tokenizer