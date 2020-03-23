import input from './input'
import tokenizer from './tokenizer'
import parser from './parser'

const tokens = tokenizer(input)

const ast = parser(tokens)