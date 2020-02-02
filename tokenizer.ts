import input from './input'

class Token {

  public value: string

  public type: string

  constructor (value: string, type: string) {

    this.value = value

    this.type = type

  }
}

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

const tokens: Array<Token> = []

function isReserved (word: string) {

  if (word[0] === '_' || word[0] === '$') {

    return new Token(word, 'identifier')

  } else {

    for (let item of KEYWORD) {

      if (item === word) {

        return new Token(word, 'keyword')

      }

    }

    return new Token(word, 'identifier')
  }
}

function tokenizer (input: string) {

  const length: number = input.length

  let index: number = 0

  while(index < length) {
    // 空格
    if (/\s/.test(input[index])) {
      index++
      continue
    }
    // 字母
    if (/[A-Za-z]/.test(input[index])) {
      // 记录内容
      let value: string = input[index]
      // 记录暂读到的位置的内容
      let temp: string = input[++index]
      // 循环记录读到的内容
      while (/[A-Za-z0-9_$]/.test(temp)) {
        // 记录内容
        value += temp
        // 指向下一个字符
        temp = input[++index]
      }
      // 确定该单词是否是关键字
      tokens.push(isReserved(value))
      continue
    }
    // 数字
    if (/[0-9]/.test(input[index])) {
      let value: string = input[index]
      let temp: string = input[++index]
      while(/[0-9.]/.test(temp)) {
        value += temp
        temp = input[++index]
      }
      tokens.push(new Token(value, 'constant'))
      continue
    }
    // 符号
    if (/[~`!$%^&*()-_+={}\[\]|\\:;"'<,>.?/]/.test(input[index])) {
      // 只能单独使用的符号
      if (/[~(){}\[\]?:;,]/.test(input[index])) {
        let value: string = input[index]
        index++
        tokens.push(new Token(value, 'punctuator'))
        continue
      }
      // 可以进行不同组合的符号
      if (/[!$%^&*-_+=|\\<>.]/.test(input[index])) {
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
            while (/[A-Za-z0-9_$]/.test(temp)) {
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
          while (/[A-Za-z0-9_$]/.test(temp)) {
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
          } else if (/[0-7]/.test(temp)) {
            value += temp
            temp = input[++index]
            if (/[0-7]/.test(temp)) {
              value += temp
              temp = input[++index]
              if (/[0-7]/.test(temp)) {
                value += temp
                index++
              } else {
                throw new Error(`Unexpected token: ${ value }`)
              }
            } else {
              throw new Error(`Unexpected token: ${ value }`)
            }
          } else if (temp === 'x') {
            if (/[0-9a-fA-F]/.test(temp)) {
              value += temp
              temp = input[++index]
              if (/[0-9a-fA-F]/.test(temp)) {
                value += temp
                index++
              } else {
                throw new Error(`Unexpected token: ${ value }`)
              }
            } else {
              throw new Error(`Unexpected token: ${ value }`)
            }
          }
          tokens.push(new Token(value, 'constant'))
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
            } else {
              throw new Error('Unexpected token: ..')
            }
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
      }
      // 组成字符串和注释的符号
      if (/[`"'/]/.test(input[index])) {
        let value: string = input[index]
        let temp: string = input[++index]
        if (value === '`') {

        }
        if (value === '"') {

        }
        if (value === '\'') {
          
        }
        if (value === '/') {
          if (temp === '/' || temp === '*' || temp === '=') {
            value += temp
            index++
          }
          tokens.push(new Token(value, 'punctuator'))
          continue
        }
      }
    }
  }
  console.log(tokens)
}

tokenizer(input)