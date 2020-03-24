import input from './input/input'
import tokenizer from './tokenizer/tokenizer'
import parser from './parser/parser'

import './index.css'

const tokens = tokenizer(input)

const ast = parser(tokens)

console.log(ast)