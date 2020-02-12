/**
 *                                                               
 *  ,-.----.                                                      
 *  \    /  \                                                     
 *  |   :    \                                                    
 *  |   |  .\ :            __  ,-.                        __  ,-. 
 *  .   :  |: |          ,' ,'/ /|  .--.--.             ,' ,'/ /| 
 *  |   |   \ : ,--.--.  '  | |' | /  /    '     ,---.  '  | |' | 
 *  |   : .   //       \ |  |   ,'|  :  /`./    /     \ |  |   ,' 
 *  ;   | |`-'.--.  .-. |'  :  /  |  :  ;_     /    /  |'  :  /   
 *  |   | ;    \__\/: . .|  | '    \  \    `. .    ' / ||  | '    
 *  :   ' |    ," .--.; |;  : |     `----.   \'   ;   /|;  : |    
 *  :   : :   /  /  ,.  ||  , ;    /  /`--'  /'   |  / ||  , ;    
 *  |   | :  ;  :   .'   \---'    '--'.     / |   :    | ---'     
 *  `---'.|  |  ,     .-./          `--'---'   \   \  /           
 *    `---`   `--`---'                          `----'            
 *
 */

import * as util from './util'

const Program = new util.Program()

function parser (tokens: Array<util.Token>) {
  const length: number = tokens.length
  let index: number = 0
  let context: number = 0
  
  function reduction () {
    const token = tokens[index]
    if (token.type === 'keyword') {
      if (token.value === 'function') {
        let current = tokens[++index]
        if (current.type === 'identifier') {
          // means this is a named function
          const identifier = new util.Identifier(current.value)
          current = tokens[++index]
          if (current.type === 'punctuator' && current.value === '(') {
            current = tokens[++index]
            const params = []
            while (current.type === 'identifier') {
              params.push(new util.Identifier(current.value))
              current = tokens[++index]
              if (current.value === ',') {
                current = tokens[++index]
                continue
              }
              if (current.value === ')') {
                current = tokens[++index]
                break
              }
              throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
            }
            const block = reduction()
            if (block instanceof util.BlockStatement) {
              if (!context) {
                return new util.FunctionDeclaration(identifier, false, false, params, block)
              }
              if (context > 0) {
                return new util.FunctionExpression(identifier, false, false, params, block)
              }
              throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
            } else {
              throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
            }
          } else {
            throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
          }
        } else if (current.type === 'punctuator') {
          // means this is an anonymous function or a generator
          if (current.value === '(') {
            // anonymous function
            current = tokens[++index]
            const params = []
            while (current.type === 'identifier') {
              params.push(new util.Identifier(current.value))
              current = tokens[++index]
              if (current.value === ',') {
                current = tokens[++index]
                continue
              }
              if (current.value === ')') {
                current = tokens[++index]
                break
              }
              throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
            }
            const block = reduction()
            if (block instanceof util.BlockStatement) {
              if (context > 0) {
                return new util.FunctionExpression(null, false, false, params, block)
              }
              throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
            } else {
              throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
            }
          } else if (current.value === '*') {
            // generator
            current = tokens[++index]
            if (current.type === 'identifier') {
              // named generator
              const identifier = new util.Identifier(current.value)
              current = tokens[++index]
              if (current.type === 'punctuator' && current.value === '(') {
                current = tokens[++index]
                const params = []
                while (current.type === 'identifier') {
                  params.push(new util.Identifier(current.value))
                  current = tokens[++index]
                  if (current.value === ',') {
                    current = tokens[++index]
                    continue
                  }
                  if (current.value === ')') {
                    current = tokens[++index]
                    break
                  }
                  throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
                }
                const block = reduction()
                if (block instanceof util.BlockStatement) {
                  if (!context) {
                    return new util.FunctionDeclaration(identifier, true, false, params, block)
                  }
                  if (context > 0) {
                    return new util.FunctionExpression(identifier, true, false, params, block)
                  }
                  throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
                } else {
                  throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
                }
              } else {
                throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
              }
            } else if (current.type === '(') {
              // anonymous generator
              current = tokens[++index]
              const params = []
              while (current.type === 'identifier') {
                params.push(new util.Identifier(current.value))
                current = tokens[++index]
                if (current.value === ',') {
                  current = tokens[++index]
                  continue
                }
                if (current.value === ')') {
                  current = tokens[++index]
                  break
                }
                throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
              }
              const block = reduction()
              if (block instanceof util.BlockStatement) {
                if (context > 0) {
                  return new util.FunctionExpression(null, true, false, params, block)
                }
                throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
              } else {
                throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
              }
            } else {
              throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
            }
          } else {
            throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
          }
        } else {
          throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
        }
      }
    }
    if (token.type === 'number') {
      
    }
    if (token.type === 'string') {
      
    }
    if (token.type === 'punctuator') {
      
    }
    if (token.type === 'identifier') {
      return new util.Identifier(token.value)
    }
    if (token.type === 'regexp') {
      const pattern = token.value.match(/\/(.*)\//)[0]
      const flags = token.value.match(/\/g?i?m?$/)[0].replace('/', '')
      index++
      return new util.RegexpLiteral(token.value, undefined, undefined, pattern, flags)
    }
    if (token.type === 'comment-line') {
      const commentLine = new util.CommentLine(token.value)
      Program.comments.push(new util.CommentLine(token.value))
      index++
      return commentLine
    }
    if (token.type === 'comment-block') {
      const commentBlock = new util.CommentBlock(token.value)
      Program.comments.push(commentBlock)
      index++
      return commentBlock
    }
  
    throw new Error('Uncaught Syntax Error: Invalid or unexpected token.')
  }

  document.getElementById('parser').innerHTML = `<div>${JSON.stringify(Program)}</div>`
  .replace(/{/g, '{<div>')
  .replace(/,/g, ',</div><div>')
  .replace(/}/g, '</div>}')
  .replace(/\[/g, '[<div>')
  .replace(/\]/g, '</div>]')

  return Program
}

export default parser

