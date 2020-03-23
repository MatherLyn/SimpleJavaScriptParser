import './index.css'
import input from './input'
import tokenizer from './tokenizer'
import parser from './parser'

const tokens = tokenizer(input)

const ast = parser(tokens)

// import util from './util'
// const a: Array<typeof util.Token> = []
// console.log(a)