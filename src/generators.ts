import * as util from "./util"

function generateVariableDeclaration (container: Array<any>, current: number, tokens: Array<util.Token>, kind: string) {
  const variableDeclaration: util.VariableDeclaration = new util.VariableDeclaration(kind)
  container.push(variableDeclaration)
  current++
  const len: number = tokens.length
  if (current < len) {
    // it must be an identifier
    let next: any = tokens[current]
    const isId: boolean = next.type === 'identifier'
    if (isId) {
      return generateVariableDeclarator(variableDeclaration.declarations, current, tokens)
    }
  }
  throw new SyntaxError('Unexpected token found in a variable declarator.')
}

function generateVariableDeclarator (container: Array<util.VariableDeclarator>, current: number, tokens: Array<util.Token>) {
  const len: number = tokens.length
  if (current < len) {
    let next: util.Token = tokens[current++]
    const isId: boolean = next.type === 'identifier'
    // if current token refers to an identifier
    if (isId) {
      const name: string = next.value
      // check if next token refers to an equal or a comma
      next = tokens[current++]
      if (current < len && next.type === 'punctuator' && next.value === '=') {
        next = tokens[current++]
        const variableDeclarator: util.VariableDeclarator = new util.VariableDeclarator(name, next.value)
        container.push(variableDeclarator)
        next = tokens[current++]
        if (current < len && next.type === 'punctuator' && next.value === ',') {
          return generateVariableDeclarator(container, current, tokens)
        } else {
          return current
        }
      } else if (current < len && next.type === 'punctuator' && next.value === ',') {
        const variableDeclarator: util.VariableDeclarator = new util.VariableDeclarator(name, undefined)
        container.push(variableDeclarator)
        current++
        return generateVariableDeclarator(container, current, tokens)
      } else {
        const variableDeclarator: util.VariableDeclarator = new util.VariableDeclarator(name, null)
        container.push(variableDeclarator)
        return ++current
      }
    }
    throw new SyntaxError('Unexpected token found in a variable declarator.')
  } else {
    return current
  }
}

export {
  generateVariableDeclaration,
  generateVariableDeclarator
}

